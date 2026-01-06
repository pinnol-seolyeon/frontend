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

const FailIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f44336;
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

const ErrorBox = styled.div`
  background-color: #ffebee;
  border: 1px solid #f44336;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ErrorRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 14px;
`;

const ErrorLabel = styled.span`
  color: #676767;
  font-weight: 600;
`;

const ErrorValue = styled.span`
  color: #f44336;
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

function PaymentFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const orderId = searchParams.get('orderId');
    
    console.error('❌ 결제 실패:', { code, message, orderId });
  }, [searchParams]);

  const handleGoBack = () => {
    navigate('/payment/select');
  };

  return (
    <Wrapper>
      <FailIcon>✕</FailIcon>
      <Title>결제에 실패했습니다</Title>
      <Message>
        결제 처리 중 오류가 발생했습니다.<br/>
        다시 시도해주세요.
      </Message>
      
      <ErrorBox>
        <ErrorRow>
          <ErrorLabel>에러 코드</ErrorLabel>
          <ErrorValue>{searchParams.get('code') || '-'}</ErrorValue>
        </ErrorRow>
        <ErrorRow>
          <ErrorLabel>에러 메시지</ErrorLabel>
          <ErrorValue>{searchParams.get('message') || '알 수 없는 오류'}</ErrorValue>
        </ErrorRow>
        {searchParams.get('orderId') && (
          <ErrorRow>
            <ErrorLabel>주문번호</ErrorLabel>
            <ErrorValue>{searchParams.get('orderId')}</ErrorValue>
          </ErrorRow>
        )}
      </ErrorBox>

      <Button onClick={handleGoBack}>
        결제 페이지로 돌아가기
      </Button>
    </Wrapper>
  );
}

export default PaymentFail;

