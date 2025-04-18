import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트 불러오기
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 경로 - 대시보드(학습 분석) */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
