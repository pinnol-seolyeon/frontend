export async function saveCoinToDB(coin, chapterId) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload-point`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",  // ✅ 중요! 쿠키 기반 세션을 보내려면 이 옵션 필요
      body: JSON.stringify({
        coin,
        category: "GAME",
        chapterId,
        positive: true
      })
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("❌ 점수 저장 실패:", errorData);
      throw new Error("❌ 점수 저장 실패");
    }

    const data = await res.json();
    console.log("✅ 점수 저장 성공:", data);
    
  } catch (error) {
    console.error("❌ 저장 중 에러:", error);
  }
}


