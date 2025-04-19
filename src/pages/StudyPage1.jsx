import styled from "styled-components";
import Header from "../components/Header";
import Box from "../components/study/Box";
import tigerPencil from "../assets/tiger-pencil.png";
import Button from "../components/Button";

const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

`;

const Image=styled.img`
    width:100%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:380px;
    display:block;
    margin:0 auto; /*가로 중앙 정렬*/
    padding:50px;
`;

const SpeechBubble=styled.div`
    display:flex;
    width:100%;
    height:20%;
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
  border: none;
  border-radius: 30px;
  cursor: pointer;
  border:0.2px solid black;

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }
`;


function StudyPage(props){
    
    return(
    <>
        <Header login={props.login} setLogin={props.setLogin}/>
        <Wrapper>
            <Box>
                <Image src={tigerPencil} alt="샘플" />
                <SpeechBubble>
                    <TextBox>안녕</TextBox>
                    <BubbleButton>다음</BubbleButton>
                </SpeechBubble>
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;