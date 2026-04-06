import { CharacterId, RoomConfig } from "../types";
import { DuckIcon } from "./DuckIcon";
import { Settings } from "lucide-react";

interface CharacterSelectorProps {
  config: RoomConfig;
  onSelect: (id: CharacterId) => void;
  onOpenSetup: () => void;
  onlineUsers: CharacterId[];
}

export function CharacterSelector({ config, onSelect, onOpenSetup, onlineUsers }: CharacterSelectorProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl max-w-md w-full text-center space-y-8 relative border-8 border-slate-100">
        <button 
          onClick={onOpenSetup}
          className="absolute top-8 right-8 p-3 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-2xl transition-all active:scale-90"
          title="Configuración"
        >
          <Settings size={24} />
        </button>

        <div className="space-y-3">
          <div className="inline-block p-4 bg-yellow-400 rounded-3xl shadow-lg shadow-yellow-100 mb-2">
            <DuckIcon color="white" size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">PatoChat</h1>
          <p className="text-slate-500 font-bold">¿Quién eres hoy en la casa?</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {config.characters.map((char) => {
            const isOnline = onlineUsers.includes(char.id);
            return (
              <button
                key={char.id}
                onClick={() => onSelect(char.id)}
                disabled={isOnline}
                className={`
                  flex items-center gap-5 p-5 rounded-[2rem] border-4 transition-all duration-300
                  ${char.border} bg-white hover:bg-slate-50 group relative active:scale-[0.98]
                  ${isOnline ? 'opacity-40 grayscale cursor-not-allowed border-slate-200' : 'shadow-lg shadow-slate-100 hover:shadow-xl'}
                `}
              >
                <div className={`p-4 rounded-2xl ${char.bg} bg-opacity-10 group-hover:scale-110 transition-transform shadow-inner`}>
                  <DuckIcon color={char.color} size={48} />
                </div>
                <div className="text-left">
                  <div className="font-black text-2xl text-slate-800 uppercase tracking-tight">{char.name}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {isOnline ? 'En la casa' : 'Disponible'}
                  </div>
                </div>
                {isOnline && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-full font-black tracking-widest uppercase">
                    OCUPADO
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          Inspirado en los sobrinos más famosos
        </p>
      </div>
    </div>
  );
}
