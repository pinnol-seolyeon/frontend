import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import StudyStatsBox from '../../components/analyze/StudyStatsBox';
import StudyTimeStats from '../../components/analyze/StudyTimeStats';
import QuizChart from '../../components/QuizChart';
import QnAViewer from '../../components/analyze/QnAViewer';

import { fetchStudyStats } from '../../api/analytics';

export default function Dashboard() {
  const [studyStats, setStudyStats] = useState({ totalCompleted: 0, weeklyCompleted: 0 });
  const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0 });
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchStudyStats().then(setStudyStats);
    fetchTodayStudyTime().then(setStudyTime);
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
            <StudyStatsBox type="total" />
          </div>
          <div className={styles.squareBox}>
            <StudyStatsBox type="weekly" />
          </div>
        </div>

        {/* ⬅️ 가운데 가로 긴 박스 */}
        <div className={styles.quizChartBox}>
          {/* <QuizChart data={quizData} /> */}
        </div>

        {/* ⬇️ 아래 수평 두 개 */}
        <div className={styles.bottomBoxes}>
          <div className={styles.squareBox}>
            <StudyTimeStats />
          </div>
          <div className={`${styles.squareBox} ${styles.qnaBox}`}>
            <QnAViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
