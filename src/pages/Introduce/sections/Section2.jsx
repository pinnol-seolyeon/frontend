import styled from "styled-components";
import React from "react";
import background from "../../../assets/introduce/section2_background.png";
import logo from "../../../assets/introduce/finnol_logo.svg";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
    color: white;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        background-image: url(${background});
        background-size: cover;
        background-position: flex-start;
        background-repeat: no-repeat;
        opacity: 0.2;
    }
`;

const Content = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Headline = styled.p`
    font-size: 25px;
    margin: 0 0 0.5rem 0;
    opacity: 1;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    line-height: 2.5;
`;

const Bold = styled.span`
    font-weight: 700;
    font-size: 30px;
`;

const Title = styled.h2`
    font-size: 40px;
    font-weight: 700;
    margin: 0 0 5rem 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

`;

const Logo = styled.div`
    width: 40vw;
    img {
        width: 100%;
        object-fit: contain;
    }
`;

const LogoSub = styled.span`
    display: block;
    font-size: 0.35em;
    font-weight: 500;
    margin-top: 0.2em;
    opacity: 0.9;
`;

const Section2 = () => {
    return (
        <Wrapper>
            <Content>
                <Headline>우리 아이, <Bold>부자</Bold>로 키우고 싶다면?</Headline>
                <Title>초등 금융교육 플랫폼</Title>
                <Logo>
                    <img src={logo} alt="FINNOL" />
                </Logo>
            </Content>
        </Wrapper>
    );
};

export default Section2;
