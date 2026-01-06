import React, { useState } from 'react';
import styled from 'styled-components';
import productImage from '../../assets/finnol_pay_prouct1.svg';
import { useNavigate } from 'react-router-dom';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 2rem;
`;

const HeaderLine = styled.div`
  width: 100%;
  height: 0.5px;
  background-color: #676767;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  gap: 2rem;
`;

const HeaderColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  font-size: 16px;
  color: #000000;
  font-weight: 600;
  
  &:first-child {
    flex: 2;
  }
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const HeaderText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  gap: 2rem;
  align-items: stretch;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const ProductColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  padding-right: 2rem;
  border-right: 0.5px solid #e0e0e0;
  height: 100%;
  align-items: stretch;
  
  &:first-child {
    flex: 2;
  }
  
  &:last-child {
    border-right: none;
    padding-right: 0;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-right: none;
    padding-right: 0;
    border-bottom: 0.5px solid #e0e0e0;
    padding-bottom: 1rem;
    
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
`;

const ProductInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    gap: 1rem;
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
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const TagWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #D1E8F7;
  width: 100%;
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-size: 12px;
  align-items: center;
  justify-content: space-between;
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

const TagContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
`;

const TagMust = styled.div`
  color: #000000;
  padding: 0.25rem 0.5rem;
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

const QuantitySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const QuantityDisplay = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const QuantityControl = styled.div`
  border: 1px solid #056FB8;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 16px;
  color: #056FB8;
  width: 100%;
  padding: 0.5rem;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #056FB8;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #000000;
  }
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BuyNowButton = styled.button`
  background-color: #056FB8;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  padding: 0.5rem;
  
  &:hover {
    background-color: #045a9a;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 14px;
  }
`;

const OrderSummarySection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 0.5px solid #e0e0e0;
`;

const OrderCount = styled.div`
  font-size: 14px;
  color: #676767;
  margin-bottom: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const SummaryAmount = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  color: #676767;
`;

const TotalAmount = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #056FB8;
`;

const TotalLabel = styled.div`
  font-size: 14px;
  color: #056FB8;
  font-weight: 600;
`;

const Operator = styled.div`
  font-size: 18px;
  color: #676767;
  margin-top: 0.75rem;
`;

const OrderButton = styled.button`
  background-color: #ffffff;
  color: #000000;
  border: 2px solid #FFD700;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background-color: #fffef0;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 16px;
  }
`;

const ContinueShopping = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 14px;
  color: #056FB8;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #045a9a;
  }
`;

function PaySelect({ user }) {
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const productPrice = 10000;
  const shippingFee = 3000;
  const totalPrice = productPrice * quantity + shippingFee;

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setSelected(checked);
  };

  const handleSelect = (checked) => {
    setSelected(checked);
    if (!checked) {
      setSelectAll(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handlePayment = () => {
    if (!selected) {
      alert('상품을 선택해주세요.');
      return;
    }
    // Pay.jsx로 이동 (결제 화면) - 수량 정보 전달
    navigate('/payment/pay', {
      state: {
        quantity: quantity,
        productPrice: productPrice,
        shippingFee: shippingFee,
        totalPrice: totalPrice,
      }
    });
  };

  const navigate = useNavigate();

  return (
    <MainWrapper>
      <HeaderSection>
        <HeaderRow>
          <HeaderColumn>
            <CheckboxInput
              type="checkbox"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <HeaderText>상품 정보</HeaderText>
          </HeaderColumn>
          <HeaderColumn>
            상품정보
          </HeaderColumn>
          <HeaderColumn>
            주문금액
          </HeaderColumn>
        </HeaderRow>
      </HeaderSection>
      
      <HeaderLine />

      <ProductCard>
        <ProductColumn>
          <ProductInfoRow>
            <CheckboxInput
              type="checkbox"
              checked={selected}
              onChange={(e) => handleSelect(e.target.checked)}
            />
            <ProductImage>
              <img src={productImage} alt="Product" />
            </ProductImage>
            <ProductDetails>
              <ProductName>커리큘럼 이름</ProductName>
              <TagWrapper>
                <TagContent>
                  <TagMust>필수</TagMust>
                  <Tag>- 1개월 권 -</Tag>
                </TagContent>
              </TagWrapper>
            </ProductDetails>
          </ProductInfoRow>
        </ProductColumn>
        <ProductColumn>
          <QuantitySection>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityControl>
              <QuantityButton onClick={() => handleQuantityChange(-1)}>−</QuantityButton>
              <span>수량 변경</span>
              <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
            </QuantityControl>
          </QuantitySection>
        </ProductColumn>
        <ProductColumn>
          <PriceSection>
            <Price>{productPrice.toLocaleString()}원</Price>
            <BuyNowButton>바로구매</BuyNowButton>
          </PriceSection>
        </ProductColumn>
      </ProductCard>

      <OrderSummarySection>
        <OrderCount>총 주문 상품 {quantity}개</OrderCount>
        <SummaryRow>
          <SummaryItem>
            <SummaryAmount>{(productPrice * quantity).toLocaleString()}원</SummaryAmount>
            <SummaryLabel>상품금액</SummaryLabel>
          </SummaryItem>
          <Operator>+</Operator>
          <SummaryItem>
            <SummaryAmount>{shippingFee.toLocaleString()}원</SummaryAmount>
            <SummaryLabel>배송비</SummaryLabel>
          </SummaryItem>
          <Operator>=</Operator>
          <SummaryItem>
            <TotalAmount>{totalPrice.toLocaleString()}원</TotalAmount>
            <TotalLabel>총 주문금액</TotalLabel>
          </SummaryItem>
        </SummaryRow>
      </OrderSummarySection>

      <OrderButton
        onClick={handlePayment}
      >
        주문하기
      </OrderButton>
      <ContinueShopping
        onClick={() => {
          navigate('/payment');
        }}
      >계속 쇼핑하기</ContinueShopping>
    </MainWrapper>
  );
}

export default PaySelect;
