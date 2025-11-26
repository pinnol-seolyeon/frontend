import api from '../login/axiosInstance';

/**
 * [AI] 복습하기 - 퀴즈풀기
 * 오답노트 기반 맞춤 퀴즈 생성
 * @param {number} reviewCount - 복습 횟수 (1차: 1, 2차: 2)
 * @param {string} chapterId - 단원 ID
 * @returns {Promise<Object>} 퀴즈 데이터 { message, status, data: [{ sourceQuizId, twinQuestion, correctAnswer, explanation }] }
 */
export async function fetchQuizReview(reviewCount, chapterId) {
  try {
    console.log('🔍 fetchQuizReview 요청 시작, reviewCount:', reviewCount, 'chapterId:', chapterId);
    console.log('🔍 쿠키 확인:', document.cookie);
    
    const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/api/review/ai/quiz-review`, {
      params: {
        reviewCount: reviewCount,
        chapterId: chapterId
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ 퀴즈 리뷰 응답:', response.data);
    
    // 응답 구조: { message, status, data: [{ sourceQuizId, twinQuestion, correctAnswer, explanation }] }
    if (response.data && response.data.data) {
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ fetchQuizReview 실패:', error);
    console.error('❌ 에러 상세:', error.response?.data);
    throw error;
  }
}

