import { NextRequest, NextResponse } from 'next/server';
import { createGame } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: '游戏名称不能为空' }, { status: 400 });
  }

  const id = await createGame({
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

  return NextResponse.json({ id }, { status: 201 });
}
