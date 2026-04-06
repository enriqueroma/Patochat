/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { CharacterId, Message, RoomConfig } from "./types";
import { CharacterSelector } from "./components/CharacterSelector";
import { ChatOverlay } from "./components/ChatOverlay";
import { SetupScreen } from "./components/SetupScreen";

export default function App() {
  const [characterId, setCharacterId] = useState<CharacterId | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<CharacterId[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomConfig, setRoomConfig] = useState<RoomConfig | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Quack Sound Notification
  const playQuack = useCallback(() => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const quack = (time: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, time);
      osc.frequency.exponentialRampToValueAtTime(200, time + 0.1);
      
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(time);
      osc.stop(time + 0.1);
    };

    // Double quack
    quack(audioCtx.currentTime);
    quack(audioCtx.currentTime + 0.15);
  }, []);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("room_config", (config: RoomConfig) => {
      setRoomConfig(config);
    });

    newSocket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      // Only quack if message is from someone else
      // We'll check this in the message handler once we have characterId
    });

    newSocket.on("user_list", (users: CharacterId[]) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Separate effect for message quacking to avoid stale closures
  useEffect(() => {
    if (!socket || !characterId) return;

    const handleMsg = (msg: Message) => {
      if (msg.from !== characterId) {
        playQuack();
      }
    };

    socket.on("message", handleMsg);
    return () => {
      socket.off("message", handleMsg);
    };
  }, [socket, characterId, playQuack]);

  useEffect(() => {
    if (socket && characterId) {
      socket.emit("join", characterId);
    }
  }, [socket, characterId]);

  const handleSendMessage = (text: string) => {
    if (socket && characterId) {
      const message: Message = {
        id: Math.random().toString(36).substring(7),
        from: characterId,
        text,
        timestamp: Date.now(),
      };
      socket.emit("message", message);
    }
  };

  const handleSaveConfig = (newConfig: RoomConfig) => {
    if (socket) {
      socket.emit("update_config", newConfig);
      setIsSetupOpen(false);
    }
  };

  if (!roomConfig) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-bounce text-yellow-500 text-4xl font-black">Cargando la casa...</div>
      </div>
    );
  }

  if (isSetupOpen) {
    return (
      <SetupScreen 
        config={roomConfig} 
        onSave={handleSaveConfig} 
        onCancel={() => setIsSetupOpen(false)} 
      />
    );
  }

  if (!characterId) {
    return (
      <CharacterSelector 
        config={roomConfig}
        onSelect={setCharacterId} 
        onOpenSetup={() => setIsSetupOpen(true)}
        onlineUsers={onlineUsers}
      />
    );
  }

  const myChar = roomConfig.characters.find(c => c.id === characterId);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        {roomConfig.characters.map((char, i) => (
          <div 
            key={char.id}
            className="absolute rounded-full blur-3xl"
            style={{
              backgroundColor: char.color,
              width: '300px',
              height: '300px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2
            }}
          />
        ))}
      </div>

      <div className="z-10 text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-black text-slate-800 tracking-tight">
          PatoChat <span className="text-yellow-500">Overlay</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Bienvenido, <span className="font-bold text-slate-800">{myChar?.name}</span>. 
          El chat está activo. Haz clic en tu patito abajo para hablar.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {roomConfig.characters.map((char) => {
            const isOnline = onlineUsers.includes(char.id);
            return (
              <div 
                key={char.id}
                className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 transition-all ${
                  isOnline ? 'bg-white border-green-500 text-green-700' : 'bg-slate-200 border-slate-300 text-slate-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className="font-bold">{char.name}</span>
                <span className="text-xs">{isOnline ? 'En línea' : 'Fuera'}</span>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => setCharacterId(null)}
          className="mt-8 text-sm text-slate-400 hover:text-slate-600 underline underline-offset-4"
        >
          Cambiar de personaje
        </button>
      </div>

      <ChatOverlay 
        characterId={characterId} 
        config={roomConfig}
        messages={messages} 
        onSendMessage={handleSendMessage}
        onlineUsers={onlineUsers}
      />
    </div>
  );
}

