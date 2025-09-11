import styled from 'styled-components';
import finnolLogo from '../assets/finnol-logo.png';
import { useNavigate } from 'react-router-dom';
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
  background: linear-gradient(to right, #A7CEFF 0%, #4A91FE 100%);
  padding: 0.5rem 10rem; /*상하 좌우*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
  
  /* CSS 변수로 Header 높이 설정 */
  --header-height: 70px;
`;

const Image=styled.img`
    width:80%; 
    height:auto;
    object-fit:contain;
`


const Logo = styled.div`
  width: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
  
  &:hover {
    opacity: 0.8;
  }
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
`


const UserInfo = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

const UserImgWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const UserName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
`

const UserImg = styled.img`
`

const UserText = styled.div`  
  font-size: 13px;
  font-weight: 300;
  color: white;
`

const PointWraper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #F0F4FC;
  border-radius: 37.5px;
  padding: 0.5rem 1rem;
`

const PointValue = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #4A91FE;
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
`

const Tooltip = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
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

function Header({ login, text, setLogin, userProgress, user }) {
    const navigate = useNavigate();

    const logout = () => {
      setLogin(false);
      navigate('/login');
    };

    console.log(user?.childName);
  
    return (
      <MainHeader>
        <Logo onClick={()=>navigate('/')}>
          <LogoContainer>
            <Image src={finnolLogo} alt="FINNOL Logo" />
          </LogoContainer>
          <LogoTitle>FINNOL</LogoTitle>
          <Tooltip>핀놀 메인 화면으로 돌아갑니다</Tooltip>
        </Logo>
        <ContentArea>
          <UserInfo>
            <UserImgWrapper>
              <UserImg src={userimg}/>
              <UserName>{user?.childName} 어린이</UserName>
            </UserImgWrapper>
            <UserText>4학년 • 엄마/아빠: 김엄마</UserText>
          </UserInfo>
          <PointWraper>
            <Image src={point}/>
            <PointValue>{user?.coin || 0}P</PointValue>
          </PointWraper>
          <LogoutWrapper onClick={logout}>
            <LogoutImg src={logoutimg} onClick={logout}/>
            <LogoutText>로그아웃</LogoutText>
          </LogoutWrapper>
        </ContentArea>
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