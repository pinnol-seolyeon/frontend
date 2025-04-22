const BASE_URL = "http://localhost:8080/api";

export async function fetchQuizResults(userId) {
  const res = await fetch(`${BASE_URL}/quiz/results?userId=${userId}`);
  return res.json();
}

export async function fetchTodayStudyTime(userId) {
  const res = await fetch(`${BASE_URL}/study/today?userId=${userId}`);
  return res.json();
}

export async function fetchAttendance(userId, year, month) {
  const res = await fetch(`${BASE_URL}/study/calendar?userId=${userId}&year=${year}&month=${month}`);
  return res.json();
}
