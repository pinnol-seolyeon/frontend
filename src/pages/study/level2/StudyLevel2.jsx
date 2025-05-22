import styled from "styled-components";
import Header from "../../../components/Header";
import Box from "../../../components/Box";
import testImage from "../../../assets/testImage.png";
import MiniHeader from "../../../components/study/MiniHeader";


/*AI학습자료*/

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
    max-width:300px;
    display:block;
    margin:0 auto; /*가로 중앙 정렬*/
    padding:50px;

    // position:absolute;
    // left:20px;
    // bottom:20px;
`;





function StudyLevel2(props){
    
    return(
    <>
        <Wrapper>
            <Box>
                <Image src={testImage} alt="샘플" />
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyLevel2;