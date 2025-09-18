import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
    border-radius: 5px;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 15rem;
    width: 100%;
    flex: 1;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
`;

const IconImage = styled.img`
    width: 8rem;
    height: 8rem;
    object-fit: contain;
    flex-shrink: 1;
    min-width: 4rem;
    min-height: 4rem;
    
    /* 태블릿 크기에서 */
    @media (max-width: 1024px) {
        width: 6rem;
        height: 6rem;
    }
    
    /* 모바일 크기에서 */
    @media (max-width: 768px) {
        width: 5rem;
        height: 5rem;
    }
    
    /* 작은 모바일에서 */
    @media (max-width: 480px) {
        width: 4rem;
        height: 4rem;
    }
`;

const ContentSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 1rem;
`;

const Title = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin: 0 0 1rem 0;
    line-height: 1.3;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Description = styled.p`
    font-size: 1rem;
    color: white;
    font-weight: 400;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
    text-align: left;
    white-space: pre-line;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Button = styled.button`
    background-color: white;
    border: none;
    border-radius: 10px;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    color: #478CEE;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
    white-space: nowrap;
    
    /* 태블릿 크기에서 */
    @media (max-width: 1024px) {
        padding: 0.7rem 1.5rem;
        font-size: 0.9rem;
    }
    
    /* 모바일 크기에서 */
    @media (max-width: 768px) {
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
    }
    
    /* 작은 모바일에서 */
    @media (max-width: 480px) {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
    
    &:hover {
        background-color: #f8f9ff;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;

const Card = ({ 
    icon, 
    title, 
    description, 
    buttonText = "바로가기", 
    backgroundColor = "linear-gradient(135deg, #FF8A65, #FF7043)",
    iconBackgroundColor = "#e8f5e8",
    onButtonClick 
}) => {
    return (
        <CardWrapper style={{ background: backgroundColor }}>
            <ContentSection>
                <div>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                </div>
                
                <Button onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </ContentSection>

            <IconImage src={icon} alt={title} />
        </CardWrapper>
    );
}

export default Card;