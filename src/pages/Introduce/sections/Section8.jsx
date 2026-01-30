import styled from "styled-components";
import React from "react";
import nu02 from "../../../assets/introduce/section8_02.svg";
import up from "../../../assets/introduce/section8_up.png";
import background from "../../../assets/introduce/section8_background.png";
import roadmap from "../../../assets/introduce/section08_roadmap.svg";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-image: url(${background});
    background-size: 20%;
    background-position: 80% 95%;
    background-repeat: no-repeat;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    align-self: flex-end;
    padding: 3rem;
`;

const Title = styled.div`
    align-self: flex-end;
    img {
        width: 70%;
        object-fit: contain;
    }
`;

const Description = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    align-self: flex-end;
    padding-right: 3rem;
`;

const Sub = styled.p`
    font-size: 25px;
    font-weight: 600;
    color: #000;
    line-height: 2.0;
    margin-right: 2rem;
`;


const SubBold = styled.span`
    font-weight: 700;
    color: #000;
    font-size: 30px;
    margin-right: 2rem;
`;

const Bold = styled.span`
    font-weight: 700;
    color: #F7B62D;
    font-size: 40px;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    align-self: flex-end;
    margin-top: -2rem;
    img {
        width: 60%;
    }
`;

const RoadMapWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    align-self: flex-start;
    margin-top: 2rem;
    img {
        width: 80%;
    }
`;

const Section8 = () => {
    return (
        <Wrapper>
            <ContentWrapper>
                <Title>
                    <img src={nu02} alt="FINNOL" />
                </Title>
                <Description>
                    <Sub>
                        {`교육 전문가, 아동 심리 연구가, 금융 전문가가 만든 커리큘럼으로`}
                    </Sub>
                    <SubBold>금융 문해력 <Bold>쑥쑥</Bold> 올라가요</SubBold>
                    <IconWrapper>
                        <img src={up} alt="FINNOL" />
                    </IconWrapper>
                </Description>
            </ContentWrapper>

            <RoadMapWrapper>
                <img src={roadmap} alt="FINNOL" />
            </RoadMapWrapper>
        </Wrapper>
    );
};

export default Section8;
