// content.js - 在目标页面执行的脚本

// 从 chrome.storage 获取默认模式设置
function getDefaultMode(callback) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get({
      defaultMode: 'incognito' // 默认值
    }, function(items) {
      callback(items.defaultMode);
    });
  } else {
    // 如果在非扩展环境中运行，默认使用隐身模式
    callback('incognito');
  }
}

// 根据设置执行默认操作
function injectDefaultSetting() {
  getDefaultMode(function(defaultMode) {
    console.log('当前默认模式:', defaultMode);
    
    if (defaultMode === 'incognito') {
      toggleIncognitoMode();
    } else {
      console.log('设置为普通模式，不自动切换隐身模式');
    }
  });
}


function toggleIncognitoMode() {
  let button = document.querySelector('button[aria-label="Temporary chat toggle"]');
  if (button) {
    console.log('找到隐身模式按钮，准备点击...');
    // 检查按钮当前状态
    const isPressed = button.classList.contains('ms-button-active');
    if (!isPressed) {
      button.click();
      console.log('已自动开启隐身模式');
    } else {
      console.log('隐身模式已经开启');
    }
  } else {
    console.log('未找到隐身模式按钮，可能需要等待页面完全加载');
  }
}

// 主要执行函数
function main() {
  console.log('AI Studio Auto Toggle: 开始执行');
  // 立即尝试一次
  injectDefaultSetting();
  
  // 如果没找到，设置定时器持续查找
  let attempts = 0;
  const maxAttempts = 20; // 最多尝试20次
  const interval = setInterval(() => {
    attempts++;
    
    if (hasAutoToggled()) {
      clearInterval(interval);
      return;
    }
    
    if (attempts >= maxAttempts) {
      console.log('达到最大尝试次数，停止查找');
      clearInterval(interval);
      return;
    }
    
    injectDefaultSetting();
  }, 500); // 每500毫秒尝试一次
}

function hasAutoToggled() {
  const button = document.querySelector('button[aria-label="Temporary chat toggle"]');
  return button && button.classList.contains('ms-button-active');
}

// 使用多种方式确保脚本执行
// 1. 立即执行
main();

// 2. 监听DOMContentLoaded事件
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

// 3. 监听 'New Chat' 按钮点击（清空对话）
function setupNewChatObserver() {
  // 使用事件委托监听整个文档的点击事件
  document.addEventListener('click', (event) => {
    // 检查点击的是否是 New Chat 链接
    const newChatLink = event.target.closest('a[href="/prompts/new_chat"]');
    if (newChatLink) {
      console.log('检测到 New Chat 被点击，准备重新开启隐身模式');
      
      // 延迟执行，等待页面切换完成
      setTimeout(() => {
        if (!hasAutoToggled()) {
          toggleIncognitoMode();
        }
      }, 500);
    }
  }, true); // 使用捕获阶段以确保能捕获到事件
}

// 设置监听
setupNewChatObserver();

console.log('AI Studio Auto Toggle: 脚本已加载');