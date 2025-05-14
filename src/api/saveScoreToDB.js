async function saveScoreToDB(score) {
  try {
    const res = await fetch('http://localhost:8080/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error('점수 저장 실패');
    console.log('✅ 점수 저장 성공');
  } catch (error) {
    console.error('❌ 점수 저장 에러:', error);
  }
}
