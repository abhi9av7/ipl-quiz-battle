'use client';

import { motion } from 'framer-motion';

const leaderboard = [
  {
    name: 'ABHINAV',
    score: 40,
  },

  {
    name: 'ARYAN',
    score: 35,
  },

  {
    name: 'ROHAN',
    score: 25,
  },

  {
    name: 'DAKSH',
    score: 20,
  },

  {
    name: 'KRISH',
    score: 10,
  },
];

export default function LeaderboardPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-black text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />

      <div className="absolute inset-0 bg-black/80" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.15),transparent_60%)]" />

      {/* Main */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 py-4 text-center">

        {/* Heading */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-5xl md:text-7xl font-black tracking-tight"
        >
          FINAL STANDINGS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.4,
          }}
          className="mt-2 text-lg text-yellow-400"
        >
          TOP PLAYERS OF THE ARENA 🔥
        </motion.p>

        {/* TOP 3 */}
        <div className="mt-10 flex items-end gap-4">

          {/* 2nd */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="w-40 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-5"
          >
            <div className="text-5xl">
              🥈
            </div>

            <div className="mt-3 text-2xl font-black text-white">
              {leaderboard[1].name}
            </div>

            <div className="mt-2 text-4xl font-black text-gray-300">
              {leaderboard[1].score}
            </div>

            <div className="mt-1 text-xs tracking-[3px] text-white/40">
              POINTS
            </div>
          </motion.div>

          {/* 1st */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="relative w-48 rounded-[32px] border border-yellow-400/30 bg-yellow-500/10 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(255,200,0,0.35)]"
          >

            {/* Glow */}
            <div className="absolute inset-0 rounded-[32px] bg-yellow-400/5 blur-2xl" />

            <div className="relative z-10">

              <div className="text-6xl">
                👑
              </div>

              <div className="mt-3 text-3xl font-black text-yellow-300">
                {leaderboard[0].name}
              </div>

              <div className="mt-3 text-6xl font-black text-yellow-400">
                {leaderboard[0].score}
              </div>

              <div className="mt-1 text-xs tracking-[3px] text-yellow-200/70">
                POINTS
              </div>

            </div>
          </motion.div>

          {/* 3rd */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.8,
            }}
            className="w-40 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-5"
          >
            <div className="text-5xl">
              🥉
            </div>

            <div className="mt-3 text-2xl font-black text-white">
              {leaderboard[2].name}
            </div>

            <div className="mt-2 text-4xl font-black text-orange-300">
              {leaderboard[2].score}
            </div>

            <div className="mt-1 text-xs tracking-[3px] text-white/40">
              POINTS
            </div>
          </motion.div>

        </div>

        {/* OTHER PLAYERS */}
        <div className="mt-8 w-full max-w-3xl space-y-3">

          {leaderboard.slice(3).map((player, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 1 + index * 0.2,
              }}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl"
            >

              {/* LEFT */}
              <div className="flex items-center gap-5">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black text-white/70">
                  #{index + 4}
                </div>

                <div className="text-2xl font-black tracking-wide">
                  {player.name}
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-3xl font-black text-cyan-300">
                {player.score}
              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </div>
  );
}