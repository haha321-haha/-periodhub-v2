import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

// 加载状态组件
function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 确保locale是有效的类型
  const validLocale = locale === "en" || locale === "zh" ? locale : "zh";

  unstable_setRequestLocale(validLocale);

  // 使用静态导入避免动态路径解析问题，添加错误处理
  let messages;
  try {
    if (validLocale === "zh") {
      messages = (await import("../../messages/zh.json")).default;
    } else {
      messages = (await import("../../messages/en.json")).default;
    }
    console.log(
      `[Layout] Successfully loaded messages for locale ${validLocale}, keys: ${
        Object.keys(messages).length
      }`,
    );
  } catch (error) {
    console.error(
      `[Layout] Failed to import messages for locale ${validLocale}:`,
      error,
    );
    // 回退到默认语言
    try {
      messages = (await import("../../messages/zh.json")).default;
      console.log(
        `[Layout] Fallback to zh messages succeeded, keys: ${
          Object.keys(messages).length
        }`,
      );
    } catch (fallbackError) {
      console.error(
        "[Layout] Fallback to zh messages also failed:",
        fallbackError,
      );
      // 如果回退也失败，使用空对象避免崩溃
      messages = {};
    }
  }

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      <Suspense fallback={<LoadingState />}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </Suspense>
    </NextIntlClientProvider>
  );
}
