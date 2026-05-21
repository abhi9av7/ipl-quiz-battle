'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// PASTE YOUR 30 QUESTIONS HERE
const questions = [
  {
    question: 'Who won IPL 2016?',
    options: ['Mumbai Indians', 'Sunrisers Hyderabad', 'Royal Challengers Bangalore', 'Chennai Super Kings'],
    correct: 1,
  },
  {
    question: 'Who is called Mr. IPL?',
    options: ['Virat Kohli', 'MS Dhoni', 'Suresh Raina', 'Rohit Sharma'],
    correct: 2,
  },
  {
    question: 'Which player has most IPL runs?',
    options: ['Rohit Sharma', 'Virat Kohli', 'David Warner', 'KL Rahul'],
    correct: 1,
  },
  // ... add more till 30
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
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  // 🔥 SPEED BONUS FIX: Real-time timer tracking
  const timerRef = useRef(15);
  const username = typeof window !== 'undefined' ? localStorage.getItem('iplUsername') : '';

  useEffect(() => {
    if (showFinalSuspense) return;
    const bgAudio = new Audio('/sounds/bg-stadium.mp3');
    bgAudio.volume = 0.01; // Ultra subtle (1%)
    bgAudio.loop = true;
    bgAudio.play().catch(() => console.log('Autoplay handled'));
    return () => { bgAudio.pause(); bgAudio.currentTime = 0; };
  }, [showFinalSuspense]);

  useEffect(() => {
    if (showAnswer || showLeaderboard || quizEnded || showFinalSuspense) return;

    if (timer === 5 && !countdownPlayed) {
      const countdownAudio = new Audio('/sounds/countdown5.mp3');
      countdownAudio.play().catch(e => console.log('Audio error'));
      setCountdownPlayed(true);
    }

    if (timer === 0) {
      revealAnswer();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        const next = prev - 1;
        timerRef.current = next; // Sync Ref
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showAnswer, showLeaderboard, quizEnded, countdownPlayed, showFinalSuspense]);

  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('players').select('*').order('score', { ascending: false });
    if (data) setLeaderboard(data);
  };

  const revealAnswer = async () => {
    setShowAnswer(true);
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    // Play sounds
    new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3').play().catch(e => {});

    if (isCorrect) {
      const bonus = timerRef.current; // Accurate speed bonus
      const totalPoints = 10 + bonus;
      const newScore = score + totalPoints;
      setScore(newScore);

      if (username) {
        await supabase.from('players').update({ score: newScore }).eq('username', username);
      }
    }

    setTimeout(() => { fetchLeaderboard(); }, 2000);

    setTimeout(() => {
      setShowAnswer(false);
      if (currentQuestion + 1 >= questions.length) {
        setShowFinalSuspense(true);
        setTimeout(() => { new Audio('/sounds/suspense.mp3').play().catch(e => {}); }, 1000);
        setTimeout(() => { window.location.href = '/final-standings?triggerFah=true'; }, 6000);
        return;
      }

      setShowLeaderboard(true);
      setTimeout(() => {
        setShowLeaderboard(false);
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswerLocked(false);
        setHiddenOptions([]);
        setTimer(15);
        timerRef.current = 15;
        setCountdownPlayed(false);
      }, 5000);
    }, 2000);
  };

  const handleLifeline = () => {
    if (lifelineUsed || answerLocked) return;
    const correctIdx = questions[currentQuestion].correct;
    const incorrect = questions[currentQuestion].options.map((_, i) => i).filter(i => i !== correctIdx);
    const toHide = incorrect.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
    setLifelineUsed(true);
  };

  const question = questions[currentQuestion];

  if (showFinalSuspense) {
    return (
      <div className="relative h-screen w-screen bg-black flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover opacity-20 scale-110" />
        <div className="relative z-10 text-center space-y-4">
          <h1 className="text-7xl font-black text-yellow-400 animate-pulse tracking-tighter">CALCULATING STANDINGS</h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest">Who won the battle? Loading results...</p>
        </div>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <div className="relative h-screen w-screen bg-[#07070a] text-white flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover opacity-10" />
        <h1 className="relative z-10 text-5xl font-black mb-8 text-yellow-400">ARENA STANDINGS</h1>
        <div className="relative z-10 w-full max-w-2xl space-y-3 overflow-y-auto max-h-[60vh] pr-2">
          {leaderboard.map((player, index) => (
            <div key={player.id} className={`flex justify-between p-4 rounded-xl border ${index === 0 ? 'border-yellow-400 bg-yellow-400/10' : 'border-zinc-800 bg-zinc-900/40'}`}>
              <div className="flex gap-4 font-black">
                <span className={index === 0 ? 'text-yellow-400' : 'text-zinc-500'}>#{index + 1}</span>
                <span>{player.username}</span>
              </div>
              <span className="font-black text-cyan-400">{player.score} PTS</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#040406] text-white flex flex-col justify-between p-6">
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover opacity-10" />
      
      <div className="relative z-10 flex justify-between items-center px-4">
        <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
          <p className="text-[10px] text-zinc-500 font-black tracking-widest">ROUND</p>
          <p className="text-3xl font-black text-yellow-400">{currentQuestion + 1}/{questions.length}</p>
        </div>
        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl font-black ${timer <= 5 ? 'border-red-500 text-red-500 animate-pulse' : 'border-yellow-400 text-yellow-400'}`}>
          {timer}
        </div>
        <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 text-right">
          <p className="text-[10px] text-zinc-500 font-black tracking-widest">SCORE</p>
          <p className="text-3xl font-black text-cyan-400">{score}</p>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="flex justify-end mb-4">
          <button onClick={handleLifeline} disabled={lifelineUsed || answerLocked || showAnswer} className={`px-6 py-2 rounded-xl font-black border transition-all ${lifelineUsed ? 'opacity-30 line-through' : 'border-amber-500 text-amber-500 hover:bg-amber-500/10'}`}>
            50:50
          </button>
        </div>
        <div className="bg-zinc-900/30 backdrop-blur-3xl p-8 rounded-[32px] border border-zinc-800 shadow-2xl">
          <h2 className="text-3xl font-black text-center mb-8">{question.question}</h2>
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((opt, i) => (
              <button
                key={i}
                disabled={answerLocked || hiddenOptions.includes(i)}
                onClick={() => setSelectedAnswer(i)}
                className={`p-4 rounded-xl border-2 text-left font-bold transition-all flex gap-4 items-center ${hiddenOptions.includes(i) ? 'opacity-0 pointer-events-none' : 
                showAnswer ? (i === question.correct ? 'border-emerald-500 bg-emerald-500/20' : selectedAnswer === i ? 'border-red-500 bg-red-500/20' : 'border-zinc-800 opacity-20') :
                selectedAnswer === i ? 'border-yellow-400 bg-yellow-400/10' : 'border-zinc-800 bg-zinc-950/50'}`}
              >
                <span className="w-8 h-8 bg-zinc-800 flex items-center justify-center rounded-lg text-sm">{String.fromCharCode(65+i)}</span>
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-6 h-8 text-center text-xl font-black">
            {showAnswer && (
              <span className={selectedAnswer === question.correct ? 'text-emerald-400' : 'text-red-500'}>
                {selectedAnswer === question.correct ? `✓ CORRECT (+${10 + timerRef.current} PTS)` : '✕ INCORRECT'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-xs mx-auto w-full mb-4">
        {!showAnswer && (
          <button 
            onClick={() => { setAnswerLocked(true); new Audio('/sounds/lock.mp3').play(); }} 
            disabled={selectedAnswer === null || answerLocked}
            className={`w-full py-4 rounded-2xl font-black tracking-widest border transition-all ${selectedAnswer !== null && !answerLocked ? 'bg-yellow-400 text-black border-yellow-500 shadow-lg' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}
          >
            {answerLocked ? 'LOCKED 🔒' : 'LOCK ANSWER'}
          </button>
        )}
      </div>
    </div>
  );
}