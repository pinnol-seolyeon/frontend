import React from 'react';
import styled from 'styled-components';
import productImage from '../../assets/hoppin_productimg.svg';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;


const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 80%;
  padding: 0 2.5rem;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  height: 30vh;
  box-shadow: 4px 4px 6px 0 rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const ProductCardImage = styled.img`
  object-fit: contain;
`;

const ProductContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
const ProductTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #191919;
`;

const ProductSubTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #191919;
`;  

const ProductPrice = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #676767;
`;


function PayRefund() {
  return (
    <MainWrapper>
        <ContentWrapper>
            <ProductCard>
                <ProductCardImage src={productImage} />
            </ProductCard>
            <ProductContent>
              <ProductTitle>OOO</ProductTitle>
              <ProductSubTitle>- 1개월 권 -</ProductSubTitle>
              <ProductPrice>₩ 10,000</ProductPrice>
            </ProductContent>
        </ContentWrapper>
    </MainWrapper>
  );
}

export default PayRefund;

