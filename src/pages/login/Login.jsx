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
        console.log("i");

        console.log(process.env.REACT_APP_KAKAO_REST_API_KEY);
        console.log(process.env.REACT_APP_KAKAO_REDIRECT_URI);

        const REST_API_KEY=process.env.REACT_APP_KAKAO_REST_API_KEY;
        const REDIRECT_URL='http://localhost:3000/callback';
        const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URL}&response_type=code`

        


        window.location.href=kakaoURL;
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
        </Wrapper>
    );
}

export default Login;