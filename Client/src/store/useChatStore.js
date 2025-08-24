import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./UseAuthStore";

const API_URL = import.meta.env.VITE_API_URL;
let socket;

export const useChatStore = create((set, get) => ({
    // State
    socket: null,
    chats: [],
    activeChat: null,
    messages: [],
    isLoadingChats: false,
    isLoadingMessages: false,
    unreadNotifications: 0,
    recentMessages: [],

    // Actions
    initializeSocket: () => {
        // Prevent multiple initializations
        if (get().socket || !useAuthStore.getState().authUser) return;

        console.log("Initializing socket connection...");
        socket = io(API_URL);

        socket.on('connect', () => {
            console.log("Socket connected:", socket.id);
            set({ socket });
            // Fetch user chats right after connecting
            get().fetchUserChats(useAuthStore.getState().authUser.email);
        });

        socket.on('disconnect', () => {
            console.log("Socket disconnected");
            set({ socket: null });
        });

        socket.on('receive_message', (newMessage) => {
            const { activeChat } = get();
            const authUser = useAuthStore.getState().authUser;
            if (!authUser || newMessage.senderEmail === authUser.email) return;

            const isChatActive = activeChat?._id === newMessage.chatId;

            set((state) => {
                const chatToUpdate = state.chats.find(c => c._id === newMessage.chatId);

                if (!chatToUpdate) {
                    get().fetchUserChats(authUser.email);
                    return {};
                }

                const updatedChat = {
                    ...chatToUpdate,
                    lastMessage: {
                        content: newMessage.content,
                        timestamp: newMessage.timestamp,
                        sender: newMessage.sender
                    },
                    unreadCount: !isChatActive ? (chatToUpdate.unreadCount || 0) + 1 : chatToUpdate.unreadCount,
                };

                const otherChats = state.chats.filter(c => c._id !== newMessage.chatId);
                const newChats = [updatedChat, ...otherChats];

                let newRecentMessages = [...state.recentMessages];
                let newUnreadNotifications = state.unreadNotifications;

                if (!isChatActive) {
                    const messageNotification = {
                        id: newMessage._id || Date.now(),
                        chatId: newMessage.chatId,
                        senderName: newMessage.senderName || 'Unknown',
                        content: newMessage.content,
                        timestamp: newMessage.timestamp,
                        petName: chatToUpdate.petId?.name || 'Pet'
                    };
                    newRecentMessages = [messageNotification, ...newRecentMessages.slice(0, 4)];
                    newUnreadNotifications += 1;

                    toast.success(`New message from ${newMessage.senderName}`, {
                        duration: 4000,
                        position: 'top-right',
                        style: { background: '#10B981', color: 'white' },
                        icon: '💬',
                    });
                }

                return {
                    chats: newChats,
                    unreadNotifications: newUnreadNotifications,
                    recentMessages: newRecentMessages
                };
            });

            if (isChatActive) {
                set((state) => ({ messages: [...state.messages, newMessage] }));
                get().markMessagesAsRead(newMessage.chatId, authUser.email);
            }
        });
        
        socket.on('messages_read', ({ chatId, readerEmail }) => {
            const authUser = useAuthStore.getState().authUser;
            if (!authUser || readerEmail === authUser.email) return;

            if (get().activeChat?._id === chatId) {
                set(state => ({
                    messages: state.messages.map(msg =>
                        msg.senderEmail === authUser.email ? { ...msg, read: true } : msg
                    )
                }));
            }
        });
    },

    disconnectSocket: () => {
        if (get().socket) {
            console.log("Disconnecting socket...");
            get().socket.disconnect();
            set({ socket: null, chats: [], messages: [], activeChat: null, unreadNotifications: 0, recentMessages: [] });
        }
    },
    
    setActiveChat: (chat) => {
        const currentActiveChat = get().activeChat;
        if (socket) {
            if (currentActiveChat) socket.emit('leave_room', currentActiveChat._id);
            socket.emit('join_room', chat._id);
        }
        set((state) => ({
            activeChat: chat,
            recentMessages: state.recentMessages.filter(msg => msg.chatId !== chat._id),
            unreadNotifications: Math.max(0, state.unreadNotifications - (chat.unreadCount || 0))
        }));
    },

    clearActiveChat: () => {
        const currentActiveChat = get().activeChat;
        if (socket && currentActiveChat) {
            socket.emit('leave_room', currentActiveChat._id);
        }
        set({ activeChat: null, messages: [] });
    },

    clearNotifications: () => set({ unreadNotifications: 0, recentMessages: [] }),

    markNotificationAsRead: (messageId) => {
        set((state) => ({
            recentMessages: state.recentMessages.filter(msg => msg.id !== messageId),
            unreadNotifications: Math.max(0, state.unreadNotifications - 1)
        }));
    },
    
    // --- MODIFIED fetchUserChats ---
    fetchUserChats: async (userEmail) => {
        if (!userEmail) return;
        set({ isLoadingChats: true });
        try {
            const response = await fetch(`${API_URL}/api/chat/user-chats?email=${encodeURIComponent(userEmail)}`);
            if (!response.ok) throw new Error("Failed to fetch chats");
            const data = await response.json();
            set({ chats: data });

            // *** CRUCIAL FIX ***
            // After fetching chats, join all their rooms to receive notifications
            if (socket && data.length > 0) {
                const chatIds = data.map(chat => chat._id);
                socket.emit('join_all_rooms', chatIds);
            }
        } catch (error) {
            toast.error("Failed to load chats");
        } finally {
            set({ isLoadingChats: false });
        }
    },

    fetchChatMessages: async (chatId, userEmail) => {
        if (!chatId || !userEmail) return;
        set({ isLoadingMessages: true });
        try {
            const response = await fetch(`${API_URL}/api/chat/messages/${chatId}`);
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            set({ messages: data.messages || [] });
            await get().markMessagesAsRead(chatId, userEmail);
        } catch (error) {
            toast.error("Failed to load messages");
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    sendMessage: async (chatId, content, senderEmail, senderName) => {
        if (!chatId || !content.trim()) return;

        const tempId = `temp_${Date.now()}`;
        const sentMessage = {
            _id: tempId,
            chatId,
            content: content.trim(),
            senderEmail,
            senderName,
            sender: get().activeChat.userRole,
            timestamp: new Date().toISOString(),
            read: false,
        };

        set((state) => {
            const updatedMessages = [...state.messages, sentMessage];
            const chatToUpdate = state.chats.find(c => c._id === chatId);
            let updatedChats = state.chats;

            if (chatToUpdate) {
                const updatedChat = {
                    ...chatToUpdate,
                    lastMessage: {
                        content: sentMessage.content,
                        timestamp: sentMessage.timestamp,
                        sender: sentMessage.sender
                    }
                };
                const otherChats = state.chats.filter(c => c._id !== chatId);
                updatedChats = [updatedChat, ...otherChats];
            }
            
            return { messages: updatedMessages, chats: updatedChats };
        });

        try {
            const response = await fetch(`${API_URL}/api/chat/send-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId, content, senderEmail, senderName }),
            });
            if (!response.ok) throw new Error("Failed to send message");
            const actualMessage = await response.json();
            set(state => ({
                messages: state.messages.map(msg => msg._id === tempId ? actualMessage : msg),
            }));
        } catch (error) {
            toast.error("Failed to send message");
            set(state => ({
                messages: state.messages.filter(msg => msg._id !== tempId)
            }));
        }
    },
    
    markMessagesAsRead: async (chatId, userEmail) => {
        if (!chatId || !userEmail) return;
        try {
            set((state) => ({
                chats: state.chats.map((chat) =>
                    chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
                ),
            }));
            await fetch(`${API_URL}/api/chat/mark-read/${chatId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail }),
            });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    },

    getChatByAdoption: async (adoptionId, userEmail) => {
        if (!adoptionId || !userEmail) return null;
        try {
            const response = await fetch(`${API_URL}/api/chat/by-adoption/${adoptionId}?userEmail=${encodeURIComponent(userEmail)}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error("Failed to fetch chat by adoption");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching chat by adoption:", error);
            return null;
        }
    },
}));