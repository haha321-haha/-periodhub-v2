import { NextResponse } from "next/server";
import {
  clearRecommendationCache,
  getCacheStats,
} from "@/lib/recommendationCache";

/**
 * GET /api/recommendation-cache
 * 获取缓存统计信息
 */
export async function GET() {
  try {
    const stats = getCacheStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    // Error fetching cache stats
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cache stats",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/recommendation-cache
 * 清空推荐缓存
 */
export async function DELETE() {
  try {
    clearRecommendationCache();

    return NextResponse.json({
      success: true,
      message: "Cache cleared successfully",
    });
  } catch (error) {
    // Error clearing cache
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear cache",
      },
      { status: 500 },
    );
  }
}
