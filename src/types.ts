export type CharacterId = string;

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  color: string;
  bg: string;
  text: string;
  border: string;
  hover: string;
}

export interface Message {
  id: string;
  from: CharacterId;
  text: string;
  timestamp: number;
}

export interface RoomConfig {
  maxUsers: number;
  characters: CharacterConfig[];
}

export const DEFAULT_COLORS = [
  { color: '#ef4444', bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', hover: 'hover:bg-red-600' },
  { color: '#3b82f6', bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', hover: 'hover:bg-blue-600' },
  { color: '#22c55e', bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', hover: 'hover:bg-green-600' },
  { color: '#eab308', bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', hover: 'hover:bg-yellow-600' },
  { color: '#a855f7', bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', hover: 'hover:bg-purple-600' },
  { color: '#ec4899', bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', hover: 'hover:bg-pink-600' },
  { color: '#06b6d4', bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500', hover: 'hover:bg-cyan-600' },
];
