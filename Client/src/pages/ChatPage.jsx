import React, { useState, useEffect, useRef } from 'react';
import { 
    MessageSquare, Send, ArrowLeft, CheckCircle2, Search, Bell, X, ChevronRight, User
} from 'lucide-react';
import { useAuthStore } from '../store/UseAuthStore';
import { useChatStore } from '../store/useChatStore';

const ChatSystem = () => {
    const { authUser } = useAuthStore();
    const messagesEndRef = useRef(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    const {
        chats,
        activeChat,
        messages,
        isLoadingChats,
        isLoadingMessages,
        unreadNotifications,
        recentMessages,
        fetchUserChats, // No longer need initializeSocket here
        fetchChatMessages,
        setActiveChat,
        clearActiveChat,
        sendMessage,
        clearNotifications,
        markNotificationAsRead,
    } = useChatStore();

    // --- MODIFIED: This useEffect no longer manages the socket connection ---
    // It just ensures chats are loaded when the component mounts or user changes.
    useEffect(() => {
        if (authUser?.email && chats.length === 0) {
            fetchUserChats(authUser.email);
        }
    }, [authUser, fetchUserChats, chats.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChat]);

    const handleChatSelect = (chat) => {
        setActiveChat(chat);
        fetchChatMessages(chat._id, authUser.email);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeChat) return;
        sendMessage(activeChat._id, newMessage.trim(), authUser.email, authUser.fullName);
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const filteredChats = chats.filter(chat => {
        const otherUser = chat.userRole === 'buyer' ? chat.seller : chat.buyer;
        return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (chat.petId?.name && chat.petId.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    const handleNotificationClick = (notification) => {
        const chat = chats.find(c => c._id === notification.chatId);
        if (chat) {
            handleChatSelect(chat);
            markNotificationAsRead(notification.id);
            setShowNotifications(false);
        }
    };
    
    if (!authUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 pt-20">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <User className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
                    <p className="text-gray-600">Please log in to access your messages.</p>
                </div>
            </div>
        );
    }
    // ... rest of the ChatSystem component remains the same
    return (
        <div className="font-sans antialiased bg-gray-50 h-screen pt-[68px] box-border">
            {/* Notification Panel */}
            {showNotifications && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="w-full max-w-md bg-white shadow-xl h-full overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Messages</h3>
                            <div className="flex items-center gap-2">
                                {unreadNotifications > 0 && (
                                    <button 
                                        onClick={clearNotifications}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowNotifications(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            {recentMessages.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <p className="text-gray-500">No recent messages</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentMessages.map((notification) => (
                                        <div 
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {notification.senderName}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(notification.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                About: {notification.petName}
                                            </p>
                                            <p className="text-sm text-gray-800 truncate">
                                                {notification.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Chat Container */}
            <div className="w-full mx-auto h-full bg-white shadow-2xl flex overflow-hidden relative">
                
                {/* Notification Bell - Fixed Position */}
                {!activeChat && unreadNotifications > 0 && (
                    <button 
                        onClick={() => setShowNotifications(true)}
                        className="fixed top-24 right-6 z-40 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                    >
                        <Bell className="h-6 w-6" />
                        {unreadNotifications > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                {unreadNotifications > 9 ? '9+' : unreadNotifications}
                            </span>
                        )}
                    </button>
                )}

                {/* Sidebar */}
                <aside className={`
                    w-full md:w-[340px] flex flex-col border-r border-gray-200 bg-white
                    transition-all duration-300 ease-in-out
                    ${activeChat ? 'hidden md:flex' : 'flex'}
                `}>
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                            {unreadNotifications > 0 && (
                                <button 
                                    onClick={() => setShowNotifications(true)}
                                    className="relative p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                    </span>
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {isLoadingChats ? (
                            <div className="p-4 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-3 animate-pulse">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredChats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                                <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                                <h3 className="text-lg font-semibold">No chats found</h3>
                                <p className="text-sm">Your approved adoption chats will appear here.</p>
                            </div>
                        ) : (
                            <nav className="p-2 space-y-1">
                                {filteredChats.map((chat) => {
                                    const otherUser = chat.userRole === 'buyer' ? chat.seller : chat.buyer;
                                    const isActive = activeChat?._id === chat._id;
                                    
                                    return (
                                        <button
                                            key={chat._id}
                                            onClick={() => handleChatSelect(chat)}
                                            className={`
                                                w-full flex items-center p-3 rounded-lg text-left transition-all duration-200
                                                ${isActive ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100'}
                                            `}
                                        >
                                            <div className="relative mr-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                                    {otherUser.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="absolute bottom-0 right-0 block h-3 w-3 bg-green-400 border-2 border-white rounded-full"></span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <p className={`font-semibold truncate ${isActive ? 'text-white' : 'text-gray-800'}`}>
                                                        {otherUser.name}
                                                    </p>
                                                    {chat.lastMessage && (
                                                      <p className={`text-xs ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
                                                          {formatTime(chat.lastMessage.timestamp)}
                                                      </p>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-start">
                                                  <p className={`text-sm truncate pr-2 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {chat.lastMessage ? chat.lastMessage.content : `About ${chat.petId?.name}`}
                                                  </p>
                                                  {chat.unreadCount > 0 && !isActive && (
                                                      <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5 mt-1 animate-pulse">
                                                          {chat.unreadCount}
                                                      </span>
                                                  )}
                                                </div>
                                            </div>
                                            <ChevronRight className={`ml-2 h-5 w-5 transition-transform ${isActive ? 'text-blue-200' : 'text-gray-300'}`} />
                                        </button>
                                    );
                                })}
                            </nav>
                        )}
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300 ease-in-out ${activeChat ? 'flex' : 'hidden md:flex'}`}>
                    {activeChat ? (
                        <>
                            <header className="p-4 bg-white border-b border-gray-200 flex items-center shadow-sm z-10">
                                <button onClick={() => clearActiveChat()} className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-100">
                                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </button>
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-4">
                                    {(activeChat.userRole === 'buyer' ? activeChat.seller : activeChat.buyer).name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        {(activeChat.userRole === 'buyer' ? activeChat.seller : activeChat.buyer).name}
                                    </h2>
                                    <p className="text-sm text-green-600 flex items-center">
                                      <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
                                      Online
                                    </p>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                {isLoadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    messages.map((message, index) => {
                                        const isCurrentUser = message.senderEmail === authUser.email;
                                        const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                                        
                                        return (
                                            <React.Fragment key={message._id || `msg-${index}`}>
                                                {showDate && (
                                                    <div className="text-center my-4">
                                                        <span className="bg-white text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                                            {formatDate(message.timestamp)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-white text-gray-800 rounded-bl-lg shadow-sm'}`}>
                                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                                        <div className={`flex items-center justify-end mt-1.5 space-x-1.5 ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
                                                            <span className="text-xs">{formatTime(message.timestamp)}</span>
                                                            {isCurrentUser && (
                                                                message.read 
                                                                    ? <CheckCircle2 className="h-3.5 w-3.5 text-blue-300" />
                                                                    : <CheckCircle2 className="h-3.5 w-3.5 text-blue-200 opacity-50" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <footer className="p-4 bg-white border-t border-gray-200">
                                <div className="flex items-center bg-gray-100 rounded-lg p-2">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-800 focus:outline-none resize-none"
                                        rows="1"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className={`p-3 rounded-lg transition-all duration-200 ${
                                            newMessage.trim()
                                                ? 'bg-blue-500 text-white hover:bg-blue-600 scale-105'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                              <MessageSquare className="w-12 h-12 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Your Messages</h2>
                            <p className="text-gray-500 max-w-sm">Select a conversation from the sidebar to start chatting about pet adoptions.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ChatSystem;