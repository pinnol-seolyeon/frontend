import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import { fetchChapterContents} from "../../../api/study/level3API";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import {useParams} from "react-router-dom";
import MiniHeader from "../../../components/study/MiniHeader";
import {useChapter} from "../../../context/ChapterContext";
import TtsPlayer from "../../../components/TtsPlayer";
import background from "../../../assets/study_background.png";
import Sidebar from "../../../components/Sidebar";
import hoppin from "../../../assets/hopin.svg";

/*학습하기-1단계-1*/


const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const MainWrapper = styled.div` 
  flex: 1;
  min-height: calc(100vh - var(--header-height, 70px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
`



const Image=styled.img`
    display:flex;
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    width: 60%;
    display:block;
    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    align-self:center;/*가로 중앙 정렬*/
    // margin-bottom:0px;
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

function StudyPage({ user, login, setLogin }){

    const navigate=useNavigate();
    const {chapterId}=useParams();
    const [titleText,setTitleText]=useState("");
    const [title,setTitle]=useState("");
    const [onlyText,setOnlyText]=useState("");
    const [loading,setLoading]=useState(true);
    const [step,setStep]=useState(0); //0이면 인사, 1이면 제목 출력
    const {chapterData}=useChapter();
    const [isFinished,setIsFinished]=useState(false);

    const fullTitle="";
    const [preloadDone, setPreloadDone] = useState(false)

    // useEffect(()=>{
    //     const loadChapterTitle=async()=>{
    //         try{
    //             if(chapterData?.chapterTitle){
    //                 const fullTitle=chapterData.chapterTitle;
    //                 setTitle(fullTitle);
    //             }

    //             //텍스트만 추출
    //             const match = fullTitle.match(/^\d+\.(.+)$/);
    //             const onlyText=match?match[1]:"";
    //             setTitleText(onlyText);
                
    //         }catch(err){
    //             setTitle("⚠️단원명 로딩실패")
    //             setTitleText("");
    //         }finally{
    //             setLoading(false);
    //             setPreloadDone(false);
    //         }
    //     };

    //     loadChapterTitle();
    // },[chapterId,chapterData]);
    useEffect(() => {
    const loadChapterTitle = async () => {
        try {
        // 1) fullTitle을 밖에서 선언
        const fullTitle = chapterData?.chapterTitle || "";

        // 2) 제목 원문 저장
        setTitle(fullTitle);

        // 3) 숫자·점 제거 후 순수 텍스트만 추출
        const match = fullTitle.match(/^\d+\.(.+)$/);
        const onlyText=match?match[1]:"";
        setTitleText(onlyText);
        } catch (err) {
        setTitle("⚠️단원명 로딩실패");
        setTitleText("");
        } finally {
        setLoading(false);
        setPreloadDone(false);
        }
    };
        loadChapterTitle();
    
    }, [chapterData]);


    const handleNext=()=>{
        if (step===0){
            setStep(1);
            setPreloadDone(false);
        }else{
            navigate(`/study/2`);
            setIsFinished(true);
        }
    }

    const handleBack=()=>{
        if (step===1){
            setStep(0);
            setPreloadDone(false);
        }else{
            // step이 0이면 이전 페이지로 이동
            navigate(-1);
        }
    }

    const textToRead = useMemo(() => {
        if (loading) {
        return;
        }
        return step === 0
        ? ["안녕! 나는 호랑이 선생님이야"]
        : [`이번 단원을 소개할게.\n이번 단원은 ${titleText}`];
    }, [loading, step, titleText]);

      
    
    return(
    <>
        <Wrapper>
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin} defaultCollapsed={true} />
                <MainWrapper>
                    {/* <MiniHeader
                            left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                            right={
                            isFinished?(
                                <Button onClick={()=>navigate(`/study/2`)}>다음 단계로</Button>
                            ):<Button disabled>진행 중...</Button>
                            }
                        >
                        1/6 선생님과 학습하기
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
                                    ? "단원을 준비 중이에요..."
                                    : step===0
                                        ? "안녕! 나는 호랑이 선생님이야"
                                        : `이번 단원을 소개할게.\n이번 단원은 ${titleText}이야`}
                            </TextBox>
                              <ButtonWrapper>
                                 {step > 0 && (
                                    <BackButton onClick={handleBack}>
                                        뒤로
                                    </BackButton>
                                 )}
                                 <BubbleButton onClick={handleNext}>
                                          {step===0?"다음":"시작하기"}
                                 </BubbleButton>
                              </ButtonWrapper>

                        </SpeechBubble>
                    )}
                </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    </>
    );
}

export default StudyPage;