import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const databaseUrl = process.env.DATABASE_URL || 'file:./data/games.db';

const client = createClient({ url: databaseUrl });

export const db = drizzle(client);

// helper: run raw SQL for DDL (create tables)
export async function execRaw(sql: string) {
  return client.execute(sql);
}
