import styled,{keyframes} from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tigerPencil from "../../../assets/tiger-pencil.png";
import Button from "../../../components/Button";
import MiniHeader from "../../../components/study/MiniHeader";

import { useNavigate } from "react-router-dom";
import React,{useState,useEffect} from "react";
import { useChapter } from "../../../context/ChapterContext";

/*학습하기-6단계-2*/

const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

`;


const SpeechWrapper=styled.div`
  position:relative;
  display:flex;
  flex-direction:column;

  width:100%;
  height:60%;
  align-itmes:flex-start;
  justify-content:flex-start;

  margin:2% 0;
`;

const Image = styled.img`
  position: absolute;
  left: 20px;
  bottom: 20px;

  // width: 20%;
  min-width: 120px;
  max-width: 300px;
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 25%;
    left: 5px;
    bottom: 5px;
  }

  @media (max-width: 480px) {
    width: 30%;
  }
`;



const SpeechBubble = styled.div`
  position:relative;
  display: flex;
  flex-direction: column;
  width: 80%;
  height: auto;
  min-height: 300px;

  background-color: #FEF3E1;
  // position: absolute;
  // right: 100px;
  // top: 150px;

  border: 0.5px solid black;
  border-radius: 24px;
  padding: 20px;

  margin-top:5%;
  margin-left:6%;
  // margin-bottom:10%;
`;


const TextBox = styled.div`
  flex: 1; /* 남는 공간 꽉 채움 */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  padding: 30px;
  margin: 0 auto;

  font-size: clamp(18px, 2.5vw, 28px);
  line-height: 1.6;
  letter-spacing: 0.02em;
  font-weight: 500;
  font-family: "Noto Sans KR", sans-serif;
  color: #333;

  word-break: keep-all;  /* 단어 기준 줄바꿈 */
  white-space: pre-wrap; /* 줄바꿈 및 공백 유지 */
  overflow-wrap: break-word;
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

  font-size:20px;

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
`;

const Title=styled.div`
    display:flex;
    width:20%;
    height:10%;

    align-items:center;
    justify-content:center;
    margin:20px;

    border-radius:30px;
    border:0.2px solid black;
    font-size: clamp(20px, 1.5vw, 25px);
    font-weight: bold;

    background-color:#FEF3E1;
`

const NextButton = styled(Button)`

  // width:220px;
  // height:50px;
  margin:3px;

  background-color: #2774B2;
  color: white;
  border-radius: 30px;
  cursor: pointer;
  border: 0.2px solid black;
  font-size: 20px;


  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }

  position:absolute;
  bottom:20px;
  right:20px;
`;


// 애니메이션 정의
const fadeSlide = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -30%);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -10%);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -10%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -30%);
  }
`;

export const Popup = styled.div`
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -10%);
  background: linear-gradient(to right, #ffffff, #e0f7fa);
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  color: #2e7d32;
  font-weight: bold;
  font-size: 20px;
  z-index: 9999;

  display: flex;
  align-items: center;
  gap: 12px;

  animation: ${fadeSlide} 3s ease-in-out forwards;

  &::before {
    content: "🎉";
    font-size: 28px;
    animation: bounce 1.5s infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
`;


function StudyLevel6_2(props){

    const navigate=useNavigate();
    const [showPopup,setShowPopup]=useState(false);
    const [showFamilyButton,setShowFamilyButton]=useState(false);
    const {chapterData,clearChapterData}=useChapter();
    const [topic,setTopic]=useState();
    const [currentIndex,setCurrentIndex]=useState(0);
    const [loading,setLoading]=useState(true);
    const [sentences,setSentences]=useState([]);
    const [fullTopic,setFullTopic]=useState();

      // ✅ useEffect 단순화
      useEffect(() => {
        if (chapterData?.topic) {
          setTopic(chapterData.topic);
          setLoading(false);
        } else {
          // setTopic("❌ 전달받은 내용이 없어요");
          setLoading(false);
        }
      }, [chapterData]);


    const handleComplete=async()=>{
         try {
            console.log("📦 현재 저장된 chapterData:", chapterData);


            // ✅ 여기에 실제 완료 처리 API 호출
            const response=await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/study/finish?chapterId=${chapterData?.chapterId}`, {
                method: 'POST',
                credentials:'include', //쿠키 인증 시 필요
         });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
          }

        const message=await response.text();
        console.log("✅학습완료 메시지:",message);

         setShowPopup(true);
         clearChapterData(); //localstorage + 상태 모두 초기화

         
         setTimeout(()=>{
          setShowPopup(false);
          navigate('/');
         },3000);
         
        } catch(e){
            console.error('학습 완료 처리 중 오류',e);
        }
      };
    

    const handleNextSentence = () => {
      if (currentIndex < sentences.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        alert("🎉 모든 문장을 다 봤어요!");
      }
    };

    

    

    
    return(
    <>
        <Wrapper>
            <Box>
                <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    // right={<Button disabled>다음 단계로</Button>}
                >
                6/6 : 마무리
                </MiniHeader>
                <Title>토론해보자!</Title>
                <SpeechWrapper>
                  <SpeechBubble>
                      
                      {/* ✅ topic 전체를 출력 */}
                      <TextBox>
                      {loading ? (
                        "토론 주제 생성 중.."
                      ) : (
                        <span style={{ fontWeight: "500", color: "#000000" }}>
                          {topic}
                        </span>
                      )}
                    </TextBox>

                      <BubbleButton onClick={()=>setShowFamilyButton(true)}>꼭 해볼게✅</BubbleButton>
                  
                  </SpeechBubble>
                  {/* <Image src={tigerPencil} alt="샘플" /> */}
              </SpeechWrapper>
              
              {showFamilyButton&&
                <NextButton onClick={handleComplete}>학습결과와 토론 주제 전송하기</NextButton>
              }
                {showPopup &&(
                    <Popup>🐯 학습을 완료했어요! 🐯<br/> (카카오톡 전송 기능은 추후 업데이트 될 예정이예요)</Popup>
                )}
            </Box>
        </Wrapper>
    </>
    );
}


export default StudyLevel6_2;