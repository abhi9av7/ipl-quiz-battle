'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {

  const [quizStarted, setQuizStarted] =
    useState(false);

  const [players, setPlayers] =
    useState(0);

  const [quizEnded, setQuizEnded] =
    useState(false);

  const [currentQuestion, setCurrentQuestion] =
    useState(1);

  // FETCH PLAYERS
  useEffect(() => {

    const fetchPlayers = async () => {

      const { data } = await supabase
        .from('players')
        .select('*');

      if (data) {
        setPlayers(data.length);
      }
    };

    // FETCH QUIZ STATE
    const fetchQuizState =
      async () => {

        const { data } =
          await supabase
            .from('quiz_state')
            .select('*')
            .eq('id', 1)
            .single();

        if (data) {

          setCurrentQuestion(
            data.current_question
          );

          if (
            data.status === 'live'
          ) {
            setQuizStarted(true);
            setQuizEnded(false);
          }

          if (
            data.status === 'waiting'
          ) {
            setQuizStarted(false);
            setQuizEnded(false);
          }

          if (
            data.status === 'ended'
          ) {
            setQuizStarted(false);
            setQuizEnded(true);
          }
        }
      };

    fetchPlayers();
    fetchQuizState();

    // PLAYERS REALTIME
    const playersChannel =
      supabase.channel(
        'admin-players'
      );

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

    // QUIZ STATE REALTIME
    const quizChannel =
      supabase.channel(
        'admin-quiz-state'
      );

    quizChannel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quiz_state',
      },
      async () => {
        fetchQuizState();
      }
    );

    quizChannel.subscribe();

    return () => {

      supabase.removeChannel(
        playersChannel
      );

      supabase.removeChannel(
        quizChannel
      );
    };

  }, []);

  // START QUIZ
  const startQuiz = async () => {

    setQuizStarted(true);

    setQuizEnded(false);

    setCurrentQuestion(1);

    await supabase
      .from('quiz_state')
      .update({
        status: 'live',
        current_question: 1,
      })
      .eq('id', 1);
  };

  // END QUIZ + RESET
  const endQuiz = async () => {

    setQuizEnded(true);

    setQuizStarted(false);

    setPlayers(0);

    setCurrentQuestion(1);

    // DELETE ALL PLAYERS
    await supabase
      .from('players')
      .delete()
      .neq('id', 0);

    // RESET QUIZ STATE
    await supabase
      .from('quiz_state')
      .update({
        status: 'waiting',
        current_question: 1,
      })
      .eq('id', 1);

    alert(
      'Quiz ended and reset successfully!'
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />

      <div className="absolute inset-0 bg-black/85" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.12),transparent_60%)]" />

      {/* Main */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center py-10">

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
          className="text-5xl md:text-8xl font-black tracking-tight"
        >
          ADMIN PANEL
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
          className="mt-4 text-lg md:text-xl text-yellow-400"
        >
          IPL QUIZ CONTROL ROOM 🏏
        </motion.p>

        {/* Status Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl">

          {/* STATUS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8"
          >
            <div className="text-sm tracking-[4px] text-yellow-300">
              STATUS
            </div>

            <div
              className={`mt-5 text-3xl md:text-4xl font-black

              ${
                quizEnded
                  ? 'text-red-400'
                  : quizStarted
                  ? 'text-emerald-400'
                  : 'text-yellow-300'
              }
              `}
            >
              {quizEnded
                ? 'ENDED'
                : quizStarted
                ? 'LIVE'
                : 'WAITING'}
            </div>
          </motion.div>

          {/* QUESTION */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8"
          >
            <div className="text-sm tracking-[4px] text-cyan-300">
              CURRENT QUESTION
            </div>

            <div className="mt-5 text-4xl md:text-5xl font-black">
              {currentQuestion}
            </div>
          </motion.div>

          {/* PLAYERS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8"
          >
            <div className="text-sm tracking-[4px] text-pink-300">
              PLAYERS
            </div>

            <div className="mt-5 text-4xl md:text-5xl font-black">
              {players}
            </div>
          </motion.div>

        </div>

        {/* Buttons */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-5 w-full max-w-xl">

          {/* START */}
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={startQuiz}
            className="w-full px-10 py-5 rounded-3xl bg-gradient-to-r from-emerald-400 to-green-500 text-black text-xl md:text-2xl font-black shadow-[0_0_50px_rgba(0,255,120,0.5)]"
          >
            START QUIZ
          </motion.button>

          {/* END */}
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={endQuiz}
            className="w-full px-10 py-5 rounded-3xl bg-gradient-to-r from-red-400 to-orange-500 text-black text-xl md:text-2xl font-black shadow-[0_0_50px_rgba(255,80,0,0.5)]"
          >
            END QUIZ
          </motion.button>

        </div>

        {/* Footer */}
        <div className="mt-14 text-xs md:text-sm tracking-[5px] text-white/30">
          IPL QUIZ MASTER CONTROL
        </div>

      </div>
    </div>
  );
}