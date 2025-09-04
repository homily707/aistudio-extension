// popup.js 

document.addEventListener('DOMContentLoaded', function() {
  const incognitoToggle = document.getElementById('incognito-toggle');
  const systemInstructions = document.getElementById('system-instructions');
  
  // 从 chrome.storage 获取设置
  chrome.storage.sync.get({
    defaultMode: 'incognito', // 默认值
    defaultSystemInstructions: '' // 默认系统指令为空
  }, function(items) {
    // 设置复选框状态
    incognitoToggle.checked = (items.defaultMode === 'incognito');
    // 设置系统指令文本
    systemInstructions.value = items.defaultSystemInstructions || '';
  });
  
  // 为复选框添加 change 事件
  incognitoToggle.addEventListener('change', function() {
    const mode = this.checked ? 'incognito' : 'normal';
    
    // 将模式保存到 chrome.storage
    chrome.storage.sync.set({
      defaultMode: mode
    }, function() {
      console.log('设置默认模式:', mode);
    });
  });
  
  // 为系统指令文本框添加 input 事件
  let saveTimeout;
  systemInstructions.addEventListener('input', function() {
    // 防抖处理，避免频繁保存
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const instructions = this.value;
      
      // 将系统指令保存到 chrome.storage
      chrome.storage.sync.set({
        defaultSystemInstructions: instructions
      }, function() {
        console.log('已保存默认系统指令');
      });
    }, 500); // 500ms 后保存
  });
  
  // 也可以在失去焦点时立即保存
  systemInstructions.addEventListener('blur', function() {
    clearTimeout(saveTimeout); // 清除防抖定时器
    const instructions = this.value;
    
    // 将系统指令保存到 chrome.storage
    chrome.storage.sync.set({
      defaultSystemInstructions: instructions
    }, function() {
      console.log('已保存默认系统指令');
    });
  });
});