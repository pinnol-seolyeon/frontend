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
    axios.get('https://finnol.site/api/user', { withCredentials: true })
      .then(response => {
        const isFirstLogin = response.data.firstLogin;
        console.log("✅로그인 확인",response.data);
        setLogin(true);
        setUser(response.data);

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
    <ChapterProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <AppContent />
      </Router>
    </ChapterProvider>
  );
}
