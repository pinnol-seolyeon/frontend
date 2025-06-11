export async function saveCoinToDB(coin) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload-coin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",  // ✅ 중요! 쿠키 기반 세션을 보내려면 이 옵션 필요
      body: JSON.stringify({
        coin
      })
    });

    if (!res.ok) {
      throw new Error("❌ 점수 저장 실패");
    }

    console.log("✅ 점수 저장 성공");
    
  } catch (error) {
    console.error("❌ 저장 중 에러:", error);
  }
}


