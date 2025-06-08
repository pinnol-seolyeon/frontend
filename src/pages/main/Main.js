import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import '../main/Main.css';
function Main({user}) {
  const navigate = useNavigate();
  // const { userProgress } = useOutletContext();

  //로그인 안 된 경우 강제 리디렉션 
  useEffect(()=>{
    if(!user){
      // alert("🐯로그인 후에 핀놀 서비스를 사용할 수 있어요!");
      navigate("/login");
    }
  },[user,navigate]);
  

  const learningModules = [
    {
      title: "AI 학습하기",
      description: "AI 선생님과 함께 오늘의 학습을 시작해보세요",
      path: "/book", //클릭했을 때 이동할 경로로
      icon: "📚",
      disabled: false,
    },
    {
      title: "학습 분석",
      description: "나의 학습 상태를 분석하고 피드백을 받아보세요",
      path: "/dashboard",
      icon: "📊",
      disabled: false,
    },
    {
      title: "복습하기",
      description: "이전 학습 내용을 복습하고 퀴즈를 풀어보세요",
      path: "/review",
      icon: "🔄",
      disabled:true,
    },
    {
      title: "학습 현황",
      description: "전체 학습 진도와 획득 포인트를 확인하세요",
      path: "/main/progress",
      icon: "🎯",
      disabled: true,
    }
  ];

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2>
          안녕 {user?.childName}~<br/>
          오늘도 즐거운 금융 공부해볼까?
        </h2>
        {/* <div className="user-progress"> */}
          {/* <div className="progress-item"> */}
            {/* <span>진행률</span> */}
            {/* <strong>{userProgress?.progressRate || 0}%</strong> */}
          {/* </div> */}
          {/* <div className="progress-item"> */}
            {/* <span>포인트</span> */}
            {/* <strong>{userProgress?.points || 0}</strong> */}
          {/* </div> */}
          {/* {userProgress?.lastCompleted && (
            <div className="progress-item">
              <span>마지막 학습</span>
              <strong>{new Date(userProgress.lastCompleted).toLocaleDateString()}</strong>
            </div>
          )} */}
        {/* </div> */}
      </div>

      <div className="learning-modules">
        {/*learningModules 배열을 하나씩 돌면서 화면에 컴포넌트를 만듦*/}
        {learningModules.map((module, index) => (
          <div 
            key={index} 
            className={`module-card ${module.disabled ? 'disabled':''}`}
            onClick={() => {
              if(module.disabled){
                alert("🪧해당 기능은 곧 업데이트 될 예정입니다!");
                return;
              }
              
              navigate(module.path);
            }}
          >
            <div className="module-icon">{module.icon}</div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
