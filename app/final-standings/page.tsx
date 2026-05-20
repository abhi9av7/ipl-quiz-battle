'use client';

import { motion } from 'framer-motion';

const leaderboard = [
  {
    name: 'ABHINAV',
    score: 30,
  },

  {
    name: 'VIRAT',
    score: 20,
  },

  {
    name: 'DHONI',
    score: 20,
  },

  {
    name: 'ROHIT',
    score: 10,
  },

  {
    name: 'SKY',
    score: 10,
  },
];

export default function FinalStandings() {

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />

      <div className="absolute inset-0 bg-black/85" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.15),transparent_60%)]" />

      {/* MAIN */}
      <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center">

        {/* TITLE */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-6xl md:text-8xl font-black text-yellow-400"
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
          className="mt-6 text-2xl text-white/70"
        >
          IPL QUIZ CHAMPIONS 🏏🔥
        </motion.p>

        {/* PODIUM */}
        <div className="mt-20 flex flex-wrap items-end justify-center gap-8">

          {/* 2ND */}
          <motion.div
            initial={{
              opacity: 0,
              y: 80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="w-64 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-10"
          >
            <div className="text-7xl">
              🥈
            </div>

            <div className="mt-6 text-4xl font-black text-zinc-200">
              {leaderboard[1].name}
            </div>

            <div className="mt-4 text-6xl font-black text-cyan-300">
              {leaderboard[1].score}
            </div>

            <div className="mt-3 text-white/40 tracking-[4px]">
              RUNNER UP
            </div>
          </motion.div>

          {/* 1ST */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.3,
            }}
            className="w-72 rounded-[50px] border border-yellow-400/30 bg-yellow-500/10 backdrop-blur-xl px-10 py-14 shadow-[0_0_80px_rgba(255,200,0,0.25)]"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-8xl"
            >
              🏆
            </motion.div>

            <div className="mt-8 text-5xl font-black text-yellow-300">
              {leaderboard[0].name}
            </div>

            <div className="mt-5 text-7xl font-black text-emerald-400">
              {leaderboard[0].score}
            </div>

            <div className="mt-4 text-yellow-200 tracking-[5px]">
              IPL QUIZ CHAMPION
            </div>
          </motion.div>

          {/* 3RD */}
          <motion.div
            initial={{
              opacity: 0,
              y: 80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.7,
            }}
            className="w-64 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-10"
          >
            <div className="text-7xl">
              🥉
            </div>

            <div className="mt-6 text-4xl font-black text-orange-300">
              {leaderboard[2].name}
            </div>

            <div className="mt-4 text-6xl font-black text-orange-400">
              {leaderboard[2].score}
            </div>

            <div className="mt-3 text-white/40 tracking-[4px]">
              THIRD PLACE
            </div>
          </motion.div>

        </div>

        {/* FULL LEADERBOARD */}
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
            delay: 1,
          }}
          className="mt-20 w-full max-w-4xl rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-8"
        >

          <div className="text-2xl font-black tracking-[5px] text-yellow-300">
            COMPLETE LEADERBOARD
          </div>

          <div className="mt-8 flex flex-col gap-5">

            {leaderboard.map(
              (player, index) => (
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
                    delay:
                      1.2 + index * 0.1,
                  }}
                  className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/30 px-6 py-5"
                >

                  <div className="flex items-center gap-5">

                    <div className="text-3xl font-black text-yellow-300">
                      #{index + 1}
                    </div>

                    <div className="text-2xl font-bold">
                      {player.name}
                    </div>
                  </div>

                  <div className="text-3xl font-black text-emerald-400">
                    {player.score}
                  </div>

                </motion.div>
              )
            )}

          </div>

        </motion.div>

      </div>
    </div>
  );
}