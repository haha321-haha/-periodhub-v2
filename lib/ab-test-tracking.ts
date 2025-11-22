/**
 * A/B Test Tracking - A/B 测试跟踪工具
 * 用于跟踪和分析不同版本的用户行为
 */

import { LocalStorageManager } from "./localStorage";

export interface ABTestVariant {
  testName: string;
  variant: string;
  assignedAt: number;
}

export interface ABTestEvent {
  testName: string;
  variant: string;
  eventType: string;
  eventData?: unknown;
  timestamp: number;
}

const AB_TEST_STORAGE_KEY = "ab_test_assignments";
const AB_TEST_EVENTS_KEY = "ab_test_events";

/**
 * 获取用户的 A/B 测试分配
 */
export function getABTestVariant(testName: string): string | null {
  const assignments = LocalStorageManager.getItem<
    Record<string, ABTestVariant>
  >(AB_TEST_STORAGE_KEY, {});

  return assignments?.[testName]?.variant || null;
}

/**
 * 分配 A/B 测试变体
 */
export function assignABTestVariant(
  testName: string,
  variant: string,
): boolean {
  const assignments = LocalStorageManager.getItem<
    Record<string, ABTestVariant>
  >(AB_TEST_STORAGE_KEY, {});

  if (!assignments) return false;

  assignments[testName] = {
    testName,
    variant,
    assignedAt: Date.now(),
  };

  return LocalStorageManager.setItem(AB_TEST_STORAGE_KEY, assignments);
}

/**
 * 自动分配变体（50/50 分配）
 */
export function autoAssignVariant(
  testName: string,
  variants: string[] = ["A", "B"],
): string {
  // 检查是否已分配
  const existing = getABTestVariant(testName);
  if (existing) return existing;

  // 随机分配
  const variant = variants[Math.floor(Math.random() * variants.length)];
  assignABTestVariant(testName, variant);

  return variant;
}

/**
 * 跟踪 A/B 测试事件
 */
export function trackABTestEvent(
  testName: string,
  eventType: string,
  eventData?: unknown,
): boolean {
  const variant = getABTestVariant(testName);
  if (!variant) return false;

  const events = LocalStorageManager.getItem<ABTestEvent[]>(
    AB_TEST_EVENTS_KEY,
    [],
  );
  if (!events) return false;

  const event: ABTestEvent = {
    testName,
    variant,
    eventType,
    eventData,
    timestamp: Date.now(),
  };

  events.push(event);

  // 限制事件数量（最多 1000 条）
  if (events.length > 1000) {
    events.splice(0, events.length - 1000);
  }

  return LocalStorageManager.setItem(AB_TEST_EVENTS_KEY, events);
}

/**
 * 获取 A/B 测试事件
 */
export function getABTestEvents(testName?: string): ABTestEvent[] {
  const events = LocalStorageManager.getItem<ABTestEvent[]>(
    AB_TEST_EVENTS_KEY,
    [],
  );

  if (!testName) return events || [];

  return (events || []).filter((e) => e.testName === testName);
}

/**
 * 获取 A/B 测试统计
 */
export function getABTestStats(testName: string) {
  const events = getABTestEvents(testName);

  const stats: Record<
    string,
    {
      variant: string;
      totalEvents: number;
      eventTypes: Record<string, number>;
    }
  > = {};

  events.forEach((event) => {
    if (!stats[event.variant]) {
      stats[event.variant] = {
        variant: event.variant,
        totalEvents: 0,
        eventTypes: {},
      };
    }

    stats[event.variant].totalEvents++;
    stats[event.variant].eventTypes[event.eventType] =
      (stats[event.variant].eventTypes[event.eventType] || 0) + 1;
  });

  return stats;
}

/**
 * 清除 A/B 测试数据
 */
export function clearABTestData(): boolean {
  LocalStorageManager.removeItem(AB_TEST_STORAGE_KEY);
  LocalStorageManager.removeItem(AB_TEST_EVENTS_KEY);
  return true;
}

/**
 * React Hook: 使用 A/B 测试
 */
export function useABTestTracking(
  testName: string,
  variants: string[] = ["A", "B"],
) {
  const variant = autoAssignVariant(testName, variants);

  const trackEvent = (eventType: string, eventData?: unknown) => {
    trackABTestEvent(testName, eventType, eventData);
  };

  return {
    variant,
    trackEvent,
  };
}

/**
 * 跟踪评估开始
 */
export function trackAssessmentStart(
  testName: string,
  assessmentType: string,
): boolean {
  return trackABTestEvent(testName, "assessment_start", { assessmentType });
}

/**
 * 跟踪评估完成
 */
export function trackAssessmentComplete(
  testName: string,
  assessmentType: string,
  score: number,
  duration: number,
): boolean {
  return trackABTestEvent(testName, "assessment_complete", {
    assessmentType,
    score,
    duration,
  });
}

/**
 * 跟踪推荐点击
 */
export function trackRecommendationClick(
  testName: string,
  recommendationType: string,
  recommendationId: string,
): boolean {
  return trackABTestEvent(testName, "recommendation_click", {
    recommendationType,
    recommendationId,
  });
}

/**
 * 导出 A/B 测试数据（用于分析）
 */
export function exportABTestData(): string {
  const assignments = LocalStorageManager.getItem<
    Record<string, ABTestVariant>
  >(AB_TEST_STORAGE_KEY, {});
  const events = LocalStorageManager.getItem<ABTestEvent[]>(
    AB_TEST_EVENTS_KEY,
    [],
  );

  return JSON.stringify(
    {
      assignments,
      events,
      exportedAt: Date.now(),
    },
    null,
    2,
  );
}

/**
 * 生成匿名用户ID
 */
export function generateAnonymousUserId(): string {
  const STORAGE_KEY = "anonymous_user_id";
  let userId = LocalStorageManager.getItem<string>(STORAGE_KEY);

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    LocalStorageManager.setItem(STORAGE_KEY, userId);
  }

  return userId;
}

/**
 * 跟踪付费墙点击
 */
export function trackPaywallClick(userId: string, action: string): boolean {
  return trackABTestEvent("paywall", "paywall_click", { userId, action });
}

/**
 * 跟踪付费墙查看
 */
export function trackPaywallView(userId: string): boolean {
  return trackABTestEvent("paywall", "paywall_view", { userId });
}

/**
 * 跟踪PHQ-9评估开始
 */
export function trackPHQ9Start(userId: string): boolean {
  return trackABTestEvent("phq9", "phq9_start", { userId });
}

/**
 * 跟踪PHQ-9评估完成
 */
export function trackPHQ9Complete(
  userId: string,
  score: number,
  level: string,
): boolean {
  return trackABTestEvent("phq9", "phq9_complete", { userId, score, level });
}

/**
 * 跟踪雷达图交互
 */
export function trackRadarChartInteraction(
  userId: string,
  type: string,
  data: unknown,
): boolean {
  return trackABTestEvent("radar_chart", "interaction", {
    userId,
    type,
    data,
  });
}
