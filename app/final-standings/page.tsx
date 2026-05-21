'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FinalStandings() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const { data } = await supabase.from('players').select('*').order('score', { ascending: false });
      if (data) setLeaderboard(data);
      setLoading(false);
    };
    fetchResults();

    const params = new URLSearchParams(window.location.search);
    if (params.get('triggerFah') === 'true') {
      const fah = new Audio('/sounds/fah.mp3');
      fah.volume = 1.0;
      fah.play().catch(() => {});
    }
  }, []);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-yellow-400 font-black">SYNCING FINAL SCORES...</div>;

  return (
    <div className="relative min-h-screen bg-[#07070a] text-white flex flex-col items-center p-8 overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover opacity-10" />
      
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-6xl font-black text-yellow-400 mb-12 tracking-tighter drop-shadow-lg">
        FINAL STANDINGS
      </motion.h1>

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        {leaderboard.map((player, index) => {
          const isTop3 = index < 3;
          const colors = ['border-yellow-400 bg-yellow-400/10', 'border-zinc-300 bg-zinc-300/5', 'border-amber-700 bg-amber-700/5'];
          const crowns = ['👑', '🥈', '🥉'];

          return (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={player.id}
              className={`flex items-center justify-between p-6 rounded-2xl border ${isTop3 ? colors[index] : 'border-zinc-800 bg-zinc-900/30 backdrop-blur-md'}`}
            >
              <div className="flex items-center gap-6">
                <div className="relative text-3xl font-black">
                  #{index + 1}
                  {isTop3 && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-bounce">{crowns[index]}</span>}
                </div>
                <div className={`text-3xl font-black ${index === 0 ? 'text-yellow-400' : 'text-zinc-100'}`}>
                  {player.username}
                </div>
              </div>
              <div className="text-3xl font-black text-cyan-400">{player.score} <span className="text-xs text-zinc-500">PTS</span></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}