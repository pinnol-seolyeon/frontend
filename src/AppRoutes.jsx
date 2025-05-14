// AppRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import StudyPage1 from './pages/study/StudyPage1';
import StudyPage2 from './pages/study/StudyPage2';
import StudyLevel2 from './pages/study/StudyLevel2';
import StudyLevel3 from './pages/study/StudyLevel3';
import StudyLevel3_2 from './pages/study/StudyLevel3_2';
import StudyLevel6 from './pages/study/level6/StudyLevel6'; 
import StudyLv6_2 from './pages/study/level6/StudyLv6_2'; 
import Question from './pages/Question';
import Game from './pages/game/Game';
import ChildInfo from './pages/login/ChildInfo';
import KakaoCallback from './pages/login/KakaoCallback';

import {createGlobalStyle} from "styled-components";
import reset from "styled-reset";

const GlobalStyles=createGlobalStyle`
  ${reset}; 
  *{
    box-sizing:border-box;
  }
  
  body{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width:100%;  
  }
  #root{
    width:80%;

    //border:1px solid gray;
  }
  
  ::-webkit-scrollbar{
    display:none;
  }
`;

export default function AppRoutes({ login, setLogin }) {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <>
      {!isDashboard && <GlobalStyles />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login login={login} setLogin={setLogin} />} />
        <Route path="/childInfo" element={<ChildInfo login={login} setLogin={setLogin} />}/>


        <Route path="/study/1" element={<StudyPage1 login={login} setLogin={setLogin} />} />
        <Route path="/study/2" element={<StudyPage2 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/level2" element={<StudyLevel2 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/level3" element={<StudyLevel3 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/level3/2" element={<StudyLevel3_2 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/level6" element={<StudyLevel6 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/level6/2" element={<StudyLv6_2 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/question" element={<Question login={login} setLogin={setLogin}/>}></Route>
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}
