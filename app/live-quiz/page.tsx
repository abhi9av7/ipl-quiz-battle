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
    question: 'Which player has most IPL runs?',
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [countdownPlayed, setCountdownPlayed] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFinalSuspense, setShowFinalSuspense] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [answerLocked, setAnswerLocked] = useState(false);

  const username =
    typeof window !== 'undefined'
      ? localStorage.getItem('iplUsername')
      : '';

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('score', { ascending: false });

    if (data) {
      setLeaderboard(data);
    }
  };

  useEffect(() => {
    if (showAnswer || showLeaderboard || quizEnded) return;

    if (timer === 5 && !countdownPlayed) {
      const countdownAudio = new Audio('/sounds/countdown5.mp3');
      countdownAudio.volume = 1;
      countdownAudio.play();
      setCountdownPlayed(true);
    }

    if (timer === 0) {
      revealAnswer();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showAnswer, showLeaderboard, quizEnded, countdownPlayed]);

  const revealAnswer = async () => {
    setShowAnswer(true);

    if (selectedAnswer === questions[currentQuestion].correct) {
      const newScore = score + 10;
      setScore(newScore);

      await supabase
        .from('players')
        .update({ score: newScore })
        .eq('username', username);
    }

    setTimeout(async () => {
      await fetchLeaderboard();
    }, 2000);

    setTimeout(() => {
      setShowAnswer(false);
      setShowLeaderboard(true);

      setTimeout(() => {
        setShowLeaderboard(false);

        if (currentQuestion + 1 >= questions.length) {
          setShowFinalSuspense(true);
          setTimeout(() => {
            setQuizEnded(true);
            window.location.href = '/final-standings';
          }, 5000);
          return;
        }

        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setAnswerLocked(false);
        setTimer(15);
        setCountdownPlayed(false);
      }, 5000);
    }, 2000);
  };

  const question = questions[currentQuestion];

  if (showFinalSuspense) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center text-white text-center px-6">
        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-black/85" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
          <div className="text-5xl font-black text-yellow-400 leading-tight">FINAL RESULTS</div>
          <div className="mt-4 text-xl text-white/70">Calculating Final Standings...</div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="mt-6 w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center px-8 py-4">
        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-black/85" />
        <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-4xl font-black text-yellow-400 text-center mb-6">
          LIVE LEADERBOARD
        </motion.h1>
        <div className="relative z-10 w-full max-w-3xl flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence>
            {leaderboard.map((player, index) => (
              <motion.div layout key={player.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center justify-between rounded-xl border px-6 py-3 ${index === 0 ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_20px_rgba(255,200,0,0.15)]' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className="text-xl font-black text-yellow-300">#{index + 1}</div>
                  <div className="text-xl font-bold">{player.username}</div>
                </div>
                <div className="text-xl font-black text-emerald-400">{player.score}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white flex flex-col justify-between p-6">
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.15),transparent_60%)]" />

      {/* TOP HEADER */}
      <div className="relative z-20 flex items-center justify-between w-full px-4">
        <div className="flex flex-col bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5 min-w-[120px]">
          <div className="text-[10px] tracking-[3px] text-yellow-300 font-bold uppercase">Question</div>
          <div className="text-3xl font-black mt-0.5">{currentQuestion + 1}<span className="text-white/30 text-xl">/{questions.length}</span></div>
        </div>

        <div className="flex flex-col items-center">
          <motion.div animate={timer <= 5 ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }} className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 bg-black/60 backdrop-blur-md ${timer <= 5 ? 'border-red-500 text-red-400 shadow-[0_0_30px_rgba(255,0,0,0.5)]' : 'border-yellow-400 text-yellow-300 shadow-[0_0_20px_rgba(255,200,0,0.3)]'}`}>
            {timer}
          </motion.div>
          <div className="mt-1 text-[10px] tracking-[6px] text-yellow-300/60 font-black uppercase">IPL Quiz Night</div>
        </div>

        <div className="flex flex-col items-end bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5 min-w-[120px]">
          <div className="text-[10px] tracking-[3px] text-cyan-300 font-bold uppercase">Score</div>
          <div className="text-3xl font-black mt-0.5 text-cyan-400">{score}</div>
        </div>
      </div>

      {/* MAIN GAMEBOARD */}
      <div className="relative z-10 flex flex-col justify-center items-center flex-1 w-full max-w-5xl mx-auto px-4">
        <motion.div key={currentQuestion} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.02)] flex flex-col justify-between">
          <div className="border-b border-white/10 pb-4 min-h-[80px] flex items-center justify-center">
            <h1 className="text-3xl font-black leading-tight text-center tracking-wide text-white drop-shadow-md">
              {question.question}
            </h1>
          </div>

          {/* 2x2 GRID */}
          <div className="grid grid-cols-2 gap-4 w-full my-4">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct;
              const isSelected = selectedAnswer === index;

              return (
                <motion.button
                  key={index}
                  whileTap={!answerLocked ? { scale: 0.99 } : {}}
                  whileHover={!answerLocked ? { scale: 1.01 } : {}}
                  disabled={answerLocked}
                  onClick={() => { if (!answerLocked) setSelectedAnswer(index); }}
                  className={`relative overflow-hidden rounded-xl border px-6 py-3 text-left text-lg font-bold transition-all duration-200 h-[68px] flex items-center gap-4 ${
                    !showAnswer
                      ? isSelected ? 'border-yellow-400 bg-yellow-500/20 shadow-[0_0_20px_rgba(255,200,0,0.3)]' : 'border-white/10 bg-white/5 hover:bg-white/10'
                      : isCorrect ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_25px_rgba(0,255,120,0.3)] text-emerald-300'
                      : isSelected ? 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(255,0,0,0.3)] text-red-300' : 'border-white/10 bg-white/5 opacity-30'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-sm shrink-0 text-yellow-300 font-black">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1 leading-snug truncate">{option}</div>
                </motion.button>
              );
            })}
          </div>

          <div className="h-10 flex items-center justify-center">
            <AnimatePresence>
              {showAnswer && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="font-black text-2xl tracking-widest text-center">
                  {selectedAnswer === question.correct ? (
                    <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">CORRECT 🔥 +10 PTS</span>
                  ) : (
                    <span className="text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">WRONG ANSWER 💀</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ACTION */}
      <div className="relative z-20 w-full max-w-xl mx-auto pb-2">
        <AnimatePresence mode="wait">
          {!showAnswer && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                if (selectedAnswer !== null) {
                  setAnswerLocked(true);
                  const lockAudio = new Audio('/sounds/lock.mp3');
                  lockAudio.volume = 0.7;
                  lockAudio.play();
                }
              }}
              disabled={selectedAnswer === null || answerLocked}
              className={`w-full py-3.5 rounded-xl text-lg font-black tracking-wider transition-all duration-300 ${
                selectedAnswer !== null && !answerLocked
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-[0_0_25px_rgba(255,180,0,0.4)] hover:brightness-110'
                  : answerLocked ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-white/40 cursor-not-allowed'
              }`}
            >
              {answerLocked ? 'ANSWER LOCKED 🔒' : 'LOCK ANSWER 🔒'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}