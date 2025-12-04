import styled, { createGlobalStyle } from 'styled-components';
import { useEffect, useRef } from 'react';
import readybackgroundImg from '../../assets/game2/Ready_Background.png';
import startBtn from '../../assets/game2/Ready_Btn_GameStart.png';
import PlayerEnemy1 from '../../assets/game2/PlayerEnemy1.png';
import PlayerEnemy2 from '../../assets/game2/PlayerEnemy2.png';
import PlayerEnemy3 from '../../assets/game2/PlayerEnemy3.png';
import Coin from '../../assets/game2/Coin.png';
import GumiRomanceFont from '../../assets/game2/Gumi-Romance.otf';
import { useNavigate, useLocation } from 'react-router-dom';
// 사운드 import
import lobbyBGM from '../../assets/game2/game2_lobby_BGM.wav';
import hoverSound from '../../assets/game2/game2_Hover.wav';
import playButtonSound from '../../assets/game2/game2_play_button.wav';

const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: 'GumiRomance';
    src: url(${GumiRomanceFont}) format('truetype');
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
`;

const ContentWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    line-height: 1.5;
`;

const TitleText = styled.div`
    font-family: 'GumiRomance', sans-serif !important;
    font-size: 40px;
    font-weight: bold;
    color: #333333;
`;

const ContentText = styled.div`
  font-family: 'GumiRomance', sans-serif !important;
  font-size: 18px;
  color: #333333;
  font-weight: 500;
  text-align: center;
  white-space: pre-line;
`;

const DescribeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const DescribeItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2rem;
`;

const DescribeItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap:0.5rem;
`;

const DescribeText = styled.div`
  font-family: 'GumiRomance', sans-serif !important;
  font-size: 18px;
  color: #333333;
  font-weight: 500;
  text-align: center;
`;

const EnemyImage = styled.img`
  width: 50px;
  height: 50px;
`;

const CoinWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CoinImage = styled.img`
  width: 40px;
  height: 40px;
`;

const CoinText = styled.div`
  font-family: 'GumiRomance', sans-serif !important;
  font-size: 18px;
  color: #333333;
  font-weight: 500;
  text-align: center;
`;

const StartButton = styled.button`
  background-image: url(${startBtn});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 50vw;
  height: 80px;
  margin-top: 2rem;

  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }
`;

export default function ReviewGame2Ready() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // location.state에서 퀴즈 데이터와 chapterId 받기
    const quizData = location.state?.quizData || [];
    const chapterId = location.state?.chapterId;
    const reviewCount = location.state?.reviewCount || 1;
    
    // 사운드 refs
    const lobbyBGMRef = useRef(null);
    const hoverSoundRef = useRef(null);
    const playButtonSoundRef = useRef(null);
    
    // BGM 시작
    useEffect(() => {
        lobbyBGMRef.current = new Audio(lobbyBGM);
        lobbyBGMRef.current.loop = true;
        lobbyBGMRef.current.volume = 0.3;
        lobbyBGMRef.current.play().catch(err => {
            console.warn('로비 BGM 재생 실패:', err);
        });
        
        hoverSoundRef.current = new Audio(hoverSound);
        hoverSoundRef.current.volume = 0.5;
        
        playButtonSoundRef.current = new Audio(playButtonSound);
        playButtonSoundRef.current.volume = 0.5;
        
        return () => {
            if (lobbyBGMRef.current) {
                lobbyBGMRef.current.pause();
                lobbyBGMRef.current = null;
            }
        };
    }, []);
    
    const playHoverSound = () => {
        if (hoverSoundRef.current) {
            hoverSoundRef.current.currentTime = 0;
            hoverSoundRef.current.play().catch(err => {
                console.warn('Hover 사운드 재생 실패:', err);
            });
        }
    };
    
    const handleStartClick = () => {
        if (playButtonSoundRef.current) {
            playButtonSoundRef.current.play().catch(err => {
                console.warn('버튼 사운드 재생 실패:', err);
            });
        }
        
        // BGM 정지
        if (lobbyBGMRef.current) {
            lobbyBGMRef.current.pause();
        }
        
        // 퀴즈 데이터를 state로 전달하며 ReviewGame2로 이동
        navigate('/review/game2', {
            state: {
                quizData: quizData,
                chapterId: chapterId,
                reviewCount: reviewCount
            }
        });
    };
    
    return (
      <>
      <GlobalFonts />
      <Wrapper>
        <ContentWrapper>
            <TitleText>바이러스를 퇴치하라!</TitleText>
            <ContentText>{`바이러스가 울타리 안으로 들어오지 못하게 퇴치하라!\n불시에 내려오는 코인은 울타리 안으로 들어와야 획득 가능`}</ContentText>
            <DescribeWrapper>
                <DescribeItem>
                    <DescribeItemWrapper>
                        <EnemyImage src={PlayerEnemy1} alt="player enemy 1" />
                        <DescribeText>바이러스1</DescribeText>
                    </DescribeItemWrapper>

                    <CoinWrapper>
                        <CoinImage src={Coin} alt="coin" />
                        <CoinText>+ 2</CoinText>
                    </CoinWrapper>
                </DescribeItem>
                <DescribeItem>
                    <DescribeItemWrapper>
                        <EnemyImage src={PlayerEnemy2} alt="player enemy 2" />
                        <DescribeText>바이러스2</DescribeText>
                    </DescribeItemWrapper>
                    <CoinWrapper>
                        <CoinImage src={Coin} alt="coin" />
                        <CoinText>+ 4</CoinText>
                    </CoinWrapper>
                </DescribeItem>
                <DescribeItem>
                    <DescribeItemWrapper>
                        <EnemyImage src={PlayerEnemy3} alt="player enemy 3" />
                        <DescribeText>바이러스3</DescribeText>
                    </DescribeItemWrapper>
                    <CoinWrapper>
                        <CoinImage src={Coin} alt="coin" />
                        <CoinText>+ 5</CoinText>
                    </CoinWrapper>
                </DescribeItem>
            </DescribeWrapper>
            <ContentText>{`방향키로 좌우로 이동할 수 있어요.\n이동하면서 바이러스를 공격하세요!`}</ContentText>
            <StartButton 
                onClick={handleStartClick}
                onMouseEnter={playHoverSound}
            >
            </StartButton>
            </ContentWrapper>
        </Wrapper>
        </>
    );
}