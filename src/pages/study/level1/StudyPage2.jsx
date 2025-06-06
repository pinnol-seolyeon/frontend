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

const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

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
    display:flex;
    flex:1 1 400px;
    width:80%;
    height:70%;
    background-color:#FEF3E1;

    position:absolute;
    right:100px;
    top:120px;

    border: 0.5px solid black;
    border-radius: 24px;
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
        return ["학습 목표 준비중.."];
        }
        return [
        `먼저 이번 단원의 학습목표에 대해서 알아볼까? 이번 단원의 학습목표는 ${objective} 야. 그럼 이제 본격적으로 공부를 시작해보자`,
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
                <SpeechBubble>
                    
                    <TextBox>
                        {loading
                            ? "학습 목표 준비중.."
                            :<p>
                                먼저 이번 단원의 학습목표에 대해서 알아볼까? 이번 단원의 학습목표는{" "}
                                <span style={{ fontWeight: "bold", color: "#2774B2" }}>
                                {objective}
                                </span>
                                야. 그럼 이제 본격적으로 공부를 시작해보자 🐯
                            </p>
                            }
                    </TextBox>
                    <BubbleButton onClick={()=>navigate(`/study/level2-img`)}>좋아✅</BubbleButton>
                </SpeechBubble>
                <Image src={tigerPencil} alt="샘플" />
            
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;