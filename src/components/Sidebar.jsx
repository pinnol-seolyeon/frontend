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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 20vw;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  display: ${props => props.show ? 'block' : 'none'};
  
  /* 모바일에서는 펼친 사이드바 너비부터 시작 */
  @media (max-width: 768px) {
    left: 80vw;
  }
`;

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
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 모바일에서는 기본적으로 접힌 상태 */
  @media (max-width: 768px) {
    width: ${props => props.collapsed ? '4rem' : '80vw'};
    min-width: ${props => props.collapsed ? '4rem' : '80vw'};
    max-width: ${props => props.collapsed ? '4rem' : '80vw'};
    padding: ${props => props.collapsed ? '1rem 0.5rem' : '1rem 1.5rem'};
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
  justify-content: ${props => props.collapsed ? 'flex-start' : 'flex-start'};
  gap: 0.75rem;
  margin-bottom: 1rem;
  position: relative;
  width: 100%;
  min-height: 3rem;
`;

const LogoImage = styled.img`
  width: ${props => props.collapsed ? '0rem' : '6rem'};
  opacity: ${props => props.collapsed ? '0' : '1'};
  visibility: ${props => props.collapsed ? 'hidden' : 'visible'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: ${props => props.collapsed ? '0' : '0.8'};
  }
`;

const SidebarButtonArea = styled.div`
  position: absolute;
  right: ${props => props.collapsed ? 'auto' : '0'};
  left: ${props => props.collapsed ? '0' : 'auto'};
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: ${props => props.collapsed ? '0 10px 10px 0' : '10px 0 0 10px'};
  z-index: 10;
  margin-right: ${props => props.collapsed ? '0' : '-1.5rem'};
  margin-left: ${props => props.collapsed ? '-0.5rem' : '0'};
`;

const SidebarButton = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 70%;
  left: 90%;
  transform: translateX(-50%);
  margin-top: 20%;
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
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-bottom-color: #333;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  
  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const LinebarSection = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.collapsed? 'calc(100% + 2rem)' : 'calc(100% + 3rem)'}; /* padding 좌우 1.5rem씩 총 3rem을 추가 */
  height: 1px;
  background-color: #D6EAFF;
  margin: 0 -1.5rem 2rem -1.5rem; 
`;

const BottomLinebarSection = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.collapsed? 'calc(100% + 2rem)' : 'calc(100% + 3rem)'}; /* padding 좌우 1.5rem씩 총 3rem을 추가 */
  height: 1px;
  background-color: #D6EAFF;
  margin: 0 -1.5rem 0.5rem -1.5rem; /* margin-bottom 제거 */
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
  color: #2D7BED;
  font-size: 20px;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: ${props => props.collapsed ? 'none' : 'flex'};
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
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const PointValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #478CEE;
  align-items: flex-end;
  display: ${props => props.collapsed ? 'none' : 'block'};
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


function Sidebar({ login, text, setLogin, userProgress, user, pageInfo, defaultCollapsed = false }) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const isUserReady = !!user;
    
    // 현재 페이지가 학습 페이지인지 확인
    const isStudyPage = () => {
      const currentPath = window.location.pathname;
      return currentPath.includes('/study') || currentPath.includes('/book/chapter');
    };

    // 화면 크기와 현재 페이지에 따라 기본 상태 설정
    useEffect(() => {
      const handleResize = () => {
        const currentPath = window.location.pathname;
        const isStudyPage = currentPath.includes('/study') || currentPath.includes('/book/chapter');
        
        if (window.innerWidth <= 768) {
          setCollapsed(true); // 모바일에서는 기본적으로 접힌 상태
        } else {
          // 웹에서는 학습하기 페이지면 접힌 상태, 다른 페이지면 펼친 상태
          setCollapsed(isStudyPage);
        }
      };

      // 초기 설정
      handleResize();
      
      // 리사이즈 이벤트 리스너 추가
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 경로 변경 시 사이드바 상태 업데이트
    useEffect(() => {
      const currentPath = window.location.pathname;
      const isStudyPage = currentPath.includes('/study') || currentPath.includes('/book/chapter');
      
      if (window.innerWidth > 768) {
        setCollapsed(isStudyPage);
      }
    }, [window.location.pathname]);

    const toggleSidebar = () => {
      setCollapsed(!collapsed);
    };

    const logout = () => {
      setLogin(false);
      navigate('/login');
    };

    const menuItems = [
      { id: 'home', icon: homeimg, text: '홈', path: '/main' },
      { id: 'study', icon: studyimg, text: '학습하기', path: ['/book', '/study'] },
      { id: 'analysis', icon: analyzeimg, text: '학습분석', path: '/dashboard' },
      { id: 'review', icon: reviewimg, text: '복습하기', path: '/review' },
      { id: 'status', icon: statusimg, text: '학습현황', path: '/status' }
    ];

    const handleMenuClick = (path) => {
      // path가 배열인 경우 첫 번째 경로로 이동
      const targetPath = Array.isArray(path) ? path[0] : path;
      navigate(targetPath);
    };

    const handleLogoClick = () => {
      navigate('/main');
    };

    const isActive = (path) => {
      const currentPath = window.location.pathname;
      
      // path가 배열인 경우 (학습하기 메뉴)
      if (Array.isArray(path)) {
        return path.some(p => {
          if (p === '/study') {
            // /study로 시작하는 모든 경로를 학습하기로 인식
            return currentPath.startsWith('/study');
          }
          if (p === '/book') {
            return currentPath.startsWith('/book');
          }
          return currentPath === p;
        });
      }
      
      // 일반적인 경로 처리
      if (path === '/main') {
        return currentPath === '/main' || currentPath === '/';
      }
      return currentPath === path;
    };
  
    return (
      <>
        <Wrapper collapsed={collapsed} isStudyPage={isStudyPage()}>
          <TopSection>
          <LogoSection collapsed={collapsed}>
            <LogoContainer>
              <LogoImage 
                src={finnolLogo} 
                alt="FINNOL" 
                onClick={handleLogoClick}
                collapsed={collapsed}
              />
              <Tooltip>핀놀 메인화면으로 돌아갑니다</Tooltip>
            </LogoContainer>

            <SidebarButtonArea collapsed={collapsed} onClick={toggleSidebar}>
                <SidebarButton 
                  src={collapsed ? sidebarClosed : sidebarOpened} 
                  alt={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
                />
            </SidebarButtonArea>

          </LogoSection>

          <LinebarSection collapsed={collapsed}></LinebarSection>

          {isUserReady && (
          <UserSection collapsed={collapsed}>
            <UserProfile>
              <UserAvatar>
                {user?.name?.[0] || ''}
              </UserAvatar>
              <UserInfo collapsed={collapsed}>
                <UserName>{user?.name || '홍길동'}</UserName>
                <UserParent>부모님: 김엄마</UserParent>
              </UserInfo>
            </UserProfile>
          </UserSection>
          )}

            {isUserReady && (
            <PointSection collapsed={collapsed}>
              <PointTextWrapper>
                <PointIcon src={point} alt="Points" />
                <PointText collapsed={collapsed}>포인트</PointText>
              </PointTextWrapper>
              <PointValue collapsed={collapsed}>{(user?.coin ?? 0).toLocaleString()}</PointValue>
            </PointSection>
            )}

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
            <BottomLinebarSection collapsed={collapsed}></BottomLinebarSection>

            <LogoutButton onClick={logout} collapsed={collapsed}>
            <LogoutIcon src={logoutimg} alt="Logout" />
            <LogoutText collapsed={collapsed}>로그아웃</LogoutText>
          </LogoutButton>
        </BottomSection>
        </Wrapper>
      </>
    );
  }
  
  export default Sidebar;