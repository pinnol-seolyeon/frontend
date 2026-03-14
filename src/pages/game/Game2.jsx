import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import playerImg from '../../assets/game2/Player.png';
import playerAttackImg from '../../assets/game2/PlayerAttacking.png';
import backgroundImg from '../../assets/game2/Game_Background.png';
import readybackgroundImg from '../../assets/game2/Ready_Background.png';
import startBtn from '../../assets/game2/Ready_Btn_GameStart.png';
import coinImg from '../../assets/game2/Coin.png';
import { fetchChapterContents } from '../../api/study/level3API';
import { useChapter } from "../../context/ChapterContext";
import { useNavigate } from "react-router-dom";
import { useActivityTracker } from "../../hooks/useActivityTracker";
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
import PlayerEnemy1 from '../../assets/game2/PlayerEnemy1.png';
import PlayerEnemy2 from '../../assets/game2/PlayerEnemy2.png';
import PlayerEnemy3 from '../../assets/game2/PlayerEnemy3.png';
import GumiRomanceFont from '../../assets/game2/Gumi-Romance.otf';
import safeZoneImg from '../../assets/game2/SafeFence.png';
import quizAlertImg from '../../assets/game2/Quiz_StartAlert.png';
import quizpopupImg from '../../assets/game2/Quiz_Popup.png';
import safeZoneAttackedImg from '../../assets/game2/SafeFence_Attacked.png';
import GameEndImg from '../../assets/game2/Game_FinishLine.png';
import CorrectImg from '../../assets/game2/Correct.png';
import WrongImg from '../../assets/game2/Wrong.png';
import PlayerMove1 from '../../assets/game2/Player_Move_1.png';
import PlayerMove2 from '../../assets/game2/Player_Move_2.png';
import PlayerEnemy1Attacked from '../../assets/game2/PlayerEnemy1_Popping.png';
import PlayerEnemy2Attacked from '../../assets/game2/PlayerEnemy2_Popping.png';
import PlayerEnemy3Attacked from '../../assets/game2/PlayerEnemy3_Popping.png';
import Player1Attacked from '../../assets/game2/Player_Enemy1_Attacked.png';
import Player2Attacked from '../../assets/game2/Player_Enemy2_Attacked.png';
import Player3Attacked from '../../assets/game2/Player_Enemy3_Attacked.png';
import GameBoxTop from '../../assets/game2/GameBox_Top.png';
import GameEndTop from '../../assets/game2/GameEnd_Top.png';
import PlayerCoin from '../../assets/game2/Player_CoinGet_Effect.png';
// 사운드 import
import mainBGM from '../../assets/game2/game2_main_BGM.wav';
import gunShot1 from '../../assets/game2/game2_gun_shot1.wav';
import gunShot2 from '../../assets/game2/game2_gun_shot2.wav';
import gunShot3 from '../../assets/game2/game2_gun_shot3.wav';
import gunShot4 from '../../assets/game2/game2_gun_shot4.wav';
import gunShot5 from '../../assets/game2/game2_gun_shot5.wav';
import gunShot6 from '../../assets/game2/game2_gun_shot6.wav';
import coinSound from '../../assets/game2/game2_coin.wav';
import virusHit1 from '../../assets/game2/game2_virus_hit1.wav';
import virusHit2 from '../../assets/game2/game2_virus_hit2.wav';
import virusHit3 from '../../assets/game2/game2_virus_hit3.wav';
import quizAlertSound from '../../assets/game2/game2_quiz_alert.wav';
import quizOpenSound from '../../assets/game2/game2_quiz_open.wav';
import safeZoneSound from '../../assets/game2/game2_safe_zone.wav';
import hoverSound from '../../assets/game2/game2_Hover.wav';
import clickSound from '../../assets/game2/game2_click.wav';
import correctSound from '../../assets/game2/game2_correct.wav';
import wrongSound from '../../assets/game2/game2_wrong.wav';
import gameOverSound from '../../assets/game2/game2_game_over.wav'

const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: 'GumiRomance';
    src: url(${GumiRomanceFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const GameWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const GameCanvas = styled.canvas`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
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
  justify-content: center;
  gap: 0.5rem;
  font-family: 'GumiRomance', sans-serif !important;
  
  img {
    width: 50px;
    height: 50px;
  }
`;

const CoinText = styled.div`
  font-family: 'GumiRomance', sans-serif !important;
  font-size: 2rem;
  font-weight: bold;
`;

const SafeZone = styled.img`
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 15vh;
  z-index: 5;
  pointer-events: none;
  object-fit: fill;
  margin-top: 0px;
`;

const QuizAlertLine = styled.img`
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 30vw;
  height: auto;
  z-index: 20;
  pointer-events: none;
  object-fit: contain;
  animation: blink 0.5s infinite;
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const QuizResultImage = styled.img`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 30vw;
  height: auto;
  z-index: 25;
  pointer-events: none;
  object-fit: contain;
`;

const GameEndLine = styled.img`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 100vw;
  height: 20vh;
  z-index: 30;
  pointer-events: none;
  object-fit: fill;
`;

const CountdownOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'GumiRomance', sans-serif !important;
  font-size: 8rem;
  font-weight: bold;
  color: white;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
  z-index: 15;
  pointer-events: none;
`;

const QuizModalWrapper = styled.div`
  position: relative;
  display: inline-flex; /* 배너 + 카드 수직 배치 */
  flex-direction: column;
  align-items: center;
  z-index: 20;
  pointer-events: auto;
`;

/* 상단 배너: 카드와 겹치게 음수 마진 사용 */
const QuizTopBanner = styled.img`
  position: relative;
  width: 100%;
  max-width: 600px; /* 카드와 동일한 최대 너비 */
  height: auto;
  margin-bottom: -130px; /* 더 강하게 겹치기 */
  pointer-events: none;
  z-index: 2;
`;

/* 실제 콘텐츠가 들어갈 카드 (배경 박스) */
const QuizCard = styled.div`
  position: relative;
  display: inline-block; /* 내용 크기에 맞추기 */
  width: auto;
  max-width: 80%;
  background-color: #ffffff;
  border: 15px solid rgb(202, 178, 233);
  border-radius: 100px;
  padding: 3rem 1rem 1rem 1rem;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  pointer-events: auto;
  z-index: 1;
`;

/* 기존 QuizContent 그대로 사용 */
const QuizContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const QuizQuestion = styled.div`
  font-family: 'GumiRomance', sans-serif !important;
  font-size: 24px;
  color: #333333;
  font-weight: 400;
  margin-bottom: 2rem;
  line-height: 1.5;
  text-align: center;
  white-space: pre-line; /* \n 유지 + 자동 줄바꿈 */
  word-break: keep-all;  /* 한글 단어 단위 줄바꿈 */
  overflow-wrap: anywhere; /* 긴 영문/숫자 강제 줄바꿈 */
`;

const QuizButtonContainer = styled.div`
  display: inline-flex; /* 기본은 가로 배치 */
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;       /* 한 줄이 넘치면 다음 줄로 이동 */
  justify-content: center;
  width: 100%;
`;

const QuizButton = styled.button`
  display: inline-flex;
  padding: 1rem 1.5rem;
  font-family: 'GumiRomance', sans-serif !important;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  border-radius: 30px;
  background-color: ${props => props.$odd ? '#B9F9EB' : '#F880AC'};
  color: #ffffff;
  transition: all 0.2s;
  border: none;
  width: auto;
  max-width: 100%;        /* 부모 영역을 넘지 않음 */
  box-sizing: border-box;
  line-height: 1.4;
  text-align: center;
  white-space: normal;     /* 줄바꿈 허용 (짧으면 한 줄 유지) */
  word-break: keep-all;    /* 한글은 단어 단위 줄바꿈 */
  overflow-wrap: anywhere; /* 너무 긴 토큰은 강제 줄바꿈 */

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

/* 오버레이 중앙 정렬 기준에서 전체 팝업을 조금 위로 이동 */
const ModalCenter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-6vh);
`;

// Modal styles (match Game)
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
`;

const ModalButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

// Update PauseModal/Buttons to match Game
const PauseModal = styled.div`
  background-color: #ffffff;
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  min-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const PauseButton = styled.button`
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

    &:hover { background-color: rgb(242, 242, 246); }
  ` : `
    background-color: #2D7BED;
    color: #ffffff;

    &:hover { background-color:#104EA7; }
  `}
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
  font-family: 'GumiRomance', sans-serif !important;
  font-size: 18px;
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
    font-family: 'GumiRomance', sans-serif !important;
    font-size: 18px;
    font-weight: 500;
    color: #2F2F2F;
  }
`;

const TutorialMove = styled.div`
  text-align: center;
  margin: 0;
  font-family: 'GumiRomance', sans-serif !important;
  color: #333333;
  font-weight: 400;
  font-size: 18px;
`;

const StartButton = styled.button`
  background-image: url(${startBtn});
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
  font-family: 'GumiRomance', sans-serif !important;
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
  font-family: 'GumiRomance', sans-serif !important;
  font-weight: 500;
  margin-bottom: 1rem;
  text-align: center;
  color: #333333;
  font-weight: 400;
  font-size: 18px;
  white-space: pre-line;
`;

// End modal components (separate from quiz)
const EndModalWrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  pointer-events: auto;
`;

const EndTopBanner = styled.img`
  position: relative;
  width: 35vw;
  height: auto;
  margin-bottom: -50px; /* overlap with card */
  pointer-events: none;
  z-index: 2;
`;

const EndCard = styled.div`
  position: relative;
  display: inline-block;
  width: auto;
  min-width: 32vw;
  max-width: 60vw;
  background-color: #E8FAFF;
  border: 15px solid #C2F0FF;
  border-radius: 100px;
  padding: 1rem 1rem 1rem 1rem;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  pointer-events: auto;
  z-index: 1;
`;

// Result components (referenced from Game)
const EndResultBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  flex: 1;
  justify-content: center;
  align-items: stretch;
  margin-top: 0.3rem;
`;

const EndResultTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const EndResultValue = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const EndResultItem1 = styled.div`
  display: flex;
  gap: 0.4rem;
  color: #FF6200;
  background-color: #FFE37C;
  border-radius: 10px;
  padding: 0.8rem;
  align-items: center;
  justify-content: space-around;
  min-width: 160px;
`;

const EndResultItem2 = styled.div`
  display: flex;
  gap: 0.4rem;
  background-color: #BCE4FF;
  border-radius: 10px;
  padding: 0.8rem;
  color: #478CEE;
  align-items: center;
  justify-content: space-around;
  min-width: 160px;
`;

const EndQuizResultsContainer = styled.div`
  text-align: left;
  margin-top: 0.8rem;
  max-height: 15rem;
  overflow-y: auto;
`;

const EndQuizResultItem = styled.div`
  margin-bottom: 0.6rem;
  padding: 0.8rem;
  font-size: 15px;
  border-radius: 10px;
  color: #454545;
  background-color: #ffffff;
`;

const EndQuizResultTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: #454545;
`;

const EndQuizResultAnswer = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: #454545;
`;

const EndQuizResultCorrect = styled.div`
  width: fit-content;
  padding: 0.3rem 0.5rem;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background-color: ${props => props.isCorrect ? '#2D7BED' : '#FF4444'};
  border-radius: 5px;
`;

const EndQuizResultAnswerContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const EndNextButton = styled.button`
  margin-top: 0.8rem;
  padding: 0.5rem 1.2rem;
  font-size: 0.95rem;
  cursor: pointer;
  width: 60%;
  border: none;
  border-radius: 5px;
  background-color: #2D7BED;
  color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: #104EA7;
  }
`;

export default function Game2({ user }) {
  const { chapterData } = useChapter();
  const chapterId = chapterData?.chapterId;
  const navigate = useNavigate();
  
  const { completeSession, sendExit } = useActivityTracker(
    chapterId, 
    4,
    user?.userId,
    chapterData?.bookId
  );

  // 화면 크기에 따른 safeZoneHeight와 playerHeight 설정 (px 고정)
  const getSafeZoneHeight = () => {
    const width = window.innerWidth;
    // PC 데스크탑: 1280px 이상
    // 랩탑, 태블릿: 1025px ~ 1280px
    // 태블릿, 아이패드: 768px ~ 1024px
    // 모바일: 768px 미만
    
    if (width >= 1280) {
      return 150; // PC 데스크탑: 150px
    } else if (width >= 1025) {
      return 130; // 랩탑, 태블릿: 130px
    } else if (width >= 768) {
      return 120; // 태블릿, 아이패드: 120px
    } else {
      return 100; // 모바일: 100px (기본값)
    }
  };

  const getPlayerHeight = () => {
    const width = window.innerWidth;
    // PC 데스크탑: 1280px 이상
    // 랩탑, 태블릿: 1025px ~ 1280px
    // 태블릿, 아이패드: 768px ~ 1024px
    // 모바일: 768px 미만
    
    if (width >= 1280) {
      return 150; // PC 데스크탑: 150px
    } else if (width >= 1025) {
      return 130; // 랩탑, 태블릿: 130px
    } else if (width >= 768) {
      return 120; // 태블릿, 아이패드: 120px
    } else {
      return 90; // 모바일: 90px
    }
  };

  // player 위치 조정을 위한 높이 배율 (태블릿/데스크톱별로 다름)
  const getPlayerPositionMultiplier = () => {
    const width = window.innerWidth;
    // PC 데스크탑: 1280px 이상
    // 랩탑, 태블릿: 1025px ~ 1280px
    // 태블릿, 아이패드: 768px ~ 1024px
    // 모바일: 768px 미만
    
    if (width >= 1280) {
      return 1; // PC 데스크탑: 0.8
    } else if (width >= 1025) {
      return 0.88; // 랩탑, 태블릿: 0.85
    } else if (width >= 768) {
      return 0.9; // 태블릿, 아이패드: 0.9
    } else {
      return 0.9; // 모바일: 0.9 (기본값)
    }
  };
  
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const playerImageRef = useRef(null);
  const playerAttackImageRef = useRef(null);
  const playerMove1ImageRef = useRef(null);
  const playerMove2ImageRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const coinImageRef = useRef(null);
  const enemy1ImageRef = useRef(null);
  const enemy2ImageRef = useRef(null);
  const enemy3ImageRef = useRef(null);
  const enemy1AttackedImageRef = useRef(null);
  const enemy2AttackedImageRef = useRef(null);
  const enemy3AttackedImageRef = useRef(null);
  
  const [isGameStarted, setIsGameStarted] = useState(true);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 게임 시작 기록
  useEffect(() => {
    if (chapterId) {
      const { markGameStarted } = require('../../utils/gameSelector');
      markGameStarted(chapterId, '/game2');
    }
  }, [chapterId]);
  const [coins, setCoins] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [safeZoneAttacked, setSafeZoneAttacked] = useState(false);
  const [quizAlertY, setQuizAlertY] = useState(-100);
  const [showQuizAlert, setShowQuizAlert] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizResultFeedback, setQuizResultFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [gameEnded, setGameEnded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPlayerMoving, setIsPlayerMoving] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [gameEndX, setGameEndX] = useState(-100);
  const [allQuizzesCompleted, setAllQuizzesCompleted] = useState(false);
  const [weaponsDisabled, setWeaponsDisabled] = useState(false); // 바이러스 중단 2초 후 총알/세이프존 비활성화
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCoinEffect, setShowCoinEffect] = useState(false);
  const virusStopAtRef = useRef(null); // 바이러스 생성 중단 시각
  const coinEffectTimerRef = useRef(null);
  const playerCoinEffectImageRef = useRef(null);
  
  // 사운드 refs
  const mainBGMRef = useRef(null);
  const gunShotSoundsRef = useRef([]);
  const currentGunShotIndexRef = useRef(0);
  const coinSoundRef = useRef(null);
  const virusHitSoundsRef = useRef([]);
  const quizAlertSoundRef = useRef(null);
  const quizOpenSoundRef = useRef(null);
  const safeZoneSoundRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const clickSoundRef = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);
  const quizAlertBlinkCountRef = useRef(0);
  const gameOverSoundPlayedRef = useRef(false); // 게임 오버 사운드 재생 여부
  
  const playerRef = useRef({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    speed: 5,
  });
  
  const bulletsRef = useRef([]);
  const virusesRef = useRef([]);
  const coinsRef = useRef([]);
  const keysRef = useRef({});
  const lastBulletTimeRef = useRef(0);
  const bulletIntervalRef = useRef(300);
  const bulletSizeRef = useRef({ width: 30, height: 30 }); // 기본값
  const moveAnimationFrameRef = useRef(0);
  const quizTimerRef = useRef(null);
  const quizResultsRef = useRef([]);
  const sessionDescriptionRef = useRef(null); // session=4에서 받아온 description 저장
  const virusSpawnTimerRef = useRef(0);
  const coinSpawnTimerRef = useRef(0);
  // 고정된 개수 추적
  const virusCountRef = useRef({ 
    total: 0, 
    reward2: 0,  // 2점 바이러스 개수
    reward4: 0,  // 4점 바이러스 개수
    reward5: 0   // 5점 바이러스 개수
  });
  const coinCountRef = useRef(0);
  const virusSpawnedRef = useRef(false); // 바이러스 생성 완료 여부
  const coinSpawnedRef = useRef(false); // 코인 생성 완료 여부
  const gameStartTimeRef = useRef(null); // 게임 시작 시간
  const lastVirusSpawnTimeRef = useRef(0); // 마지막 바이러스 생성 시간
  const lastCoinSpawnTimeRef = useRef(0); // 마지막 코인 생성 시간
  const totalPausedTimeRef = useRef(0); // 총 일시정지 시간 (퀴즈/알림)
  const pauseStartTimeRef = useRef(null); // 일시정지 시작 시간
  const quizAlertYRef = useRef(-100);
  const gameEndXRef = useRef(-100);
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
  
  // 사운드 초기화
  useEffect(() => {
    // BGM
    mainBGMRef.current = new Audio(mainBGM);
    mainBGMRef.current.loop = true;
    mainBGMRef.current.volume = 0.3;
    
    // 총알 사운드 (6개)
    gunShotSoundsRef.current = [
      new Audio(gunShot1),
      new Audio(gunShot2),
      new Audio(gunShot3),
      new Audio(gunShot4),
      new Audio(gunShot5),
      new Audio(gunShot6)
    ];
    gunShotSoundsRef.current.forEach(sound => sound.volume = 0.4);
    
    // 코인 사운드
    coinSoundRef.current = new Audio(coinSound);
    coinSoundRef.current.volume = 0.5;
    
    // 바이러스 타격 사운드 (3개)
    virusHitSoundsRef.current = [
      new Audio(virusHit1),
      new Audio(virusHit2),
      new Audio(virusHit3)
    ];
    virusHitSoundsRef.current.forEach(sound => sound.volume = 0.5);
    
    // 퀴즈 관련 사운드
    quizAlertSoundRef.current = new Audio(quizAlertSound);
    quizAlertSoundRef.current.volume = 0.6;
    
    quizOpenSoundRef.current = new Audio(quizOpenSound);
    quizOpenSoundRef.current.volume = 0.6;
    
    // 세이프존 사운드
    safeZoneSoundRef.current = new Audio(safeZoneSound);
    safeZoneSoundRef.current.volume = 0.5;
    
    // UI 사운드
    hoverSoundRef.current = new Audio(hoverSound);
    hoverSoundRef.current.volume = 0.3;
    
    clickSoundRef.current = new Audio(clickSound);
    clickSoundRef.current.volume = 0.4;
    
    correctSoundRef.current = new Audio(correctSound);
    correctSoundRef.current.volume = 0.6;
    
    wrongSoundRef.current = new Audio(wrongSound);
    wrongSoundRef.current.volume = 0.6;
    
    gameOverSoundRef.current = new Audio(gameOverSound);
    gameOverSoundRef.current.volume = 0.6;
    
    return () => {
      // 정리
      if (mainBGMRef.current) {
        mainBGMRef.current.pause();
        mainBGMRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    const playerImgEl = new Image();
    playerImgEl.src = playerImg;
    playerImgEl.onload = () => {
      // 이미지가 로드되면 원본 비율을 유지하면서 크기 설정
      const targetHeight = getPlayerHeight(); // 화면 크기에 따른 고정 높이
      const aspectRatio = playerImgEl.naturalWidth / playerImgEl.naturalHeight;
      const targetWidth = targetHeight * aspectRatio;
      
      playerRef.current.width = targetWidth;
      playerRef.current.height = targetHeight;
    };
    playerImageRef.current = playerImgEl;
    
    const playerAttackImgEl = new Image();
    playerAttackImgEl.src = playerAttackImg;
    playerAttackImgEl.onload = () => {
      // 이미지가 로드되면 원본 비율을 유지하면서 크기 설정
      const targetHeight = 40; // 원하는 높이 설정
      const aspectRatio = playerAttackImgEl.naturalWidth / playerAttackImgEl.naturalHeight;
      const targetWidth = targetHeight * aspectRatio;
      
      bulletSizeRef.current = {
        width: targetWidth,
        height: targetHeight
      };
    };
    playerAttackImageRef.current = playerAttackImgEl;
    
    const playerMove1ImgEl = new Image();
    playerMove1ImgEl.src = PlayerMove1;
    playerMove1ImageRef.current = playerMove1ImgEl;
    
    const playerMove2ImgEl = new Image();
    playerMove2ImgEl.src = PlayerMove2;
    playerMove2ImageRef.current = playerMove2ImgEl;
    
    const bgImg = new Image();
    bgImg.src = backgroundImg;
    backgroundImageRef.current = bgImg;
    
    const coinImgEl = new Image();
    coinImgEl.src = coinImg;
    coinImageRef.current = coinImgEl;
    const coinEffectImgEl = new Image();
    coinEffectImgEl.src = PlayerCoin;
    playerCoinEffectImageRef.current = coinEffectImgEl;
    
    const enemy1Img = new Image();
    enemy1Img.src = PlayerEnemy1;
    enemy1ImageRef.current = enemy1Img;
    
    const enemy1AttackedImg = new Image();
    enemy1AttackedImg.src = PlayerEnemy1Attacked;
    enemy1AttackedImageRef.current = enemy1AttackedImg;
    
    const enemy2Img = new Image();
    enemy2Img.src = PlayerEnemy2;
    enemy2ImageRef.current = enemy2Img;
    
    const enemy2AttackedImg = new Image();
    enemy2AttackedImg.src = PlayerEnemy2Attacked;
    enemy2AttackedImageRef.current = enemy2AttackedImg;
    
    const enemy3Img = new Image();
    enemy3Img.src = PlayerEnemy3;
    enemy3ImageRef.current = enemy3Img;
    
    const enemy3AttackedImg = new Image();
    enemy3AttackedImg.src = PlayerEnemy3Attacked;
    enemy3AttackedImageRef.current = enemy3AttackedImg;
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
        console.log("🎮 Level 4 (퀴즈) 데이터 로딩 중... chapterId:", chapterId, "bookId:", chapterData?.bookId);
        const level4Data = await fetchChapterContents(4, chapterId, chapterData?.bookId);
        console.log("✅ Level 4 (퀴즈) 응답:", level4Data);
        
        // session=4에서 받아온 description 저장
        if (level4Data?.description) {
          sessionDescriptionRef.current = level4Data.description;
          console.log("✅ Description 저장:", level4Data.description);
        }
        
        // session=4에서 quiz 필드로 받아옴 (data.quiz 배열)
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
  }, [chapterId, navigate]);
  
  const startQuizEvent = useCallback(() => {
    if (isQuizActive || showQuizAlert || showGameEnd || gameEnded) return;
    if (quizShownCountRef.current >= MAX_QUIZZES) return;
    
    if (!Array.isArray(quizList) || quizList.length === 0) {
      if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
      quizTimerRef.current = setTimeout(() => {
        if (isGameRunning && !isPaused) startQuizEvent();
      }, 3000);
      return;
    }

    const fixedTime = 3000; // 고정 3초
    
    if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
    quizTimerStartedAtRef.current = Date.now();
    console.log('[Game2] schedule quiz in', fixedTime, 'ms');
    quizTimerRef.current = setTimeout(() => {
      if (!isGameRunning || isPaused || isQuizActive) return;
      
      console.log("🚨 퀴즈 알림선 시작! Y:", 0);
      setShowQuizAlert(true);
      quizAlertYRef.current = 0;
      setQuizAlertY(0);
      // 일시정지 시작 시간 기록
      pauseStartTimeRef.current = Date.now();
      
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
      const derivedQuizId = raw?.quizId ?? raw?.id ?? raw?._id ?? raw?.questionId ?? '';
      // 퀴즈에 description이 있으면 사용하고, 없으면 session description 사용
      const quizDescription = raw?.description || sessionDescriptionRef.current;
      // question 필드로 받아오므로 raw.question 사용
      const quizQuestion = raw?.question || raw?.quiz;
      
      const normalized = {
        quizId: derivedQuizId,
        question: quizQuestion,
        quiz: quizQuestion, // quiz 필드도 함께 저장
        options: raw?.options ?? [],
        answer: raw?.answer ?? raw?.correctAnswer,
        description: quizDescription,
      };
      setCurrentQuiz(normalized);
    }, fixedTime);
  }, [quizList, isQuizActive, showQuizAlert, isGameRunning, isPaused, showGameEnd, gameEnded]);

  useEffect(() => {
    if (!isGameRunning || isPaused || gameEnded) return;
    const MAX_DURATION_MS = 30000; // 50초 -> 30초로 단축
    const timerId = setTimeout(() => {
      if (quizTimerRef.current) {
        clearTimeout(quizTimerRef.current);
        quizTimerRef.current = null;
      }
      // 게임 종료 이미지 표시 시작 (30초 타이머 - 퀴즈 완료와 별개)
      setShowGameEnd(true);
      gameEndXRef.current = -window.innerWidth; // 왼쪽 화면 밖에서 시작
      setGameEndX(-window.innerWidth);
    }, MAX_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [isGameRunning, isPaused, gameEnded]);
  
  useEffect(() => {
    if (!showQuizAlert || isQuizActive) return;
    
    console.log("✅ 퀴즈 알림 깜빡이기 시작! 3초 후 퀴즈 표시");
    
    // 퀴즈 알림 사운드 3번 재생 (0.5초 간격)
    quizAlertBlinkCountRef.current = 0;
    const alertInterval = setInterval(() => {
      if (quizAlertBlinkCountRef.current < 3 && quizAlertSoundRef.current) {
        quizAlertSoundRef.current.currentTime = 0;
        quizAlertSoundRef.current.play().catch(err => console.warn('퀴즈 알림 사운드 재생 실패:', err));
        quizAlertBlinkCountRef.current++;
      } else {
        clearInterval(alertInterval);
      }
    }, 500);
    
    // 3초 깜빡이다가 퀴즈 표시
    const quizStartTimer = setTimeout(() => {
      setIsQuizActive(true);
      setShowQuiz(true);
      setShowQuizAlert(false);
      setIsPaused(true);
      
      // 퀴즈 오픈 사운드 재생
      if (quizOpenSoundRef.current) {
        quizOpenSoundRef.current.currentTime = 0;
        quizOpenSoundRef.current.play().catch(err => console.warn('퀴즈 오픈 사운드 재생 실패:', err));
      }
      
      // 중복 방지: 사용한 퀴즈 인덱스 기록 및 카운트 증가
      if (pendingQuizIndexRef.current !== null) {
        usedQuizIndexSetRef.current.add(pendingQuizIndexRef.current);
        pendingQuizIndexRef.current = null;
      }
      quizShownCountRef.current += 1;
    }, 3000);
    
    return () => {
      clearTimeout(quizStartTimer);
      clearInterval(alertInterval);
    };
  }, [showQuizAlert, isQuizActive]);
  
  // 게임 종료 시 코인 저장 및 퀴즈 결과 전송
  // 게임 결과 저장은 handleFinishAndExit에서만 수행하도록 변경
  // useEffect에서 자동 저장 제거 (중복 호출 방지)
  
  // 게임 종료 이미지가 화면을 지나가면 게임 종료 처리
  useEffect(() => {
    if (!showGameEnd) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const checkGameEndPassed = () => {
      // 게임 종료 이미지가 화면에 꽉 차면 (left가 0 이상) 3초 후 게임 종료
      if (gameEndXRef.current >= 0 && !gameOverSoundPlayedRef.current) {
        console.log("✅ 게임 종료 라인 도착! 3초 후 결과 표시");
        gameOverSoundPlayedRef.current = true; // 플래그 설정 (한 번만 재생)
        
        // 게임 오버 사운드 재생
        if (gameOverSoundRef.current) {
          gameOverSoundRef.current.currentTime = 0;
          gameOverSoundRef.current.play().catch(err => console.warn('게임 오버 사운드 재생 실패:', err));
        }
        
        setTimeout(() => {
          setGameEnded(true);
          setIsGameRunning(false);
          setShowGameEnd(false);
          setShowResults(true);
          
          // BGM 정지
          if (mainBGMRef.current) {
            mainBGMRef.current.pause();
          }
        }, 3000);
      }
    };
    
    const interval = setInterval(checkGameEndPassed, 100);
    return () => clearInterval(interval);
  }, [showGameEnd]);
  
  const handleQuizAnswer = (answer) => {
    if (!currentQuiz) return;
    
    const isCorrect = answer === currentQuiz.answer;
    quizResultsRef.current.push({
      quizId: currentQuiz.quizId || '',
      question: currentQuiz.quiz || currentQuiz.question,
      quiz: currentQuiz.quiz || currentQuiz.question, // quiz 필드도 함께 저장
      options: currentQuiz.options || [],
      correctAnswer: currentQuiz.answer,
      userAnswer: answer,
      isCorrect,
      description: currentQuiz.description,
      quizDate: new Date().toISOString().split('T')[0]
    });
    
    if (isCorrect) {
      setCoins(prev => prev + 10);
      setQuizResultFeedback('correct');
      // 정답 사운드 재생
      if (correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play().catch(err => console.warn('정답 사운드 재생 실패:', err));
      }
    } else {
      setQuizResultFeedback('wrong');
      // 오답 사운드 재생
      if (wrongSoundRef.current) {
        wrongSoundRef.current.currentTime = 0;
        wrongSoundRef.current.play().catch(err => console.warn('오답 사운드 재생 실패:', err));
      }
    }
    
    // 1초 후 피드백 이미지 제거
    setTimeout(() => {
      setQuizResultFeedback(null);
    }, 1000);
    
    setShowQuiz(false);
    setCurrentQuiz(null);
    setIsQuizActive(false);
    quizAlertYRef.current = -100;
    setQuizAlertY(-100);
    setIsPaused(false);
    
    // 일시정지 시간 누적
    if (pauseStartTimeRef.current) {
      const pausedDuration = Date.now() - pauseStartTimeRef.current;
      totalPausedTimeRef.current += pausedDuration;
      pauseStartTimeRef.current = null;
      console.log(`⏸️ 퀴즈 일시정지 시간: ${pausedDuration}ms, 총 누적: ${totalPausedTimeRef.current}ms`);
    }
    
    if (quizShownCountRef.current < MAX_QUIZZES) {
      startQuizEvent();
    } else {
      if (quizTimerRef.current) {
        clearTimeout(quizTimerRef.current);
        quizTimerRef.current = null;
      }
      // 5개 퀴즈 모두 완료
      if (quizShownCountRef.current >= MAX_QUIZZES && !allQuizzesCompleted) {
        setAllQuizzesCompleted(true);
        // 3초 대기 후 바이러스 스폰 중지, 3초 더 대기 후 게임 종료 라인 시작
        setTimeout(() => {
          // 3초 더 대기 (바이러스 안 나오는 상태 유지)
          setTimeout(() => {
            setShowGameEnd(true);
            gameEndXRef.current = -window.innerWidth; // 왼쪽 화면 밖에서 시작
            setGameEndX(-window.innerWidth);
          }, 3000);
        }, 3000);
      }
    }
  };
  
  const updatePlayer = (canvas) => {
    const player = playerRef.current;
    let isMoving = false;
    
    if (keysRef.current['a'] || keysRef.current['arrowleft']) {
      player.x = Math.max(0, player.x - player.speed);
      isMoving = true;
    }
    if (keysRef.current['d'] || keysRef.current['arrowright']) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed);
      isMoving = true;
    }
    
    setIsPlayerMoving(isMoving);
    
    // 움직이는 동안 애니메이션 프레임 카운트
    if (isMoving) {
      moveAnimationFrameRef.current += 1;
    }
  };
  
  const shootBullet = (canvas) => {
    const now = Date.now();
    if (now - lastBulletTimeRef.current >= bulletIntervalRef.current) {
      const player = playerRef.current;
      const bulletSize = bulletSizeRef.current;
      bulletsRef.current.push({
        x: player.x + player.width / 2 - bulletSize.width / 2,
        y: player.y,
        width: bulletSize.width,
        height: bulletSize.height,
        speed: 9,
      });
      lastBulletTimeRef.current = now;
      
      // 총알 사운드 재생 (1~6 순환)
      if (gunShotSoundsRef.current.length > 0) {
        const sound = gunShotSoundsRef.current[currentGunShotIndexRef.current];
        sound.currentTime = 0;
        sound.play().catch(err => console.warn('총알 사운드 재생 실패:', err));
        currentGunShotIndexRef.current = (currentGunShotIndexRef.current + 1) % gunShotSoundsRef.current.length;
      }
    }
  };
  
  const spawnVirus = () => {
    if (isQuizActive || showQuizAlert || showGameEnd || gameEnded || allQuizzesCompleted) return;
    
    // 이미 모든 바이러스가 생성되었으면 더 이상 생성하지 않음
    if (virusSpawnedRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (!gameStartTimeRef.current) return;
    
    // 목표 개수: 2점 10개, 4점 5개, 5점 8개 (총 23개)
    const targetCounts = { reward2: 10, reward4: 5, reward5: 8 };
    const totalTarget = 23;
    
    // 이미 목표 개수에 도달했으면 생성 중단
    if (virusCountRef.current.total >= totalTarget) {
      virusSpawnedRef.current = true;
      return;
    }
    
    // 고정된 간격으로 고르게 생성 (30초 / 23개 = 약 1.3초마다 1개)
    const gameDuration = 30000; // 30초
    const spawnInterval = gameDuration / totalTarget; // 각 바이러스 생성 간격
    // 실제 경과 시간에서 일시정지 시간 제외
    const elapsed = Date.now() - gameStartTimeRef.current - totalPausedTimeRef.current;
    
    // 현재까지 생성되어야 할 개수 계산
    const expectedIndex = Math.floor(elapsed / spawnInterval);
    
    // 현재 생성된 개수가 예상 인덱스보다 적고, 최소 간격이 지났으면 생성
    const timeSinceLastSpawn = elapsed - lastVirusSpawnTimeRef.current;
    // 밀린 바이러스가 있으면 더 빠르게 생성 (catch-up)
    const isBehind = virusCountRef.current.total < expectedIndex - 2; // 2개 이상 밀렸으면
    const minInterval = isBehind ? spawnInterval * 0.3 : spawnInterval * 0.8; // 밀렸으면 더 빠르게
    
    if (virusCountRef.current.total < expectedIndex && timeSinceLastSpawn >= minInterval) {
      const topBarHeight = 80;
      
      // 필요한 바이러스 타입 결정
      let chosen = null;
      const availableTypes = [];
      
      // 2점 바이러스가 더 필요하면 추가
      if (virusCountRef.current.reward2 < targetCounts.reward2) {
        availableTypes.push({
          type: 'enemy1',
          image: enemy1ImageRef.current,
          attackedImage: enemy1AttackedImageRef.current,
          speed: 1.8,
          reward: 2
        });
      }
      
      // 4점 바이러스가 더 필요하면 추가
      if (virusCountRef.current.reward4 < targetCounts.reward4) {
        availableTypes.push({
          type: 'enemy2',
          image: enemy2ImageRef.current,
          attackedImage: enemy2AttackedImageRef.current,
          speed: 2.4,
          reward: 4
        });
      }
      
      // 5점 바이러스가 더 필요하면 추가
      if (virusCountRef.current.reward5 < targetCounts.reward5) {
        availableTypes.push({
          type: 'enemy3',
          image: enemy3ImageRef.current,
          attackedImage: enemy3AttackedImageRef.current,
          speed: 3.0,
          reward: 5
        });
      }
      
      // 사용 가능한 타입이 없으면 생성 중단
      if (availableTypes.length === 0) {
        virusSpawnedRef.current = true;
        return;
      }
      
      // 사용 가능한 타입 중 랜덤 선택
      chosen = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      
      virusesRef.current.push({
        x: Math.random() * (canvas.width - 60),
        y: topBarHeight,
        width: 60,
        height: 60,
        speed: chosen.speed,
        image: chosen.image,
        attackedImage: chosen.attackedImage,
        reward: chosen.reward,
        type: chosen.type,
        attacked: false,
        attackedTime: 0,
      });
      
      // 생성된 바이러스 개수 업데이트
      virusCountRef.current.total++;
      if (chosen.reward === 2) virusCountRef.current.reward2++;
      else if (chosen.reward === 4) virusCountRef.current.reward4++;
      else if (chosen.reward === 5) virusCountRef.current.reward5++;
      
      // 마지막 생성 시간 업데이트
      lastVirusSpawnTimeRef.current = elapsed;
      
      // 모든 바이러스 생성 완료 확인
      if (virusCountRef.current.total >= totalTarget) {
        virusSpawnedRef.current = true;
      }
    }
  };

  // 코인 스폰 및 업데이트
  const spawnCoin = () => {
    if (isQuizActive || showQuizAlert || showGameEnd || gameEnded || allQuizzesCompleted) return;
    
    // 이미 모든 코인이 생성되었으면 더 이상 생성하지 않음
    if (coinSpawnedRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (!gameStartTimeRef.current) return;
    
    // 목표 개수: 10개
    const targetCoinCount = 10;
    
    // 이미 목표 개수에 도달했으면 생성 중단
    if (coinCountRef.current >= targetCoinCount) {
      coinSpawnedRef.current = true;
      return;
    }
    
    // 고정된 간격으로 고르게 생성 (30초 / 10개 = 3초마다 1개)
    const gameDuration = 30000; // 30초
    const spawnInterval = gameDuration / targetCoinCount; // 각 코인 생성 간격
    // 실제 경과 시간에서 일시정지 시간 제외
    const elapsed = Date.now() - gameStartTimeRef.current - totalPausedTimeRef.current;
    
    // 현재까지 생성되어야 할 개수 계산
    const expectedIndex = Math.floor(elapsed / spawnInterval);
    
    // 현재 생성된 개수가 예상 인덱스보다 적고, 최소 간격이 지났으면 생성
    const timeSinceLastSpawn = elapsed - lastCoinSpawnTimeRef.current;
    const minInterval = spawnInterval * 0.8; // 최소 간격 (80%로 여유 있게)
    
    if (coinCountRef.current < expectedIndex && timeSinceLastSpawn >= minInterval) {
      const size = Math.max(32, Math.min(56, Math.floor(window.innerWidth * 0.04)));
      const x = Math.random() * (canvas.width - size);
      coinsRef.current.push({
        x,
        y: -size,
        width: size,
        height: size,
        speed: 3.5,
        reward: 2,
      });
      
      // 생성된 코인 개수 업데이트
      coinCountRef.current++;
      
      // 마지막 생성 시간 업데이트
      lastCoinSpawnTimeRef.current = elapsed;
      
      // 모든 코인 생성 완료 확인
      if (coinCountRef.current >= targetCoinCount) {
        coinSpawnedRef.current = true;
      }
    }
  };

  const updateCoins = (canvas) => {
    const safeZoneHeight = getSafeZoneHeight(); // px 고정
    const safeZoneTop = canvas.height - safeZoneHeight;
    coinsRef.current = coinsRef.current.filter(coin => {
      // 아래로 이동
      coin.y += coin.speed;

      // 플레이어 충돌 체크 (획득)
      const p = playerRef.current;
      const collide = (
        coin.x < p.x + p.width &&
        coin.x + coin.width > p.x &&
        coin.y < p.y + p.height &&
        coin.y + coin.height > p.y
      );
      if (collide) {
        setCoins(prev => prev + 5);
        // 플레이어 코인 획득 효과 잠시 표시
        setShowCoinEffect(true);
        if (coinEffectTimerRef.current) clearTimeout(coinEffectTimerRef.current);
        coinEffectTimerRef.current = setTimeout(() => setShowCoinEffect(false), 400);
        
        // 코인 사운드 재생
        if (coinSoundRef.current) {
          coinSoundRef.current.currentTime = 0;
          coinSoundRef.current.play().catch(err => console.warn('코인 사운드 재생 실패:', err));
        }
        
        return false; // 코인 제거
      }

      // 세이프존 라인 도달 시 소멸
      if (coin.y + coin.height >= safeZoneTop) {
        return false;
      }
      return true;
    });
  };
  
  const updateBullets = (canvas) => {
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      bullet.y -= bullet.speed;
      return bullet.y > -bullet.height;
    });
  };
  
  const updateViruses = (canvas) => {
    const safeZoneHeight = getSafeZoneHeight(); // px 고정
    const safeZoneTop = canvas.height - safeZoneHeight;
    
    virusesRef.current = virusesRef.current.filter(virus => {
      // attacked 상태면 이동하지 않음
      if (!virus.attacked) {
        virus.y += virus.speed;
      }
      
      // SafeZone에 닿았는지 체크
      if (virus.y + virus.height >= safeZoneTop && !virus.attacked) {
        setSafeZoneAttacked(true);
        // 일정 시간 후 원래 상태로 복구
        setTimeout(() => setSafeZoneAttacked(false), 500);
        
        // 세이프존 사운드 재생
        if (safeZoneSoundRef.current) {
          safeZoneSoundRef.current.currentTime = 0;
          safeZoneSoundRef.current.play().catch(err => console.warn('세이프존 사운드 재생 실패:', err));
        }
        
        return false; // 바이러스 제거
      }
      
      return virus.y < canvas.height;
    });
  };
  
  const checkCollisions = () => {
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      const hitVirus = virusesRef.current.find(virus => {
        if (virus.attacked) return false; // 이미 공격받은 바이러스는 무시
        return bullet.x < virus.x + virus.width &&
               bullet.x + bullet.width > virus.x &&
               bullet.y < virus.y + virus.height &&
               bullet.y + bullet.height > virus.y;
      });
      
      if (hitVirus) {
        // 바로 제거하지 않고 attacked 상태로 변경
        hitVirus.attacked = true;
        hitVirus.attackedTime = Date.now();
        const gain = typeof hitVirus.reward === 'number' ? hitVirus.reward : 1;
        setCoins(prev => prev + gain);
        
        // 바이러스 타격 사운드 재생
        let soundIndex = 0;
        if (hitVirus.type === 'enemy1') soundIndex = 0;
        else if (hitVirus.type === 'enemy2') soundIndex = 1;
        else if (hitVirus.type === 'enemy3') soundIndex = 2;
        
        const sound = virusHitSoundsRef.current[soundIndex];
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(err => console.warn('바이러스 타격 사운드 재생 실패:', err));
        }
        
        return false; // 총알 제거
      }
      return true;
    });
    
    // attacked 상태의 바이러스를 300ms 후에 제거
    virusesRef.current = virusesRef.current.filter(virus => {
      if (virus.attacked && Date.now() - virus.attackedTime > 300) {
        return false; // 제거
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
    
    // player의 y 좌표를 항상 safeZone의 top에 딱 붙도록 고정 (px 고정)
    const safeZoneHeight = getSafeZoneHeight();
    const positionMultiplier = getPlayerPositionMultiplier();
    playerRef.current.y = canvas.height - safeZoneHeight - playerRef.current.height * positionMultiplier; // player의 bottom이 safeZone의 top에 딱 붙음
    
    // 바이러스 생성 중단 상태 감지
    const virusBlocked = (showGameEnd || gameEnded || allQuizzesCompleted);
    if (virusBlocked) {
      if (virusStopAtRef.current === null) virusStopAtRef.current = Date.now();
    } else {
      virusStopAtRef.current = null;
      if (weaponsDisabled) setWeaponsDisabled(false);
    }

    // 2초 경과 시 무기 비활성화 전환
    if (!weaponsDisabled && virusStopAtRef.current && Date.now() - virusStopAtRef.current >= 2000) {
      setWeaponsDisabled(true);
    }

    // 바이러스/총알/코인 처리: 무기 비활성화 전까지는 정상 동작 (코인은 총알 무관)
    if (!weaponsDisabled) {
      shootBullet(canvas);
      spawnVirus();
      spawnCoin();
      updateBullets(canvas);
    } else {
      // 총알 즉시 제거하여 화면에서 사라지게
      bulletsRef.current = [];
    }
    updateViruses(canvas);
    updateCoins(canvas);
    checkCollisions();
    
    if (showGameEnd && gameEndXRef.current < 0) {
      gameEndXRef.current += 8;
      setGameEndX(gameEndXRef.current);
    }
    
    // 플레이어 이미지 선택 (움직이면 move 이미지, 멈추면 기본 이미지)
    let currentPlayerImg = playerImageRef.current;
    if (isPlayerMoving) {
      // 10프레임마다 move1, move2 번갈아가며 표시 (걷는 애니메이션)
      const animFrame = Math.floor(moveAnimationFrameRef.current / 10) % 2;
      currentPlayerImg = animFrame === 0 ? playerMove1ImageRef.current : playerMove2ImageRef.current;
    }
    
    const p = playerRef.current;
    if (showCoinEffect && playerCoinEffectImageRef.current) {
      // 효과 이미지를 플레이어 자리에 잠시 대체 표시 (원본 비율 유지)
      const effectImg = playerCoinEffectImageRef.current;
      const aspect = effectImg.naturalWidth > 0 && effectImg.naturalHeight > 0
        ? effectImg.naturalWidth / effectImg.naturalHeight
        : 1;
      const targetHeight = p.height * 1.1; // 플레이어 높이에 맞춤
      const targetWidth = targetHeight * aspect; // 비율 유지
      const drawX = p.x + (p.width - targetWidth) / 2; // 중앙 정렬
      const drawY = p.y;
      ctx.drawImage(effectImg, drawX, drawY, targetWidth, targetHeight);
    } else if (currentPlayerImg) {
      ctx.drawImage(
        currentPlayerImg,
        p.x,
        p.y,
        p.width,
        p.height
      );
    }
    
    bulletsRef.current.forEach(bullet => {
      if (playerAttackImageRef.current) {
        ctx.drawImage(
          playerAttackImageRef.current,
          bullet.x,
          bullet.y,
          bullet.width,
          bullet.height
        );
      }
    });
    
    // 코인 렌더링
    if (coinImageRef.current) {
      coinsRef.current.forEach(coin => {
        ctx.drawImage(
          coinImageRef.current,
          coin.x,
          coin.y,
          coin.width,
          coin.height
        );
      });
    }
    
    virusesRef.current.forEach(virus => {
      // attacked 상태면 attackedImage 사용, 아니면 일반 image 사용
      const currentVirusImg = virus.attacked ? virus.attackedImage : virus.image;
      if (currentVirusImg) {
        ctx.drawImage(
          currentVirusImg,
          virus.x,
          virus.y,
          virus.width,
          virus.height
        );
      }
    });
  }, [isGameRunning, isPaused, showQuizAlert, isQuizActive, isPlayerMoving, showGameEnd, gameEnded, allQuizzesCompleted, weaponsDisabled, showCoinEffect]);
  
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
    
    const safeZoneHeight = getSafeZoneHeight(); // px 고정
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // player 높이도 화면 크기에 맞게 재설정
    if (playerImageRef.current && playerImageRef.current.complete) {
      const targetHeight = getPlayerHeight();
      const aspectRatio = playerImageRef.current.naturalWidth / playerImageRef.current.naturalHeight;
      playerRef.current.width = targetHeight * aspectRatio;
      playerRef.current.height = targetHeight;
    }
    
    if (!isGameRunning) {
      playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
      const positionMultiplier = getPlayerPositionMultiplier();
      playerRef.current.y = canvas.height - safeZoneHeight - playerRef.current.height * positionMultiplier; // player의 bottom이 safeZone의 top에 딱 붙음
    }
    
    // 게임 시작 시 바이러스/코인 카운터 초기화
    virusCountRef.current = { total: 0, reward2: 0, reward4: 0, reward5: 0 };
    coinCountRef.current = 0;
    virusSpawnedRef.current = false;
    coinSpawnedRef.current = false;
    gameStartTimeRef.current = Date.now(); // 게임 시작 시간 기록
    lastVirusSpawnTimeRef.current = 0;
    lastCoinSpawnTimeRef.current = 0;
    totalPausedTimeRef.current = 0; // 일시정지 시간 초기화
    pauseStartTimeRef.current = null;
    gameOverSoundPlayedRef.current = false; // 게임 오버 사운드 플래그 초기화
    setIsGameRunning(true);
  }, [quizLoaded, isGameStarted, isGameRunning]);
  
  // BGM 재생
  useEffect(() => {
    if (isGameRunning && !isPaused && mainBGMRef.current) {
      mainBGMRef.current.play().catch(err => {
        console.warn('메인 BGM 재생 실패:', err);
      });
    } else if ((isPaused || !isGameRunning) && mainBGMRef.current) {
      mainBGMRef.current.pause();
    }
  }, [isGameRunning, isPaused]);

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
    if (!isGameRunning || isPaused || gameEnded || showGameEnd) return;
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastWatchLogRef.current > 5000) {
        console.log('[Game2 Watchdog]', { isGameRunning, isPaused, isQuizActive, showQuizAlert, showGameEnd, hasTimer: !!quizTimerRef.current, quizListLen: quizList?.length });
        lastWatchLogRef.current = now;
      }
      if (!isQuizActive && !showQuizAlert && !showGameEnd && quizShownCountRef.current < MAX_QUIZZES) {
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
              const derivedQuizId = raw?.quizId ?? raw?.id ?? raw?._id ?? raw?.questionId ?? '';
              // 퀴즈에 description이 있으면 사용하고, 없으면 session description 사용
              const quizDescription = raw?.description || sessionDescriptionRef.current;
              // question 필드로 받아오므로 raw.question 사용
              const quizQuestion = raw?.question || raw?.quiz;
              
              const normalized = {
                quizId: derivedQuizId,
                question: quizQuestion,
                quiz: quizQuestion, // quiz 필드도 함께 저장
                options: raw?.options ?? [],
                answer: raw?.answer ?? raw?.correctAnswer,
                description: quizDescription,
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
  }, [isGameRunning, isPaused, gameEnded, isQuizActive, showQuizAlert, showGameEnd, quizList, startQuizEvent]);
  
  const handleExit = async () => {
    // 게임을 완료하지 않고 나가는 경우에는 코인과 퀴즈 결과를 저장하지 않음
    await sendExit();
    navigate('/main');
  };

  const handleFinishAndExit = async () => {
    try {
      if (quizResultsRef.current.length > 0) {
        const formattedResults = quizResultsRef.current.map(result => ({
          quizId: result.quizId || '',
          question: result.quiz || result.question, // quiz 필드도 함께 전달
          options: result.options || [],
          correctAnswer: result.correctAnswer,
          userAnswer: result.userAnswer,
          isCorrect: result.isCorrect,
          description: result.description,
          quizDate: new Date().toISOString().split('T')[0]
        }));
        await sendQuizResults(formattedResults);
      }
      if (coins > 0) {
        await saveCoinToDB(coins, chapterId);
      }
      // 게임 완료 기록
      const { markGameCompleted } = await import('../../utils/gameSelector');
      markGameCompleted(chapterId, '/game2');
      await completeSession(); // Level 4 완료 상태 전송
      navigate(`/study/level6/summary?chapterId=${chapterId}`);
    } catch (e) {
      console.error(e);
    }
  };
  
    return (
    <>
      <GlobalFonts />
      <GameWrapper>
        <GameCanvas ref={canvasRef} />
        
        {showQuizAlert && (
          <QuizAlertLine src={quizAlertImg} alt="quiz alert" />
        )}
        
        {showGameEnd && (
          <GameEndLine src={GameEndImg} alt="game end" style={{ left: `${gameEndX}px` }} />
        )}

        {quizResultFeedback && (
          <QuizResultImage 
            src={quizResultFeedback === 'correct' ? CorrectImg : WrongImg} 
            alt={quizResultFeedback} 
          />
        )}

        {countdown && (
          <CountdownOverlay>{countdown}</CountdownOverlay>
        )}
        
        {showQuiz && currentQuiz && (
          <>
            <ModalOverlay>
              <ModalCenter>
                <QuizModalWrapper>
                  <QuizTopBanner src={GameBoxTop} alt="quiz top" />
                  <QuizCard>
                    <QuizContent>
                      <QuizQuestion>{currentQuiz.question}</QuizQuestion>
                      {(() => {
                        const cols = (currentQuiz?.options?.length || 0) >= 3 ? 2 : 1;
                        return (
                          <QuizButtonContainer>
                            {currentQuiz.options.map((option, index) => (
                              <QuizButton
                                key={index}
                                $odd={index % 2 === 0}
                                onClick={() => handleQuizAnswer(option)}
                              >
                                {option}
                              </QuizButton>
                            ))}
                          </QuizButtonContainer>
                        );
                      })()}
                    </QuizContent>
                  </QuizCard>
                </QuizModalWrapper>
              </ModalCenter>
            </ModalOverlay>
          </>
        )}

        {/* 결과 모달 */}
        {showResults && (
          <ModalOverlay>
            <ModalCenter>
              <EndModalWrapper>
                <EndTopBanner src={GameEndTop} alt="game end top" />
                <EndCard>
                  <QuizContent>
                    <QuizQuestion style={{ marginBottom: '1rem' }}>완주완료!!</QuizQuestion>

                    <EndResultBox>
                      <EndResultItem1>
                        <EndResultTitle>퀴즈 결과</EndResultTitle>
                        <EndResultValue>
                          {quizResultsRef.current.filter(r => r.isCorrect).length}/{quizResultsRef.current.length}
                        </EndResultValue>
                      </EndResultItem1>
                      <EndResultItem2>
                        <EndResultTitle>획득 코인</EndResultTitle>
                        <EndResultValue>{coins}P</EndResultValue>
                      </EndResultItem2>
                    </EndResultBox>

                    <EndQuizResultsContainer>
                      {quizResultsRef.current.map((result, index) => (
                        <EndQuizResultItem key={index}>
                          <EndQuizResultTitle>Q{index + 1}. {result.question}</EndQuizResultTitle>
                          <EndQuizResultAnswerContainer>
                            <EndQuizResultAnswer>답 : {result.correctAnswer}</EndQuizResultAnswer>
                            <EndQuizResultCorrect isCorrect={result.isCorrect}>{result.isCorrect ? '정답' : '오답'}</EndQuizResultCorrect>
                          </EndQuizResultAnswerContainer>
                        </EndQuizResultItem>
                      ))}
                    </EndQuizResultsContainer>

                    <EndNextButton onClick={handleFinishAndExit}>다음단계로</EndNextButton>
                  </QuizContent>
                </EndCard>
              </EndModalWrapper>
            </ModalCenter>
          </ModalOverlay>
        )}
        
        <TopBar>
          <CoinDisplay>
            <img src={coinImg} alt="coin" />
            <CoinText>{coins}</CoinText>
          </CoinDisplay>

          <GameControls>
            <ControlButton
              src={pause_btn}
              alt="pause"
              onClick={(e) => { e.stopPropagation(); setShowPauseModal(true); setIsPaused(true); if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current); }}
            />
            <ControlButton
              src={exit_btn}
              alt="exit"
              onClick={(e) => { e.stopPropagation(); setShowExitModal(true); setIsPaused(true); if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current); }}
            />
          </GameControls>
        </TopBar>
        
        {!weaponsDisabled && (
          <SafeZone src={safeZoneAttacked ? safeZoneAttackedImg : safeZoneImg} alt="safe fence" />
        )}
        
        {showPauseModal && !showQuiz && (
          <ModalOverlay onClick={(e) => e.stopPropagation()}>
            <PauseModal>
              <ModalTitle>게임이 잠시 멈췄어요.</ModalTitle>
              <ModalDescription>{`게임을 종료하게 되면
지금까지의 학습 기록과 포인트가 초기화됩니다.`}</ModalDescription>
              <ModalButtonContainer>
                <PauseButton onClick={() => { setShowPauseModal(false); setIsPaused(false); }}>
                  이어하기
                </PauseButton>
                <PauseButton primary onClick={() => { setShowPauseModal(false); setShowExitModal(true); }}>
                  종료하기
                </PauseButton>
              </ModalButtonContainer>
            </PauseModal>
          </ModalOverlay>
        )}

        {showExitModal && !showQuiz && (
          <ModalOverlay onClick={(e) => e.stopPropagation()}>
            <PauseModal>
              <ModalTitle>게임을 종료하시겠습니까?</ModalTitle>
              <ModalDescription>{`게임을 종료하게 되면
지금까지의 학습 기록과 포인트가 초기화됩니다.`}</ModalDescription>
              <ModalButtonContainer>
                <PauseButton onClick={() => { setShowExitModal(false); setIsPaused(false); }}>
                  이어하기
                </PauseButton>
                <PauseButton primary onClick={handleExit}>
                  종료하기
                </PauseButton>
              </ModalButtonContainer>
            </PauseModal>
          </ModalOverlay>
        )}
      </GameWrapper>
    </>
  );
}
