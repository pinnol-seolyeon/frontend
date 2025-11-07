//axios에서 로그인 이후 모든 요청에 쿠키 자동 전송 설정

import axios from 'axios';

const api=axios.create({
    baseURL:`${process.env.REACT_APP_API_BASE_URL}`,
    withCredentials:true, //쿠키를 자동으로 포함시키기
});

// 마지막 활동 시간 업데이트
let lastActivityTime = Date.now();

// 요청 인터셉터: 모든 요청 시 마지막 활동 시간 업데이트
api.interceptors.request.use(
    (config) => {
        lastActivityTime = Date.now();
        console.log('🔍 API 요청:', config.method?.toUpperCase(), config.url);
        console.log('🔍 withCredentials:', config.withCredentials);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401/403 에러 발생 시 로그인 페이지로 리다이렉트
api.interceptors.response.use(
    (response) => {
        console.log('✅ API 응답 성공:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.log('❌ API 응답 에러:', error.config?.url, error.response?.status);
        console.log('🔍 에러 상세:', error.response?.data);
        
        // skipAuthRedirect 플래그가 있으면 자동 리다이렉트 하지 않음
        const skipAuthRedirect = error.config?.skipAuthRedirect;
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (skipAuthRedirect) {
                console.log('🔕 인증 오류 발생 (백그라운드 작업 - 리다이렉트 스킵)');
            } else {
                console.log('🔒 인증 오류 발생:', error.config?.url);
                console.log('🔍 현재 경로:', window.location.pathname);
                // 알림 및 리다이렉트 제거 (디버깅용)
            }
        }
        return Promise.reject(error);
    }
);

// 마지막 활동 시간 가져오기 (외부에서 사용 가능)
export const getLastActivityTime = () => lastActivityTime;

export default api;