// components/study/Box.jsx
import styled from "styled-components";
import MiniHeader from "./study/MiniHeader"; // 경로는 위치에 따라 조정

const StyleBox = styled.div`
  display: flex;
  // margin-top:10px;
  // margin-bottom:10px;
  flex-direction: column;
  width: 80%;
  height: auto;
  min-height:90vh;
  background-color: white;
  border-radius: 24px;
  border: 0.5px solid black;
  overflow:auto;
 
  box-sizing:border-box;
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