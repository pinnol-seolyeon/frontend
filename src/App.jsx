import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import Header from './components/Header';
import axios from 'axios';
import { ChapterProvider } from './context/ChapterContext';



export default function App() {
  const [login, setLogin] = useState(false);
  const [user,setUser]=useState(null); //유저 정보 상태 추가
  const navigate=useNavigate();

  useEffect(()=>{
    console.log("")
    //앱이 시작할 때 자동으로 로그인 상태 체크
    axios.get('https://finnol.site/api/user',{withCredentials:true})
    .then(response=>{

      const isFirstLogin=response.data.firstLogin;
      setLogin(true);
      setUser(response.data);


      if(isFirstLogin){
        navigate("/childInfo");
      }else{
        navigate("/main");
      }
    })
    .catch(()=>{
      console.log('✖️로그인되어 있지 않습니다.');
      setLogin(false);
      setUser(null);
      navigate("/login");
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