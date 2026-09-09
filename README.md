MATH HANDBOOK PRO — Vietnamese interactive math learning site.

Application routes and architecture are documented in public/design.md.
Local development: npm run dev
Build: npm run build
Type check: node node_modules/typescript/bin/tsc --noEmit

This Sites edition uses React, Vinext, Tailwind, Shadcn, KaTeX and D1.
OPENAI_API_KEY and OPENAI_MODEL are server-only optional settings for AI Tutor.
Keep .env private. .env.example contains names only.

Authoritative user data is stored in D1, scoped by platform-authenticated user ID.
Content lives in lib/content.ts. Existing formula IDs must remain stable across edits.

AI is not configured in the delivered version. PostgreSQL and Clerk are described as a production architecture option in the design document, not claimed as installed.
