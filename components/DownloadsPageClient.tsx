"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Locale } from "@/i18n";
import EmailPromptCard from "@/components/EmailPromptCard";
import DownloadModal from "@/components/DownloadModal";
import { getPDFResourceById } from "@/config/pdfResources";

interface DownloadsPageClientProps {
  locale: Locale;
}

export default function DownloadsPageClient({
  locale,
}: DownloadsPageClientProps) {
  const searchParams = useSearchParams();

  // 邮箱收集弹窗状态
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{
    id: string;
    title: string;
    downloadUrl: string;
  } | null>(null);

  // 🚀 支持 URL 参数：?resource=xxx 自动打开对应资源的邮箱收集弹窗
  useEffect(() => {
    const resourceId = searchParams?.get("resource");
    if (resourceId) {
      const pdfResource = getPDFResourceById(resourceId);
      if (pdfResource) {
        const htmlFilename = `${resourceId}${
          locale === "en" ? "-en" : ""
        }.html`;
        const downloadUrl = `/downloads/${htmlFilename}`;

        setSelectedResource({
          id: resourceId,
          title: pdfResource.title,
          downloadUrl,
        });
        setShowEmailModal(true);

        // 清理 URL 参数，避免刷新后重复打开
        const url = new URL(window.location.href);
        url.searchParams.delete("resource");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams, locale]);

  // 处理"立即了解"按钮点击
  const handleLearnMore = () => {
    // 默认选择第一个资源：经期急救入门指南
    const defaultResourceId = "pain-guide";
    const pdfResource = getPDFResourceById(defaultResourceId);

    if (pdfResource) {
      const htmlFilename = `${defaultResourceId}${
        locale === "en" ? "-en" : ""
      }.html`;
      const downloadUrl = `/downloads/${htmlFilename}`;

      setSelectedResource({
        id: defaultResourceId,
        title: pdfResource.title,
        downloadUrl,
      });
      setShowEmailModal(true);
    }
  };

  return (
    <>
      {/* 📧 邮箱收集提示卡片 - 左侧对称 */}
      <EmailPromptCard locale={locale} onLearnMore={handleLearnMore} />

      {/* 邮箱收集弹窗 */}
      {selectedResource && (
        <DownloadModal
          isOpen={showEmailModal}
          onClose={() => {
            setShowEmailModal(false);
            setSelectedResource(null);
          }}
          locale={locale}
          source={`downloads-center-${selectedResource.id}`}
          downloadUrl={selectedResource.downloadUrl}
          resourceTitle={selectedResource.title}
        />
      )}
    </>
  );
}
