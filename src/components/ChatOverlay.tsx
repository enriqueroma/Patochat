import { useState, useEffect, useRef } from "react";
import { Send, X, MessageSquare } from "lucide-react";
import { CharacterId, Message, RoomConfig } from "../types";
import { DuckIcon } from "./DuckIcon";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ChatOverlayProps {
  characterId: CharacterId;
  config: RoomConfig;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onlineUsers: CharacterId[];
}

export function ChatOverlay({ characterId, config, messages, onSendMessage, onlineUsers }: ChatOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const myChar = config.characters.find(c => c.id === characterId)!;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.from !== characterId) {
        setHasNewMessage(true);
      }
    }
  }, [messages.length, isOpen, characterId]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 h-[450px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className={cn("p-4 flex items-center justify-between text-white", myChar.bg)}>
              <div className="flex items-center gap-3">
                <DuckIcon color="white" size={24} />
                <div>
                  <div className="font-bold leading-none">{myChar.name}</div>
                  <div className="text-[10px] opacity-80 mt-1">
                    {onlineUsers.length} patitos en línea
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                  <MessageSquare size={40} className="mb-2 opacity-20" />
                  <p className="text-sm italic">No hay mensajes todavía. ¡Sé el primero en saludar!</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMe = msg.from === characterId;
                const msgChar = config.characters.find(c => c.id === msg.from);
                if (!msgChar) return null;

                return (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      isMe ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className="flex items-center gap-1 mb-1 px-1">
                      <span className={cn("text-[10px] font-bold", msgChar.text)}>
                        {msgChar.name}
                      </span>
                      <span className="text-[8px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={cn(
                      "px-3 py-2 rounded-2xl text-sm shadow-sm",
                      isMe 
                        ? cn("text-white rounded-tr-none", myChar.bg) 
                        : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className={cn(
                    "p-2 rounded-xl text-white transition-all active:scale-95 disabled:opacity-50 disabled:scale-100",
                    myChar.bg
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
              <button
                onClick={() => onSendMessage("🦆 ¡QUACK!")}
                className="w-full py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 text-[10px] font-black rounded-lg border border-yellow-200 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span>¡Enviar Quack!</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button (The "System Tray" Icon) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewMessage(false);
        }}
        className={cn(
          "pointer-events-auto w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 active:scale-90 group relative",
          isOpen ? "bg-slate-800 rotate-90" : cn("bg-white border-4", myChar.border)
        )}
      >
        {isOpen ? (
          <X className="text-white" size={32} />
        ) : (
          <div className="relative">
            <DuckIcon color={myChar.color} size={40} />
            <AnimatePresence>
              {hasNewMessage && (
                <motion.span 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    opacity: 1 
                  }}
                  transition={{
                    duration: 0.4,
                    times: [0, 0.6, 1],
                    ease: "easeOut"
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 z-10"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white shadow-sm"></span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-20 bg-slate-800 text-white text-xs py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
            Chat de {myChar.name}
          </div>
        )}
      </button>
    </div>
  );
}
