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

/*학습하기-3단계-4*/


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
    align-items:flex-start;
    // justify-content:center;

    margin-top:39px;
    gap:12px;
`



const Image=styled.img`
    width:80%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:300px;
    display:block;

    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    // align-self:center;/*가로 중앙 정렬*/
    margin-top:120px;
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




const TestImage = styled.img`
  width: 30%;               // 💡 명확히 비율 고정하고 싶을 때
  height: auto;
  object-fit: contain;
  margin-right:20px;       // px로 명확한 spacing (또는 rem 사용 가능)

  @media (max-width: 768px) {
    width: 40%;             // 💡 모바일 대응
    margin-top: 16px;
    margin-right: 10px;
  }
`;

const SpeechBubble=styled.div`
    display:flex;
    width:80%;
    // height:100%;
    min-height:120px;
    max-height:150px;
    padding:20px;
    
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

  font-size: clamp(20px, 3vw, 32px); /* ✅ 최대값을 줄여서 더 안정된 크기 */
  line-height: 1.6; /* ✅ 줄 간격을 여유 있게 */
  letter-spacing: 0.03em; /* ✅ 글자 간격 미세 조정 */
  font-weight: 500; /* ✅ 가독성 좋은 중간 두께 */
  font-family: "Noto Sans KR", sans-serif; /* ✅ 국문에 적합한 서체 */
  color: #333;
`;


const BubbleButton = styled.button`
  width: 50%;               /* 고정된 버튼 너비 */
  padding: 12px 0;            /* 텍스트 세로 여백만 유지 */
  text-align: center;         /* 텍스트 가운데 정렬 */
  

  background-color: #2774B2;
  color: white;
  border-radius: 30px;
  cursor: pointer;
  border: 0.2px solid black;

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
    gap:0px; /*형제 요소 사이의 간격*/

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
  margin-top: 3rem;
`;


function StudyPage(props){

    const navigate=useNavigate();
    
    const[image,setImage]=useState();
    const{chapterData}=useChapter();
    const[summary,setSummary]=useState();
    const [currentIndex,setCurrentIndex]=useState(0);
    const [sentences,setSentences]=useState([]);
    const [isSummaryFinished,setIsSummaryFinished]=useState(false);


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

                const splitSentences = summary
                    .split(/(?<=[.?!])\s+/)
                    .filter((s) => s.trim() !== "");

                setSentences(splitSentences);
                setCurrentIndex(0);
                
            }else{
                setSentences(["❌전달받은 내용이 없어요"]);
            }
        },[chapterData]);


    //다음 버튼
    const handleAnswer=()=>{
      if(currentIndex<sentences.length-1){
        setCurrentIndex(currentIndex+1);
      }else{
        setIsSummaryFinished(true);
      }
    }
   
        

    return(
    <>
        <Wrapper>
            <Box>
                <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={<Button onClick={()=>navigate(`/study/level6/2`)}>다음 단계로</Button>}
                >
                6/6 : 마무리
                </MiniHeader>
        <ImageWithSpeechWrapper>
            <ImageWrapper>
                <Image src={tiger} alt="샘플" />
                <TestImage src={image} alt="샘플" />
            </ImageWrapper>
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
                    <BubbleButton>잘 모르겠어..</BubbleButton>
                    <BubbleButton>이해했어!</BubbleButton>
                </ButtonWrapper>
            </SpeechWrapper>
        </ImageWithSpeechWrapper>
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;