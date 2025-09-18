import React from 'react';
import { Player, GameState } from '../types';

interface GameScreenProps {
  gameState: GameState.TurnStart | GameState.Acting | GameState.TurnEnd;
  performer: Player;
  guessers: Player[];
  word: string;
  category: string;
  timeLeft: number;
  turnScore: number;
  onStartTurn: () => void;
  onCorrectGuess: (guesserId: number) => void;
  onPass: () => void;
  onNextTurn: () => void;
}

const TurnStartView: React.FC<{ performer: Player; onStartTurn: () => void }> = ({ performer, onStartTurn }) => (
  <div className="text-center p-8">
    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">{performer.name}さんの番です！</h1>
    <p className="mt-6 text-xl text-white/90">準備ができたら、スタートボタンを押してください。</p>
    <p className="mt-2 text-lg text-white/80">制限時間は60秒です。</p>
    <p className="mt-2 text-2xl font-bold text-yellow-300">他の人は見ないでね！</p>
    <button
      onClick={onStartTurn}
      className="mt-12 bg-white text-purple-600 font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
    >
      スタート
    </button>
  </div>
);

const ActingView: React.FC<{ 
    word: string; 
    category: string; 
    timeLeft: number;
    guessers: Player[];
    onCorrectGuess: (guesserId: number) => void;
    onPass: () => void;
}> = ({ word, category, timeLeft, guessers, onCorrectGuess, onPass }) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerColor = timeLeft <= 10 ? 'text-red-400' : 'text-white';

    return (
        <div className="text-center p-4 md:p-8 w-full max-w-3xl">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <div className={`text-6xl font-bold font-mono mb-4 ${timerColor}`}>{minutes}:{seconds.toString().padStart(2, '0')}</div>
                <p className="text-xl text-white/80">テーマ</p>
                <h2 className="text-3xl font-bold text-yellow-300 mb-6">{category}</h2>
                <p className="text-2xl text-white/80">お題</p>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white break-words mb-8 min-h-[80px]">{word}</h1>
                
                <h3 className="text-xl font-semibold text-white mb-4">正解者は？</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {guessers.map(player => (
                        <button
                            key={player.id}
                            onClick={() => onCorrectGuess(player.id)}
                            className="bg-white/90 text-purple-700 font-bold p-4 rounded-xl text-xl shadow-lg hover:shadow-xl hover:bg-white transform hover:scale-105 transition duration-300"
                        >
                            {player.name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onPass}
                    className="w-full max-w-md mx-auto mt-2 bg-white/30 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-white/40 transition duration-300"
                >
                    パス
                </button>
            </div>
        </div>
    );
};

const TurnEndView: React.FC<{ performer: Player; turnScore: number; onNextTurn: () => void }> = ({ performer, turnScore, onNextTurn }) => (
    <div className="text-center p-8 w-full max-w-2xl">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-8">
            <h1 className="text-5xl font-bold text-white mb-4">時間切れ！</h1>
            <p className="text-2xl text-white/90 mb-8">{performer.name}さんはこのターンで <span className="font-bold text-yellow-300 text-3xl">{turnScore}</span> 問正解しました！</p>
            <button
                onClick={onNextTurn}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
                結果を見る
            </button>
        </div>
    </div>
);


const GameScreen: React.FC<GameScreenProps> = (props) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            {props.gameState === GameState.TurnStart && <TurnStartView performer={props.performer} onStartTurn={props.onStartTurn} />}
            {props.gameState === GameState.Acting && <ActingView word={props.word} category={props.category} timeLeft={props.timeLeft} guessers={props.guessers} onCorrectGuess={props.onCorrectGuess} onPass={props.onPass} />}
            {props.gameState === GameState.TurnEnd && <TurnEndView performer={props.performer} turnScore={props.turnScore} onNextTurn={props.onNextTurn} />}
        </div>
    );
};

export default GameScreen;