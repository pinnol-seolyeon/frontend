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

/*학습하기-1단계-1*/


const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

`;

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;

    margin-top:6%;
    // gap:12px;
`



const Image=styled.img`
    display:flex;
    width:100%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    width: clamp(100px,40vw,250px); //최소 150px, 최대 250px, 화면 너비 40%까지 가능
    display:block;
    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    align-self:center;/*가로 중앙 정렬*/
    margin-top:8vh;
    // margin-bottom:0px;

    

`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height:20%;
    background-color:#FEF3E1;
    justify-content: center; /* 수평 중앙 */
    align-items: center;     /* 수직 중앙 */
    

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
  padding: 40px clamp(4vw, 6vw, 90px) 40px clamp(4vw, 6vw, 90px); 
  /* ⬆️ 좌우 여백은 반응형으로, 하단은 버튼 공간 확보 */

  font-size: clamp(20px, 2vw, 28px); /* ✅ 최대값을 줄여서 더 안정된 크기 */
  line-height: 1.6; /* ✅ 줄 간격을 여유 있게 */
  letter-spacing: 0.03em; /* ✅ 글자 간격 미세 조정 */
  font-weight: 500; /* ✅ 가독성 좋은 중간 두께 */
  font-family: "Noto Sans KR", sans-serif; /* ✅ 국문에 적합한 서체 */
  color: #333;
`;

const BubbleButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;

  max-width:20%;

  display:flex;
  align-items: center;
  text-align: center;
//   flex-basis:auto;

  padding: 1% 3%; 

  background-color: #2774B2;
  color: white;
  border-radius: 30px;
  cursor: pointer;
  border:0.2px solid black;

  font-size:clamp(13px,1vw,20px);
//   white-space:nowrap; //줄바꿈방지

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
`;







function StudyPage(){

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
            alert("✅다음 단계로 넘어가볼까요? 다음 단계 버튼을 클릭해주세요!");
            setIsFinished(true);
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
            <Box>
            <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={
                    isFinished?(
                        <Button onClick={()=>navigate(`/study/2`)}>다음 단계로</Button>
                    ):<Button disabled>진행 중...</Button>
                    }
                >
                1/6 선생님과 학습하기
                </MiniHeader>
            <ImageWrapper>
                <Image src={tiger} alt="샘플" />
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
                    <BubbleButton onClick={handleNext}>
                            {step===0?"다음":"시작하기"}
                    </BubbleButton>
                </SpeechBubble>
            )}
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;