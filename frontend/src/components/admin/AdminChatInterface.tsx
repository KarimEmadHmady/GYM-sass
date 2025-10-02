'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { messageService } from '@/services';
import { userService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import type { Message } from '@/types';
import type { User } from '@/types/models';
import { 
  Send,
  MoreVertical,
  Phone,
  Video,
  Search,
  ArrowLeft,
  CheckCheck,
  X,
  Users
} from 'lucide-react';

// نوع المحادثة
interface Conversation {
  user1: User;
  user2: User;
  lastMessage?: Message;
  unreadCount: number;
}

const AdminChatInterface = () => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showConversationsList, setShowConversationsList] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show conversations list on desktop by default, on mobile show it first
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setShowConversationsList(true);
      } else {
        // على الموبايل، اعرض قائمة المحادثات إذا لم يتم اختيار محادثة بعد
        setShowConversationsList(!selectedConversation);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [messagesData, usersData] = await Promise.all([
        messageService.getAllMessages(),
        userService.getAll()
      ]);
      setMessages(messagesData);
      setUsers(Array.isArray(usersData.data) ? usersData.data as User[] : Array.isArray(usersData) ? usersData as User[] : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // تجميع كل المحادثات (كل اثنين بينهم رسائل)
  const conversations = useMemo(() => {
    const pairs = new Map<string, Conversation>();
    
    messages.forEach(msg => {
      const user1 = users.find(u => u._id === msg.fromUserId);
      const user2 = users.find(u => u._id === msg.userId);
      
      if (!user1 || !user2) return;
      
      const pairKey = [msg.fromUserId, msg.userId].sort().join('-');
      
      if (!pairs.has(pairKey)) {
        pairs.set(pairKey, {
          user1,
          user2,
          lastMessage: msg,
          unreadCount: 0
        });
      } else {
        const existing = pairs.get(pairKey)!;
        if (new Date(msg.date) > new Date(existing.lastMessage?.date || 0)) {
          existing.lastMessage = msg;
        }
      }
    });
    
    // حساب عدد الرسائل غير المقروءة لكل محادثة
    pairs.forEach((conversation, pairKey) => {
      const [userId1, userId2] = pairKey.split('-');
      const unreadCount = messages.filter(m => 
        ((m.fromUserId === userId1 && m.userId === userId2) || 
         (m.fromUserId === userId2 && m.userId === userId1)) && 
        !m.read
      ).length;
      conversation.unreadCount = unreadCount;
    });
    
    return Array.from(pairs.values()).sort((a, b) => 
      new Date(b.lastMessage?.date || 0).getTime() - new Date(a.lastMessage?.date || 0).getTime()
    );
  }, [messages, users]);

  // رسائل المحادثة المختارة
  const conversationMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return messages.filter(
      m =>
        (m.fromUserId === selectedConversation.user1._id && m.userId === selectedConversation.user2._id) ||
        (m.fromUserId === selectedConversation.user2._id && m.userId === selectedConversation.user1._id)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [messages, selectedConversation]);

  // إرسال رسالة جديدة
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || !currentUser) return;
    
    try {
      setSending(true);
      const messageData = {
        message: newMessage,
        content: newMessage,
        subject: 'رسالة من الأدمن',
        userId: selectedConversation.user1._id === (currentUser as any)._id ? selectedConversation.user2._id : selectedConversation.user1._id,
        fromUserId: (currentUser as any)._id || (currentUser as any).id
      };
      
      await messageService.createMessage(messageData);
      setNewMessage('');
      loadData(); // إعادة تحميل البيانات لتحديث الرسائل
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إرسال الرسالة');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: string | Date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'اليوم';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    } else {
      return messageDate.toLocaleDateString('ar-EG');
    }
  };

  const isMyMessage = (message: Message) => {
    // في عرض الأدمن، الرسائل من الشخص الأول (user1) تظهر على اليمين
    // والرسائل من الشخص الثاني (user2) تظهر على الشمال
    if (selectedConversation) {
      return message.fromUserId === selectedConversation.user1._id;
    }
    return message.fromUserId === (currentUser as any)?._id || message.fromUserId === (currentUser as any)?.id;
  };

  const getMessageStatus = (message: Message) => {
    if (isMyMessage(message)) {
      return (
        <CheckCheck className="w-4 h-4" style={{ color: message.read ? '#22c55e' : '#9ca3af' }} />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={loadData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">لا يوجد محادثات</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[400px] md:h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
      {/* قائمة المحادثات */}
      <div className={`${showConversationsList ? 'w-full md:w-80 h-1/2 md:h-full' : 'w-0 h-0'} transition-all duration-300 overflow-hidden border-r md:border-r border-b md:border-b-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 ${showConversationsList ? 'block md:relative' : 'hidden'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">المحادثات ({conversations.length})</h3>
          <button
            onClick={() => setShowConversationsList(false)}
            className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation, idx) => (
            <div
              key={conversation.user1._id + '-' + conversation.user2._id}
              onClick={() => {
                setSelectedConversation(conversation);
                // على الموبايل، اخفِ قائمة المحادثات بعد الاختيار
                if (window.innerWidth < 768) {
                  setShowConversationsList(false);
                }
              }}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                selectedConversation && 
                ((selectedConversation.user1._id === conversation.user1._id && selectedConversation.user2._id === conversation.user2._id) ||
                 (selectedConversation.user1._id === conversation.user2._id && selectedConversation.user2._id === conversation.user1._id))
                ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                    {conversation.user1.name?.charAt(0)}
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                    {conversation.user2.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-xs md:text-sm truncate">
                      {conversation.user1.name} &amp; {conversation.user2.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {conversation.lastMessage?.message || 'لا توجد رسائل'}
                    </p>
                  </div>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* منطقة الشات */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-2 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => {
                    setShowConversationsList(true);
                    setSelectedConversation(null); // إلغاء اختيار المحادثة للعودة إلى القائمة
                  }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors md:hidden"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                
                <button
                  onClick={() => setShowConversationsList(!showConversationsList)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors hidden md:block"
                >
                  {showConversationsList ? (
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                  {selectedConversation.user1.name?.charAt(0)}
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                  {selectedConversation.user2.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">
                    {selectedConversation.user1.name} &amp; {selectedConversation.user2.name}
                  </h3>
                  <p className="text-xs md:text-sm text-green-500">محادثة</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2">
                <button className="p-1 md:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-1 md:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <Video className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-1 md:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div 
              ref={chatContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-2 md:p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f3f4f6" fill-opacity="0.1"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
            >
              {conversationMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    ابدأ محادثة بين {selectedConversation.user1.name} و {selectedConversation.user2.name}
                  </p>
                </div>
              ) : (
                conversationMessages.map((message, index) => {
                  const showDate = index === 0 || 
                    formatDate(conversationMessages[index - 1].date) !== formatDate(message.date);
                  
                  return (
                    <div key={message._id}>
                      {/* Date Separator */}
                      {showDate && (
                        <div className="flex justify-center mb-4">
                          <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-500 dark:text-gray-400 shadow-sm">
                            {formatDate(message.date)}
                          </span>
                        </div>
                      )}
                      
                      {/* Message Bubble */}
                      <div className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm cursor-pointer group relative ${
                          isMyMessage(message)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                        }`}>
                          {/* Message Content */}
                          <div className="break-words">
                            {message.subject && message.subject !== 'رسالة من الأدمن' && (
                              <div className={`font-semibold text-sm mb-1 ${
                                isMyMessage(message) ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {message.subject}
                              </div>
                            )}
                            <p className="text-sm">{message.content || message.message}</p>
                          </div>
                          
                          {/* Message Time and Status */}
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            isMyMessage(message) ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            <span className="text-xs">{formatTime(message.date)}</span>
                            {getMessageStatus(message)}
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
            <div className="p-2 md:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="اكتب رسالة..."
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-sm md:text-base"
                    disabled={sending}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">اختر محادثة لعرض الرسائل</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatInterface;
