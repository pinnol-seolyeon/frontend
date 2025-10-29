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

// 학습 선호 시간대 분석
export async function fetchStudyTimeStats() {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/preferred-time`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('✅ 선호 학습 시간대 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchStudyTimeStats 실패:', error);
    throw error;
  }
}

// 방사형 그래프 데이터
export async function fetchRadarScore() {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/analysis/radar-score/compare`, {
      method: 'GET',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      const text = await res.text();
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
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/questions/dates`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('✅ 질문 날짜 목록:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchQuestionDates 실패:', error);
    throw error;
  }
}

export async function fetchQuestionsByDate(dateStr) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/questions/history?date=${dateStr}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log('✅ 질문 내역 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchQuestionsByDate 실패:', error);
    throw error;
  }
}