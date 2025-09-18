import React, { useState } from 'react';
import { Player } from '../types';
import { THEMES } from '../constants';

interface PlayerSetupProps {
  onGameStart: (players: Player[], categories: string[], hostId: number | null) => void;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


const PlayerSetup: React.FC<PlayerSetupProps> = ({ onGameStart }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hostId, setHostId] = useState<number | null>(null);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        score: 0,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (idToRemove: number) => {
    setPlayers(prev => prev.filter(player => player.id !== idToRemove));
    if (hostId === idToRemove) {
      setHostId(null);
    }
  };

  const handleCategoryToggle = (title: string) => {
    setSelectedCategories(prev =>
      prev.includes(title)
        ? prev.filter(cat => cat !== title)
        : [...prev, title]
    );
  };
  
  const handleStartGameClick = () => {
    onGameStart(players, selectedCategories, hostId);
  }

  const actualPlayerCount = players.filter(p => p.id !== hostId).length;
  const canStartGame = actualPlayerCount >= 1 && selectedCategories.length > 0 && hostId !== null;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">ジェスチャーゲーム</h1>
        <p className="text-white/80 text-center mb-8">参加者とテーマを決めてゲームを始めよう！</p>

        {/* Player Input */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">参加者を追加 (司会者1名 + 回答者1名以上)</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              placeholder="ニックネーム"
              className="flex-grow bg-white/30 text-white placeholder-white/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <button
              onClick={handleAddPlayer}
              className="bg-pink-500 text-white rounded-lg p-3 hover:bg-pink-600 transition duration-300 shadow-md disabled:bg-gray-400"
              disabled={!newPlayerName.trim()}
            >
              <PlusIcon />
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {players.map(player => (
              <li key={player.id} className="bg-white/10 rounded-lg px-4 py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <UserIcon />
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <button 
                  onClick={() => handleRemovePlayer(player.id)}
                  className="text-white/50 hover:text-white transition-colors p-2 rounded-full"
                  aria-label={`Remove ${player.name}`}
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Host Selection */}
        {players.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">司会者（出題者）を選ぶ</h2>
            <p className="text-white/70 text-sm mb-3">司会者はジェスチャーをする人で、スコア計算には含まれません。</p>
            <div className="space-y-2">
              {players.map(player => (
                <label key={player.id} htmlFor={`host-${player.id}`} className="block bg-white/10 rounded-lg p-3 hover:bg-white/20 transition cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`host-${player.id}`}
                      name="host"
                      checked={hostId === player.id}
                      onChange={() => setHostId(player.id)}
                      className="h-5 w-5 text-yellow-400 bg-gray-700 border-gray-600 focus:ring-yellow-500"
                    />
                    <span className="ml-3 text-white font-medium">{player.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}


        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">テーマを選ぶ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.map(theme => (
              <button
                key={theme.title}
                onClick={() => handleCategoryToggle(theme.title)}
                className={`p-3 rounded-lg text-center font-semibold transition duration-300 ${
                  selectedCategories.includes(theme.title)
                    ? 'bg-yellow-400 text-purple-800 shadow-lg scale-105'
                    : 'bg-white/30 text-white hover:bg-white/40'
                }`}
              >
                {theme.title}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartGameClick}
          disabled={!canStartGame}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          ゲーム開始！
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;