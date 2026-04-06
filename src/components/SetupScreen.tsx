import { useState } from "react";
import { Settings, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { RoomConfig, DEFAULT_COLORS, CharacterConfig } from "../types";
import { DuckIcon } from "./DuckIcon";

interface SetupScreenProps {
  config: RoomConfig;
  onSave: (config: RoomConfig) => void;
  onCancel: () => void;
}

export function SetupScreen({ config, onSave, onCancel }: SetupScreenProps) {
  const [characters, setCharacters] = useState<CharacterConfig[]>(config.characters);

  const addCharacter = () => {
    if (characters.length >= 7) return;
    const colorIndex = characters.length % DEFAULT_COLORS.length;
    const newChar: CharacterConfig = {
      id: Math.random().toString(36).substring(7),
      name: `Pato ${characters.length + 1}`,
      ...DEFAULT_COLORS[colorIndex]
    };
    setCharacters([...characters, newChar]);
  };

  const removeCharacter = (id: string) => {
    if (characters.length <= 1) return;
    setCharacters(characters.filter(c => c.id !== id));
  };

  const updateCharacterName = (id: string, name: string) => {
    setCharacters(characters.map(c => c.id === id ? { ...c, name } : c));
  };

  const updateCharacterColor = (id: string, colorIndex: number) => {
    setCharacters(characters.map(c => c.id === id ? { ...c, ...DEFAULT_COLORS[colorIndex] } : c));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-8 shadow-2xl max-w-2xl w-full space-y-8 border-4 border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-100">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Configuración</h1>
              <p className="text-sm text-slate-500 font-medium">Personaliza los patitos de la casa</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {characters.map((char) => (
            <div key={char.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 hover:border-slate-200 transition-all">
              <div className={`p-4 rounded-2xl ${char.bg} bg-opacity-10 flex-shrink-0 shadow-inner`}>
                <DuckIcon color={char.color} size={48} />
              </div>
              
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={char.name}
                  onChange={(e) => updateCharacterName(char.id, e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2 text-lg font-black text-slate-700 focus:border-yellow-400 focus:ring-0 outline-none transition-all"
                  placeholder="Nombre del pato"
                />
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((color, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => updateCharacterColor(char.id, cIdx)}
                      className={`w-8 h-8 rounded-full border-4 transition-all hover:scale-110 shadow-sm ${
                        char.color === color.color ? 'border-slate-800 scale-110' : 'border-white'
                      }`}
                      style={{ backgroundColor: color.color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => removeCharacter(char.id)}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                title="Eliminar patito"
              >
                <Trash2 size={22} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-4">
          {characters.length < 7 && (
            <button
              onClick={addCharacter}
              className="w-full py-4 border-4 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:border-yellow-400 hover:text-yellow-500 hover:bg-yellow-50 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-wider"
            >
              <Plus size={24} />
              Añadir otro patito
            </button>
          )}

          <button
            onClick={() => onSave({ maxUsers: characters.length, characters })}
            className="w-full py-5 bg-yellow-400 hover:bg-yellow-500 text-white font-black text-xl rounded-3xl shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-widest"
          >
            <Save size={24} />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
