import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tigerPencil from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import MiniHeader from "../../../components/study/MiniHeader";
import Sidebar from "../../../components/Sidebar";

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useChapter } from "../../../context/ChapterContext";
import TtsPlayer from "../../../components/TtsPlayer";
import background from "../../../assets/study_background.png";
import hoppin from "../../../assets/hopin.svg";

/*학습하기-1단계-2*/

// const Wrapper = styled.div`
//    width: 100%;
//   //  min-height: 100vh;           /* 최소 높이만 100vh */
//    display: flex;
//    flex-direction: column;
//    align-items: center;
//    justify-content: flex-start; /* 위쪽부터 쌓이게 */
//    padding: 2rem 1rem;          /* 상하 여유 추가 */
//   //  overflow-y: auto;            /* 내용이 길면 스크롤 */
   
//  `;

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


const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height: fit-content;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    justify-content: center; /* 수평 중앙 */
    align-items: center;     /* 수직 중앙 */
    flex-direction: column;
    gap: 1rem;
    position:relative;

`;

const TextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: pre-line;

  width: 80%;
  margin: 0 auto;
  padding: 0 clamp(4vw, 6vw, 90px); 

  font-size: 20px;
  font-weight: 500;
  color: #454545;
`;

const BubbleButton = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.6rem 5rem; 
  background-color: #478CEE;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  font-size:clamp(13px,1vw,20px);

  transition: background-color 0.3s;
  &:hover {
    background-color: #104EA7;
  }

  &:active {
    outline: none;
  }
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

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
`



const Image=styled.img`
    display:flex;
    width:100%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    width: 60%;
    display:block;
    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    align-self:center;/*가로 중앙 정렬*/
    // margin-bottom:0px;
`;

const SecondWrapper=styled.div`
    display:flex;
    flex-direction:row;
    position:relative;
    height:30%;

    display:flex;
    margin-top:0.5em;
    justify-content:center;
    align-items:center;
`;






function StudyPage({ user, login, setLogin }){

    const navigate=useNavigate();
    const[objective,setObjective]=useState("");
    const {chapterData}=useChapter();
    const [loading,setLoading]=useState(true);
    const [preloadDone, setPreloadDone] = useState(false);
    const [step, setStep] = useState(0);



    useEffect(() => {

        //chapterData를 사용하려면 직접 url 열면 안됨.. navigate로 url이동해야 (Context는 메모리에만 존재하기 때문에 초기화됨)
        console.log("📦 현재 저장된 chapterData:", chapterData);
        try{
            if (chapterData?.objective) {
                
                setObjective(chapterData.objective);
                console.log("✅ Chapter content:", chapterData.objective);

                // const splitSentences = contents
                // .split(/(?<=[.?!])\s+/)
                // .filter((s) => s.trim() !== "");

                // setSentences(splitSentences);
                // setCurrentIndex(0);
            } else {
                setObjective(["❌ 내용이 없습니다. 다시 돌아가주세요."]);
            }
        }catch(err){
            console.error("🚨",err);
            setObjective("데이터를 불러오지 못함⚠️");
        }finally{
            setLoading(false);
        }
    }, [chapterData]);
    

    const textToRead = useMemo(() => {
        if (loading) {
        return;
        }
        return [
        `먼저 이번 단원의 학습목표에 대해서 알아볼까? 이번 단원에서는 ${objective} 그럼 시작해볼까?`,
        ];
    }, [loading, objective]);


    return(
        <Wrapper>
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin} defaultCollapsed={true} />
                <MainWrapper>
                        {/* <MiniHeader
                            left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                            right={<Button onClick={()=>navigate(`/study/level2-img`)}>다음 단계로</Button>}
                        >
                        1/6 : 학습 목표
                        </MiniHeader> */}
                        <ImageWrapper>
                            <Image src={hoppin} alt="샘플" />
                        </ImageWrapper>
                        <TtsPlayer
                            sentences={textToRead}
                            answers={[]}
                            isAnsweringPhase={false}
                            currentIndex={0}
                            autoPlay={true}
                            style={{ display: "none" }}
                            onPreloadDone={() => setPreloadDone(true)}
                        />
                        { !preloadDone ? (
                            <TextBox>화면을 준비 중입니다...</TextBox>
                        ) : (
                        <SpeechBubble>
                            <TextBox>
                                {loading
                                    ? "학습 목표 준비중.."
                                    :<p>
                                        먼저 이번 단원의 학습목표에 대해서 알아볼까?<br/> 이번 단원에서는 {" "}
                                        <span style={{ fontWeight: "bold", color: "#2774B2" }}>
                                        {objective}
                                        </span><br/>
                                        그럼 시작해볼까? 🐯
                                    </p>
                                    }

                            </TextBox>
                             <ButtonWrapper>
                                 <BackButton onClick={() => navigate(-1)}>
                                     뒤로
                                 </BackButton>
                                  <BubbleButton onClick={() => navigate(`/study/level2-img`)}>
                                         다음
                                  </BubbleButton>
                             </ButtonWrapper>
                            
                            {/* <SecondWrapper>
                                <BubbleButton onClick={()=>navigate(`/study/level2-img`)}>좋아✅</BubbleButton>  
                            </SecondWrapper> */}
                            
                        </SpeechBubble>
                        )}
                </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    );
}

export default StudyPage;