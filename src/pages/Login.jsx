import styled from "styled-components";
import logo from '../assets/finnol-logo.png';

const Wrapper=styled.div`
    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

`;

const Image=styled.img`
    width:100%; 
    height:auto;
    object-fit:contain;
    max-width:300px;
`


const LoginButton = styled.button`
  width: 20%;
  height: 50px;

  padding: 1vw 2vw;
  margin: 2.5vw;
  font-size: clamp(10px, 2.5vw, 14px); /* 최소폰트크기,뷰포트 너비 기반 크기, 최대 폰트 */
  background-color: #F7E64C;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #F6B62E;
  }
`;


function Login(){
    return(
        <Wrapper>
            <Image src={logo} alt="샘플" />
            <LoginButton>카카오로 로그인</LoginButton>
            부모님의 계정으로 가입해주세요
        </Wrapper>
    );
}

export default Login;