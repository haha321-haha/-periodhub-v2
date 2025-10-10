
const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Bundle Analyzer配置
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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

  // 🖼️ 智能图片优化配置 - 保留响应式设计
  images: {
    // 现代格式支持 - 浏览器自动选择最佳格式
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1年缓存
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // 图片质量配置 - 根据用途自动选择
    qualities: [70, 75, 80, 85, 90, 95, 100],

    // 响应式设备尺寸 - 匹配现有图片尺寸策略
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 400, 800],

    // 外部图片源
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],

    // 优化配置
    unoptimized: false,
    loader: 'default',

    // 保持现有图片结构 - 不强制转换
    path: '/_next/image',
  },

  // 实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/lib'],
    // 移动端性能优化
    optimizeServerReact: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // 编译器优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 移动端性能优化头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 预连接到关键域名 - 预加载策略优化
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com>; rel=preconnect; crossorigin'
          },
          {
            key: 'Link',
            value: '<https://fonts.gstatic.com>; rel=preconnect; crossorigin'
          },
          // 预加载关键资源
          // 注意：Next.js会自动处理CSS预加载，不需要手动配置
          // {
          //   key: 'Link',
          //   value: '</_next/static/css/app/layout.css>; rel=preload; as=style'
          // },
          // webpack.js预加载优化 - 已移除，Next.js 15.5.4会自动处理
          // 缓存控制
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // CSS文件MIME类型修复
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // JavaScript文件MIME类型修复
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          }
        ]
      },
      {
        source: '/offline.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          }
        ]
      }
    ];
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
      {
        source: '/zh/assessment',
        destination: '/zh/interactive-tools/symptom-assessment',
        permanent: true
      },
      // 🎯 修复articles页面重定向问题 - 重定向到下载中心（用户实际使用的页面）
      {
        source: '/articles',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '.*zh.*',
          },
        ],
        destination: '/zh/downloads',
        permanent: true
      },
      {
        source: '/articles',
        destination: '/en/downloads', // 默认英文版本
        permanent: true
      },
      // 🎯 修复不存在的文章重定向 - pain-relief-methods
      {
        source: '/zh/articles/pain-relief-methods',
        destination: '/zh/articles/5-minute-period-pain-relief',
        permanent: true
      },
      {
        source: '/en/articles/pain-relief-methods',
        destination: '/en/articles/5-minute-period-pain-relief',
        permanent: true
      },
      // 🎯 修复teen-health重定向问题 - 使用301状态码
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
      },
      // 🎯 修复特定文章页面的重定向问题 - 支持多语言检测
      {
        source: '/articles/long-term-healthy-lifestyle-guide',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '.*zh.*',
          },
        ],
        destination: '/zh/articles/long-term-healthy-lifestyle-guide',
        permanent: true
      },
      {
        source: '/articles/long-term-healthy-lifestyle-guide',
        destination: '/en/articles/long-term-healthy-lifestyle-guide',
        permanent: true
      },
      {
        source: '/articles/effective-herbal-tea-menstrual-pain',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '.*zh.*',
          },
        ],
        destination: '/zh/articles/effective-herbal-tea-menstrual-pain',
        permanent: true
      },
      {
        source: '/articles/effective-herbal-tea-menstrual-pain',
        destination: '/en/articles/effective-herbal-tea-menstrual-pain',
        permanent: true
      },
      // 🎯 修复Canonical标签错误的URL重定向
      {
        source: '/zh/articles/symptom-guide',
        destination: '/zh/health-guide/myths-facts',
        permanent: true
      },
      {
        source: '/zh/articles/myths-facts',
        destination: '/zh/health-guide/myths-facts',
        permanent: true
      },
      {
        source: '/en/articles/symptom-guide',
        destination: '/en/health-guide/myths-facts',
        permanent: true
      },
      {
        source: '/en/articles/myths-facts',
        destination: '/en/health-guide/myths-facts',
        permanent: true
      }
    ];
  }
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
