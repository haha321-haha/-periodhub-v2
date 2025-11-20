/**
 * Real Data Collector - 真实数据收集器
 * 用于收集用户的真实使用数据（匿名化）
 */

import { LocalStorageManager } from "./localStorage";

export interface DataPoint {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  sessionId: string;
}

const STORAGE_KEY = "real_data_collection";
const SESSION_KEY = "session_id";
const MAX_DATA_POINTS = 500;

/**
 * 获取或创建会话 ID
 */
function getSessionId(): string {
  let sessionId = LocalStorageManager.getItem<string>(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    LocalStorageManager.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * 收集数据点
 */
export function collectDataPoint(type: string, data: any): boolean {
  const dataPoints = LocalStorageManager.getItem<DataPoint[]>(STORAGE_KEY, []);
  if (!dataPoints) return false;

  const dataPoint: DataPoint = {
    id: `dp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    timestamp: Date.now(),
    sessionId: getSessionId(),
  };

  dataPoints.push(dataPoint);

  // 限制数据点数量
  if (dataPoints.length > MAX_DATA_POINTS) {
    dataPoints.splice(0, dataPoints.length - MAX_DATA_POINTS);
  }

  return LocalStorageManager.setItem(STORAGE_KEY, dataPoints);
}

/**
 * 获取所有数据点
 */
export function getAllDataPoints(): DataPoint[] {
  return LocalStorageManager.getItem<DataPoint[]>(STORAGE_KEY, []) || [];
}

/**
 * 获取特定类型的数据点
 */
export function getDataPointsByType(type: string): DataPoint[] {
  const allPoints = getAllDataPoints();
  return allPoints.filter((point) => point.type === type);
}

/**
 * 清除数据
 */
export function clearCollectedData(): boolean {
  return LocalStorageManager.removeItem(STORAGE_KEY);
}

/**
 * 导出数据（用于分析）
 */
export function exportCollectedData(): string {
  const dataPoints = getAllDataPoints();
  return JSON.stringify(
    {
      dataPoints,
      exportedAt: Date.now(),
      totalPoints: dataPoints.length,
    },
    null,
    2,
  );
}
