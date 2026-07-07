#!/usr/bin/env node
/**
 * 从 js/content.js 提取论文作者人名（中英文），合并到 js/people.js
 *
 * 用法:
 *   node scripts/extract-people.js          # 仅打印提取结果
 *   node scripts/extract-people.js --write  # 合并写入 js/people.js（保留已有 url）
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CONTENT_PATH = path.join(ROOT, "js", "content.js");
const PEOPLE_PATH = path.join(ROOT, "js", "people.js");

function splitAuthors(str) {
  return str
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function stripMarkers(name) {
  return name.replace(/[\*†‡§]+$/g, "").trim();
}

function loadContentAuthors(contentSrc) {
  const enBlocks = [...contentSrc.matchAll(/en:\s*\{[\s\S]*?publications:\s*\[([\s\S]*?)\],/g)];
  const zhBlocks = [...contentSrc.matchAll(/zh:\s*\{[\s\S]*?publications:\s*\[([\s\S]*?)\],/g)];

  if (!enBlocks.length || !zhBlocks.length) {
    throw new Error("无法在 content.js 中找到 publications 区块");
  }

  const extractFromBlock = (block) => {
    const authors = [...block.matchAll(/authors:\s*"([^"]+)"/g)].map((m) => m[1]);
    return authors.map(splitAuthors);
  };

  return {
    en: extractFromBlock(enBlocks[0][1]),
    zh: extractFromBlock(zhBlocks[0][1]),
  };
}

function mergePeople(enPubs, zhPubs) {
  const map = new Map();

  const addPair = (enName, zhName) => {
    const en = stripMarkers(enName);
    const zh = stripMarkers(zhName);
    if (!en && !zh) return;

    const key = en || zh;
    if (!map.has(key)) {
      map.set(key, { en, zh, url: "", isSelf: false });
      return;
    }
    const entry = map.get(key);
    if (en && !entry.en) entry.en = en;
    if (zh && !entry.zh) entry.zh = zh;
  };

  const pubCount = Math.max(enPubs.length, zhPubs.length);
  for (let i = 0; i < pubCount; i++) {
    const enList = enPubs[i] || [];
    const zhList = zhPubs[i] || [];
    const len = Math.max(enList.length, zhList.length);
    for (let j = 0; j < len; j++) {
      addPair(enList[j] || "", zhList[j] || "");
    }
  }

  return [...map.values()].sort((a, b) => a.en.localeCompare(b.en));
}

function parseExistingPeople(src) {
  if (!src) return [];
  const entries = [...src.matchAll(/\{\s*en:\s*"([^"]*)"\s*,\s*zh:\s*"([^"]*)"\s*,\s*url:\s*"([^"]*)"(?:\s*,\s*isSelf:\s*(true|false))?\s*\}/g)];
  return entries.map((m) => ({
    en: m[1],
    zh: m[2],
    url: m[3],
    isSelf: m[4] === "true",
  }));
}

function mergeWithExisting(extracted, existing) {
  const byEn = new Map(existing.filter((p) => p.en).map((p) => [p.en, p]));
  const byZh = new Map(existing.filter((p) => p.zh).map((p) => [p.zh, p]));

  return extracted.map((person) => {
    const old =
      (person.en && byEn.get(person.en)) ||
      (person.zh && byZh.get(person.zh)) ||
      null;
    if (!old) return person;
    return {
      en: person.en || old.en,
      zh: person.zh || old.zh,
      url: old.url || "",
      isSelf: old.isSelf || false,
    };
  });
}

function formatPeopleJs(people) {
  const lines = people.map((p) => {
    const parts = [
      `en: "${p.en}"`,
      `zh: "${p.zh}"`,
      `url: "${p.url}"`,
    ];
    if (p.isSelf) parts.push("isSelf: true");
    return `  { ${parts.join(", ")} },`;
  });

  return `/**
 * 作者主页链接注册表
 * 运行 node scripts/extract-people.js --write 从 content.js 提取新人名并合并到此文件
 * 填写 url 后，论文作者列表中对应姓名将变为可点击链接
 */
const PEOPLE = [
${lines.join("\n")}
];
`;
}

function main() {
  const write = process.argv.includes("--write");
  const contentSrc = fs.readFileSync(CONTENT_PATH, "utf8");
  const { en, zh } = loadContentAuthors(contentSrc);
  const extracted = mergePeople(en, zh);

  console.log(`从 content.js 提取到 ${extracted.length} 位作者：\n`);
  extracted.forEach((p, i) => {
    console.log(
      `${String(i + 1).padStart(2, " ")}. ${p.en.padEnd(18)} | ${p.zh}`
    );
  });

  if (!write) {
    console.log("\n提示: 运行 node scripts/extract-people.js --write 合并到 js/people.js");
    return;
  }

  const existingSrc = fs.existsSync(PEOPLE_PATH)
    ? fs.readFileSync(PEOPLE_PATH, "utf8")
    : "";
  const existing = parseExistingPeople(existingSrc);
  const merged = mergeWithExisting(extracted, existing);
  fs.writeFileSync(PEOPLE_PATH, formatPeopleJs(merged), "utf8");
  console.log(`\n已写入 ${PEOPLE_PATH}（保留 ${existing.length} 条已有 url）`);
}

main();
