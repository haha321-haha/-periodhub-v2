import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Period Hub - Redirecting...",
    description: "Redirecting to English version",
    robots: {
      index: false, // ✅ 禁止索引重定向页面
      follow: true,
    },
    // ❌ 不设置 alternates 配置，因为这不是内容页面
  };
}

export default function RootPage() {
  // next.config.js 的重定向会优先执行，这里作为后备
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecting to English Version...
        </h1>
        <p className="text-gray-600">
          If you are not redirected automatically,
          <a href="/en" className="text-blue-600 hover:text-blue-800 ml-1">
            click here
          </a>
        </p>
      </div>
    </div>
  );
}
