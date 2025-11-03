import { useEffect, useRef, useCallback } from 'react';
import api from '../api/login/axiosInstance';

export const useActivityTracker = (chapterId, level, userId) => {
  const lastActiveRef = useRef(Date.now());
  const sessionStartRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);
  const currentStatusRef = useRef('ACTIVE'); // ACTIVE, INACTIVE, COMPLETED
  const levelStartedRef = useRef(false); // 레벨 시작 API 호출 여부
  
  const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5분
  const ACTIVITY_CHECK_INTERVAL = 30 * 1000; // 30초마다 확인

  // 레벨 시작 API 호출
  const startLevel = useCallback(async () => {
    if (!chapterId || !level || levelStartedRef.current) return;

    try {
      console.log('🎬 레벨 시작 API 호출:', { level, chapterId });
      const response = await api.post('/api/session/start-level', null, {
        params: {
          level,
          chapterId
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
  }, [chapterId, level]);

  // API 호출 함수
  const updateSessionStatus = useCallback(async (status, includeStartTime = false) => {
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
      lastActive: formatDateTime(new Date()),
      status,
      completed: false
    };

    // COMPLETED일 때만 startTime 포함
    if (includeStartTime) {
      payload.startTime = formatDateTime(new Date(sessionStartRef.current));
    }

    // 콘솔에 로그 출력
    console.log('📡 세션 상태 업데이트 요청:', {
      ...payload,
      timeSinceStart: `${Math.floor((Date.now() - sessionStartRef.current) / 1000)}초`,
      timeSinceLastActive: `${Math.floor((Date.now() - lastActiveRef.current) / 1000)}초`,
    });

    // 실제 API 호출 (axios 사용)
    try {
      const response = await api.post('/api/session/update', payload, {
        // 이 요청은 인터셉터에서 자동 리다이렉트하지 않음
        skipAuthRedirect: true
      });
      
      console.log(`✅ 세션 상태 업데이트 성공: ${status}`);
      console.log('응답 데이터:', response.data);
    } catch (error) {
      if (error.response) {
        console.error(`❌ 세션 업데이트 실패: ${error.response.status} ${error.response.statusText}`);
        console.error('에러 응답 데이터:', error.response.data);
        // 401 에러지만 자동 리다이렉트는 하지 않음 (백그라운드 작업)
      } else {
        console.error('❌ 세션 업데이트 API 호출 실패:', error.message);
      }
    }

  }, [chapterId, level, userId]);

  // 활동 감지 핸들러
  const handleActivity = useCallback(() => {
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
      if (currentStatusRef.current === 'ACTIVE') {
        console.log('⏸️ 비활성 감지 (5분 경과): ACTIVE → INACTIVE');
        currentStatusRef.current = 'INACTIVE';
        updateSessionStatus('INACTIVE');
      }
    }, INACTIVITY_THRESHOLD);
  }, [updateSessionStatus, INACTIVITY_THRESHOLD]);

  // Page Visibility 감지
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // 탭을 벗어남 - 5분 후에 INACTIVE로 전환되도록 타이머만 유지
      console.log('👋 탭 벗어남 감지 (5분 후 INACTIVE 전환 예정)');
      // 타이머는 handleActivity에서 이미 설정되어 있으므로 별도 처리 불필요
    } else {
      // 탭으로 돌아옴 - 즉시 ACTIVE로 전환
      console.log('👀 탭으로 복귀 감지 (즉시 ACTIVE 전환)');
      if (currentStatusRef.current === 'INACTIVE') {
        currentStatusRef.current = 'ACTIVE';
        updateSessionStatus('ACTIVE');
      }
      handleActivity(); // 활동으로 간주하고 타이머 재시작
    }
  }, [handleActivity, updateSessionStatus]);

  // 학습 완료 함수
  const completeSession = useCallback(() => {
    console.log('✅ 학습 완료 - COMPLETED 상태 전송');
    currentStatusRef.current = 'COMPLETED';
    updateSessionStatus('COMPLETED', true); // startTime 포함
  }, [updateSessionStatus]);

  // 이벤트 리스너 등록
  useEffect(() => {
    console.log('🎬 활동 감지 시작:', { chapterId, level });
    
    // 1. 먼저 레벨 시작 API 호출
    startLevel();
    
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

    // 2. 레벨 시작 후 타이머만 시작 (ACTIVE 상태는 startLevel에서 설정됨)
    handleActivity(); // 타이머 시작

    // 정기적으로 상태 확인 (선택적) - 5분 이상 비활성일 때만 INACTIVE로 전환
    const intervalId = setInterval(() => {
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
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      clearInterval(intervalId);

      // 컴포넌트 언마운트 시 INACTIVE로 전환
      if (currentStatusRef.current === 'ACTIVE') {
        console.log('📤 컴포넌트 종료: INACTIVE 전송');
        updateSessionStatus('INACTIVE');
      }
    };
  }, [handleActivity, handleVisibilityChange, updateSessionStatus, startLevel, chapterId, level, INACTIVITY_THRESHOLD, ACTIVITY_CHECK_INTERVAL]);

  return { completeSession };
};

