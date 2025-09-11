import styled from "styled-components";
import logo from '../../assets/finnol-logo.png';
import kakaologin from "../../assets/kakaologin.png";
import login from "../../assets/login.png";

const Wrapper=styled.div`
    width:100vw;
    height:100vh;
    background-color: #F0F4FC;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;0vw


`;

const Image=styled.img`
    width:80%; 
    height:auto;
    object-fit:contain;
    max-width:300px;
`


const KakaoLoginImg=styled.img`
    width:400px;
    height:auto;
    cursor:pointer;
    trasnsition:transform 0.2s;

    &:hover{
        transform:scale(1.02);
    }

`;

const Logo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`

const LogoContainer = styled.div`
  width: 6rem;
  height: 6rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const Title = styled.div`
  font-size: 50px;
  font-weight: 700;
  color: #4A91FE;
  margin-bottom: 0.5rem;
`

const Content = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 2rem;
`

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  width: 35rem;
  padding: 3rem 0;
  border-radius: 20px;
  box-shadow: 4px 4px 10px 0px rgba(153, 175, 203, 0.5);
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
const Footer = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  margin-top: 2rem;
`

function Login(){
  console.log(process.env.REACT_APP_API_BASE_URL);

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
      
      const kakaoURL = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI)}`;
      console.log('🔍 Full Kakao URL:', kakaoURL);
      
      window.location.href = kakaoURL;
  };

  const getData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/my`, {
        method: "GET",
        credentials: "include"
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error("로그인되지 않았습니다.");
        }
        return res.json(); // .json() 추가!
    })
    .then((data) => {
        console.log('🔍 API Response:', data); // 디버깅용
        alert(`✅ 로그인 성공! 닉네임: ${data.userName || data.name || data.nickname || "Unknown"}`);
    })
    .catch((error) => {
        alert("❌ 로그인 상태가 아닙니다. 다시 로그인해주세요.");
        console.error(error);
    });
};
      

    return(
        <Wrapper>
          <Logo>
            <LogoContainer>
              <Image src={logo} alt="샘플" />
            </LogoContainer>
          </Logo>
          <Title>핀놀 FINNOL</Title>
          <Content>금융을 놀이터에서 노는 것처럼 즐겁게!</Content>

          <LoginWrapper>
            <LoginText>로그인</LoginText>
            <LoginContent>{`카카오톡 계정으로 간편하게 로그인하고
            재미있는 금융 교육을 시작해보세요! 🎉`}</LoginContent>
            <KakaoLoginImg 
              src={kakaologin} 
              alt="카카오로 로그인"
              onClick={() => {
                  console.log("이미지 클릭됨 ✅");
                  redirectToKakao();
              }}
            />
          </LoginWrapper>

          <Footer>AI 튜터와 함께하는 대화형 학습으로 실생활 금융 개념을 자연스럽게 배워보세요! 😸</Footer>

          {/* <button onClick={getData}>로그인 테스트</button> */}
        </Wrapper>
    );
}

export default Login;