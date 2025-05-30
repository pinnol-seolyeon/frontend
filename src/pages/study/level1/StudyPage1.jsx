import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import { fetchChapterContents} from "../../../api/study/level3API";
import { useNavigate } from "react-router-dom";
import React,{useState,useEffect} from 'react';
import {useParams} from "react-router-dom";
import MiniHeader from "../../../components/study/MiniHeader";
import {useChapter} from "../../../context/ChapterContext";

/*학습하기-3단계-1*/


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

    margin:top:129ox;
    gap:12px;
`



const Image=styled.img`
    width:100%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:300px;
    display:block;
    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    align-self:center;/*가로 중앙 정렬*/
    margin-top:120px;
    margin-bottom:0px;

`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height:20%;
    background-color:#FEF3E1;
    

    position:relative;

`;

const TextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  width: 80%;
  margin: 0 auto;
  padding: 40px; /* ✅ 오타 수정 및 공간 확보 */

  font-size: clamp(20px, 3vw, 32px); /* ✅ 최대값을 줄여서 더 안정된 크기 */
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

  padding: 10px 16px;
  background-color: #2774B2;
  color: white;
  border-radius: 30px;
  cursor: pointer;
  border:0.2px solid black;

  font-size:18px;

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
`;



function StudyPage(){

    const navigate=useNavigate();
    const {chapterId}=useParams();
    const [title,setTitle]=useState("");
    const [loading,setLoading]=useState(true);
    const [step,setStep]=useState(0); //0이면 인사, 1이면 제목 출력
    const {chapterData}=useChapter();

    useEffect(()=>{
        const loadChapterTitle=async()=>{
            try{
                if(chapterData?.chapterTitle){
                    setTitle(chapterData.chapterTitle);
                }
                
            }catch(err){
                setTitle("⚠️단원명 로딩실패")
            }finally{
                setLoading(false);
            }
        };

        loadChapterTitle();
    },[chapterId]);

    const handleNext=()=>{
        if (step===0){
            setStep(1);
        }else{
            alert("✅다음 단계로 넘어가볼까요? 다음 단계 버튼을 클릭해주세요!");
        }
    }
    
    return(
    <>
        <Wrapper>
            <Box>
            <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={<Button onClick={()=>navigate(`/study/2`)}>다음 단계로</Button>}
                >
                1/6 선생님과 학습하기
                </MiniHeader>
            <ImageWrapper>
                <Image src={tiger} alt="샘플" />
            </ImageWrapper>
                <SpeechBubble>
                    <TextBox>
                        {loading
                            ? "단원을 준비 중이에요..."
                            : step===0
                                ? "안녕! 나는 호랑이 선생님이야🐯"
                                : `이번 단원은 ${title} 이야. 이제 본격적으로 공부를 시작해보자 🐯`}
                    </TextBox>
                    <BubbleButton onClick={handleNext}>
                            {step===0?"다음":"시작하기"}
                    </BubbleButton>
                </SpeechBubble>
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;