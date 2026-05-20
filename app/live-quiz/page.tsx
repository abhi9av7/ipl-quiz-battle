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

  const [answerLocked, setAnswerLocked] =
    useState(false);

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

      // WAIT FOR ALL PLAYERS
      setTimeout(async () => {

        await fetchLeaderboard();

      }, 2000);

      // SHOW ANSWER
      setTimeout(() => {

        setShowAnswer(false);

        setShowLeaderboard(true);

        // LEADERBOARD
        setTimeout(() => {

          setShowLeaderboard(false);

          // FINAL QUESTION?
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

          setAnswerLocked(false);

          setTimer(15);

          setCountdownPlayed(
            false
          );

        }, 5000);

      }, 2000);
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
          <div className="text-4xl md:text-9xl font-black text-yellow-400 leading-tight">
            FINAL RESULTS
          </div>

          <div className="mt-5 text-lg md:text-3xl text-white/70">
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
            className="mt-8 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  // LIVE LEADERBOARD
  if (showLeaderboard) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center px-4 py-10">

        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />

        <div className="absolute inset-0 bg-black/85" />

        <motion.h1
          initial={{
            opacity: 0,
            y: -40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative z-10 text-3xl md:text-7xl font-black text-yellow-400 text-center leading-tight"
        >
          LIVE
          <br />
          LEADERBOARD
        </motion.h1>

        {/* LEADERBOARD */}
        <div className="relative z-10 mt-8 w-full max-w-md flex flex-col gap-4">

          <AnimatePresence>

            {leaderboard.map(
              (
                player,
                index
              ) => (
                <motion.div
                  layout
                  key={player.id}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    layout: {
                      duration: 1.5,
                    },
                  }}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4

                  ${
                    index === 0
                      ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_40px_rgba(255,200,0,0.2)]'
                      : 'border-white/10 bg-white/5'
                  }
                  `}
                >

                  <div className="flex items-center gap-4">

                    <div className="text-2xl font-black text-yellow-300">
                      #{index + 1}
                    </div>

                    <div className="text-xl font-bold">
                      {
                        player.username
                      }
                    </div>
                  </div>

                  <div className="text-2xl font-black text-emerald-400">
                    {player.score}
                  </div>

                </motion.div>
              )
            )}

          </AnimatePresence>

        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />

      <div className="absolute inset-0 bg-black/75" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.15),transparent_60%)]" />

      {/* TOP SECTION */}
      <div className="relative z-20 flex flex-col items-center justify-center pt-6 px-4">

        {/* QUESTION + SCORE */}
        <div className="w-full max-w-md flex items-start justify-between">

          {/* QUESTION */}
          <div>
            <div className="text-[11px] tracking-[3px] text-yellow-300">
              QUESTION
            </div>

            <div className="text-2xl font-black leading-none mt-1">
              {currentQuestion + 1}

              <span className="text-white/30">
                /{questions.length}
              </span>
            </div>
          </div>

          {/* SCORE */}
          <div className="text-right">
            <div className="text-[11px] tracking-[3px] text-cyan-300">
              SCORE
            </div>

            <div className="text-2xl font-black leading-none mt-1">
              {score}
            </div>
          </div>
        </div>

        {/* TIMER */}
        <motion.div
          animate={
            timer <= 5
              ? {
                  scale: [
                    1,
                    1.1,
                    1,
                  ],
                }
              : {}
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
          }}
          className={`mt-5 w-24 h-24 rounded-full flex items-center justify-center text-5xl font-black border-4

          ${
            timer <= 5
              ? 'border-red-500 text-red-400 shadow-[0_0_50px_rgba(255,0,0,0.7)]'
              : 'border-yellow-400 text-yellow-300 shadow-[0_0_40px_rgba(255,200,0,0.5)]'
          }
          `}
        >
          {timer}
        </motion.div>

        {/* TITLE */}
        <div className="mt-4 text-[11px] tracking-[5px] text-yellow-300 text-center">
          IPL QUIZ NIGHT
        </div>
      </div>

      {/* MAIN */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-220px)] px-4 pb-28 pt-5 text-center">

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
          className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-5 shadow-[0_0_60px_rgba(255,255,255,0.05)]"
        >

          {/* Question */}
          <h1 className="text-4xl font-black leading-tight">
            {question.question}
          </h1>

          {/* OPTIONS */}
          <div className="mt-7 flex flex-col gap-4">

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
                    whileTap={{
                      scale: 0.97,
                    }}
                    disabled={
                      answerLocked
                    }
                    onClick={() => {

                      if (
                        !answerLocked
                      ) {
                        setSelectedAnswer(
                          index
                        );
                      }
                    }}
                    className={`relative overflow-hidden rounded-2xl border px-4 py-4 text-left text-lg font-bold transition-all duration-300

                    ${
                      !showAnswer
                        ? isSelected
                          ? 'border-yellow-400 bg-yellow-500/20 shadow-[0_0_40px_rgba(255,200,0,0.4)]'
                          : 'border-white/10 bg-white/5'
                        : isCorrect
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_50px_rgba(0,255,120,0.4)]'
                        : isSelected
                        ? 'border-red-500 bg-red-500/20 shadow-[0_0_40px_rgba(255,0,0,0.4)]'
                        : 'border-white/10 bg-white/5 opacity-60'
                    }
                  `}
                  >
                    <div className="flex items-center gap-4">

                      {/* LETTER */}
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </div>

                      {/* OPTION */}
                      <div className="flex-1 leading-snug">
                        {option}
                      </div>
                    </div>

                  </motion.button>
                );
              }
            )}

          </div>

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
                className="mt-7"
              >

                {selectedAnswer ===
                question.correct ? (
                  <div className="text-3xl font-black text-emerald-400">
                    CORRECT 🔥
                  </div>
                ) : (
                  <div className="text-3xl font-black text-red-400">
                    WRONG 💀
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>

        </motion.div>

        {/* LOCK BUTTON */}
        {!showAnswer && (
          <div className="fixed bottom-5 left-0 right-0 px-4 z-50">

            <motion.button
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => {

                if (
                  selectedAnswer !== null
                ) {

                  setAnswerLocked(
                    true
                  );

                  const lockAudio =
                    new Audio(
                      '/sounds/lock.mp3'
                    );

                  lockAudio.volume =
                    0.7;

                  lockAudio.play();
                }
              }}
              disabled={
                selectedAnswer ===
                null ||
                answerLocked
              }
              className={`w-full max-w-md mx-auto py-4 rounded-2xl text-xl font-black transition-all duration-300

                ${
                  selectedAnswer !==
                    null &&
                  !answerLocked
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-[0_0_50px_rgba(255,180,0,0.6)]'
                    : answerLocked
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-800 text-white/40 cursor-not-allowed'
                }
              `}
            >
              {answerLocked
                ? 'ANSWER LOCKED 🔒'
                : 'LOCK ANSWER 🔒'}
            </motion.button>

          </div>
        )}

      </div>
    </div>
  );
}