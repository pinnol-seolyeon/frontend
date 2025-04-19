import React from 'react';
import Login from '../src/pages/Login';
import StudyPage1 from './pages/study/StudyPage1';
import StudyPage2 from './pages/study/StudyPage2';
import StudyLevel2 from './pages/study/StudyLevel2';
import StudyLevel3 from './pages/study/StudyLevel3';
import StudyLevel3_2 from './pages/study/StudyLevel3_2';
import Question from './pages/Question';
import {createGlobalStyle} from "styled-components";
import {useState} from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import reset from "styled-reset"; //브라우저 기본 스타일 초기화하는 CSS코드 
import './App.css';


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


function App() {
  const[login,setLogin]=useState(false);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <GlobalStyles/>
      <Routes>
        {/* <Route path="/" element={<Mainpage login={login} setLogin={setLogin}/>}></Route> */}
        <Route
          path="/login"
          element={<Login login={login} setLogin={setLogin} />}
        ></Route>
        <Route path="/study/1" element={<StudyPage1 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/2" element={<StudyPage2 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/level2" element={<StudyLevel2 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/level3" element={<StudyLevel3 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/study/level3/2" element={<StudyLevel3_2 login={login} setLogin={setLogin}/>}></Route>
        <Route path="/question" element={<Question login={login} setLogin={setLogin}/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
