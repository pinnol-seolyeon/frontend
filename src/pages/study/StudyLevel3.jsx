import styled from "styled-components";

import Header from "../../components/Header";
import Box from "../../components/Box";
import tiger from "../../assets/tiger-upperbody1.png";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

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
    margin-top:100px;
    margin-bottom:0px;

`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height:25%;
    background-color:#FEF3E1;
    

    position:relative;

`;

const TextBox=styled.div`
    display:flex;
    justify-content:center; /*가로 정렬*/
    align-items:center; /*세로 정렬*/

    width:50%;
    margin:0 auto;
    paddding:50px;
    font-size: clamp(20px, 5vw, 25px); /* 최소폰트크기,뷰포트 너비 기반 크기, 최대 폰트 */
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

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
`;

const QuestionButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;

  padding: 16px 16px;
  background-color: #2774B2;
  color: white;
  border-radius: 15px;
  cursor: pointer;
  border:0.2px solid black;

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
`;


function StudyPage(props){

    const navigate=useNavigate();

   const navigateToQuestion=()=>{
        navigate("/question");
   }
    
    return(
    <>
        <Header login={props.login} setLogin={props.setLogin}/>
        <Wrapper>
            <Box>
            <ImageWrapper>
                <Image src={tiger} alt="샘플" />
                <QuestionButton onClick={navigateToQuestion}
                >질문</QuestionButton>
            </ImageWrapper>
                <SpeechBubble>
                    <TextBox>안녕</TextBox>
                    <BubbleButton>대답하기</BubbleButton>
                </SpeechBubble>
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;