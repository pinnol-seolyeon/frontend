// AppRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import Login from './pages/login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import StudyPage1 from './pages/study/level1/StudyPage1';
import StudyPage2 from './pages/study/level1/StudyPage2';
import StudyLevel2 from './pages/study/level2/StudyLevel2';
import StudyLevel3 from './pages/study/level3/StudyLevel3';
import StudyLevel6_summary from './pages/study/level6/StudyLevel6_summary';
import StudyLevel6 from './pages/study/level6/StudyLevel6';
import StudyLv6_2 from './pages/study/level6/StudyLv6_2';
import Question from './pages/Question';
import Game from './pages/game/Game';
import ChildInfo from './pages/login/ChildInfo';
import Main from './pages/main/Main.jsx';
import ReviewPage from './pages/review/ReviewPage';
import BookListPage from './pages/study/Book/BookListPage';
import ChapterPage from './pages/study/Chapter/ChapterPage';
import StudyLv2_withImg from './pages/study/level2/StudyLv2_withImg';
import Callback from './pages/login/Callback';


const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }

  // #root {
  //   width: 80%;
  // }
  ::-webkit-scrollbar {
    display: none;
  }
`;

//  Route 정보 배열로 정리
const routes = [
  { path: '/main',element:<Main/>},
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/login', element: <Login /> },
  {path:'/callback',element:<Callback/>},
  {path:'/callback/oauth2/authorization/kakao',element:<Callback/>},
  { path: '/childInfo', element: <ChildInfo /> },
  { path: '/study/1', element: <StudyPage1 /> },
  { path: '/study/2', element: <StudyPage2 /> },
  { path: '/study/level2', element: <StudyLevel2 /> },
  { path: '/study/level3', element: <StudyLevel3 /> },
  { path: '/study/level6/summary', element: <StudyLevel6_summary /> },
  { path: '/study/level6/1', element: <StudyLevel6 /> },
  { path: '/study/level6/2', element: <StudyLv6_2 /> },
  { path: '/question', element: <Question /> },
  { path: '/review', element: <ReviewPage/> },
  { path: '/game', element: <Game/> },
  {path:'/book',element:<BookListPage/>},
  {path:'/book/chapter',element:<ChapterPage/>},
  {path:'/study/level2-img',element:<StudyLv2_withImg/>}
];

export default function AppRoutes({ login, setLogin, user }) {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  // 로그인이 필요한 페이지들
  const protectedRoutes = ['/','/main', '/dashboard', '/study', '/question', '/review', '/game', '/book', '/analyze', '/status'];
  const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));

  // 로그인하지 않은 상태에서 보호된 페이지에 접근하면 로그인 페이지로 리다이렉트
  if (!login && isProtectedRoute) {
    return <Login login={login} setLogin={setLogin} user={user} />;
  }

  return (
    <>
      <GlobalStyles />
      <Routes location={location} key={location.pathname}> 
        <Route
          path="/"
          element={<Main login={login} setLogin={setLogin} user={user} />}
        />

        {routes.map(({ path, element }) => (
          <Route 
            key={path}
            path={path}
            element={React.cloneElement(element, { login, setLogin, user })} 
          />
        ))}

      </Routes>
    </>
  );
}