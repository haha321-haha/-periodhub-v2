/**
 * Progress Storage - 压力管理进度数据存储
 * 管理用户的压力管理记录和进度数据
 */

import { LocalStorageManager } from "./localStorage";

export interface ProgressEntry {
  id: string;
  date: string;
  stressLevel: number;
  techniques: string[];
  moodRating: number;
  notes?: string;
  timestamp: number;
}

export interface ProgressData {
  entries: ProgressEntry[];
  lastUpdated: number;
}

const STORAGE_KEY = "stress_management_progress";
const MAX_ENTRIES = 100; // 最多保存 100 条记录

/**
 * 获取所有进度记录
 */
export function getProgress(): ProgressData {
  const data = LocalStorageManager.getItem<ProgressData>(STORAGE_KEY);

  if (!data) {
    return {
      entries: [],
      lastUpdated: Date.now(),
    };
  }

  return data;
}

/**
 * 保存进度记录
 */
export function saveProgress(data: ProgressData): boolean {
  // 限制记录数量
  if (data.entries.length > MAX_ENTRIES) {
    data.entries = data.entries.slice(-MAX_ENTRIES);
  }

  data.lastUpdated = Date.now();
  return LocalStorageManager.setItemWithTimestamp(STORAGE_KEY, data);
}

/**
 * 添加新记录
 */
export function saveEntry(
  entry: Omit<ProgressEntry, "id" | "timestamp">,
): boolean {
  const data = getProgress();

  const newEntry: ProgressEntry = {
    ...entry,
    id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };

  data.entries.push(newEntry);
  return saveProgress(data);
}

/**
 * 更新记录
 */
export function updateEntry(
  id: string,
  updates: Partial<ProgressEntry>,
): boolean {
  const data = getProgress();
  const index = data.entries.findIndex((e) => e.id === id);

  if (index === -1) return false;

  data.entries[index] = {
    ...data.entries[index],
    ...updates,
    timestamp: Date.now(),
  };

  return saveProgress(data);
}

/**
 * 删除记录
 */
export function deleteEntry(id: string): boolean {
  const data = getProgress();
  data.entries = data.entries.filter((e) => e.id !== id);
  return saveProgress(data);
}

/**
 * 获取最近的记录
 */
export function getRecentEntries(count: number = 10): ProgressEntry[] {
  const data = getProgress();
  return data.entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, count);
}

/**
 * 获取日期范围内的记录
 */
export function getEntriesByDateRange(
  startDate: Date,
  endDate: Date,
): ProgressEntry[] {
  const data = getProgress();
  const start = startDate.getTime();
  const end = endDate.getTime();

  return data.entries.filter((entry) => {
    const entryTime = new Date(entry.date).getTime();
    return entryTime >= start && entryTime <= end;
  });
}

/**
 * 获取统计数据
 */
export function getStatistics() {
  const data = getProgress();

  if (data.entries.length === 0) {
    return {
      totalEntries: 0,
      averageStressLevel: 0,
      averageMoodRating: 0,
      mostUsedTechniques: [],
      improvementTrend: 0,
    };
  }

  const totalStress = data.entries.reduce((sum, e) => sum + e.stressLevel, 0);
  const totalMood = data.entries.reduce((sum, e) => sum + e.moodRating, 0);

  // 统计技巧使用频率
  const techniqueCount: Record<string, number> = {};
  data.entries.forEach((entry) => {
    entry.techniques.forEach((tech) => {
      techniqueCount[tech] = (techniqueCount[tech] || 0) + 1;
    });
  });

  const mostUsedTechniques = Object.entries(techniqueCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tech, count]) => ({ technique: tech, count }));

  // 计算改善趋势（最近 7 天 vs 之前 7 天）
  const recent = data.entries.slice(-7);
  const previous = data.entries.slice(-14, -7);

  const recentAvg =
    recent.length > 0
      ? recent.reduce((sum, e) => sum + e.stressLevel, 0) / recent.length
      : 0;
  const previousAvg =
    previous.length > 0
      ? previous.reduce((sum, e) => sum + e.stressLevel, 0) / previous.length
      : 0;

  const improvementTrend =
    previousAvg > 0 ? ((previousAvg - recentAvg) / previousAvg) * 100 : 0;

  return {
    totalEntries: data.entries.length,
    averageStressLevel: totalStress / data.entries.length,
    averageMoodRating: totalMood / data.entries.length,
    mostUsedTechniques,
    improvementTrend,
  };
}

/**
 * 清空所有记录
 */
export function clearProgress(): boolean {
  return LocalStorageManager.removeItem(STORAGE_KEY);
}

/**
 * 导出数据（用于备份）
 */
export function exportData(): string {
  const data = getProgress();
  return JSON.stringify(data, null, 2);
}

/**
 * 导入数据（从备份恢复）
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as ProgressData;

    // 验证数据格式
    if (!data.entries || !Array.isArray(data.entries)) {
      throw new Error("Invalid data format");
    }

    return saveProgress(data);
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}
