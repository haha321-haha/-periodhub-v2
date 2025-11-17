// 真实数据收集API端点
// 处理用户会话数据和A/B测试数据

import { NextRequest, NextResponse } from 'next/server';
import { RealUserSession } from '@/lib/real-data-collector';

interface SessionDataRequest {
  sessionData: RealUserSession;
  metadata?: {
    apiVersion: string;
    clientInfo: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// 内存存储（生产环境应该使用数据库）
let sessionStore: RealUserSession[] = [];
let feedbackStore: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: SessionDataRequest = await request.json();
    const { sessionData, metadata } = body;

    // 数据验证
    if (!sessionData || !sessionData.sessionId || !sessionData.userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: '无效的会话数据',
        error: '缺少必要的会话标识符'
      }, { status: 400 });
    }

    // 隐私检查
    if (!hasValidConsent(sessionData.userId)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: '用户未同意数据收集',
        error: 'CONSENT_REQUIRED'
      }, { status: 403 });
    }

    // 数据清洗和验证
    const cleanedSessionData = cleanSessionData(sessionData);
    
    // 存储会话数据
    const existingIndex = sessionStore.findIndex(s => s.sessionId === sessionData.sessionId);
    if (existingIndex >= 0) {
      sessionStore[existingIndex] = { ...sessionStore[existingIndex], ...cleanedSessionData };
    } else {
      sessionStore.push(cleanedSessionData);
    }

    // 保持存储大小在合理范围内（最近10000条记录）
    if (sessionStore.length > 10000) {
      sessionStore = sessionStore.slice(-8000); // 保留最近8000条
    }

    console.log(`📊 收到用户会话数据: ${sessionData.userId}, 会话: ${sessionData.sessionId}`);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: '会话数据已保存',
      data: {
        sessionId: sessionData.sessionId,
        timestamp: new Date().toISOString(),
        storedSessions: sessionStore.length
      }
    });

  } catch (error) {
    console.error('会话数据处理错误:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '100');

    let filteredSessions = sessionStore;

    // 按用户过滤
    if (userId) {
      filteredSessions = filteredSessions.filter(s => s.userId === userId);
    }

    // 按会话过滤
    if (sessionId) {
      filteredSessions = filteredSessions.filter(s => s.sessionId === sessionId);
    }

    // 限制返回数量
    const limitedSessions = filteredSessions.slice(-limit);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: '会话数据获取成功',
      data: {
        sessions: limitedSessions,
        totalCount: filteredSessions.length,
        returnedCount: limitedSessions.length
      }
    });

  } catch (error) {
    console.error('获取会话数据错误:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: '获取数据失败',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // 删除特定用户的数据（GDPR合规）
      sessionStore = sessionStore.filter(s => s.userId !== userId);
      
      return NextResponse.json<ApiResponse>({
        success: true,
        message: `用户 ${userId} 的数据已删除`,
        data: {
          remainingSessions: sessionStore.length
        }
      });
    } else {
      // 清空所有数据（仅开发环境使用）
      sessionStore = [];
      
      return NextResponse.json<ApiResponse>({
        success: true,
        message: '所有会话数据已清空',
        data: {
          remainingSessions: 0
        }
      });
    }

  } catch (error) {
    console.error('删除会话数据错误:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: '删除数据失败',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    }, { status: 500 });
  }
}

// 辅助函数
function hasValidConsent(userId: string): boolean {
  // 检查用户的同意状态
  // 在生产环境中，这里应该查询数据库
  return true; // 临时返回true，实际应该检查数据库中的同意记录
}

function cleanSessionData(sessionData: RealUserSession): RealUserSession {
  // 数据清洗和验证
  const cleaned = { ...sessionData };

  // 确保必要字段存在
  if (!cleaned.startTime) cleaned.startTime = new Date();
  if (!cleaned.device) cleaned.device = { type: 'desktop' as const, browser: 'unknown', os: 'unknown', screenResolution: 'unknown' };
  if (!cleaned.navigation) cleaned.navigation = { entryPage: '/', pagesVisited: [], timeOnEachPage: {}, scrollDepth: {} };
  if (!cleaned.interactions) cleaned.interactions = { clicks: 0, hovers: 0, formSubmissions: 0, timeSpent: 0 };
  if (!cleaned.conversion) cleaned.conversion = { 
    assessmentStarted: false, 
    assessmentCompleted: false, 
    paywallReached: false, 
    feedbackSubmitted: false,
    phq9Started: false,
    phq9Completed: false
  };

  // 数据类型验证和清理
  cleaned.interactions.timeSpent = Math.max(0, Math.min(cleaned.interactions.timeSpent, 24 * 60 * 60 * 1000)); // 限制在24小时内
  cleaned.interactions.clicks = Math.max(0, cleaned.interactions.clicks);
  cleaned.interactions.hovers = Math.max(0, cleaned.interactions.hovers);
  cleaned.interactions.formSubmissions = Math.max(0, cleaned.interactions.formSubmissions);

  return cleaned;
}