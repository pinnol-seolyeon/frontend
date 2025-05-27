import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './QnAViewer.css';

import { fetchQuestionDates, fetchQuestionsByDate } from '../../api/analytics';

export default function QnAViewer() {
  const [markedDates, setMarkedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [qnaList, setQnaList] = useState([]);

  // 캘린더에 표시할 날짜 불러오기
  useEffect(() => {
    fetchQuestionDates()
      .then((data) => {
        const dates = data.map((dateStr) => dateStr.slice(0, 10));
        setMarkedDates(dates);
      })
      .catch((err) => console.error('❌ 질문 날짜 불러오기 실패:', err));
  }, []);

  // 날짜별 질문/답변 불러오기
  useEffect(() => {
    const dateStr = selectedDate.toLocaleDateString('sv-SE');
    fetchQuestionsByDate(dateStr)
      .then((data) => {
        const formatted = data.flatMap((item) =>
          item.questions.map((q, i) => ({
            question: q,
            answer: item.answers[i] || '',
          }))
        );
        setQnaList(formatted);
      })
      .catch((err) => console.error('❌ 질문 내역 불러오기 실패:', err));
  }, [selectedDate]);

  return (
    <div className="qna-container">
      <div className="calendar-panel">
        <Calendar
            onClickDay={setSelectedDate}
            tileClassName={({ date }) => {
                const dateStr = date.toLocaleDateString('sv-SE'); // 로컬 기준 날짜
                return markedDates.includes(dateStr) ? 'marked' : null;
            }}
        />
      </div>

      <div className="chat-panel">
        <h2>{selectedDate.toLocaleDateString('sv-SE')} 질문 내역</h2>
        <div className="chat-box">
          {qnaList.length === 0 ? (
            <p>질문 기록이 없습니다.</p>
          ) : (
            qnaList.map((qna, index) => (
              <div key={index}>
                <div className="chat-question">🙋 {qna.question}</div>
                <div className="chat-answer">🤖 {qna.answer}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
