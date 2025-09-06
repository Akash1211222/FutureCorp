// scripts/dev-auto.mjs
import { spawn } from "node:child_process";
import getPort, { portNumbers } from "get-port";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const serverDir = path.join(repoRoot, "server");
const clientDir = path.join(repoRoot, "client");

(async () => {
  // 1) Find a free port in the range 5050..5059
  const port = await getPort({ port: portNumbers(5050, 5060) });
  const viteApiUrl = `http://localhost:${port}/api`;

  console.log(`\n✅ Using PORT=${port}`);
  console.log(`✅ Using VITE_API_URL=${viteApiUrl}\n`);

  // 2) Start server (inherits env + sets PORT)
  const server = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "dev", "--prefix", serverDir],
    {
      stdio: "inherit",
      env: { ...process.env, PORT: String(port) },
    }
  );

  // 3) Start client with the chosen API URL injected at runtime
  const client = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "cross-env",
      `VITE_API_URL=${viteApiUrl}`,
      "npm",
      "--prefix",
      clientDir,
      "run",
      "dev",
    ],
    { stdio: "inherit", env: process.env }
  );

  // 4) Clean exit handling
  const shutdown = () => {
    server.kill("SIGTERM");
    client.kill("SIGTERM");
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})();