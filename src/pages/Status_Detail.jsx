import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatusBox from "../components/StatusBox";
import Crown from "../assets/crown.svg";
import { fetchQuizListByChapter } from "../api/status/currentSituation";

const Wrapper = styled.div`
    background-color: #ffffff;
    margin: 0;
    padding: 0;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const MainWrapper = styled.div` 
    flex: 1;
    min-height: calc(100vh - var(--header-height, 70px));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    /* 모바일 반응형 */
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    width: 100%;
    max-width: 100%;
    padding: 2rem;
`;


const TitleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-self: flex-start;
    margin-bottom: 2rem;
`;

const TitleText = styled.div`
    font-size: 32px;
    font-weight: 700;
    color: #191919;
`;

const SubTitleText = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: #191919;
`;

const ProgressWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #F0F4FC;
    border-radius: 5px;
    width: 100%;
`;

const CircularProgress = styled.div`
    width: 10rem;
    height: 10rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const NumberText = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: #4C4C4C;
`;

const ProgressTextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const ProgressTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: #191919;
    line-height: 1.3;
`;

const ProgressSubtitle = styled.div`
    font-size: 16px;
    font-weight: 400;
    color: #454545;
    line-height: 1.4;
`;

const StatusBoxGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
    margin-top: 2rem;
`;

const SectionTitle = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: #191919;
    margin-bottom: 1rem;
    margin-top: 2rem;
`;

const BackButtonWrapper = styled.div`
    width: 100%;
    max-width: 1000px;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2rem;
`;

const BackButton = styled.div`
    border-radius: 8px;
    padding: 0.6rem 1rem;
    border: 1px solid #B8B8B8;
    font-size: 0.8rem;
    font-weight: 300;
    color: #4C4C4C;
    cursor: pointer;
    background-color: white;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f8f9fa;
        border-color: #4A91FE;
        color: #4A91FE;
    }
`;

const StickerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StickerContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CrownIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: white;
  
    img {
        width: 0.8rem;
        height: 0.8rem;
        ${props => {
            switch(props.type) {
            case 'review':
                // 노란색 계열
                return `
                `;
            case 'learning':
                // #4EB8FF 색상 (밝은 파란색)
                return `
                    filter: brightness(0) saturate(100%) invert(79%) sepia(27%) saturate(1253%) hue-rotate(176deg) brightness(105%) contrast(101%);
                `;
            case 'focus':
                // #478CEE 색상 (진한 파란색)
                return `
                    filter: brightness(0) saturate(100%) invert(62%) sepia(45%) saturate(1200%) hue-rotate(197deg) brightness(102%) contrast(95%);
                `;
            default:
                return `
                `;
            }
        }}  
    }
`;

const Sticker = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.5rem;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch(props.type) {
      case 'review':
        return `
          background-color: #FFF1C1;
          color: #FFAA00;
        `;
      case 'learning':
        return `
          background-color: #E3F4FF;
          color: #4EB8FF;
        `;
      case 'focus':
        return `
          background-color: #F0F4FC;
          color: #478CEE;
        `;
      default:
        return `
          background-color: #F5F5F5;
          color: #666666;
        `;
    }
  }}
`;

const QuizWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #F0F4FC;
    border-radius: 5px;
    width: 100%;
    padding: 1.5rem;
`;

const QuizTitle = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: #191919;
`;

const QuizProgressWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const ProgressBarWrapper = styled.div`
    flex: 1;
    height: 1rem;
    background-color: #FFFFFF;
    border-radius: 30px;
    overflow: hidden;
`;

const ProgressFill = styled.div`
    height: 100%;
    width: ${props => props.percentage}%;
    background-color: #4A91FE;
    transition: width 0.3s ease;
    border-radius: 30px;
`;

const ProgressText = styled.div`
    display: flex;
    align-items: center;
    padding: 0.3rem 0.8rem;
    background-color: #ffffff;
    border: 1px solid #2D7BED;
    border-radius: 10px;
    color: #2D7BED;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
`;

const QuizCard = styled.div`
    background-color: white;
    border-radius: 5px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`;

const QuizQuestion = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #454545;
`;

const QuizAnswer = styled.div`
    font-size: 17px;
    font-weight: 400;
    color: #454545;
`;

const QuizBadge = styled.div`
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    align-self: flex-start;
    background-color: ${props => props.isCorrect ? '#478CEE' : '#F14E4E'};
    color: #ffffff;
`;

const QuizHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const QuizAnswerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
`;

const StatusDetail = ({user, login, setLogin}) => {
console.log('REDIRECT_URI:', process.env.REACT_APP_KAKAO_REDIRECT_URI);
console.log('현재 NODE_ENV:', process.env.NODE_ENV);

const navigate = useNavigate();
const location = useLocation();
const [loading, setLoading] = useState(true);

// 전달받은 데이터
const { chapterId, title: itemTitle = "돈이란 무엇일까?", description: itemDescription = "", stickers: itemStickers = [] } = location.state || {};

// 퀴즈 데이터
const [quizRecords, setQuizRecords] = useState([]);
const [correctRate, setCorrectRate] = useState(0);
const [noQuizMessage, setNoQuizMessage] = useState("");

useEffect(() => {
    const load = async () => {
        try {
            setNoQuizMessage("");
            if (!chapterId) {
                setQuizRecords([]);
                setCorrectRate(0);
                return;
            }
            const data = await fetchQuizListByChapter(chapterId);
            if (data?.code === 'QUIZ_NOTES_NOT_FOUND') {
                setNoQuizMessage('퀴즈를 아직 풀지 않았어요');
                setQuizRecords([]);
                setCorrectRate(0);
                return;
            }
            setQuizRecords(Array.isArray(data?.quizRecords) ? data.quizRecords : []);
            const rate = Number(data?.correctRate) || 0;
            const rounded = Math.round(rate * 10) / 10;
            setCorrectRate(rounded);
        } catch (e) {
            console.error('퀴즈 리스트 로드 실패:', e);
        } finally {
            setLoading(false);
        }
    };
    load();
}, [chapterId]);

const handleClose=()=>{
    navigate("/status");
};

return (
    <Wrapper>
    <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
            <ContentContainer>

                <BackButtonWrapper>
                    <BackButton
                        onClick={handleClose}
                    >{'<'} 이전 페이지로 돌아가기</BackButton>
                </BackButtonWrapper>

                <TitleWrapper>
                    <TitleText>{itemTitle}</TitleText>

                    <StickerSection>
                        {itemStickers && itemStickers.length > 0 && (
                            <StickerContainer>
                                {itemStickers.map((sticker, index) => (
                                <Sticker key={index} type={sticker.type}>
                                    <CrownIcon type={sticker.type}>
                                    <img src={Crown} alt="Crown icon" />
                                    </CrownIcon>
                                    {sticker.name}
                                </Sticker>
                                ))}
                            </StickerContainer>
                        )}
                    </StickerSection>

                    <SubTitleText>{itemDescription}</SubTitleText>

                </TitleWrapper>

                <QuizWrapper>
                    <QuizHeader>
                        <QuizTitle>퀴즈 학습 내역</QuizTitle>
                        <ProgressText>정답률 {Math.round(Number(correctRate) || 0)}%</ProgressText>

                    </QuizHeader>

                    <QuizProgressWrapper>
                        <ProgressBarWrapper>
                            <ProgressFill percentage={Math.min(100, Math.max(0, Math.round(Number(correctRate) || 0)))} />
                        </ProgressBarWrapper>
                    </QuizProgressWrapper>

                    {loading ? (
                        <div>로딩 중...</div>
                    ) : noQuizMessage ? (
                        <div>{noQuizMessage}</div>
                    ) : (
                        quizRecords.map((quiz, index) => (
                            <QuizCard key={quiz.quizId || index}>
                                <QuizQuestion>Q{index + 1}. {quiz.question}</QuizQuestion>
                                <QuizAnswerContainer>
                                    <QuizAnswer>답: {quiz.userAnswer}</QuizAnswer>
                                    <QuizBadge isCorrect={!!quiz.isCorrect}>
                                        {quiz.isCorrect ? '정답' : '오답'}
                                    </QuizBadge>
                                </QuizAnswerContainer>
                            </QuizCard>
                        ))
                    )}
                </QuizWrapper>
            </ContentContainer>
        </MainWrapper>
    </ContentWrapper>
    </Wrapper>
);
};

export default StatusDetail;