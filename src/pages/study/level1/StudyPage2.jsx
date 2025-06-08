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

const Image=styled.img`
    display:flex;
    width:100%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:300px;
    display:block;
    margin:0 auto; /*가로 중앙 정렬*/
    padding:50px;

    position:absolute;
    left:20px;
    bottom:20px;
`;

const SpeechBubble=styled.div`

   display: inline-block;
   max-width: 80%;
   padding: 12px 92px 12px 16px;
   background-color: #FEF3E1;

    border-radius:0px 50px 50px 0px;
    border:0.2px solid black;
    // margin-bottom:20px;

    position:relative;
    box-sizing:border-box; /*패딩 포함*/
    word-break: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;

`;

const TextBox = styled.div`
  // display: block;
  // justify-content: center;
  // align-items: center;
  // text-align: center;
  display: block;             
  padding: 12px 16px;         /* 말풍선 패딩과 동일하게 */
  text-align: left;

  // width: 80%;
  // margin: 0 auto;
  // padding: 40px; /* ✅ 오타 수정 및 공간 확보 */

  font-size: clamp(20px, 2vw, 30px); /* ✅ 최대값을 줄여서 더 안정된 크기 */
  line-height: 1.6; /* ✅ 줄 간격을 여유 있게 */
  letter-spacing: 0.02em; /* ✅ 글자 간격 미세 조정 */
  font-weight: 400; /* ✅ 가독성 좋은 중간 두께 */
  font-family: "Noto Sans KR", sans-serif; /* ✅ 국문에 적합한 서체 */
  color: #333;
`;


const BubbleButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;

  padding: 20px 32px;
  background-color: #2774B2;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  border:0.2px solid black;

  font-size:18px;

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
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
        `먼저 이번 단원의 학습목표에 대해서 알아볼까? 이번 단원에서는 ${objective} 그럼 이제 본격적으로 공부를 시작해보자`,
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
                                먼저 이번 단원의 학습목표에 대해서 알아볼까? 이번 단원에서는 {" "}
                                <span style={{ fontWeight: "bold", color: "#2774B2" }}>
                                {objective}
                                </span>
                                그럼 이제 본격적으로 공부를 시작해보자 🐯
                            </p>
                            }
                    </TextBox>
                    <BubbleButton onClick={()=>navigate(`/study/level2-img`)}>좋아✅</BubbleButton>
                </SpeechBubble>
                )}
                <Image src={tigerPencil} alt="샘플" />           
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;