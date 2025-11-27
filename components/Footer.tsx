"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { generateMailtoLink, displayEmail } from "@/lib/email-protection";

export default function Footer() {
  const t = useTranslations("footer");
  const rawLocale = useLocale();
  const [currentYear, setCurrentYear] = useState(2024);
  const [isClient, setIsClient] = useState(false);

  // 规范化 zh/zh-CN/en/en-US 为 zh/en，避免路径不匹配
  const locale = rawLocale?.startsWith("zh")
    ? "zh"
    : rawLocale?.startsWith("en")
      ? "en"
      : "zh";

  // 为避免服务端与客户端在翻译加载时出现细微差异导致的 hydration mismatch，
  // 邮件 subject/body 不再依赖翻译文案，而是使用基于 locale 的稳定常量。
  const emailSubject = locale === "zh" ? "网站咨询" : "Website Inquiry";
  const emailBody =
    locale === "zh"
      ? "您好，我想咨询关于 PeriodHub 网站上的经期健康工具和服务。"
      : "Hello, I would like to inquire about the menstrual health tools and services on the PeriodHub website.";

  useEffect(() => {
    setIsClient(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="bg-neutral-100 border-t border-neutral-200"
      suppressHydrationWarning={true}
    >
      <div className="container-custom py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <Link
              href={`/${locale}/interactive-tools`}
              className="font-bold text-lg text-primary-600 hover:text-primary-700 transition-colors"
              suppressHydrationWarning={true}
            >
              periodhub.health
            </Link>
            <p className="mt-2 text-sm text-neutral-600 max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-neutral-800 mb-4">
              {t("linksTitle")}
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                {t("privacy")}
              </Link>
              <Link
                href={`/${locale}/terms-of-service`}
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                {t("terms")}
              </Link>
              <Link
                href={`/${locale}/medical-disclaimer`}
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                {t("medicalDisclaimer")}
              </Link>
              <Link
                href={`/${locale}/downloads`}
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                {t("articles")}
              </Link>
              <Link
                href={`/${locale}/natural-therapies`}
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              >
                {t("naturalTherapies")}
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-neutral-800 mb-4">
              {t("contactTitle")}
            </h3>
            <a
              // 为彻底避免因 locale 在 SSR/CSR 之间切换导致的 href 不一致，
              // 初始 href 固定为不带 subject/body 的基础邮件地址。
              href="mailto:tiyibaofu@outlook.com"
              className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
              onClick={(e) => {
                // 防止右键复制邮箱地址
                e.preventDefault();
                window.location.href = generateMailtoLink(
                  emailSubject,
                  emailBody,
                );
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {displayEmail()}
            </a>

            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              {/* Discord Community */}
              <a
                href="https://discord.gg/EN5Zvz3Q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-primary-600 transition-colors"
                title={t("socialDiscord")}
              >
                <span className="sr-only">Discord</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.052a.074.074 0 0 1 .077.04a9.658 9.658 0 0 0 5.592 1.937a9.675 9.675 0 0 0 5.593-1.937a.074.074 0 0 1 .078-.04c.13.02.26.042.372.053a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              {/* Twitter - placeholder */}
              <a
                href="#"
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              {/* Instagram - placeholder */}
              <a
                href="#"
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Medical Disclaimer */}
        <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
          <p className="text-sm text-neutral-500">
            {isClient
              ? t("copyright", { currentYear })
              : t("copyright", { currentYear: 2024 })}
          </p>
          <p className="mt-4 text-xs text-neutral-500 max-w-2xl mx-auto">
            {t("medicalDisclaimerFull")}
          </p>
          <p className="mt-2 text-xs text-neutral-500 max-w-2xl mx-auto">
            {t("dataPrivacyFull")}
          </p>
        </div>
      </div>
    </footer>
  );
}
