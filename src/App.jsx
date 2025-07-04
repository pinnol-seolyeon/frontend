// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Header from './components/Header';
import axios from 'axios';
import { ChapterProvider } from './context/ChapterContext';


function AppContent() {
  const [login, setLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, { withCredentials: true })
      .then(response => {
        console.log("✅ 로그인 확인", response.data);
        setLogin(true);
        setUser(response.data);
      })
      .catch(() => {
        console.log("✖️ 로그인되어 있지 않습니다.");
        setLogin(false);
        setUser(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  // ✅ navigate는 Hook 안에서만 실행되도록
  useEffect(() => {
    if (!isLoading && user === false) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  // ✅ 로딩 중에는 아무 것도 보여주지 않음
  if (isLoading) return null;

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
        <AppContent /> 
      </Router>
    </ChapterProvider>
  );
}
