import { useEffect, useRef, useCallback } from 'react';
import api from '../api/login/axiosInstance';

export const useActivityTracker = (chapterId, level, userId, bookId, minusFocusingScore = 0, skipStartLevel = false) => {
  const lastActiveRef = useRef(Date.now());
  const sessionStartRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);
  const currentStatusRef = useRef('ACTIVE'); // ACTIVE, INACTIVE, COMPLETED
  const levelStartedRef = useRef(false); // 레벨 시작 API 호출 여부
  const isUnloadingRef = useRef(false); // 페이지 언로드 중인지 플래그
  const isCompletedRef = useRef(false); // 레벨 완료 여부 (COMPLETED 전송 후 true)
  
  const INACTIVITY_THRESHOLD = 1 * 60 * 1000; // 1분
  const ACTIVITY_CHECK_INTERVAL = 30 * 1000; // 30초마다 확인

  // 레벨 시작 API 호출
  const startLevel = useCallback(async () => {
    if (!chapterId || !level || levelStartedRef.current || skipStartLevel) {
      if (skipStartLevel) {
        console.log('⏭️ start-level 스킵 (skipStartLevel=true)');
      }
      return;
    }

    // bookId 디버깅
    if (!bookId) {
      console.error('⚠️⚠️⚠️ bookId가 undefined입니다!', { level, chapterId, bookId });
    }

    try {
      console.log('🎬 레벨 시작 API 호출:', { level, chapterId, bookId });
      const response = await api.post('/api/session/', null, {
        params: {
          level,
          chapterId,
          bookId
        },
        // 이 요청은 인터셉터에서 자동 리다이렉트하지 않음
        skipAuthRedirect: true
      });
      
      // 응답 상태 체크
      if (response.data.status === 0 && response.data.code === 'session-001') {
        // SESSION_NOT_FOUND - 기존 세션이 없는 경우, 정상적으로 진행
        console.log('ℹ️ 기존 세션 없음 - 새로운 세션 시작:', response.data.message);
        levelStartedRef.current = true;
        sessionStartRef.current = Date.now(); // 시작 시간 기록
      } else if (response.data.data) {
        // 정상 응답
        console.log('✅ 레벨 시작 성공:', response.data);
        levelStartedRef.current = true;
        sessionStartRef.current = Date.now(); // 시작 시간 기록
      } else if (response.data.data.currentLevel === null) {
        alert(response.data.message);
      } else {
        console.warn('⚠️ 예상치 못한 응답 형식:', response.data);
      }
    } catch (error) {
      console.error('❌ 레벨 시작 실패:', error);
      if (error.response) {
        console.error('에러 응답:', error.response.data);
        // 401 에러지만 자동 리다이렉트는 하지 않음 (백그라운드 작업)
      }
    }
  }, [chapterId, level, bookId, skipStartLevel]);

  // API 호출 함수
  const updateSessionStatus = useCallback(async (status, completed = false) => {
    // 완료된 레벨은 더 이상 업데이트하지 않음 (COMPLETED 전송 후)
    if (isCompletedRef.current || currentStatusRef.current === 'COMPLETED') {
      console.log('⏭️ 레벨 완료됨 - 상태 업데이트 스킵:', { status, level, currentStatus: currentStatusRef.current });
      return;
    }

    // COMPLETED 상태가 아닐 때만 업데이트
    // 이미 COMPLETED인 레벨에 대해서는 어떤 상태도 업데이트하지 않음
    if (status !== 'COMPLETED' && currentStatusRef.current === 'COMPLETED') {
      console.log('⏭️ 이미 COMPLETED 상태 - 업데이트 스킵:', { status, level });
      return;
    }

    // ISO 시간을 YYYY-MM-DDTHH:mm:ss 형식으로 변환
    const formatDateTime = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const payload = {
      userId: userId, // username을 userId로 사용
      chapterId,
      level,
      bookId,
      lastActive: formatDateTime(new Date(lastActiveRef.current)), // 실제 마지막 활동 시간 사용
      status,
      completed, // Level 6 완료 시 true, 나머지는 false
      minusFocusingScore: status === 'INACTIVE' ? 2 : 0, // INACTIVE일 때만 2, 나머지는 0
    };

    // 콘솔에 로그 출력 (레벨 정보 포함)
    console.log('📡 세션 상태 업데이트 요청:', {
      level,
      status,
      chapterId,
      ...payload,
      timeSinceStart: `${Math.floor((Date.now() - sessionStartRef.current) / 1000)}초`,
      timeSinceLastActive: `${Math.floor((Date.now() - lastActiveRef.current) / 1000)}초`,
      isCompleted: isCompletedRef.current,
      currentStatus: currentStatusRef.current,
    });

    // 실제 API 호출 (axios 사용)
    try {
      const response = await api.post('/api/session/update', payload, {
        // 이 요청은 인터셉터에서 자동 리다이렉트하지 않음
        skipAuthRedirect: true
      });
      
      console.log(`✅ 세션 상태 업데이트 성공: Level ${level}, Status ${status}`);
      console.log('응답 데이터:', response.data);
    } catch (error) {
      if (error.response) {
        console.error(`❌ 세션 업데이트 실패: Level ${level}, Status ${status}`, error.response.status, error.response.statusText);
        console.error('에러 응답 데이터:', error.response.data);
        // 401 에러지만 자동 리다이렉트는 하지 않음 (백그라운드 작업)
      } else {
        console.error('❌ 세션 업데이트 API 호출 실패:', error.message);
      }
    }

  }, [chapterId, level, userId, bookId]);

  // 활동 감지 핸들러
  const handleActivity = useCallback(() => {
    // 완료된 레벨은 활동 감지하지 않음
    if (isCompletedRef.current) {
      return;
    }

    const now = Date.now();
    const timeSinceLastActive = now - lastActiveRef.current;

    // INACTIVE 상태에서 활동 감지 시 즉시 ACTIVE로 전환
    if (currentStatusRef.current === 'INACTIVE') {
      console.log('🔄 활동 재개 감지: INACTIVE → ACTIVE (즉시 업데이트)');
      currentStatusRef.current = 'ACTIVE';
      updateSessionStatus('ACTIVE');
    }

    // 마지막 활동 시간 갱신
    lastActiveRef.current = now;

    // 기존 타이머 취소하고 새로 시작
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // 5분 후 INACTIVE 상태로 전환
    inactivityTimerRef.current = setTimeout(() => {
      if (currentStatusRef.current === 'ACTIVE' && !isCompletedRef.current) {
        console.log('⏸️ 비활성 감지 (5분 경과): ACTIVE → INACTIVE');
        currentStatusRef.current = 'INACTIVE';
        updateSessionStatus('INACTIVE');
      }
    }, INACTIVITY_THRESHOLD);
  }, [updateSessionStatus, INACTIVITY_THRESHOLD]);

  // Page Visibility 감지
  const handleVisibilityChange = useCallback(() => {
    // 완료된 레벨은 visibility 변경 감지하지 않음
    if (isCompletedRef.current) {
      return;
    }

    if (document.hidden) {
      // 언로드 중이면 INACTIVE 전환하지 않음 (EXIT 전송 대기 중)
      if (isUnloadingRef.current) {
        console.log('🚪 페이지 언로드 중 - INACTIVE 전환 스킵 (EXIT 대기)');
        return;
      }
      
      // 탭을 벗어남 - 즉시 INACTIVE로 전환
      if (currentStatusRef.current === 'ACTIVE') {
        console.log('👋 탭 벗어남 감지 (즉시 INACTIVE 전환)');
        currentStatusRef.current = 'INACTIVE';
        updateSessionStatus('INACTIVE');
      }
    } else {
      // 탭으로 돌아옴 - 즉시 ACTIVE로 전환
      console.log('👀 탭으로 복귀 감지 (즉시 ACTIVE 전환)');
      
      // 언로드 플래그 리셋 (사용자가 팝업에서 "취소" 선택)
      if (isUnloadingRef.current) {
        console.log('🚫 언로드 취소 감지 - isUnloadingRef 리셋');
        isUnloadingRef.current = false;
      }
      
      if (currentStatusRef.current === 'INACTIVE') {
        currentStatusRef.current = 'ACTIVE';
        updateSessionStatus('ACTIVE');
      }
      handleActivity(); // 활동으로 간주하고 타이머 재시작
    }
  }, [handleActivity, updateSessionStatus]);

  // beforeunload - 브라우저 확인 팝업만 표시
  const handleBeforeUnload = useCallback((event) => {
    console.log('🚪 beforeunload - 브라우저 확인 팝업 표시');
    
    // 언로드 플래그 설정
    isUnloadingRef.current = true;
    console.log('✅ isUnloadingRef = true 설정');
    
    // 브라우저 기본 확인 팝업 표시
    event.preventDefault();
    event.returnValue = '';
    
    console.log('💡 팝업 표시됨 - EXIT는 pagehide에서 전송 예정');
  }, []);

  // pagehide - 사용자가 "나가기" 선택 시만 EXIT 전송
  const handlePageHide = useCallback((event) => {
    // 완료된 레벨은 EXIT도 전송하지 않음
    if (isCompletedRef.current || currentStatusRef.current === 'COMPLETED') {
      console.log('⏭️ 레벨 완료됨 - EXIT 전송 스킵 (pagehide):', { level, currentStatus: currentStatusRef.current });
      return;
    }

    console.log('🚪🚪🚪 pagehide 이벤트 발생!');
    console.log('🔍 isUnloadingRef.current:', isUnloadingRef.current);
    console.log('🔍 event.persisted:', event.persisted);
    console.log('🔍 level:', level);
    
    if (!isUnloadingRef.current) {
      console.log('🚫 isUnloadingRef가 false - EXIT 전송 안 함 (탭 전환 또는 "취소" 선택)');
      return;
    }
    
    console.log('✅ 사용자가 "나가기" 선택 - EXIT 전송 시작 (Level', level, ')');
    currentStatusRef.current = 'EXIT';
    
    const formatDateTime = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const payload = {
      userId: userId,
      chapterId,
      level,
      lastActive: formatDateTime(new Date(lastActiveRef.current)),
      status: 'EXIT',
      completed: false,
      minusFocusingScore: 0,
      bookId: bookId,
    };

    console.log('📤 EXIT 상태 전송 (pagehide):', payload);

    // sendBeacon 사용 (페이지 종료 시에도 전송 보장)
    const url = `${process.env.REACT_APP_API_BASE_URL || ''}/api/session/update`;
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  }, [chapterId, level, userId, bookId]);

  // 학습 완료 함수
  const completeSession = useCallback(async () => {
    console.log('✅ 학습 완료 - COMPLETED 상태 전송');
    console.log('📊 세션 정보:', {
      userId,
      chapterId,
      level,
      bookId,
      sessionStart: new Date(sessionStartRef.current).toISOString(),
      sessionDuration: `${Math.floor((Date.now() - sessionStartRef.current) / 1000)}초`
    });
    
    // 완료 플래그 설정 (이후 모든 활동 감지 및 상태 업데이트 중단)
    isCompletedRef.current = true;
    currentStatusRef.current = 'COMPLETED';
    
    // 기존 타이머 취소 (활동 감지 중단)
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    
    // Level 6 완료 시 completed=true, 나머지는 false
    const isCompleted = level === 6;
    
    // COMPLETED 상태 전송 (isCompletedRef 체크를 우회하기 위해 직접 호출)
    const formatDateTime = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const payload = {
      userId: userId,
      chapterId,
      level,
      bookId,
      lastActive: formatDateTime(new Date(lastActiveRef.current)),
      status: 'COMPLETED',
      completed: isCompleted,
      minusFocusingScore: 0,
    };

    try {
      const response = await api.post('/api/session/update', payload, {
        skipAuthRedirect: true
      });
      console.log('✅ COMPLETED 상태 전송 완료', { completed: isCompleted, response: response.data });
    } catch (error) {
      console.error('❌ COMPLETED 상태 전송 실패:', error);
    }
    
    console.log('🛑 레벨 완료 - 이후 활동 감지 및 상태 업데이트 중단');
  }, [userId, chapterId, level, bookId]);

  // 명시적으로 EXIT 전송 (Exit 모달에서 "확인" 클릭 시)
  const sendExit = useCallback(async () => {
    // 완료된 레벨은 EXIT도 전송하지 않음
    if (isCompletedRef.current || currentStatusRef.current === 'COMPLETED') {
      console.log('⏭️ 레벨 완료됨 - EXIT 전송 스킵 (sendExit):', { level, currentStatus: currentStatusRef.current });
      return;
    }

    console.log('🚪 EXIT 버튼 확인 - EXIT 상태 전송 (Level', level, ')');
    currentStatusRef.current = 'EXIT';
    await updateSessionStatus('EXIT');
    console.log('✅ EXIT 상태 전송 완료 (Level', level, ')');
  }, [updateSessionStatus, level]);

  // 이벤트 리스너 등록
  useEffect(() => {
    console.log('🎬 활동 감지 시작:', { chapterId, level });
    
    // 1. start-level 호출 제거됨 (/api/session GET 로직으로 대체됨)
    // startLevel();
    
    // 활동 감지 이벤트들
    const events = [
      'mousedown',
      'mousemove', 
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];

    // 모든 이벤트에 throttle 적용 (성능 최적화)
    let throttleTimer = null;
    const throttledActivity = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          console.log('👆 사용자 활동 감지');
          handleActivity();
          throttleTimer = null;
        }, 3000); // 3초에 한 번만 실행 (콘솔 로그 과다 방지)
      }
    };

    // 이벤트 리스너 등록
    events.forEach(event => {
      window.addEventListener(event, throttledActivity, { passive: true });
    });

    // Page Visibility API
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // beforeunload - 확인 팝업만 표시 (EXIT 전송 안 함)
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // pagehide - 실제로 페이지가 언로드될 때 EXIT 전송
    window.addEventListener('pagehide', handlePageHide);
    console.log('✅ beforeunload & pagehide 이벤트 리스너 등록 완료');
    console.log('💡 beforeunload: 확인 팝업 표시');
    console.log('💡 pagehide: 실제 종료 시 EXIT 전송 (팝업에서 "나가기" 클릭 시)');

    // 2. 레벨 시작 후 타이머만 시작 (ACTIVE 상태는 startLevel에서 설정됨)
    handleActivity(); // 타이머 시작

    // 정기적으로 상태 확인 (선택적) - 5분 이상 비활성일 때만 INACTIVE로 전환
    const intervalId = setInterval(() => {
      // 완료된 레벨은 주기적 확인하지 않음
      if (isCompletedRef.current) {
        return;
      }

      const timeSinceLastActive = Date.now() - lastActiveRef.current;
      console.log('⏰ 주기적 확인:', {
        현재상태: currentStatusRef.current,
        마지막활동: `${Math.floor(timeSinceLastActive / 1000)}초 전`,
      });
      
      // 5분 이상 비활성 상태일 때만 INACTIVE로 전환
      if (timeSinceLastActive >= INACTIVITY_THRESHOLD && currentStatusRef.current === 'ACTIVE') {
        console.log('⏸️ 주기적 확인: 5분 이상 비활성 감지 → INACTIVE 전환');
        currentStatusRef.current = 'INACTIVE';
        updateSessionStatus('INACTIVE');
      }
    }, ACTIVITY_CHECK_INTERVAL);

    // Cleanup
    return () => {
      console.log('🛑 활동 감지 종료');
      
      events.forEach(event => {
        window.removeEventListener(event, throttledActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      clearInterval(intervalId);

      // 컴포넌트 언마운트 시 처리
      // cleanup에서는 아무 상태도 전송하지 않음
      // - ACTIVE/INACTIVE: 5분 타이머나 visibility API에서 처리
      // - EXIT: pagehide에서 처리
      // - COMPLETED: completeSession()에서 처리
      console.log('🛑 컴포넌트 언마운트: 상태 전송 없음 (현재 상태:', currentStatusRef.current, ')');
    };
  }, [handleActivity, handleVisibilityChange, handleBeforeUnload, handlePageHide, updateSessionStatus, chapterId, level, INACTIVITY_THRESHOLD, ACTIVITY_CHECK_INTERVAL]);

  return { completeSession, sendExit };
};

