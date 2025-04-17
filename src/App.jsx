import React, { useEffect, useState } from 'react';
import QuizChart from './components/QuizChart';
import TodayStudyTime from './components/TodayStudyTime';
import AttendanceCalendar from './components/AttendanceCalendar';
import { fetchQuizResults, fetchTodayStudyTime, fetchAttendance } from './api/analytics';

export default function App() {
  const userId = "u123"; // 로그인 연동 가능
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const [quizData, setQuizData] = useState([]);
  const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0 });
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchQuizResults(userId).then(setQuizData);
    fetchTodayStudyTime(userId).then(setStudyTime);
    fetchAttendance(userId, year, month).then(res => setAttendance(res.attendedDates));
  }, []);

  return (
    <div className="dashboard">
      <h2>📊 학습 분석 대시보드</h2>
      <QuizChart data={quizData} />
      <TodayStudyTime {...studyTime} />
      <AttendanceCalendar attendedDates={attendance} />
    </div>
  );
}
