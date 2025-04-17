import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function QuizChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="wrong" stroke="#ff6b6b" name="틀린 수" />
        <Line type="monotone" dataKey="score" stroke="#1dd1a1" name="정답률" />
      </LineChart>
    </ResponsiveContainer>
  );
}
