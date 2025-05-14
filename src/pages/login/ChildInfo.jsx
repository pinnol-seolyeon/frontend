import styled from "styled-components";
import logo from '../../assets/finnol-logo.png';
import login from "../../assets/login.png";
import MiniHeader from "../../components/study/MiniHeader";
import Button from "../../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const navigate=useNavigate();

    const [childName,setChildName]=useState("");
    const [childAge,setChildAge]=useState("");


    const handleNameChange=(e)=>{
        setChildName(e.target.value);
        console.log("")
    };

    const handleAgeChange=(e)=>{
        setChildAge(e.target.value);
    };


    const writeChildInfo=()=>{
        fetch("http://localhost:8080/api/user/child",{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include",
            body: JSON.stringify({
                childName: childName,
                childAge: Number(childAge)
            })
        })

        .then((res) => {
            if (!res.ok) throw new Error("요청 실패");
            return res.json();
          })
          .then((data) => {
            alert("✅ 자녀 정보가 성공적으로 저장되었습니다!");
            console.log(data);
            navigate("/");
          })
          .catch((err) => {
            console.error(err);
            alert("❌ 저장 중 오류가 발생했습니다.");
          });
      };


    return(
        <Wrapper>
            <Box>
                <StyledMiniHeader>자녀 정보 입력</StyledMiniHeader>
                <InputWrapper>
                    <Label>이름</Label>
                    <UnderlinedInput type="text" value={childName} onChange={handleNameChange}/>
                </InputWrapper>

                <InputWrapper>
                    <Label>나이</Label>
                    <UnderlinedInput type="number" value={childAge} onChange={handleAgeChange}/>
                </InputWrapper>

                <StyledButton onClick={writeChildInfo}>입력</StyledButton>
            </Box>
        </Wrapper>
    );
}

export default ChildInfo;