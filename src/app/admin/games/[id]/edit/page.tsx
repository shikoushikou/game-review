import { getGameById, getAllTags } from '@/lib/data';
import { notFound } from 'next/navigation';
import GameForm from '@/components/GameForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: Props) {
  const { id } = await params;
  const [game, allTags] = await Promise.all([getGameById(id), getAllTags()]);
  if (!game) notFound();

  return (
    <GameForm
      allTags={allTags}
      initial={{
        id: game.id,
        title: game.title,
        titleEn: game.titleEn || undefined,
        coverUrl: game.coverUrl || undefined,
        developer: game.developer || undefined,
        publisher: game.publisher || undefined,
        releaseYear: game.releaseYear || undefined,
        platforms: game.platforms,
        playStatus: game.playStatus,
        ratingPlot: game.ratingPlot,
        ratingGameplay: game.ratingGameplay,
        ratingVisual: game.ratingVisual,
        ratingAudio: game.ratingAudio,
        ratingFeel: game.ratingFeel,
        ratingNarrative: game.ratingNarrative,
        reviewText: game.reviewText || undefined,
        playHours: game.playHours,
        startedDate: game.startedDate || undefined,
        completedDate: game.completedDate || undefined,
        tagNames: game.tags.map((t) => t.name),
      }}
    />
  );
}
