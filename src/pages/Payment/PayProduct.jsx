import React, { useState } from 'react';
import styled from 'styled-components';
import productImage from '../../assets/hoppin_productimg.svg';
import { useNavigate } from 'react-router-dom';

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
  height: auto;
  min-height: 200px;
  box-shadow: 4px 4px 6px 0 rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const ProductCardImage = styled.img`
  object-fit: contain;
  width: 100%;
  height: auto;
  max-height: 250px;
`;

const ProductContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  width: 100%;
  padding: 1rem;
  border-radius: 5px;
  background-color: ${props => props.$selected ? '#F0F0F0' : '#FBFBFB'};
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.$selected ? '#F0F0F0' : '#F5F5F5'};
  }
`;

const ProductTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #191919;
`;

const ProductSubTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #191919;
`;  

const ProductPrice = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: #676767;
`;

const NextButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.disabled ? '#CCCCCC' : '#478CEE'};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover:not(:disabled) {
    background-color: #357ABD;
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;

const PreviousButton = styled.button`
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
`;

function PayProduct() {
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);
  
  const handleProductClick = () => {
    setIsSelected(!isSelected);
  };

  const handleNext = () => {
    if (!isSelected) {
      alert('상품을 선택해주세요.');
      return;
    }
    navigate('/payment/select');
  };

  const handlePrevious = () => {
    navigate('/payment/refund');
  };

  return (
    <MainWrapper>
        <ContentWrapper>
            <ProductCard>
                <ProductCardImage src={productImage} />
            </ProductCard>
            <ProductContent 
              $selected={isSelected}
              onClick={handleProductClick}
            >
              <ProductTitle>OOO</ProductTitle>
              <ProductSubTitle>- 1개월 권 -</ProductSubTitle>
              <ProductPrice>₩ 10,000</ProductPrice>
            </ProductContent>

            <NextButton 
              onClick={handleNext}
              disabled={!isSelected}
            >
              결제하기
            </NextButton>
        </ContentWrapper>
    </MainWrapper>
  );
}

export default PayProduct;

