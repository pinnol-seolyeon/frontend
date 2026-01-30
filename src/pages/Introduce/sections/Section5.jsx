import styled from "styled-components";
import React from "react";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #333;
`;

const Title = styled.h2`
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
`;

const Sub = styled.p`
    font-size: 1rem;
    margin: 0;
    color: #666;
`;

const Section5 = () => {
    return (
        <Wrapper>
            <Title>5장</Title>
            <Sub>여기에 5번째 섹션 내용을 넣으세요.</Sub>
        </Wrapper>
    );
};

export default Section5;
