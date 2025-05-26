import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import tiger from "../../../assets/tiger-upperbody1.png";
import testImage from "../../../assets/testImage.png";
import nextButton from "../../../assets/nextButton.png";
import MiniHeader from "../../../components/study/MiniHeader";
import Button from "../../../components/Button";

import { useNavigate } from "react-router-dom";

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

    margin:top:129px;
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

const TestImage = styled.img`
    // flex:1;
    max-width:20%;
    width:100%;
    height:auto;
    object-fit:contain;
    margin-top:60px;
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

`

function StudyPage(props){

    const navigate=useNavigate();
    
    return(
    <>
        <Wrapper>
            <Box>
                <MiniHeader
                    left={<Button onClick={()=>navigate(-1)}>뒤로</Button>}
                    right={<Button onClick={()=>navigate(-1)}>다음 단계로</Button>}
                >
                3/6 선생님과 학습하기
                </MiniHeader>
            <ImageWrapper>
                <Image src={tiger} alt="샘플" />
                <TestImage src={testImage} alt="샘플" />
                <QuestionButton>질문</QuestionButton>
            </ImageWrapper>
            <SpeechWrapper>
                <SpeechBubble>
                    <TextBox>돈 많은 백수가 되고 싶다 .. </TextBox>
                </SpeechBubble>
                <ButtonWrapper>
                    <BubbleButton>잘 모르겠어..</BubbleButton>
                    <BubbleButton>이해했어!</BubbleButton>
                </ButtonWrapper>
            </SpeechWrapper>
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;