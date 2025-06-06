import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Legend
} from 'recharts';

import styles from './RadarGraph.module.css'; // 스타일 분리

export default function RadarGraph({ thisWeek, lastWeek }) {
  const data = [
    { subject: "참여도", thisWeek: thisWeek.engagement * 100, lastWeek: lastWeek.engagement * 100 },
    { subject: "집중도", thisWeek: thisWeek.focus * 100, lastWeek: lastWeek.focus * 100 },
    { subject: "이해도", thisWeek: thisWeek.understanding * 100, lastWeek: lastWeek.understanding * 100 },
    { subject: "표현력", thisWeek: thisWeek.expression * 100, lastWeek: lastWeek.expression * 100 },
  ];

  const getSummaryText = () => {
    const avg = (thisWeek.engagement + thisWeek.focus + thisWeek.understanding + thisWeek.expression) / 4;
    if (avg >= 0.8) return "학습 태도가 매우 우수합니다! 👍 꾸준한 집중과 질문 활동이 돋보여요.";
    if (avg >= 0.6) return "양호한 학습 태도입니다. 약간의 개선 여지는 있지만 좋은 흐름이에요.";
    if (avg >= 0.4) return "노력이 필요해요. 특히 집중도나 표현력 부분을 개선해보세요.";
    return "학습 활동이 부족해요. 꾸준한 참여와 질문을 시도해보세요.";
  };

  return (
    <div className={styles.radarLayout}>
      <div className={styles.graphSection}>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="이번 주" dataKey="thisWeek" stroke="#f8b62d" fill="#f8b62d" fillOpacity={0.1} />
            <Radar name="지난 주" dataKey="lastWeek" stroke="#036eb8" fill="#036eb8" fillOpacity={0.2} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.textSection}>
        <h3>이해도 분석</h3>
        <p>이번 주와 지난 주의 학습 성과를 항목별로 비교해보세요!</p>
        <p className={styles.summaryText}>{getSummaryText()}</p>
      </div>
    </div>
  );
}
