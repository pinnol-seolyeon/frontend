import React, { useEffect, useState } from 'react';
import { fetchStudyTimeStats } from '../../api/analyze/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function StudyTimeStats() {
  const [preferredType, setPreferredType] = useState('');
  const [weeklyData, setWeeklyData] = useState([]);
  const [error, setError] = useState(false);

  const emojiMap = {
    "아침형": "🌅",
    "낮형": "🌞",
    "밤형": "🌙",
    "새벽형": "🦉",
    "언제든지좋아형": "🎯",
  };

  useEffect(() => {
    fetchStudyTimeStats()
      .then(data => {
        if (!data) {
          setError(true);
          return;
        }
        setPreferredType(data.preferredType || '');

        const orderedDays = ['일', '월', '화', '수', '목', '금', '토'];
        const formatted = orderedDays.map(day => {
          const stats = data.weeklyStats?.[day] || {};
          return {
            day,
            morning: stats.morning || 0,
            afternoon: stats.afternoon || 0,
            evening: stats.evening || 0,
            night: stats.night || 0,
          };
        });
        setWeeklyData(formatted);
      })
      .catch(err => {
        console.error("❌ 공부 시간 데이터 요청 실패:", err);
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <p style={{ textAlign: 'center', paddingTop: '20px' }}>
        공부 시간 데이터를 불러올 수 없습니다.
      </p>
    );
  }

  if (!preferredType && weeklyData.length === 0) {
    return (
      <p style={{ textAlign: 'center', paddingTop: '20px' }}>
        아직 학습 기록이 없습니다. 먼저 학습을 진행해주세요!
      </p>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h4 style={{ marginBottom: '8px' }}>
        🕒 선호 학습 시간대: <strong>{preferredType}{emojiMap[preferredType] || ''}</strong>
      </h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyData}>
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="morning" stackId="a" fill="#E69F00" name="아침 (5~12시)" />
          <Bar dataKey="afternoon" stackId="a" fill="#56B4E9" name="낮 (12~18시)" />
          <Bar dataKey="evening" stackId="a" fill="#009E73" name="저녁 (18~23시)" />
          <Bar dataKey="night" stackId="a" fill="#CC79A7" name="새벽 (23~5시)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
