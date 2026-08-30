import { execFileSync, spawn } from "node:child_process";
import process from "node:process";

const port = "5181";

function killPort() {
  if (process.platform === "win32") {
    let output = "";
    try {
      output = execFileSync("cmd.exe", ["/d", "/s", "/c", `netstat -ano | findstr :${port}`], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      return;
    }

    const pids = [...output.matchAll(/\sLISTENING\s+(\d+)/g)].map((match) => match[1]);
    for (const pid of new Set(pids)) {
      execFileSync("taskkill.exe", ["/PID", pid, "/T", "/F"], { stdio: "ignore" });
    }
    return;
  }

  try {
    execFileSync("sh", ["-c", `lsof -ti tcp:${port} | xargs -r kill -9`], {
      stdio: "ignore",
    });
  } catch {
    // No process is listening on the port.
  }
}

killPort();

const demo = spawn(
  process.platform === "win32" ? "pnpm.cmd" : "pnpm",
  ["--filter", "@asafarim/navigation-demo", "run", "dev"],
  { stdio: "inherit" }
);

demo.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
