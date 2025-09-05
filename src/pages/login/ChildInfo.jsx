import styled from "styled-components";
import Box, { InputWrapper, Label, StyledInput, CustomSelect, RadioGroup, RadioOption, StyledButton } from "../../components/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #F0F4F8;
    gap: 30px;
`;

function ChildInfo(){
    const navigate = useNavigate();

    const [childName, setChildName] = useState("");
    const [childGrade, setChildGrade] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("");

    const handleNameChange = (e) => {
        setChildName(e.target.value);
    };

    const handleGradeChange = (value) => {
        setChildGrade(value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const writeChildInfo = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/child`,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include",
            body: JSON.stringify({
                childName: childName,
                childAge: Number(childGrade),
                phoneNumber: phoneNumber
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
            <Box 
                title="자녀 정보 입력"
                subtitle="맞춤형 금융교육을 위해 자녀의 정보를 입력해주세요"
            >
                <InputWrapper>
                    <Label>이름</Label>
                    <StyledInput 
                        type="text" 
                        value={childName} 
                        onChange={handleNameChange}
                        placeholder="이름을 입력해주세요"
                    />
                </InputWrapper>

                <InputWrapper>
                    <Label>학년</Label>
                    <CustomSelect 
                        value={childGrade} 
                        onChange={handleGradeChange}
                        placeholder="학년을 선택해주세요"
                        options={[
                            { value: "1", label: "1학년" },
                            { value: "2", label: "2학년" },
                            { value: "3", label: "3학년" },
                            { value: "4", label: "4학년" },
                            { value: "5", label: "5학년" },
                            { value: "6", label: "6학년" }
                        ]}
                    />
                </InputWrapper>

                <InputWrapper>
                    <Label>번호</Label>
                    <StyledInput 
                        type="text" 
                        value={phoneNumber} 
                        onChange={handlePhoneNumberChange}
                        placeholder="전화번호를 입력해주세요"
                    />
                </InputWrapper>

                <InputWrapper>
                    <Label>성별</Label>
                    <RadioGroup>
                        <RadioOption>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="male" 
                                checked={gender === "male"}
                                onChange={handleGenderChange}
                            />
                            남자아이
                        </RadioOption>
                        <RadioOption>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="female" 
                                checked={gender === "female"}
                                onChange={handleGenderChange}
                            />
                            여자아이
                        </RadioOption>
                    </RadioGroup>
                </InputWrapper>

                <StyledButton onClick={writeChildInfo}>
                    핀놀 시작하기
                </StyledButton>
            </Box>
        </Wrapper>
    );
}

export default ChildInfo;