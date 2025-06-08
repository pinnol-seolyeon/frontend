// components/study/Box.jsx
import styled from "styled-components";
import MiniHeader from "./study/MiniHeader"; // 경로는 위치에 따라 조정

const StyleBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: auto;
  background-color: white;
  border-radius: 24px;
  border: 0.5px solid black;
  overflow: visible;
 
  position:relative;
`;

function Box({ children }) {
  return (
    <StyleBox>
      {/* <MiniHeader /> */}
      {children}
    </StyleBox>
  );
}

export default Box;  