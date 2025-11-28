/**
 * 같은 chapterId에서 3개의 게임(Game, Game2, Game3)이 
 * 학습/1차 복습/2차 복습에 걸쳐서 중복 없이 랜덤 순서로 나오도록 관리
 */

const GAME_TYPES = ['game', 'game2', 'game3'];

/**
 * chapterId와 sessionType에 따라 적절한 게임을 반환
 * @param {string} chapterId - 챕터 ID
 * @param {string} sessionType - 'study' (학습), 'review1' (1차 복습), 'review2' (2차 복습)
 * @returns {string} 게임 경로 ('/game', '/game2', '/game3' 중 하나)
 */
export function getGameForChapter(chapterId, sessionType) {
  if (!chapterId) {
    console.warn('⚠️ chapterId가 없어서 기본 게임(game)을 반환합니다.');
    return '/game';
  }

  const storageKey = `gameOrder_${chapterId}`;
  
  // sessionStorage에서 기존 게임 순서 가져오기
  let gameOrder = null;
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      gameOrder = JSON.parse(stored);
      console.log(`📋 기존 게임 순서 로드 (${chapterId}):`, gameOrder);
    }
  } catch (e) {
    console.error('❌ 게임 순서 파싱 실패:', e);
  }

  // 기존 순서가 없거나 유효하지 않으면 새로 생성
  if (!gameOrder || !Array.isArray(gameOrder) || gameOrder.length !== 3) {
    // 3개 게임을 랜덤하게 섞기
    gameOrder = [...GAME_TYPES].sort(() => Math.random() - 0.5);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(gameOrder));
      console.log(`🎲 새로운 게임 순서 생성 (${chapterId}):`, gameOrder);
    } catch (e) {
      console.error('❌ 게임 순서 저장 실패:', e);
    }
  }

  // sessionType에 따라 적절한 게임 선택
  let gameIndex;
  switch (sessionType) {
    case 'study':
      gameIndex = 0; // 학습: 첫 번째 게임
      break;
    case 'review1':
      gameIndex = 1; // 1차 복습: 두 번째 게임
      break;
    case 'review2':
      gameIndex = 2; // 2차 복습: 세 번째 게임
      break;
    default:
      console.warn(`⚠️ 알 수 없는 sessionType: ${sessionType}, 기본값(학습) 사용`);
      gameIndex = 0;
  }

  const selectedGame = gameOrder[gameIndex];
  const gamePath = `/${selectedGame}`;
  
  console.log(`🎮 게임 선택 (${chapterId}, ${sessionType}):`, {
    gameOrder,
    gameIndex,
    selectedGame,
    gamePath
  });

  return gamePath;
}

/**
 * chapterId에 대한 게임 순서를 초기화 (필요한 경우)
 * @param {string} chapterId - 챕터 ID
 */
export function resetGameOrder(chapterId) {
  if (!chapterId) return;
  
  const storageKey = `gameOrder_${chapterId}`;
  sessionStorage.removeItem(storageKey);
  console.log(`🔄 게임 순서 초기화 (${chapterId})`);
}

