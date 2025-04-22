import styled from "styled-components";
import logo from '../assets/finnol-logo.png';
import login from "../assets/login.png";

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
    return(
        <Wrapper>
            <Image src={logo} alt="샘플" />
            <KakaoLoginImg 
            src={login} 
            alt="카카오로 로그인"
            onClick={()=>{
                //로그인 로직 실행
            }}
            ></KakaoLoginImg>
        </Wrapper>
    );
}

export default Login;