import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: flex-start;
  background-color: #D1E8F7;
  padding: 1.3rem 2.5rem;
  border-radius: 5px;
  gap: 0.5rem;
  margin: 1rem 0 ;
`;

const TitleText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  width: 80%;
  padding: 0 2.5rem;
`;

const ContentText = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #676767;
  margin-bottom: 0.5rem;
  white-space: pre-wrap;
  line-height: 1.8;
  text-align: left;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  padding: 0.75rem 1rem;
  width: 100%;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  // &:hover {
  //   background-color: rgba(209, 232, 247, 0.3);
  // }
`;

const CheckboxContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 1.3rem;
  height: 1.3rem;
  flex-shrink: 0;
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  margin: 0;
  
  &:checked + .checkmark {
    background-color: #478CEE;
    border-color: #478CEE;
    
    &:after {
      display: block;
    }
  }
  
  &:focus + .checkmark {
    box-shadow: 0 0 0 3px rgba(71, 140, 238, 0.2);
  }
`;

const Checkmark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%) rotate(45deg);
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
  }
`;

const NextButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 0.8rem 1.5rem;
  background-color: #478CEE;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover:not(:disabled) {
    background-color: #104EA7;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }
`;

const ButtonWrapper = styled.div`
  flex-direction: column;
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  width: 80%;
`;

function PayRefund() {
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const handleAgreeChange = (e) => {
    setIsAgreed(e.target.checked);
  };

  const handleNext = () => {
    navigate('/payment/product');
  };

  return (
    <MainWrapper>
        <TitleWrapper>
            <TitleText>제 19조 결제 취소 & 환불</TitleText>
        </TitleWrapper>
        <ContentWrapper>
            <ContentText>
                {`1. 회사와 구매에 관한 계약을 체결한 회원은 아래와 같이 결제에 대한 취소 및 환불을 요구할 수 있습니다.
   • 이용계약의 신청 후, 회사로부터의 상담이 제공되지 않은 경우, 결제취소가 가능합니다.
      a. 정기결제회원 : 환불은 서비스를 이용한 일수를 제외하고 일할 계산으로 진행됩니다.
         월 기준은 30일이고 월 이용료를 30으로 나눈 금액을 말합니다.
         결제 시간으로부터 24시간 이후 ~ 15일까지는 남은 일 수에 대한 일할 계산으로 처리됩니다.
      b. 연간결제회원 : 연 기준은 12개월이고, 잔여이용료는 전체 연간결제 이용료를 12로 나눈 하루 일에 대한 금액이 환불됩니다.

   • 회원이 상담 후 상대 프로필카드를 2회 이상 수령한 경우, 잔여횟수가 남은 회원에 한하여 이용 금액과 위약금 10%를 제외한 부분 환불이 가능합니다.

2. 회사의 귀책사유로 결제 오류가 발생한 경우
3. 회사의 귀책 사유로 서비스가 중단되는 경우

본 조의 환불 금액 기준은 연간결제 회원이라 하더라도 정기결제 금액으로 계산 후 진행됩니다.`}
            </ContentText>
        </ContentWrapper>
        <ButtonWrapper>
          <CheckboxWrapper>
            <CheckboxContainer>
              <CheckboxInput
                type="checkbox"
                checked={isAgreed}
                onChange={handleAgreeChange}
                id="refund-agreement"
              />
              <Checkmark className="checkmark" />
            </CheckboxContainer>
            <span>확인했습니다</span>
          </CheckboxWrapper>
          <NextButton 
            onClick={handleNext}
            disabled={!isAgreed}
          >
            다음
          </NextButton>
        </ButtonWrapper>
    </MainWrapper>
  );
}

export default PayRefund;

