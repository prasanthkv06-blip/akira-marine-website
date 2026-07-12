// ponytail: vitest runs in node, not a bundler, so the real server-only package's
// bundler-condition check throws. Stub it out for tests only; production build
// still uses the real package via next.config's webpack/turbopack resolution.
export {};
