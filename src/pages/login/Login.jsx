import styled from "styled-components";
import logo from '../../assets/finnol-logo.png';
import login from "../../assets/login.png";

const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    gap:30px;


`;

const Image=styled.img`
    width:100%; 
    height:auto;
    object-fit:contain;
    max-width:300px;
`


const KakaoLoginImg=styled.img`
    width:220px;
    height:auto;
    cursor:pointer;
    trasnsition:transform 0.2s;

    &:hover{
        transform:scale(1.02);
    }

`;


function Login(){

    //로그인 버튼 클릭시 호출
    const redirectToKakao=()=>{
        // console.log(process.env.REACT_APP_KAKAO_REST_API_KEY);
        // console.log(process.env.REACT_APP_KAKAO_REDIRECT_URI);

        // const REST_API_KEY=process.env.REACT_APP_KAKAO_REST_API_KEY;
        // const REDIRECT_URL='http://localhost:3000/callback';
        const kakaoURL = `http://localhost:8080/oauth2/authorization/kakao`
        
        


        window.location.href=kakaoURL;
    };   

    const getData = () => {
        fetch("http://localhost:8080/api/my", {
          method: "GET",
          credentials: "include" // 쿠키 기반 로그인 세션 유지
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("로그인되지 않았습니다.");
            }
            return res;
          })
          .then((data) => {
            // 로그인 성공 시 유저 정보 표시
            alert(`✅ 로그인 성공! 닉네임: ${data.properties?.nickname ?? "Unknown"}`);
          })
          .catch((error) => {
            alert("❌ 로그인 상태가 아닙니다. 다시 로그인해주세요.");
            console.error(error);
          });
      };
      

    return(
        <Wrapper>
            <Image src={logo} alt="샘플" />
            <KakaoLoginImg 
                src={login} 
                alt="카카오로 로그인"
                onClick={() => {
                    console.log("이미지 클릭됨 ✅");
                    redirectToKakao();
                }}
                />

            <button onClick={getData}>로그인 테스트</button>
        </Wrapper>
    );
}

export default Login;