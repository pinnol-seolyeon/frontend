//axios에서 로그인 이후 모든 요청에 쿠키 자동 전송 설정

import axios from 'axios';

const api=axios.create({
    baseURL:`${process.env.REACT_APP_API_BASE_URL}`,
    withCredentials:true, //쿠키를 자동으로 포함시키기
});

export default api;