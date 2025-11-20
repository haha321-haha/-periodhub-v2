import { NextRequest, NextResponse } from 'next/server';
import { getArticlesList } from '@/lib/articles';

// ✅ 保留 force-dynamic（避免配置冲突）
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // ✅ Day 2: 使用新的分页函数（基于预生成索引）
    const result = getArticlesList(locale, page, limit);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching articles:', error);

    return NextResponse.json({
      success: false,
      articles: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      error: 'Failed to fetch articles'
    }, { status: 500 });
  }
}
