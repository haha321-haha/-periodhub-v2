import { unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Locale } from "@/i18n";
import DownloadModal from "@/components/DownloadModal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "邮件营销系统测试" : "Email Marketing System Test",
    description:
      locale === "zh"
        ? "测试邮件营销系统的下载弹窗功能"
        : "Test the email marketing system download modal",
  };
}

export default async function EmailMarketingTestPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === "zh"
              ? "📧 邮件营销系统测试"
              : "📧 Email Marketing System Test"}
          </h1>
          <p className="text-lg text-gray-600">
            {locale === "zh"
              ? "点击下方按钮测试邮件发送功能"
              : "Click the button below to test the email sending functionality"}
          </p>
        </div>

        {/* 测试区域 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {locale === "zh" ? "测试下载弹窗" : "Test Download Modal"}
          </h2>

          <div className="space-y-6">
            {/* 测试 1: 默认按钮 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                {locale === "zh"
                  ? "测试 1: 默认按钮"
                  : "Test 1: Default Button"}
              </h3>
              <DownloadModal locale={locale === "zh" ? "zh" : "en"} />
            </div>

            {/* 测试 2: 自定义按钮文字 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                {locale === "zh"
                  ? "测试 2: 自定义按钮文字"
                  : "Test 2: Custom Button Text"}
              </h3>
              <DownloadModal
                locale={locale === "zh" ? "zh" : "en"}
                buttonText={
                  locale === "zh"
                    ? "📥 免费下载《经期急救指南》"
                    : "📥 Get Free Period Rescue Guide"
                }
                source="test-page"
              />
            </div>

            {/* 测试 3: 不同来源标识 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                {locale === "zh"
                  ? "测试 3: 不同来源标识"
                  : "Test 3: Different Source"}
              </h3>
              <DownloadModal
                locale={locale === "zh" ? "zh" : "en"}
                buttonText={
                  locale === "zh" ? "🏢 上班族专用" : "🏢 For Office Workers"
                }
                source="office"
              />
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="bg-blue-50 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {locale === "zh" ? "功能说明" : "Features"}
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>
                {locale === "zh"
                  ? "点击按钮后弹出邮箱输入弹窗"
                  : "Click button to open email input modal"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>
                {locale === "zh"
                  ? "输入邮箱后自动发送欢迎邮件（包含PDF下载链接）"
                  : "Enter email to automatically send welcome email (with PDF download link)"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>
                {locale === "zh"
                  ? "支持中英文双语"
                  : "Supports both Chinese and English"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>
                {locale === "zh"
                  ? "发送成功后显示成功提示"
                  : "Shows success message after sending"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>
                {locale === "zh"
                  ? "支持来源追踪（source参数）"
                  : "Supports source tracking (source parameter)"}
              </span>
            </li>
          </ul>
        </div>

        {/* 测试提示 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            {locale === "zh" ? "💡 测试提示" : "💡 Testing Tips"}
          </h3>
          <ul className="space-y-2 text-yellow-700 text-sm">
            <li>
              {locale === "zh"
                ? "• 使用真实邮箱地址进行测试，邮件会发送到你的邮箱"
                : "• Use a real email address for testing, email will be sent to your inbox"}
            </li>
            <li>
              {locale === "zh"
                ? "• 检查邮箱收件箱和垃圾箱"
                : "• Check both inbox and spam folder"}
            </li>
            <li>
              {locale === "zh"
                ? "• 查看开发服务器终端日志，应该看到 [EmailMarketing] 相关日志"
                : "• Check development server terminal logs for [EmailMarketing] related logs"}
            </li>
            <li>
              {locale === "zh"
                ? "• 在 Resend Dashboard 查看邮件发送状态"
                : "• Check email sending status in Resend Dashboard"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
