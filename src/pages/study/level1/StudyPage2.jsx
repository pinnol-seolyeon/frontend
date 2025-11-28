import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tigerPencil from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import MiniHeader from "../../../components/study/MiniHeader";
import { fetchChapterContents } from "../../../api/study/level3API";
import { useActivityTracker } from "../../../hooks/useActivityTracker";

import { useNavigate, useSearchParams } from "react-router-dom";
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
    const [searchParams] = useSearchParams();
    const[objective,setObjective]=useState("");
    const {chapterData, setChapterData}=useChapter();
    const [loading,setLoading]=useState(true);
    const [preloadDone, setPreloadDone] = useState(false);
    const [step, setStep] = useState(0);
    const [isTtsCompleted, setIsTtsCompleted] = useState(false); // TTS 재생 완료 상태

    // 활동 감지 Hook 사용 (level 2)
    // FIXME: 백엔드 start-level API 401 에러로 임시 스킵
    const { completeSession } = useActivityTracker(
        chapterData?.chapterId, 
        2, // level 2
        user?.userId,
        chapterData?.bookId,
        0, // minusFocusingScore
        true // skipStartLevel: 백엔드 이슈로 임시 스킵
    );

    // Level 2 데이터 가져오기 (학습 목표)
    useEffect(() => {
        const loadObjective = async () => {
            const chapterId = searchParams.get('chapterId') || chapterData?.chapterId;
            
            if (!chapterId) {
                console.error("❌ chapterId가 없습니다.");
                setObjective("❌ 단원 정보가 없습니다.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("🔄 Level 2 학습 목표 로딩 중... chapterId:", chapterId, "bookId:", chapterData?.bookId);
                const level2Data = await fetchChapterContents(2, chapterId, chapterData?.bookId);
                console.log("✅ Level 2 데이터:", level2Data);
                
                // Context 업데이트 (bookId 보존)
                setChapterData({
                    ...level2Data,
                    bookId: chapterData?.bookId
                });
                
                if (level2Data?.objective) {
                    setObjective(level2Data.objective);
                    console.log("✅ 학습 목표:", level2Data.objective);
                } else {
                    setObjective("학습 목표를 불러올 수 없습니다.");
                }
            } catch (err) {
                console.error("❌ Level 2 데이터 로딩 실패:", err);
                setObjective("❌ 학습 목표를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadObjective();
    }, [searchParams]);
    

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
                <MainWrapper>
                        {/* <MiniHeader
                            left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                            right={<Button onClick={async () => {
                                await completeSession(); // COMPLETED 상태 전송
                                navigate(`/study/level2-img?chapterId=${chapterData?.chapterId}`);
                            }}>다음 단계로</Button>}
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
                            onTtsEnd={() => setIsTtsCompleted(true)}  // TTS 재생 완료 시 호출
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
                             {/* TTS 재생 완료 시에만 버튼 표시 */}
                             {isTtsCompleted && (
                             <ButtonWrapper>
                                  <BubbleButton onClick={() => {
                                      navigate(`/study/level2-img?chapterId=${chapterData?.chapterId}`);
                                  }}>
                                         다음
                                  </BubbleButton>
                             </ButtonWrapper>
                             )}
                            
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