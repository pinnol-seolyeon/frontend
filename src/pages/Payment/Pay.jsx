import React, { useState } from 'react';
import styled from 'styled-components';
import productImage from '../../assets/finnol_pay_prouct1.svg';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  width: 100%;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    width: 100%;
  }
`;

const RowItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FullWidthRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  gap: 1rem;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const ProductInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const ProductImage = styled.div`
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  width: 120px;
  height: 120px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 1024px) {
    min-width: 100px;
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 768px) {
    min-width: 80px;
    width: 80px;
    height: 80px;
  }
  
  @media (max-width: 480px) {
    min-width: 60px;
    width: 60px;
    height: 60px;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const ProductName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const TagWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #D1E8F7;
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-size: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 0.2rem 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
    padding: 0.15rem 0.4rem;
  }
`;

const TagMust = styled.div`
  color: #000000;
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 200;
  border: 0.5px solid #000000;
  
`;

const Tag = styled.div`
  color: #000000;
  font-size: 12px;
  font-weight: 400;
`;

const TagContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
`;

const Quantity = styled.div`
  font-size: 14px;
  color: #000000;
  font-weight: 400;
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: auto;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #676767;
  font-weight: 400;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #000000;
  font-weight: 400;
`;

const InfoValueBold = styled.div`
  font-size: 14px;
  color: #000000;
  font-weight: 600;
`;

const ModifyButton = styled.button`
  background-color: #D1E8F7;
  color: #000000;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #045a9a;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SummaryLabel = styled.div`
  font-size: 16px;
  color: #000000;
  font-weight: 300;
`;

const SummaryValue = styled.div`
  font-size: 16px;
  color: #000000;
  font-weight: 600;
`;

const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 0.5px solid #676767;
  margin-top: 0.5rem;
`;

const TotalLabel = styled.div`
  font-size: 18px;
  color: #000000;
  font-weight: 500;
`;

const TotalValue = styled.div`
  font-size: 20px;
  color: #056FB8;
  font-weight: 500;
`;

const PaymentOption = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #000000;
  font-weight: 500;
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const AgreementBox = styled.div`
  background-color: rgba(209, 232, 247, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 14px;
  color: #000000;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const PayButton = styled.button`
  width: 100%;
  background-color: #056FB8;
  color: #ffffff;
  border-radius: 2px;
  padding: 0.5rem;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
  border: none;
  
  &:hover {
    background-color: #045a9a;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

function Pay({ user }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreeAll, setAgreeAll] = useState(true);
  const [agreePayment, setAgreePayment] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const handleAgreeAll = (checked) => {
    setAgreeAll(checked);
    setAgreePayment(checked);
  };

  return (
    <MainWrapper>
      <Row style={{ flex: 2 }}>
        <Section>
            <SectionTitle>주문 상품 정보</SectionTitle>
            <ProductInfoWrapper>
            <ProductImage>
                <img src={productImage} />
            </ProductImage>
            <ProductDetails>
              <ProductName>커리큘럼 이름</ProductName>
              <TagWrapper>
                <TagContent>
                    <TagMust>필수</TagMust>
                    <Tag>- 1개월 권 -</Tag>
                </TagContent>
              
                <Quantity>
                    수량 : {quantity}
                </Quantity>
              </TagWrapper>
            </ProductDetails>
          </ProductInfoWrapper>
        </Section>

        <RowItem>
          <Section>
            <SectionHeader>
                <SectionTitle>주문자 정보</SectionTitle>
                <ModifyButton>수정</ModifyButton>
            </SectionHeader>
            <InfoRow>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>{user?.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>전화번호</InfoLabel>
              <InfoValue>010-1234-5678</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>이메일</InfoLabel>
              <InfoValue>finnol.iwannaplay@gmail.com</InfoValue>
            </InfoRow>
          </Section>
        </RowItem>

      </Row>

      <Row style={{ flex: 1.5 }}>
        <RowItem>
          <Section>
            <SectionTitle>주문 요약</SectionTitle>
            <SummaryRow>
              <SummaryLabel>상품가격</SummaryLabel>
              <SummaryValue>00,000원</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>배송비</SummaryLabel>
              <SummaryValue>+ 3,000원</SummaryValue>
            </SummaryRow>
            <TotalRow>
              <TotalLabel>총 주문금액</TotalLabel>
              <TotalValue>00,000원</TotalValue>
            </TotalRow>
          </Section>
        </RowItem>
        <RowItem>
          <Section>
            <SectionTitle>결제 수단</SectionTitle>
            <PaymentOption>
              <RadioInput
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>신용카드</span>
              {paymentMethod === 'card' && <InfoLabel style={{ marginLeft: 'auto' }}>카드사</InfoLabel>}
            </PaymentOption>
            <PaymentOption>
              <RadioInput
                type="radio"
                name="payment"
                value="naver"
                checked={paymentMethod === 'naver'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>네이버페이</span>
            </PaymentOption>
            <PaymentOption>
              <RadioInput
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>페이팔</span>
            </PaymentOption>
            <PaymentOption>
              <RadioInput
                type="radio"
                name="payment"
                value="other"
                checked={paymentMethod === 'other'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>기타</span>
            </PaymentOption>
          </Section>
        </RowItem>
        </Row>
        <Row style={{ flex: 1.5 }}>
        <RightColumn>
          <AgreementBox>
            <CheckboxWrapper>
              <CheckboxInput
                type="checkbox"
                checked={agreeAll}
                onChange={(e) => handleAgreeAll(e.target.checked)}
              />
              <span>전체 동의</span>
            </CheckboxWrapper>
            <CheckboxWrapper>
              <CheckboxInput
                type="checkbox"
                checked={agreePayment}
                onChange={(e) => {
                  setAgreePayment(e.target.checked);
                  if (!e.target.checked) setAgreeAll(false);
                }}
              />
              <span>구매조건 확인 및 결제진행에 동의</span>
            </CheckboxWrapper>
          </AgreementBox>
          <PayButton>결제하기</PayButton>
        </RightColumn>
      </Row>
    </MainWrapper>
  );
}

export default Pay;
