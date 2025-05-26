import React, { useEffect, useState } from 'react';
import { fetchStudyTimeStats } from '../../api/analytics';
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
  const emojiMap = {
    "아침형": "🌅",
    "낮형": "🌞",
    "밤형": "🌙",
    "새벽형": "🦉",
    "언제든지좋아형": "🎯",
    };

  useEffect(() => {
    fetchStudyTimeStats().then(data => {
      setPreferredType(data.preferredType);


      // 순서 고정: 일~토
      const orderedDays = ['일', '월', '화', '수', '목', '금', '토'];
      const formatted = orderedDays.map(day => {
        const stats = data.weeklyStats[day] || {};
        return {
          day,
          morning: stats.morning || 0,
          afternoon: stats.afternoon || 0,
          evening: stats.evening || 0,
          night: stats.night || 0,
        };
      });

      setWeeklyData(formatted);
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h4 style={{ marginBottom: '8px' }}>🕒 선호 학습 시간대: <strong>{preferredType}{emojiMap[preferredType] || ''}</strong></h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyData}>
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="morning" stackId="a" fill="#FFD700" name="아침 (5~12시)" />
          <Bar dataKey="afternoon" stackId="a" fill="#90EE90" name="낮 (12~18시)" />
          <Bar dataKey="evening" stackId="a" fill="#87CEFA" name="저녁 (18~23시)" />
          <Bar dataKey="night" stackId="a" fill="#DDA0DD" name="새벽 (23~5시)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}