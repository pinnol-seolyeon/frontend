import api from '../login/axiosInstance';

/**
 * 결제 요청 API (서버에 결제 정보 전송)
 * @param {Object} paymentData - 결제 요청 데이터
 * @param {string} paymentData.payType - 결제 타입 (예: "EASY_PAY")
 * @param {number} paymentData.amount - 결제 금액
 * @param {number} paymentData.quantity - 수량
 * @param {string} paymentData.orderName - 주문명 (예: "MONTH")
 * @param {string} paymentData.customerEmail - 고객 이메일
 * @param {string} paymentData.customerName - 고객 이름
 * @returns {Promise<Object>} orderId가 포함된 응답
 */
export async function requestPayment(paymentData) {
  try {
    const response = await api.post('/api/payment', {
      payType: paymentData.payType || 'EASY_PAY',
      amount: paymentData.amount,
      quantity: paymentData.quantity || 1,
      orderName: paymentData.orderName,
      customerEmail: paymentData.customerEmail,
      customerName: paymentData.customerName,
    });

    if (!response.data?.data?.orderId) {
      throw new Error('orderId가 응답에 없습니다');
    }

    console.log('✅ 결제 요청 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 결제 요청 실패:', error);
    
    // 백엔드에서 오는 에러 메시지 추출
    let errorMessage = '결제 요청 중 오류가 발생했습니다.';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      // 백엔드 에러 응답 구조에 따라 메시지 추출
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.data?.message) {
        errorMessage = errorData.data.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // 에러 객체에 메시지 추가
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    enhancedError.errorCode = error.response?.data?.code;
    
    throw enhancedError;
  }
}

/**
 * 주문자 정보 조회 API
 * @returns {Promise<Object>} 주문자 정보 (name, phone, email 등)
 */
export async function fetchOrdererInfo() {
  try {
    const response = await api.get('/api/payment/orderer-info');
    
    if (!response.data?.data) {
      throw new Error('주문자 정보를 가져올 수 없습니다');
    }

    console.log('✅ 주문자 정보 조회 성공:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ 주문자 정보 조회 실패:', error);
    
    // 에러 메시지 추출
    let errorMessage = '주문자 정보를 가져오는 중 오류가 발생했습니다.';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}

