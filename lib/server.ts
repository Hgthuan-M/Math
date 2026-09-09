import {env} from 'cloudflare:workers';
export function getDB():D1Database{const db=(env as unknown as {DB?:D1Database}).DB;if(!db)throw new Error('Database is not configured');return db}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return !origin||origin===new URL(req.url).origin}
