import styled from "styled-components";
import React from "react";
import nu01 from "../../../assets/introduce/section7_01.svg";
import hoppin from "../../../assets/introduce/section7_hoppin.png";
import desktop from "../../../assets/introduce/section7_desktop.png";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

const Title = styled.div`
    img {
        width: 70%;
        object-fit: contain;
    }
    align-self: flex-start;
`;

const Sub = styled.p`
    align-self: flex-start;
    margin-left: 1rem;
    font-size: 30px;
    font-weight: 700;
    color: #000;
    line-height: 1.6;
    margin-bottom: 2rem;
`;

const Bold = styled.span`
    font-weight: 700;
    color: #F7B62D;
    font-size: 40px;
`;

const Sub2 = styled.p`
    align-self: flex-start;
    margin-left: 1rem;
    font-size: 25px;
    font-weight: 600;
    color: #000;
    margin-bottom: 2rem;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    align-self: flex-start;
    margin-left: 1rem;
    img {
        width: 70%;
        object-fit: contain;
    }
`;

const LeftSection = styled.div`
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 6rem 0 0 6rem;
`;

const RightSection = styled.div`
    width: fit-content;
    display: flex;
    align-items: center;
    align-self: flex-end;
    img {
        width: 80%;
        object-fit: contain;
    }
`;
const Section7 = () => {
    return (
        <Wrapper>
            <LeftSection>
                <Title>
                    <img src={nu01} alt="FINNOL" />
                </Title>
                <Sub>AI 튜터 <Bold>호핀</Bold>과의 대화형 수업</Sub>
                <Sub2>스스로 질문하고 사고해요</Sub2>
                <IconWrapper>
                    <img src={hoppin} alt="FINNOL" />
                </IconWrapper>
            </LeftSection>
            <RightSection>
                <img src={desktop} alt="FINNOL" />
            </RightSection>
        </Wrapper>
    );
};

export default Section7;
