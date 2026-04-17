# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start the server (with hot reload)
npx nodemon src/server.js

# Start the server (without hot reload)
node src/server.js
```

No test runner is configured yet (`npm test` exits with an error).

## Architecture

This is an Express 5 server that applies a **global fixed-window rate limiter** to every incoming request via Redis.

**Request flow:**
1. `src/server.js` — starts the HTTP listener on port 5000
2. `src/app.js` — mounts `rateLimiter` middleware globally before any routes
3. `src/middleware/rateLimiter.js` — increments a per-IP counter in Redis keyed by `rate_limit:<ip>:<window>`, where `<window>` is a minute-granularity timestamp string; allows up to 100 requests per 60-second window, returns 429 on breach
4. `src/config/redis.js` — exports a singleton `ioredis` client connecting to `127.0.0.1:6379`

## Environment

Redis is expected at `127.0.0.1:6379` (hardcoded in `src/config/redis.js`). There is no `.env` file or configuration for a different Redis host/port.

The project uses `"type": "module"` (ES modules) — all source files use `import`/`export` syntax.
