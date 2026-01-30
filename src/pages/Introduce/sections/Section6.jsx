import styled from "styled-components";
import React from "react";
import TitleImg from "../../../assets/introduce/section6_title.svg";
import listimage from "../../../assets/introduce/section6_list.png";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 3rem;
`;

const Title = styled.div`
    justify-self: flex-start;
    margin-bottom: 3rem;
    img {
        width: 100%;
        object-fit: contain;
    }
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Sub = styled.p`
    font-size: 30px;
    margin: 0;
    color: #ffffff;
    font-weight: 600;
    line-height: 1.6;
    white-space: pre;
    align-self: flex-end;
    text-align: right;
    margin-right: 5rem;
`;

const Bold = styled.span`
    font-weight: 700;
    color: #F7B62D;
    font-size: 40px;
`;

const List = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ListImg = styled.img`
    width: 55%;
    object-fit: contain;
`;

const Section6 = () => {
    return (
        <Wrapper>
            <Title>
                <img src={TitleImg} alt="FINNOL" />
            </Title>
            <Content>
                <Sub>
                    {`평생 가는 금융 습관\n핀놀로 배우는 `}
                    <Bold>진짜 금융</Bold>
                </Sub>
                <List>
                    <ListImg src={listimage} alt="FINNOL" />
                </List>
            </Content>

        </Wrapper>
    );
};

export default Section6;
