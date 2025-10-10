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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401/403 에러 발생 시 로그인 페이지로 리다이렉트
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log('🔒 인증 오류 발생 - 로그인 페이지로 이동합니다.');
            
            // 현재 페이지가 로그인 페이지가 아닐 때만 리다이렉트
            if (!window.location.pathname.includes('/login')) {
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// 마지막 활동 시간 가져오기 (외부에서 사용 가능)
export const getLastActivityTime = () => lastActivityTime;

export default api;