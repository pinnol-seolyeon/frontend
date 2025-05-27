import { useEffect, useState } from 'react';
import { fetchStudyStats } from '../../api/analytics';
import styles from './StudyStatsBox.module.css';


function StudyStatsBox({ type }) {
  const [stats, setStats] = useState({ totalCompleted: 0, weeklyCompleted: 0 });

  useEffect(() => {
    fetchStudyStats()
      .then(setStats)
      .catch(err => console.error("❌ 통계 불러오기 실패:", err));
  }, []);


  if (type === 'total') {
    return (
      <div>
        <h4 className={styles.title}>📚 총 완료 단원 수</h4>
        <p className={styles.value}>{stats.totalCompleted}개</p>
      </div>
    );
  }

  if (type === 'weekly') {
    return (
      <div>
        <h4 className={styles.title}>📅 이번 주 완료 단원 수</h4>
        <p className={styles.value}>{stats.weeklyCompleted}개</p>
      </div>
    );
  }


  return null;
}

export default StudyStatsBox;
