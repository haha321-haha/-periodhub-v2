import { NextRequest, NextResponse } from "next/server";

/**
 * 简化的中间件 - 根路径请求由 app/page.tsx 直接处理
 * 不进行任何重定向，让 page.tsx 处理所有逻辑
 */
export function middleware(request: NextRequest) {
  // 让 app/page.tsx 处理所有根路径请求
  // 不进行任何中间件重定向，避免与 next-intl 冲突

  // 其他路径正常处理
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
