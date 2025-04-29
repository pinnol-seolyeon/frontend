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

const TitleArea = styled.div`
  font-size: 1.2rem;
  color: white;
  text-align: center;
  flex: 1;
`;

const RightArea = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
`;


function MiniHeader({ children, onClose }) {
  return (
    <HeaderWrapper>
      <TitleArea>{children}</TitleArea>
      {onClose&&(
        <RightArea>
          {onClose}
        </RightArea>
      )}
    </HeaderWrapper>
  );
}

export default MiniHeader;
