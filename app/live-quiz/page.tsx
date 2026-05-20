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

const questions = [
  {
    question: 'Who won IPL 2016?',
    options: [
      'Mumbai Indians',
      'Sunrisers Hyderabad',
      'Royal Challengers Bangalore',
      'Chennai Super Kings',
    ],
    correct: 1,
  },

  {
    question: 'Who is called Mr. IPL?',
    options: [
      'Virat Kohli',
      'MS Dhoni',
      'Suresh Raina',
      'Rohit Sharma',
    ],
    correct: 2,
  },

  {
    question:
      'Which player has most IPL runs?',
    options: [
      'Rohit Sharma',
      'Virat Kohli',
      'David Warner',
      'KL Rahul',
    ],
    correct: 1,
  },
];

export default function LiveQuiz() {

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [showAnswer, setShowAnswer] =
    useState(false);

  const [timer, setTimer] =
    useState(15);

  const [score, setScore] =
    useState(0);

  const [quizEnded, setQuizEnded] =
    useState(false);

  const [countdownPlayed, setCountdownPlayed] =
    useState(false);

  const [showLeaderboard, setShowLeaderboard] =
    useState(false);

  const [showFinalSuspense, setShowFinalSuspense] =
    useState(false);

  const [leaderboard, setLeaderboard] =
    useState<any[]>([]);

  const username =
    typeof window !== 'undefined'
      ? localStorage.getItem(
          'iplUsername'
        )
      : '';

  // FETCH LEADERBOARD
  const fetchLeaderboard =
    async () => {

      const { data } =
        await supabase
          .from('players')
          .select('*')
          .order('score', {
            ascending: false,
          });

      if (data) {
        setLeaderboard(data);
      }
    };

  // TIMER SYSTEM
  useEffect(() => {

    if (
      showAnswer ||
      showLeaderboard ||
      quizEnded
    ) return;

    // LAST 5 SEC SOUND
    if (
      timer === 5 &&
      !countdownPlayed
    ) {

      const countdownAudio =
        new Audio(
          '/sounds/countdown5.mp3'
        );

      countdownAudio.volume = 1;

      countdownAudio.play();

      setCountdownPlayed(true);
    }

    // TIMER END
    if (timer === 0) {
      revealAnswer();
      return;
    }

    const interval =
      setInterval(() => {
        setTimer(
          (prev) => prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);

  }, [
    timer,
    showAnswer,
    showLeaderboard,
    quizEnded,
    countdownPlayed,
  ]);

  // REVEAL ANSWER
  const revealAnswer =
    async () => {

      setShowAnswer(true);

      // CORRECT ANSWER
      if (
        selectedAnswer ===
        questions[currentQuestion]
          .correct
      ) {

        const newScore =
          score + 10;

        setScore(newScore);

        // UPDATE SUPABASE SCORE
        await supabase
          .from('players')
          .update({
            score: newScore,
          })
          .eq(
            'username',
            username
          );
      }

      // FETCH LIVE LEADERBOARD
      await fetchLeaderboard();

      // SHOW LEADERBOARD AFTER 3 SEC
      setTimeout(() => {

        setShowAnswer(false);

        setShowLeaderboard(true);

        // SHOW FOR 5 SEC
        setTimeout(() => {

          setShowLeaderboard(false);

          // LAST QUESTION?
          if (
            currentQuestion + 1 >=
            questions.length
          ) {

            setShowFinalSuspense(
              true
            );

            // FINAL PAGE
            setTimeout(() => {

              setQuizEnded(true);

              window.location.href =
                '/final-standings';

            }, 5000);

            return;
          }

          // NEXT QUESTION
          setCurrentQuestion(
            (prev) => prev + 1
          );

          setSelectedAnswer(null);

          setTimer(15);

          setCountdownPlayed(
            false
          );

        }, 5000);

      }, 3000);
    };

  const question =
    questions[currentQuestion];

  // FINAL SUSPENSE
  if (showFinalSuspense) {
    return (
      <div className="relative h-screen overflow-hidden bg-black flex items-center justify-center text-white text-center px-6">

        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />

        <div className="absolute inset-0 bg-black/85" />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="relative z-10"
        >
          <div className="text-7xl md:text-9xl font-black text-yellow-400">
            FINAL RESULTS
          </div>

          <div className="mt-8 text-3xl text-white/70">
            Calculating Final
            Standings...
          </div>

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="mt-12 w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  // LIVE LEADERBOARD
  if (showLeaderboard) {
    return (
      <div className="relative h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center px-6 text-center">

        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />

        <div className="absolute inset-0 bg-black/80" />

        <motion.h1
          initial={{
            scale: 0.7,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="relative z-10 text-6xl md:text-8xl font-black text-yellow-400"
        >
          LIVE LEADERBOARD
        </motion.h1>

        {/* LEADERBOARD */}
        <div className="relative z-10 mt-12 w-full max-w-3xl flex flex-col gap-5">

          {leaderboard.map(
            (
              player,
              index
            ) => (
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
                className={`flex items-center justify-between rounded-3xl border px-6 py-5

                ${
                  index === 0
                    ? 'border-yellow-400 bg-yellow-500/10'
                    : 'border-white/10 bg-white/5'
                }
                `}
              >

                <div className="flex items-center gap-5">

                  <div className="text-3xl font-black text-yellow-300">
                    #{index + 1}
                  </div>

                  <div className="text-2xl font-bold">
                    {
                      player.username
                    }
                  </div>
                </div>

                <div className="text-3xl font-black text-emerald-400">
                  {player.score}
                </div>

              </motion.div>
            )
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-black text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />

      <div className="absolute inset-0 bg-black/75" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.15),transparent_60%)]" />

      {/* TOP BAR */}
      <div className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5">

        {/* QUESTION */}
        <div>
          <div className="text-sm tracking-[4px] text-yellow-300">
            QUESTION
          </div>

          <div className="text-3xl font-black">
            {currentQuestion + 1}

            <span className="text-white/30">
              /{questions.length}
            </span>
          </div>
        </div>

        {/* TIMER */}
        <motion.div
          animate={
            timer <= 5
              ? {
                  scale: [
                    1,
                    1.15,
                    1,
                  ],
                }
              : {}
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
          }}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl font-black border-4

          ${
            timer <= 5
              ? 'border-red-500 text-red-400 shadow-[0_0_50px_rgba(255,0,0,0.7)]'
              : 'border-yellow-400 text-yellow-300 shadow-[0_0_40px_rgba(255,200,0,0.5)]'
          }
          `}
        >
          {timer}
        </motion.div>

        {/* SCORE */}
        <div className="text-right">
          <div className="text-sm tracking-[4px] text-cyan-300">
            SCORE
          </div>

          <div className="text-3xl font-black">
            {score}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-120px)] px-6 pb-6 text-center">

        {/* QUESTION CARD */}
        <motion.div
          key={currentQuestion}
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="w-full max-w-5xl rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl px-6 md:px-10 py-8 shadow-[0_0_60px_rgba(255,255,255,0.05)]"
        >

          {/* Heading */}
          <div className="text-sm tracking-[6px] text-yellow-300">
            IPL QUIZ NIGHT
          </div>

          {/* Question */}
          <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight">
            {question.question}
          </h1>

          {/* OPTIONS */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

            {question.options.map(
              (
                option,
                index
              ) => {

                const isCorrect =
                  index ===
                  question.correct;

                const isSelected =
                  selectedAnswer ===
                  index;

                return (
                  <motion.button
                    key={index}
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    disabled={
                      showAnswer
                    }
                    onClick={() => {

                      if (
                        selectedAnswer ===
                        null
                      ) {
                        setSelectedAnswer(
                          index
                        );
                      }
                    }}
                    className={`relative overflow-hidden rounded-3xl border px-8 py-5 text-left text-xl font-bold transition-all duration-300

                    ${
                      !showAnswer
                        ? isSelected
                          ? 'border-yellow-400 bg-yellow-500/20 shadow-[0_0_40px_rgba(255,200,0,0.4)]'
                          : 'border-white/10 bg-white/5 hover:border-yellow-400/40 hover:bg-yellow-500/10'
                        : isCorrect
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_50px_rgba(0,255,120,0.4)]'
                        : isSelected
                        ? 'border-red-500 bg-red-500/20 shadow-[0_0_40px_rgba(255,0,0,0.4)]'
                        : 'border-white/10 bg-white/5 opacity-60'
                    }
                  `}
                  >
                    <div className="flex items-center gap-5">

                      {/* LETTER */}
                      <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </div>

                      {/* OPTION */}
                      <div className="flex-1">
                        {option}
                      </div>
                    </div>

                  </motion.button>
                );
              }
            )}

          </div>

          {/* LOCK BUTTON */}
          {!showAnswer && (
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={
                revealAnswer
              }
              disabled={
                selectedAnswer ===
                null
              }
              className={`mt-8 px-12 py-5 rounded-3xl text-2xl font-black transition-all duration-300

                ${
                  selectedAnswer !==
                  null
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-[0_0_50px_rgba(255,180,0,0.6)]'
                    : 'bg-zinc-800 text-white/40 cursor-not-allowed'
                }
              `}
            >
              LOCK ANSWER 🔒
            </motion.button>
          )}

          {/* RESULT */}
          <AnimatePresence>

            {showAnswer && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-8"
              >

                {selectedAnswer ===
                question.correct ? (
                  <div className="text-5xl font-black text-emerald-400">
                    CORRECT ANSWER 🔥
                  </div>
                ) : (
                  <div className="text-5xl font-black text-red-400">
                    WRONG ANSWER 💀
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}