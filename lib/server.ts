let cfEnv: any = null;
try {
  // @ts-ignore
  cfEnv = (await import(/* webpackIgnore: true */ 'cloudflare:workers')).env;
} catch {}

export function getDB(): D1Database {
  const db = cfEnv?.DB;
  if (!db) {
    return {
      prepare: () => ({
        bind: () => ({
          first: async () => null,
          all: async () => ({ results: [] }),
          run: async () => ({ success: true }),
        }),
        first: async () => null,
        all: async () => ({ results: [] }),
        run: async () => ({ success: true }),
      }),
      batch: async () => [{ results: [] }, { results: [] }],
    } as unknown as D1Database;
  }
  return db;
}

export function sameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  return !origin || origin === new URL(req.url).origin;
}
