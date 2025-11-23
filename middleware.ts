import { NextRequest, NextResponse } from "next/server";

/**
 * 中间件 - 处理根路径重定向
 * 在 middleware 中处理重定向，避免与 app/layout.tsx 中的 headers() 调用冲突
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 只处理根路径
  if (pathname === "/") {
    // 检测用户语言偏好
    const acceptLanguage = request.headers.get("accept-language") || "";
    let preferredLocale = "zh"; // 默认语言

    // 解析 Accept-Language 头部
    if (acceptLanguage) {
      const languages = acceptLanguage
        .split(",")
        .map((lang) => {
          try {
            const [code] = lang.trim().split(";");
            return code.toLowerCase().split("-")[0];
          } catch {
            return null;
          }
        })
        .filter((code): code is string => !!code);

      // 查找支持的语言
      for (const code of languages) {
        if (code === "en" || code === "zh") {
          preferredLocale = code;
          break;
        }
      }
    }

    // 重定向到对应的语言版本
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}`;
    return NextResponse.redirect(url, 307);
  }

  // 其他路径正常处理
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
