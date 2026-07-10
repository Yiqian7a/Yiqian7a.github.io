#!/usr/bin/env node
/**
 * 从 git 最新提交生成 assets/site-updated.json
 * 供静态站点在 GitHub API 不可用时作为「最后更新」时间的 fallback
 *
 * 用法: node scripts/update-site-meta.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT_PATH = path.join(ROOT, "assets", "site-updated.json");

function gitValue(format) {
  return execSync(`git log -1 --format=${format}`, {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
}

function main() {
  const payload = {
    updatedAt: gitValue("%cI"),
    commit: gitValue("%H"),
    message: gitValue("%s"),
    source: "git",
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUT_PATH}`);
  console.log(`  updatedAt: ${payload.updatedAt}`);
}

main();
