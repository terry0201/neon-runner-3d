import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Player } from './components/Player';
import { World } from './components/World';
import { UI } from './components/UI';
import { ViewMode, GameStatus } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.FIRST_PERSON);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [laps, setLaps] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [speed, setSpeed] = useState(0); // Raw speed value
  const [gameOverReason, setGameOverReason] = useState('');

  const handleToggleView = () => {
    setViewMode(prev => prev === ViewMode.FIRST_PERSON ? ViewMode.THIRD_PERSON : ViewMode.FIRST_PERSON);
  };

  const handleStartGame = () => {
    setScore(0);
    setLaps(0);
    setSpeed(0);
    setGameStatus(GameStatus.PLAYING);
  };

  const handleGameOver = (reason: string) => {
    if (gameStatus === GameStatus.GAME_OVER) return; // Prevent double trigger
    setGameStatus(GameStatus.GAME_OVER);
    setGameOverReason(reason);
  };

  const handleRestart = () => {
    setScore(0);
    setLaps(0);
    setSpeed(0);
    setGameStatus(GameStatus.IDLE); // Go back to idle to reset physics positions cleanly
    setTimeout(() => setGameStatus(GameStatus.PLAYING), 100);
  };

  // Convert raw speed to realistic km/h visual
  // Threshold 0.0012 -> ~200 km/h
  const displaySpeedKmh = speed * 160000;

  return (
    <div className="relative w-full h-full bg-slate-900">
      <UI 
        score={Math.floor(score / 10)} 
        laps={laps}
        isFlying={isFlying}
        viewMode={viewMode}
        gameStatus={gameStatus}
        gameOverReason={gameOverReason}
        speedKmh={displaySpeedKmh}
        onToggleView={handleToggleView}
        onStartGame={handleStartGame}
        onRestart={handleRestart}
      />
      
      <Canvas shadows camera={{ fov: 75, far: 2000 }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]}> {/* No gravity for flight */}
            <Player 
              viewMode={viewMode} 
              gameStatus={gameStatus} 
              onGameOver={handleGameOver}
              setScore={setScore}
              setLaps={setLaps}
              setIsFlying={setIsFlying}
              setSpeed={setSpeed}
            />
            <World gameStatus={gameStatus} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;