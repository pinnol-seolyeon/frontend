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

function PaySelect() {
  return (
    <MainWrapper>
        <TitleWrapper>
            <TitleText>제 19조 결제 취소 & 환불</TitleText>
        </TitleWrapper>
        <ContentWrapper>
            <ContentText>
            </ContentText>
        </ContentWrapper>
    </MainWrapper>
  );
}

export default PaySelect;

