import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import playerImg from '../../assets/game_character_1.png';
import backgroundImg from '../../assets/game_background2.png';
import coinImg from '../../assets/game_coin.svg';
import quizAlertImg from '../../assets/game_quiz.svg';
import { fetchQuizByChapterId } from '../../api/study/fetchQuiz';
import { useChapter } from "../../context/ChapterContext";
import { useNavigate } from "react-router-dom";
import { saveCoinToDB } from '../../api/analyze/saveCoinToDB';
import { sendQuizResults } from '../../api/analyze/sendQuizResults';
import pause_btn from '../../assets/pause_btn.svg';
import exit_btn from '../../assets/exit_btn.svg';
import gameQuizTitle from '../../assets/game_quizoverlay_title.svg';
import gameStartTitle from '../../assets/game_startoverlay_title.svg';
import gameStartCoin from '../../assets/game_coin_start.svg';
import gameStartTrap from '../../assets/game_trap_start.svg';
import gameStartQuiz from '../../assets/game_quiz_start.svg';
import gameStartBtn from '../../assets/game_start_btn.svg';

const GameCanvas = styled.canvas`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: auto;
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 10;
  pointer-events: auto;
`;

const CoinDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  
  img {
    width: 30px;
    height: 30px;
  }
`;

const SafeZone = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to top, rgba(0, 150, 0, 0.5), transparent);
  z-index: 5;
  pointer-events: none;
`;

const QuizAlertLine = styled.div`
  position: fixed;
  left: 0;
  width: 100%;
  height: 50px;
  background-image: url(${quizAlertImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 20;
  pointer-events: none;
`;

const CountdownOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
  font-weight: bold;
  color: white;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
  z-index: 15;
  pointer-events: none;
`;

const QuizModal = styled.div`
  position: relative;
  background-color: #FFF1C1;
  border-radius: 20px;
  border: 10px solid #C0935B;
  width: 90%;
  max-width: 600px;
  z-index: 20;
  pointer-events: auto;
`;

const QuizTitleBanner = styled.div`
  position: absolute;
  top: -4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100px;
  z-index: 2;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const QuizContent = styled.div`
  padding: 3rem 2rem 2rem 2rem;
`;

const QuizQuestion = styled.div`
  font-size: 22px;
  color: #333333;
  font-weight: 400;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const QuizButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const QuizButton = styled.button`
  padding: 1rem;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  border-radius: 30px;
  background-color: ${props => props.isOdd ? '#FF6200' : '#FFAA00'};
  color: #ffffff;
  transition: all 0.2s;
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const GameControls = styled.div`
  position: fixed;
  top: 90px;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 10;
  pointer-events: auto;
`;

const ControlButton = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: auto;
`;

const PauseModal = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  min-width: 300px;
`;

const PauseButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  margin: 0.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: #478CEE;
  color: white;
  
  &:hover {
    background-color: #357ABD;
  }
`;

const StartOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: repeat-x;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
  }
`;

const StartModalBox = styled.div`
  background-color: #FFF1C1;
  padding: 0;
  border-radius: 20px;
  text-align: center;
  width: 50%;
  border: 10px solid #C0935B;
  position: relative;
  z-index: 1;
  overflow: visible;
`;

const TitleBanner = styled.div`
  position: absolute;
  top: -4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100px;
  background-image: url(${gameStartTitle});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
`;

const ModalContent = styled.div`
  padding: 2rem;
`;

const TutorialBox = styled.div`
  margin-bottom: 1rem;
  font-size: 16px;
  color: #191919;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TutorialItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  justify-content: center;
  background-color: white;
  padding: 0.8rem;
  border: 3px solid #C0935B;
  border-radius: 20px;
  width: 65%;

  img {
    height: 30px;
  }

  span {
    font-weight: 500;
    color: #2F2F2F;
  }
`;

const TutorialMove = styled.div`
  text-align: center;
  margin: 0;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
`;

const StartButton = styled.button`
  background-image: url(${gameStartBtn});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 200px;
  height: 60px;
  margin-top: 1rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px) scale(1.05);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const StartTitleBanner = styled.div`
  font-family: 'DungeonFighterOnlineBeatBeat', "Noto Sans KR", sans-serif !important;
  font-size: 3rem;
  font-weight: 500;
  margin-bottom: 1rem;
  background: linear-gradient(to bottom, #FF6200, #FFAA00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(1px 1px 0px #333333) 
          drop-shadow(-1px 1px 0px #333333) 
          drop-shadow(1px -1px 0px #333333) 
          drop-shadow(-1px -1px 0px #333333);
`;

const StartSubTitleBanner = styled.div`
  font-weight: 500;
  margin-bottom: 1rem;
  text-align: center;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
  white-space: pre-line;
`;

export default function Game2() {
  const { chapterData } = useChapter();
  const chapterId = chapterData?.chapterId;
  const navigate = useNavigate();
  
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const playerImageRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const coinImageRef = useRef(null);
  const quizAlertImageRef = useRef(null);
  
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [coins, setCoins] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [quizAlertY, setQuizAlertY] = useState(-100);
  const [showQuizAlert, setShowQuizAlert] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const playerRef = useRef({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    speed: 5,
  });
  
  const bulletsRef = useRef([]);
  const virusesRef = useRef([]);
  const keysRef = useRef({});
  const lastBulletTimeRef = useRef(0);
  const bulletIntervalRef = useRef(300);
  const quizTimerRef = useRef(null);
  const quizResultsRef = useRef([]);
  const virusSpawnTimerRef = useRef(0);
  const quizAlertYRef = useRef(-100);
  const initialQuizScheduledRef = useRef(false);
  const touchActiveRef = useRef(false);
  const lastWatchLogRef = useRef(0);
  const quizTimerStartedAtRef = useRef(0);
  const usedQuizIndexSetRef = useRef(new Set());
  const pendingQuizIndexRef = useRef(null);
  const quizShownCountRef = useRef(0);
  const MAX_QUIZZES = 5;
  
  useEffect(() => {
    console.log('[Game2] mounted');
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    
    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useEffect(() => {
    const playerImgEl = new Image();
    playerImgEl.src = playerImg;
    playerImageRef.current = playerImgEl;
    
    const bgImg = new Image();
    bgImg.src = backgroundImg;
    backgroundImageRef.current = bgImg;
    
    const coinImgEl = new Image();
    coinImgEl.src = coinImg;
    coinImageRef.current = coinImgEl;
    
    const quizAlert = new Image();
    quizAlert.src = quizAlertImg;
    quizAlertImageRef.current = quizAlert;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getTouchX = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = (evt.touches && evt.touches[0]?.clientX) ?? evt.clientX;
      return clientX - rect.left;
    };

    const handleTouchStart = (evt) => {
      evt.preventDefault();
      touchActiveRef.current = true;
      const x = getTouchX(evt);
      const clamped = Math.max(0, Math.min(canvas.width - playerRef.current.width, x - playerRef.current.width / 2));
      playerRef.current.x = clamped;
    };

    const handleTouchMove = (evt) => {
      if (!touchActiveRef.current) return;
      evt.preventDefault();
      const x = getTouchX(evt);
      const clamped = Math.max(0, Math.min(canvas.width - playerRef.current.width, x - playerRef.current.width / 2));
      playerRef.current.x = clamped;
    };

    const handleTouchEnd = () => {
      touchActiveRef.current = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);
  
  useEffect(() => {
    if (!chapterId) {
      alert("학습을 한 뒤, 게임을 시작해주세요.");
      navigate('/');
      return;
    }
    
    async function loadQuiz() {
      try {
        const data = await fetchQuizByChapterId(chapterId);
        console.log("✅ 퀴즈 응답:", data);
        setQuizList(data);
        setQuizLoaded(true);
      } catch (err) {
        console.error("❌ 퀴즈 불러오기 실패:", err);
        setQuizList([]);
        setQuizLoaded(true);
      }
    }
    
    loadQuiz();
  }, [chapterId, navigate]);
  
  const startQuizEvent = useCallback(() => {
    if (isQuizActive || showQuizAlert) return;
    if (quizShownCountRef.current >= MAX_QUIZZES) return;
    
    if (!Array.isArray(quizList) || quizList.length === 0) {
      if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
      quizTimerRef.current = setTimeout(() => {
        if (isGameRunning && !isPaused) startQuizEvent();
      }, 3000);
      return;
    }

    const randomTime = 5000 + Math.random() * 4000;
    
    if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
    quizTimerStartedAtRef.current = Date.now();
    console.log('[Game2] schedule quiz in', Math.round(randomTime), 'ms');
    quizTimerRef.current = setTimeout(() => {
      if (!isGameRunning || isPaused || isQuizActive) return;
      
      console.log("🚨 퀴즈 알림선 시작! Y:", 0);
      setShowQuizAlert(true);
      quizAlertYRef.current = 0;
      setQuizAlertY(0);
      
      // 중복 방지: 아직 사용하지 않은 인덱스 중에서 선택
      const available = quizList
        .map((_, idx) => idx)
        .filter(idx => !usedQuizIndexSetRef.current.has(idx));
      if (available.length === 0) {
        console.warn('⚠️ 사용 가능한 퀴즈가 없습니다.');
        return;
      }
      const pickedIndex = available[Math.floor(Math.random() * available.length)];
      pendingQuizIndexRef.current = pickedIndex;

      const raw = quizList[pickedIndex];
      const normalized = {
        question: raw?.quiz ?? raw?.question ?? '',
        options: raw?.options ?? [],
        answer: raw?.answer ?? raw?.correctAnswer,
      };
      setCurrentQuiz(normalized);
    }, randomTime);
  }, [quizList, isQuizActive, showQuizAlert, isGameRunning, isPaused]);

  useEffect(() => {
    if (!isGameRunning || isPaused || gameEnded) return;
    const MAX_DURATION_MS = 50000;
    const timerId = setTimeout(() => {
      if (quizTimerRef.current) {
        clearTimeout(quizTimerRef.current);
        quizTimerRef.current = null;
      }
      setGameEnded(true);
      setIsGameRunning(false);
      setShowResults(true);
    }, MAX_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [isGameRunning, isPaused, gameEnded]);
  
  useEffect(() => {
    if (!showQuizAlert || isQuizActive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const checkAlertPassed = () => {
      if (quizAlertYRef.current > playerRef.current.y + playerRef.current.height) {
        console.log("✅ 카운트다운 시작!");
        setCountdown(3);
        setIsQuizActive(true);
        
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              setShowQuiz(true);
              setShowQuizAlert(false);
              setIsPaused(true);
              // 중복 방지: 사용한 퀴즈 인덱스 기록 및 카운트 증가
              if (pendingQuizIndexRef.current !== null) {
                usedQuizIndexSetRef.current.add(pendingQuizIndexRef.current);
                pendingQuizIndexRef.current = null;
              }
              quizShownCountRef.current += 1;
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };
    
    const interval = setInterval(checkAlertPassed, 100);
    return () => clearInterval(interval);
  }, [showQuizAlert, isQuizActive]);
  
  const handleQuizAnswer = (answer) => {
    if (!currentQuiz) return;
    
    const isCorrect = answer === currentQuiz.answer;
    quizResultsRef.current.push({
      question: currentQuiz.question,
      options: currentQuiz.options,
      correctAnswer: currentQuiz.answer,
      userAnswer: answer,
      isCorrect,
      responseTime: Date.now(),
    });
    
    if (isCorrect) {
      setCoins(prev => prev + 10);
    }
    
    setShowQuiz(false);
    setCurrentQuiz(null);
    setIsQuizActive(false);
    quizAlertYRef.current = -100;
    setQuizAlertY(-100);
    setIsPaused(false);
    
    if (quizShownCountRef.current < MAX_QUIZZES) {
      startQuizEvent();
    } else {
      if (quizTimerRef.current) {
        clearTimeout(quizTimerRef.current);
        quizTimerRef.current = null;
      }
    }
  };
  
  const updatePlayer = (canvas) => {
    const player = playerRef.current;
    
    if (keysRef.current['a'] || keysRef.current['arrowleft']) {
      player.x = Math.max(0, player.x - player.speed);
    }
    if (keysRef.current['d'] || keysRef.current['arrowright']) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }
  };
  
  const shootBullet = (canvas) => {
    const now = Date.now();
    if (now - lastBulletTimeRef.current >= bulletIntervalRef.current) {
      const player = playerRef.current;
      bulletsRef.current.push({
        x: player.x + player.width / 2 - 8,
        y: player.y,
        width: 16,
        height: 28,
        speed: 9,
      });
      lastBulletTimeRef.current = now;
    }
  };
  
  const spawnVirus = () => {
    if (isQuizActive || showQuizAlert) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    virusSpawnTimerRef.current += 16;
    if (virusSpawnTimerRef.current >= 1500) {
      const topBarHeight = 80;
      
      const virusTypes = [
        { type: 'red',   color: '#FF4D4D', speed: 3.0, reward: 3 },
        { type: 'green', color: '#3BC14A', speed: 2.4, reward: 5 },
        { type: 'blue',  color: '#3DA5FF', speed: 1.8, reward: 7 },
      ];
      const chosen = virusTypes[Math.floor(Math.random() * virusTypes.length)];
      
      virusesRef.current.push({
        x: Math.random() * (canvas.width - 40),
        y: topBarHeight,
        width: 40,
        height: 40,
        speed: chosen.speed,
        color: chosen.color,
        reward: chosen.reward,
        type: chosen.type,
      });
      virusSpawnTimerRef.current = 0;
    }
  };
  
  const updateBullets = (canvas) => {
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      bullet.y -= bullet.speed;
      return bullet.y > -bullet.height;
    });
  };
  
  const updateViruses = (canvas) => {
    virusesRef.current = virusesRef.current.filter(virus => {
      virus.y += virus.speed;
      return virus.y < canvas.height;
    });
  };
  
  const checkCollisions = () => {
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      const hitVirus = virusesRef.current.find(virus => {
        return bullet.x < virus.x + virus.width &&
               bullet.x + bullet.width > virus.x &&
               bullet.y < virus.y + virus.height &&
               bullet.y + bullet.height > virus.y;
      });
      
      if (hitVirus) {
        const index = virusesRef.current.indexOf(hitVirus);
        virusesRef.current.splice(index, 1);
        const gain = typeof hitVirus.reward === 'number' ? hitVirus.reward : 1;
        setCoins(prev => prev + gain);
        return false;
      }
      return true;
    });
  };
  
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (backgroundImageRef.current) {
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
    }
    
    if (!isGameRunning || isPaused) {
      return;
    }
    
    updatePlayer(canvas);
    shootBullet(canvas);
    spawnVirus();
    updateBullets(canvas);
    updateViruses(canvas);
    checkCollisions();
    
    if (showQuizAlert && !isQuizActive) {
      quizAlertYRef.current += 6;
      setQuizAlertY(quizAlertYRef.current);
    }
    
    if (playerImageRef.current) {
      ctx.drawImage(
        playerImageRef.current,
        playerRef.current.x,
        playerRef.current.y,
        playerRef.current.width,
        playerRef.current.height
      );
    }
    
    ctx.fillStyle = '#FFD700';
    bulletsRef.current.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
    virusesRef.current.forEach(virus => {
      ctx.beginPath();
      ctx.fillStyle = virus.color || '#FF0000';
      ctx.arc(
        virus.x + virus.width / 2,
        virus.y + virus.height / 2,
        virus.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.stroke();
    });
  }, [isGameRunning, isPaused, showQuizAlert, isQuizActive]);
  
  useEffect(() => {
    if (!isGameRunning || isPaused) return;
    
    const gameLoop = () => {
      render();
      animationIdRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationIdRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isGameRunning, isPaused, render]);
  
  useEffect(() => {
    if (!quizLoaded || !isGameStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const safeZoneHeight = 100;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (!isGameRunning) {
      playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
      playerRef.current.y = canvas.height - safeZoneHeight - playerRef.current.height - 20;
    }
    
    setIsGameRunning(true);
  }, [quizLoaded, isGameStarted, isGameRunning]);

  useEffect(() => {
    if (!quizLoaded || !isGameStarted) return;
    if (initialQuizScheduledRef.current) return;
    if (Array.isArray(quizList) && quizList.length > 0) {
        console.log("🚨 퀴즈 시작!");
        initialQuizScheduledRef.current = true;
        setTimeout(() => {
            if (isGameRunning && !isPaused) startQuizEvent();
        }, 500);
    }
  }, [quizLoaded, isGameStarted, quizList, startQuizEvent]);

  // 퀴즈 스케줄 워치독: 2초마다 조건 확인 후 스케줄 보장
  useEffect(() => {
    if (!isGameRunning || isPaused || gameEnded) return;
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastWatchLogRef.current > 5000) {
        console.log('[Game2 Watchdog]', { isGameRunning, isPaused, isQuizActive, showQuizAlert, hasTimer: !!quizTimerRef.current, quizListLen: quizList?.length });
        lastWatchLogRef.current = now;
      }
      if (!isQuizActive && !showQuizAlert && quizShownCountRef.current < MAX_QUIZZES) {
        // 타이머가 없으면 새로 등록
        if (!quizTimerRef.current) {
          startQuizEvent();
        } else {
          // 타이머가 너무 오래 대기하면 강제 표시 (8초 초과)
          const waited = now - quizTimerStartedAtRef.current;
          if (waited > 8000 && Array.isArray(quizList) && quizList.length > 0) {
            console.log('[Game2 Watchdog] force show quiz after', waited, 'ms');
            setShowQuizAlert(true);
            quizAlertYRef.current = 0;
            setQuizAlertY(0);
            const available = quizList
              .map((_, idx) => idx)
              .filter(idx => !usedQuizIndexSetRef.current.has(idx));
            if (available.length > 0) {
              const pickedIndex = available[Math.floor(Math.random() * available.length)];
              pendingQuizIndexRef.current = pickedIndex;
              const raw = quizList[pickedIndex];
              const normalized = {
                question: raw?.quiz ?? raw?.question ?? '',
                options: raw?.options ?? [],
                answer: raw?.answer ?? raw?.correctAnswer,
              };
              setCurrentQuiz(normalized);
            }
            clearTimeout(quizTimerRef.current);
            quizTimerRef.current = null;
          }
        }
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [isGameRunning, isPaused, gameEnded, isQuizActive, showQuizAlert, quizList, startQuizEvent]);
  
  const handleExit = async () => {
    if (coins > 0) {
      try {
        await saveCoinToDB(coins);
        console.log('✅ 코인 저장 성공:', coins);
      } catch (error) {
        console.error('❌ 코인 저장 실패:', error);
      }
    }
    
    if (quizResultsRef.current.length > 0) {
      try {
        await sendQuizResults(quizResultsRef.current);
        console.log('✅ 퀴즈 결과 저장 성공');
      } catch (error) {
        console.error('❌ 퀴즈 결과 저장 실패:', error);
      }
    }
    
    navigate('/');
  };

  const handleFinishAndExit = async () => {
    try {
      if (quizResultsRef.current.length > 0) {
        await sendQuizResults(quizResultsRef.current);
      }
      if (coins > 0) {
        await saveCoinToDB(coins);
      }
    } catch (e) {
      console.error(e);
    } finally {
      navigate('/');
    }
  };
  
    return (
    <>
      <GameCanvas ref={canvasRef} />
      
      {!isGameStarted && (
        <StartOverlay>
          <StartModalBox>            
            <ModalContent>
              {/* 게임 설명 / 튜토리얼 */}
              <TutorialBox>
                <StartTitleBanner>바이러스를 퇴치하라!</StartTitleBanner>
                <StartSubTitleBanner>{`바이러스가 울타리 안으로 들어오지 못하게 퇴치하라!\n불시에 내려오는 코인은 울타리 안으로 들어와야 획득 가능`}</StartSubTitleBanner>
                <TutorialItem>
                  <img src={gameStartCoin} alt="코인" />
                  <span>바이러스를 맞추면 코인 획득!</span>
                </TutorialItem>
                <TutorialItem>
                  <img src={gameStartTrap} alt="바이러스" />
                  <span>바이러스를 피하면서 총알로 제거하세요</span>
                </TutorialItem>
                <TutorialItem>
                  <img src={gameStartQuiz} alt="퀴즈알림선" />
                  <span>퀴즈 알림선이 내려오면 퀴즈가 시작됩니다!</span>
                </TutorialItem>
              </TutorialBox>

              <TutorialMove>
                ←/→ 키로 좌우 이동하세요!<br />
                총알은 자동으로 발사됩니다.
              </TutorialMove>

              {/* 시작 버튼 */}
              <StartButton onClick={(e) => {
                e.stopPropagation();
                setIsGameStarted(true);
                // 퀴즈 스케줄을 즉시 시도 (퀴즈가 로드되지 않았다면 이후 effect에서 다시 등록)
                setTimeout(() => {
                  startQuizEvent();
                }, 500);
              }} />
            </ModalContent>
          </StartModalBox>
        </StartOverlay>
      )}
      
      {showQuizAlert && (
        <QuizAlertLine style={{ top: `${quizAlertY}px` }} />
      )}
      
      {countdown && (
        <CountdownOverlay>{countdown}</CountdownOverlay>
      )}
      
      {showQuiz && currentQuiz && (
        <>
          <ModalOverlay>
            <QuizModal>
              <QuizTitleBanner>
                <img src={gameQuizTitle} alt="quiz-title" />
              </QuizTitleBanner>
              <QuizContent>
                <QuizQuestion>{currentQuiz.question}</QuizQuestion>
                <QuizButtonContainer>
                  {currentQuiz.options.map((option, index) => (
                    <QuizButton
                      key={index}
                      isOdd={index % 2 === 0}
                      onClick={() => handleQuizAnswer(option)}
                    >
                      {option}
                    </QuizButton>
                  ))}
                </QuizButtonContainer>
              </QuizContent>
            </QuizModal>
          </ModalOverlay>
        </>
      )}

      {/* 결과 모달 */}
      {showResults && (
        <ModalOverlay>
          <PauseModal>
            <h2>게임 종료</h2>
            <div style={{ margin: '1rem 0' }}>
              <div>획득 코인: <b>{coins}</b></div>
              <div>퀴즈 정답: <b>{quizResultsRef.current.filter(r => r.isCorrect).length}</b> / {quizResultsRef.current.length}</div>
            </div>
            <PauseButton onClick={handleFinishAndExit}>나가기</PauseButton>
          </PauseModal>
        </ModalOverlay>
      )}
      
      <TopBar>
        <CoinDisplay>
          <img src={coinImg} alt="coin" />
          <span>{coins}</span>
        </CoinDisplay>
      </TopBar>
      
      <SafeZone />
      
      <GameControls>
        <ControlButton
          src={pause_btn}
          alt="pause"
          onClick={() => setIsPaused(true)}
        />
        <ControlButton
          src={exit_btn}
          alt="exit"
          onClick={handleExit}
        />
      </GameControls>
      
      {isPaused && !showQuiz && (
        <ModalOverlay>
          <PauseModal>
            <h2>게임 일시정지</h2>
            <PauseButton onClick={() => setIsPaused(false)}>
              계속하기
            </PauseButton>
            <PauseButton onClick={handleExit}>
              나가기
            </PauseButton>
          </PauseModal>
        </ModalOverlay>
      )}
    </>
  );
}
