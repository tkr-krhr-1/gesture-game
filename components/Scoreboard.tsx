import React from 'react';
import { Player } from '../types';

interface ScoreboardProps {
  players: Player[];
  onPlayAgain: () => void;
}

const CrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L10 13.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.192L.818 8.124a.75.75 0 01.416-1.28l4.21-.612L7.327 2.42A.75.75 0 018 2v0a2 2 0 012-2z" transform="translate(0 2)"/>
    </svg>
);


const Scoreboard: React.FC<ScoreboardProps> = ({ players, onPlayAgain }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const highScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 0;
  const winners = sortedPlayers.filter(p => p.score === highScore && highScore > 0);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 drop-shadow-lg">ゲーム終了！</h1>
        
        {winners.length > 0 && (
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-yellow-300">勝者は...</h2>
                <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-2 mt-2">
                    <CrownIcon />
                    <p className="text-4xl md:text-5xl font-extrabold">
                        {winners.map(w => w.name).join('さん、')}さん！
                    </p>
                </div>
            </div>
        )}

        <h3 className="text-2xl font-semibold mb-4 text-center">最終スコア</h3>
        <ul className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <li
              key={player.id}
              className="flex justify-between items-center bg-white/10 rounded-lg px-6 py-4 text-lg"
            >
              <div className="flex items-center">
                <span className="font-bold w-8">{index + 1}.</span>
                <span className="font-semibold">{player.name}</span>
              </div>
              <span className="font-extrabold text-xl">{player.score} 点</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onPlayAgain}
          className="w-full mt-10 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
        >
          もう一度遊ぶ
        </button>
      </div>
    </div>
  );
};

export default Scoreboard;