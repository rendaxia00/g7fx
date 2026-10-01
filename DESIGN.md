---
name: "G7FX 订单流知识库"
description: "面向中文订单流学习者的专业课程手册与证据索引"
colors:
  night-ink: "#071014"
  night-ink-soft: "#0b171c"
  panel: "#0d1c21"
  panel-raised: "#11242a"
  text-primary: "#e9f5f2"
  scale-gray: "#88a39d"
  scale-gray-dim: "#5e7771"
  evidence-mint: "#45e4bd"
  evidence-mint-deep: "#1fbf9a"
  mint-contrast: "#05231b"
  signal-blue: "#65a9ff"
  stage-amber: "#ffb767"
  delta-red: "#ff7a86"
  paper-bg: "#f5f9f7"
  paper-soft: "#eaf2ef"
  paper-panel: "#ffffff"
  paper-panel-raised: "#eff6f3"
  ink-green: "#102620"
  light-scale-gray: "#58716a"
  light-scale-gray-dim: "#7b918b"
  light-evidence-mint: "#087f68"
  light-evidence-mint-deep: "#0a9b7d"
  light-signal-blue: "#2b6ecb"
  light-stage-amber: "#b96508"
  light-delta-red: "#c53c4a"
  line-subtle: "rgba(159, 209, 197, .13)"
  navigation-scrim: "rgba(0, 0, 0, .55)"
  media-black: "#000000"
typography:
  display:
    fontFamily: "Noto Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(46px, 5.6vw, 82px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Noto Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(32px, 4vw, 52px)"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Noto Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Noto Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  action:
    fontFamily: "Noto Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.88em"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  xs: "5px"
  sm: "8px"
  md: "10px"
  media: "11px"
  brand: "12px"
  topic: "13px"
  lg: "14px"
  card: "15px"
  xl: "18px"
  pill: "999px"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
  section: "76px"
components:
  button-primary:
    backgroundColor: "{colors.evidence-mint}"
    textColor: "{colors.mint-contrast}"
    typography: "{typography.action}"
    rounded: "{rounded.md}"
    padding: "0 19px"
    height: "44px"
  button-ghost:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-primary}"
    typography: "{typography.action}"
    rounded: "{rounded.md}"
    padding: "0 19px"
    height: "44px"
  search-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.scale-gray}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 11px"
    height: "38px"
  course-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "20px"
  metadata-chip:
    backgroundColor: "{colors.night-ink-soft}"
    textColor: "{colors.scale-gray}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
---

# Design System: G7FX 订单流知识库

## Overview

**Creative North Star: "订单流作战手册"**

这套系统像一本在交易台旁反复翻阅的专业训练手册：深色基底压低环境噪声，证据薄荷只标记可行动、可定位或已激活的信息。它不模拟交易所，也不追求刺激感；设计的任务是让章节结构、术语关系和证据位置更容易被理解与复习。

界面以冷静的二维分层和紧凑但不拥挤的信息密度组织内容。大标题建立章节方向，Manrope 标签和数字承担索引功能，Noto Sans SC 负责连续中文阅读。细边框比阴影更常用，阴影仅用于关键面板或交互抬升。

**Key Characteristics:**
- 专业、冷静、严谨，并保持明确的教学导向。
- 以章节、证据和复习路径为中心，而不是模拟实时交易终端。
- 深色优先并提供语义一致的浅色主题。
- 强调色克制使用，信息层级主要依靠字号、间距、边框和表面色差建立。
- 动效短促、功能性明确，并尊重减少动态效果偏好。

## Colors

色彩语言由夜盘墨黑、证据薄荷与刻度灰构成；蓝、琥珀和红只承担课程类别与数据语义，浅色主题保持相同的角色关系。

### Primary
- **证据薄荷：**用于当前导航、关键链接、章节编号、主操作、证据标记和焦点状态；它表达“可行动或可定位”，而非装饰性兴奋。
- **深证据薄荷：**用于同一语义下的较深状态与浅色主题对照，不形成第二套品牌色。

### Secondary
- **信号蓝：**用于 VWAP 等独立技术类别，帮助学习者区分概念族。
- **阶段琥珀：**用于 AMT 阶段或提示性分类，不替代警告色。

### Tertiary
- **Delta 红：**用于 Delta 分类和负向语义提示，避免扩大到大面积背景。

### Neutral
- **夜盘墨黑：**页面主背景，降低长时间学习时的视觉噪声。
- **柔夜墨与训练面板：**建立侧栏、卡片、输入框和次级容器层次。
- **主文字白与刻度灰：**分别承担结论阅读、解释文本与辅助标记。
- **纸面浅绿与墨绿文字：**用于浅色主题，保持低眩光而非纯白办公软件感。

**证据色稀缺规则。** 证据薄荷只用于交互、定位、状态和结构锚点；不得把整屏变成霓虹绿光或交易所促销界面。

**语义颜色守恒规则。** 蓝、琥珀和红保持稳定的概念分类含义，不因页面不同而随意换色。

## Typography

**Display Font:** Noto Sans SC（回退至 Microsoft YaHei 与系统无衬线字体）  
**Body Font:** Noto Sans SC（回退至 Microsoft YaHei 与系统无衬线字体）  
**Label/Mono Font:** Manrope（回退至系统无衬线字体；代码内容使用系统等宽字体）

**Character:** 中文主字体负责稳定、清楚的长篇教学阅读；Manrope 仅出现在编号、时长、英文术语、标签和快捷键中，形成类似手册索引与仪表刻度的辅助通道。

### Hierarchy
- **Display**（800，流体 46–82px，1.08）：仅用于首页核心标题，建立产品方向。
- **Headline**（800，流体 32–52px，1.18）：用于章节标题和页面主标题。
- **Title**（700，约 18–25px，1.45）：用于分节标题、卡片标题和视频模块标题。
- **Body**（400，14–16px，1.7）：用于中文解释、论证和复习材料；阅读列保持受控宽度。
- **Label**（700，12px，宽字距）：用于章节编号、时长、类型、快捷键和系统状态，通常采用英文大写或短文本。

**双通道排版规则。** Noto Sans SC 承担知识解释，Manrope 承担索引与数据；不得让大段中文正文使用 Manrope，也不得用多种展示字体制造装饰性层级。

## Layout

桌面布局采用固定侧栏、吸顶顶栏与内容画布三段结构。侧栏宽度为 260px，顶栏高度为 68px；正文页面使用最大 1180px 的居中网格，由不超过 790px 的阅读列与 190px 的页内目录组成，并以 70px 间隔分离。

首页以两栏英雄区、四项统计条、三列课程卡片和两列专题卡片组织。大区块使用流体水平边距，章节内容保持单一阅读轴。1120px 以下收拢多列网格并移除页内目录，820px 以下把侧栏改为抽屉，580px 以下进入单列并压缩外边距。

间距以 4、8、12、20、32、56 和 76px 形成从标签到页面区块的递进。移动端仍需保持内容分组，不以缩小字体代替重排。

**阅读轴优先规则。** 长篇知识内容始终保持清晰的单一阅读轴；辅助目录、视频和翻页控件服务于定位，不与正文争夺主视觉。

## Elevation & Depth

系统默认保持平面，以背景色差、半透明细边框和局部模糊建立层次。环境阴影只出现在首页市场示意、重点行动面板、视频容器及卡片悬停状态；浅色主题使用更轻、更偏绿色的阴影以维持同样的空间关系。

### Shadow Vocabulary
- **环境抬升：**用于重点面板和悬停卡片，提供宽而柔和的空间分离。
- **操作抬升：**主按钮使用中性阴影，不使用彩色光晕。
- **视频承托：**用于课程视频容器，区别外部媒体与正文。

**默认平面规则。** 普通卡片静止时依靠色面和边框分层；阴影只作为重点层级或交互反馈，不成为所有容器的常驻装饰。

## Shapes

形状语言以轻度圆角矩形为主：小型控件使用 8–10px，卡片使用 13–16px，主视觉和大型行动面板使用 18px。元数据与分类标签使用完整胶囊形；正文引语和提示采用完整细边框与紧凑圆角，强化“摘录与批注”感觉。

边框保持细、低对比，圆角不与卡片尺寸成比例膨胀。图标使用 1.7px 的圆端线框，避免实心金融图标和拟物按钮。

## Components

### Buttons
- **Shape:**紧凑的柔和矩形，最小高度 44px。
- **Primary:**证据薄荷背景配深色文字，用于主要学习动作。
- **Hover / Focus:**悬停轻微上移并增强亮度；键盘焦点必须使用清晰的薄荷色轮廓。
- **Secondary / Ghost:**透明或训练面板背景配细边框，悬停时边框与文字转为证据薄荷。

### Chips
- **Style:**胶囊形、低对比背景与细边框；章节编号和深度状态可使用薄荷语义。
- **State:**类别色只作用于文字或小面积边框，不填满大块区域。

### Cards / Containers
- **Corner Style:**课程卡片使用中等圆角，重点面板使用更大圆角。
- **Background:**以训练面板和抬升面板色区分层次。
- **Shadow Strategy:**静止状态默认无阴影，悬停或重点容器才抬升。
- **Border:**统一使用低对比青灰细边框。
- **Internal Padding:**常规卡片以 20px 为基准，较大专题与行动面板适度增加。

### Inputs / Fields
- **Style:**深色训练面板、细边框与 10–13px 圆角，搜索控件保持单行紧凑。
- **Focus:**边框转为证据薄荷并提供可见焦点轮廓。
- **Error / Disabled:**错误使用 Delta 红但不铺满背景；禁用状态降低文字与边框对比度。

### Navigation

桌面侧栏固定显示，活动项使用薄荷文字、低透明薄荷底色和左侧 3px 定位线。移动端侧栏变为抽屉并配遮罩；关闭动作支持遮罩点击、导航选择与 Escape 键。顶栏搜索是全局知识入口，必须持续可见或保留等价图标入口。

### Lesson Video

视频模块是正文前的独立学习工具：使用 16:9 媒体框、重点面板表面、课程时长和外部原视频入口。播放器视觉上从属于章节标题，不得成为自动播放的首页广告位。

### Knowledge Callout

知识提示使用轻薄荷底色、左侧 3px 证据线和紧凑标题，适合“一句话定位”、关键结论与警告；同一屏避免连续堆叠多个同权重提示框。

## Do's and Don'ts

### Do:
- **Do**让章节编号、标题、摘要、视频、正文和复习问题形成稳定的学习顺序。
- **Do**用证据薄荷标记交互与定位，用刻度灰承载辅助信息。
- **Do**优先通过字号、留白、表面色差和细边框建立层级。
- **Do**同时验证深色、浅色、桌面和移动布局。
- **Do**保留清楚的键盘焦点、减少动态效果模式和可读中文行高。

### Don't:
- **Don't**引入交易所广告感、加密货币霓虹风、游戏化徽章或拥挤数据大屏。
- **Don't**把证据薄荷扩张为大面积发光背景或持续闪烁效果。
- **Don't**使用无信息价值的装饰图表、收益数字或虚构实时行情。
- **Don't**让多个卡片都使用常驻重阴影，也不要用玻璃拟态替代真实层级。
- **Don't**用过多英文、缩写或极小字号增加专业感；教学可读性始终优先。
