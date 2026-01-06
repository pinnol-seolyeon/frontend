import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  gap: 2rem;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  text-align: center;
`;

const Message = styled.p`
  font-size: 16px;
  color: #676767;
  text-align: center;
  line-height: 1.6;
`;

const InfoBox = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const InfoLabel = styled.span`
  color: #676767;
`;

const InfoValue = styled.span`
  color: #000000;
  font-weight: 600;
`;

const Button = styled.button`
  background-color: #056FB8;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #045a9a;
  }
`;

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // URL에서 결제 정보 확인
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');
    
    console.log('✅ 결제 성공:', { orderId, paymentKey, amount });
  }, [searchParams]);

  const handleGoHome = () => {
    navigate('/payment');
  };

  return (
    <Wrapper>
      <SuccessIcon>✓</SuccessIcon>
      <Title>결제가 완료되었습니다!</Title>
      <Message>
        주문이 정상적으로 처리되었습니다.<br/>
        감사합니다.
      </Message>
      
      <InfoBox>
        <InfoRow>
          <InfoLabel>주문번호</InfoLabel>
          <InfoValue>{searchParams.get('orderId') || '-'}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>결제금액</InfoLabel>
          <InfoValue>
            {searchParams.get('amount') 
              ? `${parseInt(searchParams.get('amount')).toLocaleString()}원`
              : '-'
            }
          </InfoValue>
        </InfoRow>
      </InfoBox>

      <Button onClick={handleGoHome}>
        결제 페이지로 돌아가기
      </Button>
    </Wrapper>
  );
}

export default PaymentSuccess;

