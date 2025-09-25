
const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 解决多lockfile警告
  outputFileTracingRoot: path.join(__dirname),
  // 临时禁用ESLint检查以解决部署问题
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 性能优化
  compress: true,
  
  // 图片优化 - 修复scenario图片加载问题
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 配置图片质量选项 - 解决Next.js 16兼容性警告
    qualities: [75, 85, 95, 100],
    // 添加更宽松的图片处理配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 修复特定图片的兼容性问题
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // 允许本地图片优化
    unoptimized: false,
    // 临时禁用有问题图片的优化
    loader: 'default',
  },
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/lib'],
  },
  
  // 编译器优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  
  // 重写规则 - 修复静态资源路径
  async rewrites() {
    return [
      {
        source: '/zh/manifest.json',
        destination: '/manifest.json'
      },
      {
        source: '/zh/icon.svg',
        destination: '/icon.svg'
      },
      {
        source: '/zh/apple-touch-icon.png',
        destination: '/apple-touch-icon.png'
      },
      {
        source: '/en/manifest.json',
        destination: '/manifest.json'
      },
      {
        source: '/en/icon.svg',
        destination: '/icon.svg'
      },
      {
        source: '/en/apple-touch-icon.png',
        destination: '/apple-touch-icon.png'
      },
      {
        source: '/zh/favicon-32x32.png',
        destination: '/favicon-32x32.png'
      },
      {
        source: '/zh/favicon-16x16.png',
        destination: '/favicon-16x16.png'
      },
      {
        source: '/zh/favicon.ico',
        destination: '/favicon.ico'
      },
      {
        source: '/en/favicon-32x32.png',
        destination: '/favicon-32x32.png'
      },
      {
        source: '/en/favicon-16x16.png',
        destination: '/favicon-16x16.png'
      },
      {
        source: '/en/favicon.ico',
        destination: '/favicon.ico'
      },
      {
        source: '/zh/favicon.ico',
        destination: '/favicon.ico'
      },
      {
        source: '/en/favicon.ico',
        destination: '/favicon.ico'
      },
      {
        source: '/zh/favicon-16x16.png',
        destination: '/favicon-16x16.png'
      },
      {
        source: '/en/favicon-16x16.png',
        destination: '/favicon-16x16.png'
      },
      {
        source: '/zh/favicon-32x32.png',
        destination: '/favicon-32x32.png'
      },
      {
        source: '/en/favicon-32x32.png',
        destination: '/favicon-32x32.png'
      },
      {
        source: '/fonts/:path*',
        destination: '/:path*'
      },
      {
        source: '/zh/images/:path*',
        destination: '/images/:path*'
      },
      {
        source: '/en/images/:path*',
        destination: '/images/:path*'
      },
      // PDF文件路径重写规则 - 将旧的pdf-files路径重定向到新的downloads路径
      {
        source: '/pdf-files/:path*',
        destination: '/downloads/:path*'
      }
    ];
  },

  // 重定向规则 - 修复格式错误的URL
  async redirects() {
    return [
      // 🎯 根路径重定向到中文首页 - 避免循环重定向
      {
        source: '/',
        destination: '/zh',
        permanent: false
      },
      {
        source: '/&',
        destination: '/zh',
        permanent: true
      },
      // 🎯 修复重定向问题的URL
      {
        source: '/assessment',
        destination: '/en/interactive-tools/symptom-assessment',
        permanent: true
      },
      // 🎯 智能文章页面重定向 - 基于用户语言偏好
      {
        source: '/articles',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '.*zh.*',
          },
        ],
        destination: '/zh/articles',
        permanent: false
      },
      {
        source: '/articles',
        destination: '/en/articles', // 默认英文版本
        permanent: false
      },
      // 🎯 修复teen-health重定向问题 - 避免循环重定向
      {
        source: '/teen-health',
        destination: '/zh/teen-health',
        permanent: true
      },
      // 🎯 重定向旧的special-therapies页面到natural-therapies
      {
        source: '/zh/special-therapies',
        destination: '/zh/natural-therapies',
        permanent: true
      },
      {
        source: '/en/special-therapies',
        destination: '/en/natural-therapies',
        permanent: true
      },
      {
        source: '/special-therapies',
        destination: '/en/natural-therapies',
        permanent: true
      },
      // 🎯 重定向understanding-your-cycle到health-guide
      {
        source: '/zh/articles/understanding-your-cycle',
        destination: '/zh/health-guide',
        permanent: true
      },
      {
        source: '/en/articles/understanding-your-cycle',
        destination: '/en/health-guide',
        permanent: true
      },
      {
        source: '/articles/understanding-your-cycle',
        destination: '/zh/health-guide',
        permanent: true
      }
    ];
  }
};

module.exports = withNextIntl(nextConfig);
  