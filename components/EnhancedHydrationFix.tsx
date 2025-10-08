/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";

/**
 * 增强版 Hydration 修复组件
 * 专门解决豆包翻译扩展和其他浏览器扩展导致的 hydration 错误
 */
export default function EnhancedHydrationFix() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // 🔧 立即修复所有 hydration 相关问题
    const fixHydrationIssues = () => {
      console.log("[EnhancedHydrationFix] 开始修复 hydration 问题...");

      // 1. 移除所有翻译扩展属性
      const removeTranslationAttributes = () => {
        const allElements = document.querySelectorAll("*");
        let removedCount = 0;

        allElements.forEach((element) => {
          const attributesToRemove = [
            "data-doubao-translate-traverse-mark",
            "data-google-translate",
            "data-translate",
            "data-microsoft-translate",
            "data-baidu-translate",
            "data-deepl-translate",
            "data-translate-id",
            "data-translate-translate",
          ];

          attributesToRemove.forEach((attr) => {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
              removedCount++;
            }
          });
        });

        if (removedCount > 0) {
          console.log(
            `[EnhancedHydrationFix] 移除了 ${removedCount} 个翻译扩展属性`,
          );
        }
      };

      // 2. 修复重复文本问题
      const fixDuplicateText = () => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false,
        );

        let fixedCount = 0;
        let node;

        while ((node = walker.nextNode())) {
          const originalText = node.textContent;
          if (originalText) {
            const newText = originalText
              .replace(/语言语言/g, "语言")
              .replace(/Language Language/g, "Language")
              .replace(/English English/g, "English")
              .replace(/中文中文/g, "中文");

            if (newText !== originalText) {
              node.textContent = newText;
              fixedCount++;
              console.log(
                `[EnhancedHydrationFix] 修复重复文本: "${originalText}" -> "${newText}"`,
              );
            }
          }
        }

        if (fixedCount > 0) {
          console.log(
            `[EnhancedHydrationFix] 修复了 ${fixedCount} 个重复文本问题`,
          );
        }
      };

      // 3. 移除翻译扩展添加的类名
      const removeTranslationClasses = () => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        const extensionClasses = [
          "tongyi-design-pc",
          "tongyi-design-mobile",
          "alibaba-design",
          "taobao-design",
          "doubao-translate-active",
          "google-translate-active",
          "translate-extension-active",
          "translation-active",
        ];

        let removedClassCount = 0;

        [htmlElement, bodyElement].forEach((element) => {
          extensionClasses.forEach((className) => {
            if (element.classList.contains(className)) {
              element.classList.remove(className);
              removedClassCount++;
              console.log(`[EnhancedHydrationFix] 移除了类名: ${className}`);
            }
          });
        });

        if (removedClassCount > 0) {
          console.log(
            `[EnhancedHydrationFix] 移除了 ${removedClassCount} 个扩展类名`,
          );
        }
      };

      // 执行所有修复
      removeTranslationAttributes();
      fixDuplicateText();
      removeTranslationClasses();

      // 4. 设置 hydration 标记
      const htmlElement = document.documentElement;
      if (!htmlElement.classList.contains("hydrated")) {
        htmlElement.classList.add("hydrated");
      }

      console.log("[EnhancedHydrationFix] hydration 修复完成");
    };

    // 立即执行修复
    fixHydrationIssues();

    // 5. 设置 MutationObserver 监听后续变化
    const observer = new MutationObserver((mutations) => {
      let needsFix = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target as Element;
          const attributesToRemove = [
            "data-doubao-translate-traverse-mark",
            "data-google-translate",
            "data-translate",
            "data-microsoft-translate",
            "data-baidu-translate",
            "data-deepl-translate",
          ];

          attributesToRemove.forEach((attr) => {
            if (target.hasAttribute(attr)) {
              target.removeAttribute(attr);
              needsFix = true;
            }
          });
        }

        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const attributesToRemove = [
                "data-doubao-translate-traverse-mark",
                "data-google-translate",
                "data-translate",
                "data-microsoft-translate",
                "data-baidu-translate",
                "data-deepl-translate",
              ];

              attributesToRemove.forEach((attr) => {
                if (element.hasAttribute(attr)) {
                  element.removeAttribute(attr);
                  needsFix = true;
                }
              });
            }

            // 修复新添加的文本节点
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent;
              if (
                text &&
                (text.includes("语言语言") ||
                  text.includes("Language Language") ||
                  text.includes("English English") ||
                  text.includes("中文中文"))
              ) {
                node.textContent = text
                  .replace(/语言语言/g, "语言")
                  .replace(/Language Language/g, "Language")
                  .replace(/English English/g, "English")
                  .replace(/中文中文/g, "中文");
                needsFix = true;
              }
            }
          });
        }

        if (mutation.type === "characterData") {
          const text = mutation.target.textContent;
          if (
            text &&
            (text.includes("语言语言") ||
              text.includes("Language Language") ||
              text.includes("English English") ||
              text.includes("中文中文"))
          ) {
            mutation.target.textContent = text
              .replace(/语言语言/g, "语言")
              .replace(/Language Language/g, "Language")
              .replace(/English English/g, "English")
              .replace(/中文中文/g, "中文");
            needsFix = true;
          }
        }
      });

      if (needsFix) {
        console.log("[EnhancedHydrationFix] 动态修复了 hydration 问题");
      }
    });

    // 开始监听
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
      attributeFilter: [
        "data-doubao-translate-traverse-mark",
        "data-google-translate",
        "data-translate",
        "data-microsoft-translate",
        "data-baidu-translate",
        "data-deepl-translate",
      ],
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
