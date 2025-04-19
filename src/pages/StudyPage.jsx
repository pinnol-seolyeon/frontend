import styled from "styled-components";
import Header from "../components/Header";
import Box from "../components/study/Box";
import Button from "../components/Button";

const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

`;




function StudyPage(props){
    
    return(
    <>
        <Header login={props.login} setLogin={props.setLogin}/>
        <Wrapper>
            <Box>
                <Button onClick={()=>alert("다음 단계로")}>다음 단계</Button>
            </Box>
        </Wrapper>
    </>
    );
}

export default StudyPage;