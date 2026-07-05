import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ------------------------------------- games -------------------------------------
export const games = sqliteTable('games', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  coverUrl: text('cover_url'),
  developer: text('developer'),
  publisher: text('publisher'),
  releaseYear: integer('release_year'),
  platforms: text('platforms', { mode: 'json' }).$type<string[]>().default([]),
  playStatus: text('play_status').notNull().default('completed'),
  ratingPlot: integer('rating_plot'),
  ratingGameplay: integer('rating_gameplay'),
  ratingVisual: integer('rating_visual'),
  ratingAudio: integer('rating_audio'),
  ratingFeel: integer('rating_feel'),
  ratingNarrative: integer('rating_narrative'),
  reviewText: text('review_text'),
  playHours: real('play_hours'),
  startedDate: text('started_date'),
  completedDate: text('completed_date'),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const gamesRelations = relations(games, ({ many }) => ({
  gameTags: many(gameTags),
}));

// ------------------------------------- tags -------------------------------------
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  gameTags: many(gameTags),
}));

// --------------------------------- game_tags ------------------------------------
export const gameTags = sqliteTable('game_tags', {
  gameId: text('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.gameId, t.tagId] }),
}));

export const gameTagsRelations = relations(gameTags, ({ one }) => ({
  game: one(games, { fields: [gameTags.gameId], references: [games.id] }),
  tag: one(tags, { fields: [gameTags.tagId], references: [tags.id] }),
}));

// ---------------------------------- types ---------------------------------------
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const PLAY_STATUSES = ['completed', 'platinum', 'dropped', 'playing', 'endless', 'replayed', 'backlog'] as const;
export type PlayStatus = typeof PLAY_STATUSES[number];

export const PLAY_STATUS_LABELS: Record<PlayStatus, string> = {
  completed: '已通关',
  platinum: '已白金',
  dropped: '弃坑',
  playing: '在玩',
  endless: '永久在玩',
  replayed: '多次重温',
  backlog: '待玩',
};
