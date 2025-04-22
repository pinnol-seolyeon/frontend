import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import testImage from "../../../assets/testImage.png";
import Button from "../../../components/Button";


/*학습하기-6단계-1*/

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
    width:80%; 
    height:auto;
    object-fit:contain; /*이미지의 원본 비율을 유지 -> 이미지 전체가 보이도록 안 잘리게 */
    max-width:380px;
    display:block;
    margin:0 auto; /*가로 중앙 정렬*/
    padding:50px;

    // position:absolute;
    // left:20px;
    // bottom:20px;
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

  background-color: #2774B2;
  color: white;
  border-radius: 30px;
  cursor: pointer;
  border: 0.2px solid black;

  transition: background-color 0.3s;
  &:hover {
    background-color: #1b5c91;
  }

  position:absolute;
  bottom:20px;
  right:20px;
`;

function StudyLevel6(props){
    
    return(
    <>
        <Header login={props.login} setLogin={props.setLogin}/>
        <Wrapper>
            <Box>
                <Title>오늘의 학습 요약</Title>
                <Image src={testImage} alt="샘플" />
                <NextButton>다음</NextButton>
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyLevel6;