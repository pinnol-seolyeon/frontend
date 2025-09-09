import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
`;

const IconContainer = styled.div`
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
`;

const IconImage = styled.img`
    width: 3rem;
    height: 3rem;
    object-fit: contain;
`;

const ContentSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Title = styled.h3`
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
    line-height: 1.2;
`;

const Description = styled.p`
    font-size: 1rem;
    color: #333;
    margin: 0;
    line-height: 1.4;
    flex: 1;
    text-align: center;
    white-space: pre-line;
`;

const Button = styled.button`
    background-color: white;
    border: none;
    border-radius: 8px;
    max-width: 100%;
    padding: 12px 5rem;
    font-size: 14px;
    font-weight: 600;
    color: #000;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 16px;
    
    /* 태블릿 크기에서 */
    @media (min-width: 768px) {
        padding: 12px 7rem;
    }
    
    /* 데스크톱 크기에서 */
    @media (min-width: 1024px) {
        padding: 12px 10rem;
    }
    
    &:hover {
        background-color: #f5f5f5;
    }
`;

const Card = ({ 
    icon, 
    title, 
    description, 
    buttonText = "시작하기", 
    backgroundColor = "linear-gradient(90deg, #EFF6FF, #AED2FF)",
    iconBackgroundColor = "#e8f5e8",
    onButtonClick 
}) => {
    return (
        <CardWrapper style={{ background: backgroundColor }}>
            <IconContainer style={{ backgroundColor: iconBackgroundColor }}>
                <IconImage src={icon} alt={title} />
            </IconContainer>
            
            <ContentSection>
                <div>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                </div>
                
                <Button onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </ContentSection>
        </CardWrapper>
    );
}

export default Card;