import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';

const Wrapper = styled.div`
    background-color: #ffffff;
    margin: 0;
    padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const MainWrapper = styled.div` 
  flex: 1;
  min-height: calc(100vh - var(--header-height, 70px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;


const Mypage_main = ({user, login, setLogin}) => {
    return (
        <Wrapper>
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin}/>
                <MainWrapper>
                    
                </MainWrapper>
            </ContentWrapper>

        </Wrapper>
    )
}

export default Mypage_main;