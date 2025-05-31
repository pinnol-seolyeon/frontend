// 학습 참여도
export async function fetchStudyStats() {
  try {
    const res = await fetch('http://localhost:8080/api/study/stats', {
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
    return data;
  } catch (error) {
    console.error('❌ fetchStudyStats 실패:', error);
    throw error;
  }
}

// 학습 선호 시간대 분석
export async function fetchStudyTimeStats() {
  try {
    const res = await fetch('http://localhost:8080/api/study/preferred-time', {
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
    return data;
  } catch (error) {
    console.error('❌ fetchStudyTimeStats 실패:', error);
    throw error;
  }
}

// 방사형 그래프 데이터
export async function fetchRadarScore() {
  const res = await fetch("http://localhost:8080/api/analysis/radar-score/compare", {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Radar score fetch failed");
  return await res.json();
}


// 질문 보여주기
export async function fetchQuestionDates() {
  const res = await fetch('http://localhost:8080/api/study/questions/dates', {
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`❌ 날짜 조회 실패: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function fetchQuestionsByDate(dateStr) {
  const res = await fetch(`http://localhost:8080/api/study/questions/history?date=${dateStr}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`❌ 질문 내역 조회 실패: ${res.status} ${text}`);
  }

  return await res.json();
}