# G7FX 订单流知识网站

基于中文知识卡片生成的静态课程网站，包含章节总结、专题精读、术语词典、学习路线与全文搜索。仓库不包含英文逐字稿和原始字幕。

## 本地运行

```powershell
npm install
npm run build
npm run preview
```

打开 `http://localhost:4173/`。

## 内容更新

网站发布内容保存在 `content/`。如果同级工作区存在完整的 `G7FX订单流知识库`，先同步公开内容，再重新构建：

```powershell
npm run sync-content
npm run build
```

## 部署

推送到 `main` 分支后，GitHub Actions 会构建网站并自动部署到 GitHub Pages。
