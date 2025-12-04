"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface WindowWithGtag extends Window {
  gtag?: (
    command: string,
    eventName: string,
    parameters?: Record<string, unknown>,
  ) => void;
}

interface EmailPromptCardProps {
  locale?: "zh" | "en";
  onLearnMore?: () => void;
}

export default function EmailPromptCard({
  locale = "zh", // eslint-disable-line @typescript-eslint/no-unused-vars
  onLearnMore,
}: EmailPromptCardProps) {
  const [isClosed, setIsClosed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 使用翻译系统
  const t = useTranslations("emailMarketing.emailPromptCard");

  // 延迟显示，避免页面加载时立即弹出
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);

      // Google Analytics 事件追踪
      if (typeof window !== "undefined") {
        const windowWithGtag = window as WindowWithGtag;
        if (windowWithGtag.gtag) {
          windowWithGtag.gtag("event", "EmailPromptView", {
            event_category: "Email Collection",
            event_label: "Download Center",
          });
        }
      }
    }, 1000); // 1秒后显示

    return () => clearTimeout(timer);
  }, []);

  // 检查 localStorage，用户是否已关闭过
  useEffect(() => {
    const hasClosed = localStorage.getItem("email-prompt-closed");
    if (hasClosed === "true") {
      setIsClosed(true);
    }
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    localStorage.setItem("email-prompt-closed", "true");

    // GA 事件追踪
    if (typeof window !== "undefined") {
      const windowWithGtag = window as WindowWithGtag;
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag("event", "EmailPromptClose", {
          event_category: "Email Collection",
          event_label: "Download Center",
        });
      }
    }
  };

  const handleLearnMore = () => {
    // GA 事件追踪
    if (typeof window !== "undefined") {
      const windowWithGtag = window as WindowWithGtag;
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag("event", "EmailPromptClick", {
          event_category: "Email Collection",
          event_label: "Download Center",
        });
      }
    }

    // 执行回调或默认行为
    if (onLearnMore) {
      onLearnMore();
    } else {
      // 默认：平滑滚动到第一个资源
      const firstResource = document.querySelector("[data-resource-card]");
      if (firstResource) {
        firstResource.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // 如果没有找到资源卡片，滚动到页面中间
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    }
  };

  if (isClosed || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs email-prompt-card animate-fade-in">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 rounded-xl shadow-lg border border-pink-500 relative">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20"
          aria-label={t("closeButtonAriaLabel")}
        >
          ✕
        </button>

        {/* 标题 */}
        <div className="text-sm font-bold mb-2 pr-6">📧 {t("title")}</div>

        {/* 描述 */}
        <div className="text-xs mb-3 opacity-90 leading-relaxed">
          {t("description")}
        </div>

        {/* 行动按钮 */}
        <button
          onClick={handleLearnMore}
          className="bg-white text-pink-600 px-3 py-2 rounded-lg text-xs w-full font-medium hover:bg-gray-50 transition-colors"
        >
          {t("buttonText")}
        </button>
      </div>
    </div>
  );
}
