"use client";

import { useEffect, useState } from "react";

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
      "tongyi-design-pc",
      "tongyi-design-mobile",
      "alibaba-design",
      "taobao-design",
    ];

    extensionClasses.forEach((className) => {
      if (htmlElement.classList.contains(className)) {
        htmlElement.classList.remove(className);
        console.log(`[HydrationFix] 移除了浏览器扩展添加的类名: ${className}`);
      }
    });

    // 移除翻译扩展添加的属性
    const elementsWithTranslationMarks = document.querySelectorAll(
      "[data-doubao-translate-traverse-mark]",
    );
    elementsWithTranslationMarks.forEach((element) => {
      element.removeAttribute("data-doubao-translate-traverse-mark");
      console.log("[HydrationFix] 移除了翻译扩展添加的属性");
    });

    // 移除其他可能的翻译扩展属性
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      // 移除豆包翻译扩展的属性
      if (element.hasAttribute("data-doubao-translate-traverse-mark")) {
        element.removeAttribute("data-doubao-translate-traverse-mark");
      }
      // 移除其他可能的翻译扩展属性
      const attributesToRemove = [
        "data-google-translate",
        "data-translate",
        "data-microsoft-translate",
        "data-baidu-translate",
      ];
      attributesToRemove.forEach((attr) => {
        if (element.hasAttribute(attr)) {
          element.removeAttribute(attr);
        }
      });
    });

    // 确保html元素有正确的类名
    if (!htmlElement.classList.contains("hydrated")) {
      htmlElement.classList.add("hydrated");
    }

    // 监听DOM变化，持续清理扩展添加的属性
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target as Element;
          if (target.hasAttribute("data-doubao-translate-traverse-mark")) {
            target.removeAttribute("data-doubao-translate-traverse-mark");
            console.log("[HydrationFix] 动态移除了翻译扩展添加的属性");
          }
        }
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.hasAttribute("data-doubao-translate-traverse-mark")) {
                element.removeAttribute("data-doubao-translate-traverse-mark");
                console.log("[HydrationFix] 移除了新添加元素的翻译扩展属性");
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["data-doubao-translate-traverse-mark"],
    });

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, []);

  // 只在客户端渲染
  if (!isClient) {
    return null;
  }

  return null;
}
