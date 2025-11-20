import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X } from 'lucide-react';

const LunaAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const messages = [
    "How can I help you today? 💜",
    "Track your symptoms for insights! 📊",
    "Remember to log your mood today! 🌟",
    "You're doing great! Keep going! 💪",
  ];

  // P1: Easter Egg System ('L' pressed 3 times)
  useEffect(() => {
    let keyPressCount = 0;
    let lastKeyPressTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      // Reset if more than 2 seconds passed
      if (currentTime - lastKeyPressTime > 2000) {
        keyPressCount = 0;
      }

      if (e.key.toLowerCase() === 'l') {
        keyPressCount++;
        lastKeyPressTime = currentTime;

        if (keyPressCount === 3) {
          triggerEmojiRain();
          keyPressCount = 0;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerEmojiRain = () => {
    const emojis = ['💜', '🌟', '💕', '✨', '🌸', '🌙'];
    const container = document.body;
    
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      el.className = 'emoji-rain';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(el);
      
      // Cleanup
      setTimeout(() => {
        if (container.contains(el)) container.removeChild(el);
      }, 4000);
    }
  };

  const handleInteraction = useCallback(() => {
    if (!isOpen) {
        setIsOpen(true);
        // Simulate typing effect
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessageIndex(prev => (prev + 1) % messages.length);
        }, 1000);
        
        // Tracking (Mock)
        console.log("Event: luna_click");
    } else {
        setIsOpen(false);
    }
  }, [isOpen, messages.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Bubble */}
      <div 
        className={`bg-white p-4 rounded-2xl rounded-br-none shadow-xl border border-purple-100 max-w-[250px] transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}
        role="dialog"
        aria-label="Luna Assistant Chat"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-purple-600">Luna AI 🌙</span>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close chat"
          >
            <X size={14} />
          </button>
        </div>
        
        {isTyping ? (
           <div className="flex gap-1 p-1">
             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
           </div>
        ) : (
          <p className="text-sm text-gray-700">{messages[messageIndex]}</p>
        )}
      </div>

      {/* Floating Orb */}
      <button
        onClick={handleInteraction}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform duration-300 animate-float group focus:outline-none focus:ring-4 focus:ring-purple-300"
        aria-label="Open Luna AI Assistant"
        aria-expanded={isOpen}
      >
        <div className="relative">
            <span className="text-3xl group-hover:hidden transition-all">🌙</span>
            <MessageCircle className="text-white w-8 h-8 hidden group-hover:block transition-all" />
            {/* Status Dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
      </button>
    </div>
  );
};

export default LunaAI;