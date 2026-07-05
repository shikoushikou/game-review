'use client';

import { RadarChart as RechartsRadar, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const DIMENSIONS = [
  { key: 'ratingPlot', label: '剧情' },
  { key: 'ratingGameplay', label: '玩法' },
  { key: 'ratingVisual', label: '美术' },
  { key: 'ratingAudio', label: '音乐' },
  { key: 'ratingFeel', label: '手感' },
  { key: 'ratingNarrative', label: '叙事' },
];

interface Props {
  data: {
    ratingPlot: number | null;
    ratingGameplay: number | null;
    ratingVisual: number | null;
    ratingAudio: number | null;
    ratingFeel: number | null;
    ratingNarrative: number | null;
  };
}

export default function RadarChart({ data }: Props) {
  const chartData = DIMENSIONS.map((d) => ({
    dimension: d.label,
    score: (data[d.key as keyof typeof data] as number | null) ?? 0,
    fullMark: 10,
  }));

  const hasData = chartData.some((d) => d.score > 0);

  if (!hasData) {
    return <div className="text-text-muted text-sm text-center py-8">暂无评分数据</div>;
  }

  return (
    <div className="w-full aspect-square max-w-[300px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
          />
          <Radar
            name="评分"
            dataKey="score"
            stroke="#a78bfa"
            fill="#a78bfa"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
