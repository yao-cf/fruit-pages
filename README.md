# 🍉 切水果识字乐园

一个基于 Canvas 的浏览器端汉字学习游戏，通过切水果的方式帮助儿童认识和学习汉字。

## 功能特性

- 🎮 **两种游戏模式**：认字模式（自由练习）和闯关模式（听音辨字）
- 📚 **60 课内置汉字**：覆盖 6 个难度等级，每级 10 课
- 🏆 **等级解锁机制**：完成前一级全部关卡才能解锁下一级
- 💀 **终极挑战**：每级通关后可挑战该级全部汉字汇总
- 🎨 **精美视觉效果**：水果粒子特效、连击动画、屏幕震动、星空背景
- 🔊 **语音朗读**：使用 Web Speech API 朗读汉字发音
- 🎵 **音效系统**：Web Audio API 生成切水果、连击、炸弹音效
- ⚙️ **关卡管理平台**：可视化增删改查等级和关卡，支持批量导入汉字
- 💾 **本地存储**：游戏进度和自定义关卡持久化到 localStorage
- 📱 **响应式设计**：适配桌面和移动端触摸操作

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 Canvas | 游戏渲染引擎 |
| Web Audio API | 音效生成 |
| Web Speech API | 汉字语音朗读 |
| localStorage | 数据持久化 |
| 原生 CSS3 | 界面样式与动画 |
| 原生 JavaScript (ES6+) | 全部游戏逻辑 |

## 文件结构

```
fruit/
├── fruit-slice-game.html    # 主页面（HTML 结构 + 屏幕布局）
├── fruit-slice-game.js      # 游戏逻辑（~940 行，13 个模块）
├── fruit-slice-game.css     # 样式表（~350 行）
└── README.md                # 项目文档
```

## 快速开始

直接在浏览器中打开 `fruit-slice-game.html` 即可运行，无需任何构建工具或服务器。

```bash
# 使用任意 HTTP 服务器（可选）
python3 -m http.server 8000
# 然后访问 http://localhost:8000/fruit-slice-game.html
```

## 代码架构

JS 文件按 13 个模块组织：

| 模块 | 说明 | 核心函数/类 |
|------|------|------------|
| 1. 数据管理 | 存储、默认关卡、进度 | `loadGrades()`, `saveGrades()`, `LESSON_WORDS`, `GRADE_CONFIG` |
| 2. Canvas 背景 | 画布适配、星空背景 | `resizeCanvas()`, `initBgStars()`, `drawBackground()` |
| 3. 音频 & 语音 | 音效、TTS 朗读 | `AudioSys`, `speakWord()` |
| 4. 游戏状态 | 全局变量 | `playing`, `score`, `lives`, `combo` |
| 5. 水果 & 粒子 | 游戏对象 | `FruitObj`, `Particle` |
| 6. UI 辅助 | 弹窗、浮动文字 | `updateUI()`, `showWordPopup()`, `showFloatingText()` |
| 7. 核心逻辑 | 初始化、生成、切割、闯关 | `initGame()`, `spawnFruit()`, `sliceFruit()` |
| 8. 游戏循环 | requestAnimationFrame 主循环 | `gameLoop()` |
| 9. 输入处理 | 触摸/鼠标事件 | `onDown()`, `onMove()`, `onUp()` |
| 10. 场景切换 | 屏幕间跳转 | `showMainMenu()`, `showGradeSelect()` |
| 11. 界面渲染 | 等级/关卡选择卡片 | `renderGradeGrid()`, `renderLevelGrid()` |
| 12. 管理平台 | 增删改查关卡/等级 | `saveLevel()`, `deleteLevel()`, `addGrade()` |
| 13. 按钮事件 | 事件绑定、初始化 | 全局函数暴露 |

## 数据结构

### 等级配置

```js
GRADE_CONFIG = [
    { id: 1, name: '🌟 一级', lessons: [1..10], idOffset: 0 },
    { id: 2, name: '🌟🌟 二级', lessons: [11..20], idOffset: 10 },
    // ... 共 6 级
]
```

### 课程数据格式

```js
LESSON_WORDS = {
    1: '人 rén 口 kǒu 大 dà ...',  // 汉字+拼音，空格分隔
    2: '地 dì 阳 yáng ...',
    // ... 共 60 课
}
```

### 解析后的词对象

```js
{ hanzi: '人', pinyin: 'rén', emoji: '🍎', color: '#FF4444' }
```

### 游戏进度存储

```js
progress = {
    'g1-l1': true,    // 一级第1关已通过
    'g1-l2': true,    // 一级第2关已通过
    'g1-boss': true,  // 一级终极挑战已通过
    // ...
}
```

## 游戏规则

### 认字模式
- 水果从屏幕底部弹出，上面显示汉字
- 滑动切割水果即可得分，同时学习汉字
- 炸弹水果（💣）出现概率 10%，切割会扣一条命
- 连续切割触发连击加成（最高 5x）
- 5 条命，漏掉水果扣命
- 达到目标切水果数和识字数即可通关

### 闯关模式
- 听拼音发音，从 4 个水果中切出正确的字
- 切错第一次给予重试机会
- 切错第二次或目标字溜走两次则闯关失败
- 按顺序完成所有字即闯关成功

## 关卡管理平台

通过主菜单的"关卡管理"进入，支持：

- **等级管理**：新增/删除等级
- **关卡列表**：查看所有等级和关卡详情
- **添加关卡**：自定义关卡，批量导入汉字（格式：`汉字 拼音`，每行一个）
- **重置**：恢复默认配置

## 浏览器兼容性

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+
- 移动端 Chrome / Safari

需要浏览器支持：
- Canvas 2D
- Web Audio API
- Web Speech API（语音朗读，非必需）
- localStorage

## License

MIT
