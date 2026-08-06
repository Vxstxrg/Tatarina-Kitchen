// Minimal prisma.config.ts for CI: don't import generated client here.
// This file is loaded by Prisma CLI (db push/generate), so it must not depend on
// generated artifacts. Load env variables only.
import "dotenv/config";

// Optionally export an empty config to satisfy module loading in environments
// that attempt to `import` this file.
export default {} as const;
