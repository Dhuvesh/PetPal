import { create } from "zustand"
import toast from "react-hot-toast"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"

export const useChatStore = create((set, get) => ({
  // State
  chats: [],
  activeChat: null,
  messages: [],
  isLoadingChats: false,
  isLoadingMessages: false,
  isSendingMessage: false,

  // Actions
  setActiveChat: (chat) => set({ activeChat: chat }),

  clearActiveChat: () => set({ activeChat: null, messages: [] }),

  // Fetch user's chats
  fetchUserChats: async (userEmail) => {
    if (!userEmail) return

    set({ isLoadingChats: true })
    try {
      console.log("Fetching chats for user:", userEmail)
      const response = await fetch(`${BASE_URL}/api/chat/user-chats?email=${encodeURIComponent(userEmail)}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch chats")
      }

      const data = await response.json()
      console.log("Fetched chats:", data.length)
      set({ chats: data })
    } catch (error) {
      console.error("Error fetching chats:", error)
      toast.error("Failed to load chats")
    } finally {
      set({ isLoadingChats: false })
    }
  },

  // Fetch messages for a specific chat
  fetchChatMessages: async (chatId, userEmail) => {
    if (!chatId || !userEmail) return

    set({ isLoadingMessages: true })
    try {
      console.log("Fetching messages for chat:", chatId)
      const response = await fetch(`${BASE_URL}/api/chat/messages/${chatId}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch messages")
      }

      const data = await response.json()
      set({ messages: data.messages || [] })

      // Mark messages as read
      await get().markMessagesAsRead(chatId, userEmail)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to load messages")
      set({ messages: [] })
    } finally {
      set({ isLoadingMessages: false })
    }
  },

  // Send a new message
  sendMessage: async (chatId, content, senderEmail, senderName) => {
    if (!chatId || !content.trim() || !senderEmail || !senderName) return false

    set({ isSendingMessage: true })
    try {
      console.log("Sending message to chat:", chatId)
      const response = await fetch(`${BASE_URL}/api/chat/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          content: content.trim(),
          senderEmail,
          senderName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to send message")
      }

      const newMessage = await response.json()

      // Add message to current messages
      set((state) => ({
        messages: [...state.messages, newMessage],
      }))

      // Update the chat's last message in the chat list
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: {
                  content: content.trim(),
                  timestamp: newMessage.timestamp,
                },
              }
            : chat,
        ),
      }))

      return true
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
      return false
    } finally {
      set({ isSendingMessage: false })
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (chatId, userEmail) => {
    if (!chatId || !userEmail) return

    try {
      const response = await fetch(`${BASE_URL}/api/chat/mark-read/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
        }),
      })

      if (response.ok) {
        // Update unread count in chat list
        set((state) => ({
          chats: state.chats.map((chat) => (chat._id === chatId ? { ...chat, unreadCount: 0 } : chat)),
        }))
      }
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  },

  // Get chat by adoption ID
  getChatByAdoption: async (adoptionId, userEmail) => {
    if (!adoptionId || !userEmail) return null

    try {
      console.log("Looking for chat by adoption:", adoptionId, "for user:", userEmail)
      const response = await fetch(
        `${BASE_URL}/api/chat/by-adoption/${adoptionId}?userEmail=${encodeURIComponent(userEmail)}`,
      )

      if (!response.ok) {
        if (response.status === 404) {
          console.log("Chat not found for adoption:", adoptionId)
          return null
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch chat")
      }

      const chat = await response.json()
      console.log("Chat found for adoption:", adoptionId)
      return chat
    } catch (error) {
      console.error("Error fetching chat by adoption:", error)
      return null
    }
  },

  // Update chat in the list (useful for real-time updates)
  updateChatInList: (chatId, updates) => {
    set((state) => ({
      chats: state.chats.map((chat) => (chat._id === chatId ? { ...chat, ...updates } : chat)),
    }))
  },

  // Add new message to current chat (useful for real-time updates)
  addMessageToCurrentChat: (message) => {
    const { activeChat } = get()
    if (activeChat && message.chatId === activeChat._id) {
      set((state) => ({
        messages: [...state.messages, message],
      }))
    }
  },

  // Refresh chat list (useful after adoption approval)
  refreshChats: async (userEmail) => {
    await get().fetchUserChats(userEmail)
  },
}))
