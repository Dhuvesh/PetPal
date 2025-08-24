import React, { useEffect, useState } from 'react';
import { Bell, X, MessageCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../store/UseAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ className = '' }) => {
    const { authUser } = useAuthStore();
    const navigate = useNavigate();
    const {
        unreadNotifications,
        recentMessages,
        setActiveChat,
        fetchChatMessages,
        clearNotifications,
        markNotificationAsRead,
        chats,
        initializeSocket
    } = useChatStore();

    const [isOpen, setIsOpen] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);

    useEffect(() => {
        if (authUser?.email) {
            initializeSocket();
        }
    }, [authUser, initializeSocket]);

    useEffect(() => {
        if (unreadNotifications > 0) {
            setHasNewNotification(true);
            // Auto-hide the "new" indicator after 3 seconds
            const timer = setTimeout(() => setHasNewNotification(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [unreadNotifications]);

    const handleNotificationClick = async (notification) => {
        const chat = chats.find(c => c._id === notification.chatId);
        if (chat) {
            // Set active chat and fetch messages
            setActiveChat(chat);
            await fetchChatMessages(chat._id, authUser.email);
            
            // Navigate to chat page
            navigate('/chat');
            
            // Mark notification as read
            markNotificationAsRead(notification.id);
            setIsOpen(false);
        }
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - messageTime) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return messageTime.toLocaleDateString();
    };

    if (!authUser) return null;

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-lg transition-all duration-200 ${
                    unreadNotifications > 0 
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                        : 'text-gray-600 hover:bg-gray-100'
                } ${hasNewNotification ? 'animate-pulse' : ''}`}
            >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">
                                Messages
                                {unreadNotifications > 0 && (
                                    <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2">
                                {unreadNotifications > 0 && (
                                    <button
                                        onClick={() => {
                                            clearNotifications();
                                            setIsOpen(false);
                                        }}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {recentMessages.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                    <p className="font-medium">No new messages</p>
                                    <p className="text-sm">You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="py-2">
                                    {recentMessages.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {notification.senderName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-gray-900 text-sm truncate">
                                                            {notification.senderName}
                                                        </p>
                                                        <div className="flex items-center text-gray-400 text-xs">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            {formatTime(notification.timestamp)}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-blue-600 mb-1 font-medium">
                                                        About: {notification.petName}
                                                    </p>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {notification.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {recentMessages.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={() => {
                                        navigate('/chat');
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    View All Messages
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationDropdown;