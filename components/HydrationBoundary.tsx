"use client";

import { useEffect, useState } from "react";

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoader?: boolean;
}

/**
 * Hydration 保护组件
 * 防止服务端和客户端渲染不一致导致的 hydration 错误
 * 特别适用于翻译键的使用场景
 */
export default function HydrationBoundary({
  children,
  fallback = null,
  showLoader = false,
}: HydrationBoundaryProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 确保组件在客户端挂载后再渲染
    setMounted(true);
  }, []);

  // 服务端渲染时显示 fallback 或加载状态
  if (!mounted) {
    if (showLoader) {
      return (
        <div className="animate-pulse bg-gray-200 rounded h-4 w-full">
          {/* 加载占位符 */}
        </div>
      );
    }
    return <>{fallback}</>;
  }

  // 客户端挂载后正常渲染
  return <>{children}</>;
}

/**
 * 安全的翻译键使用 Hook
 * 提供翻译键的安全访问和错误处理
 */
export function useSafeTranslations(namespace?: string) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 安全的翻译函数
  const safeTranslate = (
    t: (key: string) => string,
    key: string,
    fallback?: string,
  ) => {
    if (!isClient) {
      return fallback || key;
    }

    try {
      const result = t(key);
      return result || fallback || key;
    } catch (error) {
      console.warn(`Translation key missing: ${namespace}.${key}`, error);
      return fallback || key;
    }
  };

  return {
    isClient,
    safeTranslate,
  };
}

/**
 * 翻译键错误边界组件
 * 捕获翻译键相关的错误并显示降级内容
 */
interface TranslationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

export class TranslationErrorBoundary extends React.Component<
  TranslationErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: TranslationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // 检查是否是翻译相关的错误
    if (
      error.message.includes("MISSING_MESSAGE") ||
      error.message.includes("Translation") ||
      error.message.includes("useTranslations")
    ) {
      return { hasError: true, error };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(
      "Translation Error Boundary caught an error:",
      error,
      errorInfo,
    );

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
            <p className="text-yellow-800 text-sm">
              ⚠️ 翻译内容加载失败，请刷新页面重试
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * 浏览器扩展检测 Hook
 * 检测可能干扰翻译的浏览器扩展
 */
export function useBrowserExtensionDetection() {
  const [extensions, setExtensions] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectedExtensions: string[] = [];

    // 检测常见的翻译扩展
    const extensionSignatures = [
      { name: "Google Translate", selector: "[data-google-translate]" },
      { name: "Microsoft Translator", selector: "[data-microsoft-translator]" },
      { name: "DeepL", selector: "[data-deepl]" },
      { name: "Babylon", selector: "[data-babylon]" },
    ];

    extensionSignatures.forEach(({ name, selector }) => {
      if (document.querySelector(selector)) {
        detectedExtensions.push(name);
      }
    });

    // 检测全局对象
    if ((window as any).google && (window as any).google.translate) {
      detectedExtensions.push("Google Translate (Global)");
    }

    setExtensions(detectedExtensions);

    if (detectedExtensions.length > 0) {
      console.warn("检测到可能干扰翻译的浏览器扩展:", detectedExtensions);
    }
  }, []);

  return extensions;
}

/**
 * 翻译键使用监控 Hook
 * 监控翻译键的使用情况，帮助发现潜在问题
 */
export function useTranslationMonitoring() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 监控 hydration 错误
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(" ");

      if (
        message.includes("Hydration failed") ||
        message.includes("Text content did not match") ||
        message.includes("MISSING_MESSAGE")
      ) {
        console.warn("🚨 检测到可能的翻译相关错误:", message);

        // 可以在这里添加错误上报逻辑
        // reportError('translation_error', { message, stack: new Error().stack });
      }

      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);
}
