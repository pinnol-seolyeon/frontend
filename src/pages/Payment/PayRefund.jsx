import React from 'react';
import styled from 'styled-components';

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
  margin: 2rem 0 ;
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

function PayRefund() {
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
    </MainWrapper>
  );
}

export default PayRefund;

