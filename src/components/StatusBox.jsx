import styled from 'styled-components';
import React from 'react';
import moneybag from '../assets/moneybag.svg';
import Crown from '../assets/crown.svg';

const StatusBoxWrapper = styled.div`
  background-color: ${props => props.status === 'not_started' ? '#F7F7F7' : 'white'};
  border-radius: 5px;
  padding: 1.5rem;
  border: ${props => props.status === 'in_progress' ? '2px solid #478CEE' : '1px solid #DADADA'};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: ${props => props.status !== 'not_started' ? 'pointer' : 'not-allowed'};
  
  ${props => props.status !== 'not_started' && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
  `}
`;

// 빨간색 구분선 - 상단 섹션 (아이콘 + 제목/태그)
const TopSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// 빨간색 구분선 - 하단 섹션 (스티커 + 진행률)
const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusTag = styled.div`
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  width: fit-content;
  box-sizing: border-box;
  
  ${props => {
    switch(props.status) {
      case 'completed':
        return `
          background-color: #191919;
          color: white;
        `;
      case 'in_progress':
        return `
          background-color: #478CEE;
          color: white;
        `;
      case 'not_started':
        return `
          color: #9E9E9E;
          border: 1px solid #9E9E9E;
        `;
      default:
        return `
          background-color: #F5F5F5;
          color: #666666;
        `;
    }
  }}
`;

// 노란색 구분선 - 아이콘 영역 (왼쪽)
const IconSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 노란색 구분선 - 텍스트 영역 (오른쪽)
const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

// 노란색 구분선 - 스티커 영역 (상단)
const StickerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// 노란색 구분선 - 진행률 영역 (하단)
const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const IconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #F7F7F7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #191919;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #454545;
`;

const StickerContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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
      case 'MODEL_STUDENT':
        return `
          background-color: #FFF1C1;
          color: #FFAA00;
        `;
      case 'SMART_GAMER':
        return `
          background-color: #E3F4FF;
          color: #4EB8FF;
        `;
      case 'SPEED_HUNTER':
        return `
          background-color: #F0F4FC;
          color: #478CEE;
        `;
      case 'FINE_HUNTER':
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
            case 'MODEL_STUDENT':
                // 노란색 계열
                return `
                `;
            case 'SMART_GAMER':
                // #4EB8FF 색상 (밝은 파란색)
                return `
                    filter: brightness(0) saturate(100%) invert(79%) sepia(27%) saturate(1253%) hue-rotate(176deg) brightness(105%) contrast(101%);
                `;
            case 'SPEED_HUNTER':
                // #478CEE 색상 (진한 파란색)
                return `
                    filter: brightness(0) saturate(100%) invert(62%) sepia(45%) saturate(1200%) hue-rotate(197deg) brightness(102%) contrast(95%);
                `;
            case 'FINE_HUNTER':
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

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #4C4C4C;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #F7F7F7;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.progress === 100 ? '#BCE4FF' : '#4A91FE'};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const ProgressText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #191919;
`;

const LockedMessage = styled.div`
  background-color: #EAEAEA;
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  font-size: 13px;
  border: 1px solid #DADADA;
  font-weight: 300;
  color: #9E9E9E;
  line-height: 1.4;
`;

const ProgressContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`;



const StatusBox = ({ 
  title = "돈이란 무엇일까?", 
  status = "not_started", 
  progress = 0,
  description = "돈에 대한 이해도가 높아요!",
  stickers = [],
  chapterId,
  onClick
}) => {
  const handleClick = () => {
    if (status !== 'not_started' && onClick) {
      onClick({ chapterId, title, status, progress, description, stickers });
    }
  };

  const renderBottomContent = () => {
    if (status === 'not_started') {
      return (
        <LockedMessage>
          이전 단원 완료시 학습 현황을 볼 수 있어요!
        </LockedMessage>
      );
    }

    const getStickerText = (stickerType, stickerName) => {
      switch(stickerType) {
        case 'MODEL_STUDENT': return '모범생';
        case 'SMART_GAMER': return '스마트 게이머';
        case 'SPEED_HUNTER': return '스피드 사냥꾼';
        case 'FINE_HUNTER': return '정교한 사냥꾼';
        default: return stickerName;
      }
    };
  

    return (
      <>
        <StickerSection>
          {stickers.length > 0 && (
            <StickerContainer>
                {stickers.map((sticker, index) => (
                  <Sticker key={index} type={sticker.type}>
                    <CrownIcon type={sticker.type}>
                      <img src={Crown} alt="Crown icon" />
                    </CrownIcon>
                    {getStickerText(sticker.type, sticker.name)}
                  </Sticker>
                ))}
            </StickerContainer>
          )}
        </StickerSection>
        
        <ProgressSection>
          <ProgressContainer>
            <ProgressContent>
                <ProgressLabel>진행률</ProgressLabel>
                <ProgressText>{Math.round(Number(progress) || 0)}%</ProgressText>
            </ProgressContent>

            <ProgressBar>
              <ProgressFill progress={progress} />
            </ProgressBar>

          </ProgressContainer>
        </ProgressSection>
      </>
    );
  };

  const getStatusText = () => {
    switch(status) {
      case 'completed': return '학습 완료';
      case 'in_progress': return '학습 중';
      case 'not_started': return '시작 전';
      default: return '시작 전';
    }
  };

  return (
    <StatusBoxWrapper status={status} onClick={handleClick}>
      {/* 빨간색 구분선 - 상단 섹션 */}
      <TopSection>
        {/* 노란색 구분선 - 아이콘 영역 (왼쪽) */}
        <IconSection>
          <IconWrapper>
            <Icon src={moneybag} alt="Money bag icon" />
          </IconWrapper>
        </IconSection>
        
        {/* 노란색 구분선 - 텍스트 영역 (오른쪽) */}
        <TextSection>
          <StatusTag status={status}>
            {getStatusText()}
          </StatusTag>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </TextSection>
      </TopSection>

      {/* 빨간색 구분선 - 하단 섹션 */}
      <BottomSection>
        {renderBottomContent()}
      </BottomSection>
    </StatusBoxWrapper>
  );
};

export default StatusBox;