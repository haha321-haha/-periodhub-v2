/**
 * 全局代码分割工具函数
 * 提供统一的动态导入和懒加载功能
 */

'use client';

import React, { ComponentType, useState } from 'react';
import dynamic from 'next/dynamic';

// 加载组件
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

export const SkeletonLoader = ({ height = "h-32" }: { height?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${height}`}></div>
);

// 通用懒加载配置
export const defaultLazyOptions = {
  loading: () => <LoadingSpinner />,
  ssr: false // 禁用服务端渲染以提高性能
};

// 创建懒加载页面组件
export function createLazyPage<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  pageName: string
): ComponentType<any> {
  return dynamic(importFunc, {
    ...defaultLazyOptions,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading {pageName}...</span>
      </div>
    )
  });
}

// 创建懒加载模块组件
export function createLazyModule<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  moduleName: string
): ComponentType<any> {
  return dynamic(importFunc, {
    ...defaultLazyOptions,
    loading: () => (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse bg-gray-200 rounded h-8 w-full"></div>
      </div>
    )
  });
}

// 安全的动态导入工具函数
export const dynamicImport = async function<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ComponentType<T>
): Promise<ComponentType<T>> {
  try {
    const module = await importFn();
    return module.default;
  } catch (error) {
    console.error('Dynamic import failed:', error);
    if (fallback) {
      return fallback;
    }
    throw error;
  }
};

// 预加载关键组件
export async function preloadCriticalComponents() {
  const preloadPromises = [
    // 预加载关键组件
    import('@/components/ReadingProgress'),
    import('@/components/ArticleInteractions'),
    import('@/components/TableOfContents')
  ];
  
  try {
    await Promise.all(preloadPromises);
    console.log('✅ Critical components preloaded');
  } catch (error) {
    console.error('❌ Failed to preload critical components:', error);
  }
}

// 组件加载状态管理Hook
export function useComponentLoadingState() {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());
  
  const markComponentLoaded = (componentName: string) => {
    setLoadedComponents(prev => new Set([...prev, componentName]));
  };
  
  const isComponentLoaded = (componentName: string) => {
    return loadedComponents.has(componentName);
  };
  
  return { markComponentLoaded, isComponentLoaded, loadedComponents };
}

// 条件加载组件Hook
export function useConditionalLoading(showComponents: boolean) {
  if (!showComponents) {
    return {
      ArticleInteractions: null,
      TableOfContents: null,
      MarkdownWithMermaid: null
    };
  }
  
  return {
    ArticleInteractions: createLazyModule(
      () => import('@/components/ArticleInteractions'),
      'ArticleInteractions'
    ),
    TableOfContents: createLazyModule(
      () => import('@/components/TableOfContents'),
      'TableOfContents'
    ),
    MarkdownWithMermaid: createLazyModule(
      () => import('@/components/MarkdownWithMermaid'),
      'MarkdownWithMermaid'
    )
  };
}
