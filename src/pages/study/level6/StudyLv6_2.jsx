import styled,{keyframes} from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tigerPencil from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import MiniHeader from "../../../components/study/MiniHeader";
import Sidebar from "../../../components/Sidebar";

import { useNavigate } from "react-router-dom";
import React,{useState,useEffect} from "react";
import { useChapter } from "../../../context/ChapterContext";
import background from "../../../assets/study_background.png";
import hoppin from "../../../assets/hopin.svg";

/*학습하기-6단계-2*/

const Wrapper=styled.div`
    width:100%;
    min-height:100vh;
    height:auto;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin-left: 0;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
`;

const Image=styled.img`
    width:80%; 
    height:auto;
    object-fit:contain;
    width: clamp(200px,50vw,350px);
    align-self:center;
`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height: fit-content;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    position:relative;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  width: 100%;
  margin: 0 auto;
`;


const BackButton = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.6rem 5rem; 
  background-color: white;
  color: #9E9E9E;
  border: 1px solid #B8B8B8;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  font-size:clamp(13px,1vw,20px);

  transition: all 0.3s;
  &:hover {
    background-color: #F5F5F5;
    border-color: #B8B8B8;
  }

  &:active {
    outline: none;
  }
`;

const ButtonWrapper=styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width:100%;
    gap: 2rem;
`;


const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: 100%;
  margin: 1rem 0rem;
`;

const NextButton = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.8rem 3rem;
  background-color: #478CEE;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  font-size: 18px;
  font-weight: 500;
  margin-top: 1rem;

  transition: background-color 0.3s;
  &:hover {
    background-color: #104EA7;
  }

  &:active {
    outline: none;
  }
`;


// 애니메이션 정의
const fadeSlide = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -30%);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -10%);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -10%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -30%);
  }
`;

export const Popup = styled.div`
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -10%);
  background: linear-gradient(to right, #ffffff, #e0f7fa);
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  color: #2e7d32;
  font-weight: bold;
  font-size: 20px;
  z-index: 9999;

  display: flex;
  align-items: center;
  gap: 12px;

  animation: ${fadeSlide} 3s ease-in-out forwards;

  &::before {
    content: "🎉";
    font-size: 28px;
    animation: bounce 1.5s infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
`;


function StudyLevel6_2({ user, login, setLogin }){

    const navigate=useNavigate();
    const {chapterData,clearChapterData}=useChapter();
    const [topic,setTopic]=useState();
    const [loading,setLoading]=useState(true);

      // ✅ useEffect 단순화
      useEffect(() => {
        if (chapterData?.topic) {
          setTopic(chapterData.topic);
          setLoading(false);
        } else {
          // setTopic("❌ 전달받은 내용이 없어요");
          setLoading(false);
        }
      }, [chapterData]);


    const handleComplete=async()=>{
         try {
            console.log("📦 현재 저장된 chapterData:", chapterData);

            // ✅ 여기에 실제 완료 처리 API 호출
            const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/finish?chapterId=${chapterData?.chapterId}`, {
                method: 'POST',
                credentials:'include', //쿠키 인증 시 필요
         });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
          }

        const message=await response.text();
        console.log("✅학습완료 메시지:",message);

         clearChapterData(); //localstorage + 상태 모두 초기화
         navigate('/study/level6/complete'); // 완료 페이지로 이동
         
        } catch(e){
            console.error('학습 완료 처리 중 오류',e);
        }
      };
    
    return(
    <>
        <Wrapper>
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin} defaultCollapsed={true} />
                <MainWrapper>
                    <ImageWithSpeechWrapper>
                        <ImageWrapper>
                            <Image src={hoppin} alt="호핀" />
                        </ImageWrapper>
                        
                        <SpeechBubble>
                            <TextBox>
                                <div style={{ 
                                    fontSize: '28px', 
                                    fontWeight: 'bold', 
                                    marginBottom: '1rem', 
                                    color: '#333',
                                    textAlign: 'center'
                                }}>
                                    오늘의 토론 주제
                                </div>
                                {loading ? (
                                    <div style={{ fontSize: '18px', color: '#666' }}>
                                        토론 주제 생성 중...
                                    </div>
                                ) : (
                                    <div style={{ 
                                        fontSize: '20px', 
                                        fontWeight: "400", 
                                        color: "#333",
                                        lineHeight: '1.3',
                                        textAlign: 'center',
                                        wordBreak: 'keep-all',
                                        whiteSpace: 'pre-line'
                                    }}>
                                        {topic}
                                    </div>
                                )}
                            </TextBox>

                            <NextButton onClick={handleComplete}>
                                다음단계로
                            </NextButton>
                        </SpeechBubble>
                    </ImageWithSpeechWrapper>
                </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    </>
    );
}


export default StudyLevel6_2;