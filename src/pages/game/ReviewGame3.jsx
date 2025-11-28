import React, { useMemo, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import KNPSOdaesanFont from '../../assets/game3/KNPSOdaesan.otf';
import coinImg from '../../assets/game3/Coin.png';
import backgroundImg from '../../assets/game3/Game_Background.png';
import quizClosedImg from '../../assets/game3/Quiz_Box_Closed.png';
import quizOpenedImg from '../../assets/game3/Quiz_Box_Opened.png';
import quizHalfBanner from '../../assets/game3/Quiz_Popup_Half.png';
import quizPopupImg from '../../assets/game3/Quiz_Popup.png';
import quizPopupTopImg from '../../assets/game3/GameBox_Top.png';
import quizCorrectImg from '../../assets/game3/Quiz_Answer_Correct_Fx.png';
import quizIncorrectImg from '../../assets/game3/Quiz_Answer_Incorrect_Fx.png';
import gameResultTopImg from '../../assets/game3/game_result_top.png';
import { useLocation } from 'react-router-dom';
import { saveCoinToDB } from '../../api/analyze/saveCoinToDB';
import { sendQuizResults } from '../../api/analyze/sendQuizResults';
import { reviewCompleted } from '../../api/review/reviewCompleted';
import item1Img from '../../assets/game3/Item1.png';
import item2Img from '../../assets/game3/Item2.png';
import item3Img from '../../assets/game3/Item3.png';
import item4Img from '../../assets/game3/Item4.png';
import item5Img from '../../assets/game3/Item5.png';
import item6Img from '../../assets/game3/Item6.png';
import item7Img from '../../assets/game3/Item7.png';
import disappearFx1 from '../../assets/game3/Item_Disappear_Fx1.png';
import disappearFx2 from '../../assets/game3/Item_Disappear_Fx2.png';
import pause_btn from '../../assets/pause_btn.svg';
import exit_btn from '../../assets/exit_btn.svg';

const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: 'KNPSOdaesan';
    src: url(${KNPSOdaesanFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* Layout constants */
  --topbar: 80px;
  --shelfH: 110px;
  --gapH: 14px;
  --maxW: min(90vw, 1100px);
  --availH: calc(100vh - var(--topbar) - var(--shelfH) - var(--gapH) - 24px);
  --gameW: min(var(--maxW), calc(var(--availH) * 6 / 5));
`;

const Topbar = styled.div`
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
  font-family: 'KNPSOdaesan', sans-serif !important;
  
  img {
    width: 50px;
    height: 50px;
  }
`;

const CoinImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

const CoinText = styled.div`
  font-family: 'KNPSOdaesan', sans-serif !important;
  font-size: 2rem;
  font-weight: bold;
`;

const GameControls = styled.div`
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

const BoardWrapper = styled.div`
  position: relative;
  width: 90vw;
  height: 70vh;
  aspect-ratio: 6 / 5;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 0;
  padding: 0;
  border: 4px solid #B59075;
  background: transparent;
  margin-top: 80px;
`;

/* GridOverlay removed */

const Cell = styled.button`
    // background: #ffffff;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid #E5BE8B;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
`;

const Stack = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
  width: 100%;
  height: 100%;
`;

const TileImage = styled.img`
  width: 56%;
  height: 56%;
  object-fit: contain;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.25));
`;

const ShelfWrapper = styled.div`
  position: relative;
  width: 90vw;
  height: 15vh;
  margin-top: var(--gapH);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  padding: 0;
  border: 4px solid #b8b0a3;
  background: #efe9dd;
  box-sizing: border-box;
  overflow: hidden;
`;

const ShelfSlot = styled.button`
  background: #f9f5ee;
  border: 1px dashed #cfc6b6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  
  img {
    max-width: 70%;
    max-height: 70%;
    object-fit: contain;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalCardWrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  pointer-events: auto;
`;

const ModalCard = styled.div`
  position: relative;
  display: inline-block;
  width: auto;
  max-width: 80%;
  background-color: #ffffff;
  border: 10px solid #F3EAD9;
  border-radius: 50px;
  padding: 1rem;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  pointer-events: auto;
  z-index: 1;
`;

const QuizModalTop = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: auto;
  pointer-events: none;
  z-index: 2;
`;

const ModalCardContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'KNPSOdaesan', sans-serif !important;
  gap: 1rem;
`;

const QuestionText = styled.div`
  font-family: 'KNPSOdaesan', sans-serif !important;
  font-size: 28px;
  font-weight: 700;
  color: #222;
  line-height: 1.5;
  text-align: center;
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const ChoiceButtonContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

const ChoiceButton = styled.button`
  font-family: 'KNPSOdaesan', sans-serif !important;
  font-size: 22px;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border-radius: 20px;
  border: 2px solid #333;
  background: ${props => props.$isOdd ? '#C3BBAB' : '#F27457'};
  cursor: pointer;
  text-align: center;
  line-height: 1.4;
  &:hover { 
    background: ${props => props.$isOdd ? '#B7B0A0' : '#EB7D53'};
  }
`;

const FinishOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: 'KNPSOdaesan', sans-serif !important;
  font-size: 48px;
  font-weight: 800;
  background: rgba(0,0,0,0.6);
  z-index: 1200;
`;

const TopBanner = styled.div`
  position: fixed;
  top: calc(var(--topbar) + 10px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  pointer-events: none;
  
  img {
    width: auto;
    max-width: 90vw;
    min-width: 400px;
    height: auto;
  }
`;

const QuizResultContainer = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 25;
  pointer-events: none;
`;

const QuizResultTop = styled.img`
  width: 30vw;
  height: auto;
  object-fit: contain;
  margin-bottom: -20px;
  z-index: 2;
`;

const QuizResultImage = styled.img`
  width: 30vw;
  height: auto;
  z-index: 1;
  object-fit: contain;
`;

const EndModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const EndModalCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const EndModalWrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  pointer-events: auto;
`;

const EndResultTopBanner = styled.img`
  position: relative;
  width: 50%;
  height: auto;
  margin-bottom: -80px;
  pointer-events: none;
  z-index: 2;
`;

const EndCard = styled.div`
  position: relative;
  display: inline-block;
  width: auto;
  max-width: 80%;
  background-color: #FFFFFF;
  border: 15px solid #E9BFA5;
  border-radius: 80px;
  padding: 3rem 1rem 1rem 1rem;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  pointer-events: auto;
  z-index: 1;
`;

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
  font-family: 'KNPSOdaesan', sans-serif !important;
`;

const EndResultValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  font-family: 'KNPSOdaesan', sans-serif !important;
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
  background-color: #F3EAD9;
  font-family: 'KNPSOdaesan', sans-serif !important;
`;

const EndQuizResultTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: #454545;
  font-family: 'KNPSOdaesan', sans-serif !important;
`;

const EndQuizResultAnswer = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: #454545;
  font-family: 'KNPSOdaesan', sans-serif !important;
`;

const EndQuizResultCorrect = styled.div`
  width: fit-content;
  padding: 0.3rem 0.5rem;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background-color: ${props => props.$isCorrect ? '#2D7BED' : '#FF4444'};
  border-radius: 5px;
  font-family: 'KNPSOdaesan', sans-serif !important;
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
  background-color: #F3EAD9;
  border: 2px solid #D97B59;
  border-radius: 30px;
  color: #D97B59;
  font-weight: 700;
  font-family: 'KNPSOdaesan', sans-serif !important;
  &:hover {
    background-color:rgb(243, 225, 192);
  }
`;

const PauseModalOverlay = styled.div`
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
  z-index: 2000;
  pointer-events: auto;
`;

const PauseModal = styled.div`
  background-color: #ffffff;
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  min-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-family: 'KNPSOdaesan', sans-serif !important;
`;

const PauseModalTitle = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  font-family: 'KNPSOdaesan', sans-serif !important;
`;

const PauseModalDescription = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 400;
  white-space: pre-line;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-family: 'KNPSOdaesan', sans-serif !important;
`;

const PauseModalButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
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
  font-family: 'KNPSOdaesan', sans-serif !important;
  ${props => props.$primary ? `
    background-color: #ffffff;
    color: #2D7BED;
    border: 1px solid #2D7BED;
    &:hover { background-color: rgb(242, 242, 246); }
  ` : `
    background-color: #2D7BED;
    color: #ffffff;
    &:hover { background-color: #104EA7; }
  `}
`;

const itemImgs = {
  1: item1Img,
  2: item2Img,
  3: item3Img,
  4: item4Img,
  5: item5Img,
  6: item6Img,
  7: item7Img,
};

const ROWS = 5;
const COLS = 6;
const SHELF_SLOTS = 4;
const QUIZ_REWARD = 10;
const MAX_STACK = 3;
const QUIZ_BOXES = 5;

const dedupeQuizList = (rawList = []) => {
  const unique = new Map();
  rawList.forEach((raw, index) => {
    const questionText = raw?.quiz ?? raw?.question ?? raw?.questionText ?? '';
    const baseKey = raw?.quizId ?? raw?.id ?? raw?._id ?? raw?.questionId ?? index;
    const key = `${baseKey}::${questionText}`;
    if (!unique.has(key)) {
      unique.set(key, raw);
    }
  });
  return Array.from(unique.values());
};

function generateInitialBoard() {
  // Total slots: 6*5*3 = 90
  const totalSlots = ROWS * COLS * MAX_STACK;
  // Choose target totals per item type (multiples of 3 summing to 90)
  const targetTotals = [12, 12, 12, 12, 12, 15, 15]; // sum = 90
  const itemTypes = [1, 2, 3, 4, 5, 6, 7];

  // Build flat list of exactly 90 items according to target totals
  const itemsFlat = [];
  itemTypes.forEach((id, idx) => {
    for (let i = 0; i < targetTotals[idx]; i++) {
      itemsFlat.push({ type: 'item', itemId: id });
    }
  });
  // Shuffle
  for (let i = itemsFlat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itemsFlat[i], itemsFlat[j]] = [itemsFlat[j], itemsFlat[i]];
  }

  // Create empty grid
  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => [])
  );

  // Fill all 90 slots with items, ensuring no 3 same items in one cell
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (let k = 0; k < MAX_STACK; k++) {
        const currentStack = grid[r][c];
        const itemsInStack = currentStack.filter(t => t && t.type === 'item');
        
        // Count items by id in current stack
        const counts = {};
        itemsInStack.forEach(t => { counts[t.itemId] = (counts[t.itemId] || 0) + 1; });
        
        // Find an item that won't create a match (3 same items)
        let itemToPlace = null;
        for (let i = 0; i < itemsFlat.length; i++) {
          const candidate = itemsFlat[i];
          const candidateCount = counts[candidate.itemId] || 0;
          
          // If adding this item would make 3 same items, skip it
          if (candidateCount >= 2) {
            continue;
          }
          
          itemToPlace = candidate;
          itemsFlat.splice(i, 1); // Remove from available items
          break;
        }
        
        // If no suitable item found (shouldn't happen), use first available
        if (!itemToPlace && itemsFlat.length > 0) {
          itemToPlace = itemsFlat[0];
          itemsFlat.splice(0, 1);
        }
        
        if (itemToPlace) {
          grid[r][c].push(itemToPlace);
        }
      }
    }
  }

  // Pick distinct cells to place quizzes on top: replace top item with quiz,
  // but remember the replaced item's type as targetItemId so totals remain consistent after solving.
  const positions = [];
  while (positions.length < QUIZ_BOXES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!positions.some(([rr, cc]) => rr === r && cc === c)) {
      positions.push([r, c]);
    }
  }
  positions.forEach(([r, c]) => {
    const top = grid[r][c][grid[r][c].length - 1];
    const targetItemId = top?.itemId ?? (1 + Math.floor(Math.random() * 7));
    grid[r][c][grid[r][c].length - 1] = { type: 'quiz', state: 'closed', targetItemId };
  });

  return grid;
}

function findMatches(grid) {
  const matches = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const stack = grid[r][c];
      const itemsOnly = stack.filter(t => t && t.type === 'item');
      if (itemsOnly.length < 3) continue;
      // Count same ids
      const counts = {};
      itemsOnly.forEach(t => { counts[t.itemId] = (counts[t.itemId] || 0) + 1; });
      const hasThreeSame = Object.values(counts).some(cnt => cnt >= 3);
      if (hasThreeSame) {
        matches.push({ r, c });
      }
    }
  }
  return matches;
}

function checkAndClearMatches(grid) {
  const clone = grid.map(row => row.map(stack => [...stack]));
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const stack = clone[r][c];
      const itemsOnly = stack.filter(t => t && t.type === 'item');
      if (itemsOnly.length < 3) continue;
      // Count same ids
      const counts = {};
      itemsOnly.forEach(t => { counts[t.itemId] = (counts[t.itemId] || 0) + 1; });
      const hasThreeSame = Object.values(counts).some(cnt => cnt >= 3);
      if (hasThreeSame) {
        clone[r][c] = [null, null, null];
      }
    }

  }
  return clone;
}

const ReviewGame3 = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // location.state에서 퀴즈 데이터와 chapterId 받기
  const quizDataFromState = location.state?.quizData || [];
  const chapterId = location.state?.chapterId;
  const reviewCount = location.state?.reviewCount || 1;
  
  const [coins, setCoins] = useState(0);
  const [board, setBoard] = useState(() => generateInitialBoard());
  const [shelf, setShelf] = useState(Array.from({ length: SHELF_SLOTS }, () => null));
  const [quizOpen, setQuizOpen] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showHalfBanner, setShowHalfBanner] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // 'correct' or 'incorrect' (toast용)
  const [disappearingCells, setDisappearingCells] = useState([]); // [{r, c, phase: 1 or 2}]
  const [quizList, setQuizList] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState([]); // 전체 퀴즈 결과 저장
  const [showEndModal, setShowEndModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const usedQuizIndicesRef = React.useRef(new Set()); // 사용한 퀴즈 인덱스 추적
  const touchDragRef = React.useRef(null); // 터치 드래그 정보 저장
  
  // chapterId가 없으면 리다이렉트
  React.useEffect(() => {
    if (!chapterId || !quizDataFromState || quizDataFromState.length === 0) {
      console.error("❌ chapterId 또는 퀴즈 데이터가 없습니다.");
      alert("퀴즈 데이터를 불러올 수 없습니다. 복습 페이지로 돌아갑니다.");
      navigate("/review");
    }
  }, [chapterId, quizDataFromState, navigate]);

  React.useEffect(() => {
    if (!quizDataFromState || quizDataFromState.length === 0) {
      console.warn("⚠️ 퀴즈 데이터가 없습니다.");
      setQuizList([]);
      usedQuizIndicesRef.current.clear();
      return;
    }
    
    // 새로운 API 응답 구조를 Game3.jsx가 기대하는 형식으로 변환
    // API 응답: { sourceQuizId, twinQuestion, correctAnswer, explanation }
    // Game3.jsx 형식: { quiz, options, answer, quizId }
    // 복습하기는 O/X 형식으로 변환
    const convertedQuizList = quizDataFromState.map((quizItem, index) => {
      // correctAnswer를 O/X 형식으로 변환
      let correctAnswerOX = 'O';
      const correctAnswer = String(quizItem.correctAnswer || '').trim().toUpperCase();
      
      // 다양한 형태의 정답을 O/X로 변환
      if (correctAnswer === 'X' || correctAnswer === 'FALSE' || correctAnswer === 'F' || 
          correctAnswer === '오답' || correctAnswer === '틀림' || correctAnswer === 'NO') {
        correctAnswerOX = 'X';
      } else if (correctAnswer === 'O' || correctAnswer === 'TRUE' || correctAnswer === 'T' || 
                 correctAnswer === '정답' || correctAnswer === '맞음' || correctAnswer === 'YES') {
        correctAnswerOX = 'O';
      }
      
      // O/X 옵션
      const options = ['O', 'X'];
      
      return {
        quizId: quizItem.sourceQuizId || `quiz-${index}`,
        quiz: quizItem.twinQuestion || quizItem.question || '',
        question: quizItem.twinQuestion || quizItem.question || '',
        options: options,
        answer: correctAnswerOX,
        correctAnswer: correctAnswerOX,
        explanation: quizItem.explanation || ''
      };
    });
    
    const deduped = dedupeQuizList(convertedQuizList);
    console.log("✅ 변환된 퀴즈 데이터:", deduped);
    setQuizList(deduped);
    usedQuizIndicesRef.current.clear();
  }, [quizDataFromState]);

  const allCleared = useMemo(() => {
    return board.every(row => row.every(stack => stack.every(cell => !cell)));
  }, [board]);

  React.useEffect(() => {
    if (allCleared) {
      setFinished(true);
      setShowEndModal(true);
    }
  }, [allCleared]);

  // Check for matches and show disappear effect before clearing
  React.useEffect(() => {
    // Don't check if already showing effects
    if (disappearingCells.length > 0) return;
    
    const matches = findMatches(board);
    if (matches.length === 0) return;
    
    // Show phase 1 effect (fx1) immediately
    setDisappearingCells(matches.map(({ r, c }) => ({ r, c, phase: 1 })));
    
    // After 150ms, switch to phase 2 (fx2)
    const timer1 = setTimeout(() => {
      setDisappearingCells(prev => 
        prev.map(dc => {
          const isMatch = matches.some(m => m.r === dc.r && m.c === dc.c);
          return isMatch && dc.phase === 1 ? { ...dc, phase: 2 } : dc;
        })
      );
    }, 150);
    
    // After 300ms, actually clear the matches using checkAndClearMatches
    const timer2 = setTimeout(() => {
      setBoard(prevBoard => checkAndClearMatches(prevBoard));
      setDisappearingCells([]);
    }, 300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [board]);

  const countOccupied = (stack) => stack.filter(Boolean).length;
  const firstEmptyIndex = (stack) => stack.findIndex(s => !s);

  const handleCellClick = (r, c) => {
    const stack = board[r][c];
    if (countOccupied(stack) === 0) return;
    // open the quiz in this cell (used when quiz image clicked)
    const newBoard = board.map(row => row.map(s => [...s]));
    // ensure some quiz exists in this cell
    const quizIdx = newBoard[r][c].findIndex(t => t && t.type === 'quiz');
    if (quizIdx !== -1) {
      const quizTile = newBoard[r][c][quizIdx];
      if (quizTile && quizTile.type === 'quiz' && quizTile.state === 'closed') {
        // closed -> opened (show quiz popup immediately)
        quizTile.state = 'opened';
        setBoard(newBoard);
        
        // pick a quiz (avoid duplicates)
        let normalized = null;
        if (quizList && quizList.length > 0) {
          // Find unused quiz indices
          const availableIndices = [];
          for (let i = 0; i < quizList.length; i++) {
            if (!usedQuizIndicesRef.current.has(i)) {
              availableIndices.push(i);
            }
          }
          
          // If all quizzes are used, reset the set
          if (availableIndices.length === 0) {
            usedQuizIndicesRef.current.clear();
            for (let i = 0; i < quizList.length; i++) {
              availableIndices.push(i);
            }
          }
          
          // Pick a random index from available ones
          const randomIdx = Math.floor(Math.random() * availableIndices.length);
          const idx = availableIndices[randomIdx];
          usedQuizIndicesRef.current.add(idx);
          
          const raw = quizList[idx];
          normalized = {
            quizId: raw?.quizId ?? raw?.id ?? raw?._id ?? raw?.questionId ?? '',
            question: raw?.question ?? raw?.quiz ?? '',
            options: raw?.options || ['O', 'X'],
            answer: raw?.answer ?? raw?.correctAnswer ?? 'O',
          };
        }
        if (!normalized) {
          // fallback
          normalized = {
            quizId: '',
            question: '용돈 500원에서 200원을 썼습니다. 남은 돈은?',
            options: ['100원', '300원', '700원', '900원'],
            answer: '300원',
          };
        }
        setCurrentQuiz(normalized);
        setQuizOpen({ r, c });
      }
    }
    // 클릭 동작은 퀴즈만 처리. 아이템 이동은 드래그앤드롭으로만 처리.
  };

  const handleQuizClick = (r, c) => {
    handleCellClick(r, c);
  };

  const handleShelfClick = (slotIdx) => {
    const tile = shelf[slotIdx];
    if (!tile) return;
    // Place back to a cell that has space (< MAX_STACK)
    // Strategy: find the first cell with space
    for (let r = 0; r < ROWS; r++) {
      let placed = false;
      for (let c = 0; c < COLS; c++) {
        const stack = board[r][c];
        if (stack.length < MAX_STACK) {
          const newBoard = board.map(row => row.map(s => [...s]));
          newBoard[r][c].push(tile);
          const newShelf = [...shelf];
          newShelf[slotIdx] = null;
          setShelf(newShelf);
          setBoard(newBoard);
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  };

  // Drag & Drop handlers
  const onDragStartCell = (e, r, c, tileIdx) => {
    const stack = board[r][c];
    if (stack.length === 0) { e.preventDefault(); return; }
    const tile = stack[tileIdx];
    if (!tile || tile.type !== 'item') { e.preventDefault(); return; }
    e.dataTransfer.setData('application/json', JSON.stringify({ from: 'cell', r, c, idx: tileIdx }));
  };

  const onDragStartShelf = (e, idx) => {
    const t = shelf[idx];
    if (!t || t.type !== 'item') { e.preventDefault(); return; }
    e.dataTransfer.setData('application/json', JSON.stringify({ from: 'shelf', idx }));
  };

  const onDragOverAllow = (e) => {
    e.preventDefault();
  };

  const onDropToCell = (e, tr, tc) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    const payload = JSON.parse(data);
    // target capacity check
    if (countOccupied(board[tr][tc]) >= MAX_STACK) return;

    if (payload.from === 'cell') {
      const { r, c, idx } = payload;
      if (r === tr && c === tc) return;
      const newBoard = board.map(row => row.map(s => [...s]));
      const stack = newBoard[r][c];
      const moving = stack[idx];
      if (!moving || moving.type !== 'item') return;
      // remove specific index but keep hole
      stack[idx] = null;
      const targetIdx = firstEmptyIndex(newBoard[tr][tc]);
      if (targetIdx === -1) return;
      newBoard[tr][tc][targetIdx] = moving;
      setBoard(newBoard);
    } else if (payload.from === 'shelf') {
      const { idx } = payload;
      const moving = shelf[idx];
      if (!moving || moving.type !== 'item') return;
      const newBoard = board.map(row => row.map(s => [...s]));
      const targetIdx = firstEmptyIndex(newBoard[tr][tc]);
      if (targetIdx === -1) return;
      newBoard[tr][tc][targetIdx] = moving;
      const newShelf = [...shelf];
      newShelf[idx] = null;
      setShelf(newShelf);
      setBoard(newBoard);
    }
  };

  const onDropToShelf = (e, slotIdx) => {
    e.preventDefault();
    const data = e.dataTransfer?.getData('application/json');
    if (!data) return;
    const payload = JSON.parse(data);
    if (shelf[slotIdx] !== null) return; // only empty slot
    if (payload.from === 'cell') {
      const { r, c, idx } = payload;
      const newBoard = board.map(row => row.map(s => [...s]));
      const stack = newBoard[r][c];
      const moving = stack[idx];
      if (!moving || moving.type !== 'item') return;
      stack[idx] = null;
      const newShelf = [...shelf];
      newShelf[slotIdx] = moving;
      setShelf(newShelf);
      setBoard(newBoard);
    }
    // do not accept quiz or from shelf to shelf
  };

  // 터치 이벤트 핸들러 (태블릿 지원)
  const onTouchStartCell = (e, r, c, tileIdx) => {
    const stack = board[r][c];
    if (stack.length === 0) return;
    const tile = stack[tileIdx];
    if (!tile || tile.type !== 'item') return;
    
    const touch = e.touches[0];
    touchDragRef.current = {
      from: 'cell',
      r,
      c,
      idx: tileIdx,
      startX: touch.clientX,
      startY: touch.clientY,
    };
    e.preventDefault();
  };

  const onTouchStartShelf = (e, idx) => {
    const t = shelf[idx];
    if (!t || t.type !== 'item') return;
    
    const touch = e.touches[0];
    touchDragRef.current = {
      from: 'shelf',
      idx,
      startX: touch.clientX,
      startY: touch.clientY,
    };
    e.preventDefault();
  };

  const onTouchEnd = (e) => {
    if (!touchDragRef.current) return;
    
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (!element) {
      touchDragRef.current = null;
      return;
    }

    // 드롭 대상 찾기
    const cellElement = element.closest('[data-cell]');
    const shelfElement = element.closest('[data-shelf]');
    
    const payload = touchDragRef.current;
    
    if (cellElement) {
      const tr = parseInt(cellElement.dataset.row);
      const tc = parseInt(cellElement.dataset.col);
      if (countOccupied(board[tr][tc]) >= MAX_STACK) {
        touchDragRef.current = null;
        return;
      }
      
      if (payload.from === 'cell') {
        const { r, c, idx } = payload;
        if (r === tr && c === tc) {
          touchDragRef.current = null;
          return;
        }
        const newBoard = board.map(row => row.map(s => [...s]));
        const stack = newBoard[r][c];
        const moving = stack[idx];
        if (!moving || moving.type !== 'item') {
          touchDragRef.current = null;
          return;
        }
        stack[idx] = null;
        const targetIdx = firstEmptyIndex(newBoard[tr][tc]);
        if (targetIdx === -1) {
          touchDragRef.current = null;
          return;
        }
        newBoard[tr][tc][targetIdx] = moving;
        setBoard(newBoard);
      } else if (payload.from === 'shelf') {
        const { idx } = payload;
        const moving = shelf[idx];
        if (!moving || moving.type !== 'item') {
          touchDragRef.current = null;
          return;
        }
        const newBoard = board.map(row => row.map(s => [...s]));
        const targetIdx = firstEmptyIndex(newBoard[tr][tc]);
        if (targetIdx === -1) {
          touchDragRef.current = null;
          return;
        }
        newBoard[tr][tc][targetIdx] = moving;
        const newShelf = [...shelf];
        newShelf[idx] = null;
        setShelf(newShelf);
        setBoard(newBoard);
      }
    } else if (shelfElement) {
      const slotIdx = parseInt(shelfElement.dataset.slot);
      if (shelf[slotIdx] !== null) {
        touchDragRef.current = null;
        return;
      }
      if (payload.from === 'cell') {
        const { r, c, idx } = payload;
        const newBoard = board.map(row => row.map(s => [...s]));
        const stack = newBoard[r][c];
        const moving = stack[idx];
        if (!moving || moving.type !== 'item') {
          touchDragRef.current = null;
          return;
        }
        stack[idx] = null;
        const newShelf = [...shelf];
        newShelf[slotIdx] = moving;
        setShelf(newShelf);
        setBoard(newBoard);
      }
    }
    
    touchDragRef.current = null;
  };

  const answerQuiz = (choiceIdx) => {
    if (!quizOpen || !currentQuiz) return;
    const { r, c } = quizOpen;
    const chosen = currentQuiz.options?.[choiceIdx];
    const correct = chosen === currentQuiz.answer;
    const newBoard = board.map(row => row.map(s => [...s]));
    // replace top quiz with its target item regardless of correctness
    const quizTile = newBoard[r][c][newBoard[r][c].length - 1];
    const target = (quizTile && quizTile.type === 'quiz' && quizTile.targetItemId) ? quizTile.targetItemId : (1 + Math.floor(Math.random() * 7));
    newBoard[r][c][newBoard[r][c].length - 1] = { type: 'item', itemId: target };
    setBoard(newBoard);
    // coin reward/penalty
    if (correct) {
      setCoins(v => v + QUIZ_REWARD);
    } else {
      setCoins(v => Math.max(0, v - QUIZ_REWARD));
    }
    // quizList에서 explanation 찾기
    const quizFromList = quizList.find(q => q.quizId === currentQuiz.quizId);
    const explanation = quizFromList?.explanation || '';
    
    // Save quiz result
    setQuizResults(prev => [...prev, {
      quizId: currentQuiz.quizId || '', // sourceQuizId에서 온 값
      question: currentQuiz.question,
      options: currentQuiz.options || [],
      correctAnswer: currentQuiz.answer,
      userAnswer: chosen || '',
      isCorrect: correct,
      explanation: explanation, // explanation 저장
      quizDate: new Date().toISOString().split('T')[0]
    }]);
    // Show result feedback (toast)
    setQuizResult(correct ? 'correct' : 'incorrect');
    setTimeout(() => {
      setQuizResult(null);
    }, 1000);
    setQuizOpen(null);
    setCurrentQuiz(null);
  };

  const handleExit = () => {
    navigate('/review');
  };
  
  const handleGameComplete = async () => {
    try {
      // 퀴즈 결과 포맷팅 (quizId는 임시로 1, 2, 3... 인덱스 기반 INT 값 사용)
      const formattedResults = quizResults.map((result, index) => ({
        quizId: result.quizId || index + 1, // 임시로 1부터 시작하는 INT 값 (백엔드 수정 필요)
        question: result.quiz || result.question, // quiz 필드도 함께 전달
        options: result.options || [],
        correctAnswer: result.correctAnswer || result.answer,
        userAnswer: result.userAnswer,
        isCorrect: result.isCorrect,
        description: result.explanation || '', // explanation을 description으로 전달
        quizDate: result.quizDate || new Date().toISOString().split('T')[0]
      }));
      
      // 복습 완료 API 호출 (quiz-result는 제외)
      if (chapterId && formattedResults.length > 0) {
        console.log("🔍 복습 완료 API 호출, reviewCount:", reviewCount, "chapterId:", chapterId);
        await reviewCompleted(reviewCount, chapterId, formattedResults);
        console.log("✅ 복습 완료 API 호출 성공");
      }
      
      if (coins > 0 && chapterId) {
        await saveCoinToDB(coins, chapterId);
      }
    } catch (error) {
      console.error("❌ 게임 완료 처리 중 오류:", error);
    }
  };

  return (
    <Wrapper>
      <GlobalFonts />
      <Topbar>
        <CoinDisplay>
          <CoinImage src={coinImg} alt="coin" />
          <CoinText>{coins}</CoinText>
        </CoinDisplay>

        <GameControls>
          <ControlButton
            src={pause_btn}
            alt="pause"
            onClick={(e) => { e.stopPropagation(); setShowPauseModal(true); }}
          />
          <ControlButton
            src={exit_btn}
            alt="exit"
            onClick={(e) => { e.stopPropagation(); setShowExitModal(true); }}
          />
        </GameControls>
      </Topbar>

      <BoardWrapper>
        {board.map((row, rIdx) =>
          row.map((stack, cIdx) => (
            <Cell
              key={`${rIdx}-${cIdx}`}
              data-cell
              data-row={rIdx}
              data-col={cIdx}
              onDragOver={onDragOverAllow}
              onDrop={(e) => onDropToCell(e, rIdx, cIdx)}
              onTouchEnd={onTouchEnd}
            >
              <Stack>
                {Array.from({ length: MAX_STACK }).map((_, i) => {
                  const tile = stack[i];
                  if (!tile) return <div key={i} />;
                  const isTop = i === stack.length - 1;
                  const disappearing = disappearingCells.find(dc => dc.r === rIdx && dc.c === cIdx);
                  let src = null;
                  if (tile.type === 'quiz') {
                    if (tile.state === 'opened') {
                      src = quizOpenedImg;
                    } else {
                      src = quizClosedImg;
                    }
                  } else if (disappearing && tile.type === 'item') {
                    // 아이템이 사라질 때: fx1 -> fx2 -> 사라짐
                    src = disappearing.phase === 1 ? disappearFx1 : disappearFx2;
                  } else {
                    src = itemImgs[tile.itemId];
                  }
                  return (
                    <TileImage
                      key={i}
                      src={src}
                      alt="tile"
                      draggable={tile.type === 'item' && !disappearing}
                      onDragStart={tile.type === 'item' && !disappearing ? (e) => onDragStartCell(e, rIdx, cIdx, i) : undefined}
                      onTouchStart={tile.type === 'item' && !disappearing ? (e) => onTouchStartCell(e, rIdx, cIdx, i) : undefined}
                      onTouchEnd={onTouchEnd}
                      onClick={isTop && tile.type === 'quiz' ? () => handleQuizClick(rIdx, cIdx) : undefined}
                      style={{
                        cursor:
                          disappearing
                            ? 'default'
                            : tile.type === 'item'
                            ? 'grab'
                            : isTop && tile.type === 'quiz'
                            ? 'pointer'
                            : 'default',
                      }}
                    />
                  );
                })}
              </Stack>
            </Cell>
          ))
        )}
      </BoardWrapper>

      <ShelfWrapper>
        {shelf.map((t, idx) => (
          <ShelfSlot
            key={idx}
            data-shelf
            data-slot={idx}
            onClick={() => handleShelfClick(idx)}
            onDragOver={onDragOverAllow}
            onDrop={(e) => onDropToShelf(e, idx)}
            onTouchEnd={onTouchEnd}
          >
            {t && t.type === 'item' ? (
              <TileImage
                src={itemImgs[t.itemId]}
                alt="item"
                draggable
                onDragStart={(e) => onDragStartShelf(e, idx)}
                onTouchStart={(e) => onTouchStartShelf(e, idx)}
                onTouchEnd={onTouchEnd}
                style={{ cursor: 'grab' }}
              />
            ) : null}
          </ShelfSlot>
        ))}
      </ShelfWrapper>

      {showHalfBanner && (
        <TopBanner>
          <img src={quizHalfBanner} alt="quiz-half" />
        </TopBanner>
      )}

      {quizResult && (
        <QuizResultContainer>
          <QuizResultImage 
            src={quizResult === 'correct' ? quizCorrectImg : quizIncorrectImg} 
            alt={quizResult === 'correct' ? 'correct' : 'incorrect'} 
          />
        </QuizResultContainer>
      )}

      {quizOpen && currentQuiz && (
        <ModalBackdrop onClick={() => setQuizOpen(null)}>
          <ModalCardWrapper onClick={(e) => e.stopPropagation()}>
            <QuizModalTop src={quizPopupTopImg} alt="quiz-popup-top" />
            <ModalCard>
              <ModalCardContent>
                <QuestionText>{currentQuiz.question}</QuestionText>
                <ChoiceButtonContainer>
                  {currentQuiz.options.map((ch, idx) => (
                    <ChoiceButton
                      key={idx}
                      $isOdd={(idx + 1) % 2 === 1}
                      onClick={() => answerQuiz(idx)}
                    >
                      {ch}
                    </ChoiceButton>
                  ))}
                </ChoiceButtonContainer>
              </ModalCardContent>
            </ModalCard>
          </ModalCardWrapper>
        </ModalBackdrop>
      )}

      {showEndModal && (
        <EndModalOverlay onClick={() => setShowEndModal(false)}>
          <EndModalCenter>
            <EndModalWrapper onClick={(e) => e.stopPropagation()}>
              <EndResultTopBanner src={gameResultTopImg} alt="result-top" />
              <EndCard>
                <ModalCardContent>
                  <EndResultBox>
                    <EndResultItem1>
                      <EndResultTitle>정답률</EndResultTitle>
                      <EndResultValue>
                        {quizResults.length > 0 
                          ? `${quizResults.filter(r => r.isCorrect).length}/${quizResults.length}`
                          : '0/0'}
                      </EndResultValue>
                    </EndResultItem1>
                    <EndResultItem2>
                      <EndResultTitle>획득 코인</EndResultTitle>
                      <EndResultValue>{coins}P</EndResultValue>
                    </EndResultItem2>
                  </EndResultBox>

                  {quizResults.length > 0 && (
                    <EndQuizResultsContainer>
                      {quizResults.map((result, index) => (
                        <EndQuizResultItem key={index}>
                          <EndQuizResultTitle>Q{index + 1}. {result.question}</EndQuizResultTitle>
                          <EndQuizResultAnswerContainer>
                            <EndQuizResultAnswer>답 : {result.correctAnswer}</EndQuizResultAnswer>
                            <EndQuizResultCorrect $isCorrect={result.isCorrect}>
                              {result.isCorrect ? '정답' : '오답'}
                            </EndQuizResultCorrect>
                          </EndQuizResultAnswerContainer>
                        </EndQuizResultItem>
                      ))}
                    </EndQuizResultsContainer>
                  )}

                  <EndNextButton onClick={async () => {
                    await handleGameComplete();
                    setShowEndModal(false);
                    navigate('/review');
                  }}>닫기</EndNextButton>
                </ModalCardContent>
              </EndCard>
            </EndModalWrapper>
          </EndModalCenter>
        </EndModalOverlay>
      )}

      {showPauseModal && !quizOpen && (
        <PauseModalOverlay onClick={(e) => e.stopPropagation()}>
          <PauseModal>
            <PauseModalTitle>게임이 잠시 멈췄어요.</PauseModalTitle>
            <PauseModalDescription>{`게임을 종료하게 되면
지금까지의 학습 기록과 포인트가 초기화됩니다.`}</PauseModalDescription>
            <PauseModalButtonContainer>
              <PauseButton onClick={() => { setShowPauseModal(false); }}>
                이어하기
              </PauseButton>
              <PauseButton $primary onClick={() => { setShowPauseModal(false); setShowExitModal(true); }}>
                종료하기
              </PauseButton>
            </PauseModalButtonContainer>
          </PauseModal>
        </PauseModalOverlay>
      )}

      {showExitModal && !quizOpen && (
        <PauseModalOverlay onClick={(e) => e.stopPropagation()}>
          <PauseModal>
            <PauseModalTitle>게임을 종료하시겠습니까?</PauseModalTitle>
            <PauseModalDescription>{`게임을 종료하게 되면
지금까지의 학습 기록과 포인트가 초기화됩니다.`}</PauseModalDescription>
            <PauseModalButtonContainer>
              <PauseButton onClick={() => { setShowExitModal(false); }}>
                이어하기
              </PauseButton>
              <PauseButton $primary onClick={handleExit}>
                종료하기
              </PauseButton>
            </PauseModalButtonContainer>
          </PauseModal>
        </PauseModalOverlay>
      )}
    </Wrapper>
  );
};

export default ReviewGame3;
