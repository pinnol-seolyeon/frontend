// 학습 참여도
export async function fetchStudyStats() {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/stats`, {
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
    console.log('✅ 학습 통계 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchStudyStats 실패:', error);
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