export async function sendQuizResults(results) {
  try {

    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/quiz-result`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(results),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    console.log("✅ 퀴즈 결과 전송 성공");
  } catch (error) {
    console.error("❌ 퀴즈 결과 전송 실패:", error);
  }
}
