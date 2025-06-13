import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import testImage from "../../../assets/testImage.png";
import nextButton from "../../../assets/nextButton.png";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";


import { useNavigate } from "react-router-dom";
import React,{useState,useEffect} from "react";
import { useChapter } from "../../../context/ChapterContext";
import TtsPlayer from "../../../components/TtsPlayer";

/*학습하기-3단계-4*/


const Wrapper=styled.div`
    width:100%;
    // height:100vh;
    min-height:100vh;
    height:auto; //높이 제한 없음

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

`;

const ImageWrapper=styled.div`
    position:relative;
    display:flex;
    align-items:flex-end; //아래쪽 정렬
    // justify-content:center;
    gap:10%;

    
`



const Image=styled.img`
    // width:80%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    width: clamp(100px,40vw,250px); //최소 150px, 최대 250px, 화면 너비 40%까지 가능
    display:block;

    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    // align-self:center;/*가로 중앙 정렬*/
    // margin-top:10rem;
    margin-bottom:0px;

`;


const ImageButton=styled.img`
position: absolute;
  right: 20px;
  bottom: 20px;
  width:60px;
  height:auto;
  cursor:pointer;

  padding: 10px 16px;
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

`;




const SummaryImage = styled.img`
  width: clamp(0px,40vw,250px);             // 💡 명확히 비율 고정하고 싶을 때
  height: auto;
  object-fit: contain;
  margin-bottom:2rem;
  // margin-top:8rem;

 
`;

const SpeechBubble=styled.div`
    display:flex;
    width:80%;
    // height:100%;
    max-height:150px;
    // padding:20px;
    
    background-color:#FEF3E1;

    border-radius:0px 50px 50px 0px;
    border:0.2px solid black;

    position:relative;
    box-sizing:border-box; /*패딩 포함*/

`;

const TextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  width: 80%;
  margin: 0 auto;
  padding: 40px; /* ✅ 오타 수정 및 공간 확보 */

  font-size: clamp(16px, 2vw, 24px); /* ✅ 최대값을 줄여서 더 안정된 크기 */
  line-height: 1.6; /* ✅ 줄 간격을 여유 있게 */
  letter-spacing: 0.02em; /* ✅ 글자 간격 미세 조정 */
  font-weight: 400; /* ✅ 가독성 좋은 중간 두께 */
  font-family: "Noto Sans KR", sans-serif; /* ✅ 국문에 적합한 서체 */
  color: #333;
`;


const BubbleButton = styled.button`
  width: 60%;               /* 고정된 버튼 너비 */
  padding: 0.6em 1.2em;            /* 텍스트 세로 여백만 유지 */
  text-align: center;         /* 텍스트 가운데 정렬 */
  

  background-color: #2774B2;
  color: white;
  border-radius: 30px;
  cursor: pointer;
  border: 0.2px solid black;

  font-size: 20px;

  transition: background-color 0.3s;
  &:hover {x
    background-color: #1b5c91;
  }
`;



const SpeechWrapper=styled.div`
    position:relative;
    width:100%;
    // height:20%;
    display:flex;
    align-items:stretch;
    flex-direction: row;
    gap:20px; /*형제 요소 사이의 간격*/

`

const ButtonWrapper=styled.div`
    position:relative;
    width:20%;
    height:100%;


    display:flex;
    align-items:flex-start;
    flex-direction:column;
    justify-content:center;

    gap:12px;
    padding: 0px 0px 0px 20px;

`;

const ImageWithSpeechWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  width: 100%;
  margin: 1rem 0rem;
`;


function StudyPage(props){

    const navigate=useNavigate();
    
    const[image,setImage]=useState();
    const{chapterData}=useChapter();
    const[summary,setSummary]=useState();
    const [currentIndex,setCurrentIndex]=useState(0);
    const [sentences,setSentences]=useState([]);
    const [isSummaryFinished,setIsSummaryFinished]=useState(false);
    const [preloadDone, setPreloadDone] = useState(false);
    const [showButton,setShowButton]=useState(false);
    const [completed,setCompleted]=useState(false);

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

        setShowButton(true);
        setIsSummaryFinished(true);
      }
    };

    const handleComplete=()=>{
      alert("✅ 좋아요! 이제 마지막 단계로 넘어가볼까요?");
      setCompleted(true);
    };
   
        

    return(
    <>
        <Wrapper>
            <Box>
                <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={
                      completed?(
                          <Button onClick={()=>navigate(`/study/level6/2`)}>다음 단계로</Button>
                      ):(
                        <Button disabled>진행 중 .. </Button>
                      )
                    }
                >
                6/6 : 마무리
                </MiniHeader>
        <ImageWithSpeechWrapper>
            <ImageWrapper>
                <Image src={tiger} alt="샘플" />
                <SummaryImage src={image} alt="샘플" />
            </ImageWrapper>
            <TtsPlayer
              sentences={sentences}
              answers={[]}
              isAnsweringPhase={false}
              currentIndex={currentIndex}
              autoPlay={true}
              style={{ display: "none" }}
              onPreloadDone={() => setPreloadDone(true)}
            />
            <SpeechWrapper>
                <SpeechBubble>
                    <TextBox>
                        {sentences.length>0?sentences[currentIndex]:"설명이 없습니다."}
                        <ImageButton
                            src={nextButton}
                            alt="버튼"
                            onClick={handleAnswer}
                        ></ImageButton>
                    </TextBox>
                </SpeechBubble>
                <ButtonWrapper>
                  {showButton&&
                    <BubbleButton onClick={handleComplete}>✅</BubbleButton>
                  }
                  
                </ButtonWrapper>
            </SpeechWrapper>
        </ImageWithSpeechWrapper>
        </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;