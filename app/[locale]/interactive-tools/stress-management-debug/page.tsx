import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import StressAssessmentWidgetDebug from "@/components/StressAssessmentWidget-debug";
import { PrivacyNotice } from "@/components/PrivacyNotice";

interface PageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "stressManagement" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
  };
}

export default async function StressManagementDebugPage({ params }: PageProps) {
  const locale = params.locale;
  await getTranslations({ locale, namespace: "stressManagement" });

  return (
    <div className="container-custom mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            压力管理评估 - 调试版
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            评估您的压力水平，获取个性化建议
          </p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">
              <strong>调试版本:</strong> 此版本包含额外的调试信息，用于诊断支付按钮点击问题。
            </p>
          </div>
        </header>

        <main>
          <StressAssessmentWidgetDebug />
        </main>

        <footer className="mt-12">
          <PrivacyNotice />
        </footer>
      </div>
    </div>
  );
}