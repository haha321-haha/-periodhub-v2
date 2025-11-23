/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 已修复所有类型错误，启用严格类型检查
  typescript: {
    ignoreBuildErrors: false,
  },
  // ✅ 已修复所有 ESLint 警告，启用严格代码检查
  eslint: {
    ignoreDuringBuilds: false,
  },
  // ✅ 根路径重定向配置（作为 app/page.tsx 的后备）
  async redirects() {
    return [
      {
        source: "/",
        destination: "/zh", // 默认重定向到中文版本
        permanent: false, // 使用 302 临时重定向，允许客户端语言检测覆盖
      },
    ];
  },
};

module.exports = nextConfig;
