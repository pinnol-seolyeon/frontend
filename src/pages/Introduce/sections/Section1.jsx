import styled from "styled-components";
import React from "react";
import warrenBuffett from "../../../assets/introduce/warren_buffett.png";
import background from "../../../assets/introduce/section1_background.png";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
`;

/* 배경 이미지가 깔린 영역 – 중앙 위쪽, 이 안에 콘텐츠가 맞춰짐 */
const Background = styled.div`
    position: relative;
    width: 100%;
    height: 65vh;
    min-height: 400px;
    background-image: url(${background});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    box-sizing: border-box;
`;

const TextBlock = styled.div`
    max-width: 50%;
    color: white;
`;

const MainText = styled.p`
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    line-height: 4.0;
`;

const SubText = styled.p`
    font-size: 25px;
    margin: 0;
    opacity: 0.95;
    font-weight: 600;
`;

const Bold = styled.span`
    font-weight: 700;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
`;

const Caption = styled.p`
    font-size: 0.85rem;
    margin-top: 1.5rem;
    opacity: 0.8;
    color: #ffffff;
    margin-bottom: 2rem;
    font-weight: 400;
`;

const ImageWrap = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    align-self: flex-end;
`;

const Image = styled.img`
    width: 20vw;
`;

const Section1 = () => {
    return (
        <Wrapper>
            <Background>
                <TextBlock>
                    <MainText>6살,</MainText>
                    <SubText>워렌 버핏이 <Bold>금융</Bold>을 시작한 나이입니다.</SubText>
                </TextBlock>
                <ImageWrap>
                    <Caption>가치투자의 대가 워렌 버핏 Warren Buffett</Caption>
                    <Image src={warrenBuffett} alt="워렌 버핏" />
                </ImageWrap>
            </Background>
        </Wrapper>
    );
};

export default Section1;
