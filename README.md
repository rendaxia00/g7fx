# G7FX 订单流知识网站

基于英文主字幕核验后的中文知识卡片生成，29 个章节均包含对应课程视频、深度讲解、证据与失效条件、英文字幕时间定位、复习问题和全文搜索。仓库不包含英文逐字稿和原始字幕。

课程视频来自哔哩哔哩的 [G7FX Pro 合集](https://space.bilibili.com/3546562401667401/lists/9188243?type=season)，章节与视频的映射保存在 `data/course-videos.json`。

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
