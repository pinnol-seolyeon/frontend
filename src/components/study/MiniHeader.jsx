// components/study/MiniHeader.jsx
import styled from "styled-components";
import Button from "../Button";

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  background-color: #2774B2;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px 24px 0px 0px;
  box-sizing: border-box;
`;

const TextArea = styled.div`
  font-size: 1rem;
  color: white;
  text-align: center;
  flex: 1;
`;

function MiniHeader({ text = "1/6: 학습 목표", onPrev, onNext }) {
  return (
    <HeaderWrapper>
      <Button onClick={onPrev}>이전</Button>
      <TextArea>{text}</TextArea>
      <Button onClick={onNext}>다음 단계</Button>
    </HeaderWrapper>
  );
}

export default MiniHeader;
