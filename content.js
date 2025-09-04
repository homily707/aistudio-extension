// content.js - 在目标页面执行的脚本

// 从 chrome.storage 获取默认模式设置
function getDefaultMode(callback) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      chrome.storage.sync.get({
        defaultMode: 'incognito' // 默认值
      }, function(items) {
        if (chrome.runtime.lastError) {
          console.log('扩展上下文失效，使用默认值');
          callback('incognito');
        } else {
          callback(items.defaultMode);
        }
      });
    } catch (error) {
      console.log('chrome.storage 访问错误:', error);
      callback('incognito');
    }
  } else {
    // 如果在非扩展环境中运行，默认使用隐身模式
    callback('incognito');
  }
}

// 从 chrome.storage 获取默认系统指令
function getDefaultSystemInstructions(callback) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      chrome.storage.sync.get({
        defaultSystemInstructions: '' // 默认值为空
      }, function(items) {
        if (chrome.runtime.lastError) {
          console.log('扩展上下文失效，使用默认值');
          callback('');
        } else {
          callback(items.defaultSystemInstructions);
        }
      });
    } catch (error) {
      console.log('chrome.storage 访问错误:', error);
      callback('');
    }
  } else {
    // 如果在非扩展环境中运行，返回空字符串
    callback('');
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
  
  // 获取并注入默认系统指令
  getDefaultSystemInstructions(function(instructions) {
    if (instructions && instructions.trim() !== '') {
      console.log('找到默认系统指令，准备注入...');
      injectSystemInstructions(instructions);
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

// 注入系统指令
function injectSystemInstructions(instructions) {
  // 检查是否已经注入过相同的指令
  if (window._aistudio_last_injected_instructions === instructions) {
    console.log('系统指令已经注入过，跳过');
    return;
  }
  
  // 首先点击系统指令按钮
  let siButton = document.querySelector('button[aria-label="System instructions"]');
  if (siButton) {
    console.log('找到系统指令按钮，准备点击...');
    siButton.click();
    
    // 等待一下让文本框显示出来
    setTimeout(() => {
      // 查找文本框并输入内容
      let textarea = document.querySelector('textarea[aria-label="System instructions"]');
      if (textarea) {
        // 检查当前值是否已经是我们想要的值
        if (textarea.value.trim() === instructions.trim()) {
          console.log('系统指令已经存在，无需重复注入');
          return;
        }
        
        console.log('找到系统指令文本框，准备输入内容...');
        textarea.value = instructions;
        // 触发 input 事件以确保页面检测到内容变化
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 记录已注入的指令
        window._aistudio_last_injected_instructions = instructions;
        console.log('已注入默认系统指令');
      } else {
        console.log('未找到系统指令文本框');
      }
    }, 500);
  } else {
    console.log('未找到系统指令按钮');
  }
}

// 主要执行函数
function main() {
  console.log('AI Studio Auto Toggle: 开始执行');
  
  // 检查是否已经执行过
  if (window._aistudio_extension_executed) {
    console.log('AI Studio Auto Toggle: 已经执行过，跳过');
    return;
  }
  
  // 检查页面是否已经加载完成
  if (document.readyState !== 'complete') {
    console.log('页面未完全加载，等待...');
    return;
  }
  
  // 标记为已执行
  window._aistudio_extension_executed = true;
  
  // 延迟执行，确保页面完全初始化
  setTimeout(() => {
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
    }, 1000); // 每秒尝试一次
  }, 1000); // 给页面 1 秒时间完全加载
}

function hasAutoToggled() {
  const button = document.querySelector('button[aria-label="Temporary chat toggle"]');
  return button && button.classList.contains('ms-button-active');
}

// 只在页面完全加载后执行
if (document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main);
}

// 3. 监听 'New Chat' 按钮点击（清空对话）
function setupNewChatObserver() {
  // 使用事件委托监听整个文档的点击事件
  document.addEventListener('click', (event) => {
    // 检查点击的是否是 New Chat 链接
    const newChatLink = event.target.closest('a[href="/prompts/new_chat"]');
    if (newChatLink) {
      console.log('检测到 New Chat 被点击，准备注入默认配置');
      
      // 重置执行标记，因为这是一个新的对话
      window._aistudio_extension_executed = false;
      window._aistudio_last_injected_instructions = null;
      
      // 延迟执行，等待页面切换完成
      setTimeout(() => {
        main();
      }, 500);
    }
  }, true); // 使用捕获阶段以确保能捕获到事件
}

// 设置监听
setupNewChatObserver();

console.log('AI Studio Auto Toggle: 脚本已加载');