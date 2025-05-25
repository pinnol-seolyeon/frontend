import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import QuizChart from '../../components/QuizChart';
import AttendanceCalendar from '../../components/AttendanceCalendar';
import TodayStudyTime from '../../components/TodayStudyTime';
// import Answers from '../../components/Answers';

import { fetchScoreResults, fetchTodayStudyTime, fetchAttendance } from '../../api/analytics';

export default function Dashboard() {
  const [quizData, setQuizData] = useState([]);
  const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0 });
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchScoreResults().then(setQuizData);
    fetchTodayStudyTime().then(setStudyTime);
    const now = new Date();
    fetchAttendance(now.getFullYear(), now.getMonth() + 1).then(res => {
      setAttendance(res.attendedDates);
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        학습 분석
      </div>

      <div className={styles.contentBox}>
        {/* ⬆️ 위쪽 수평 두 개 */}
        <div className={styles.topBoxes}>
          <div className={styles.squareBox}>
            <TodayStudyTime hours={studyTime.hours} minutes={studyTime.minutes} />
          </div>
          <div className={styles.squareBox}>
            <AttendanceCalendar attendedDates={attendance} />
          </div>
        </div>

        {/* ⬅️ 가운데 가로 긴 박스 */}
        <div className={styles.quizChartBox}>
          <QuizChart data={quizData} />
        </div>

        {/* ⬇️ 아래 수평 두 개 */}
        <div className={styles.bottomBoxes}>
          <div className={styles.squareBox}>
            {/* 예: <Answers /> */}
          </div>
          <div className={styles.squareBox}>
            {/* 예: 다른 콘텐츠 */}
          </div>
        </div>
      </div>
    </div>
  );
}
