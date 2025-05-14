import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import QuizChart from '../../components/QuizChart';
import AttendanceCalendar from '../../components/AttendanceCalendar';
import TodayStudyTime from '../../components/TodayStudyTime';
import { fetchQuizResults, fetchTodayStudyTime, fetchAttendance } from '../../api/analytics';

export default function Dashboard() {
  const userId = 'u123';
  const [quizData, setQuizData] = useState([]);
  const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0 });
  const [attendance, setAttendance] = useState([]);

  // useEffect(() => {
  //   fetchQuizResults(userId).then(setQuizData);
  //   fetchTodayStudyTime(userId).then(setStudyTime);
  //   const now = new Date();
  //   fetchAttendance(userId, now.getFullYear(), now.getMonth() + 1).then(res => {
  //     setAttendance(res.attendedDates);
  //   });
  // }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        학습 분석
      </div>

      <div className={styles.contentBox}>
        <div className={styles.quizChartBox}>
          <QuizChart data={quizData} />
        </div>

        {/* 아래 두 개 정사각형 박스 */}
        <div className={styles.bottomBoxes}>
          <div className={styles.squareBox}>
            {/* <TodayStudyTime hours={studyTime.hours} minutes={studyTime.minutes} /> */}
          </div>
          <div className={styles.squareBox}>
            {/* <AttendanceCalendar attendedDates={attendance} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
