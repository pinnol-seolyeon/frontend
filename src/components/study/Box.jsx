import styled from "styled-components";
import Button from "../Button";

const StyleBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  height: 90vh;
  background-color: white;
  border-radius: 24px;
  overflow: hidden; /* 내용 넘칠 때 잘라냄 */
  border:0.5px solid black;
`;

const MiniHeader = styled.div`
  display: flex;
  width: 100%;
  height: 5%;
  padding: 15px;
  background-color: #2774B2;
  justify-content: space-between;
  align-items: center;
`;

const TextArea = styled.div`
  font-size: 1rem;
  color: white; 
`;

function Box() {
  return (
    <StyleBox>
      <MiniHeader>
        <Button>이전</Button>
        <TextArea>1/6: 학습 목표</TextArea>
        <Button>다음 단계</Button>
      </MiniHeader>
    </StyleBox>
  );
}

export default Box;
