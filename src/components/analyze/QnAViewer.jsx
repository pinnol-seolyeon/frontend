import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchQuestionDates, fetchQuestionsByDate } from '../../api/analyze/analytics';

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
    if (props.isToday) return '#2D7BED';
    return '#9E9E9E';
  }};
  background: ${props => {
    if (props.isSelected) return '#4A91FE';
    if (props.isToday && !props.isOtherMonth) return '#f0f8ff';
    if (props.hasQuestions && !props.isOtherMonth) return '#FFF3E0';
    return 'transparent';
  }};
  border: ${props => props.isSelected ? '2px solid #4A91FE' : 'none'};
  position: relative;
  
  /* 질문이 있는 날짜에 점 표시 */
  &::after {
    content: ${props => props.hasQuestions && !props.isOtherMonth ? '"•"' : 'none'};
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    color: #FF9800;
    font-size: 12px;
  }
  
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
  flex: 1;
  line-height: 1.6;
`;

const CardHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const CardHeader = styled.div`
  font-weight: 500;
  color: #ffffff;
  font-size: 14px;
  width: fit-content;
  padding: 0.3rem 1.2rem;
  border-radius: 10px;
  background-color: #454545;
  flex-shrink: 0;
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
  const [questionDates, setQuestionDates] = useState([]); // 질문이 있는 날짜들
  const [qnaData, setQnaData] = useState([]); // 선택된 날짜의 질문/답변 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 현재 날짜 가져오기
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 현재 월
  const [currentYear, setCurrentYear] = useState(today.getFullYear()); // 현재 년도

  // 질문이 있는 날짜 목록 로드
  useEffect(() => {
    const loadQuestionDates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dates = await fetchQuestionDates();
        console.log('📅 질문 날짜 목록:', dates);
        setQuestionDates(dates);
        
        // 현재 선택된 날짜의 질문 데이터도 로드
        const dateStr = formatDateForAPI(selectedDate);
        await loadQuestionsForDate(dateStr);
        
      } catch (err) {
        console.error('❌ 질문 날짜 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionDates();
  }, []);

  // 특정 날짜의 질문 데이터 로드
  const loadQuestionsForDate = async (dateStr) => {
    try {
      const data = await fetchQuestionsByDate(dateStr);
      console.log('📝 질문 데이터:', data);
      setQnaData(data || []);
    } catch (err) {
      console.error('❌ 질문 데이터 로드 실패:', err);
      setQnaData([]);
    }
  };

  // 날짜를 API 형식으로 변환 (YYYY-MM-DD) - 로컬 타임존 기준
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
    
    // 오늘 날짜와 비교하기 위한 Date 객체
    const today = new Date();
    const todayString = today.toDateString();
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const day = currentDate.getDate();
      const isCurrentMonth = currentDate.getMonth() === month - 1;
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const isToday = currentDate.toDateString() === todayString;
      
      // 해당 날짜에 질문이 있는지 확인
      const dateStr = formatDateForAPI(currentDate);
      const hasQuestions = questionDates.includes(dateStr);
      
      days.push({
        day,
        isCurrentMonth,
        isWeekend,
        isOtherMonth: !isCurrentMonth,
        isToday,
        hasQuestions,
        date: currentDate
      });
    }
    
    return days;
  };

  const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  // API 데이터를 컴포넌트 형식으로 변환
  // questions와 answers 배열을 같은 인덱스끼리 매칭하여 쌍으로 변환
  const transformApiDataToQnA = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }
    
    const result = [];
    
    // 각 아이템(날짜별 데이터) 처리
    apiData.forEach((item, itemIndex) => {
      const questions = item.questions || [];
      const answers = item.answers || [];
      
      // questions와 answers 배열의 길이 중 더 긴 것 기준으로 처리
      const maxLength = Math.max(questions.length, answers.length);
      
      // 각 질문/답변 쌍을 개별 카드로 생성
      for (let i = 0; i < maxLength; i++) {
        result.push({
          id: item.id ? `${item.id}-${i}` : `${itemIndex}-${i}`,
          type: 'question',
          header: `질문 ${i + 1}`,
          question: questions[i] || '질문이 없습니다.',
          answer: answers[i] || '답변이 없습니다.',
          date: item.date,
          chapterId: item.chapterId
        });
      }
    });
    
    return result;
  };

  const handleDateClick = async (dayData) => {
    if (dayData.isCurrentMonth) {
      const newDate = new Date(currentYear, currentMonth - 1, dayData.day);
      setSelectedDate(newDate);
      
      // 해당 날짜의 질문 데이터 로드
      const dateStr = formatDateForAPI(newDate);
      await loadQuestionsForDate(dateStr);
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
                  isToday={dayData.isToday}
                  hasQuestions={dayData.hasQuestions}
                  onClick={() => handleDateClick(dayData)}
                >
                  {dayData.day}
                </CalendarDay>
              ))}
            </CalendarGrid>
          </CalendarPanel>
        </CalendarWrapper>
        <ChatPanel>
          {loading ? (
            <EmptyMessage>
              데이터를 불러오는 중입니다...
            </EmptyMessage>
          ) : error ? (
            <EmptyMessage>
              데이터를 불러오는데 실패했습니다: {error}
            </EmptyMessage>
          ) : qnaData.length > 0 ? (
            transformApiDataToQnA(qnaData).map((item, index) => (
              <QnACard key={item.id || index}>
                <CardHeaderContainer>
                  <CardHeader>질문</CardHeader>
                  <CardHeaderContent>{item.question}</CardHeaderContent>
                </CardHeaderContainer>
                {item.answer && (
                  <CardContent style={{ marginTop: '1rem' }}>
                    {item.answer}
                  </CardContent>
                )}
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
