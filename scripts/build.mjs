import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const kbRoot = process.env.KB_ROOT
  ? path.resolve(process.env.KB_ROOT)
  : path.join(siteRoot, "content");
const out = path.join(siteRoot, "dist");
const publicDir = path.join(siteRoot, "src", "public");
const siteBase = (process.env.SITE_BASE || "").replace(/\/$/, "");

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const slash = (value) => value.split(path.sep).join("/");

const slugify = (value) => value
  .normalize("NFKD")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "") || "item";

async function listMarkdown(dir) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  return items
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(dir, entry.name));
}

async function loadDoc(file, kind, url, order = 0) {
  const raw = await fs.readFile(file, "utf8");
  const parsed = matter(raw);
  const stem = path.basename(file, ".md");
  const h1 = parsed.content.match(/^#\s+(.+)$/m)?.[1]?.trim() || stem;
  return {
    file,
    stem,
    title: h1,
    kind,
    url,
    order,
    data: parsed.data,
    content: parsed.content,
  };
}

const chapterFiles = (await listMarkdown(path.join(kbRoot, "01-课程笔记")))
  .sort((a, b) => Number(path.basename(a).match(/^P(\d+)/)?.[1]) - Number(path.basename(b).match(/^P(\d+)/)?.[1]));

const chapterDocs = await Promise.all(chapterFiles.map(async (file) => {
  const number = Number(path.basename(file).match(/^P(\d+)/)?.[1]);
  return loadDoc(file, "课程章节", `/chapters/p${String(number).padStart(2, "0")}/`, number);
}));

const deepFiles = (await listMarkdown(path.join(kbRoot, "02-专题精读"))).sort();
const deepDocs = await Promise.all(deepFiles.map(async (file, index) => {
  const no = Number(path.basename(file).match(/^专题(\d+)/)?.[1]) || index + 1;
  return loadDoc(file, "专题精读", `/topics/topic${String(no).padStart(2, "0")}/`, no);
}));

const mocFiles = (await listMarkdown(path.join(kbRoot, "02-主题MOC"))).sort();
const mocDocs = await Promise.all(mocFiles.map(async (file, index) => {
  const id = path.basename(file).match(/^MOC-(\d+)/)?.[1] || String(index).padStart(2, "0");
  return loadDoc(file, "知识地图", `/maps/moc-${id}/`, index);
}));

const glossaryFiles = (await listMarkdown(path.join(kbRoot, "03-原子概念")))
  .filter((file) => path.basename(file, ".md") !== "术语总表")
  .sort((a, b) => path.basename(a).localeCompare(path.basename(b), "zh-CN"));

const glossaryDocs = [];
const usedSlugs = new Set();
for (let index = 0; index < glossaryFiles.length; index += 1) {
  const file = glossaryFiles[index];
  const raw = await fs.readFile(file, "utf8");
  const parsed = matter(raw);
  let slug = slugify(parsed.data.term_en || path.basename(file, ".md"));
  if (usedSlugs.has(slug)) slug = `${slug}-${index + 1}`;
  usedSlugs.add(slug);
  glossaryDocs.push(await loadDoc(file, "术语词典", `/glossary/${slug}/`, index));
}

const studyDoc = await loadDoc(
  path.join(kbRoot, "04-复习系统", "12周学习路线.md"),
  "学习路线",
  "/study/",
  0,
);

const allDocs = [...chapterDocs, ...deepDocs, ...mocDocs, ...glossaryDocs, studyDoc];
const wikiMap = new Map(allDocs.map((doc) => [doc.stem, doc.url]));

function cleanPublicContent(content) {
  return content
    .replace(/^> \[!([a-zA-Z-]+)\]\s*([^\n]*)\n>\s*([^\n]+)$/gm, '<aside class="callout $1"><strong>$2</strong><p>$3</p></aside>')
    .replace(/\n## 来源与关联[\s\S]*$/m, "")
    .replace(/\n## 来源导航[\s\S]*$/m, "")
    .replace(/\n> 英文只保留在术语对照与主来源中；日常学习直接阅读本页中文内容。\n?/g, "\n");
}

function resolveWikiLinks(content) {
  return content.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
    const clean = target.trim();
    const text = (label || clean).trim();
    const href = wikiMap.get(clean);
    return href ? `[${text}](${href})` : `**${text}**`;
  });
}

function articleHtml(doc) {
  let source = cleanPublicContent(doc.content);
  source = resolveWikiLinks(source);
  source = source.replace(/^#\s+.+$/m, "");
  return md.render(source);
}

function chapterGroup(number) {
  if (number <= 3) return ["起步与训练", "foundation"];
  if (number <= 10) return ["拍卖市场理论", "amt"];
  if (number <= 20) return ["VWAP 与多周期价值", "vwap"];
  if (number <= 22) return ["累计 Delta", "delta"];
  return ["Footprint", "footprint"];
}

function icon(name) {
  const paths = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M9 20v-6h6v6"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    tag: '<path d="M20 12 12 20l-9-9V4h7z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h3a4 4 0 0 0 4-4v-6a4 4 0 0 1 3-4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    arrow: '<path d="m9 18 6-6-6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name] || paths.book}</svg>`;
}

const primaryNav = [
  ["首页", "/", "home"],
  ["课程章节", "/chapters/", "book"],
  ["专题精读", "/topics/", "layers"],
  ["术语词典", "/glossary/", "tag"],
  ["学习路线", "/study/", "route"],
];

function sidebar(active = "") {
  const nav = primaryNav.map(([label, href, glyph]) => `
    <a class="nav-link ${active === href ? "active" : ""}" href="${href}">
      ${icon(glyph)}<span>${label}</span>
    </a>`).join("");
  const recent = chapterDocs.slice(0, 5).map((doc) => `
    <a class="chapter-mini" href="${doc.url}"><span>P${String(doc.order).padStart(2, "0")}</span>${esc(doc.title.replace(/^P\d+\s*/, ""))}</a>`).join("");
  return `<aside class="sidebar" id="sidebar">
    <div class="brand"><a href="/" aria-label="返回首页"><span class="brand-mark">G7</span><span><b>ORDERFLOW</b><small>订单流知识库</small></span></a></div>
    <nav class="primary-nav">${nav}</nav>
    <div class="sidebar-section"><div class="sidebar-label">从这里开始</div>${recent}</div>
    <div class="sidebar-foot"><span class="status-dot"></span><span>中文知识库 · 持续更新</span></div>
  </aside>`;
}

function shell({ title, description, body, active = "", pageClass = "", head = "", scripts = "" }) {
  const fullTitle = title === "G7FX 订单流知识库" ? title : `${title} · G7FX 订单流知识库`;
  return `<!doctype html>
<html lang="zh-CN" data-theme="dark" data-base="${esc(siteBase)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description || "G7FX 订单流交易课程中文知识库")}">
  <meta name="theme-color" content="#081216">
  <link rel="stylesheet" href="/assets/site.css">
  ${head}
</head>
<body class="${pageClass}">
  ${sidebar(active)}
  <div class="site-frame">
    <header class="topbar">
      <button class="icon-button mobile-menu" id="menuToggle" aria-label="打开导航">${icon("menu")}</button>
      <a class="topbar-search" href="/search/">${icon("search")}<span>搜索知识点、章节或术语</span><kbd>Ctrl K</kbd></a>
      <button class="icon-button" id="themeToggle" aria-label="切换主题">${icon("sun")}</button>
    </header>
    <main>${body}</main>
    <footer><span>G7FX 订单流知识库</span><span>用于学习、回放与过程复盘，不构成投资建议。</span></footer>
  </div>
  <div class="sidebar-scrim" id="sidebarScrim"></div>
  <script src="/assets/site.js" defer></script>
  ${scripts}
</body>
</html>`;
}

async function writePage(url, html) {
  const relative = url === "/" ? "index.html" : path.join(url.replace(/^\//, ""), "index.html");
  const target = path.join(out, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const rendered = siteBase
    ? html.replace(/((?:href|src)=["'])\/(?!\/)/g, `$1${siteBase}/`)
    : html;
  await fs.writeFile(target, rendered, "utf8");
}

function courseCard(doc) {
  const [group, groupClass] = chapterGroup(doc.order);
  const summary = cleanPublicContent(doc.content).match(/>\s*(?!\[!)[^\n]+\n?>?\s*([^\n]+)/)?.[1]
    || cleanPublicContent(doc.content).match(/## 核心结论\s*\n\s*-\s*([^\n]+)/)?.[1]
    || "查看本章中文精读与判断流程。";
  return `<a class="course-card" href="${doc.url}">
    <div class="card-top"><span class="lesson-no">P${String(doc.order).padStart(2, "0")}</span><span class="pill ${groupClass}">${group}</span></div>
    <h3>${esc(doc.title.replace(/^P\d+\s*/, ""))}</h3>
    <p>${esc(summary.replace(/^>\s*/, ""))}</p>
    <div class="card-meta">${icon("clock")}<span>${esc(doc.data.duration || "专题课程")}</span>${doc.data.detail_level === "deep" ? '<span class="deep-badge">深度版</span>' : ""}<span class="card-arrow">${icon("arrow")}</span></div>
  </a>`;
}

function pageHero(kicker, title, lead, extra = "") {
  return `<section class="page-hero"><div><span class="eyebrow">${esc(kicker)}</span><h1>${title}</h1><p>${esc(lead)}</p></div>${extra}</section>`;
}

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.cp(publicDir, path.join(out, "assets"), { recursive: true });

// Home
const featuredTopics = deepDocs.slice(0, 6).map((doc, index) => `
  <a class="topic-card" href="${doc.url}">
    <span class="topic-index">0${index + 1}</span>
    <div><h3>${esc(doc.title.replace(/^专题\d+\s*/, ""))}</h3><p>${[
      "从成交、平衡与失衡理解价格发现。",
      "掌握均值、标准差与三类趋势节奏。",
      "建立日、周、月、季、年价值视角。",
      "理解确认、背离、吸收与库存清洗。",
      "从逐价成交识别努力、结果和被套方。",
      "把准备、假设、执行与复盘连成闭环。",
    ][index]}</p></div>${icon("arrow")}
  </a>`).join("");

const homeBody = `
<section class="home-hero">
  <div class="hero-grid"></div>
  <div class="hero-content">
    <span class="eyebrow">ORDER FLOW KNOWLEDGE BASE</span>
    <h1>看见成交背后的<br><em>市场逻辑</em></h1>
    <p>以英文课程字幕为依据整理的中文订单流知识体系。覆盖拍卖市场理论、VWAP、多周期价值、累计 Delta 与 Footprint。</p>
    <div class="hero-actions"><a class="button primary" href="/chapters/">开始学习 ${icon("arrow")}</a><a class="button ghost" href="/search/">${icon("search")}搜索知识库</a></div>
  </div>
  <div class="market-visual" aria-hidden="true">
    <div class="visual-head"><span>VALUE MIGRATION</span><span class="live"><i></i> KNOWLEDGE MAP</span></div>
    <svg viewBox="0 0 640 300" role="img">
      <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#45e4bd" stop-opacity=".34"/><stop offset="1" stop-color="#45e4bd" stop-opacity="0"/></linearGradient></defs>
      <g class="grid-lines"><path d="M0 45H640M0 105H640M0 165H640M0 225H640M80 0V300M200 0V300M320 0V300M440 0V300M560 0V300"/></g>
      <path class="area" d="M0 245C45 238 58 205 96 211s55-37 91-26 45-55 81-42 52-18 86-32 50 20 82-8 40-72 77-54 52-14 74-35 38-15 53-24v310H0z"/>
      <path class="price-line" d="M0 245C45 238 58 205 96 211s55-37 91-26 45-55 81-42 52-18 86-32 50 20 82-8 40-72 77-54 52-14 74-35 38-15 53-24"/>
      <path class="vwap-line" d="M0 235C100 229 150 216 220 196s150-57 210-74 135-51 210-83"/>
      <g class="nodes"><circle cx="96" cy="211" r="5"/><circle cx="268" cy="143" r="5"/><circle cx="436" cy="103" r="5"/><circle cx="587" cy="14" r="5"/></g>
    </svg>
    <div class="visual-legend"><span><i class="price"></i>价格与价值迁移</span><span><i class="vwap"></i>动态 VWAP</span></div>
  </div>
</section>

<section class="stat-strip">
  <div><strong>29</strong><span>课程章节</span></div><div><strong>42h</strong><span>课程内容</span></div><div><strong>${glossaryDocs.length}</strong><span>核心概念</span></div><div><strong>6</strong><span>专题精读</span></div>
</section>

<section class="content-section intro-section">
  <div class="section-heading"><div><span class="eyebrow">LEARNING PATH</span><h2>从原始成交到完整假设</h2></div><p>不是背诵信号，而是建立一套能够描述、验证和复盘的市场语言。</p></div>
  <div class="pathway">
    <a href="/maps/moc-01/"><span>01</span><b>拍卖与价值</b><small>平衡 · 失衡 · Profile</small></a>
    <i></i><a href="/maps/moc-02/"><span>02</span><b>多周期情境</b><small>VWAP · 动态/静态价值</small></a>
    <i></i><a href="/maps/moc-03/"><span>03</span><b>主动性确认</b><small>累计 Delta · 吸收</small></a>
    <i></i><a href="/maps/moc-04/"><span>04</span><b>微观执行</b><small>Footprint · 被套交易者</small></a>
  </div>
</section>

<section class="content-section">
  <div class="section-heading"><div><span class="eyebrow">FEATURED COURSE</span><h2>课程章节</h2></div><a class="text-link" href="/chapters/">查看全部章节 ${icon("arrow")}</a></div>
  <div class="course-grid">${chapterDocs.slice(3, 9).map(courseCard).join("")}</div>
</section>

<section class="content-section topic-section">
  <div class="section-heading"><div><span class="eyebrow">DEEP DIVES</span><h2>专题精读</h2></div><p>跨章节整理关键概念，适合快速复习与解决具体问题。</p></div>
  <div class="topic-grid">${featuredTopics}</div>
</section>

<section class="cta-panel"><div><span class="eyebrow">READY TO START?</span><h2>先建立框架，再寻找机会</h2><p>从 12 周学习路线开始，把观看、回放、主动回忆与交易复盘连接起来。</p></div><a class="button primary" href="/study/">查看学习路线 ${icon("arrow")}</a></section>`;

await writePage("/", shell({ title: "G7FX 订单流知识库", description: "订单流交易课程中文知识库与全文检索", body: homeBody, active: "/", pageClass: "home-page" }));

// Chapter index
const groups = [
  ["起步与训练", chapterDocs.filter((d) => d.order <= 3)],
  ["拍卖市场理论", chapterDocs.filter((d) => d.order >= 4 && d.order <= 10)],
  ["VWAP 与多周期价值", chapterDocs.filter((d) => d.order >= 11 && d.order <= 20)],
  ["累计 Delta", chapterDocs.filter((d) => d.order >= 21 && d.order <= 22)],
  ["Footprint", chapterDocs.filter((d) => d.order >= 23)],
];
const chapterIndex = `${pageHero("COURSE LIBRARY", "课程章节", "29 个章节，按照课程顺序建立从市场结构到微观执行的完整框架。", `<div class="hero-number">29<small>CHAPTERS</small></div>`)}
<div class="index-layout">
  <nav class="anchor-nav">${groups.map(([name], i) => `<a href="#group-${i}"><span>0${i + 1}</span>${name}</a>`).join("")}</nav>
  <div>${groups.map(([name, docs], i) => `<section class="chapter-group" id="group-${i}"><div class="group-heading"><span>0${i + 1}</span><h2>${name}</h2><small>${docs.length} 个章节</small></div><div class="course-grid">${docs.map(courseCard).join("")}</div></section>`).join("")}</div>
</div>`;
await writePage("/chapters/", shell({ title: "课程章节", description: "G7FX P1 至 P29 中文课程笔记", body: chapterIndex, active: "/chapters/", pageClass: "index-page" }));

// Topic index
const topicIndex = `${pageHero("DEEP DIVES", "专题精读", "把分散在多个视频中的关键概念重新组织成可直接查询的中文专题。")}
<section class="topic-index-grid">${deepDocs.map((doc, i) => `<a class="topic-large" href="${doc.url}"><span class="topic-index">0${i + 1}</span><div><small>专题精读</small><h2>${esc(doc.title.replace(/^专题\d+\s*/, ""))}</h2><p>${["理解成交、价值、平衡与失衡的底层逻辑。","系统区分慢趋势、正常趋势和快趋势。","把日、周、月、季、年价值合成决策情境。","正确使用确认、背离、吸收和库存清洗。","从逐价成交到被套交易者的完整推理链。","建立盘前准备、盘中更新与盘后复盘闭环。"][i]}</p></div>${icon("arrow")}</a>`).join("")}</section>`;
await writePage("/topics/", shell({ title: "专题精读", description: "订单流核心专题中文讲义", body: topicIndex, active: "/topics/", pageClass: "index-page" }));

// Glossary index
const glossaryIndex = `${pageHero("GLOSSARY", "术语词典", "统一中文译名、英文原词、定义、决策用途和常见误用。", `<div class="hero-number">${glossaryDocs.length}<small>TERMS</small></div>`)}
<section class="glossary-grid">${glossaryDocs.map((doc) => `<a href="${doc.url}" class="term-card"><span>${esc(doc.data.term_en || "ORDER FLOW")}</span><h3>${esc(doc.title)}</h3><p>${esc(cleanPublicContent(doc.content).match(/## 定义\s*\n\s*([^#\n]+)/)?.[1]?.trim() || "查看概念定义与使用限制。")}</p>${icon("arrow")}</a>`).join("")}</section>`;
await writePage("/glossary/", shell({ title: "术语词典", description: "订单流、VWAP、Delta 与 Footprint 中英文术语", body: glossaryIndex, active: "/glossary/", pageClass: "index-page" }));

function breadcrumb(doc) {
  const indexUrl = doc.kind === "课程章节" ? "/chapters/" : doc.kind === "专题精读" ? "/topics/" : doc.kind === "术语词典" ? "/glossary/" : "/";
  return `<nav class="breadcrumb"><a href="/">首页</a><span>/</span><a href="${indexUrl}">${doc.kind}</a><span>/</span><b>${esc(doc.title)}</b></nav>`;
}

function docPage(doc, prev = null, next = null) {
  const lesson = doc.kind === "课程章节" ? `P${String(doc.order).padStart(2, "0")}` : doc.kind;
  const pager = prev || next ? `<nav class="doc-pager">${prev ? `<a href="${prev.url}"><small>上一章</small><b>← ${esc(prev.title.replace(/^P\d+\s*/, ""))}</b></a>` : "<span></span>"}${next ? `<a href="${next.url}" class="next"><small>下一章</small><b>${esc(next.title.replace(/^P\d+\s*/, ""))} →</b></a>` : ""}</nav>` : "";
  const tocMatches = [...cleanPublicContent(doc.content).matchAll(/^##\s+(.+)$/gm)].map((m, i) => ({ label: m[1], id: `section-${i + 1}` }));
  let rendered = articleHtml(doc);
  let tocIndex = 0;
  rendered = rendered.replace(/<h2>(.*?)<\/h2>/g, (_, label) => `<h2 id="section-${++tocIndex}">${label}</h2>`);
  const toc = `<aside class="on-this-page"><span>本页内容</span>${tocMatches.map((x) => `<a href="#${x.id}">${esc(x.label)}</a>`).join("")}</aside>`;
  return `${breadcrumb(doc)}<div class="doc-layout"><article class="doc" data-pagefind-body>
    <header class="doc-header"><div class="doc-kicker"><span>${esc(lesson)}</span><span>${esc(doc.data.duration || doc.kind)}</span>${doc.data.detail_level === "deep" ? "<span>英文字幕核验 · 深度版</span>" : ""}</div><h1 data-pagefind-meta="title">${esc(doc.title)}</h1><p>${doc.kind === "课程章节" ? "中文精读 · 判断流程 · 常见误区 · 主动回忆" : "从课程原始框架中提炼的中文知识页面"}</p></header>
    <div class="prose">${rendered}</div>${pager}
  </article>${toc}</div>`;
}

for (let i = 0; i < chapterDocs.length; i += 1) {
  const doc = chapterDocs[i];
  await writePage(doc.url, shell({ title: doc.title, description: `${doc.title}中文知识点总结`, body: docPage(doc, chapterDocs[i - 1], chapterDocs[i + 1]), active: "/chapters/", pageClass: "doc-page" }));
}

for (const doc of deepDocs) {
  await writePage(doc.url, shell({ title: doc.title, description: `${doc.title}中文专题讲义`, body: docPage(doc), active: "/topics/", pageClass: "doc-page" }));
}

for (const doc of mocDocs) {
  await writePage(doc.url, shell({ title: doc.title, description: `${doc.title}知识地图`, body: docPage(doc), pageClass: "doc-page" }));
}

for (const doc of glossaryDocs) {
  await writePage(doc.url, shell({ title: doc.title, description: `${doc.title}订单流术语解释`, body: docPage(doc), active: "/glossary/", pageClass: "doc-page" }));
}

await writePage("/study/", shell({ title: "12周学习路线", description: "G7FX 订单流课程十二周学习与复习计划", body: docPage(studyDoc), active: "/study/", pageClass: "doc-page" }));

const searchBody = `${pageHero("FULL-TEXT SEARCH", "搜索知识库", "输入中文关键词、英文术语或课程编号，检索全部公开知识页面。")}
<section class="search-shell" data-pagefind-ignore><div id="search"></div><div class="search-hints"><span>试试：</span><a href="?q=慢趋势">慢趋势</a><a href="?q=吸收">吸收</a><a href="?q=动态价值">动态价值</a><a href="?q=Footprint">Footprint</a></div></section>`;
const searchHead = '<link href="/pagefind/pagefind-ui.css" rel="stylesheet">';
const searchScripts = `<script src="/pagefind/pagefind-ui.js"></script><script>
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const instance = new PagefindUI({ element: '#search', baseUrl: '${siteBase || "/"}', showSubResults: true, showImages: false, resetStyles: false, translations: { placeholder: '搜索章节、概念或术语…', clear_search: '清除', load_more: '加载更多', search_label: '搜索', filters_label: '筛选', zero_results: '没有找到 [SEARCH_TERM] 的相关内容', many_results: '[COUNT] 条结果', one_result: '1 条结果', alt_search: '没有找到 [SEARCH_TERM]，显示 [DIFFERENT_TERM] 的结果', search_suggestion: '没有找到 [SEARCH_TERM]，请尝试：' } });
  const q = params.get('q'); if (q) setTimeout(() => instance.triggerSearch(q), 80);
});
</script>`;
await writePage("/search/", shell({ title: "搜索知识库", description: "全文搜索 G7FX 订单流知识库", body: searchBody, active: "/search/", pageClass: "search-page", head: searchHead, scripts: searchScripts }));

const manifest = {
  generatedAt: new Date().toISOString(),
  chapters: chapterDocs.length,
  topics: deepDocs.length,
  glossary: glossaryDocs.length,
  source: slash(path.relative(siteRoot, kbRoot)),
};
await fs.writeFile(path.join(out, "build-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

console.log(`Built ${chapterDocs.length} chapters, ${deepDocs.length} topics, ${glossaryDocs.length} glossary pages.`);
