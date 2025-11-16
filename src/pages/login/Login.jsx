import styled from "styled-components";
import { useEffect, useState } from "react";
import logo from '../../assets/finnol-logo.png';
import kakaologin from "../../assets/kakaologin.png";
import hopin from "../../assets/hopin.svg";

// 메인페이지 이미지 미리 로드
import Book from '../../assets/book.svg';
import Graph from '../../assets/graph.svg';
import Pencil from '../../assets/pencil.svg';
import CircleGraph from '../../assets/circle_graph.svg';

const Wrapper=styled.div`
    width:100vw;
    height:100vh;
    background: linear-gradient(to top, #AED2FF, #EFF6FF);
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    
    /* 모바일에서는 세로 레이아웃 */
    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
  height: 100vh;
  padding: 2rem;
  position: relative;
  
  /* 반응형 디자인 */
  @media (max-width: 1200px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 768px) {
    width: 50%;
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    height: 50vh;
    padding: 1rem;
  }
`

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.6);
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    width: 50%;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    height: 50vh;
  }
`

const HopinImg = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  max-width: 25rem;
  height: auto;
  object-fit: contain;
`

const Image=styled.img`
    width: 8rem; 
    height: auto;
    object-fit: contain;
    margin-top: 0;

    
    @media (max-width: 768px) {
        width: 3rem;
    }
    
    @media (max-width: 480px) {
        width: 2.5rem;
    }
`


const KakaoLoginImg=styled.img`
    width:80%;
    height:auto;
    cursor:pointer;
    trasnsition:transform 0.2s;

    &:hover{
        transform:scale(1.02);
    }

`;

const Logo = styled.div`
  position: absolute;
  top: 4rem;
  left: 2rem;
  z-index: 10;
  
  /* 반응형 디자인 */
  @media (max-width: 1200px) {
    top: 3rem;
    left: 1.5rem;
  }
  
  @media (max-width: 768px) {
    top: 2.5rem;
    left: 1rem;
  }
  
  @media (max-width: 480px) {
    top: 2rem;
    left: 1rem;
  }
`


const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  width: 60%;
  padding: 3rem 0;
  border-radius: 5px;
  text-align: center;
  // box-shadow: 4px 4px 10px 0px rgba(153, 175, 203, 0.5);
`
  
const LoginText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
`
  
const LoginContent = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: #333333;
  white-space: pre-line;
  margin-bottom: 2rem;
`

const MobileBlockOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
  text-align: center;
`;

const BlockTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #191919;
  margin-bottom: 1rem;
`;

const BlockMessage = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #666666;
  line-height: 1.6;
  white-space: pre-line;
`;

const BlockIcon = styled.div`
  font-size: 80px;
  margin-bottom: 2rem;
`;

function Login(){
  console.log(process.env.REACT_APP_API_BASE_URL);
  
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 환경 감지
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      // 768px 미만은 모바일로 간주 (태블릿은 768px 이상)
      const isMobileDevice = width < 768;
      setIsMobile(isMobileDevice);
      
      console.log('📱 디바이스 체크:', {
        width,
        isMobile: isMobileDevice
      });
    };
    
    // 초기 체크
    checkMobile();
    
    // 화면 크기 변경 시 재체크
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 메인페이지 이미지 미리 로드
  useEffect(() => {
    const preloadMainImages = () => {
      const images = [Book, Graph, Pencil, CircleGraph];
      images.forEach(src => {
        const img = new window.Image();
        img.src = src;
      });
    };
    
    preloadMainImages();
  }, []);

    //로그인 버튼 클릭시 호출
    // const redirectToKakao=()=>{
    
    //     const kakaoURL = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/kakao`
    //     window.location.href=kakaoURL;
    // };   

    const redirectToKakao = () => {
      // 디버깅용 로그 추가
      console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
      console.log('🔍 현재 도메인:', window.location.hostname);
      console.log('🔍 API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
      console.log('🔍 REDIRECT_URI:', process.env.REACT_APP_KAKAO_REDIRECT_URI);
      
      // const kakaoURL = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI)}`;
      // const kakaoURL = `${process.env.REACT_APP_KAKAO_REDIRECT_URI}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI)}`;
      const kakaoURL = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/kakao`;
      
      console.log('🔍 Full Kakao URL:', kakaoURL);
      window.location.href = kakaoURL;
  };

      

    // 모바일 환경이면 차단 화면 표시
    if (isMobile) {
      return (
        <MobileBlockOverlay>
          <BlockIcon>📱</BlockIcon>
          <BlockTitle>모바일 환경은 지원하지 않습니다</BlockTitle>
          <BlockMessage>{`FINNOL은 태블릿 이상의 화면에서
최적화되어 있습니다.

태블릿, 노트북 또는 데스크톱에서
접속해주세요!`}</BlockMessage>
        </MobileBlockOverlay>
      );
    }

    return(
        <Wrapper>
          <LeftSection>
            <Logo>
                <Image src={logo} alt="FINNOL 로고" />
            </Logo>
            <HopinImg src={hopin} alt="호핀 캐릭터" />
          </LeftSection>

          <RightSection>
            <LoginWrapper>
              <LoginText>로그인</LoginText>
              <LoginContent>{`카카오톡 계정으로 간편하게 로그인하고
              재미있는 금융 교육을 시작해보세요!`}</LoginContent>
              <KakaoLoginImg 
                src={kakaologin} 
                alt="카카오로 로그인"
                onClick={() => {
                    console.log("이미지 클릭됨 ✅");
                    redirectToKakao();
                }}
              />
            </LoginWrapper>
          </RightSection>
        </Wrapper>
    );
}

export default Login;