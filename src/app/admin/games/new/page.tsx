import { getAllTags } from '@/lib/data';
import GameForm from '@/components/GameForm';

export default async function NewGamePage() {
  const tags = await getAllTags();
  return <GameForm allTags={tags} />;
}
