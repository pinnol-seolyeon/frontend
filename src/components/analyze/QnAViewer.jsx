import React, { useState } from 'react';
import styled from 'styled-components';

const QnAContainer = styled.div`
  background: white;
  border-radius: 5px;
  padding: 2rem;
  border : 1px solid #DADADA;
  width: 100%;
  max-height: 25rem;
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
`;

const CalendarPanel = styled.div`
  flex: 1;
  background-color: #FAFAFA;
  border-radius: 12px;
  padding: 0.3rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const MonthBanner = styled.div`
  color: #9E9E9E;
  border-radius: 12px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  color: #9E9E9E;
  font-size: 18px;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  
  &:hover {
    background: #DADADA;
  }
`;

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;


const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Weekday = styled.div`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #DADADA;
  padding: 0.5rem;
`;

const CalendarDay = styled.div`
  text-align: center;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => {
    if (props.isSelected) return 'white';
    if (props.isWeekend && !props.isOtherMonth) return '#FF6B6B';
    if (props.isOtherMonth) return '#ccc';
    return '#9E9E9E';
  }};
  background: ${props => {
    if (props.isSelected) return '#4A91FE';
    if (props.isToday && !props.isOtherMonth) return '#f0f8ff';
    return 'transparent';
  }};
  border: ${props => props.isSelected ? '2px solid #4A91FE' : 'none'};
  
  &:hover {
    background: ${props => {
      if (props.isSelected) return '#4A91FE';
      if (props.isOtherMonth) return 'transparent';
      return '#f0f8ff';
    }};
  }
`;

const ChatPanel = styled.div`
  flex: 2;
  max-height: 30rem;
  overflow-y: auto;
`;


const QnACard = styled.div`
  background: #F7F7F7;
  border-radius: 5px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const CardHeaderContent = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #191919;
  margin-bottom: 0.8rem;
`;

const CardHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const CardHeader = styled.div`
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.8rem;
  font-size: 14px;
  width: fit-content;
  padding: 0.3rem 1.2rem;
  border-radius: 10px;
  background-color: #454545;
`;

const CardContent = styled.div`
  color: #454545;
  font-weight: 300;
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-line;

  strong {
    color: #454545;
    font-size: 1rem;
    font-weight: 700;
  }
`;



const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #454545;
  font-size: 1rem;
  text-align: center;
  background: #F7F7F7;
  border-radius: 5px;
`;

export default function QnAViewer() {
  const [selectedDate, setSelectedDate] = useState(new Date());


  // 현재 날짜 가져오기
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 현재 월
  const [currentYear, setCurrentYear] = useState(today.getFullYear()); // 현재 년도

  // 선택된 날짜의 전체 날짜 문자열 생성

  // 월 이동 함수
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 캘린더 데이터 생성 함수
  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const totalDays = 42; // 6주 * 7일
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const day = currentDate.getDate();
      const isCurrentMonth = currentDate.getMonth() === month - 1;
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      days.push({
        day,
        isCurrentMonth,
        isWeekend,
        isOtherMonth: !isCurrentMonth,
        date: currentDate
      });
    }
    
    return days;
  };

  const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  // 날짜별 Q&A 데이터 생성 함수
  const generateQnAData = (date) => {
    const day = date.getDate();
    
    // 날짜에 따라 다른 데이터 반환
    if (day === 6) {
      return [
        {
          type: 'question',
          header: '오늘 어떤 것을 배웠나요?',
          content: '오늘은 새로운 개념을 배우는 날이었어요. 학습은 우리의 지식을 넓혀주고 더 똑똑하게 만들어줍니다. 매일 조금씩 배우면 나중에 큰 도움이 될 거예요.'
        },
        {
          type: 'question',
          header: '가장 기억에 남는 것은?',
          content: '오늘 배운 것 중에서 가장 기억에 남는 것이 있나요? 중요한 내용은 반복해서 복습하면 더 오래 기억할 수 있어요.'
        }
      ];
    } else if (day === 15) {
      return [
        {
          type: 'question',
          header: '수학 공부는 어땠나요?',
          content: '수학은 논리적 사고를 기르는 좋은 과목이에요. 오늘 배운 내용을 잘 이해했는지 확인해보세요.'
        },
      ];
    } else if (day === 22) {
      return [
        {
          type: 'question',
          header: '영어 단어는 몇 개 외웠나요?',
          content: '영어는 꾸준한 학습이 중요한 언어예요. 매일 조금씩이라도 공부하면 큰 진전을 볼 수 있어요.'
        },
      ];
    } else {
      return []; // 다른 날짜는 빈 배열 반환
    }
  };

  const qnaData = generateQnAData(new Date(currentYear, currentMonth - 1, selectedDate.getDate()));

  const handleDateClick = (dayData) => {
    if (dayData.isCurrentMonth) {
      setSelectedDate(new Date(currentYear, currentMonth - 1, dayData.day));
    }
  };

  return (
    <QnAContainer>
      <ContentWrapper>
        <CalendarWrapper>
          <Title>질문 내역</Title>
          <CalendarPanel>
            <MonthBanner>
              <MonthButton onClick={goToPreviousMonth}>{'<'}</MonthButton>
              {currentYear}.{String(currentMonth).padStart(2, '0')}
              <MonthButton onClick={goToNextMonth}>{'>'}</MonthButton>
            </MonthBanner>
            
            <WeekdayHeader>
              {weekdays.map((day, index) => (
                <Weekday key={index}>{day}</Weekday>
              ))}
            </WeekdayHeader>
            
            <CalendarGrid>
              {calendarDays.map((dayData, index) => (
                <CalendarDay
                  key={index}
                  isSelected={dayData.day === selectedDate.getDate() && dayData.isCurrentMonth}
                  isWeekend={dayData.isWeekend}
                  isOtherMonth={dayData.isOtherMonth}
                  onClick={() => handleDateClick(dayData)}
                >
                  {dayData.day}
                </CalendarDay>
              ))}
            </CalendarGrid>
          </CalendarPanel>
        </CalendarWrapper>
        <ChatPanel>
          {qnaData.length > 0 ? (
            qnaData.map((item, index) => (
              <QnACard key={index}>
                <CardHeaderContainer>
                  <CardHeader>질문</CardHeader>
                  <CardHeaderContent>{item.header}</CardHeaderContent>
                </CardHeaderContainer>
                <CardContent>{item.content}</CardContent>
              </QnACard>
            ))
          ) : (
            <EmptyMessage>
              이 날짜에는 질문 내역이 없습니다.
            </EmptyMessage>
          )}
        </ChatPanel>
      </ContentWrapper>
    </QnAContainer>
  );
}
