import styled from "styled-components";
import React from "react";
import nu03 from "../../../assets/introduce/section9_03.svg";
import img1 from "../../../assets/introduce/section9_img1.svg";
import img2 from "../../../assets/introduce/section9_img2.svg";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 3rem 4rem;
    box-sizing: border-box;
`;

const LectSection = styled.div`
    flex: 0 1 45%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1.5rem;

    img {
        width: 70%;
        max-width: 100%;
        object-fit: contain;
    }
`;

const RightSection = styled.div`
    flex: 0 1 55%;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
`;

const RightImgWrap = styled.div`
    position: relative;
    img {
        width: 70%;
        object-fit: contain;
    }
`;

const Title = styled.h2`
    img {
        width: 70%;
        object-fit: contain;
    }
`;

const Sub = styled.p`
    font-size: 25px;
    font-weight: 600;
    margin: 0;
    color: #000;
    line-height: 2.0;
`;

const SubBold = styled.p`
    font-weight: 700;
    color: #000;
    font-size: 30px;
`;

const Bold = styled.span`
    font-weight: 700;
    color: #F7B62D;
    font-size: 40px;
`;

const Section9 = () => {
    return (
        <Wrapper>
            <LectSection>
                <Title>
                    <img src={nu03} alt="FINNOL" />
                </Title>
                <Sub>직접 계획하고, 소비하고, 저축하고</Sub>
                <SubBold>금융 행동을 <Bold>실제로 </Bold> 경험해요</SubBold>
                <img src={img1} alt="FINNOL" />
            </LectSection>
            <RightSection>
                <RightImgWrap>
                    <img src={img2} alt="FINNOL" />
                </RightImgWrap>
            </RightSection>
        </Wrapper>
    );
};

export default Section9;
