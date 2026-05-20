'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const teamLogos = [
  { src: '/images/rcb.png', alt: 'RCB' },
  { src: '/images/mi.png', alt: 'MI' },
  { src: '/images/csk.png', alt: 'CSK' },
  { src: '/images/rr.png', alt: 'RR' },
];

export default function IPLQuizLanding() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [onlineCount, setOnlineCount] = useState(18473);
  const [isEntering, setIsEntering] = useState(false);

  // Load username
  useEffect(() => {
    const savedUsername = localStorage.getItem('iplUsername');
    if (savedUsername) setUsername(savedUsername);
  }, []);

  // IPL Theme Song
useEffect(() => {
  const newAudio = new Audio('/sounds/ipl-song.mp3');

  newAudio.loop = true;
  newAudio.volume = 0.4;

  setAudio(newAudio);

  const startAudio = () => {
    if (!hasStartedAudio) {
      newAudio.play().catch(() => {});
      setHasStartedAudio(true);
    }
  };

  window.addEventListener('click', startAudio);

  return () => {
    window.removeEventListener('click', startAudio);
    newAudio.pause();
  };
}, [hasStartedAudio]);

  // Fake live count
useEffect(() => {
  const bgMusic = new Audio('/sounds/ipl-song.mp3');

  bgMusic.loop = true;
  bgMusic.volume = 0.4;

  setAudio(bgMusic);

  const startMusic = () => {
    bgMusic
      .play()
      .then(() => {
        console.log('Music started');
      })
      .catch((err) => {
        console.log(err);
      });

    window.removeEventListener('click', startMusic);
    window.removeEventListener('mousemove', startMusic);
    window.removeEventListener('touchstart', startMusic);
    window.removeEventListener('keydown', startMusic);
  };

  window.addEventListener('click', startMusic);
  window.addEventListener('mousemove', startMusic);
  window.addEventListener('touchstart', startMusic);
  window.addEventListener('keydown', startMusic);

  return () => {
    bgMusic.pause();

    window.removeEventListener('click', startMusic);
    window.removeEventListener('mousemove', startMusic);
    window.removeEventListener('touchstart', startMusic);
    window.removeEventListener('keydown', startMusic);
  };
}, []);

const handleUsernameChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = e.target.value;

  setUsername(value);

  localStorage.setItem('iplUsername', value);
};

  const handleEnterArena = async () => {
  if (!username.trim()) return;

  // SAVE USERNAME LOCALLY
  localStorage.setItem(
    'iplUsername',
    username
  );

  // SAVE PLAYER TO SUPABASE
  await supabase.from('players').insert([
    {
      username: username,
      score: 0,
    },
  ]);

  setIsEntering(true);

  setTimeout(() => {
    router.push('/quiz');
  }, 1200);
};

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">

      {/* Stadium Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: "url('/images/stadium.jpg')",
          filter:
            'brightness(0.35) contrast(1.2) saturate(1.1)',
        }}
      />

      {/* Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />

      {/* Golden Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,200,0,0.22),transparent_50%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.8px,transparent_1px)] bg-[length:50px_50px] opacity-10" />

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-6">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <span className="text-black text-xl font-bold">
              🏆
            </span>
          </div>

          <div className="text-2xl font-black tracking-tight">
            IPL QUIZ BATTLE
          </div>
        </div>

        <button
          onClick={() => {
  if (!audio) return;

  if (isSoundOn) {
    audio.pause();
  } else {
    audio.play();
  }

  setIsSoundOn(!isSoundOn);
}}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all"
        >
          {isSoundOn ? (
            <Volume2 size={22} />
          ) : (
            <VolumeX size={22} />
          )}
        </button>
      </nav>

      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">

        {/* Trophy Glow */}
        <div className="absolute top-[28%] h-[380px] w-[380px] rounded-full bg-yellow-500/20 blur-3xl" />

        {/* Trophy */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
          }}
          className="relative mb-6 md:mb-10 w-56 md:w-72 mx-auto"
        >
          <motion.img
            src="/images/trophy.png"
            alt="IPL Trophy"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mix-blend-screen opacity-95 drop-shadow-[0_0_80px_rgba(255,200,0,0.5)]"
          />

          {/* Glow Ring */}
          <div className="absolute -inset-10 rounded-full border border-yellow-400/20 animate-[spin_30s_linear_infinite]" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-block px-6 py-2 mb-6 border border-yellow-400/20 bg-black/40 backdrop-blur-md rounded-full text-sm tracking-[4px] text-yellow-300"
        >
          SEASON 2026 • OPENING NIGHT
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-4px] leading-none"
        >
          IPL{' '}
          <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-white bg-clip-text text-transparent">
            QUIZ NIGHT
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xl md:text-2xl text-white/70 mt-4 mb-10"
        >
          Where cricket legends meet esports glory
        </motion.p>

        {/* Username Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full max-w-md"
        >
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="ENTER YOUR BATTLE NAME"
              maxLength={20}
              className="w-full bg-black/40 border border-yellow-400/20 rounded-2xl px-8 py-5 text-center uppercase tracking-[3px] text-lg backdrop-blur-xl outline-none transition-all focus:border-yellow-400 focus:shadow-[0_0_35px_rgba(255,200,0,0.35)]"
            />

            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono">
              {username.length}/20
            </div>
          </div>
        </motion.div>

        {/* Enter Button */}
        <motion.button
          onClick={handleEnterArena}
          disabled={!username.trim()}
          whileHover={{
            scale: username.trim() ? 1.05 : 1,
          }}
          whileTap={{ scale: 0.97 }}
          className={`group relative mt-7 px-14 py-6 text-2xl font-black rounded-3xl overflow-hidden transition-all duration-300 flex items-center gap-4
            ${
              username.trim()
                ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black shadow-2xl shadow-yellow-500/50'
                : 'bg-zinc-800 text-white/40 cursor-not-allowed'
            }`}
        >
          <span className="relative z-10 flex items-center gap-4">
            ENTER THE ARENA
            <Play className="group-hover:rotate-12 transition-transform w-7 h-7" />
          </span>

          <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </motion.button>

        {/* Live Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-14 flex items-center gap-4"
        >
          <Users className="text-emerald-400" size={32} />

          <div className="text-left">
            <div className="text-4xl font-black tracking-tight">
              {onlineCount.toLocaleString()}
            </div>

            <div className="text-sm text-white/50 tracking-wider">
              FANS IN THE STADIUM
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Logos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {teamLogos.map((logo, index) => (
          <motion.img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className="absolute w-16 md:w-20 opacity-50 mix-blend-screen blur-[0.2px] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            style={{
              left: `${15 + (index % 2) * 60}%`,
              top: `${35 + Math.floor(index / 2) * 28}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, index % 2 === 0 ? 15 : -15, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 7 + index,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ENTER TRANSITION */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1,
              }}
              className="text-5xl md:text-7xl font-black tracking-[6px] text-yellow-400"
            >
              WELCOME TO THE ARENA
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
