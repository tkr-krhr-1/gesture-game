import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Player, GameState } from './types';
import { THEMES } from './constants';
import PlayerSetup from './components/PlayerSetup';
import GameScreen from './components/GameScreen';
import Scoreboard from './components/Scoreboard';

const ROUND_DURATION = 60;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostId, setHostId] = useState<number | null>(null);
  const [wordPool, setWordPool] = useState<{ word: string; category: string }[]>([]);
  const [currentWord, setCurrentWord] = useState({ word: '', category: '' });

  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [turnScore, setTurnScore] = useState(0);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const pickNewWord = useCallback((currentPool: { word: string; category: string }[]) => {
    if (currentPool.length === 0) {
      setIsTimerRunning(false);
      setGameState(GameState.GameOver);
      return;
    }
    const newWord = currentPool[0];
    setWordPool(currentPool.slice(1));
    setCurrentWord(newWord);
  }, []);

  const handleGameStart = useCallback((newPlayers: Player[], categories: string[], selectedHostId: number | null) => {
    const shuffledPlayers = shuffleArray(newPlayers);
    setPlayers(shuffledPlayers);
    setHostId(selectedHostId);

    const initialPool = categories.flatMap(catTitle => {
        const theme = THEMES.find(t => t.title === catTitle);
        return theme ? theme.words.map(word => ({ word, category: theme.title })) : [];
    });
    
    const shuffledPool = shuffleArray(initialPool);
    setWordPool(shuffledPool);
    pickNewWord(shuffledPool);

    setGameState(GameState.TurnStart);
  }, [pickNewWord]);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      setGameState(GameState.TurnEnd);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isTimerRunning, timeLeft]);

  const handleStartTurn = () => {
    setTimeLeft(ROUND_DURATION);
    setTurnScore(0);
    setIsTimerRunning(true);
    setGameState(GameState.Acting);
  };
  
  const handleCorrectGuess = useCallback((guesserId: number) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p => (p.id === guesserId ? { ...p, score: p.score + 1 } : p))
    );
    setTurnScore(prev => prev + 1);
    pickNewWord(wordPool);
  }, [pickNewWord, wordPool]);

  const handlePass = useCallback(() => {
    pickNewWord(wordPool);
  }, [pickNewWord, wordPool]);

  const handleNextTurn = useCallback(() => {
    // After the host's turn, the game is over.
    setGameState(GameState.GameOver);
  }, []);


  const handlePlayAgain = () => {
    setGameState(GameState.Setup);
    setPlayers([]);
    setHostId(null);
  };

  const performer = useMemo(() => players.find(p => p.id === hostId), [players, hostId]);
  const guessers = useMemo(() => players.filter(p => p.id !== hostId), [players, hostId]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Setup:
        return <PlayerSetup onGameStart={handleGameStart} />;
      case GameState.TurnStart:
      case GameState.Acting:
      case GameState.TurnEnd:
        if (!performer) return null; // Should not happen
        return (
          <GameScreen
            gameState={gameState}
            performer={performer}
            guessers={guessers}
            word={currentWord.word}
            category={currentWord.category}
            timeLeft={timeLeft}
            turnScore={turnScore}
            onStartTurn={handleStartTurn}
            onCorrectGuess={handleCorrectGuess}
            onPass={handlePass}
            onNextTurn={handleNextTurn}
          />
        );
      case GameState.GameOver:
        return <Scoreboard players={guessers} onPlayAgain={handlePlayAgain} />;
      default:
        return null;
    }
  };

  return (
    <main className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen w-full flex items-center justify-center p-4 font-sans">
      {renderContent()}
    </main>
  );
};

export default App;