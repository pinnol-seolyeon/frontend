import api from '../login/axiosInstance';

/**
 * 복습해야 할 단원들 리스트 조회
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @returns {Promise<Object>} 복습 단원 리스트 데이터
 */
export async function fetchReviewContent(reviewCount, chapterId) {
  try {
    console.log('🔍 fetchReviewContent 요청 시작, chapterId:', chapterId);
    console.log('🔍 쿠키 확인:', document.cookie);
    
    const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/review/ai/text-review?reviewCount=${reviewCount}&chapterId=${chapterId}`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ 복습 리스트 응답:', response.data);
    
    // 응답 구조: { message, status, data: { content: [...], totalPages, ... } }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ fetchReviewList 실패:', error);
    console.error('❌ 에러 상세:', error.response?.data);
    
    // 404 에러가 발생하면 빈 데이터 반환 (textbook 필드 포함)
    if (error.response?.status === 404) {
      console.log('⚠️ 404 에러 - quiz notes를 찾을 수 없음');
      const errorMessage = error.response?.data?.message || '해당 유저, 챕터에 대한 quiz notes를 찾을 수 없어요.';
      return {
        chapterId: chapterId,
        textbook: []
      };
    }
    
    throw error;
  }
}

