import styled from 'styled-components';
import finnolLogo from '../assets/finnol-logo.png';
import { useNavigate } from 'react-router-dom';
import userimg from '../assets/user.svg';
import point from '../assets/point_img.svg';
import logoutimg from '../assets/logout.svg';
import homeimg from '../assets/home.svg';
import studyimg from '../assets/study.svg';
import analyzeimg from '../assets/analysis.svg';
import reviewimg from '../assets/review.svg';
import statusimg from '../assets/status.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background: #F0F4FC;
  min-height: 100vh;
  width: 20vw;
  min-width: 15rem;
  max-width: 20rem;
  padding: 1rem 1.5rem;
  flex-shrink: 0;
  
  /* 태블릿 크기에서 조정 */
  @media (max-width: 1024px) {
    width: 18vw;
    min-width: 14rem;
    max-width: 18rem;
    padding: 1rem 1.2rem;
  }
  
  /* 모바일에서 숨김 */
  @media (max-width: 768px) {
    display: none;
  }
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  position: relative;
`;

const LogoImage = styled.img`
  width: 6rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 50%;
  left: 7rem;
  transform: translateY(-50%);
  background-color: #333;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -4px;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: #333;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  
  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;


const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 3.1rem;
  height: 3.1rem;
  background-color: #D6EAFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #191919;
`;

const UserParent = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #4C4C4C;
`;

const PointSection = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 25px;
  padding: 0.8rem 1rem;
  margin-bottom: 2rem;
  justify-content: space-between;
`;

const PointTextWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const PointIcon = styled.img`
  width: 1.1rem;
  height: 1.1rem;
`;

const PointText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #478CEE;
`;

const PointValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #478CEE;
  align-items: flex-end;
`;

const NavigationMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const MenuIcon = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? 'white' : '#79B0FF'};
  background-color: ${props => props.active ? '#478CEE' : 'transparent'};
  
  &:hover {
    background-color: #478CEE;
    color: white;
  }
  
  ${props => props.active && `
    ${MenuIcon} img {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
    }
  `}
  
  &:hover ${MenuIcon} img {
    filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
  }
`;

const MenuText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const BottomSection = styled.div`
  width: 100%;
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ABCEFF;
  
  &:hover {
    color: #ABCEFF;
  }
`;

const LogoutIcon = styled.img`
  width: 1.2rem;
  height: 1.2rem;
`;

const LogoutText = styled.div`
  font-size: 16px;
  font-weight: 300;
`;


function Sidebar({ login, text, setLogin, userProgress, user, pageInfo }) {
    const navigate = useNavigate();

    const logout = () => {
      setLogin(false);
      navigate('/login');
    };

    const menuItems = [
      { id: 'home', icon: homeimg, text: '홈', path: '/main' },
      { id: 'study', icon: studyimg, text: '학습하기', path: '/book' },
      { id: 'analysis', icon: analyzeimg, text: '학습분석', path: '/dashboard' },
      { id: 'review', icon: reviewimg, text: '복습하기', path: '/review' },
      { id: 'status', icon: statusimg, text: '학습현황', path: '/status' }
    ];

    const handleMenuClick = (path) => {
      navigate(path);
    };

    const handleLogoClick = () => {
      navigate('/main');
    };

    const isActive = (path) => {
      const currentPath = window.location.pathname;
      if (path === '/main') {
        return currentPath === '/main' || currentPath === '/';
      }
      return currentPath === path;
    };
  
    return (
      <Wrapper>
        <TopSection>
          <LogoSection>
            <LogoContainer>
              <LogoImage 
                src={finnolLogo} 
                alt="FINNOL" 
                onClick={handleLogoClick}
              />
              <Tooltip>핀놀 메인화면으로 돌아갑니다</Tooltip>
            </LogoContainer>
          </LogoSection>

          <UserSection>
            <UserProfile>
              <UserAvatar>
                <img src={userimg} alt="userimg" style={{ width: '24px', height: '24px' }} />
              </UserAvatar>
              <UserInfo>
                <UserName>{user?.childName || '홍길동'}</UserName>
                <UserParent>부모님: 김엄마</UserParent>
              </UserInfo>
            </UserProfile>
          </UserSection>

          <PointSection>
            <PointTextWrapper>
              <PointIcon src={point} alt="Points" />
              <PointText>포인트</PointText>
            </PointTextWrapper>
            <PointValue>{(user?.coin || 12500).toLocaleString()}</PointValue>
          </PointSection>

          <NavigationMenu>
            {menuItems.map((item) => (
              <MenuItem 
                key={item.id} 
                active={isActive(item.path)}
                onClick={() => handleMenuClick(item.path)}
              >
                  <MenuIcon><img src={item.icon} alt={item.text} /></MenuIcon>
                <MenuText>{item.text}</MenuText>
              </MenuItem>
            ))}
          </NavigationMenu>
        </TopSection>

        <BottomSection>
          <LogoutButton onClick={logout}>
            <LogoutIcon src={logoutimg} alt="Logout" />
            <LogoutText>로그아웃</LogoutText>
          </LogoutButton>
        </BottomSection>
      </Wrapper>
    );
  }
  
  export default Sidebar;