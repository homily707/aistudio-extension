// popup.js 

document.addEventListener('DOMContentLoaded', function() {
  const defaultModeSelect = document.getElementById('default-mode');
  const statusDiv = document.getElementById('status');
  
  // 从 chrome.storage 获取默认模式设置
  chrome.storage.sync.get({
    defaultMode: 'incognito' // 默认值
  }, function(items) {
    defaultModeSelect.value = items.defaultMode;
    updateStatus(items.defaultMode);
  });
  
  // 监听下拉选择框的变化
  defaultModeSelect.addEventListener('change', function() {
    const newMode = this.value;
    
    // 将新的模式保存到 chrome.storage
    chrome.storage.sync.set({
      defaultMode: newMode
    }, function() {
      console.log('设置默认模式:', newMode);
      updateStatus(newMode);
    });
  });
  
  // 更新状态显示
  function updateStatus(mode) {
    if (mode === 'incognito') {
      statusDiv.textContent = '隐身模式已启用';
      statusDiv.className = 'status enabled';
    } else {
      statusDiv.textContent = '普通模式已启用';
      statusDiv.className = 'status disabled';
    }
  }
});