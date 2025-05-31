import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Legend
} from 'recharts';

export default function RadarGraph({ thisWeek, lastWeek }) {
  const data = [
    { subject: "참여도", thisWeek: thisWeek.engagement * 100, lastWeek: lastWeek.engagement * 100 },
    { subject: "집중도", thisWeek: thisWeek.focus * 100, lastWeek: lastWeek.focus * 100 },
    { subject: "이해도", thisWeek: thisWeek.understanding * 100, lastWeek: lastWeek.understanding * 100 },
    { subject: "표현력", thisWeek: thisWeek.expression * 100, lastWeek: lastWeek.expression * 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="이번 주" dataKey="thisWeek" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
        <Radar name="지난 주" dataKey="lastWeek" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

