// 학습 참여도
export async function fetchStudyStats() {
  try {
    console.log('🔍 fetchStudyStats 요청 시작');
    console.log('🔍 쿠키 확인:', document.cookie);
    
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study-log/this-week/chapters`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 응답 상태:', res.status);
    console.log('🔍 응답 헤더:', [...res.headers.entries()]);

    // 404 에러가 발생하면 0을 반환
    if (res.status === 404) {
      console.log('⚠️ 404 에러 - 데이터 없음, 0 반환');
      return 0;
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ fetchStudyStats 실패:', res.status, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('✅ 학습 통계 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchStudyStats 실패:', error);
    throw error;
  }
}

export async function fetchStudyNowStats() {
  try {
    console.log('🔍 fetchStudyNowStats 요청 시작');
    console.log('🔍 쿠키 확인:', document.cookie);
    
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study-log/now-studying`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 응답 상태:', res.status);
    console.log('🔍 응답 헤더:', [...res.headers.entries()]);

    // 401 에러 - 백엔드 권한 문제, null 반환
    if (res.status === 401 || res.status === 403) {
      console.warn('⚠️ 401/403 에러 - 백엔드 권한 문제, null 반환');
      return null;
    }

    // 404 에러가 발생하면 null 반환
    if (res.status === 404) {
      console.log('⚠️ 404 에러 - 데이터 없음, null 반환');
      return null;
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ fetchStudyNowStats 실패:', res.status, text);
      // 에러를 던지지 않고 null 반환 (다른 API는 계속 작동)
      return null;
    }

    const data = await res.json();
    console.log('✅ 현재 학습 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchStudyNowStats 실패:', error);
    // 에러를 던지지 않고 null 반환
    return null;
  }
}


export async function fetchTotalProgress() {
  try {
    console.log('🔍 fetchTotalProgress 요청 시작');
    console.log('🔍 쿠키 확인:', document.cookie);
    
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study-log/overall-progress`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 응답 상태:', res.status);
    console.log('🔍 응답 헤더:', [...res.headers.entries()]);

    // 404 에러가 발생하면 0을 반환
    if (res.status === 404) {
      console.log('⚠️ 404 에러 - 데이터 없음, 0 반환');
      return 0;
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ fetchStudyNowStats 실패:', res.status, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('✅ 학습 통계 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchStudyNowStats 실패:', error);
    throw error;
  }
}


// 학습 선호 시간대 분석 (주간 학습 패턴)
export async function fetchStudyTimeStats() {
  try {
    console.log('🔍 fetchStudyTimeStats 요청 시작');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study-log/weekly-pattern`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 응답 상태:', res.status);

    // 404 에러가 발생하면 null 데이터 반환
    if (res.status === 404) {
      console.log('⚠️ 404 에러 - 데이터 없음, null 반환');
      return {
        preferredType: null,
        weeklyStats: {}
      };
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ fetchStudyTimeStats 실패:', res.status, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const response = await res.json();
    console.log('✅ 주간 학습 패턴 원본 데이터:', response);
    
    // response.data가 null이거나 빈 배열이면 null 반환
    if (!response.data || response.data.length === 0) {
      console.log('⚠️ 데이터가 비어있음, null 반환');
      return {
        preferredType: null,
        weeklyStats: {}
      };
    }
    
    // API 응답 데이터 변환
    const data = transformWeeklyPatternData(response.data);
    console.log('✅ 변환된 학습 시간대 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchStudyTimeStats 실패:', error);
    throw error;
  }
}

// 주간 학습 패턴 데이터를 컴포넌트 형식으로 변환
function transformWeeklyPatternData(apiData) {
  // 요일 매핑: MONDAY -> 월, TUESDAY -> 화, ...
  const dayMap = {
    'MONDAY': '월',
    'TUESDAY': '화',
    'WEDNESDAY': '수',
    'THURSDAY': '목',
    'FRIDAY': '금',
    'SATURDAY': '토',
    'SUNDAY': '일'
  };

  // 시간대 타입 매핑: 아침형 -> morning, 낮형 -> afternoon, 밤형 -> evening, 새벽형 -> night
  const timeZoneMap = {
    '아침형': 'morning',
    '낮형': 'afternoon',
    '밤형': 'evening',
    '새벽형': 'night'
  };

  // 초기화: 요일별 시간대별 분 초기화
  const weeklyStats = {
    '일': { morning: 0, afternoon: 0, evening: 0, night: 0 },
    '월': { morning: 0, afternoon: 0, evening: 0, night: 0 },
    '화': { morning: 0, afternoon: 0, evening: 0, night: 0 },
    '수': { morning: 0, afternoon: 0, evening: 0, night: 0 },
    '목': { morning: 0, afternoon: 0, evening: 0, night: 0 },
    '금': { morning: 0, afternoon: 0, evening: 0, night: 0 },
    '토': { morning: 0, afternoon: 0, evening: 0, night: 0 }
  };

  // 전체 시간대별 총합 (preferredType 계산용)
  const totalByTimeZone = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  };

  // API 데이터 변환
  apiData.forEach(item => {
    const day = dayMap[item.dayOfWeek];
    const timeZoneKey = timeZoneMap[item.timeZone];
    
    if (day && timeZoneKey && item.minutes) {
      weeklyStats[day][timeZoneKey] += item.minutes;
      totalByTimeZone[timeZoneKey] += item.minutes;
    }
  });

  // preferredType 계산: 가장 많이 학습한 시간대
  const maxTime = Math.max(...Object.values(totalByTimeZone));
  const totalTime = Object.values(totalByTimeZone).reduce((sum, val) => sum + val, 0);
  
  // 데이터가 없으면 null 반환
  if (totalTime === 0 || apiData.length === 0) {
    return {
      preferredType: null,
      weeklyStats
    };
  }
  
  let preferredType = '언제든지좋아형';
  
  // 총 학습 시간이 있고, 가장 높은 시간대가 다른 시간대들의 평균보다 크면 해당 타입
  if (totalTime > 0 && maxTime > 0) {
    const avgTime = totalTime / 4;
    // 최대값이 평균의 1.5배 이상이면 해당 타입, 아니면 고르게 분포된 것으로 판단
    if (maxTime >= avgTime * 1.5) {
      if (totalByTimeZone.morning === maxTime) {
        preferredType = '아침형';
      } else if (totalByTimeZone.afternoon === maxTime) {
        preferredType = '낮형';
      } else if (totalByTimeZone.evening === maxTime) {
        preferredType = '밤형';
      } else if (totalByTimeZone.night === maxTime) {
        preferredType = '새벽형';
      }
    }
  }

  return {
    preferredType,
    weeklyStats
  };
}

// 방사형 그래프 데이터
export async function fetchRadarScore() {
  try {
    console.log('🔍 fetchRadarScore 요청 시작');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study-log/radar-score/compare`, {
      method: 'GET',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🔍 응답 상태:', res.status);

    // 404 에러가 발생하면 빈 데이터 반환 (아직 weekly analysis가 생성되지 않은 경우)
    if (res.status === 404) {
      console.log('⚠️ 404 에러 - weekly analysis 데이터 없음, 빈 데이터 반환');
      return {
        thisWeek: {},
        lastWeek: {}
      };
    }
    
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ fetchRadarScore 실패:', res.status, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    
    const data = await res.json();
    console.log('✅ 방사형 그래프 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchRadarScore 실패:', error);
    throw error;
  }
}


// 질문 보여주기
export async function fetchQuestionDates() {
  try {
    console.log('🔍 fetchQuestionDates 요청 시작');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study-log/questions/dates`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 응답 상태:', res.status);

    // 404 에러가 발생하면 빈 배열 반환
    if (res.status === 404) {
      console.log('⚠️ 404 에러 - 데이터 없음, 빈 배열 반환');
      return [];
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ fetchQuestionDates 실패:', res.status, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('✅ 질문 날짜 목록:', data);
    // 응답이 배열 형태로 바로 옴 (예: ["2025-10-31"])
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ fetchQuestionDates 실패:', error);
    throw error;
  }
}

export async function fetchQuestionsByDate(dateStr) {
  try {
    console.log('🔍 fetchQuestionsByDate 요청 시작, date:', dateStr);
    // date는 ISO 형식 (YYYY-MM-DD)
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study-log/questions/history?date=${dateStr}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 응답 상태:', res.status);

    // 404 에러가 발생하면 빈 배열 반환
    if (res.status === 404) {
      console.log('⚠️ 404 에러 - 데이터 없음, 빈 배열 반환');
      return [];
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ fetchQuestionsByDate 실패:', res.status, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const response = await res.json();
    console.log('✅ 질문 내역 원본 데이터:', response);
    
    // 응답 형식: { message, status, data: [{ questions: [], answers: [] }] }
    const data = response.data || [];
    console.log('✅ 질문 내역 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchQuestionsByDate 실패:', error);
    throw error;
  }
}