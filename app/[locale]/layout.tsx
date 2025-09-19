import '../globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {unstable_setRequestLocale} from 'next-intl/server';
import {Suspense} from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LanguageSetter from '@/components/LanguageSetter';

export const dynamic = 'force-dynamic';
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
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // 确保在服务端设置当前请求的语言环境
  unstable_setRequestLocale(locale);

  // 使用静态导入避免动态路径解析问题
  let messages;
  if (locale === 'zh') {
    messages = (await import('../../messages/zh.json')).default;
  } else {
    messages = (await import('../../messages/en.json')).default;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages as any}>
      <LanguageSetter />
      <Suspense fallback={<LoadingState />}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </Suspense>
    </NextIntlClientProvider>
  );
}