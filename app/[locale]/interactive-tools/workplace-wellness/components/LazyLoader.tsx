'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { LoadingWrapper, SkeletonCard } from './LoadingAnimations';

/**
 * Day 12: 懒加载组件包装器
 * 基于HVsLYEp的组件架构，实现代码分割和按需加载
 */

// 懒加载包装器接口
interface LazyLoaderProps {
  fallback?: React.ReactNode;
  height?: string;
  delay?: number;
}

// 默认加载状态
const DefaultFallback = ({ height = "200px" }: { height?: string }) => (
  <LoadingWrapper isLoading={true} loadingComponent={<SkeletonCard className={`h-[${height}]`} />}>
    <SkeletonCard className={`h-[${height}]`} />
  </LoadingWrapper>
);

// 延迟加载包装器
const DelayedSuspense = ({ 
  children, 
  fallback, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
  delay?: number;
}) => {
  if (delay > 0) {
    return (
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    );
  }
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

/**
 * 创建懒加载组件
 * @param importFunc 动态导入函数
 * @param fallback 加载状态组件
 * @param delay 延迟加载时间(ms)
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
  delay: number = 0
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: React.ComponentProps<T> & LazyLoaderProps) {
    return (
      <DelayedSuspense 
        fallback={fallback || <DefaultFallback height={props.height} />}
        delay={delay}
      >
        <LazyComponent {...(props as any)} />
      </DelayedSuspense>
    );
  };
}

/**
 * 预加载组件
 * 在空闲时间预加载组件，提升用户体验
 */
export class ComponentPreloader {
  private static preloadedComponents = new Set<string>();
  
  static async preload(importFunc: () => Promise<any>, componentName: string) {
    if (this.preloadedComponents.has(componentName)) {
      return;
    }
    
    try {
      await importFunc();
      this.preloadedComponents.add(componentName);
      console.log(`✅ 预加载组件: ${componentName}`);
    } catch (error) {
      console.warn(`⚠️ 预加载组件失败: ${componentName}`, error);
    }
  }
  
  static isPreloaded(componentName: string): boolean {
    return this.preloadedComponents.has(componentName);
  }
  
  static clearCache() {
    this.preloadedComponents.clear();
  }
}

/**
 * 路由级别的懒加载组件
 * 用于页面级别的代码分割
 */
export function createLazyPage<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  pageName: string
) {
  return createLazyComponent(
    importFunc,
    <DefaultFallback height="400px" />,
    100 // 页面级组件延迟100ms
  );
}

/**
 * 功能模块级别的懒加载组件
 * 用于功能模块的代码分割
 */
export function createLazyModule<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  moduleName: string
) {
  return createLazyComponent(
    importFunc,
    <DefaultFallback height="300px" />,
    50 // 模块级组件延迟50ms
  );
}

/**
 * 工具组件级别的懒加载
 * 用于小型工具组件的代码分割
 */
export function createLazyTool<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  toolName: string
) {
  return createLazyComponent(
    importFunc,
    <DefaultFallback height="150px" />,
    0 // 工具组件立即加载
  );
}

/**
 * 批量预加载组件
 * 在应用启动时预加载关键组件
 */
export async function preloadCriticalComponents() {
  const criticalComponents = [
    {
      name: 'CalendarComponent',
      importFunc: () => import('./CalendarComponent'),
    },
    {
      name: 'Navigation',
      importFunc: () => import('./Navigation'),
    },
    {
      name: 'Header',
      importFunc: () => import('./Header'),
    },
    {
      name: 'Footer',
      importFunc: () => import('./Footer'),
    },
  ];
  
  // 使用 requestIdleCallback 在浏览器空闲时预加载
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(async () => {
      await Promise.allSettled(
        criticalComponents.map(({ name, importFunc }) =>
          ComponentPreloader.preload(importFunc, name)
        )
      );
    });
  } else {
    // 降级处理：直接预加载
    await Promise.allSettled(
      criticalComponents.map(({ name, importFunc }) =>
        ComponentPreloader.preload(importFunc, name)
      )
    );
  }
}

/**
 * 懒加载钩子
 * 用于在组件中动态加载其他组件
 */
export function useLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string
) {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  React.useEffect(() => {
    if (Component || loading) return;
    
    setLoading(true);
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        console.error(`懒加载组件失败: ${componentName}`, err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [importFunc, componentName, Component, loading]);
  
  return { Component, loading, error };
}

// 导出默认的懒加载组件
export default {
  createLazyComponent,
  createLazyPage,
  createLazyModule,
  createLazyTool,
  ComponentPreloader,
  preloadCriticalComponents,
  useLazyComponent,
};
