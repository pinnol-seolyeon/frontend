import styled from "styled-components";
import React from "react";
import Section1 from "./sections/Section1";
import Section2 from "./sections/Section2";
import Section3 from "./sections/Section3";
import Section4 from "./sections/Section4";
import Section5 from "./sections/Section5";
import Section6 from "./sections/Section6";
import Section7 from "./sections/Section7";
import Section8 from "./sections/Section8";
import Section9 from "./sections/Section9";

const FullpageContainer = styled.div`
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;

    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const SectionWrapper = styled.section`
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    box-sizing: border-box;
    background: ${(props) => props.$background};
`;

const SECTIONS = [
    { id: 1, background: "linear-gradient(180deg, #1877B8 80%, #F0EDE5 100%)", Content: Section1 },
    { id: 2, background: "linear-gradient(180deg, #EBEDEB80 0%, #046EB7 100%)", Content: Section2 },
    { id: 3, background: "#f5f5f5", Content: Section3 },
    { id: 4, background: "#ffffff", Content: Section4 },
    { id: 5, background: "#e8f4f8", Content: Section5 },
    { id: 6, background: "#fff4e6", Content: Section6 },
    { id: 7, background: "#f0e6fa", Content: Section7 },
    { id: 8, background: "#e3f2fd", Content: Section8 },
    { id: 9, background: "#e0f2f1", Content: Section9 },
];

const Introduce = () => {
    return (
        <FullpageContainer>
            {SECTIONS.map(({ id, background, Content }) => (
                <SectionWrapper key={id} $background={background}>
                    <Content />
                </SectionWrapper>
            ))}
        </FullpageContainer>
    );
};

export default Introduce;
