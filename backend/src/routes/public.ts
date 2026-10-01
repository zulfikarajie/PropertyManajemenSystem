import { Hono } from 'hono';
import type { AppEnv } from '../env';
import type { AppDb } from '../db/client';
import { eq } from 'drizzle-orm';
import { roomTypes } from '../db/schema';
import { ok } from '../lib/errors';
import { toPublicRoomType } from '../lib/presenters';
import type { AuthContext } from '../middleware/auth';

type Vars = { db: AppDb; auth: AuthContext };

/**
 * Public (no-auth) catalog used by the homepage `Rooms & Suites` section.
 * Returns ACTIVE room types only. No pagination — the homepage slices the
 * first three client-side, `/rooms` can fetch the full list the same way.
 * Kept intentionally narrow: only what the public site needs.
 */
const pub = new Hono<{ Bindings: AppEnv; Variables: Vars }>();

pub.get('/room-types', async (c) => {
  const rows = await c.get('db').select().from(roomTypes).where(eq(roomTypes.status, 'active'));
  rows.sort((a, b) => (a.name < b.name ? -1 : 1));
  return ok(c, rows.map(toPublicRoomType));
});

export default pub;
