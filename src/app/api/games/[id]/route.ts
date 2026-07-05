import { NextRequest, NextResponse } from 'next/server';
import { updateGame, deleteGame } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  await updateGame(id, {
    title: body.title,
    titleEn: body.titleEn,
    coverUrl: body.coverUrl,
    developer: body.developer,
    publisher: body.publisher,
    releaseYear: body.releaseYear,
    platforms: body.platforms || [],
    playStatus: body.playStatus || 'completed',
    ratingPlot: body.ratingPlot,
    ratingGameplay: body.ratingGameplay,
    ratingVisual: body.ratingVisual,
    ratingAudio: body.ratingAudio,
    ratingFeel: body.ratingFeel,
    ratingNarrative: body.ratingNarrative,
    reviewText: body.reviewText,
    playHours: body.playHours,
    startedDate: body.startedDate,
    completedDate: body.completedDate,
    tagNames: body.tagNames || [],
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { id } = await params;
  await deleteGame(id);
  return NextResponse.json({ ok: true });
}
