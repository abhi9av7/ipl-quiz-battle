'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function QuizLobby() {
  const [players, setPlayers] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // WAITING MUSIC WITH FIXED AUTOMATIC 1-SECOND DELAY INTERACTION
  useEffect(() => {
    const waitingMusic = new Audio('/sounds/waiting.mp3');
    waitingMusic.loop = true;
    waitingMusic.volume = 0.4;

    let delayTimeout: NodeJS.Timeout;

    const startMusic = () => {
      // User ke screen touch karte hi 1 second ka delay pipeline stream hoga
      delayTimeout = setTimeout(() => {
        waitingMusic.play().catch((err) => {
          console.log("Autoplay constraint or audio node missing:", err);
        });
      }, 1000); // Exact 1 Second Delay

      window.removeEventListener('click', startMusic);
    };

    window.addEventListener('click', startMusic);

    return () => {
      clearTimeout(delayTimeout);
      waitingMusic.pause();
    };
  }, []);

  // LIVE PRESENCE SYSTEM
  useEffect(() => {
    const username = localStorage.getItem('iplUsername');
    if (!username) return;

    let playerId: number;

    // FETCH PLAYERS
    const fetchPlayers = async () => {
      // REMOVE INACTIVE PLAYERS
      const cutoff = new Date(Date.now() - 5000).toISOString();

      await supabase
        .from('players')
        .delete()
        .lt('last_seen', cutoff);

      // FETCH ACTIVE PLAYERS
      const { data } = await supabase
        .from('players')
        .select('*');

      if (data) {
        const usernames = data.map(
          (player: any) => player.username
        );
        setPlayers(usernames);
      }
    };

    // ADD PLAYER
    const addPlayer = async () => {
      // REMOVE OLD SAME USERNAME
      await supabase
        .from('players')
        .delete()
        .eq('username', username);

      // INSERT PLAYER
      const { data } = await supabase
        .from('players')
        .insert([
          {
            username,
            score: 0,
            last_seen: new Date(),
          },
        ])
        .select();

      if (data && data[0]) {
        playerId = data[0].id;
      }

      fetchPlayers();
    };

    addPlayer();

    // HEARTBEAT
    const heartbeat = setInterval(
      async () => {
        if (playerId) {
          await supabase
            .from('players')
            .update({
              last_seen: new Date(),
            })
            .eq('id', playerId);
        }
      },
      3000
    );

    // REALTIME PLAYER UPDATES
    const playersChannel = supabase.channel('players-realtime');

    playersChannel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
      },
      async () => {
        fetchPlayers();
      }
    );

    playersChannel.subscribe();

    // CLEANUP
    return () => {
      clearInterval(heartbeat);

      if (playerId) {
        supabase
          .from('players')
          .delete()
          .eq('id', playerId);
      }

      supabase.removeChannel(playersChannel);
    };
  }, []);

  // ADMIN QUIZ CONTROL
  useEffect(() => {
    const listenQuizState = async () => {
      const { data } = await supabase
        .from('quiz_state')
        .select('*')
        .eq('id', 1)
        .single();

      if (data && data.status === 'live') {
        setQuizStarted(true);

        // STOP WAITING MUSIC
        const audios = document.querySelectorAll('audio');
        audios.forEach((audio) => {
          audio.pause();
        });

        // PLAY COUNTDOWN
        const countdownAudio = new Audio('/sounds/countdown.mp3');
        countdownAudio.volume = 1;
        countdownAudio.play();

        let current = 3;
        setCountdown(3);

        const interval = setInterval(() => {
          current--;
          setCountdown(current);

          if (current <= 0) {
            clearInterval(interval);
            window.location.href = '/live-quiz';
          }
        }, 1000);
      }
    };

    listenQuizState();

    const quizChannel = supabase.channel('quiz-state-realtime');

    quizChannel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quiz_state',
      },
      async () => {
        listenQuizState();
      }
    );

    quizChannel.subscribe();

    return () => {
      supabase.removeChannel(quizChannel);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-black/70" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.15),transparent_60%)]" />

      {/* MAIN */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {!quizStarted ? (
          <>
            {/* HEADING */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tight"
            >
              WAITING LOBBY
            </motion.h1>

            {/* SUBTITLE */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-xl text-yellow-400"
            >
              Waiting for host to start the IPL Quiz...
            </motion.p>

            {/* STATUS */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 rounded-3xl border border-yellow-400/20 bg-yellow-500/10 px-12 py-8 backdrop-blur-xl"
            >
              <div className="text-sm tracking-[4px] text-yellow-300">
                TOURNAMENT STATUS
              </div>
              <div className="mt-3 text-4xl font-black text-white">
                WAITING FOR HOST
              </div>
            </motion.div>

            {/* PLAYER COUNT */}
            <div className="mt-14 text-white/70 text-lg">
              PLAYERS JOINED
            </div>
            <div className="text-6xl font-black text-yellow-400 mt-2">
              {players.length}
            </div>

            {/* PLAYERS */}
            <div className="mt-10 w-full max-w-2xl">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {players.map((player, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-lg"
                  >
                    <div className="text-lg font-bold tracking-wide text-yellow-300">
                      {player}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      JOINED THE ARENA 🔥
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 flex items-center justify-center bg-black z-50"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[12rem] font-black text-yellow-400 drop-shadow-[0_0_60px_rgba(255,200,0,0.8)]"
              >
                {countdown > 0 ? countdown : 'GO'}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}