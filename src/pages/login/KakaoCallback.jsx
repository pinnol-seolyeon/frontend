import {useEffect} from "react";

//Redirect된 /oauth/callback/kakao 페이지에서 code 추출 + 백엔드 전송 
const KakaoCallback=()=>{
    // useEffect(()=>{
        const code=new URL(window.location.href).searchParams.get("code");
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/oauth/kakao`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ code })
        });

        //  .then(res=>res.json())
        //  .then(data=>{
        //     console.log("JWT:",data.token);
        //     localStorage.setItem("token",data.token)
        //  });
        
    // },[]);
}

export default KakaoCallback;