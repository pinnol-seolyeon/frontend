import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import StudyStatsBox from '../../components/analyze/StudyStatsBox';
import StudyTimeStats from '../../components/analyze/StudyTimeStats';
import RadarGraph from '../../components/analyze/RadarChart';
import QnAViewer from '../../components/analyze/QnAViewer';

import { fetchStudyStats } from '../../api/analyze/analytics';
import { fetchRadarScore } from '../../api/analyze/analytics';

export default function Dashboard() {
  const [studyStats, setStudyStats] = useState({ totalCompleted: 0, weeklyCompleted: 0 });
  const [thisWeek, setThisWeek] = useState({});
  const [lastWeek, setLastWeek] = useState({});

  useEffect(() => {
    fetchStudyStats().then(setStudyStats);
    fetchRadarScore().then(score => {
      setThisWeek(score.thisWeek);
      setLastWeek(score.lastWeek);
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
          <div className={`${styles.squareBox} ${styles.topBox}`}>
            <StudyStatsBox type="total" />
          </div>
          <div className={`${styles.squareBox} ${styles.topBox}`}>
            <StudyStatsBox type="weekly" />
          </div>
        </div>

        {/* ⬅️ 가운데 가로 긴 박스 */}
        <div className={styles.radarChartBox}>
          <RadarGraph thisWeek={thisWeek} lastWeek={lastWeek} />
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
