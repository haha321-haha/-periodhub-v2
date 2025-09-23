import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json',
          '/search?*',
          // 禁止索引图标文件
          '/icon/',
          '/icon?*',
          '/favicon*',
          '/apple-touch-icon*',
          // 禁止索引测试和开发页面
          '/test*',
          '/dev*',
          '/staging*',
          // 禁止索引备份文件
          '*.backup*',
          '*.tmp*',
          '*.log*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          '/icon/',
          '/icon?*',
          '/favicon*',
          '/apple-touch-icon*',
          '/test*',
          '/dev*',
          '/staging*',
          '*.backup*',
          '*.tmp*',
          '*.log*'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          '/icon/',
          '/icon?*',
          '/favicon*',
          '/apple-touch-icon*',
          '/test*',
          '/dev*',
          '/staging*',
          '*.backup*',
          '*.tmp*',
          '*.log*'
        ],
      }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}/sitemap.xml`,
    host: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"}`
  };
}