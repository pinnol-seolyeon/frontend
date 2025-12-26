import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

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
  padding: 4rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  max-width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  max-width: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: flex-start;
  margin: 0 0 2rem 0 ;
`;

const TitleText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #056FB8;
  margin-bottom: 2rem;
`;

const TitleLine = styled.div`
    width: 100%;
    height: 0.5px;
    background-color: #676767;
    margin-bottom: 2rem;
`;



function PayLayout({user, login, setLogin}) {

    const navigate = useNavigate();

    return (
        <Wrapper>
            <ContentWrapper>
                <Sidebar user={user} login={login} setLogin={setLogin} />
                <MainWrapper>
                    <ContentContainer>
                        <Header>
                            <TitleText>FINNOL PAY</TitleText>
                            <TitleLine />
                        </Header>
                        <Outlet />
                    </ContentContainer>
                </MainWrapper>
            </ContentWrapper>
        </Wrapper>
    );

}

export default PayLayout;