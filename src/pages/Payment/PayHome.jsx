import React from 'react';
import styled from 'styled-components';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 4rem;
`;

const MainTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: none;
`;

const TableRow = styled.tr`
  border: none;
`;

const TableRow1 = styled.tr`
  border: none;
  border-bottom: 0.5px solid #676767;
  margin-bottom: 1.5rem;
`;


const NavCell = styled.td`
  border: none;
  padding-bottom: 1.5rem;
  padding-top: 0;
  white-space: nowrap;
  width: fit-content;
`;

const NarrowNavCell = styled.td`
  border: none;
  padding: 0 1.5rem 1.5rem 0;
  white-space: nowrap;
  width: 1%;
`;

const NavLink = styled.a`
  color: #191919;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    text-decoration: none;
  }
`;

const LeftCell = styled.td`
  vertical-align: top;
  padding-bottom: 1rem;
  padding-top: 1.5rem;
  border: none;
  
  @media (max-width: 768px) {
    display: block;
    padding-right: 0;
    padding-bottom: 2rem;
  }
`;

const RightCell = styled.td`
  vertical-align: top;
  padding-bottom: 1rem;
  padding-top: 1.5rem;
  border: none;
  width: 3%;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const InfoCell = styled.td`
  vertical-align: top;
  padding-bottom: 1rem;
  padding-top: 1.5rem;
  border: none;

  
  @media (max-width: 768px) {
    display: block;
    padding-right: 0;
  }
`;

const LeftText = styled.div`
  font-size: 16px;
  color: #000000;
  border: none;
  padding: 0;
  padding-bottom: 0.3rem;
  font-weight: 600;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #191919;
  border: none;
  padding: 0;
  padding-bottom: 1.5rem;
`;

const RightLabel = styled.span`
  font-size: 14px;
  color: #000000;
  font-weight: 600;
`;

const RightValue = styled.span`
  font-size: 14px;
  color: #676767;
  font-weight: 400;
`;

function PayHome({ user, login, setLogin }) {
  return (
    <MainWrapper>
      <MainTable>
        <tbody>
          {/* 1행: 이용안내, 개인정보취급방침, 이용약관, 빈 열, 빈 열 */}
          <TableRow1>
            <NarrowNavCell>
              <NavLink href="#">이용안내</NavLink>
            </NarrowNavCell>
            <NarrowNavCell>
              <NavLink href="#">개인정보취급방침</NavLink>
            </NarrowNavCell>
            <NarrowNavCell>
              <NavLink href="#">이용약관</NavLink>
            </NarrowNavCell>
            <NavCell></NavCell>
            <NavCell></NavCell>
          </TableRow1>

          {/* 2행: 고객센터, 빈 열, 빈 열, 상호명, 주식회사 설연 */}
          <TableRow>
            <LeftCell>
              <LeftText>고객센터</LeftText>
            </LeftCell>
            <LeftCell></LeftCell>
            <LeftCell></LeftCell>
            <RightCell>
              <RightLabel>상호명</RightLabel>
            </RightCell>
            <RightCell>
              <RightValue>주식회사 설연</RightValue>
            </RightCell>
          </TableRow>

          {/* 3행: 빈 열, 빈 열, 빈 열, 대표자명, 이상은 */}
          <TableRow>
            <LeftCell></LeftCell>
            <LeftCell></LeftCell>
            <LeftCell></LeftCell>
            <RightCell>
              <RightLabel>대표자명</RightLabel>
            </RightCell>
            <RightCell>
              <RightValue>이상은</RightValue>
            </RightCell>
          </TableRow>

          {/* 4행: 빈 열, 빈 열, 빈 열, 사업자등록번호, 841-86-03339 */}
          <TableRow>
            <LeftCell></LeftCell>
            <LeftCell></LeftCell>
            <LeftCell></LeftCell>
            <RightCell>
              <RightLabel>사업자등록번호</RightLabel>
            </RightCell>
            <RightCell>
              <RightValue>841-86-03339</RightValue>
            </RightCell>
          </TableRow>

          {/* 5행: 전화, 빈 열, 빈 열, 통신판매업신고번호, 2023-0000-1111 */}
          <TableRow>
            <LeftCell>
              <LeftText>전화</LeftText>
            </LeftCell>
            <LeftCell></LeftCell>
            <LeftCell></LeftCell>
            <RightCell>
              <RightLabel>통신판매업신고번호</RightLabel>
            </RightCell>
            <RightCell>
              <RightValue>2023-0000-1111</RightValue>
            </RightCell>
          </TableRow>

          {/* 6행: 이메일, 빈 열, 빈 열, 사업장주소, 서울시 00구 0000 */}
          <TableRow>
            <LeftCell>
              <LeftText>이메일</LeftText>
            </LeftCell>
            <LeftCell></LeftCell>
            <LeftCell></LeftCell>
            <RightCell>
              <RightLabel>사업장주소</RightLabel>
            </RightCell>
            <RightCell>
              <RightValue>서울시 00구 0000</RightValue>
            </RightCell>
          </TableRow>

          {/* 7행: 민원접수, 빈 열, 빈 열, 유선전화번호, 010-9562-2930 */}
          <TableRow>
            <LeftCell>
              <LeftText>민원접수</LeftText>
            </LeftCell>
            <LeftCell></LeftCell>
            <LeftCell></LeftCell>
            <RightCell>
              <RightLabel>전화번호</RightLabel>
            </RightCell>
            <RightCell>
              <RightValue>010-8288-2671</RightValue>
            </RightCell>
          </TableRow>
        </tbody>
      </MainTable>
    </MainWrapper>
  );
}

export default PayHome;

