# AI Studio Auto Toggle 扩展

这是一个Chrome扩展，用于在Google AI Studio的新建聊天页面自动开启隐身模式。

## 功能说明

1. **自动切换**：首次访问 https://aistudio.google.com/prompts/new_chat 时，自动点击隐身模式按钮
2. **一次性执行**：使用localStorage记录，确保只在首次访问时执行，不干扰后续用户操作
3. **智能检测**：通过多种选择器策略查找按钮，处理动态加载的内容
4. **状态管理**：提供弹出窗口查看和重置状态

## 项目结构

```
aistudio-extension/
├── manifest.json       # 扩展配置文件
├── content.js         # 内容脚本（核心功能）
├── background.js      # 后台服务工作线程
├── popup.html         # 弹出窗口界面
├── popup.js          # 弹出窗口脚本
├── icon.svg          # 扩展图标
└── target.html       # 目标按钮的HTML示例
```

## 安装步骤

1. **准备图标文件**
   - 将 icon.svg 转换为以下PNG文件（可以使用在线转换工具）：
     - icon16.png (16x16)
     - icon48.png (48x48) 
     - icon128.png (128x128)

2. **加载扩展**
   - 打开Chrome浏览器
   - 访问 chrome://extensions/
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择此文件夹

3. **测试功能**
   - 访问 https://aistudio.google.com/prompts/new_chat
   - 观察隐身模式是否自动开启
   - 查看控制台日志（F12 -> Console）

## 核心代码解析

### 1. manifest.json
```json
{
  "manifest_version": 3,        // 使用Manifest V3
  "content_scripts": [{         // 内容脚本配置
    "matches": ["目标URL"],
    "js": ["content.js"],
    "run_at": "document_idle"  // 页面空闲时执行
  }]
}
```

### 2. content.js 主要功能
```javascript
// 使用localStorage避免重复执行
function hasAutoToggled() {
  return localStorage.getItem('aistudio_incognito_toggled') === 'true';
}

// 多种选择器策略查找按钮
const selectors = [
  'button[aria-label="Temporary chat toggle"]',
  'ms-incognito-mode-toggle button',
  // ...
];

// MutationObserver监听页面变化
const observer = new MutationObserver((mutations) => {
  // 处理动态加载的内容
});
```

### 3. 关键技术点

**DOM操作**
- `document.querySelector()` - 查找元素
- `element.click()` - 模拟点击
- `element.getAttribute()` - 获取属性值

**异步处理**
- `setInterval` - 定时尝试
- `setTimeout` - 延迟执行
- `MutationObserver` - 监听DOM变化

**存储机制**
- `localStorage` - 页面级存储
- `chrome.storage` - 扩展级存储

## 调试技巧

1. **查看控制台日志**
   - 在目标页面按F12打开开发者工具
   - 查看Console标签的输出

2. **调试内容脚本**
   - 在Sources -> Content scripts中找到并设置断点

3. **调试背景脚本**
   - 在扩展管理页面点击"service worker"

4. **重新加载扩展**
   - 修改代码后，在扩展管理页面点击刷新按钮

## 注意事项

1. Chrome扩展的安全限制：
   - 内容脚本无法直接访问页面JavaScript变量
   - 需要通过DOM操作与页面交互

2. Manifest V3的变化：
   - 使用Service Worker代替后台页面
   - 某些API的使用方式有所改变

3. 性能优化：
   - 合理使用定时器，避免过度消耗资源
   - 及时清理不需要的监听器

## 扩展功能建议

如果你想进一步学习，可以尝试添加以下功能：

1. **配置选项**：让用户选择是否自动切换
2. **快捷键支持**：添加键盘快捷键
3. **更多站点支持**：扩展到其他类似网站
4. **统计功能**：记录使用情况
5. **主题切换**：暗色/亮色模式

## 学习要点

通过这个项目，你学习了：

1. **Chrome扩展开发基础**
   - Manifest文件结构
   - 内容脚本和后台脚本
   - 权限系统

2. **前端JavaScript技能**
   - DOM操作和事件处理
   - 异步编程模式
   - 浏览器存储API

3. **调试和开发技巧**
   - 浏览器开发者工具使用
   - 问题排查方法
   - 代码组织结构

继续探索，你可以开发更复杂的浏览器扩展！