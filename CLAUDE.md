# AutoScroll

MV3 浏览器扩展（Chrome/Edge/Firefox），键盘快捷键控制网页自动滚屏，无级调速。

## 项目结构

```
manifest.json   — MV3 manifest，storage 权限，content script 注入所有页面
content.js      — 滚动引擎 (rAF) + 键盘/鼠标事件处理
hud.js / .css   — 浮层（右下角速度指示器）
popup.html/.css/.js — 配置面板（快捷键录入、速度、方向、浮层、中英双语）
icons/          — 扩展图标 (16/48/128) + SVG 源文件 + 商店素材
```

## 交互逻辑

- `Ctrl+Space` 启停滚动
- 滚动中 `↑↓` 调速（0.1~20 px/frame，小数累积到 1px 再 scrollBy）
- 按住中键 + 滚轮调速
- `Ctrl+Shift+Space` 切换方向（固定快捷键，不可自定义）

## 关键细节

- 纯原生 JS，无构建步骤
- `chrome.storage.sync` 持久化用户配置，Firefox 兼容 `browser.storage`
- HUD 3 秒后半透明淡化
- 速度低于 1px/f 时 accumulator 累积防止卡帧
- `.claude/` 已加入 .gitignore
- 启停和调速快捷键均可自定义，切换方向为固定快捷键
