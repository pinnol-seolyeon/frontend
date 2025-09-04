import React, { useState } from 'react';
import styled from 'styled-components';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './QnAViewer.css';
// import { fetchQuestionDates, fetchQuestionsByDate } from '../../api/analyze/analytics';

const QnAContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: calc(100% - 4rem);
  max-height: 25rem;
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
`;

const CalendarPanel = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem 0;
`;

const MonthBanner = styled.div`
  background: #4A91FE;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
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
  color: #666;
  padding: 0.5rem;
`;

const CalendarDay = styled.div`
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => {
    if (props.isSelected) return 'white';
    if (props.isWeekend && !props.isOtherMonth) return '#FF6B6B';
    if (props.isOtherMonth) return '#ccc';
    return '#333';
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

const ChatTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1.5rem 0;
`;

const QnACard = styled.div`
  background: ${props => props.type === 'question' ? '#E8F5E8' : '#FFF8E1'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  font-weight: 700;
  color: #454545;
  margin-bottom: 0.8rem;
  font-size: 1rem;
`;

const CardContent = styled.div`
  color: #555;
  font-weight: 300;
  line-height: 1.6;
  font-size: 0.9rem;
  white-space: pre-line;

  strong {
    color: #454545;
    font-size: 1rem;
    font-weight: 700;
  }
`;


const PraiseCard = styled.div`
  background: #E3F2FD;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-size: 1rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #ddd;
`;

export default function QnAViewer() {
  // API 데이터 주석처리 - 하드코딩된 데이터로 디자인 작업
  // const [markedDates, setMarkedDates] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const [qnaList, setQnaList] = useState([]);

  // useEffect(() => {
  //   fetchQuestionDates()
  //     .then((data) => {
  //       const dates = data.map((dateStr) => dateStr.slice(0, 10));
  //       setMarkedDates(dates);
  //     })
  //     .catch((err) => console.error('❌ 질문 날짜 불러오기 실패:', err));
  // }, []);

  // useEffect(() => {
  //   const dateStr = selectedDate.toLocaleDateString('sv-SE');
  //   fetchQuestionsByDate(dateStr)
  //     .then((data) => {
  //       const formatted = data.flatMap((item) =>
  //         item.questions.map((q, i) => ({
  //           question: q,
  //           answer: item.answers[i] || '',
  //         }))
  //       );
  //       setQnaList(formatted);
  //     })
  //     .catch((err) => console.error('❌ 질문 내역 불러오기 실패:', err));
  // }, [selectedDate]);

  // 현재 날짜 가져오기
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate()); // 현재 일
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 현재 월
  const [currentYear, setCurrentYear] = useState(today.getFullYear()); // 현재 년도

  // 선택된 날짜의 전체 날짜 문자열 생성
  const selectedDateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

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
    const lastDay = new Date(year, month, 0);
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

  const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  // 날짜별 Q&A 데이터 생성 함수
  const generateQnAData = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    // 날짜에 따라 다른 데이터 반환
    if (day === 6) {
      return [
        {
          type: 'question',
          header: '오늘 어떤 것을 배웠나요?',
          content: '오늘은 새로운 개념을 배우는 날이었어요. 학습은 우리의 지식을 넓혀주고 더 똑똑하게 만들어줍니다. 매일 조금씩 배우면 나중에 큰 도움이 될 거예요.'
        },
        {
          type: 'praise',
          content: '오늘 열심히 공부한 모습이 정말 멋졌어요. 이런 노력이 쌓이면 더 좋은 결과를 얻을 수 있을 거예요.',
          tip: '효과적인 학습 방법',
          tipContent: '오늘은 이런 방법으로 공부해보세요: 1) 명확한 목표를 세우기 2) 집중할 수 있는 환경 만들기 3) 이해한 내용을 다시 정리하기'
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
        {
          type: 'praise',
          content: '수학 문제를 차근차근 풀어가는 모습이 인상적이었어요!',
          tip: '수학 학습 팁',
          tipContent: '수학 공부할 때는: 1) 개념을 먼저 이해하기 2) 예제 문제 풀어보기 3) 실수한 부분 다시 확인하기'
        }
      ];
    } else if (day === 22) {
      return [
        {
          type: 'question',
          header: '영어 단어는 몇 개 외웠나요?',
          content: '영어는 꾸준한 학습이 중요한 언어예요. 매일 조금씩이라도 공부하면 큰 진전을 볼 수 있어요.'
        },
        {
          type: 'praise',
          content: '영어 발음을 정확하게 따라하는 모습이 훌륭했어요!',
          tip: '영어 학습 방법',
          tipContent: '영어 공부할 때는: 1) 소리 내어 읽기 2) 문장 전체로 외우기 3) 실제 상황에서 사용해보기'
        }
      ];
    } else {
      return []; // 다른 날짜는 빈 배열 반환
    }
  };

  const qnaData = generateQnAData(new Date(currentYear, currentMonth - 1, selectedDate));

  const handleDateClick = (dayData) => {
    if (dayData.isCurrentMonth) {
      setSelectedDate(dayData.day);
    }
  };

  return (
    <QnAContainer>
      <ContentWrapper>
        <CalendarPanel>
          <Title>{selectedDateString} 질문 내역</Title>
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
                isSelected={dayData.day === selectedDate && dayData.isCurrentMonth}
                isWeekend={dayData.isWeekend}
                isOtherMonth={dayData.isOtherMonth}
                onClick={() => handleDateClick(dayData)}
              >
                {dayData.day}
              </CalendarDay>
            ))}
          </CalendarGrid>
        </CalendarPanel>

        <ChatPanel>
          {qnaData.length > 0 ? (
            qnaData.map((item, index) => {
              if (item.type === 'question') {
                return (
                  <QnACard key={index} type="question">
                    <CardHeader>❓질문 : {item.header}</CardHeader>
                    <CardContent>{item.content}</CardContent>
                  </QnACard>
                );
                } else if (item.type === 'praise') {
                return (
                  <PraiseCard key={index}>
                    <CardContent>
                      <strong>🙌칭찬 : </strong>{item.content}
                      <br /><br />
                      <strong>💡팁 : </strong>{item.tipContent}
                    </CardContent>
                  </PraiseCard>
                );
              }
              return null;
            })
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
