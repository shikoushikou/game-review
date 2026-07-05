import { getGames, getAllTags } from '@/lib/data';
import GameGrid from '@/components/GameGrid';
import FilterBar from '@/components/FilterBar';

interface Props {
  searchParams: Promise<{ q?: string; status?: string; tags?: string; sort?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q || '';
  const status = params.status || '';
  const selectedTags = params.tags ? params.tags.split(',').filter(Boolean) : [];
  const sort = params.sort || 'updated';

  const [allTags, gameData] = await Promise.all([
    getAllTags(),
    getGames({ search, status, tagSlugs: selectedTags, sort }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">游戏评测</h1>
        <p className="text-text-muted text-sm mt-1">共 {gameData.length} 款游戏</p>
      </div>
      <FilterBar
        tags={allTags}
        selectedTags={selectedTags}
        selectedStatus={status}
        sort={sort}
        search={search}
      />
      <GameGrid games={gameData} />
    </div>
  );
}
