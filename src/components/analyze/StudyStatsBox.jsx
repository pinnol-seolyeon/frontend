import { useEffect, useState } from 'react';
import { fetchStudyStats } from '../../api/analyze/analytics';
import styles from './StudyStatsBox.module.css';

function StudyStatsBox({ type }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStudyStats()
      .then(setStats)
      .catch(err => {
        console.error("❌ 통계 불러오기 실패:", err);
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <div className={styles.errorBox}>
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const value = type === 'total'
    ? stats?.totalCompleted ?? 0
    : stats?.weeklyCompleted ?? 0;

  const title = type === 'total'
    ? '📚 총 완료 단원 수'
    : '📅 이번 주 완료 단원 수';

  return (
    <div>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.value}>{value}개</p>
    </div>
  );
}

export default StudyStatsBox;
