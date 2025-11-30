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
  const completedKey = `gameCompleted_${chapterId}`;
  const startedKey = `gameStarted_${chapterId}`;
  
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

  // 완료된 게임 목록 가져오기
  let completedGames = [];
  try {
    const completed = sessionStorage.getItem(completedKey);
    if (completed) {
      completedGames = JSON.parse(completed);
      console.log(`✅ 완료된 게임 목록 (${chapterId}):`, completedGames);
    }
  } catch (e) {
    console.error('❌ 완료된 게임 목록 파싱 실패:', e);
  }

  // 시작했지만 완료하지 않은 게임 가져오기
  let startedGame = null;
  try {
    const started = sessionStorage.getItem(startedKey);
    if (started) {
      startedGame = started;
      console.log(`🎯 시작했지만 완료하지 않은 게임 (${chapterId}):`, startedGame);
    }
  } catch (e) {
    console.error('❌ 시작한 게임 파싱 실패:', e);
  }

  // sessionType에 따라 적절한 게임 선택
  let gameIndex;
  switch (sessionType) {
    case 'study':
      // 시작했지만 완료하지 않은 게임이 있으면 그 게임 반환
      if (startedGame && !completedGames.includes(startedGame)) {
        const startedIndex = gameOrder.indexOf(startedGame);
        if (startedIndex !== -1) {
          gameIndex = startedIndex;
          console.log(`🔄 시작했지만 완료하지 않은 게임으로 복귀: ${startedGame}`);
        } else {
          // 시작한 게임이 gameOrder에 없으면 첫 번째 미완료 게임 선택
          if (!completedGames.includes(gameOrder[0])) {
            gameIndex = 0;
          } else if (!completedGames.includes(gameOrder[1])) {
            gameIndex = 1;
          } else if (!completedGames.includes(gameOrder[2])) {
            gameIndex = 2;
          } else {
            gameIndex = 0;
          }
        }
      } else {
        // 시작한 게임이 없거나 완료되었으면 첫 번째 미완료 게임 선택
        if (!completedGames.includes(gameOrder[0])) {
          gameIndex = 0;
        } else if (!completedGames.includes(gameOrder[1])) {
          gameIndex = 1;
        } else if (!completedGames.includes(gameOrder[2])) {
          gameIndex = 2;
        } else {
          // 모두 완료되었으면 첫 번째 게임 (이론적으로는 발생하지 않아야 함)
          gameIndex = 0;
        }
      }
      break;
    case 'review1':
      // 1차 복습: 두 번째 게임이 완료되지 않았으면 두 번째 게임, 완료되었으면 다음 미완료 게임
      if (!completedGames.includes(gameOrder[1])) {
        gameIndex = 1;
      } else if (!completedGames.includes(gameOrder[2])) {
        gameIndex = 2;
      } else {
        // 모두 완료되었으면 두 번째 게임
        gameIndex = 1;
      }
      break;
    case 'review2':
      // 2차 복습: 세 번째 게임
      gameIndex = 2;
      break;
    default:
      console.warn(`⚠️ 알 수 없는 sessionType: ${sessionType}, 기본값(학습) 사용`);
      gameIndex = 0;
  }

  const selectedGame = gameOrder[gameIndex];
  const gamePath = selectedGame === 'game' ? '/game' : `/${selectedGame}/ready`;
  
  console.log(`🎮 게임 선택 (${chapterId}, ${sessionType}):`, {
    gameOrder,
    gameIndex,
    selectedGame,
    gamePath,
    completedGames
  });

  return gamePath;
}

/**
 * 게임 시작을 기록
 * @param {string} chapterId - 챕터 ID
 * @param {string} gamePath - 시작한 게임 경로 ('/game', '/game2', '/game3' 중 하나)
 */
export function markGameStarted(chapterId, gamePath) {
  if (!chapterId || !gamePath) return;
  
  const startedKey = `gameStarted_${chapterId}`;
  const gameName = gamePath.replace('/', ''); // '/game' -> 'game'
  
  try {
    sessionStorage.setItem(startedKey, gameName);
    console.log(`🎮 게임 시작 기록 (${chapterId}, ${gameName})`);
  } catch (e) {
    console.error('❌ 게임 시작 기록 실패:', e);
  }
}

/**
 * 게임 완료를 기록
 * @param {string} chapterId - 챕터 ID
 * @param {string} gamePath - 완료한 게임 경로 ('/game', '/game2', '/game3' 중 하나)
 */
export function markGameCompleted(chapterId, gamePath) {
  if (!chapterId || !gamePath) return;
  
  const completedKey = `gameCompleted_${chapterId}`;
  const startedKey = `gameStarted_${chapterId}`;
  const gameName = gamePath.replace('/', ''); // '/game' -> 'game'
  
  try {
    let completedGames = [];
    const stored = sessionStorage.getItem(completedKey);
    if (stored) {
      completedGames = JSON.parse(stored);
    }
    
    if (!completedGames.includes(gameName)) {
      completedGames.push(gameName);
      sessionStorage.setItem(completedKey, JSON.stringify(completedGames));
      console.log(`✅ 게임 완료 기록 (${chapterId}, ${gameName}):`, completedGames);
    }
    
    // 완료했으므로 시작 기록 제거
    sessionStorage.removeItem(startedKey);
    console.log(`🧹 게임 시작 기록 제거 (${chapterId}, ${gameName})`);
  } catch (e) {
    console.error('❌ 게임 완료 기록 실패:', e);
  }
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

