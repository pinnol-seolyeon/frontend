import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function QuizChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        {/* 그래프 안쪽 우측 상단에 범례 표시 */}
        <Legend
          layout="horizontal"
          verticalAlign="top"
          align="right"
          wrapperStyle={{
            top: 10,
            right: 10,
            fontSize: 12
          }}
        />

        <Area
          type="monotone"
          dataKey="questionMark"
          stroke="#FBC344"
          fill="#FBC344"
          fillOpacity={0.3}
          name="별표"
          dot={{
            r: 4,
            stroke: '#FBC344',
            strokeWidth: 2,
            fill: '#FBC344'  // 채워진 점
          }}
        />

        <Area
          type="monotone"
          dataKey="wrong"
          stroke="#5D97C5"
          fill="#5D97C5"
          fillOpacity={0.3}
          name="틀린 문제 수"
          dot={{
            r: 4,
            stroke: '#5D97C5',
            strokeWidth: 2,
            fill: '#5D97C5'  // 채워진 점
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
