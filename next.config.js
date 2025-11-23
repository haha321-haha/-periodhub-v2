// eslint-disable-next-line @typescript-eslint/no-require-imports
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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
  // ⚠️ 注释掉根路径重定向，让 app/page.tsx 处理语言检测和重定向
  // 这样可以：
  // 1. 支持智能语言检测（根据 Accept-Language 头部）
  // 2. 支持Vercel预览请求的特殊处理
  // 3. 提供更好的用户体验
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/zh",
  //       permanent: false,
  //     },
  //   ];
  // },
};

module.exports = withNextIntl(nextConfig);
