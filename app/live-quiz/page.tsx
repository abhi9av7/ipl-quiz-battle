'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// 🔥 All 30 categorized IPL questions cleanly integrated here
const questions = [
  // ================= EASY LEVEL (1-10) =================
  {
    question: "Which team won the inaugural season of the IPL in 2008?",
    options: ["Chennai Super Kings", "Rajasthan Royals", "Mumbai Indians", "Delhi Daredevils"],
    correct: 1,
  },
  {
    question: "Who scored the first-ever century in IPL history in the opening match of 2008?",
    options: ["Chris Gayle", "Brendon McCullum", "Sachin Tendulkar", "AB de Villiers"],
    correct: 1,
  },
  {
    question: "Which Australian player captained Sunrisers Hyderabad (SRH) for multiple years and led them to a title win?",
    options: ["Glenn Maxwell", "David Warner", "Steve Smith", "Aaron Finch"],
    correct: 1,
  },
  {
    question: "In which year did Mumbai Indians win their first-ever IPL title?",
    options: ["2011", "2012", "2013", "2015"],
    correct: 2,
  },
  {
    question: "Which famous IPL captain is widely known by the nickname 'Thala'?",
    options: ["Rohit Sharma", "Virat Kohli", "MS Dhoni", "Gautam Gambhir"],
    correct: 2,
  },
  {
    question: "Which team uses the M. Chinnaswamy Stadium, known for its high-scoring matches, as their home ground?",
    options: ["Kolkata Knight Riders", "Royal Challengers Bengaluru", "Punjab Kings", "Mumbai Indians"],
    correct: 1,
  },
  {
    question: "Two new teams were added to the IPL in 2022. One was Gujarat Titans, who was the second team?",
    options: ["Lucknow Super Giants", "Kochi Tuskers", "Pune Warriors", "Rising Pune Supergiant"],
    correct: 0,
  },
  {
    question: "Who holds the record for the highest individual score in an IPL inning with a massive 175* runs?",
    options: ["AB de Villiers", "Chris Gayle", "Andre Russell", "Kieron Pollard"],
    correct: 1,
  },
  {
    question: "Which nickname was given to Suresh Raina due to his incredible consistency and heavy run-scoring for CSK?",
    options: ["Mr. IPL", "Corporate King", "Run Machine", "Captain Cool"],
    correct: 0,
  },
  {
    question: "How many times did Kolkata Knight Riders (KKR) win the IPL trophy under Gautam Gambhir's captaincy?",
    options: ["1 time", "2 times", "3 times", "Never"],
    correct: 1,
  },

  // ================= MEDIUM LEVEL (11-20) =================
  {
    question: "Who was the first Indian player to win the prestigious IPL 'Orange Cap'?",
    options: ["Virat Kohli", "Sachin Tendulkar", "Robin Uthappa", "Suresh Raina"],
    correct: 1,
  },
  {
    question: "Which bowler has delivered the highest number of dot balls in IPL history?",
    options: ["Bhuvneshwar Kumar", "Sunil Narine", "Yuzvendra Chahal", "Ravichandran Ashwin"],
    correct: 0,
  },
  {
    question: "Who is the only player in IPL history to win the 'Player of the Tournament' (MVP) award in the inaugural 2008 season?",
    options: ["Shane Warne", "Yusuf Pathan", "Shane Watson", "Sanath Jayasuriya"],
    correct: 2,
  },
  {
    question: "Which two teams competed in the first-ever Super Over match in IPL history during the 2009 season?",
    options: ["RR & KKR", "MI & RCB", "CSK & PBKS", "DC & SRH"],
    correct: 0,
  },
  {
    question: "Which overseas player holds the record for the fastest century in IPL history, reaching it in just 30 balls?",
    options: ["AB de Villiers", "Travis Head", "Chris Gayle", "David Miller"],
    correct: 2,
  },
  {
    question: "Hardik Pandya was scouted and bought by Mumbai Indians in the 2015 auction for what base price?",
    options: ["10 Lakhs", "20 Lakhs", "50 Lakhs", "1 Crore"],
    correct: 1,
  },
  {
    question: "Which legendary spinner holds the unique record of taking three hat-tricks for three different teams in the IPL?",
    options: ["Harbhajan Singh", "Amit Mishra", "Piyush Chawla", "Yuzvendra Chahal"],
    correct: 1,
  },
  {
    question: "Who was the captain of the Deccan Chargers squad when they lifted their only IPL trophy in 2009?",
    options: ["VVS Laxman", "Adam Gilchrist", "Rohit Sharma", "Kumar Sangakkara"],
    correct: 1,
  },
  {
    question: "Who is the youngest player to score a century in IPL history?",
    options: ["Yashasvi Jaiswal", "Manish Pandey", "Shubman Gill", "Prithvi Shaw"],
    correct: 1,
  },
  {
    question: "Which player has featured in the highest number of IPL tournament finals in history?",
    options: ["Rohit Sharma", "MS Dhoni", "Suresh Raina", "Ravindra Jadeja"],
    correct: 1,
  },

  // ================= HARD LEVEL (21-30) =================
  {
    question: "Who was the first bowler to bowl a maiden over in the history of the IPL?",
    options: ["Glenn McGrath", "Praveen Kumar", "Brett Lee", "Ishant Sharma"],
    correct: 0,
  },
  {
    question: "In the infamous match where RCB was bowled out for 49 against KKR in 2017, how many RCB batsmen scored in double digits?",
    options: ["Zero", "One", "Two", "Three"],
    correct: 0,
  },
  {
    question: "Who is the first overseas player to reach the milestone of playing 100 matches for a single IPL franchise?",
    options: ["AB de Villiers", "Kieron Pollard", "Lasith Malinga", "David Warner"],
    correct: 1,
  },
  {
    question: "Aaron Finch holds a unique record of playing for how many different unique franchises across his IPL career?",
    options: ["6", "7", "8", "9"],
    correct: 3,
  },
  {
    question: "Which bowler holds the record for the best bowling figures (5/5) in an IPL match by an uncapped Indian player?",
    options: ["Akash Madhwal", "Mayank Yadav", "Ankit Rajpoot", "Mohit Sharma"],
    correct: 0,
  },
  {
    question: "Who was the first player ever to be officially traded between two franchises in IPL history?",
    options: ["Shikhar Dhawan", "Zaheer Khan", "Robin Uthappa", "Dinesh Karthik"],
    correct: 0,
  },
  {
    question: "In the 2022 Mega Auction, who was the most expensive uncapped Indian player bought by any franchise?",
    options: ["Shahrukh Khan", "Rahul Tewatia", "Avesh Khan", "Ishan Kishan"],
    correct: 2,
  },
  {
    question: "Who was the captain of Kings XI Punjab during the 2014 season when they reached their first and only IPL final?",
    options: ["Adam Gilchrist", "George Bailey", "Virender Sehwag", "David Miller"],
    correct: 1,
  },
  {
    question: "Who is the only bowler in IPL history to have delivered two maiden overs in a single IPL match?",
    options: ["Dale Steyn", "Mohammed Siraj", "Bhuvneshwar Kumar", "Trent Boult"],
    correct: 1,
  },
  {
    question: "Who was the first Indian batsman to face the very first ball and score the first run in IPL history back in 2008?",
    options: ["Sourav Ganguly", "Wasim Jaffer", "Rahul Dravid", "Sachin Tendulkar"],
    correct: 0,
  }
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

  // Lifeline States
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  const currentScoreRef = useRef(0);

  const username =
    typeof window !== 'undefined'
      ? localStorage.getItem('iplUsername')
      : '';

  useEffect(() => {
    currentScoreRef.current = score;
  }, [score]);

  // BACK-GROUND MUSIC MANAGEMENT (UPGRADED TO 2% VOLUME)
  useEffect(() => {
    if (showFinalSuspense) return;

    const bgAudio = new Audio('/sounds/bg-stadium.mp3');
    bgAudio.volume = 0.02; // 🔥 Formatted explicitly to 2% volume as requested
    bgAudio.loop = true;
    
    const startAudio = () => {
      bgAudio.play().catch(() => {
        console.log('Interactivity requirement handled');
      });
    };

    startAudio();

    return () => {
      bgAudio.pause();
      bgAudio.currentTime = 0;
    };
  }, [showFinalSuspense]);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('score', { ascending: false });

    if (data) {
      setLeaderboard(data);
    }
  };

  // TIMER AND AUTOMATIC SEQUENCE SYSTEM (COUNTDOWN DROPPED TO 50% VOLUME)
  useEffect(() => {
    if (showAnswer || showLeaderboard || quizEnded || showFinalSuspense) return;

    if (timer === 5 && !countdownPlayed) {
      const countdownAudio = new Audio('/sounds/countdown5.mp3');
      countdownAudio.volume = 0.5; // 📉 Scaled down to 50% volume to prevent high peaks
      countdownAudio.play().catch(e => console.log('Audio play blocked'));
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
  }, [timer, showAnswer, showLeaderboard, quizEnded, countdownPlayed, showFinalSuspense]);

  // STABLE SCORE CALCULATOR (SPEED BONUS REMOVED)
  const revealAnswer = async () => {
    setShowAnswer(true);

    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      const correctAudio = new Audio('/sounds/correct.mp3');
      correctAudio.volume = 0.8;
      correctAudio.play().catch(e => console.log('Audio error'));
    } else {
      const incorrectAudio = new Audio('/sounds/incorrect.mp3');
      incorrectAudio.volume = 0.8;
      incorrectAudio.play().catch(e => console.log('Audio error'));
    }

    if (isCorrect) {
      // Direct solid 10 points reward
      const totalTurnPoints = 10;
      const newScore = currentScoreRef.current + totalTurnPoints;
      
      setScore(newScore);

      if (username) {
        const { error } = await supabase
          .from('players')
          .update({ score: newScore })
          .eq('username', username);
          
        if (error) console.error("Database Score Write Crash:", error.message);
      }
    }

    setTimeout(async () => {
      await fetchLeaderboard();
    }, 2000);

    setTimeout(() => {
      setShowAnswer(false);
      
      if (currentQuestion + 1 >= questions.length) {
        setShowFinalSuspense(true);
        
        setTimeout(() => {
          const suspenseAudio = new Audio('/sounds/suspense.mp3');
          suspenseAudio.volume = 0.9;
          suspenseAudio.play().catch(e => console.log('Audio error'));
        }, 1000);

        setTimeout(() => {
          setQuizEnded(true);
          window.location.href = '/final-standings?triggerFah=true';
        }, 6000);
        return;
      }

      setShowLeaderboard(true);

      setTimeout(() => {
        setShowLeaderboard(false);
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setAnswerLocked(false);
        setHiddenOptions([]); 
        setTimer(15);
        setCountdownPlayed(false);
      }, 5000);
    }, 2000);
  };

  const handleLifeline = () => {
    if (lifelineUsed || answerLocked || showAnswer) return;
    
    const currentCorrect = questions[currentQuestion].correct;
    const incorrectIndices: number[] = [];
    
    questions[currentQuestion].options.forEach((_, idx) => {
      if (idx !== currentCorrect) incorrectIndices.push(idx);
    });

    const shuffledWrong = incorrectIndices.sort(() => 0.5 - Math.random());
    const toHide = [shuffledWrong[0], shuffledWrong[1]];
    
    setHiddenOptions(toHide);
    setLifelineUsed(true);

    if (selectedAnswer !== null && toHide.includes(selectedAnswer)) {
      setSelectedAnswer(null);
    }
  };

  const question = questions[currentQuestion];

  if (showFinalSuspense) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center text-white text-center px-6">
        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-25 scale-110 transition-transform duration-[5000ms]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/95 to-black" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 space-y-6">
          <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-500 tracking-widest animate-pulse drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]">
            CALCULATING FINAL STANDINGS
          </div>
          <div className="text-2xl text-zinc-400 font-bold tracking-widest uppercase">Who took the crown? Preparing final scorecard...</div>
          <div className="relative w-24 h-24 mx-auto mt-8 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border-4 border-t-yellow-400 border-r-transparent border-b-orange-500 border-l-transparent rounded-full shadow-[0_0_20px_rgba(234,179,8,0.2)]" />
            <div className="text-yellow-400 text-sm font-black tracking-widest animate-ping">IPL</div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-[#07070a] text-white flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center, transparent_10%, #07070a_85%)" />
        
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-5xl font-black tracking-widest text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-200 drop-shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          LIVE ARENA STANDINGS
        </motion.h1>
        
        <div className="relative z-10 w-full max-w-3xl flex flex-col gap-3.5 max-h-[58vh] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {leaderboard.map((player, index) => (
              <motion.div 
                layout 
                key={player.id} 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`flex items-center justify-between rounded-2xl border px-8 py-4.5 transition-all duration-300 ${
                  index === 0 
                    ? 'border-yellow-400/60 bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-transparent shadow-[0_0_35px_rgba(234,179,8,0.25)]' 
                    : 'border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`text-2xl font-black px-3.5 py-1 rounded-xl shadow-inner ${index === 0 ? 'bg-yellow-400 text-black' : 'text-zinc-400 bg-zinc-800/80'}`}>
                    #{index + 1}
                  </div>
                  <div className="text-2xl font-black tracking-wide text-zinc-100">{player.username}</div>
                </div>
                <div className={`text-2xl font-black tracking-wider ${index === 0 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'text-cyan-400'}`}>
                  {player.score} <span className="text-xs text-zinc-500 font-extrabold uppercase tracking-widest">PTS</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#040406] text-white flex flex-col justify-between p-6 select-none">
      <div className="absolute inset-0 bg-[url('/images/stadium.jpg')] bg-cover bg-center opacity-15 mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-[#040406]" />
      <div className="absolute top-0 inset-x-0 h-[400px] bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.15),transparent_60%)]" />

      {/* TOP META ROW */}
      <div className="relative z-20 flex items-center justify-between w-full px-6">
        <div className="flex flex-col bg-zinc-900/90 backdrop-blur-2xl px-6 py-3.5 rounded-2xl border border-zinc-800/80 shadow-2xl">
          <div className="text-[10px] tracking-[4px] text-zinc-500 font-black uppercase">Arena Round</div>
          <div className="text-3xl font-black tracking-tighter text-yellow-400 mt-0.5">
            {currentQuestion + 1}<span className="text-zinc-600 font-medium text-lg">/{questions.length}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <motion.div 
            animate={timer <= 5 ? { scale: [1, 1.05, 1], borderColor: ['#ef4444', '#b91c1c', '#ef4444'] } : {}} 
            transition={{ duration: 0.8, repeat: Infinity }} 
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 bg-zinc-950/90 backdrop-blur-2xl transition-all duration-300 shadow-2xl ${
              timer <= 5
                ? 'text-red-400 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.4)]'
                : 'border-yellow-400 text-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.25)]'
            }`}
          >
            {timer}
          </motion.div>
          <div className="mt-2 text-[9px] tracking-[6px] text-zinc-500 font-black uppercase">IPL LIVE DECK</div>
        </div>

        <div className="flex flex-col items-end bg-zinc-900/90 backdrop-blur-2xl px-6 py-3.5 rounded-2xl border border-zinc-800/80 shadow-2xl">
          <div className="text-[10px] tracking-[4px] text-zinc-500 font-black uppercase">Your Score</div>
          <div className="text-3xl font-black tracking-tight text-cyan-400 mt-0.5 drop-shadow-[0_0_12px_rgba(34,211,238,0.2)]">
            {score}
          </div>
        </div>
      </div>

      {/* THE CONSOLE PLATE */}
      <div className="relative z-10 flex flex-col justify-center items-center flex-1 w-full max-w-5xl mx-auto px-4 mt-2">
        
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={handleLifeline}
            disabled={lifelineUsed || answerLocked || showAnswer}
            className={`px-6 py-2.5 rounded-xl text-sm font-black tracking-widest uppercase transition-all duration-300 border shadow-md flex items-center gap-3 active:scale-95 ${
              lifelineUsed 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-40 line-through'
                : 'bg-zinc-950 border-amber-500/40 text-amber-400 shadow-[0_4px_15px_rgba(234,179,8,0.15)] hover:border-yellow-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${lifelineUsed ? 'bg-zinc-800 text-zinc-600' : 'bg-yellow-400 text-black'}`}>LIFELINE</span>
            <span>50:50</span>
          </button>
        </div>

        <motion.div 
          key={currentQuestion} 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 1 }} 
          className="w-full rounded-[28px] border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-3xl p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between border-t-zinc-700/30"
        >
          <div className="border-b border-zinc-800/50 pb-6 min-h-[90px] flex items-center justify-center">
            <h1 className="text-3xl font-black leading-snug text-center tracking-wide text-zinc-100 px-2 drop-shadow-md">
              {question.question}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full my-5">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct;
              const isSelected = selectedAnswer === index;
              const isHidden = hiddenOptions.includes(index);

              return (
                <motion.button
                  key={index}
                  whileTap={!answerLocked && !isHidden ? { scale: 0.99 } : {}}
                  whileHover={!answerLocked && !isHidden ? { scale: 1.01 } : {}}
                  disabled={answerLocked || isHidden}
                  onClick={() => { if (!answerLocked && !isHidden) setSelectedAnswer(index); }}
                  className={`relative overflow-hidden rounded-xl border px-6 py-3 text-left text-lg font-black transition-all duration-300 h-[72px] flex items-center gap-4 ${
                    isHidden 
                      ? 'opacity-0 pointer-events-none' 
                      : !showAnswer
                      ? isSelected 
                        ? 'border-yellow-400 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 shadow-[0_0_25px_rgba(234,179,8,0.25)] text-yellow-300' 
                        : 'border-zinc-800 bg-zinc-950/50 hover:bg-zinc-800/40 text-zinc-300 hover:text-white'
                      : isCorrect 
                      ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.35)] text-emerald-300' 
                      : isSelected 
                      ? 'border-red-500 bg-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.3)] text-red-300' 
                      : 'border-zinc-900 bg-zinc-950/10 text-zinc-600 opacity-20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm shrink-0 font-black tracking-wider transition-colors ${
                    isSelected ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-zinc-900 text-zinc-400 border-zinc-700/60'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1 leading-snug truncate tracking-wide">{option}</div>
                </motion.button>
              );
            })}
          </div>

          <div className="h-10 flex items-center justify-center">
            <AnimatePresence>
              {showAnswer && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-black text-2xl tracking-widest text-center">
                  {selectedAnswer === question.correct ? (
                    <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                      ✓ CORRECT ANSWER (+10 PTS)
                    </span>
                  ) : (
                    <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                      ✕ INCORRECT DECISION
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 w-full max-w-md mx-auto pb-2">
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
                  lockAudio.volume = 1.0;
                  lockAudio.play().catch(e => console.log('Audio error'));
                }
              }}
              disabled={selectedAnswer === null || answerLocked}
              className={`w-full py-3.5 rounded-xl text-xl font-extrabold tracking-widest transition-all duration-300 shadow-xl uppercase border ${
                selectedAnswer !== null && !answerLocked
                  ? 'bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-500 text-zinc-950 border-yellow-300 shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:brightness-110 font-black'
                  : answerLocked 
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                  : 'bg-zinc-900/50 text-zinc-600 border-zinc-800/80 cursor-not-allowed'
              }`}
            >
              {answerLocked ? 'SYSTEM LOCKED 🔒' : 'FINALIZE SELECTION 🔒'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}