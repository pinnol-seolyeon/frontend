/**
 * 포인트 히스토리 조회
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기 (기본 7)
 */
export async function fetchPointHistory(page = 0, size = 7) {
  try {
    console.log('🔍 fetchPointHistory 요청:', { page, size });
    
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/point-history?page=${page}&size=${size}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('🔍 응답 상태:', res.status);

    // 404 에러가 발생하면 빈 데이터 반환
    if (res.status === 404) {
      console.log('⚠️ 404 에러 - 데이터 없음, 빈 배열 반환');
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: size,
      };
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ fetchPointHistory 실패:', res.status, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const response = await res.json();
    console.log('✅ 포인트 히스토리 응답:', response);
    
    return response.data; // data 필드 반환 (페이지네이션 정보 포함)
  } catch (error) {
    console.error('❌ fetchPointHistory 실패:', error);
    throw error;
  }
}

