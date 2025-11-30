import styled, { createGlobalStyle } from 'styled-components';
import readybackgroundImg from '../../assets/game3/Ready_Background.png';
import quizimg from '../../assets/game3/Quiz_Box_Closed.png';
import coinImg from '../../assets/game3/Coin.png';
import KNPSOdaesanFont from '../../assets/game3/KNPSOdaesan.otf';
import ReadyButton from '../../assets/game3/Ready_Btn_GameStart.png';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import lobbyBgmSrc from '../../assets/game3/game3_lobby_BGM.wav';
import hoverSoundSrc from '../../assets/game3/game3_game_start_Hover.wav';
import clickSoundSrc from '../../assets/game3/game3_click.wav';

const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: 'KNPSOdaesan';
    src: url(${KNPSOdaesanFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: url(${readybackgroundImg});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`;

const TitleText = styled.div`
    font-family: 'KNPSOdaesan', sans-serif !important;
    font-size: 48px;
    font-weight: 700;
    color: #FFFFFF;
    text-align: center;
`;

const ContentText = styled.div`
    font-family: 'KNPSOdaesan', sans-serif !important;
    font-size: 24px;
    font-weight: 700;
    color: #FFFFFF;
    text-align: center;
    white-space: pre-line;
`;


const DescribeWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 50vw;
`;

const DescribeItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const DescribeItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 48%;
`;

const DescribeText = styled.div`
    font-family: 'KNPSOdaesan', sans-serif !important;
    font-size: 24px;
    font-weight: 700;
    color: #FFFFFF;
    text-align: center;
`;

const QuizImage = styled.img`
    object-fit: contain;
`;

const CoinImage = styled.img`
    width: 50%;
    height: 50%;
    object-fit: contain;
`;

const DescribeTextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`;

const StartButton = styled.button`
    background-image: url(${ReadyButton});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    width: 50vw;
    height: 90px;
    border: none;
    cursor: pointer;
    margin-top: 2rem;

    &:hover {
        transform: scale(1.05);
        transition: transform 0.3s ease;
    }
`;

const Game3Ready = () => {
    const navigate = useNavigate();
    const lobbyBgmRef = useRef(null);
    const hoverSoundRef = useRef(null);
    const clickSoundRef = useRef(null);

    useEffect(() => {
        // 사운드 파일들 미리 로드
        lobbyBgmRef.current = new Audio(lobbyBgmSrc);
        lobbyBgmRef.current.volume = 0.5;
        lobbyBgmRef.current.loop = true;
        lobbyBgmRef.current.preload = 'auto';
        
        hoverSoundRef.current = new Audio(hoverSoundSrc);
        hoverSoundRef.current.volume = 0.7;
        hoverSoundRef.current.preload = 'auto';
        
        clickSoundRef.current = new Audio(clickSoundSrc);
        clickSoundRef.current.volume = 0.7;
        clickSoundRef.current.preload = 'auto';

        // lobby BGM 재생 시도
        const tryPlayBGM = () => {
            if (lobbyBgmRef.current) {
                lobbyBgmRef.current.play().catch(err => {
                    console.warn("🎵 Lobby BGM 자동재생 실패:", err);
                });
            }
        };

        // 약간의 지연 후 재생 시도
        const timer = setTimeout(tryPlayBGM, 100);

        return () => {
            clearTimeout(timer);
            if (lobbyBgmRef.current) {
                lobbyBgmRef.current.pause();
                lobbyBgmRef.current.currentTime = 0;
            }
        };
    }, []);

    return (
        <Wrapper>
            <GlobalFonts />
            <TitleText>신비의 서랍장</TitleText>
            <ContentText>{`같은 물건 3개를 모아 서랍장을 정리하세요.\n정리가 힘들 때는 서랍 밑 선반을 활용하세요!`}</ContentText>

            <DescribeWrapper>
                <DescribeItemWrapper>
                    <DescribeTextWrapper>
                        <QuizImage src={quizimg} alt="quiz box" />
                        <DescribeText>퀴즈 박스</DescribeText>
                    </DescribeTextWrapper>
                </DescribeItemWrapper>
                <DescribeItemWrapper>
                    <DescribeTextWrapper>
                        <CoinImage src={coinImg} alt="coin" />
                        <DescribeText>+10</DescribeText>
                    </DescribeTextWrapper>
                </DescribeItemWrapper>
            </DescribeWrapper>

            <StartButton 
                src={ReadyButton} 
                alt="ready button" 
                onClick={() => {
                    // 버튼 click 시 사운드 재생
                    if (clickSoundRef.current) {
                        clickSoundRef.current.currentTime = 0;
                        clickSoundRef.current.play().catch(err => {
                            console.warn('클릭 사운드 재생 실패:', err);
                        });
                    }
                    navigate('/game3');
                }}
                onMouseEnter={() => {
                    // 버튼 hover 시 사운드 재생
                    if (hoverSoundRef.current) {
                        hoverSoundRef.current.currentTime = 0;
                        hoverSoundRef.current.play().catch(err => {
                            console.warn('hover 사운드 재생 실패:', err);
                        });
                    }
                }}
            />
        </Wrapper>
    )
}

export default Game3Ready;