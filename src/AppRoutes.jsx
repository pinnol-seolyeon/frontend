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
import Main from './pages/main/Main';
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
  body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  #root {
    width: 80%;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;

//  Route 정보 배열로 정리
const routes = [
  { path: '/', element: <Dashboard /> },
  { path: '/login', element: <Login /> },
  {path:'/callback',element:<Callback/>},
  { path: '/childInfo', element: <ChildInfo /> },
  { path: '/main',element:<Main/>},
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
  const isDashboard = location.pathname === '/';

  return (
    <>
      {!isDashboard && <GlobalStyles />}
      <Routes>

        {routes.map(({ path, element }) => (
          <Route 
            key={path}
            path={path}
            element={React.cloneElement(element, { login, setLogin, user })} //원래의 컴포넌트에 login,setLogin,user props를 주입 -> 코드 반복 제거.
          />
        ))}

      </Routes>
    </>
  );
}
