import GameCard from './GameCard';

interface Game {
  id: string;
  title: string;
  coverUrl: string | null;
  platforms: string[];
  playStatus: string;
  ratingPlot: number | null;
  ratingGameplay: number | null;
  ratingVisual: number | null;
  ratingAudio: number | null;
  ratingFeel: number | null;
  ratingNarrative: number | null;
  tags?: { id: string; name: string }[];
}

export default function GameGrid({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return (
      <div className="text-center py-20 text-text-muted">
        <div className="text-5xl mb-4">🎮</div>
        <p className="text-lg">没有找到匹配的游戏</p>
        <p className="text-sm mt-1">试试调整筛选条件</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {games.map((game, i) => (
        <div key={game.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
}
