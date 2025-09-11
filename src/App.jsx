// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import AppRoutes from './AppRoutes';
import axios from 'axios';
import { ChapterProvider } from './context/ChapterContext';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif !important;
      ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  body, div, span, p, h1, h2, h3, h4, h5, h6, button, input, textarea, select {
    font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif !important;
  }


`;

const theme = {
  fonts: {
    primary: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
  }
};

function AppContent() {
  const [login, setLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 false로 변경
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 로그인 체크 로직
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, { withCredentials: true })
    // axios.get(`https://api.finnol.co.kr/api/user`, { withCredentials: true })
      .then(response => {
        console.log("✅ 로그인 확인", response.data);
        
        // 사용자 데이터 유효성 검증
        const userData = response.data;
        const isValidUser = userData && 
          (userData.username || userData.childName) && 
          typeof userData === 'object';
        
        if (isValidUser) {
          console.log("✅ 유효한 사용자 데이터 확인");
          setLogin(true);
          setUser(userData);
        } else {
          console.log("⚠️ 사용자 데이터가 유효하지 않음:", userData);
          setLogin(false);
          setUser(null);
          // 유효하지 않은 사용자 데이터면 로그인 페이지로 리다이렉트
          navigate('/login');
        }
      })
      .catch(() => {
        console.log("✖️ 로그인되어 있지 않습니다.");
        setLogin(false);
        setUser(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]); // navigate 제거

  // ✅ navigate는 Hook 안에서만 실행되도록
  useEffect(() => {
    if (!isLoading && (user === false || user === null)) {
      console.log("🚀 로그인 페이지로 리다이렉트 (user:", user, ")");
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  // ✅ 로딩 중에는 아무 것도 보여주지 않음
  if (isLoading) return null;

  return (
    <>
      <AppRoutes login={login} setLogin={setLogin} user={user} />
    </>
  );
}


export default function App() {
  return (
    // 전역 상태 관리 context API 제공 
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ChapterProvider> 
        <Router>
          <AppContent /> 
        </Router>
      </ChapterProvider>
    </ThemeProvider>
  );
}
