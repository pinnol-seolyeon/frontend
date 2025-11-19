import api from '../login/axiosInstance';

/**
 * 복습해야 할 단원들 리스트 조회
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @returns {Promise<Object>} 복습 단원 리스트 데이터
 */
export async function fetchReviewList(page = 0) {
  try {
    console.log('🔍 fetchReviewList 요청 시작, page:', page);
    console.log('🔍 쿠키 확인:', document.cookie);
    
    const response = await api.get('/api/review', {
      params: {
        page: page
      }
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
    
    // 404 에러가 발생하면 빈 데이터 반환
    if (error.response?.status === 404) {
      console.log('⚠️ 404 에러 - 데이터 없음, 빈 데이터 반환');
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        number: 0,
        first: true,
        last: true,
        empty: true
      };
    }
    
    throw error;
  }
}

