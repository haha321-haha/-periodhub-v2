import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'as-needed',
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 排除静态文件，但允许页面路由
  if (pathname.startsWith('/downloads/') && 
      (pathname.endsWith('.html') || pathname.endsWith('.pdf'))) {
    return NextResponse.next();
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|icon.svg|apple-touch-icon.png).*)']
}