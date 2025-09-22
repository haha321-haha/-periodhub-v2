'use client';

import { useEffect, useState } from 'react';

/**
 * Hydration修复组件
 * 解决浏览器扩展导致的hydration不匹配问题
 */
export default function HydrationFix() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // 修复浏览器扩展可能添加的类名导致的hydration不匹配
    const htmlElement = document.documentElement;
    
    // 移除可能由浏览器扩展添加的类名
    const extensionClasses = [
      'tongyi-design-pc',
      'tongyi-design-mobile',
      'alibaba-design',
      'taobao-design'
    ];
    
    extensionClasses.forEach(className => {
      if (htmlElement.classList.contains(className)) {
        htmlElement.classList.remove(className);
        console.log(`[HydrationFix] 移除了浏览器扩展添加的类名: ${className}`);
      }
    });
    
    // 确保html元素有正确的类名
    if (!htmlElement.classList.contains('hydrated')) {
      htmlElement.classList.add('hydrated');
    }
    
  }, []);

  // 只在客户端渲染
  if (!isClient) {
    return null;
  }

  return null;
}

