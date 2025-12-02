import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Redirect된 /oauth/callback/kakao 페이지에서 code 추출 + 백엔드 전송 
const KakaoCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        
        if (!code) {
            console.error("❌ 카카오 인증 코드가 없습니다.");
            alert("카카오 로그인에 실패했습니다.");
            navigate("/login");
            return;
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/oauth/kakao`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // 쿠키 전송을 위해 추가
            body: JSON.stringify({ code })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`카카오 로그인 실패: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("✅ 카카오 로그인 성공:", data);
                // 로그인 성공 후 메인 페이지 또는 callback 페이지로 이동
                navigate("/callback");
            })
            .catch(err => {
                console.error("❌ 카카오 로그인 에러:", err);
                alert("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
                navigate("/login");
            });
    }, [navigate]);

    return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoCallback;