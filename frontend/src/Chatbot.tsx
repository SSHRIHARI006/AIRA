import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { sendChatQuery } from './lib/api'; // <-- ensure this path matches your project structure

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm AIRAC, your advanced AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Wrapper that calls the shared client and handles aborts/errors
  async function getBotResponse(userText: string) {
    // Cancel any previous in-flight request
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const data = await sendChatQuery(userText, ac.signal); // returns { response: string }
      return data;
    } finally {
      // clear controller if it's still the same one
      if (abortRef.current === ac) abortRef.current = null;
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setErrorBanner(null);
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call the API wrapper (will use mock if VITE_USE_MOCK is set)
      const result = await getBotResponse(userMessage.text);
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: result.response ?? "No response",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorBanner(
        err?.message ? `Error: ${err.message}` : "Network error — could not reach AIRAC."
      );
      const errMsg: Message = {
        id: Date.now() + 2,
        text: "⚠️ Error: failed to fetch response.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      {/* Chat Window */}
      <div className="w-full max-w-4xl h-[90vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <header className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 px-6 py-3 shadow-lg">
          <div className="flex items-center justify-start">
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-green-400 bg-clip-text text-transparent hover:from-blue-300 hover:via-cyan-200 hover:to-green-300 transition-all duration-500 cursor-default tracking-wider drop-shadow-lg relative">
              AIRA
            </h1>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex flex-col h-[calc(100%-4rem)] px-4 py-6">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 scroll-smooth pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 animate-fade-in ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
                      : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 rounded-bl-sm border border-gray-600'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.isUser ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.isUser && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3 justify-start animate-fade-in">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4 text-white animate-bounce" />
                </div>
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg border border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-400 rounded-full" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl hover:border-gray-600 hover:shadow-blue-500/20 transition-all duration-300">
            <form onSubmit={handleSendMessage} className="flex items-center p-4">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message to AIRA..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm hover:placeholder-gray-300 transition-colors duration-300"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="ml-3 p-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 disabled:cursor-not-allowed group active:scale-95"
              >
                <Send className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </form>
          </div>

          {errorBanner && (
            <div className="mt-3 px-4 py-2 bg-red-900/40 text-red-200 rounded-md text-sm">
              {errorBanner}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
