// components/study/MiniHeader.jsx
import styled from "styled-components";
import Button from "../Button";

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  // height: 60px;
  min-height:80px;
  padding: 0 20px;
  background-color: #2774B2;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px 24px 0px 0px;
  box-sizing: border-box;
  position:relative;

`;

const SideArea=styled.div`
  display:flex;
  align-items:center;
  min-width:60px;
`;

const TitleArea = styled.div`
  font-size: 1.0rem;
  color: white;
  text-align: center;
  flex: 1;
  display:flex;
  justify-content:center;


  font-size:1.3rem;
  font-weight:bold;
`;

const RightArea = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
`;




function MiniHeader({ left,right,children,onClose }) {
  return (
    <HeaderWrapper>
      <SideArea>{left}</SideArea>
      <TitleArea>{children}</TitleArea>
      <SideArea>{right}</SideArea>

      {onClose&&<RightArea>{onClose}</RightArea>}
    </HeaderWrapper>
  );
}

export default MiniHeader;
