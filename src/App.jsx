// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import AppRoutes from './AppRoutes';
import axios from 'axios';
import { ChapterProvider } from './context/ChapterContext';

// 메인페이지에서 사용되는 이미지들을 미리 로드
import Book from './assets/book.svg';
import Graph from './assets/graph.svg';
import Pencil from './assets/pencil.svg';
import CircleGraph from './assets/circle_graph.svg';

// 이미지를 미리 로드하여 캐시에 저장
const preloadMainImages = () => {
  const images = [Book, Graph, Pencil, CircleGraph];
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 앱 시작 시 이미지 프리로드
  useEffect(() => {
    preloadMainImages();
  }, []);

  // 로그인 체크 함수
  const checkLoginStatus = () => {
    console.log("🔍 로그인 상태 체크 시작");
    console.log("🔍 브라우저 쿠키:", document.cookie);
    
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, { withCredentials: true })
      .then(response => {
        console.log("✅ 로그인 확인", response.data);
        console.log("🔍 응답 상태:", response.status);
        console.log("🔍 사용자 데이터:", response.data);
        
        // 응답 데이터가 유효한 사용자 정보인지 확인
        if (response.data && response.data.name) {
          console.log("✅ 유효한 사용자 데이터 - 로그인 상태 설정");
          setLogin(true);
          setUser(response.data);
          return true;
        } else {
          console.log("⚠️ 사용자 데이터가 유효하지 않습니다.");
          setLogin(false);
          setUser(false);
          return false;
        }
      })
      .catch((error) => {
        console.log("✖️ 로그인되어 있지 않습니다.");
        console.log("🔍 에러 상세:", error.response?.status, error.response?.data);
        setLogin(false);
        setUser(false);
        return false;
      });
  };

  // 초기 로그인 체크
  useEffect(() => {
    checkLoginStatus().finally(() => {
      setIsLoading(false);
    });
  }, []);

  // 주기적 세션 체크 (5분마다)
  useEffect(() => {
    if (login) {
      const intervalId = setInterval(() => {
        console.log("🔄 주기적 세션 체크 중...");
        checkLoginStatus();
      }, 5 * 60 * 1000); // 5분

      return () => clearInterval(intervalId);
    }
  }, [login]);

  // 사용자 활동 감지 및 세션 연장 (마우스 움직임, 키보드 입력 등)
  useEffect(() => {
    if (!login) return;

    let activityTimer;
    
    const handleUserActivity = () => {
      // 이전 타이머 취소
      clearTimeout(activityTimer);
      
      // 3분 후 세션 체크 (사용자가 활동을 멈춘 후)
      activityTimer = setTimeout(() => {
        console.log("👤 사용자 활동 감지 - 세션 체크");
        checkLoginStatus();
      }, 3 * 60 * 1000); // 3분
    };

    // 사용자 활동 이벤트 리스너
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      clearTimeout(activityTimer);
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [login]);

  // ✅ navigate는 Hook 안에서만 실행되도록
  useEffect(() => {
    if (!isLoading && user === false) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);
  
  // 로딩 중에는 아무 것도 보여주지 않음
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
