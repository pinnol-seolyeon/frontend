import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Sidebar from '../../components/Sidebar';
import userimg from '../../assets/user.svg';
import { useNavigate } from 'react-router-dom';
import holdingIcon from '../../assets/holding_icon1.svg';
import releaseIcon from '../../assets/holding_icon2.svg';

const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const MainWrapper = styled.div` 
  flex: 1;
  min-height: calc(100vh - var(--header-height, 70px));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: flex-start;
  margin-bottom: 2rem;
`;

const TitleText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #191919;
`;

const SubTitleText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #191919;
  margin-bottom: 1rem;
`;


const TicketCard = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TicketRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  padding: 0.25rem 0;
`;

const TicketLabel = styled.span`
  font-size: 16px;
  font-weight: 300;
  color: #454953;
  min-width: 140px;
  flex-shrink: 0;
`;

const TicketValue = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #191919;
`;

const TicketBadge = styled.span`
  display: inline-block;
  padding: 0.6rem 1rem;
  background: #D1E8F7;
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  border-radius: 5px;
`;

const TicketQuantity = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #191919;
  margin-left: 0.5rem;
`;

const TicketValueGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const HoldingButton = styled.button`
  padding: 0.4rem 1.3rem;
  background: #ffffff;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #D1E8F7;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #D1E8F7;
    border: 1px solid #D1E8F7;
  }
`;

const ReleaseButton = styled.button`
  padding: 0.4rem 1.3rem;
  background: #056FB8;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #035C97;
  }
`;

const HoldingDaysText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #454953;
  margin-left: 0.5rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  min-width: 450px;
  max-width: 600px;
  text-align: center;
`;

const ModalIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;

  img {
    width: 56px;
    height: 56px;
    object-fit: contain;
  }
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #191919;
  margin-bottom: 1rem;
`;

const ModalDescription = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #454953;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ModalPeriodLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #454953;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
`;

const ModalPeriodValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191919;
  margin-bottom: 1.5rem;
`;

const ModalButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

const ModalCancelButton = styled.button`
  flex: 1;
  padding: 0.6rem 1rem;
  background: #ffffff;
  color: #056FB8;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid #056FB8;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #f0f7ff;
  }
`;

const ModalConfirmButton = styled.button`
  flex: 1;
  padding: 0.6rem 1rem;
  background: #056FB8;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #035C97;
  }
`;

const DatePickerWrapper = styled.div`
  padding: 1.25rem;
  background: #F0F4FC;
  border-radius: 16px;
  border: 1px solid #E8EEFA;

  .react-calendar {
    width: 100%;
    border: none;
    background: transparent;
    font-family: inherit;
    line-height: 1.4;
  }

  .react-calendar__navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .react-calendar__navigation button {
    min-width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #ffffff;
    color: #191919;
    font-size: 1rem;
    font-weight: 600;
    border: 1px solid #E8EEFA;
    transition: background 0.2s, color 0.2s;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background: #D1E8F7;
    color: #5B9BD5;
    border-color: #D1E8F7;
  }

  .react-calendar__navigation__label {
    flex-grow: 1;
    font-weight: 600;
    font-size: 1rem;
    color: #191919;
  }

  .react-calendar__month-view__weekdays {
    display: flex;
    flex-wrap: nowrap;
    font-size: 0.75rem;
    font-weight: 600;
    color: #5B9BD5;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .react-calendar__month-view__weekdays__weekday {
    flex: 0 0 calc(100% / 7) !important;
    min-width: 0;
    padding: 0.5em 2px;
    text-align: center;
    overflow: visible !important;
    box-sizing: border-box;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }

  .react-calendar__month-view__days {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }

  .react-calendar__month-view__days__day {
    flex: 0 0 calc((100% - 12px) / 7) !important;
    min-width: 0;
    overflow: visible !important;
    box-sizing: border-box;
  }

  .react-calendar__tile {
    max-width: 100%;
    padding: 0.6em;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #191919;
    transition: background 0.2s, color 0.2s;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #b0b8c4;
  }

  /* 토요일(6번째 열) 파란색 */
  .react-calendar__month-view__days__day:nth-child(7n+6) {
    color: #056FB8;
  }

  /* 일요일(7번째 열) 빨간색 */
  .react-calendar__month-view__days__day:nth-child(7n+7) {
    color: #d10000;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: #D1E8F7;
    color: #5B9BD5;
  }

  .react-calendar__tile--now {
    background: #E8EEFA;
    color: #5B9BD5;
    font-weight: 600;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: #D1E8F7;
    color: #5B9BD5;
  }

  .react-calendar__tile--hasActive {
    background: #D1E8F7;
    color: #5B9BD5;
  }

  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #b8d4f1;
    color: #5B9BD5;
  }

  .react-calendar__tile--active {
    background: #5B9BD5 !important;
    color: #ffffff !important;
    font-weight: 600;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #4a8bc2 !important;
    color: #ffffff !important;
  }

  .react-calendar--selectRange .react-calendar__tile--hover {
    background: #D1E8F7;
    color: #5B9BD5;
  }
`;

const ProfileCard = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ProfileLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
`;

const ProfileLabel = styled.span`
  font-size: 16px;
  font-weight: 300;
  color: #454953;
  min-width: 140px;
  flex-shrink: 0;
`;

const ProfileAvatar = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EditButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: #D1E8F7;
  color: #191919;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #b8d4f1;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  padding: 0.25rem 0;
`;

const InfoLabel = styled.span`
  font-size: 16px;
  font-weight: 300;
  color: #454953;
  min-width: 140px;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
`;

const GrayText = styled.span`
  font-size: 16px;
  font-weight: 300;
  color: #454953;
`;

const formatPhone = (phone) => {
  if (!phone) return '-';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('010')) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return phone;
};

const formatDateRange = (start, end) => {
  if (!start || !end) return '';
  const f = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  };
  return `${f(start)} ~ ${f(end)}`;
};

const getDaysRemaining = (endDate) => {
  if (endDate == null) return 0;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return 0;
  end.setHours(23, 59, 59, 999);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
};

const Mypage_main = ({ user, login, setLogin }) => {
  const navigate = useNavigate();
  const [holdingModalOpen, setHoldingModalOpen] = useState(false);
  const [holdingStep, setHoldingStep] = useState('confirm'); // 'confirm' | 'datepicker' | 'setDone'
  const [holdingDateRange, setHoldingDateRange] = useState([null, null]);
  const [holdingActive, setHoldingActive] = useState(false);
  const [holdingEndDate, setHoldingEndDate] = useState(null);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const myName = user?.name ?? '-';
  const ticketExpiryDate = '2026.03.03';
  const myPhone = formatPhone(user?.phone);
  const parentName = user?.parentName ?? '-';
  const parentPhone = formatPhone(user?.parentPhone);

  return (
    <Wrapper>
      <ContentWrapper>
        <Sidebar user={user} login={login} setLogin={setLogin} />
        <MainWrapper>
          <TitleWrapper>
            <TitleText>마이페이지</TitleText>
          </TitleWrapper>
          <SubTitleText>내 프로필</SubTitleText>    
          <ProfileCard>
            <ProfileRow>
              <ProfileLeft>
                <ProfileLabel>프로필</ProfileLabel>
                <ProfileAvatar>
                  <img src={userimg} alt="프로필" />
                </ProfileAvatar>
              </ProfileLeft>
              <EditButton type="button" onClick={() => navigate('/mypage/profileedit')}>수정</EditButton>
            </ProfileRow>
            <InfoRow>
              <InfoLabel>내 이름</InfoLabel>
              <InfoValue>{myName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>내 전화번호</InfoLabel>
              <InfoValue>{myPhone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>부모님 성함</InfoLabel>
              <InfoValue>{parentName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>부모님 전화번호</InfoLabel>
              <InfoValue>{parentPhone}</InfoValue>
            </InfoRow>
          </ProfileCard>
          <SubTitleText style={{ marginTop: '2.5rem' }}>사용권</SubTitleText>
          <TicketCard>
            <TicketRow>
              <TicketLabel>사용권</TicketLabel>
              <TicketValueGroup>
                <TicketBadge>- 1개월 권 -</TicketBadge>
                <TicketQuantity>X 2</TicketQuantity>
              </TicketValueGroup>
            </TicketRow>
            <TicketRow>
              <TicketLabel>사용 기한</TicketLabel>
              <TicketValue>2026.01.01 ~ 2026.03.01 <GrayText>(2개월)</GrayText></TicketValue>
            </TicketRow>
            <TicketRow>
              <TicketLabel>내 전화번호</TicketLabel>
              {holdingActive ? (
                <>
                  <ReleaseButton type="button" onClick={() => setReleaseModalOpen(true)}>
                    지금 해제
                  </ReleaseButton>
                  <HoldingDaysText>({getDaysRemaining(holdingEndDate)}일 남음)</HoldingDaysText>
                </>
              ) : (
                <HoldingButton type="button" onClick={() => { setHoldingModalOpen(true); setHoldingStep('confirm'); setHoldingDateRange([null, null]); }}>
                  홀딩 사용
                </HoldingButton>
              )}
            </TicketRow>
          </TicketCard>
        </MainWrapper>
      </ContentWrapper>
      {holdingModalOpen && (
        <ModalOverlay onClick={() => { setHoldingModalOpen(false); setHoldingStep('confirm'); }}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            {holdingStep === 'confirm' && (
              <>
                <ModalIcon><img src={holdingIcon} alt="홀딩" /></ModalIcon>
                <ModalTitle>홀딩을 사용하시겠습니까?</ModalTitle>
                <ModalDescription>
                  홀딩 기간엔 학습할 수 없으며,
                  <br />
                  홀딩 기간만큼 만료일이 연장됩니다.
                </ModalDescription>
                <ModalButtonRow>
                  <ModalCancelButton type="button" onClick={() => { setHoldingModalOpen(false); setHoldingStep('confirm'); }}>
                    취소
                  </ModalCancelButton>
                  <ModalConfirmButton type="button" onClick={() => setHoldingStep('datepicker')}>
                    확인
                  </ModalConfirmButton>
                </ModalButtonRow>
              </>
            )}
            {holdingStep === 'datepicker' && (
              <>
                <ModalTitle style={{ marginBottom: '1rem' }}>홀딩 기간 선택</ModalTitle>
                <DatePickerWrapper style={{ marginBottom: '1rem' }}>
                  <Calendar
                    locale="ko-KR"
                    selectRange
                    value={holdingDateRange}
                    onChange={setHoldingDateRange}
                  />
                </DatePickerWrapper>
                <ModalButtonRow>
                  <ModalCancelButton type="button" onClick={() => { setHoldingModalOpen(false); setHoldingStep('confirm'); setHoldingDateRange([null, null]); }}>
                    취소
                  </ModalCancelButton>
                  <ModalConfirmButton
                    type="button"
                    onClick={() => {
                      const start = Array.isArray(holdingDateRange) ? holdingDateRange[0] : holdingDateRange;
                      const end = Array.isArray(holdingDateRange) ? holdingDateRange[1] : start;
                      if (start) setHoldingStep('setDone');
                      else alert('날짜를 선택해 주세요.');
                    }}
                  >
                    확인
                  </ModalConfirmButton>
                </ModalButtonRow>
              </>
            )}
            {holdingStep === 'setDone' && (
              <>
                <ModalIcon><img src={holdingIcon} alt="홀딩" /></ModalIcon>
                <ModalTitle>홀딩이 설정됩니다.</ModalTitle>
                <ModalDescription style={{ marginBottom: '0.5rem' }}>
                  홀딩 기간엔 학습할 수 없습니다.
                </ModalDescription>
                <ModalPeriodLabel>홀딩기간</ModalPeriodLabel>
                <ModalPeriodValue>
                  {formatDateRange(
                    Array.isArray(holdingDateRange) ? holdingDateRange[0] : holdingDateRange,
                    Array.isArray(holdingDateRange) ? (holdingDateRange[1] || holdingDateRange[0]) : holdingDateRange
                  )}
                </ModalPeriodValue>
                <ModalButtonRow>
                  <ModalCancelButton type="button" onClick={() => { setHoldingModalOpen(false); setHoldingStep('confirm'); setHoldingDateRange([null, null]); }}>
                    취소
                  </ModalCancelButton>
                  <ModalConfirmButton
                    type="button"
                    onClick={() => {
                      const rawEnd = Array.isArray(holdingDateRange) ? (holdingDateRange[1] || holdingDateRange[0]) : holdingDateRange;
                      const endDate = rawEnd ? new Date(rawEnd) : null;
                      setHoldingActive(true);
                      setHoldingEndDate(endDate);
                      setHoldingModalOpen(false);
                      setHoldingStep('confirm');
                      setHoldingDateRange([null, null]);
                      // TODO: API 연동 후 홀딩 설정 요청
                    }}
                  >
                    확인
                  </ModalConfirmButton>
                </ModalButtonRow>
              </>
            )}
          </ModalBox>
        </ModalOverlay>
      )}
      {releaseModalOpen && (
        <ModalOverlay onClick={() => setReleaseModalOpen(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalIcon><img src={releaseIcon} alt="홀딩" /></ModalIcon>
            <ModalTitle>홀딩을 지금 해제하시겠습니까?</ModalTitle>
            <ModalDescription style={{ marginBottom: '0.5rem' }}>
              기존 만료일: {ticketExpiryDate}
            </ModalDescription>
            <ModalDescription style={{ marginBottom: '1.5rem' }}>
              해제 후 만료일: {ticketExpiryDate}
            </ModalDescription>
            <ModalButtonRow>
              <ModalCancelButton type="button" onClick={() => setReleaseModalOpen(false)}>
                취소
              </ModalCancelButton>
              <ModalConfirmButton
                type="button"
                onClick={() => {
                  setHoldingActive(false);
                  setHoldingEndDate(null);
                  setReleaseModalOpen(false);
                  // TODO: API 연동 후 홀딩 해제 요청
                }}
              >
                해제
              </ModalConfirmButton>
            </ModalButtonRow>
          </ModalBox>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default Mypage_main;