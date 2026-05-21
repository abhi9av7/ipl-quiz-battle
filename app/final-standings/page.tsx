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

  // 1. FETCH LIVE DATABASE RECORD ON COMPLETION
  useEffect(() => {
    const fetchFinalScores = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('score', { ascending: false })
          .limit(10); // Top 10 players ko final list me display karenge

        if (error) throw error;
        if (data) setPodium(data);
      } catch (err) {
        console.error('Error fetching final standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinalScores();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#040406] flex items-center justify-center text-white">
        <div className="text-xl font-black tracking-widest uppercase animate-pulse text-yellow-400">
          Loading Final Standings...
        </div>
      </div>
    );
  }

  // Split podium positions for top 3 visual treatment
  const winner = podium[0];
  const runnerUp = podium[1];
  const secondRunnerUp = podium[2];
  const remainingPlayers = podium.slice(3);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-[#040406] text-white flex flex-col items-center p-6 select-none">
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-10 mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/90 to-[#040406]" />

      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mt-8 mb-12"
      >
        <div className="text-xs tracking-[6px] text-yellow-400 font-black uppercase mb-2">IPL LIVE QUIZ ARENA</div>
        <h1 className="text-6xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-200 to-orange-500 drop-shadow-[0_0_35px_rgba(234,179,8,0.3)]">
          FINAL STANDINGS
        </h1>
      </motion.div>

      {/* 🏆 THE PODIUM (TOP 3 VISUALS) */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-3 items-end gap-4 mb-16 px-4">
        
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          {runnerUp && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center w-full"
            >
              <div className="text-xl font-black text-zinc-300 truncate mb-2">{runnerUp.username}</div>
              <div className="bg-zinc-800/40 border border-zinc-700/60 backdrop-blur-md h-36 rounded-t-2xl flex flex-col justify-between p-4 shadow-xl">
                <div className="text-4xl font-black text-zinc-400">#2</div>
                <div className="text-lg font-black text-cyan-400">{runnerUp.score} <span className="text-[10px] text-zinc-500">PTS</span></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 1st Place (Crown Position) */}
        <div className="flex flex-col items-center">
          {winner && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="text-center w-full relative z-20"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
              <div className="text-2xl font-black text-yellow-400 truncate mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                {winner.username}
              </div>
              <div className="bg-gradient-to-b from-yellow-500/20 via-amber-500/5 to-transparent border-2 border-yellow-400 backdrop-blur-xl h-48 rounded-t-2xl flex flex-col justify-between p-6 shadow-[0_0_50px_rgba(234,179,8,0.25)]">
                <div className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">#1</div>
                <div className="text-2xl font-black text-yellow-300 tracking-wide">{winner.score} <span className="text-xs text-yellow-500 font-extrabold">PTS</span></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          {secondRunnerUp && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center w-full"
            >
              <div className="text-lg font-black text-amber-600 truncate mb-2">{secondRunnerUp.username}</div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md h-28 rounded-t-2xl flex flex-col justify-between p-4 shadow-xl">
                <div className="text-3xl font-black text-amber-700">#3</div>
                <div className="text-base font-black text-cyan-400">{secondRunnerUp.score} <span className="text-[10px] text-zinc-500">PTS</span></div>
              </div>
            </motion.div>
          )}
        </div>

      </div>

      {/* 📜 LEADERBOARD TABLE FOR RANK #4 TO #10 */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-3 pb-12">
        <AnimatePresence>
          {remainingPlayers.map((player, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              key={player.id}
              className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm px-6 py-3.5"
            >
              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-zinc-500 bg-zinc-900 px-2.5 py-0.5 rounded-md">
                  #{index + 4}
                </div>
                <div className="text-lg font-extrabold text-zinc-300">{player.username}</div>
              </div>
              <div className="text-lg font-black text-zinc-400 tracking-wider">
                {player.score} <span className="text-[10px] text-zinc-600 uppercase font-black">PTS</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}