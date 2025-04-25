import styled from "styled-components";
import logo from '../../assets/finnol-logo.png';
import login from "../../assets/login.png";
import MiniHeader from "../../components/study/MiniHeader";
import Button from "../../components/Button";

const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    gap:30px;


`;

const Box=styled.div`
    width:40%;
    height:50vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    // justify-content:center;

    background-color: #FEF3E1;
    border-radius: 30px;
    
`;

const StyledMiniHeader=styled(MiniHeader)`
    width:50%;
`;

const InputWrapper = styled.div`
  width: 70%;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
  margin-top:10px;
`;

const UnderlinedInput = styled.input`
  border: none;
  border-bottom: 2px solid #2774B2;
  background: transparent;
  padding: 8px 4px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-bottom: 2px solid #145a8a;
  }
`;

const StyledButton=styled(Button)`

    margin-top:10px;

    border-radius:10px;
    width:70px;
    height:30px;

    background-color:#2774B2;
    color:white;
    border:transparent;

    &:hover {
        background-color: #145a8a;
    }

`;





function ChildInfo(){


    return(
        <Wrapper>
            <Box>
                <StyledMiniHeader>자녀 정보 입력</StyledMiniHeader>
                <InputWrapper>
                    <Label>이름</Label>
                    <UnderlinedInput type="text"/>
                </InputWrapper>

                <InputWrapper>
                    <Label>나이</Label>
                    <UnderlinedInput type="number"/>
                </InputWrapper>

                <StyledButton>입력</StyledButton>
            </Box>
        </Wrapper>
    );
}

export default ChildInfo;