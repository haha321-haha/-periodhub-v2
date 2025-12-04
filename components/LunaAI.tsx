import React, { useState, useEffect, useRef } from "react";
import { X, Send, ChevronRight } from "lucide-react";
import { trackEvent } from "../utils/analytics";
import { processLunaQuery } from "../utils/lunaEngine";

interface Message {
  sender: "luna" | "user";
  text: string;
  links?: { label: string; url: string }[];
  timestamp: number;
}

const LunaAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [holidayMode, setHolidayMode] = useState<{
    icon: string;
    message: string;
  } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Initialize Holiday Mode & Welcome Message
  useEffect(() => {
    const checkHoliday = () => {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      if (month === 2 && day === 14) {
        setHolidayMode({
          icon: "💝",
          message: "Happy Valentine's Day! Love yourself! 💕",
        });
      } else if (month === 3 && day === 8) {
        setHolidayMode({ icon: "👩‍⚕️", message: "Happy Women's Day! 🌸" });
      }
    };
    checkHoliday();
  }, []);

  // Set initial welcome message
  useEffect(() => {
    const welcomeText = holidayMode
      ? `${holidayMode.message} I'm Luna. How can I help?`
      : "Hi! I'm Luna 💜 I can help you navigate the app or answer questions about your cycle.";

    setMessages([
      {
        sender: "luna",
        text: welcomeText,
        timestamp: Date.now(),
      },
    ]);
  }, [holidayMode]);

  const triggerEmojiRain = React.useCallback(() => {
    if (typeof window === "undefined" || !document.body) return;

    const emojis = [
      "💜",
      "🌟",
      "💕",
      "✨",
      "🌸",
      "🌙",
      holidayMode?.icon,
    ].filter(Boolean);
    const container = document.body;
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("div");
      el.innerText = emojis[Math.floor(Math.random() * emojis.length)]!;
      el.className = "emoji-rain";
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(el);
      setTimeout(() => {
        if (container.contains(el)) container.removeChild(el);
      }, 4000);
    }
  }, [holidayMode]);

  // Easter Egg System
  useEffect(() => {
    let keyPressCount = 0;
    let lastKeyPressTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastKeyPressTime > 2000) keyPressCount = 0;

      if (e.key.toLowerCase() === "l") {
        keyPressCount++;
        lastKeyPressTime = currentTime;
        if (keyPressCount === 3) {
          triggerEmojiRain();
          trackEvent("luna_easter_egg_triggered");
          keyPressCount = 0;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [triggerEmojiRain]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");

    // Add User Message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, timestamp: Date.now() },
    ]);
    setIsTyping(true);
    trackEvent("luna_query", { query: userText });

    // Simulate AI Delay
    setTimeout(() => {
      const response = processLunaQuery(userText);

      setMessages((prev) => [
        ...prev,
        {
          sender: "luna",
          text: response.text,
          links: response.links,
          timestamp: Date.now(),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-purple-100 w-80 sm:w-96 h-[500px] flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
        role="dialog"
        aria-label="Luna Assistant Chat"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl" role="img" aria-label="Luna Icon">
              {holidayMode?.icon || "🌙"}
            </span>
            <div>
              <h3 className="font-bold leading-none">Luna AI</h3>
              <span className="text-xs text-purple-100 opacity-90">
                Always here to help
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                {msg.links && (
                  <div className="mt-3 space-y-1">
                    {msg.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        className={`block text-xs font-bold py-1 px-2 rounded transition-colors flex items-center justify-between ${
                          msg.sender === "user"
                            ? "bg-white/20 hover:bg-white/30 text-white"
                            : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                        }`}
                        onClick={(e) => {
                          if (link.url.startsWith("#")) {
                            e.preventDefault();
                            // Handle anchor links / tool opening
                            const element = document.querySelector(link.url);
                            if (element)
                              element.scrollIntoView({ behavior: "smooth" });
                            // If it's a tool modal trigger, dispatch event or rely on parent context (simplification: just scroll for now or assume link triggers handled elsewhere)
                            // For MVP, simple anchor linking is fine.
                            setIsOpen(false);
                          }
                        }}
                      >
                        {link.label} <ChevronRight size={12} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-3 shadow-sm">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-gray-100 shrink-0"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-1 p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-90"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-[10px] text-gray-400 text-center mt-2">
            Not medical advice. For emergencies, call your doctor.
          </div>
        </form>
      </div>

      {/* Floating Orb (Trigger) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform duration-300 animate-float group focus:outline-none focus:ring-4 focus:ring-purple-300"
        aria-label={isOpen ? "Close chat" : "Open Luna AI"}
      >
        <div className="relative">
          <span
            className={`text-3xl transition-all duration-300 ${
              isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
            role="img"
            aria-label="Moon icon"
          >
            {holidayMode?.icon || "🌙"}
          </span>
          <X
            className={`text-white w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
          )}
        </div>
      </button>
    </div>
  );
};

export default LunaAI;
