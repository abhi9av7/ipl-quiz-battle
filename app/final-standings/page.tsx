'use client';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  useEffect,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';

export default function FinalStandings() {
  const [podium, setPodium] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. DYNAMIC DATABASE FETCH & FAH SOUND INTEGRATION
  useEffect(() => {
    const fetchFinalScores = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('score', { ascending: false });

        if (error) throw error;
        if (data) setPodium(data);
      } catch (err) {
        console.error('Error compiling database standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinalScores();

    // Trigger explicit meme celebratory route audio on entry path match
    const params = new URLSearchParams(window.location.search);
    if (params.get('triggerFah') === 'true') {
      const fahAudio = new Audio('/sounds/fah.mp3');
      fahAudio.volume = 1.0;
      fahAudio.play().catch(e => console.log("Audio load skipped:", e));
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#040406] flex items-center justify-center text-white">
        <div className="text-xl font-black tracking-widest uppercase animate-pulse text-yellow-400">
          COMPILING ULTIMATE SCORECARD...
        </div>
      </div>
    );
  }

  // Segmenting positions for customized 3-tier grand podium alignment
  const winner = podium[0];
  const runnerUp = podium[1];
  const secondRunnerUp = podium[2];
  const remainingPlayers = podium.slice(3);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-[#040406] text-white flex flex-col items-center p-6 select-none">
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-15 mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/90 to-[#040406]" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.12),transparent_70%)]" />

      {/* HEADER CONTENT DECK */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mt-12 mb-16"
      >
        <div className="text-xs tracking-[8px] text-zinc-500 font-black uppercase mb-2">VICTORY ARENA COMPLETION</div>
        <h1 className="text-6xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-200 to-orange-500 drop-shadow-[0_0_35px_rgba(234,179,8,0.3)]">
          FINAL STANDINGS
        </h1>
      </motion.div>

      {/* 🏆 THE GRAND LUXURY TRI-PODIUM DISPLAY */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-3 items-end gap-6 mb-20 px-6">
        
        {/* 2nd Place Segment */}
        <div className="flex flex-col items-center">
          {runnerUp ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center w-full group"
            >
              <div className="text-xl font-black text-zinc-400 truncate mb-3 group-hover:text-white transition-colors">{runnerUp.username}</div>
              <div className="bg-gradient-to-b from-zinc-700/20 via-zinc-900/40 to-transparent border border-zinc-700/50 backdrop-blur-md h-40 rounded-t-3xl flex flex-col justify-between p-5 shadow-2xl relative">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-3xl opacity-90">🥈</span>
                <div className="text-4xl font-black text-zinc-400 tracking-tighter">#2</div>
                <div className="text-xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                  {runnerUp.score} <span className="text-[10px] text-zinc-500 font-bold">PTS</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-40 w-full bg-zinc-950/20 border border-zinc-900/40 rounded-t-3xl border-dashed" />
          )}
        </div>

        {/* 1st Place (Crown Throne Position) */}
        <div className="flex flex-col items-center">
          {winner ? (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className="text-center w-full relative z-20 group"
            >
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-5xl animate-bounce drop-shadow-[0_10px_15px_rgba(234,179,8,0.4)]">👑</span>
              <div className="text-2xl font-black text-yellow-400 truncate mb-3 drop-shadow-[0_0_15px_rgba(234,179,8,0.2)] group-hover:brightness-125 transition-all">
                {winner.username}
              </div>
              <div className="bg-gradient-to-b from-yellow-500/20 via-amber-500/5 to-transparent border-2 border-yellow-400 backdrop-blur-xl h-56 rounded-t-3xl flex flex-col justify-between p-6 shadow-[0_0_60px_rgba(234,179,8,0.25)] border-b-transparent">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-amber-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">#1</div>
                <div className="text-2xl font-black text-yellow-300 tracking-wider drop-shadow-md">
                  {winner.score} <span className="text-xs text-yellow-500 font-extrabold uppercase">PTS</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-56 w-full bg-zinc-950/20 border-2 border-zinc-900/40 rounded-t-3xl border-dashed" />
          )}
        </div>

        {/* 3rd Place Segment */}
        <div className="flex flex-col items-center">
          {secondRunnerUp ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center w-full group"
            >
              <div className="text-lg font-black text-amber-600/90 truncate mb-3 group-hover:text-amber-500 transition-colors">{secondRunnerUp.username}</div>
              <div className="bg-gradient-to-b from-amber-900/10 via-zinc-900/50 to-transparent border border-amber-800/40 backdrop-blur-md h-32 rounded-t-3xl flex flex-col justify-between p-5 shadow-2xl relative">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-3xl opacity-90">🥉</span>
                <div className="text-3xl font-black text-amber-700">#3</div>
                <div className="text-lg font-black text-cyan-400">
                  {secondRunnerUp.score} <span className="text-[10px] text-zinc-500 font-bold">PTS</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-32 w-full bg-zinc-950/20 border border-zinc-900/40 rounded-t-3xl border-dashed" />
          )}
        </div>

      </div>

      {/* 📜 SUB-LEADERBOARD TRACKER TABLE FOR RANK #4 TO TOP 10 */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-3 pb-16">
        <div className="text-[10px] tracking-[4px] text-zinc-500 font-black uppercase px-2 mb-1">REMAINING ARENA CONTENDERS</div>
        <AnimatePresence>
          {remainingPlayers.map((player, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              key={player.id || index}
              className="flex items-center justify-between rounded-xl border border-zinc-900/80 bg-zinc-950/40 backdrop-blur-md px-6 py-4 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/20"
            >
              <div className="flex items-center gap-4">
                <div className="text-xs font-black text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-lg">
                  #{index + 4}
                </div>
                <div className="text-lg font-extrabold text-zinc-300 tracking-wide">{player.username}</div>
              </div>
              <div className="text-xl font-black text-zinc-400 tracking-wider">
                {player.score} <span className="text-[10px] text-zinc-600 uppercase font-black tracking-normal">PTS</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}