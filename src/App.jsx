import React from 'react';
import Login from '../src/pages/Login';
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
      {/* <GlobalStyles/> */}
      <Routes>
        {/* <Route path="/" element={<Mainpage login={login} setLogin={setLogin}/>}></Route> */}
        <Route
          path="/login"
          element={<Login login={login} setLogin={setLogin} />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
