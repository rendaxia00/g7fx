---
lesson: P24
title_en: "3.4 The Footprint - What is the footprint"
duration: "00:32:59"
source_language: en
note_language: zh-CN
status: 待复习
tags: [orderflow, lesson, p24]
---

# P24 Footprint 原理：从 DOM 到成交记录

> [!summary] 一句话定位
> 证明 Footprint 是 DOM 成交数据的记录形式：DOM 会刷新，Footprint 将已经发生的主动成交保留下来。

## 本课要解决的问题

- DOM 与 Footprint 为什么是同一数据的不同展示？
- 什么信息会被记录，什么不会？

## 核心结论

- 挂单被撤掉并不等于成交；Footprint 只记录实际打印
- 买在 Ask 与卖在 Bid 反映主动性方向
- 柱内数据直到换柱才重置，便于观察一段拍卖过程
- 把 Footprint 当作记录器，而非会预测方向的指标

## 中文精读

### DOM 的瞬时性

- DOM 展示当前挂单队列和刚发生的成交，但市场移动或手动清除后，过去信息很快消失。撤掉的挂单没有成交，不应进入 Footprint 成交统计。

### Footprint 的持久性

- Footprint 把每个价格实际在 Bid/Ask 打印的成交累加到当前柱，直到满足换柱条件才开始新柱，因此相当于成交记录器。

### 验证方法

- 课程通过同时观察 DOM 与 Footprint，逐笔核对打印数字，证明 Footprint 没有创造新信息，只是保存和组织原始成交。

## 实际分析步骤

1. 在模拟回放中并排放置 DOM 与 Footprint
2. 清空 DOM 观察新成交
3. 记录 Bid/Ask 打印
4. 核对 Footprint 累加
5. 重复到能够口头解释每次变化

## 常见误区

- ❌ 把撤单计为成交
- ❌ 认为 Footprint 是二次计算指标
- ❌ 只观察数字不区分主动方向

## 关键概念

`DOM` · `Bid` · `Ask` · `Print` · `Recorder`

> 英文只保留在术语对照与主来源中；日常学习直接阅读本页中文内容。

## 主动回忆

1. 不看笔记，用 3 句话解释“Footprint 原理：从 DOM 到成交记录”的核心问题。
2. 本课哪些信息属于情境，哪些属于执行层？
3. 写出一个与本课概念一致的“如果—那么—否则”假设。
4. 找一个反例：什么时候本课最直观的解释会失效？
5. 逐条复述“实际分析步骤”，并说明每一步缺失会造成什么错误。

## 练习

- [ ] 完整观看/回放 P24，在关键转折点暂停并先做判断
- [ ] 将 3 个判断与后续市场反馈对照
- [ ] 用 [[交易复盘模板]] 记录一次过程评分
