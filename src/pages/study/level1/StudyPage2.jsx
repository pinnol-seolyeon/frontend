import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tigerPencil from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import MiniHeader from "../../../components/study/MiniHeader";

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useChapter } from "../../../context/ChapterContext";
import TtsPlayer from "../../../components/TtsPlayer";

/*학습하기-1단계-2*/

const Wrapper = styled.div`
   width: 100%;
  //  min-height: 100vh;           /* 최소 높이만 100vh */
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: flex-start; /* 위쪽부터 쌓이게 */
   padding: 2rem 1rem;          /* 상하 여유 추가 */
  //  overflow-y: auto;            /* 내용이 길면 스크롤 */
   
 `;


const SpeechBubble=styled.div`
    display:flex;
    width:80%;
    flex-direction:column;
    min-height:60%;
    max-height:70%;
    background-color:#FEF3E1;
    // padding:2rem;
    margin:2rem auto; //상하 좌우

    border: 0.5px solid black;
    border-radius: 24px;
`;

const TextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;


  width: 80%;
  margin: auto;
  padding: 20px; /* ✅ 오타 수정 및 공간 확보 */
  

  font-size: clamp(20px, 3vw, 32px); /* ✅ 최대값을 줄여서 더 안정된 크기 */
  line-height: 1.6; /* ✅ 줄 간격을 여유 있게 */
  letter-spacing: 0.03em; /* ✅ 글자 간격 미세 조정 */
  font-weight: 500; /* ✅ 가독성 좋은 중간 두께 */
  font-family: "Noto Sans KR", sans-serif; /* ✅ 국문에 적합한 서체 */
  color: #333;
`;


const BubbleButton = styled.button`
position:absolute;
transform: translateX(-50%); // 👉 가로 정중앙에 고정
left:50%;

 width:10%; 
 min-width:90px;
 height:10%;
 min-height:60px;
 max-height:80px;
//  margin: auto;




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

const Image=styled.img`

    position:absolute;
    top:0; // 이미지의 top을 SecondWrapper에 맞춤 //아래쪽으로만 커지도록
    left:-10%;



    display:flex;
    
    // width:100%; 
    // max-width:300px;
    // min-width:200px;
    // height:auto;
    height:200%;
    width:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    display:block;

    // margin:-2em;
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






function StudyPage(props){

    const navigate=useNavigate();
    const[objective,setObjective]=useState("");
    const {chapterData}=useChapter();
    const [loading,setLoading]=useState(true);
    const [preloadDone, setPreloadDone] = useState(false)



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
    <>
        <Wrapper>
            <Box>
                <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={<Button onClick={()=>navigate(`/study/level2-img`)}>다음 단계로</Button>}
                >
                1/6 : 학습 목표
                </MiniHeader>

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
                    
                    <SecondWrapper>
                        <Image src={tigerPencil} alt="샘플" />
                        <BubbleButton onClick={()=>navigate(`/study/level2-img`)}>좋아✅</BubbleButton>  
                    </SecondWrapper>
                    
                </SpeechBubble>
                )}
      
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;