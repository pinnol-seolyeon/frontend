import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import testImage from "../../../assets/testImage.png";
import nextButton from "../../../assets/nextButton.png";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";
import { fetchChapterContents } from "../../../api/study/level3API";
import { useActivityTracker } from "../../../hooks/useActivityTracker";

import { useNavigate, useSearchParams } from "react-router-dom";
import React,{useState,useEffect} from "react";
import { useChapter } from "../../../context/ChapterContext";
import TtsPlayer from "../../../components/TtsPlayer";
import background from "../../../assets/study_background.png";
import hoppin from "../../../assets/hoppin_normal.svg";
import questionIcon from "../../../assets/question_icon.svg";

/*학습하기-6단계-요약*/

const LEVEL_5_INTRO = "오늘 무엇을 배웠는지 기억나? 😊 지금부터 오늘 배운 내용에서 꼭 기억해야 할 핵심 포인트를 하나씩 살펴볼게!";
const LEVEL_5_OUTRO = "오늘 배운 내용, 이제 잘 정리됐어? 😊 중요한 내용은 꼭 기억해 둬. 그리고 오늘 배운 것을 우리 생활에서는 어떻게 활용할 수 있을지 생각해 보는 것도 좋아!";

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

const MainWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
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

const BottomImageWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    width: 100%;
    position: relative;
`;

const ImageContainer = styled.div`
    position: relative;
    display: flex;
    align-items: flex-end;
`;

const Image = styled.img`
    width: clamp(100px, 30vw, 200px);
    height: auto;
    object-fit: contain;
`;

const SummaryImage = styled.img`
  width: clamp(250px, 35vw, 400px);
  max-height: 380px; // 호핀과 비슷한 높이로 맞춤
  height: auto;
  object-fit: contain;
`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height: fit-content;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.8);
    max-width: 1200px; // ContentContainer와 동일한 max-width

    border-radius: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    position:relative;
    margin-top: 0;
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
  align-self: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0; // 호핀과 말풍선 사이 간격 제거
`;

const HoppinImage = styled.img`
  width: clamp(200px, 25vw, 350px);
  height: auto;
  object-fit: contain;
`;


const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  width: 100%;
`;



function StudyPage({ user, login, setLogin }){

    const navigate=useNavigate();
    const [searchParams] = useSearchParams();
    
    const[image,setImage]=useState();
    const{chapterData, setChapterData}=useChapter();
    const[summary,setSummary]=useState();
    const [currentIndex,setCurrentIndex]=useState(0);
    const [sentences,setSentences]=useState([]);
    const [preloadDone, setPreloadDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isTtsCompleted, setIsTtsCompleted] = useState(false); // TTS 재생 완료 상태

    // 활동 감지 Hook 사용 (level 5)
    const { completeSession } = useActivityTracker(
        chapterData?.chapterId, 
        5, // level 5
        user?.userId,
        chapterData?.bookId
    );

    // Level 5 데이터 가져오기 (요약)
    useEffect(() => {
        const loadLevel5Data = async () => {
            const chapterId = searchParams.get('chapterId') || chapterData?.chapterId;
            
            if (!chapterId) {
                console.error("❌ chapterId가 없습니다.");
                setSentences(["❌ 단원 정보가 없습니다. 다시 돌아가주세요."]);
                return;
            }

            try {
                setLoading(true);
                console.log("🔄 Level 5 (요약) 데이터 로딩 중... chapterId:", chapterId, "bookId:", chapterData?.bookId);
                const level5Data = await fetchChapterContents(5, chapterId, chapterData?.bookId);
                console.log("✅ Level 5 데이터:", level5Data);
                
                // Context 업데이트 (bookId 보존)
                setChapterData({
                    ...level5Data,
                    bookId: chapterData?.bookId
                });

                //요약 네컷 만화 제공
                const img = level5Data?.summaryImgUrl;
                console.log("📷 summaryImgUrl:", img);
                setImage(img || undefined);

                //요약 네컷 만화에 대한 설명(질답형식 X)
                const summaryText = level5Data?.summary;
                console.log("🎙️ summary:", summaryText);
                setSummary(summaryText);

                if (summaryText) {
                    //문장 분리 (\n 기준으로 먼저 분리, 그 다음 .?! 기준으로 분리)
                    const baseSentences = summaryText
                        .split(/\n/)  // \n 기준으로 먼저 분리
                        .flatMap(paragraph => 
                            paragraph.split(/(?<=[.?!])\s+/)  // 각 문단을 .?! 기준으로 분리
                        )
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
                    const splitSentences = baseSentences
                        .map((s) => breakLongSentence(s))
                        .flat();
                    console.log("🐋분할된 최종 문장 배열:", splitSentences);

                    setSentences([
                        LEVEL_5_INTRO,
                        ...splitSentences,
                        LEVEL_5_OUTRO,
                    ]);
                } else {
                    setSentences([
                        LEVEL_5_INTRO,
                        "요약 내용이 없습니다.",
                        LEVEL_5_OUTRO,
                    ]);
                }
                
                setCurrentIndex(0);
                setPreloadDone(false);
                setIsTtsCompleted(false); // TTS 완료 상태 초기화
            } catch (error) {
                console.error("❌ Level 5 데이터 로딩 실패:", error);
                setSentences(["❌ 내용을 불러오는데 실패했습니다. 다시 시도해주세요."]);
            } finally {
                setLoading(false);
            }
        };

        loadLevel5Data();
    }, [searchParams]);

    // currentIndex가 변경될 때마다 TTS 완료 상태 초기화
    useEffect(() => {
        setIsTtsCompleted(false);
    }, [currentIndex]);

    //다음 버튼
    const handleAnswer=()=>{
      if(currentIndex<sentences.length-1){
        setIsTtsCompleted(false); // TTS 완료 상태 초기화
        setCurrentIndex(currentIndex+1);
      }else{
        // 마지막 문장에서 "잘 이해했어!" 버튼을 누르면 바로 다음 단계로
        handleComplete();
      }
    };

    const handleComplete = async () => {
      alert("✅ 좋아요! 이제 마지막 단계로 넘어가볼까요?");
      await completeSession(); // Level 5 완료 상태 전송
      navigate(`/study/level6/2?chapterId=${chapterData?.chapterId}`);
    };
   
        

    return(
    <>
        <Wrapper>
                <MainWrapper>
                    <ImageWithSpeechWrapper>
                      <ContentContainer>
                        <LeftSection>
                          <HoppinImage src={hoppin} alt="호핀" />
                        </LeftSection>

                        <RightSection>
                          <SummaryImage src={image} alt="요약 이미지" />
                        </RightSection>
                      </ContentContainer>
                        <TtsPlayer
                            sentences={sentences}
                            answers={[]}
                            isAnsweringPhase={false}
                            currentIndex={currentIndex}
                            autoPlay={true}
                            style={{ display: "none" }}
                            onPreloadDone={() => setPreloadDone(true)}
                            onTtsEnd={() => setIsTtsCompleted(true)}  // TTS 재생 완료 시 호출
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
                                {/* TTS 재생 완료 시에만 버튼 표시 */}
                                {isTtsCompleted && (
                                <ButtonWrapper>
                                    {currentIndex > 0 && (
                                        <BackButton onClick={() => {
                                            setIsTtsCompleted(false); // TTS 완료 상태 초기화
                                            setCurrentIndex(currentIndex - 1);
                                        }}>
                                            이전
                                        </BackButton>
                                    )}
                                    <BubbleButton onClick={handleAnswer}>
                                        {currentIndex < sentences.length - 1 ? "다음" : "잘 이해했어!"}
                                    </BubbleButton>
                                </ButtonWrapper>
                                )}
                            </SpeechBubble>
                        )}
                    </ImageWithSpeechWrapper>
                </MainWrapper>
        </Wrapper>
    </>
    );
}

export default StudyPage;
