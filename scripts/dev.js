import { join, normalize } from "path";

const rootDir = process.cwd();
const distDir = join(rootDir, "dist");

function runBuildOnce() {
  const result = Bun.spawnSync({
    cmd: [
      process.execPath,
      "build",
      "src/index.html",
      "--outdir",
      "dist",
      "--target",
      "browser",
      "--sourcemap"
    ],
    stdout: "inherit",
    stderr: "inherit"
  });

  if (result.exitCode !== 0) {
    process.exit(result.exitCode ?? 1);
  }
}

function startBuildWatcher() {
  return Bun.spawn({
    cmd: [
      process.execPath,
      "build",
      "src/index.html",
      "--outdir",
      "dist",
      "--target",
      "browser",
      "--sourcemap",
      "--watch"
    ],
    stdout: "inherit",
    stderr: "inherit"
  });
}

function resolveFilePath(urlPathname) {
  const rawPath = decodeURIComponent(urlPathname);
  const relativePath = rawPath === "/" ? "index.html" : rawPath.replace(/^\/+/, "");
  let normalizedPath = normalize(relativePath);
  while (normalizedPath.startsWith("../") || normalizedPath.startsWith("..\\")) {
    normalizedPath = normalizedPath.slice(3);
  }
  return join(distDir, normalizedPath);
}

runBuildOnce();

const watcher = startBuildWatcher();

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const filePath = resolveFilePath(url.pathname);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    const fallback = Bun.file(join(distDir, "index.html"));
    return new Response(fallback, { status: 404 });
  }
});

console.log(`Dev server: ${server.url}`);

function shutdown() {
  watcher.kill();
  server.stop(true);
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
