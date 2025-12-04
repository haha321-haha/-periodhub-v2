"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Locale as LocaleType } from "@/lib/email/types";

interface WindowWithGtag extends Window {
  gtag?: (
    command: string,
    eventName: string,
    parameters?: Record<string, unknown>,
  ) => void;
}

interface DownloadModalProps {
  // 受控组件模式：接收外部控制的状态
  isOpen?: boolean;
  onClose?: () => void;
  // 原有属性
  locale?: LocaleType;
  buttonText?: string;
  className?: string;
  source?: string; // 来源标识（如：'上班痛经', 'travel' 等）
  // 下载相关
  downloadUrl?: string; // 直接下载链接（成功后可提供）
  resourceTitle?: string; // PDF 资源标题（用于显示）
}

type Status = "idle" | "loading" | "success" | "error";

export default function DownloadModal({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  locale: propLocale,
  buttonText,
  className = "",
  source,
  downloadUrl,
  resourceTitle,
}: DownloadModalProps) {
  // 支持受控和非受控两种模式
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const handleClose = externalOnClose || (() => setInternalIsOpen(false));
  const handleOpen = () => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  };

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorType, setErrorType] = useState<string | undefined>(undefined);

  const rawLocale = useLocale();
  const t = useTranslations("emailMarketing.downloadModal");

  // 确定使用的locale
  const locale: LocaleType =
    propLocale || (rawLocale?.startsWith("zh") ? "zh" : "en");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorType(undefined);

    try {
      const requestBody = { email, locale, source };
      // eslint-disable-next-line no-console
      console.log("[DownloadModal] Sending request:", requestBody);

      const res = await fetch("/api/email-marketing/send-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      // eslint-disable-next-line no-console
      console.log("[DownloadModal] Response:", { status: res.status, data });

      if (res.ok && data.success) {
        setStatus("success");
        setEmail("");

        // Google Analytics 事件追踪
        if (typeof window !== "undefined") {
          const windowWithGtag = window as WindowWithGtag;
          if (windowWithGtag.gtag) {
            windowWithGtag.gtag("event", "generate_lead", {
              currency: "USD",
              value: 0,
              item_name: resourceTitle || source || "PDF Download",
              source: source || "download_center",
            });
          }
        }

        // 如果提供了下载链接，自动触发下载
        if (downloadUrl) {
          // 延迟一下，让用户看到成功提示
          setTimeout(() => {
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = downloadUrl.split("/").pop() || "download";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, 500);
        }
      } else {
        setStatus("error");
        setErrorType(data.errorType || "server");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[DownloadModal] Error:", error);
      setStatus("error");
      setErrorType("network");
    }
  };

  // 默认按钮文字
  const triggerText = buttonText || t("triggerButtonText");

  // 未打开状态：显示触发按钮（仅在非受控模式下显示）
  if (!isOpen && externalIsOpen === undefined) {
    return (
      <button
        onClick={handleOpen}
        className={`bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${className}`}
        type="button"
      >
        {triggerText}
      </button>
    );
  }

  // 如果受控模式且未打开，不渲染任何内容
  if (!isOpen) {
    return null;
  }

  // 打开状态：显示Modal
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 点击背景关闭 */}
      <div
        className="absolute inset-0"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10 transform transition-all">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
          type="button"
          aria-label="Close"
        >
          ✕
        </button>

        {status === "success" ? (
          // 成功状态 UI
          <div className="text-center py-6 animate-success-bounce">
            <div className="text-5xl mb-4" role="img" aria-label="Success">
              ✅
            </div>
            <h3
              id="modal-title"
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              {t("successTitle")}
            </h3>
            <p className="text-gray-600 mb-6">{t("successDescription")}</p>
            <button
              onClick={handleClose}
              className="text-pink-500 font-semibold hover:text-pink-600 hover:underline"
              type="button"
            >
              {t("closeButtonText")}
            </button>
            {/* 提供直接下载链接（备用） */}
            {downloadUrl && (
              <div className="mt-4 text-sm text-gray-500">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 触发下载
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = downloadUrl.split("/").pop() || "download";
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  {locale === "en" ? "Download directly" : "直接下载"}
                </a>
              </div>
            )}
          </div>
        ) : (
          // 表单状态 UI
          <form onSubmit={handleSubmit}>
            <h3
              id="modal-title"
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              {t("title")}
            </h3>
            <p className="text-gray-500 mb-6">
              {resourceTitle
                ? locale === "en"
                  ? `Send "${resourceTitle}" to your email:`
                  : `将《${resourceTitle}》发送到邮箱：`
                : t("description")}
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="email-input" className="sr-only">
                  Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Email address"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {status === "loading" ? (
                  <>
                    <span
                      className="inline-block animate-spin mr-2"
                      aria-hidden="true"
                    >
                      ↻
                    </span>
                    <span>{t("loadingText")}</span>
                  </>
                ) : (
                  <span>{t("submitButtonText")}</span>
                )}
              </button>
            </div>

            {status === "error" && (
              <p
                className="text-red-500 text-sm mt-3 text-center bg-red-50 p-2 rounded"
                role="alert"
              >
                {errorType === "validation"
                  ? t("errorInvalidEmail")
                  : errorType === "network"
                    ? t("errorNetwork")
                    : errorType === "rate_limit"
                      ? t("errorRateLimit")
                      : t("errorServer")}
              </p>
            )}

            <p className="text-[10px] text-gray-400 mt-6 text-center leading-tight">
              {t("complianceText")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
