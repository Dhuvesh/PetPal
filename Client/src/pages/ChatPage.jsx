import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ArrowLeft, User, Clock, CheckCircle2, X } from 'lucide-react';
import { useAuthStore } from '../store/UseAuthStore';

// Mock auth store hook (replace with your actual implementation)
// const useAuthStore = () => ({
//   authUser: {
//     email: 'buyer@example.com',
//     fullName: 'John Doe'
//   }
// });


const ChatSystem = () => {
  const { authUser } = useAuthStore();
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const BASE_URL = 'http://localhost:3000';

  // Fetch user's chats on component mount
  useEffect(() => {
    if (authUser?.email) {
      fetchUserChats();
    }
  }, [authUser]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUserChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/chat/user-chats?email=${authUser.email}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/chat/messages/${chatId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
      
      // Mark messages as read
      await markMessagesAsRead(chatId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (chatId) => {
    try {
      await fetch(`${BASE_URL}/api/chat/mark-read/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: authUser.email
        })
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat || sendingMessage) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      const response = await fetch(`${BASE_URL}/api/chat/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: activeChat._id,
          content: messageContent,
          senderEmail: authUser.email,
          senderName: authUser.fullName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMsg = await response.json();
      setMessages(prev => [...prev, newMsg]);
      
      // Update the chat's last message in the chat list
      setChats(prev => prev.map(chat => 
        chat._id === activeChat._id 
          ? { ...chat, lastMessage: { content: messageContent, timestamp: newMsg.timestamp } }
          : chat
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSendingMessage(false);
    }
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    fetchChatMessages(chat._id);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Please log in to access chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto pt-20">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex">
        {/* Chat List Sidebar */}
        <div className={`w-full md:w-1/3 border-r border-gray-200 ${activeChat ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Messages
            </h2>
          </div>
          
          <div className="overflow-y-auto h-full">
            {loading && chats.length === 0 ? (
              <div className="p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 mb-2 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No active chats</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Chats will appear here when your adoption requests are approved
                  </p>
                </div>
              </div>
            ) : (
              chats.map((chat) => {
                const otherUser = chat.userRole === 'buyer' ? chat.seller : chat.buyer;
                const isActive = activeChat?._id === chat._id;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                      isActive ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {otherUser.name}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {chat.petId?.name} • {chat.userRole === 'buyer' ? 'You are adopting' : 'Your pet'}
                        </p>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${activeChat ? 'block' : 'hidden md:flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden mr-3 p-1 hover:bg-gray-200 rounded"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                  {(activeChat.userRole === 'buyer' ? activeChat.seller : activeChat.buyer).name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {(activeChat.userRole === 'buyer' ? activeChat.seller : activeChat.buyer).name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Regarding {activeChat.petId?.name}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isCurrentUser = message.senderEmail === authUser.email;
                    const showDate = index === 0 || 
                      formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                    
                    return (
                      <div key={message._id}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isCurrentUser 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <div className={`flex items-center justify-end mt-1 space-x-1 ${
                              isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">{formatTime(message.timestamp)}</span>
                              {isCurrentUser && message.read && (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows="1"
                    disabled={sendingMessage}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !newMessage.trim() || sendingMessage
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Messages</h3>
                <p className="text-gray-500">
                  Select a chat to start messaging about pet adoptions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;