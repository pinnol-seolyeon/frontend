import styled from "styled-components";
import React from "react";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Introuce = () => {
    return (
        <Wrapper>
            소개페이지
        </Wrapper>
    );
};

export default Introuce;