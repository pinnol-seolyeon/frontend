// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Header from './components/Header';
import axios from 'axios';
import { ChapterProvider } from './context/ChapterContext';

function AppContent() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  fetch('https://finnol.site/api/user', {
    method: 'GET',
    credentials: 'include', // ✅ 쿠키 포함 (SameSite=None + Secure 쿠키 전달)
  })
    .then(response => {
      if (!response.ok) throw new Error('인증 실패');
      return response.json();
    })
    .then(data => {
      const isFirstLogin = data.firstLogin;
      console.log("✅로그인 확인", data);
      setLogin(true);
      setUser(data);

      // if (isFirstLogin) {
      //   navigate("/childInfo");
      // } else {
      //   navigate("/main");
      // }
    })
    .catch(() => {
      console.log('✖️로그인되어 있지 않습니다.');
      setLogin(false);
      setUser(null);
      navigate("/login");
    });
}, [navigate]);

  return (
    <>
      <Header login={login} setLogin={setLogin} user={user} />
      <AppRoutes login={login} setLogin={setLogin} user={user} />
    </>
  );
}

export default function App() {
  return (
    // 전역 상태 관리 context API 제공 
    <ChapterProvider> 
      <Router>
        {/*실제 렌더링 및 로그인 검사 로직*/}
        <AppContent /> 
      </Router>
    </ChapterProvider>
  );
}
