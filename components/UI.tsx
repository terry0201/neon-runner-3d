import React, { useEffect, useState } from 'react';
import { ViewMode, GameStatus } from '../types';
import { Eye, EyeOff, Play, Flag, Zap, Gauge, Plane, PersonStanding, ArrowUp } from 'lucide-react';

interface UIProps {
  score: number;
  laps: number;
  isFlying: boolean;
  viewMode: ViewMode;
  gameStatus: GameStatus;
  gameOverReason: string;
  speedKmh?: number; // Optional prop for speed
  onToggleView: () => void;
  onStartGame: () => void;
  onRestart: () => void;
}

export const UI: React.FC<UIProps> = ({
  score,
  laps,
  isFlying,
  viewMode,
  gameStatus,
  speedKmh = 0, // Default 0
  onToggleView,
  onStartGame,
}) => {
  const [aiMessage, setAiMessage] = useState<string>('');
  
  useEffect(() => {
     if (laps > 0) {
        setAiMessage(`第 ${laps} 圈達成！`);
        setTimeout(() => setAiMessage(""), 4000);
     }
  }, [laps]);

  // 起飛所需的時速 (對應 Player 中的 FLY_THRESHOLD 0.0012)
  // Conversion: 0.0012 * 160000 = 192 km/h
  const TAKEOFF_SPEED = 192; 

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10 font-sans">
      {/* HUD Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-lg min-w-[240px]">
          <h1 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <Zap className="text-yellow-400 fill-current" /> 中正紀念堂 <span className="text-blue-400 text-sm font-normal">跑步模擬</span>
          </h1>
          <div className="flex justify-between items-end mt-2">
             <div className="text-gray-300 font-mono text-sm">里程: {(score / 100).toFixed(1)} m</div>
             <div className="text-yellow-400 font-black text-3xl flex items-center gap-2">
                <Flag size={20} /> {laps} <span className="text-xs text-gray-400 font-normal">LAPS</span>
             </div>
          </div>
        </div>

        <button
          onClick={onToggleView}
          className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg backdrop-blur transition-all active:scale-95 ring-1 ring-white/20 flex items-center gap-2"
        >
          {viewMode === ViewMode.FIRST_PERSON ? (
            <>
               <EyeOff size={20} className="text-blue-400" />
               <span className="hidden md:inline text-sm font-bold">第一人稱</span>
            </>
          ) : (
             <>
               <Eye size={20} className="text-blue-400" />
               <span className="hidden md:inline text-sm font-bold">第三人稱</span>
             </>
          )}
        </button>
      </div>

      {/* Speedometer & Altimeter */}
      {gameStatus === GameStatus.PLAYING && (
         <div className="absolute top-24 right-6 flex flex-col items-end gap-2">
             {/* 儀表板外框 */}
            <div className={`
              relative overflow-hidden
              flex flex-col items-end justify-center px-6 py-4 rounded-xl border-2 shadow-2xl backdrop-blur-md transition-all duration-300 w-64
              ${isFlying 
                ? 'bg-blue-900/80 border-blue-400 text-white shadow-blue-500/50' 
                : 'bg-slate-800/80 border-gray-500 text-white'}
            `}>
                {/* 狀態圖示 */}
                <div className="absolute top-2 left-4 opacity-50">
                    {isFlying ? <Plane size={48} /> : <PersonStanding size={48} />}
                </div>

                {/* 速度數字 */}
                <div className="flex items-baseline gap-1 z-10">
                    <span className="text-5xl font-black font-mono tracking-tighter">
                        {Math.floor(speedKmh)}
                    </span>
                    <span className="text-sm font-bold text-gray-400">KM/H</span>
                </div>

                {/* 進度條 (距離起飛) */}
                <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-200 ${isFlying ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400'}`} 
                        style={{ width: `${Math.min((speedKmh / TAKEOFF_SPEED) * 100, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between w-full text-[10px] text-gray-400 mt-1 font-mono">
                    <span>GROUND</span>
                    <span>TAKEOFF ({TAKEOFF_SPEED})</span>
                </div>

                {/* 高度計 */}
                 <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10 w-full justify-end text-sm font-mono text-cyan-300">
                    <ArrowUp size={14} />
                    <span>ALT: {isFlying ? 'LOW ALT' : 'GROUND'}</span>
                </div>
            </div>
         </div>
      )}

      {/* Main Menu */}
      {gameStatus === GameStatus.IDLE && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto z-20">
          <div className="text-center">
            <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500 mb-2 drop-shadow-2xl italic">
              悠遊中正紀念堂
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">慢跑與飛行模擬</p>
            
            <div className="space-y-6 bg-slate-900/90 p-8 rounded-2xl border border-blue-500/30 max-w-md mx-auto shadow-2xl shadow-blue-900/20">
              <div className="text-gray-300 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                        <kbd className="bg-white/10 px-3 py-2 rounded text-blue-400 font-bold mb-1">W</kbd>
                    </div>
                    <div>
                        <span className="font-bold text-white">加速 (按住)</span>
                        <div className="text-xs text-gray-500">時速達到 {TAKEOFF_SPEED}km/h 以上起飛</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                        <kbd className="bg-white/10 px-3 py-2 rounded text-red-400 font-bold mb-1">S</kbd>
                    </div>
                    <span>空氣煞車 / 減速</span>
                </div>
              </div>
              <button
                onClick={onStartGame}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 flex justify-center items-center gap-2"
              >
                <Play fill="currentColor" size={20} /> 開始跑步
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-game Message */}
      {aiMessage && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white px-8 py-3 rounded-full backdrop-blur font-bold text-xl animate-bounce shadow-lg border border-blue-400 z-50">
              {aiMessage}
          </div>
      )}
    </div>
  );
};