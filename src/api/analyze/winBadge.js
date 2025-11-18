import api from '../login/axiosInstance';

/**
 * 뱃지 획득 API
 * @param {string} chapterId - 챕터 ID
 * @param {string|string[]} badgeType - 뱃지 타입 ('SPEED_HUNTER' | 'FINE_HUNTER' | ['SPEED_HUNTER', 'FINE_HUNTER'])
 * @returns {Promise} API 응답
 */
export async function winBadge(chapterId, badgeType) {
  try {
    const badgeTypes = Array.isArray(badgeType) ? badgeType : [badgeType];
    
    const response = await api.post('/api/badge/win-badge', {
      chapterId: chapterId,
      badgeType: badgeTypes
    });
    
    console.log('✅ 뱃지 획득 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 뱃지 획득 실패:', error);
    throw error;
  }
}

