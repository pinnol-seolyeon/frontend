import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import testImage from "../../../assets/testImage.png";
import nextButton from "../../../assets/nextButton.png";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";
import Sidebar from "../../../components/Sidebar";

import { useNavigate } from "react-router-dom";
import React,{useState,useEffect} from "react";
import { useChapter } from "../../../context/ChapterContext";
import TtsPlayer from "../../../components/TtsPlayer";
import background from "../../../assets/study_background.png";
import hoppin from "../../../assets/hopin.svg";
import questionIcon from "../../../assets/question_icon.svg";

/*학습하기-6단계-요약*/

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
    gap: 2rem;
`;

const Image=styled.img`
    width:100%; 
    height:auto;
    object-fit:contain;
    width: clamp(100px,40vw,250px);
    align-self:center;
`;

const SummaryImage = styled.img`
  width: clamp(0px,40vw,250px);
  height: auto;
  object-fit: contain;
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

const QuestionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.5rem;
  background-color: #F0F4FC;
  color: #79B0FF;
  border: 1px solid #79B0FF;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s;
  margin: 1rem 0;
  align-self: flex-end;
  gap: 0.5rem;
  &:hover {
    background-color: #F5F5F5;
    border-color: #B8B8B8;
  }
  &:active {
    outline: none;
  }
`;

const QuestionIconImg = styled.img`
  width: 1rem;
  height: 1rem;
`;

const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: 100%;
  margin: 1rem 0rem;
`;


function StudyPage({ user, login, setLogin }){

    const navigate=useNavigate();
    
    const[image,setImage]=useState();
    const{chapterData}=useChapter();
    const[summary,setSummary]=useState();
    const [currentIndex,setCurrentIndex]=useState(0);
    const [sentences,setSentences]=useState([]);
    const [preloadDone, setPreloadDone] = useState(false);

    useEffect(()=>{
            console.log("📦 현재 저장된 chapterData:", chapterData);
            if(chapterData){

                //요약 네컷 만화 제공
                const img=chapterData?.summaryImgUrl;
                console.log("📷chapterData.summaryImgUrl",img);
                setImage(img);

                //요약 네컷 만화에 대한 설명(질답형식 X)
                const summary=chapterData?.summary;
                console.log("🎙️summary:",summary);
                setSummary(summary);

                const baseSentences = summary
                    .split(/(?<=[.?!])\s+/)
                    .filter((s) => s.trim() !== "");

                //긴 문장 분할 함수(질문 제외)
                const breakLongSentence = (sentence, max = 50) => {
                if (sentence.length <= max) return [sentence];

                const mid = Math.floor(sentence.length / 2);
                let splitIndex = sentence.lastIndexOf(" ", mid);
                if (splitIndex === -1) splitIndex = mid;
                const first = sentence.slice(0, splitIndex).trim();
                const second = sentence.slice(splitIndex).trim();
                return [first, second];
            };

            //문장분해
            const splitSentences=baseSentences
                .map((s)=>breakLongSentence(s))
                .flat();
            console.log("🐋분할된 최종 문장 배열:",splitSentences);

                setSentences(splitSentences);
                setCurrentIndex(0);
                setPreloadDone(false);
            }else{
                setSentences(["❌전달받은 내용이 없어요"]);
                setPreloadDone(false);
            }
        },[chapterData]);


    //다음 버튼
    const handleAnswer=()=>{
      if(currentIndex<sentences.length-1){
        setCurrentIndex(currentIndex+1);
      }else{
        // 마지막 문장에서 "잘 이해했어!" 버튼을 누르면 바로 다음 단계로
        handleComplete();
      }
    };

    const handleComplete=()=>{
      alert("✅ 좋아요! 이제 마지막 단계로 넘어가볼까요?");
      navigate(`/study/level6/2`);
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
                            <SummaryImage src={image} alt="요약 이미지" />
                        </ImageWrapper>
                        <QuestionButton onClick={() => navigate('/question', {
                            state: { from: '/study/level6/summary' }
                        })}>
                            <QuestionIconImg src={questionIcon} alt="질문 아이콘" />
                            질문하기
                        </QuestionButton>
                        <TtsPlayer
                            sentences={sentences}
                            answers={[]}
                            isAnsweringPhase={false}
                            currentIndex={currentIndex}
                            autoPlay={true}
                            style={{ display: "none" }}
                            onPreloadDone={() => setPreloadDone(true)}
                        />
                        {!preloadDone ? (
                            <SpeechBubble>
                                <TextBox>화면을 준비 중입니다...</TextBox>
                            </SpeechBubble>
                        ) : (
                            <SpeechBubble>
                                <TextBox>
                                    {sentences.length > 0 ? sentences[currentIndex] : "설명이 없습니다."}
                                </TextBox>
                                <ButtonWrapper>
                                    {currentIndex > 0 && (
                                        <BackButton onClick={() => setCurrentIndex(currentIndex - 1)}>
                                            이전
                                        </BackButton>
                                    )}
                                    <BubbleButton onClick={handleAnswer}>
                                        {currentIndex < sentences.length - 1 ? "다음" : "잘 이해했어!"}
                                    </BubbleButton>
                                </ButtonWrapper>
                            </SpeechBubble>
                        )}
                    </ImageWithSpeechWrapper>
                </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    </>
    );
}

export default StudyPage;