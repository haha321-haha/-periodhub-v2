// 错误监听和调试工具
// /Users/duting/Downloads/money💰/--main/utils/debugTools.js

export const setupErrorDebugging = () => {
  // 监听所有未捕获的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    console.group('🚨 Unhandled Promise Rejection');
    console.error('Reason:', event.reason);
    console.error('Promise:', event.promise);
    
    // 检查是否是403错误相关
    if (event.reason && typeof event.reason === 'object') {
      if (event.reason.code === 403 || event.reason.httpStatus === 200) {
        console.warn('This might be affecting title updates!');
        console.error('Full error object:', JSON.stringify(event.reason, null, 2));
      }
    }
    
    console.groupEnd();
    
    // 不阻止默认行为，但记录错误
    // event.preventDefault(); // 取消注释来阻止错误显示在控制台
  });

  // 监听所有网络请求
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args)
      .then(response => {
        if (response.status === 403) {
          console.warn('🚫 403 Forbidden request detected:', args[0]);
        }
        return response;
      })
      .catch(error => {
        console.error('🌐 Network error:', error, 'URL:', args[0]);
        throw error;
      });
  };
};

// 检查具体的403错误来源
export const debugNetwork = () => {
  // 检查所有正在进行的网络请求
  if (window.performance && window.performance.getEntriesByType) {
    const resources = window.performance.getEntriesByType('resource');
    
    resources.forEach((resource, index) => {
      if (resource.name.includes('403') || resource.responseStatus === 403) {
        console.error(`🚫 Found 403 resource [${index}]:`, resource);
      }
    });
  }

  // 检查Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) {
        console.warn('🔧 Service Workers found - they might be affecting requests:', registrations);
      }
    });
  }

  // 检查localStorage中可能影响的数据
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    if (value && (value.includes('403') || value.includes('error'))) {
      console.warn(`💾 Suspicious localStorage entry: ${key} = ${value}`);
    }
  }
};

// 强制标题更新的hook
export const useForceTitle = (title) => {
  // 使用更激进的方法
  const setTitle = () => {
    document.title = title;
  };
  
  // 多种触发方式
  setTitle(); // 立即执行
  setTimeout(setTitle, 0); // 下一个事件循环
  setTimeout(setTitle, 100); // 100ms后
  setTimeout(setTitle, 500); // 500ms后
  setTimeout(setTitle, 1000); // 1秒后
  
  // 页面完全加载后
  if (document.readyState !== 'complete') {
    window.addEventListener('load', setTitle);
  }
  
  // 用户交互后
  const handleUserInteraction = () => {
    setTitle();
    document.removeEventListener('click', handleUserInteraction, { once: true });
  };
  
  document.addEventListener('click', handleUserInteraction, { once: true });
  
  return () => {
    window.removeEventListener('load', setTitle);
  };
};






