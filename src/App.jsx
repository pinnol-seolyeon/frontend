import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import Header from './components/Header';
import axios from 'axios';
import { ChapterProvider } from './context/ChapterContext';



export default function App() {
  const [login, setLogin] = useState(false);
  const [user,setUser]=useState(null); //유저 정보 상태 추가

  useEffect(()=>{
    //앱이 시작할 때 자동으로 로그인 상태 체크
    axios.get('http://localhost:8080/api/user',{withCredentials:true})
    .then(response=>{
      console.log('✅로그인 상태입니다:',response.data);
      setLogin(true);
      setUser(response.data);
    }) 
    .catch(error=>{
      console.log('✖️로그인되어 있지 않습니다.');
      setLogin(false);
      setUser(null);
    });
},[]);

/// header는 항상 떠있고 Routes만 페이지마다 변하는 구조조
  return (
    <ChapterProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <Header login={login} setLogin={setLogin} user={user}/>  {/*모든 페이지 공통 Header*/}
        <AppRoutes login={login} setLogin={setLogin} user={user} /> {/*페이지 전환*/}
      </Router>
    </ChapterProvider>
  );
}