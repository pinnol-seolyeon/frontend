import styled from 'styled-components';
import finnolLogo from '../assets/finnol-logo.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import userimg from '../assets/user.svg';
import point from '../assets/point_img.svg';
import logoutimg from '../assets/logout.svg';
import homeimg from '../assets/home.svg';
import studyimg from '../assets/study.svg';
import analyzeimg from '../assets/analysis.svg';
import reviewimg from '../assets/review.svg';
import statusimg from '../assets/status.svg';
import sidebarOpened from '../assets/sidebar_opened.svg';
import sidebarClosed from '../assets/sidebar_closed.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background: #F0F4FC;
  min-height: 100vh;
  width: ${props => props.collapsed ? '4rem' : '20vw'};
  min-width: ${props => props.collapsed ? '4rem' : '15rem'};
  max-width: ${props => props.collapsed ? '4rem' : '20rem'};
  padding: ${props => props.collapsed ? '1rem 0.5rem' : '1rem 1.5rem'};
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  
  /* 모바일에서는 기본적으로 접힌 상태 */
  @media (max-width: 768px) {
    width: ${props => props.collapsed ? '4rem' : '100vw'};
    min-width: ${props => props.collapsed ? '4rem' : '100vw'};
    max-width: ${props => props.collapsed ? '4rem' : '100vw'};
    padding: ${props => props.collapsed ? '1rem 0.5rem' : '1rem 1.5rem'};
    position: ${props => props.collapsed ? 'relative' : 'fixed'};
    z-index: 1000;
  }
  
  /* 웹에서는 기본적으로 펼친 상태 */
  @media (min-width: 769px) {
    width: ${props => props.collapsed ? '4rem' : '20vw'};
    min-width: ${props => props.collapsed ? '4rem' : '15rem'};
    max-width: ${props => props.collapsed ? '4rem' : '20rem'};
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
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  gap: 0.75rem;
  margin-bottom: 2rem;
  position: relative;
  width: 100%;
`;

const LogoImage = styled.img`
  width: ${props => props.collapsed ? '2rem' : '6rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SidebarButton = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: ${props => props.collapsed ? 'absolute' : 'static'};
  right: ${props => props.collapsed ? '0.5rem' : 'auto'};
  top: ${props => props.collapsed ? '0.5rem' : 'auto'};
  
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
  display: ${props => props.collapsed ? 'none' : 'flex'};
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
  display: ${props => props.collapsed ? 'none' : 'flex'};
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
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  gap: 0.75rem;
  padding: ${props => props.collapsed ? '0.75rem 0' : '0.75rem 1rem'};
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
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const BottomSection = styled.div`
  width: 100%;
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  gap: 0.75rem;
  padding: ${props => props.collapsed ? '0.75rem 0' : '0.75rem 1rem'};
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
  display: ${props => props.collapsed ? 'none' : 'block'};
`;


function Sidebar({ login, text, setLogin, userProgress, user, pageInfo }) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    // 화면 크기에 따라 기본 상태 설정
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 768) {
          setCollapsed(true); // 모바일에서는 기본적으로 접힌 상태
        } else {
          setCollapsed(false); // 웹에서는 기본적으로 펼친 상태
        }
      };

      // 초기 설정
      handleResize();
      
      // 리사이즈 이벤트 리스너 추가
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
      setCollapsed(!collapsed);
    };

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
      <Wrapper collapsed={collapsed}>
        <TopSection>
          <LogoSection collapsed={collapsed}>
            <LogoContainer>
              <LogoImage 
                src={finnolLogo} 
                alt="FINNOL" 
                onClick={handleLogoClick}
                collapsed={collapsed}
              />
              <SidebarButton 
                src={collapsed ? sidebarOpened : sidebarClosed} 
                alt={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
                onClick={toggleSidebar}
                collapsed={collapsed}
              />
              <Tooltip>핀놀 메인화면으로 돌아갑니다</Tooltip>
            </LogoContainer>
          </LogoSection>

          <UserSection collapsed={collapsed}>
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

          <PointSection collapsed={collapsed}>
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
                collapsed={collapsed}
              >
                  <MenuIcon><img src={item.icon} alt={item.text} /></MenuIcon>
                <MenuText collapsed={collapsed}>{item.text}</MenuText>
              </MenuItem>
            ))}
          </NavigationMenu>
        </TopSection>

        <BottomSection>
          <LogoutButton onClick={logout} collapsed={collapsed}>
            <LogoutIcon src={logoutimg} alt="Logout" />
            <LogoutText collapsed={collapsed}>로그아웃</LogoutText>
          </LogoutButton>
        </BottomSection>
      </Wrapper>
    );
  }
  
  export default Sidebar;