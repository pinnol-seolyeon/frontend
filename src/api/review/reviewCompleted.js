import api from '../login/axiosInstance';

/**
 * 1차/2차 복습 완료 시 호출
 * @param {number} reviewCount - 복습 횟수 (1차: 1, 2차: 2)
 * @param {string} chapterId - 단원 ID
 * @param {Array} quizResults - 퀴즈 결과 배열 [{ quizId, question, options, correctAnswer, userAnswer, isCorrect, quizDate }]
 * @returns {Promise<Object>} 응답 데이터 { message, status, data: {} }
 */
export async function reviewCompleted(reviewCount, chapterId, quizResults) {
  try {
    console.log('🔍 reviewCompleted 요청 시작, reviewCount:', reviewCount, 'chapterId:', chapterId);
    console.log('🔍 퀴즈 결과:', quizResults);
    
    const response = await api.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/review/review-completed`,
      quizResults,
      {
        params: {
          reviewCount: reviewCount,
          chapterId: chapterId
        },
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ 복습 완료 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ reviewCompleted 실패:', error);
    console.error('❌ 에러 상세:', error.response?.data);
    throw error;
  }
}

