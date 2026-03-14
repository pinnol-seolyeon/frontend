import styled from "styled-components";
import React from "react";
import background from "../../../assets/introduce/section3_background.png";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    gap: 3rem;
    padding: 5rem 6rem;
    box-sizing: border-box;
    background-image: url(${background});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

const TextBlock = styled.div`
    max-width: 45%;
    color: #333;
`;

const BeforeHeadline = styled.p`
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
`;

const AfterHeadline = styled.p`
    font-size: 30px;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
    margin-bottom: 5rem;
`;

const Bold = styled.span`
    font-size: 40px;
    font-weight: 700;
    color: #046EB7;
`;

const Body = styled.p`
    font-size: clamp(0.9rem, 1.2vw, 1rem);
    line-height: 1.7;
    margin: 0;
    color: #555;
`;

const First = styled.p`
    font-size: 20px;
    font-weight: 600;
    line-height: 1.6;
    white-space: pre-line;
    color: #000;
    margin-bottom: 2rem;
`;

const FirstBold = styled.span`
    font-weight: 800;
    color: #000;
`;

const Second = styled.p`
    font-size: 20px;
    font-weight: 600;
    line-height: 1.6;
    white-space: pre-line;
    color: #000;
    margin-bottom: 2rem;
`;

const SecondBold = styled.span`
    font-weight: 800;
    color: #000;
    font-size: 30px;
`;

const Third = styled.p`
    font-size: 20px;
    font-weight: 600;
    line-height: 1.6;
    white-space: pre-line;
    color: #000;
`;

const Section3 = () => {
    return (
        <Wrapper>
            <TextBlock>
                <BeforeHeadline>용돈을 주기 전에, </BeforeHeadline>
                <AfterHeadline><Bold>돈을 이해하는 힘</Bold>부터 길러주세요</AfterHeadline>
                <Body>
                    <First>
                        {`대부분의 아이들은`}
                        {"\n"}
                        <FirstBold>얼마를 쓰는지</FirstBold>
                        {`는 알지만`}
                    </First>
                    <Second>
                        <SecondBold>왜 </SecondBold>
                        <FirstBold>쓰는지</FirstBold>
                        는 배우지 못합니다.
                    </Second>
                    <Third>
                        {`그래서 필요해서 쓰는 게 아니라\n갖고 싶어서 쓰는 것이 되고\n습관으로 굳어집니다.`}
                    </Third>
                </Body>
            </TextBlock>
        </Wrapper>
    );
};

export default Section3;
