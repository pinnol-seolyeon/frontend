// Callback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 쿠키가 정상적으로 저장된 이후에 요청
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, { withCredentials: true })
      .then(res => {
        const isFirstLogin = res.data.firstLogin;
        if (isFirstLogin) {
          navigate('/childinfo');
        } else {
          navigate('/main');
        }
      })
      .catch(() => {
        console.log('❌ 사용자 인증 실패');
        navigate('/login');
      });
  }, [navigate]);

  return <div>로그인 확인 중입니다...</div>;
}
