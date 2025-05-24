import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function QuizChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
        표시할 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="unit" />
          
          {/* 왼쪽 Y축 (코인용) */}
          <YAxis yAxisId="left" />
          {/* 오른쪽 Y축 (틀린 문제 수용) */}
          <YAxis yAxisId="right" orientation="right" />

          <Tooltip />
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

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="coin"
            stroke="#FBC344"
            name="코인"
            dot={{ r: 4, stroke: '#FBC344', strokeWidth: 2, fill: '#FBC344' }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="score"
            stroke="#5D97C5"
            name="틀린 문제 수"
            dot={{ r: 4, stroke: '#5D97C5', strokeWidth: 2, fill: '#5D97C5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
