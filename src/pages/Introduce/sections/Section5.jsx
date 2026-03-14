import styled from "styled-components";
import React from "react";
import image from "../../../assets/introduce/section5_img.png";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    color: #333;
`;

const ImageWrapper = styled.div`
    margin-top: 1rem;
    width: fit-content;
    align-self: flex-end;
    img {
        width: 40vw;
        min-width: 500px;
        object-fit: contain;
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    text-align: right;
`;

const Title = styled.h2`
    font-size: 30px;
    font-weight: 700;
    line-height: 1.6;
    white-space: pre;
    color: #000;
    margin-bottom: 5rem;

`;

const Sub = styled.p`
    font-size: 20px;
    margin: 0;
    font-weight: 600;
    color: #000;
    white-space: pre;
    line-height: 1.6;
`;

const Bold = styled.span`
    font-weight: 600;
    color: #000;
    font-size: 30px;
`;

const Section5 = () => {
    return (
        <Wrapper>
            <ImageWrapper>
                <img src={image} alt="FINNOL" />
            </ImageWrapper>
            <Content>
                <Title>{`아이 스스로 이해하고 선택하는\n 경험에 집중한 금융교육`}</Title>
                <Sub>{`우리 아이에게 딱 맞춘 `}
                    <Bold>AI 학습으로 배우고</Bold>
                    {`\n퀴즈와 미션으로 `}
                    <Bold>실전처럼 경험하고</Bold>
                </Sub>
            </Content>
        </Wrapper>
    );
};

export default Section5;
