import styled from 'styled-components';

export const MainLayout = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5;
`;

export const MainHeader = styled.header`
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const FinnolLogo = styled.img`
  height: 40px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const HeaderTitle = styled.h1`
  color: #1a73e8;
  margin: 0;
`;

export const ProgressInfo = styled.div`
  display: flex;
  gap: 2rem;
  color: #5f6368;
`;

export const UserStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const PointsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-radius: 20px;
  font-weight: bold;
`;

export const PointsIcon = styled.span`
  font-size: 1.2rem;
`;

export const PointsValue = styled.span`
  color: #1a73e8;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserEmail = styled.span`
  color: #666;
`;

export const LogoutButton = styled.button`
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

export const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const ContentArea = styled.section`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const NoDataMessage = styled.p`
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
  
    return (
      <MainHeader>
        <FinnolLogo
          src={finnolLogo}
          alt="FINNOL Logo"
          onClick={() => navigate('/main')}
          style={{ cursor: 'pointer' }}
        />
        <UserStatus>
          <PointsDisplay>
            <PointsIcon>💰</PointsIcon>
            <PointsValue>{userProgress?.points || 0} P</PointsValue>
          </PointsDisplay>
          <UserInfo>
            <UserEmail>{user?.email || 'ゲスト'}</UserEmail>
            {login && (
              <LogoutButton onClick={logout}>
                로그아웃
              </LogoutButton>
            )}
          </UserInfo>
        </UserStatus>
      </MainHeader>
    );
  }
  
  export default Header;