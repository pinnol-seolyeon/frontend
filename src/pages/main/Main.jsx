import React from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Card from "../../components/Card";
import pencil from "../../assets/pencil_icon.png";
import analysis from "../../assets/analysis_icon.png";
import lesson from "../../assets/lesson_icon.png";
import goal from "../../assets/goal_icon.png";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: #F0F4FC;
`;

const MainWrapper = styled.div` 
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(var(--header-height, 70px) + 20px) 20px 20px 20px;
`;

const TitleText = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #333333;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-top: 1rem;
    margin-bottom: 0.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.2rem;
  }
`;

const SubTitleText = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  color: #333333;
  text-align: center;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CardWrapper = styled.div` 
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 2.5rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-top: 2.5rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
`;

const Main = ({user, login, setLogin}) => {
  console.log('REDIRECT_URI:', process.env.REACT_APP_KAKAO_REDIRECT_URI);
  console.log('현재 NODE_ENV:', process.env.NODE_ENV);


  const navigate = useNavigate();
  return (
    <Wrapper>
      <Header user={user} login={login} setLogin={setLogin} />
      <MainWrapper>
        <TitleText>
          {user?.childName ? user.childName.slice(1) : "친구"}, 오늘도 함께 배워볼까? 👋
        </TitleText>
        <SubTitleText>재미있는 금융 모험이 기다리고 있어!</SubTitleText>
        <CardsContainer>
          <CardWrapper>
            <Card
                icon={lesson}
                title="AI 학습하기"
                description={`AI 선생님과 함께
                  오늘의 학습을 시작해보자!`}
                backgroundColor = "linear-gradient(180deg, #EFF6FF, #AED2FF)"
                iconBackgroundColor="#BFDBFF"
                onButtonClick={() => {
                  console.log('클릭!');
                  navigate('/book');
                }}          />
            <Card
              icon={analysis}
              title="학습 분석"
              description={`나의 학습 상태를 분석하고
                  피드백을 받아보자!`}
              backgroundColor = "linear-gradient(180deg, #EFFDF4, #A4FFC4)"
              iconBackgroundColor="#B9F8CF"
              onButtonClick={() => {
                console.log('클릭!');
                navigate('/dashboard');
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <Card
              icon={pencil}
              title="복습하기"
              description={`이전 학습 내용을 복습하고
                  퀴즈를 받아보자!`}
              backgroundColor = "linear-gradient(180deg, #FFF7ED, #FFDD93)"
              iconBackgroundColor="#FFDD8F"
              onButtonClick={() => console.log('클릭!')}
            />
            <Card
              icon={goal}
              title="학습 현황"
              description={`전체 학습 진도와
                획득 포인트를 확인해보자!`}
              backgroundColor = "linear-gradient(180deg, #FAF5FF, #E3C9FF)"
              iconBackgroundColor="#EAD4FF"
              onButtonClick={() => console.log('클릭!')}
            />
          </CardWrapper>
        </CardsContainer>
      </MainWrapper>
    </Wrapper>
  );
};

export default Main;


// import React,{useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useOutletContext } from 'react-router-dom';
// import '../main/Main.css';
// function Main({user}) {
//   const navigate = useNavigate();
//   // const { userProgress } = useOutletContext();

//   //로그인 안 된 경우 강제 리디렉션 
//   // useEffect(()=>{
//   //   if(!user){
//   //     // alert("🐯로그인 후에 핀놀 서비스를 사용할 수 있어요!");
//   //     navigate("/login");
//   //   }
//   // },[user,navigate]);
  

//   const learningModules = [
//     {
//       title: "AI 학습하기",
//       description: "AI 선생님과 함께 오늘의 학습을 시작해보세요",
//       path: "/book", //클릭했을 때 이동할 경로로
//       icon: "📚",
//       disabled: false,
//     },
//     {
//       title: "학습 분석",
//       description: "나의 학습 상태를 분석하고 피드백을 받아보세요",
//       path: "/dashboard",
//       icon: "📊",
//       disabled: false,
//     },
//     {
//       title: "복습하기",
//       description: "이전 학습 내용을 복습하고 퀴즈를 풀어보세요",
//       path: "/review",
//       icon: "🔄",
//       disabled:true,
//     },
//     {
//       title: "학습 현황",
//       description: "전체 학습 진도와 획득 포인트를 확인하세요",
//       path: "/main/progress",
//       icon: "🎯",
//       disabled: true,
//     }
//   ];

//   return (
    
//     <div className="dashboard">
//       <div className="welcome-section">
//         <h2>
//           안녕 {user?.childName}~<br/>
//           오늘도 즐거운 금융 공부해볼까?
//         </h2>
//         {/* <div className="user-progress"> */}
//           {/* <div className="progress-item"> */}
//             {/* <span>진행률</span> */}
//             {/* <strong>{userProgress?.progressRate || 0}%</strong> */}
//           {/* </div> */}
//           {/* <div className="progress-item"> */}
//             {/* <span>포인트</span> */}
//             {/* <strong>{userProgress?.points || 0}</strong> */}
//           {/* </div> */}
//           {/* {userProgress?.lastCompleted && (
//             <div className="progress-item">
//               <span>마지막 학습</span>
//               <strong>{new Date(userProgress.lastCompleted).toLocaleDateString()}</strong>
//             </div>
//           )} */}
//         {/* </div> */}
//       </div>

//       <div className="learning-modules">
//         {/*learningModules 배열을 하나씩 돌면서 화면에 컴포넌트를 만듦*/}
//         {learningModules.map((module, index) => (
//           <div 
//             key={index} 
//             className={`module-card ${module.disabled ? 'disabled':''}`}
//             onClick={() => {
//               if(module.disabled){
//                 alert("🪧해당 기능은 곧 업데이트 될 예정입니다!");
//                 return;
//               }
              
//               navigate(module.path);
//             }}
//           >
//             <div className="module-icon">{module.icon}</div>
//             <h3>{module.title}</h3>
//             <p>{module.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Main;
