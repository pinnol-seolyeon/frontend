import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import playerImg from '../../assets/game_character_1.png';
import hurdle1Img from '../../assets/game_trap.svg';
// import hurdle2Img from '../../assets/hurdle2.png';
import coinImg from '../../assets/game_coin.svg';
import quizBoxImg from '../../assets/game_quiz.svg';
import backgroundImg from '../../assets/game_background2.png';
import flagImg from '../../assets/game_end.svg';
import playerEndImg from '../../assets/game_character_2.png';
import { saveCoinToDB } from '../../api/analyze/saveCoinToDB';
import { useChapter } from "../../context/ChapterContext";
import { fetchChapterContents } from '../../api/study/level3API';
import { useNavigate } from "react-router-dom";
import { useActivityTracker } from "../../hooks/useActivityTracker";
import bgmSrc from '../../assets/Tiki_Bar_Mixer.mp3';
import { sendQuizResults } from '../../api/analyze/sendQuizResults';
import gameStartTitle from '../../assets/game_startoverlay_title.svg';
import gameStartCoin from '../../assets/game_coin_start.svg';
import gameStartTrap from '../../assets/game_trap_start.svg';
import gameStartQuiz from '../../assets/game_quiz_start.svg';
import gameStartBtn from '../../assets/game_start_btn.svg';
import gameQuizTitle from '../../assets/game_quizoverlay_title.svg';
import gameEndTitle from '../../assets/game_endoverlay_title.svg';
import pause_btn from '../../assets/pause_btn.svg';
import exit_btn from '../../assets/exit_btn.svg';

// 폰트 import
const fontFace = `
  @font-face {
    font-family: 'DungeonFighterOnlineBeatBeat';
    src: url('//cdn.df.nexon.com/img/common/font/DNFBitBit-Regular.woff'),
         url('//cdn.df.nexon.com/img/common/font/DNFBitBit-Regular.woff2');
    font-weight: 400;
    font-display: swap;
  }
`;

// 폰트 스타일을 DOM에 주입
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = fontFace;
  document.head.appendChild(style);
}

const GameCanvas = styled.canvas`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: auto;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
`;

const GameControls = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 5;
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
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background-color: #ffffff;
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  min-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
`;

const ModalDescription = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 400;
  white-space: pre-line;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`

const ModalButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  
  ${props => props.primary ? `
    background-color: #ffffff;
    color: #2D7BED;
    border: 1px solid #2D7BED;

    &:hover {
      background-color: rgb(242, 242, 246);
    }
  ` : `
    background-color: #2D7BED;
    color: #ffffff;
    
    &:hover {
      background-color:#104EA7;
    }
  `}
`;

const QuizOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const QuizModalBox = styled.div`
  background-color: #FFF1C1;
  padding: 0;
  border-radius: 20px;
  text-align: center;
  width: 50%;
  border: 10px solid #C0935B;
  position: relative;
  z-index: 1;
  overflow: visible;
  margin-top: 40px;
  pointer-events: auto;
  word-break: keep-all;
  white-space: pre-wrap;
  
  * {
    font-family: 'DungeonFighterOnlineBeatBeat', "Noto Sans KR", sans-serif !important;
  }
`;

const QuizTitleBanner = styled.div`
  position: absolute;
  top: -4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100px;
  background-image: url(${gameQuizTitle});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
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
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
`;

const QuizButton = styled.button`
  flex: 1;
  padding: 1rem;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  border-radius: 30px;
  background-color: ${props => props.isOdd ? '#FF6200' : '#FFAA00'};
  color: #ffffff;
  transition: all 0.2s;
  max-width: 200px;
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    outline: none;
  }
`;

const Notification = styled.div`
  font-family: 'DungeonFighterOnlineBeatBeat', "Noto Sans KR", sans-serif !important;
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 10px;
  color: white;
  font-size: 1.5rem;
  z-index: 20;
  border: solid 1px #ffffff;
`;

const CorrectNotification = styled(Notification)`
  background-color: #478CEE;
  text-shadow: 
    -1px -1px 0 #104EA7,
    1px -1px 0 #104EA7,
    -1px 1px 0 #104EA7,
    1px 1px 0 #104EA7;
`;

const WrongNotification = styled(Notification)`
  background-color: #FF4444;
  text-shadow: 
    -1px -1px 0 #980000,
    1px -1px 0 #980000,
    -1px 1px 0 #980000,
    1px 1px 0 #980000;
`;

const GainNotification = styled(Notification)`
  background-color: #478CEE;
  text-shadow: 
    -1px -1px 0 #104EA7,
    1px -1px 0 #104EA7,
    -1px 1px 0 #104EA7,
    1px 1px 0 #104EA7;
`;

const PenaltyNotification = styled(Notification)`
  background-color: #FF4444;
  text-shadow: 
    -1px -1px 0 #980000,
    1px -1px 0 #980000,
    -1px 1px 0 #980000,
    1px 1px 0 #980000;
`;

const EndNotification = styled.div`
  font-family: 'DungeonFighterOnlineBeatBeat', "Noto Sans KR", sans-serif !important;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #00C171;
  text-shadow: 
    -1px -1px 0 #005738,
    1px -1px 0 #005738,
    -1px 1px 0 #005738,
    1px 1px 0 #005738;
  border: solid 1px #ffffff;
  padding: 1rem 2rem;
  border-radius: 10px;
  color: white;
  font-size: 3rem;
  z-index: 20;
`;

const GameOverOverlay = styled.div`
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
  z-index: 50;
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

const GameOverBox = styled.div`
  background-color: #FFF1C1;
  padding: 0;
  border-radius: 20px;
  text-align: center;
  width: 50%;
  border: 10px solid #C0935B;
  position: relative;
  z-index: 1;
  overflow: visible;
  margin-top: 40px;
  pointer-events: auto;
`;

const GameOverTitleBanner = styled.div`
  position: absolute;
  top: -4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100px;
  background-image: url(${gameEndTitle});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
`;

const GameOverContent = styled.div`
  padding: 3rem 2rem 2rem 2rem;
`;

const QuizResultsContainer = styled.div`
  text-align: left;
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const QuizResultItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  font-size: 16px;
  border-radius: 10px;
  color: #454545;
  background-color: #ffffff;

  strong {
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
`;

const QuizResultTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #454545;
`;

const QuizResultAnswer = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: #454545;
`;

const QuizResultCorrect = styled.div`
  width: fit-content;
  padding: 0.3rem 0.5rem;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background-color: ${props => props.isCorrect ? '#2D7BED' : '#FF4444'};
  border-radius: 5px;
`;

const QuizResultAnswerContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const GameOverTitle = styled.div`
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

const NextButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  width: 70%;
  border: none;
  border-radius: 5px;
  background-color: #2D7BED;
  color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: #104EA7;
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
  margin-top: 40px;
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
  padding: 3rem 2rem 2rem 2rem;
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

const TutorialJump = styled.div`
  text-align: center;
  margin: 0;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
`;

const BgmCredit = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.7rem;
  color: #666;
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

const GameResultBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex: 1;
`;

const GameResultTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const GameResultValue = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const GameResultItem1 = styled.div`
  display: flex;
  gap: 0.5rem;
  color: #FF6200;
  background-color: #FFE37C;
  border-radius: 10px;
  padding: 1rem;
  align-items: center;
  justify-content: space-around;
  flex: 1;
`;

const GameResultItem2 = styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: #BCE4FF;
  border-radius: 10px;
  padding: 1rem;
  color: #478CEE;
  align-items: center;
  justify-content: space-around;
  flex: 1;
`;

export default function Game({ user }) {
  const { chapterData } = useChapter();
  const chapterId = chapterData?.chapterId;
  const navigate = useNavigate();
  
  const { completeSession, sendExit } = useActivityTracker(
      chapterId, 
      4,
      user?.userId,
      chapterData?.bookId
  );
  
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const updateRef = useRef(null);
  
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const frameRef = useRef(0);
  const gameSpeedRef = useRef(8);
  const backgroundXRef = useRef(0);
  const entitiesRef = useRef([]);
  const playerRef = useRef({});
  const pausedSnapshotRef = useRef(null);

  const playerImageRef = useRef(null);
  const coinImageRef = useRef(null);
  const quizBoxImageRef = useRef(null);
  const hurdleImagesRef = useRef([]);

  const [quizList, setQuizList] = useState([]);
  const currentQuizIndexRef = useRef(0);

  const [quizLoaded, setQuizLoaded] = useState(false);
  const quizCountRef = useRef(0);
  const quizResultsRef = useRef([]);

  const [gameOver, setGameOver] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const quizScoreRef = useRef(0);
  const groundHeightRatioRef = useRef(0.15);

  const [penaltyVisible, setPenaltyVisible] = useState(false);
  const [correctVisible, setCorrectVisible] = useState(false);
  const [gainVisible, setGainVisible] = useState(false);
  const [wrongVisible, setWrongVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);

  const [touchX,setTouchX]=useState(0);

  const flagImageRef = useRef(null);
  const coinSpawnFramesRef = useRef([]);
  const hurdleSpawnFramesRef = useRef([]);
  const quizSpawnFramesRef = useRef([]);
  const coinIndexRef = useRef(0);
  const hurdleIndexRef = useRef(0);
  const quizIndexRef = useRef(0);
  const itemsInitializedRef = useRef(false);

  const [flagShown, setFlagShown] = useState(false);
  const [ending, setEnding] = useState(false);
  const endingRef = useRef(false);

  const flagPushedRef = useRef(false);
  const flagSpawnFrameRef = useRef(null);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const bgmRef = useRef(null);
  
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const quizStartTimeRef = useRef(null);

  function snapshotState() {
    pausedSnapshotRef.current = {
      frame: frameRef.current,
      gameSpeed: gameSpeedRef.current,
      backgroundX: backgroundXRef.current,
      entities: JSON.parse(JSON.stringify(entitiesRef.current)),
      player: JSON.parse(JSON.stringify(playerRef.current)),
    };
  }

  function restoreSnapshot() {
    const snap = pausedSnapshotRef.current;
    if (!snap) return;

    frameRef.current = snap.frame;
    gameSpeedRef.current = snap.gameSpeed;
    backgroundXRef.current = snap.backgroundX;
    playerRef.current = { ...snap.player };

    const restoredEntities = snap.entities.map(e => {
      const newEntity = { ...e };
      if (e.type === 'coin') newEntity.img = coinImageRef.current;
      else if (e.type === 'quiz') newEntity.img = quizBoxImageRef.current;
      else if (e.type === 'hurdle') {
        newEntity.img = hurdleImagesRef.current[0];
      }
      return newEntity;
    });

    entitiesRef.current.splice(0, entitiesRef.current.length, ...restoredEntities);
    pausedSnapshotRef.current = null;
  }

  function handleQuizAnswer(answer) {
    if (!quiz) return;

    const responseTime = Date.now() - quizStartTimeRef.current;

    quizResultsRef.current.push({
      quizId: quiz.quizId,
      question: quiz.question,
      options: quiz.options,
      correctAnswer: quiz.answer,
      userAnswer: answer,
      isCorrect: answer === quiz.answer,
      responseTime,
    });
  
    if (answer === quiz.answer) {
      setQuiz(null);
      restoreSnapshot();
      scoreRef.current += 50;
      quizScoreRef.current += 1;
      setIsPaused(false);
      bgmRef.current?.play();
      setCorrectVisible(true);
      setTimeout(() => setCorrectVisible(false), 1000);
      requestAnimationFrame(updateRef.current);
    } else {
      setQuiz(null);
      restoreSnapshot();
      scoreRef.current = Math.max(0, scoreRef.current - 10);
      setIsPaused(false);
      bgmRef.current?.play();
      setWrongVisible(true);
      setTimeout(() => setWrongVisible(false), 1000);
      requestAnimationFrame(updateRef.current);
    }
  }

  function showPenaltyEffect() {
    setPenaltyVisible(true);
    setTimeout(() => setPenaltyVisible(false), 800);
  }

  function showGainEffect() {
    setGainVisible(true);
    setTimeout(() => setGainVisible(false), 800);
  }

  function showEndEffect() {
    setEndVisible(true);
    setTimeout(() => setEndVisible(false), 800);
  }

  useEffect(() => {
    const loadImages = () => {
      const images = [
        { src: playerImg, ref: 'player' },
        { src: hurdle1Img, ref: 'hurdle1' },
        { src: coinImg, ref: 'coin' },
        { src: quizBoxImg, ref: 'quiz' },
        { src: flagImg, ref: 'flag' },
        { src: playerEndImg, ref: 'playerEnd' },
        { src: backgroundImg, ref: 'background' }
      ];

      let loadedCount = 0;
      const totalImages = images.length;

      images.forEach(({ src, ref }) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.src = src;
      });
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!chapterId) return;
    
    async function loadQuiz() {
      try {
        console.log("🎮 Level 4 (퀴즈) 데이터 로딩 중... chapterId:", chapterId, "bookId:", chapterData?.bookId);
        const level4Data = await fetchChapterContents(4, chapterId, chapterData?.bookId);
        console.log("✅ Level 4 (퀴즈) 응답:", level4Data);
        
        const quizData = level4Data?.quiz || [];
        console.log("✅ 퀴즈 데이터:", quizData);
        setQuizList(quizData);
        setQuizLoaded(true);
      } catch (err) {
        console.error("❌ 퀴즈 불러오기 실패:", err);
        setQuizList([]);
        setQuizLoaded(true);
      }
    }

    loadQuiz();
  }, [chapterId]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && playerImageRef.current) {
        const canvas = canvasRef.current;
        const player = playerRef.current;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const baseHeight = canvas.height * 0.22;
        if (playerImageRef.current && playerImageRef.current.naturalWidth > 0) {
          const aspectRatio = playerImageRef.current.naturalWidth / playerImageRef.current.naturalHeight;
          player.height = baseHeight;
          player.width = player.height * aspectRatio;
        } else {
          player.height = baseHeight;
          player.width = baseHeight * 0.6;
        }
        player.y = canvas.height - 0.15 * canvas.height - player.height;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!quizLoaded || !isGameStarted || !imagesLoaded) return;
    
    if (gameOver) {
        saveCoinToDB(scoreRef.current, chapterId);
        
        const formattedResults = quizResultsRef.current.map(result => ({
          quizId: result.quizId,
          question: result.question,
          options: result.options,
          correctAnswer: result.correctAnswer,
          userAnswer: result.userAnswer,
          responseTime: result.responseTime,
          userId: user?.userId || '',
          quizDate: new Date().toISOString().split('T')[0],
          isCorrect: result.isCorrect
        }));
        
        sendQuizResults(formattedResults);
      }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    scoreRef.current = score;

    const bgImg = new Image(); bgImg.src = backgroundImg;
    const playerImage = new Image(); 
    playerImage.onload = () => {
      resizeCanvas();
    };
    playerImage.src = playerImg;
    playerImageRef.current = playerImage;

    const hurdleImages = [];
    const hurdleImage1 = new Image();
    hurdleImage1.src = hurdle1Img;
    hurdleImages.push(hurdleImage1);
    hurdleImagesRef.current = hurdleImages;
    const coinImage = new Image(); coinImage.src = coinImg; coinImageRef.current = coinImage;
    const quizBoxImage = new Image(); quizBoxImage.src = quizBoxImg; quizBoxImageRef.current = quizBoxImage;

    const flagImage = new Image(); flagImage.src = flagImg;
    const playerEndImage = new Image(); playerEndImage.src = playerEndImg;
    flagImageRef.current = flagImage;

    const groundHeightRatio = 0.15;
    playerRef.current = {
      x: 100, y: 0, width: 0, height: 0,
      vy: 0, gravity: 1.8, jumpForce: -35, isJumping: false,
    };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const player = playerRef.current;
      const baseHeight = canvas.height * 0.22;
      if (playerImageRef.current && playerImageRef.current.naturalWidth > 0) {
        const aspectRatio = playerImageRef.current.naturalWidth / playerImageRef.current.naturalHeight;
        player.height = baseHeight;
        player.width = player.height * aspectRatio;
      } else {
        player.height = baseHeight;
        player.width = baseHeight * 0.6;
      }
      player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
    }

    function detectCollision(player, obs) {
      const px = player.x + player.width * 0.25;
      const pw = player.width * 0.5;
      const py = player.y + player.height * 0.25;
      const ph = player.height * 0.6;
      const ox = obs.x + obs.width * 0.25;
      const ow = obs.width * 0.5;
      const oy = obs.y + obs.height * 0.2;
      const oh = obs.height * 0.7;
      return px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy;
    }

    function showQuiz() {
      console.log("퀴즈 표시 시도, quizList 길이:", quizList.length);
      
      if (quizList.length === 0) {
        console.warn("⚠️ 퀴즈 없음 - 게임 계속 진행");
        restoreSnapshot();
        setIsPaused(false);
        requestAnimationFrame(updateRef.current);
        return;
      }

      const nextQuiz = quizList[currentQuizIndexRef.current];
      currentQuizIndexRef.current += 1;

      console.log("표시할 퀴즈:", nextQuiz);

      quizStartTimeRef.current = Date.now();

      const derivedQuizId = nextQuiz?.quizId ?? nextQuiz?.id ?? nextQuiz?._id ?? nextQuiz?.questionId;

      setQuiz({
        quizId: derivedQuizId,
        question: nextQuiz.quiz,
        options: nextQuiz.options,
        answer: nextQuiz.answer,
      });
      bgmRef.current?.pause();
    }

    let lastQuizFrame = -1000;
    const quizSpawnInterval = 700;
    
    // 고정 시드를 사용한 랜덤 생성기
    let seed = chapterId ? parseInt(chapterId.slice(-8), 16) : 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    // 고정된 개수 및 게임 길이 설정
    const TOTAL_COINS = 25;
    const TOTAL_HURDLES = 20;
    const TOTAL_QUIZZES = 5;
    const GAME_TOTAL_FRAMES = 2400;
    const SPAWN_START_FRAME = 120;
    const FLAG_BUFFER_FRAMES = 120;
    const SPAWN_END_FRAME = GAME_TOTAL_FRAMES - FLAG_BUFFER_FRAMES;
    
    const initializeItems = () => {
      if (itemsInitializedRef.current) return;

      const startFrame = SPAWN_START_FRAME;
      const endFrame = SPAWN_END_FRAME;
      const segmentCoin = (endFrame - startFrame) / (TOTAL_COINS + 1);
      const segmentHurdle = (endFrame - startFrame) / (TOTAL_HURDLES + 1);
      const segmentQuiz = (endFrame - startFrame) / (TOTAL_QUIZZES + 1);

      coinSpawnFramesRef.current = Array.from({ length: TOTAL_COINS }, (_, i) =>
        Math.floor(startFrame + segmentCoin * (i + 1)));
      hurdleSpawnFramesRef.current = Array.from({ length: TOTAL_HURDLES }, (_, i) =>
        Math.floor(startFrame + segmentHurdle * (i + 1)));
      quizSpawnFramesRef.current = Array.from({ length: TOTAL_QUIZZES }, (_, i) =>
        Math.floor(startFrame + segmentQuiz * (i + 1)));

      coinIndexRef.current = 0;
      hurdleIndexRef.current = 0;
      quizIndexRef.current = 0;
      flagSpawnFrameRef.current = GAME_TOTAL_FRAMES;
      itemsInitializedRef.current = true;

      console.log(`🎮 아이템 초기화: 코인 ${TOTAL_COINS}개, 장애물 ${TOTAL_HURDLES}개, 퀴즈 ${TOTAL_QUIZZES}개, 게임 프레임 ${GAME_TOTAL_FRAMES}`);
    };
    
    const pushFlagEntity = () => {
      const canvas = canvasRef.current;
      if (!canvas || !flagImageRef.current) return;
      const yBase = canvas.height - groundHeightRatioRef.current * canvas.height;
      const baseHeight = canvas.height * 0.2;
      const aspectRatio = flagImageRef.current.naturalWidth / flagImageRef.current.naturalHeight || 1;
      const flagHeight = baseHeight;
      const flagWidth = flagHeight * aspectRatio;
      entitiesRef.current.push({
        type: 'flag',
        x: canvas.width,
        y: yBase - flagHeight,
        width: flagWidth,
        height: flagHeight,
        img: flagImageRef.current
      });
      setFlagShown(true);
      flagPushedRef.current = true;
    };

    const maybeSpawnFlag = () => {
      if (flagPushedRef.current) return;
      if (frameRef.current < flagSpawnFrameRef.current) return;
      pushFlagEntity();
    };
    
    // 게임 시작 시 바로 초기화
    initializeItems();
    
    function spawnEntities() {
      // 퀴즈는 update 함수에서 고정된 프레임에 생성하므로 여기서는 제거
    }

    function update() {
      if (gameOver) return;

      const player = playerRef.current;
      const entities = entitiesRef.current;
      let backgroundX = backgroundXRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      const scale = (canvas.height / bgImg.height);
      const drawW = Math.ceil(bgImg.width * scale);
      const drawH = Math.ceil(canvas.height);
      
      backgroundX -= gameSpeedRef.current;
      if (backgroundX <= -drawW) backgroundX = 0;
      
      for (let x = Math.floor(backgroundX); x < canvas.width + drawW; x += drawW) {
        ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, x, 0, drawW + 1, drawH);
      }
      backgroundXRef.current = backgroundX;

      if (!isPaused || !endingRef.current) {
        player.y += player.vy;
        player.vy += player.gravity;
      }
      if (player.y > canvas.height - groundHeightRatio * canvas.height - player.height) {
        player.y = canvas.height - groundHeightRatio * canvas.height - player.height;
        player.isJumping = false;
      }
      ctx.drawImage(playerImageRef.current, player.x, player.y, player.width, player.height);

      // 코인과 장애물 생성 - 정확한 프레임에 생성
      if (!isPaused && !endingRef.current) {
        maybeSpawnFlag();
        
        // 코인 생성 체크
        while (coinIndexRef.current < coinSpawnFramesRef.current.length &&
               frameRef.current >= coinSpawnFramesRef.current[coinIndexRef.current]) {
          const canvas = canvasRef.current;
          const x = canvas.width;
          const yBase = canvas.height - groundHeightRatioRef.current * canvas.height;
          const player = playerRef.current;
          
          const img = coinImageRef.current;
          const width = canvas.width * 0.04;
          const height = width;
          const y = yBase - height - player.height * 1.3;
          entitiesRef.current.push({ type: 'coin', x, y, width, height, img });
          coinIndexRef.current++;
        }
        
        // 장애물 생성 체크
        while (hurdleIndexRef.current < hurdleSpawnFramesRef.current.length &&
               frameRef.current >= hurdleSpawnFramesRef.current[hurdleIndexRef.current]) {
          const canvas = canvasRef.current;
          const x = canvas.width;
          const yBase = canvas.height - groundHeightRatioRef.current * canvas.height;
          
          const idx = Math.floor(seededRandom() * hurdleImagesRef.current.length);
          const img = hurdleImagesRef.current[idx];
          const baseWidth = canvas.width * 0.04;
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const width = baseWidth;
          const height = width / aspectRatio;
          const y = yBase - height - 30;
          entitiesRef.current.push({ type: 'hurdle', x, y, width, height, img });
          hurdleIndexRef.current++;
        }
        
        // 퀴즈 생성 체크 (고정된 프레임에 생성)
        while (quizIndexRef.current < quizSpawnFramesRef.current.length &&
               frameRef.current >= quizSpawnFramesRef.current[quizIndexRef.current] &&
               quizList.length > 0) {
          const canvas = canvasRef.current;
          const x = canvas.width;
          const yBase = canvas.height - groundHeightRatioRef.current * canvas.height;
          
          const img = quizBoxImageRef.current;
          const baseWidth = canvas.width * 0.04;
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const width = baseWidth;
          const height = width / aspectRatio;
          const player = playerRef.current;
          const y = yBase - height - player.height * 0.5;
          
          entitiesRef.current.push({ type: 'quiz', x, y, width, height, img });
          quizIndexRef.current++;
          quizCountRef.current++;
        }
      }
      
      // 퀴즈는 60프레임마다 체크 (더 이상 사용하지 않지만 호환성을 위해 유지)
      if (frameRef.current % 60 === 0 && !isPaused && !endingRef.current) {
        spawnEntities();
      }

      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        if (!isPaused || !endingRef.current) ent.x -= gameSpeedRef.current;

        if (ent.img && ent.img.complete && ent.img.naturalWidth !== 0) {
          ctx.drawImage(ent.img, ent.x, ent.y, ent.width, ent.height);
        }

        if (ent.type === 'flag' && ent.x + ent.width < player.x && !endingRef.current) {
          endingRef.current = true;
          playerImageRef.current = playerEndImage;
          entities.splice(i, 1);
          bgmRef.current?.pause();
          bgmRef.current.currentTime = 0;
          const finishSound = new Audio(require('../../assets/cute-level-up-3-189853.mp3'));
          finishSound.volume = 0.7;
          finishSound.play().catch(err => console.warn("끝 효과음 재생 실패:", err));
          showEndEffect();
          break;
        }

        if (ent.type === 'quiz' && !quiz && ent.x + ent.width < player.x) {
            console.log("퀴즈 박스와 충돌 감지!");
            cancelAnimationFrame(animationIdRef.current);
            entities.splice(i, 1);
            snapshotState();
            setIsPaused(true);
            showQuiz();
            return;
          } 

        if (!isPaused && !endingRef.current && detectCollision(player, ent)) {
          if (ent.type === 'hurdle') {
            scoreRef.current = Math.max(0, scoreRef.current - 5)
            showPenaltyEffect();
            entities.splice(i, 1);
            i--;
          } else if (ent.type === 'coin') {
            scoreRef.current += 5;
            showGainEffect();
            const coinSound = new Audio(require('../../assets/coin-recieved-230517.mp3'));
            coinSound.volume = 0.7;
            coinSound.play().catch(err => console.warn("코인 효과음 재생 실패:", err));
            entities.splice(i, 1);
            i--;
          }
        }
      }

      if (!isPaused) {
        frameRef.current++;
      }
      animationIdRef.current = requestAnimationFrame(updateRef.current);

      if (endingRef.current) {
        player.x += 5;
        if (player.x > canvas.width) {
          setGameOver(true);
          cancelAnimationFrame(animationIdRef.current);
        }
      }
    }

    updateRef.current = update;
    requestAnimationFrame(updateRef.current);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleInput=(e)=>{
        if(e.type==='keydown'&&e.code!=='Space') return;
        triggerJump();
    };

    document.addEventListener('keydown',handleInput);
    document.addEventListener('click',handleInput);
    document.addEventListener('touchstart',handleInput);

    return()=>{
      window.removeEventListener('resize',resizeCanvas);
      document.removeEventListener('keydown',handleInput);
      document.removeEventListener('click',handleInput);
      document.removeEventListener('touchstart',handleInput);
      itemsInitializedRef.current = false;
      coinSpawnFramesRef.current = [];
      hurdleSpawnFramesRef.current = [];
      quizSpawnFramesRef.current = [];
      coinIndexRef.current = 0;
      hurdleIndexRef.current = 0;
      quizIndexRef.current = 0;
    };
    
  }, [gameOver, quizLoaded, quizList, isGameStarted, imagesLoaded]);

  const triggerJump=()=>{
    console.log("점프 클릭");
    const player=playerRef.current;
    if(!player.isJumping&&!gameOver&&!isPaused){
      player.vy=player.jumpForce;
      player.isJumping=true;
    }
  };

  useEffect(() => {

  if (!bgmRef.current) return;
  const bgm = bgmRef.current;

  const tryPlayBGM = () => {
    if (bgm) {
      bgm.volume = 0.5;
      bgm.play().catch(err => console.warn("🎵 BGM 자동재생 실패:", err));
    }
  };

  window.addEventListener('click', tryPlayBGM, { once: true });

  return () => {
    window.removeEventListener('click', tryPlayBGM);
    bgm?.pause();
    bgm.currentTime = 0;
  };
}, []);

  const handlePauseClick = (e) => {
    e.stopPropagation();
    setShowPauseModal(true);
    setIsPaused(true);
    cancelAnimationFrame(animationIdRef.current);
    snapshotState();
  };

  const handleExitClick = (e) => {
    e.stopPropagation();
    setShowExitModal(true);
    setIsPaused(true);
    cancelAnimationFrame(animationIdRef.current);
    snapshotState();
  };

  const handleResume = () => {
    console.log('▶️ 게임 재개 - EXIT 상태 전송하지 않음');
    setShowPauseModal(false);
    setIsPaused(false);
    restoreSnapshot();
    animationIdRef.current = requestAnimationFrame(updateRef.current);
  };

  const handleExitFromPause = async () => {
    await sendExit();
    navigate('/main');
  };

  const handleConfirmExit = async () => {
    await sendExit();
    navigate('/main');
  };

  const handleCancelExit = () => {
    console.log('🚫 Exit 취소 - EXIT 상태 전송하지 않음');
    setShowExitModal(false);
    setIsPaused(false);
    restoreSnapshot();
    animationIdRef.current = requestAnimationFrame(updateRef.current);
  };

  if (!quizLoaded || !imagesLoaded) {
    return (
      <LoadingOverlay>
        {!imagesLoaded ? '이미지 로딩 중...' : '퀴즈 로딩 중...'}
      </LoadingOverlay>
    );
  }

  return (
    <>
      <GameCanvas ref={canvasRef} onClick={triggerJump} onTouchStart={triggerJump} /> 
      <audio ref={bgmRef} src={bgmSrc} loop />
      
      {isGameStarted && !gameOver && (
        <GameControls>
          <ControlButton src={pause_btn} alt="일시정지" onClick={handlePauseClick} />
          <ControlButton src={exit_btn} alt="나가기" onClick={handleExitClick} />
        </GameControls>
      )}

      {quiz && (
        <QuizOverlay>
          <QuizModalBox>
            <QuizTitleBanner />
            
            <QuizContent>
              <QuizQuestion>{quiz.question}</QuizQuestion>
              
              <QuizButtonContainer>
            {quiz.options.map((opt, idx) => (
                  <QuizButton 
                    key={idx} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuizAnswer(opt);
                    }}
                    isOdd={idx % 2 === 0}
                  >
                    {opt}
                  </QuizButton>
                ))}
              </QuizButtonContainer>
            </QuizContent>
          </QuizModalBox>
        </QuizOverlay>
      )}

      {correctVisible && (
        <CorrectNotification>
          정답입니다! +50점
        </CorrectNotification>
      )}

      {wrongVisible && (
        <WrongNotification>
          오답입니다! -10점
        </WrongNotification>
      )}

      {gainVisible && (
        <GainNotification>
          +5점!
        </GainNotification>
      )}

      {penaltyVisible && (
        <PenaltyNotification>
          -5점!
        </PenaltyNotification>
      )}

      {endVisible && (
        <EndNotification>
          완주 완료!
        </EndNotification>
      )}
      
      {showPauseModal && (
        <ModalOverlay onClick={(e) => e.stopPropagation()}>
          <ModalBox>
            <ModalTitle>게임이 잠시 멈췄어요.</ModalTitle>
            <ModalDescription>{`게임을 종료하게 되면
            지금까지의 학습 기록과 포인트가 초기화됩니다.`}</ModalDescription>

            <ModalButtonContainer>
              <ModalButton primary onClick={handleResume}>
                이어하기
              </ModalButton>
              <ModalButton onClick={handleExitFromPause}>
                종료하기
              </ModalButton>
            </ModalButtonContainer>
          </ModalBox>
        </ModalOverlay>
      )}
      
      {showExitModal && (
        <ModalOverlay onClick={(e) => e.stopPropagation()}>
          <ModalBox>
            <ModalTitle>게임을 종료하시겠습니까?</ModalTitle>
            <ModalDescription>{`게임을 종료하게 되면
            지금까지의 학습 기록과 포인트가 초기화됩니다.`}</ModalDescription>
            <ModalButtonContainer>
              <ModalButton onClick={handleCancelExit}>
                이어하기
              </ModalButton>
              <ModalButton primary onClick={handleConfirmExit}>
                종료하기
              </ModalButton>
            </ModalButtonContainer>
          </ModalBox>
        </ModalOverlay>
      )}

      {gameOver && (
        <GameOverOverlay>
          <GameOverBox>
            <GameOverTitleBanner />
            
            <GameOverContent>
              <GameOverTitle>완주완료!!</GameOverTitle>

              <GameResultBox>
                <GameResultItem1>
                  <GameResultTitle>퀴즈 결과</GameResultTitle>
                  <GameResultValue>
                    {
                quizResultsRef.current.filter(r => r.isCorrect).length
                    }/{quizResultsRef.current.length}
                  </GameResultValue>
                </GameResultItem1>
                <GameResultItem2>
                  <GameResultTitle>획득 코인</GameResultTitle>
                  <GameResultValue>
                    {scoreRef.current}P
                  </GameResultValue>
                </GameResultItem2>
              </GameResultBox>

              <QuizResultsContainer>
              {quizResultsRef.current.map((result, index) => (
                  <QuizResultItem key={index} isCorrect={result.isCorrect}>
                    <QuizResultTitle>Q{index + 1}. {result.question}</QuizResultTitle>
                    <QuizResultAnswerContainer>
                      <QuizResultAnswer>답 : {result.correctAnswer}</QuizResultAnswer>
                      <QuizResultCorrect isCorrect={result.isCorrect}>{result.isCorrect ? "정답" : "오답"}</QuizResultCorrect>
                    </QuizResultAnswerContainer>
                  </QuizResultItem>
                ))}
              </QuizResultsContainer>

              <NextButton onClick={async (e) => { 
                e.stopPropagation();
                await completeSession();
                navigate(`/study/level6/summary?chapterId=${chapterId}`); 
              }}>
                다음단계로
              </NextButton>
            </GameOverContent>
          </GameOverBox>
        </GameOverOverlay>
      )}

      {!isGameStarted && (
        <StartOverlay>
          <StartModalBox>
            <TitleBanner />
            
            <ModalContent>
              <TutorialBox>
                <TutorialItem>
                  <img src={gameStartCoin} alt="코인" />
              <span>코인을 먹으면 +5점</span>
                </TutorialItem>
                <TutorialItem>
                  <img src={gameStartTrap} alt="장애물" />
                  <span>장애물은 -5점</span>
                </TutorialItem>
                <TutorialItem>
                  <img src={gameStartQuiz} alt="퀴즈박스" />
                  <span>퀴즈 박스를 만나면 퀴즈가 나와요!</span>
                </TutorialItem>
              </TutorialBox>

              <TutorialJump>
                마우스를 클릭하거나 화면을 터치하여 점프하세요!
              </TutorialJump>

              <StartButton onClick={(e) => {
                e.stopPropagation();
            bgmRef.current?.play();
            setIsGameStarted(true);
              }} />

              <BgmCredit>
                BGM " Tiki_Bar_Mixer.mp3 " by Kevin MacLeod (incompetech.com) — CC BY 3.0
              </BgmCredit>
            </ModalContent>
          </StartModalBox>
        </StartOverlay>
      )}

    </>
  );
}