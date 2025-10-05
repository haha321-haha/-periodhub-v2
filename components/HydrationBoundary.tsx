"use client";

import React, { useState, useEffect } from "react";

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * HydrationBoundary - 防止hydration不匹配错误的边界组件
 *
 * 这个组件确保只在客户端渲染，避免服务器端和客户端渲染不一致的问题
 * 特别适用于包含动态内容、浏览器特定API或状态依赖的组件
 */
const HydrationBoundary: React.FC<HydrationBoundaryProps> = ({
  children,
  fallback = (
    <div className="animate-pulse bg-gray-200 rounded h-8 w-full"></div>
  ),
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // 确保组件只在客户端挂载后渲染
    setHasMounted(true);
  }, []);

  // 在hydration完成之前显示fallback
  if (!hasMounted) {
    return <>{fallback}</>;
  }

  // hydration完成后渲染实际内容
  return <>{children}</>;
};

export default HydrationBoundary;
