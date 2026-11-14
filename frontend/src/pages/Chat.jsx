import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import Loader from '../components/common/Loader';
import {
  MessageSquare,
  Send,
  Users,
  Radio,
  Hash,
  Sparkles,
  Shield,
  Smile,
} from 'lucide-react';

export default function Chat() {
  const { user, isAdmin } = useAuth();
  const { socket, onlineCount } = useSocket();
  const [channel, setChannel] = useState('general');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  const channels = [
    { id: 'general', name: 'General Lounge', desc: 'All residents & community chit-chat' },
    { id: 'announcements', name: 'Warden Desk', desc: 'Queries related to hostel guidelines' },
    { id: 'helpdesk', name: 'Emergency Help', desc: 'Urgent requests and support' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChannelMessages = async (ch) => {
    setLoading(true);
    try {
      const res = await api.get(`/chat/${ch}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelMessages(channel);

    if (socket) {
      socket.emit('join_channel', channel);
    }

    return () => {
      if (socket) {
        socket.emit('leave_channel', channel);
      }
    };
  }, [channel, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      if (msg.channel === channel) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = ({ user: typer }) => {
      setTypingUser(typer);
    };

    const handleStopTyping = () => {
      setTypingUser(null);
    };

    socket.on('receive_message', handleReceive);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);

    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
    };
  }, [socket, channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  const handleTypingInput = (e) => {
    setText(e.target.value);
    if (socket) {
      socket.emit('typing', { channel, user: user?.name });
      setTimeout(() => {
        socket.emit('stop_typing', { channel });
      }, 2000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const messageData = {
      senderId: user._id,
      message: text.trim(),
      channel,
    };

    if (socket && socket.connected) {
      socket.emit('send_message', messageData);
    } else {
      // Fallback HTTP
      api.post('/chat', messageData).then((res) => {
        if (res.data.success) {
          setMessages((prev) => [...prev, res.data.message]);
        }
      });
    }

    setText('');
    if (socket) socket.emit('stop_typing', { channel });
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-md overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-600" /> Channels
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {onlineCount} Online
            </span>
          </div>

          <div className="space-y-1.5 mt-4">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setChannel(ch.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                  channel === ch.id
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Hash className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{ch.name}</p>
                  <p
                    className={`text-[10px] mt-0.5 truncate max-w-[170px] ${
                      channel === ch.id ? 'text-primary-100' : 'text-slate-400'
                    }`}
                  >
                    {ch.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-600 dark:text-slate-300">Live WebSockets</p>
          <p>Instant duplex messaging</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary-600" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white capitalize">
                {channel} Channel
              </h4>
              <p className="text-[11px] text-slate-400">
                Connected in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <Loader text="Syncing message history..." />
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No messages yet in #{channel}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Be the first to say hello!
              </p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isMe = m.sender?._id === user?._id;
              const isSenderAdmin = m.sender?.role === 'admin' || m.sender?.role === 'warden';

              return (
                <div
                  key={m._id || idx}
                  className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-sm ${
                      isSenderAdmin
                        ? 'bg-purple-600'
                        : isMe
                        ? 'bg-primary-600'
                        : 'bg-indigo-500'
                    }`}
                  >
                    {m.sender?.name ? m.sender.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div className={`max-w-[75%] sm:max-w-md ${isMe ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {isMe ? 'You' : m.sender?.name || 'Resident'}
                      </span>
                      {isSenderAdmin && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          Warden
                        </span>
                      )}
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-primary-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700/70 text-slate-900 dark:text-white rounded-tl-none'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {typingUser && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span>{typingUser} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3.5 border-t border-slate-100 dark:border-slate-700/80 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50"
        >
          <input
            type="text"
            value={text}
            onChange={handleTypingInput}
            placeholder={`Message #${channel}...`}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white transition-all shadow-md shadow-primary-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

