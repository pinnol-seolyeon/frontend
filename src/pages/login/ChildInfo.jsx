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

    const [phoneNumber, setPhoneNumber] = useState("");
    const [agreement,setAgreement]=useState(false);

    const formatKoreanPhoneNumber = (value) => {
        const digitsOnly = value.replace(/[^0-9]/g, "");
        const digits = digitsOnly.slice(0, 11); // enforce 11 digits max
        if (digits.length <= 3) return digits;
        if (digits.length <= 7) return `${digits.slice(0,3)}-${digits.slice(3)}`;
        return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`; // 3-4-4
    };

    const handlePhoneNumberChange = (e) => {
        const formatted = formatKoreanPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
    };

    const handleAgreementChange=(e)=>{
        setAgreement(e.target.checked);
    }
    
    const writeChildInfo = () => {
        if (!phoneNumber.trim()) {
            alert("전화번호를 입력해주세요.");
            return;
        }
        if (!agreement) {
            alert("개인정보 수집 및 이용에 동의해주세요.");
            return;
        }
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/parents/phone-number`,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include",
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                agreement: agreement
            })
        })
        .then((res) => {
            if (!res.ok) throw new Error("요청 실패");
            return res.json();
        })
        .then((data) => {
            alert("✅ 정보가 성공적으로 저장되었습니다!");
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
                title="개인정보 수집 및 이용 동의"
                subtitle="부모님의 전화번호를 입력하고 동의해 주세요."
            >
                <InputWrapper>
                    <Label>번호</Label>
                    <StyledInput 
                        type="text" 
                        value={phoneNumber} 
                        onChange={handlePhoneNumberChange}
                        inputMode="numeric"
                        maxLength={13}
                        placeholder="전화번호를 입력해주세요."
                    />
                </InputWrapper>

                <InputWrapper>
                    <Label>개인정보 수집 및 이용 동의</Label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input 
                            id="agreement"
                            type="checkbox"
                            checked={agreement}
                            onChange={handleAgreementChange}
                        />
                        <label htmlFor="agreement">동의합니다</label>
                    </div>
                </InputWrapper>

                <StyledButton onClick={writeChildInfo} disabled={!phoneNumber.trim() || !agreement}>
                    핀놀 시작하기
                </StyledButton>
            </Box>
        </Wrapper>
    );
}

export default ChildInfo;