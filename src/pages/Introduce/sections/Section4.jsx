import styled from "styled-components";
import React from "react";
import thinking from "../../../assets/introduce/section4_img.png";
import logo from "../../../assets/introduce/section4_logo.png";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    padding: 0 4rem;
    box-sizing: border-box;
    text-align: left;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const ImageWrapper = styled.div`
    width: fit-content;
    align-self: flex-end;
    img {
        width: 50vw;
    }
`;

const Logo = styled.div`
    img {
        width: 50%;
    }
    align-self: flex-start;
    margin-bottom: 2rem;
`;

const Body = styled.p`
    font-size: 20px;
    font-weight: 600;
    line-height: 1.6;
    white-space: pre;
    color: #000;
    margin-bottom: 3rem;
    overflow: visible;
`;

const Bold = styled.span`
    font-weight: 700;
    color: #046EB7;
    font-size: 40px;
`;

const Section4 = () => {
    return (
        <Wrapper>
            <Content>
                <Logo>
                    <img src={logo} alt="FINNOL" />
                </Logo>
                <Body>
                    {`국내 어린이 금융교육 시장은 전무하며, \n 기존 서비스는 주로 용돈 관리 앱에 국한되어 있습니다.`}
                </Body>
                <Body>
                    {`관리만으로는\n판단력과 선택 기준을\n키울 수 없습니다.`}
                </Body>
                <Body>
                    {`용돈관리 앱으로는 배울 수 없는\n`}
                    <Bold>진짜 금융 교육</Bold>
                    {`을 경험해보세요.`}
                </Body>
            </Content>
            <ImageWrapper>
                <img src={thinking} alt="FINNOL" />
            </ImageWrapper>
        </Wrapper>
    );
};

export default Section4;
