import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const sourceRoot = process.env.KB_SOURCE
  ? path.resolve(process.env.KB_SOURCE)
  : path.resolve(siteRoot, "..", "G7FX订单流知识库");
const targetRoot = path.join(siteRoot, "content");

const selections = [
  ["01-课程笔记"],
  ["02-主题MOC"],
  ["02-专题精读"],
  ["03-原子概念"],
  ["04-复习系统", "12周学习路线.md"],
];

function sanitize(markdown) {
  return markdown
    .replace(/\n## 来源与关联[\s\S]*$/m, "\n")
    .replace(/\n## 来源导航[\s\S]*$/m, "\n")
    .replace(/\[([^\]]+)\]\(file:\/\/\/[^)]+\)/gi, "$1")
    .replace(/file:\/\/\/\S+/gi, "")
    .trimEnd() + "\n";
}

async function copyEntry(parts) {
  const source = path.join(sourceRoot, ...parts);
  const target = path.join(targetRoot, ...parts);
  const stat = await fs.stat(source);
  if (stat.isDirectory()) {
    await fs.mkdir(target, { recursive: true });
    for (const entry of await fs.readdir(source, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        await copyEntry([...parts, entry.name]);
      }
    }
    return;
  }
  await fs.mkdir(path.dirname(target), { recursive: true });
  const markdown = await fs.readFile(source, "utf8");
  await fs.writeFile(target, sanitize(markdown), "utf8");
}

await fs.rm(targetRoot, { recursive: true, force: true });
for (const selection of selections) await copyEntry(selection);

console.log(`Public knowledge content synced to ${targetRoot}`);
