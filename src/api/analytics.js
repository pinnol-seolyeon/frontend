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


export async function fetchTodayStudyTime() {
  const res = await fetch(`http://localhost:8080/api/study/today`, {
    credentials: 'include'
  });
  return res.json();
}

export async function fetchAttendance(year, month) {
  const res = await fetch(`http://localhost:8080/api/study/calendar?year=${year}&month=${month}`, {
    credentials: 'include'
  });
  return res.json();
}
