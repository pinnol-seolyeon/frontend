import styled from 'styled-components';
import finnolLogo from '../assets/finnol-logo.png';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import userimg from '../assets/user.svg';
import point from '../assets/point.svg';
import logoutimg from '../assets/logout.svg';

const ContentArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

const MainHeader = styled.header`
  background: #ffffff;
  padding: 0.8rem 1.5rem; /*상하 좌우*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 0.3rem 1rem;
    min-height: 50px;
  }
  
  @media (max-width: 480px) {
    padding: 0.2rem 0.5rem;
    min-height: 45px;
  }

`;

const Image=styled.img`
    width:80%; 
    height:auto;
    object-fit:contain;
`

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
`

const Logo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
  width: 8rem;
`

const LogoContainer = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const LogoTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
  position: relative;
  cursor: pointer;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }


`

const LogoTitleTooltip = styled.div`
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1001;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid rgba(0, 0, 0, 0.9);
  }
  
  ${Logo}:hover & {
    opacity: 1;
    visibility: visible;
  }
`


const UserInfo = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    align-items: center;
    gap: 0.3rem;
  }
`;

const UserImgWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    gap: 0.3rem;
  }
`

const UserName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`

const UserImg = styled.img`
`

const UserText = styled.div`  
  font-size: 13px;
  font-weight: 300;
  color: white;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 10px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
  }
`

const PointWraper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #F0F4FC;
  border-radius: 37.5px;
  padding: 0.5rem 0.8rem;
  min-width: fit-content;
  width: auto;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: 0.4rem 0.6rem;
    gap: 0.3rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem;
    gap: 0.2rem;
  }
`

const PointValue = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #4A91FE;
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`

const FinnolLogo = styled.img`
  height: 40px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const HeaderTitle = styled.h1`
  color: #1a73e8;
  margin: 0;
`;

const ProgressInfo = styled.div`
  display: flex;
  gap: 2rem;
  color: #5f6368;
`;

const UserStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const PointsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-weight: bold;
  color: white;
`;

const PointsIcon = styled.span`
  font-size: 1.2rem;
`;

const PointsValue = styled.span`
  color: #4A91FE;
`;


const UserEmail = styled.span`
  color: white;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f44336;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d32f2f;
  }
`;

const LogoutWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`

const LogoutImg = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`

const LogoutText = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: white;
  
  /* 모바일에서 숨김 */
  @media (max-width: 768px) {
    display: none;
  }
`

const Tooltip = styled.div`
  position: absolute;
  bottom: -40px;
  left: 20%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid rgba(0, 0, 0, 0.8);
  }
  
  ${Logo}:hover & {
    opacity: 1;
    visibility: visible;
  }
`

const PageInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  /* 모바일에서 숨김 */
  @media (max-width: 768px) {
    display: none;
  }
`;

const PageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const PageDisplay = styled.div`
  width: 1px;
  height: 2rem;
  background-color: #ffffff;
`;

const PageIcon = styled.div`
  font-size: 1.2rem;
`;

const PageText = styled.div`
  color: white;
  font-weight: 600;
  font-size: 20px;  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const PageSubText = styled.div`
  color: #ffffff;
  font-size: 13px;
  font-weight: 300;
  margin-top: 0.2rem;
`;

const LoginButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;


const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const NoDataMessage = styled.p`
  text-align: center;
  padding: 20px;
  color: var(--text-color);
  font-size: 1.1rem;
`;

function Header({ login, text, setLogin, userProgress, user, pageInfo }) {
    const navigate = useNavigate();
    const headerRef = useRef(null);

    const logout = () => {
      setLogin(false);
      navigate('/login');
    };

    // Header 높이를 동적으로 측정하고 CSS 변수 업데이트
    useEffect(() => {
      const updateHeaderHeight = () => {
        if (headerRef.current) {
          const headerHeight = headerRef.current.offsetHeight;
          document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
          console.log('Header height updated:', headerHeight);
        }
      };

      // 초기 높이 설정
      updateHeaderHeight();
      // 리사이즈 이벤트 리스너 추가 (모바일 회전 등 대응)
      window.addEventListener('resize', updateHeaderHeight);
      window.addEventListener('orientationchange', updateHeaderHeight);

      return () => {
        window.removeEventListener('resize', updateHeaderHeight);
        window.removeEventListener('orientationchange', updateHeaderHeight);

      };
    }, [pageInfo]); // pageInfo가 변경될 때마다 높이 재측정

    console.log(user?.childName);
  
    return (
      <MainHeader ref={headerRef}>
        <LeftArea>
          <Logo onClick={()=>navigate('/')}>
              <Image src={finnolLogo} alt="FINNOL Logo" />
              <LogoTitleTooltip>핀놀 메인 화면으로 돌아갑니다</LogoTitleTooltip>
          </Logo>
            {/* 페이지 정보 표시 (데이터가 있을 때만) */}
            {pageInfo && (
              <PageInfoContainer>
                <PageInfo>
                  <PageDisplay />
                  <div>
                    <PageText>{pageInfo.title}</PageText>
                    {pageInfo.subtitle && <PageSubText>{pageInfo.subtitle}</PageSubText>}
                  </div>
                </PageInfo>
              </PageInfoContainer>
            )}
          
        </LeftArea>        
        {/* <UserStatus>
          <PointsDisplay>
            <PointsIcon>💰</PointsIcon>
            <PointsValue>{user?.coin || 0} P</PointsValue>
          </PointsDisplay>
          <UserInfo>
            <UserEmail>{user?.childName}</UserEmail>
            {login ? (
              <LogoutButton onClick={logout}>
                로그아웃
              </LogoutButton>
            ):(
              <LoginButton onClick={()=>navigate('/login')}>
                로그인
              </LoginButton>
            )}
          </UserInfo>
        </UserStatus> */}
      </MainHeader>
    );
  }
  
  export default Header;