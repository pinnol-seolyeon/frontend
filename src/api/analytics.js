export async function fetchScoreResults() {
  try {
  const res = await fetch("http://localhost:8080/api/scores/results", {
    credentials: "include"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  console.log("✅ Score data:", data, Array.isArray(data));
} catch (err) {
  console.error("❌ Fetch failed:", err);
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
