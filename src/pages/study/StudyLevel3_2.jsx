import styled from "styled-components";
import Header from "../../components/Header";
import Box from "../../components/Box";
import tiger from "../../assets/tiger-upperbody1.png";
import testImage from "../../assets/testImage.png";

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
    align-items:flex-end;
    // justify-content:center;

    margin:top:129ox;
    gap:12px;
`



const Image=styled.img`
    width:100%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:380px;
    display:block;
    
     /*가로 중앙 정렬, 세로 원하는 위치에 자유롭게 배치*/
    // align-self:center;/*가로 중앙 정렬*/
    margin-top:120px;
    margin-bottom:0px;

`;

const SpeechBubble=styled.div`
    display:flex;
    width:80%;
    // height:100%;
    min-height:120px;
    padding:20px;
    
    background-color:#FEF3E1;

    border-radius:0px 50px 50px 0px;
    border:0.2px solid black;

    position:relative;
    box-sizing:border-box; /*패딩 포함*/

`;

const TextBox = styled.div`
  width: 100%;
  font-size: clamp(20px, 5vw, 25px);
  line-height: 1.5;

  padding:20px;

  word-break: keep-all;   /* 단어 기준 줄바꿈 (한국어에 좋음) */
  white-space: pre-wrap;  /* 줄바꿈 문자도 반영 */
//   overflow:auto;
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

const TestImage=styled.img`
    display:flex;
    width:50%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:300px;
    display:block;
    // margin:0 auto; /*가로 중앙 정렬*/
    padding:30px;

    // position:absolute;
    // left:20px;
    // bottom:20px;
`;


function StudyPage(props){
    
    return(
    <>
        <Header login={props.login} setLogin={props.setLogin}/>
        <Wrapper>
            <Box>
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