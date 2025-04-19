import styled from "styled-components";
import Header from "../components/Header";
import Box from "../components/study/Box";
import tigerPencil from "../assets/tiger-pencil.png";

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
    object-fit:contain;
    max-width:300px;
`


function StudyPage(props){
    
    return(
    <>
        <Header login={props.login} setLogin={props.setLogin}/>
        <Wrapper>
            <Box>
                <Image src={tigerPencil} alt="샘플" />
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;