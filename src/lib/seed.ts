// 数据库初始化：建表 + 种子数据
// 运行: npx tsx src/lib/seed.ts

import { createClient } from '@libsql/client';
import { v4 as uuid } from 'uuid';

const db = createClient({ url: process.env.DATABASE_URL || 'file:./data/games.db' });

async function main() {
  // 创建表（libsql 不支持多语句批量执行，需逐条执行）
  await db.execute(`CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, title_en TEXT, cover_url TEXT,
    developer TEXT, publisher TEXT, release_year INTEGER, platforms TEXT DEFAULT '[]',
    play_status TEXT NOT NULL DEFAULT 'completed', rating_plot INTEGER, rating_gameplay INTEGER,
    rating_visual INTEGER, rating_audio INTEGER, rating_feel INTEGER, rating_narrative INTEGER,
    review_text TEXT, play_hours REAL, started_date TEXT, completed_date TEXT,
    is_featured INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS game_tags (
    game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, tag_id)
  )`);

  // 检查是否已有数据
  const existing = await db.execute('SELECT COUNT(*) as c FROM games');
  if ((existing.rows[0] as any).c > 0) {
    console.log('数据库已有数据，跳过种子数据');
    return;
  }

  // 种子标签
  const tagData = [
    '开放世界', '魂系', '独立游戏', 'JRPG', 'CRPG', '动作', 'FPS',
    'Roguelike', '模拟经营', '策略', '解谜', '恐怖', '科幻', '奇幻',
    '双人合作', '有中文', '60fps', '多人联机',
  ];

  const tagIds: Record<string, string> = {};
  for (const name of tagData) {
    const id = uuid();
    tagIds[name] = id;
    await db.execute({
      sql: 'INSERT OR IGNORE INTO tags (id, name, slug) VALUES (?, ?, ?)',
      args: [id, name, name.toLowerCase().replace(/\s+/g, '-')],
    });
  }

  // 种子游戏（示例数据）
  const now = new Date().toISOString();
  const games = [
    {
      id: uuid(),
      title: '艾尔登法环',
      title_en: 'Elden Ring',
      cover_url: 'https://img2.huangye88.com/2019/11/06/b3f5b4a0-6e60-4a3a-b953-9c1e2c5d3f7a.jpg',
      developer: 'FromSoftware',
      publisher: 'Bandai Namco',
      release_year: 2022,
      platforms: '["PC","PS5","Xbox"]',
      play_status: 'completed',
      rating_plot: 9, rating_gameplay: 10, rating_visual: 9,
      rating_audio: 10, rating_feel: 10, rating_narrative: 8,
      review_text: `## 总体评价\n\n艾尔登法环是 FromSoftware 迄今为止最具野心的作品。\n\n## 优点\n\n- **开放世界设计**：真正做到了自由探索，没有地图问号\n- **战斗系统**：武器、战灰、骨灰组合丰富\n- **美术**：场景设计震撼，黄金树贯穿整个游戏\n\n## 缺点\n\n- 后期区域难度曲线略显不平滑\n- 部分支线过于隐晦`,
      play_hours: 120, started_date: '2022-02-25', completed_date: '2022-04-15',
      is_featured: 1, sort_order: 0,
      tags: ['开放世界', '魂系', '动作', '奇幻', '60fps'],
    },
    {
      id: uuid(),
      title: '塞尔达传说：王国之泪',
      title_en: 'The Legend of Zelda: Tears of the Kingdom',
      cover_url: 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/ncom/switch/switch-zelda-totk',
      developer: '任天堂',
      release_year: 2023,
      platforms: '["Switch"]',
      play_status: 'playing',
      rating_plot: 8, rating_gameplay: 10, rating_visual: 8,
      rating_audio: 9, rating_feel: 9, rating_narrative: 7,
      review_text: `## 总体评价\n\n究极手和通天术彻底改变了海拉鲁的探索方式。\n\n创造力的上限极高，但地底内容略显重复。`,
      play_hours: 80, started_date: '2023-05-12',
      is_featured: 1, sort_order: 1,
      tags: ['开放世界', '动作', '解谜', '奇幻'],
    },
    {
      id: uuid(),
      title: '空洞骑士',
      title_en: 'Hollow Knight',
      cover_url: 'https://upload.wikimedia.org/wikipedia/en/0/0e/Hollow_Knight_first_cover.jpg',
      developer: 'Team Cherry',
      release_year: 2017,
      platforms: '["PC","Switch","PS4"]',
      play_status: 'platinum',
      rating_plot: 9, rating_gameplay: 9, rating_visual: 10,
      rating_audio: 10, rating_feel: 9, rating_narrative: 9,
      review_text: `## 总体评价\n\n银河恶魔城类游戏的巅峰之一。\n\n手绘美术风格完美，音乐令人难忘。难度曲线设计精妙，圣巢王国的氛围营造堪称教科书级别。`,
      play_hours: 55, started_date: '2021-06-01', completed_date: '2021-08-20',
      is_featured: 1, sort_order: 2,
      tags: ['独立游戏', '动作', '魂系', '有中文'],
    },
    {
      id: uuid(),
      title: '赛博朋克2077',
      title_en: 'Cyberpunk 2077',
      cover_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
      developer: 'CD Projekt Red',
      release_year: 2020,
      platforms: '["PC","PS5","Xbox"]',
      play_status: 'dropped',
      rating_plot: 7, rating_gameplay: 6, rating_visual: 9,
      rating_audio: 8, rating_feel: 5, rating_narrative: 7,
      review_text: `## 总体评价\n\n首发灾难，但后续修补了不少。夜之城的美术无可挑剔，但核心玩法仍然让人感觉空洞。\n\n弃坑原因：主线以外的内容重复度太高。`,
      play_hours: 25, started_date: '2023-01-10',
      tags: ['开放世界', 'FPS', '科幻'],
    },
    {
      id: uuid(),
      title: '星露谷物语',
      title_en: 'Stardew Valley',
      cover_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
      developer: 'ConcernedApe',
      release_year: 2016,
      platforms: '["PC","Switch","Mobile"]',
      play_status: 'endless',
      rating_plot: 8, rating_gameplay: 9, rating_visual: 7,
      rating_audio: 8, rating_feel: 9, rating_narrative: 8,
      review_text: `## 总体评价\n\n一个人做的游戏，却比大多数团队产品更有灵魂。\n\n种田、钓鱼、挖矿、社交，每个系统都简单却让人上瘾。是那种会时不时回来玩一阵的"永久游戏"。`,
      play_hours: 200, started_date: '2020-03-01',
      is_featured: 1, sort_order: 3,
      tags: ['独立游戏', '模拟经营', '有中文'],
    },
    {
      id: uuid(),
      title: '只狼：影逝二度',
      title_en: 'Sekiro: Shadows Die Twice',
      cover_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg',
      developer: 'FromSoftware',
      publisher: 'Activision',
      release_year: 2019,
      platforms: '["PC","PS4","Xbox"]',
      play_status: 'replayed',
      rating_plot: 8, rating_gameplay: 10, rating_visual: 8,
      rating_audio: 9, rating_feel: 10, rating_narrative: 7,
      review_text: `## 总体评价\n\n打铁模拟器。FromSoftware 最纯粹的动作游戏。\n\n舍弃了 RPG 数值，一刀一弹全凭技术。通关后的多周目体验依然出色，每次都能发现新的打法。`,
      play_hours: 90, started_date: '2019-03-22', completed_date: '2019-05-01',
      is_featured: 0, sort_order: 4,
      tags: ['魂系', '动作', '有中文', '60fps'],
    },
    {
      id: uuid(),
      title: '博德之门3',
      title_en: "Baldur's Gate 3",
      cover_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
      developer: 'Larian Studios',
      release_year: 2023,
      platforms: '["PC","PS5"]',
      play_status: 'backlog',
      review_text: '拉瑞安出品，年度游戏。还在待玩清单里，等有空了开坑。',
      is_featured: 0, sort_order: 5,
      tags: ['CRPG', '奇幻', '策略'],
    },
  ];

  for (const g of games) {
    const { tags: tagNames, ...gameData } = g;
    await db.execute({
      sql: `INSERT INTO games (id, title, title_en, cover_url, developer, publisher, release_year, platforms, play_status,
            rating_plot, rating_gameplay, rating_visual, rating_audio, rating_feel, rating_narrative,
            review_text, play_hours, started_date, completed_date, is_featured, sort_order, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        gameData.id, gameData.title, gameData.title_en || null, gameData.cover_url || null,
        gameData.developer || null, gameData.publisher || null, gameData.release_year || null,
        gameData.platforms, gameData.play_status,
        gameData.rating_plot || null, gameData.rating_gameplay || null, gameData.rating_visual || null,
        gameData.rating_audio || null, gameData.rating_feel || null, gameData.rating_narrative || null,
        gameData.review_text || null, gameData.play_hours || null, gameData.started_date || null,
        gameData.completed_date || null, gameData.is_featured || 0, gameData.sort_order || 0,
        now, now,
      ],
    });

    for (const tagName of tagNames) {
      if (tagIds[tagName]) {
        await db.execute({
          sql: 'INSERT OR IGNORE INTO game_tags (game_id, tag_id) VALUES (?, ?)',
          args: [gameData.id, tagIds[tagName]],
        });
      }
    }
  }

  console.log(`种子数据完成: ${games.length} 款游戏, ${tagData.length} 个标签`);
}

main().catch(console.error);
