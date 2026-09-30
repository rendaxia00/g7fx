---
lesson: P27
title_en: "3.7 The Footprint - Understanding Delta Stats"
duration: "01:03:38"
source_language: en
note_language: zh-CN
status: 待复习
tags: [orderflow, lesson, p27]
---

# P27 Footprint 统计：Delta、极值与百分比

> [!summary] 一句话定位
> 解释柱内 Delta、Delta Change、Max/Min Delta 和 Delta Percentage 的计算与用途，强调这些是主动性摘要而非独立信号。

## 本课要解决的问题

- Footprint 表格中的各项 Delta 如何计算？
- 平台口径为什么需要先核对？

## 核心结论

- Bar Delta 通常为 Ask 主动买入量减 Bid 主动卖出量
- Max/Min Delta 记录该柱形成过程中累计 Delta 到过的极值
- Delta Percentage 用净 Delta 相对总量衡量主动性强度
- 计算口径可能有同价或对角比较差异，使用前要确认平台设置

## 中文精读

### Bar Delta

- 整柱 Delta 通常是该柱 Ask 主动买入总量减去 Bid 主动卖出总量。正值表示主动买入相对更多，负值表示主动卖出相对更多。

### 过程极值

- Max Delta 和 Min Delta 记录该柱形成过程中累计 Delta 曾经达到的最高与最低值。它们可显示某一方一度占优、最终却未能保持的过程。

### Delta 百分比与口径

- Delta Percentage 用净 Delta 相对总成交量衡量主动性强度。平台可能采用同价比较或对角比较显示失衡，必须先确认设置，避免用错公式。

## 实际分析步骤

1. 手算一根简单 Footprint
2. 核对 Bar Delta
3. 观察形成过程中的 Max/Min
4. 计算百分比
5. 将统计与价格结果比较

## 常见误区

- ❌ 不同平台公式混用
- ❌ 只看最终 Delta 忽略过程极值
- ❌ 百分比达到阈值就自动交易

## 关键概念

[[Bar Delta|Bar Delta]] · `Delta Change` · `Max Delta` · `Min Delta` · `Delta Percentage`

> 英文只保留在术语对照与主来源中；日常学习直接阅读本页中文内容。

## 主动回忆

1. 不看笔记，用 3 句话解释“Footprint 统计：Delta、极值与百分比”的核心问题。
2. 本课哪些信息属于情境，哪些属于执行层？
3. 写出一个与本课概念一致的“如果—那么—否则”假设。
4. 找一个反例：什么时候本课最直观的解释会失效？
5. 逐条复述“实际分析步骤”，并说明每一步缺失会造成什么错误。

## 练习

- [ ] 完整观看/回放 P27，在关键转折点暂停并先做判断
- [ ] 将 3 个判断与后续市场反馈对照
- [ ] 用 [[交易复盘模板]] 记录一次过程评分
