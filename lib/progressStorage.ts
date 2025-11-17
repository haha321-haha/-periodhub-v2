/**
 * Progress Entry Storage Utilities
 * 管理压力管理进度记录的本地存储
 */

export interface ProgressEntry {
  id: string;
  date: string; // ISO string
  stressLevel: number; // 1-10
  techniques: string[]; // 使用的技巧
  moodRating: number; // 1-10
  notes: string;
}

const STORAGE_KEY = "stress_progress_entries";

/**
 * 获取所有记录
 */
export function getAllEntries(): ProgressEntry[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load entries:", error);
    return [];
  }
}

/**
 * 保存记录
 */
export function saveEntry(entry: Omit<ProgressEntry, "id">): void {
  if (typeof window === "undefined") return;
  
  try {
    const entries = getAllEntries();
    const newEntry: ProgressEntry = {
      ...entry,
      id: `entry_${Date.now()}`,
    };
    entries.push(newEntry);
    
    const dataString = JSON.stringify(entries);
    
    // Check if data is too large (approaching 5MB limit)
    const dataSize = new Blob([dataString]).size;
    if (dataSize > 4.5 * 1024 * 1024) { // 4.5MB warning threshold
      console.warn(`Storage size is ${(dataSize / 1024 / 1024).toFixed(2)}MB, approaching limit`);
    }
    
    localStorage.setItem(STORAGE_KEY, dataString);
  } catch (error) {
    if (error instanceof Error && error.name === "QuotaExceededError") {
      console.error("Storage quota exceeded. Please delete old entries.");
      throw new Error("Storage is full. Please delete some old entries to make space.");
    }
    console.error("Failed to save entry:", error);
    throw error;
  }
}

/**
 * 删除记录
 */
export function deleteEntry(id: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const entries = getAllEntries();
    const filtered = entries.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete entry:", error);
    throw error;
  }
}

/**
 * 获取今天的记录
 */
export function getTodayEntries(): ProgressEntry[] {
  const all = getAllEntries();
  const today = new Date().toDateString();
  return all.filter((e) => new Date(e.date).toDateString() === today);
}

/**
 * 获取本周的记录
 */
export function getWeekEntries(): ProgressEntry[] {
  const all = getAllEntries();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return all.filter((e) => new Date(e.date) >= weekAgo);
}

/**
 * 获取本月的记录
 */
export function getMonthEntries(): ProgressEntry[] {
  const all = getAllEntries();
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  return all.filter((e) => new Date(e.date) >= monthAgo);
}

/**
 * 计算统计数据
 */
export function calculateStats(entries: ProgressEntry[]) {
  if (entries.length === 0) {
    return {
      averageStress: 0,
      averageMood: 0,
      techniquesUsedRate: 0,
      totalEntries: 0,
    };
  }

  const averageStress =
    entries.reduce((sum, e) => sum + e.stressLevel, 0) / entries.length;
  const averageMood =
    entries.reduce((sum, e) => sum + e.moodRating, 0) / entries.length;
  const entriesWithTechniques = entries.filter(
    (e) => e.techniques.length > 0
  ).length;
  const techniquesUsedRate = (entriesWithTechniques / entries.length) * 100;

  return {
    averageStress: Number(averageStress.toFixed(1)),
    averageMood: Number(averageMood.toFixed(1)),
    techniquesUsedRate: Math.round(techniquesUsedRate),
    totalEntries: entries.length,
  };
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 格式化时间（仅时间）
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 获取技巧的显示名称
 */
export function getTechniqueLabel(techniqueId: string): string {
  const labels: Record<string, string> = {
    breathing: "Deep Breathing",
    meditation: "Meditation",
    exercise: "Exercise",
    yoga: "Yoga",
    music: "Music",
    nature: "Nature Walk",
    journaling: "Journaling",
    social: "Social Support",
  };
  return labels[techniqueId] || techniqueId;
}

/**
 * 获取压力等级的颜色
 */
export function getStressColor(level: number): string {
  if (level <= 3) return "text-green-600";
  if (level <= 6) return "text-yellow-600";
  if (level <= 8) return "text-orange-600";
  return "text-red-600";
}

/**
 * 获取心情评分的颜色
 */
export function getMoodColor(rating: number): string {
  if (rating >= 8) return "text-green-600";
  if (rating >= 5) return "text-yellow-600";
  return "text-red-600";
}

/**
 * 获取存储空间使用情况
 */
export function getStorageInfo() {
  if (typeof window === "undefined") return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY) || "[]";
    const sizeInBytes = new Blob([data]).size;
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;
    const maxSizeInMB = 5; // Typical localStorage limit
    const usagePercent = (sizeInMB / maxSizeInMB) * 100;
    
    return {
      sizeInBytes,
      sizeInKB: Number(sizeInKB.toFixed(2)),
      sizeInMB: Number(sizeInMB.toFixed(2)),
      maxSizeInMB,
      usagePercent: Number(usagePercent.toFixed(1)),
      isFull: usagePercent > 90,
      isNearFull: usagePercent > 75,
    };
  } catch (error) {
    console.error("Failed to get storage info:", error);
    return null;
  }
}

/**
 * 删除最旧的 N 条记录
 */
export function deleteOldestEntries(count: number): number {
  if (typeof window === "undefined") return 0;
  
  try {
    const entries = getAllEntries();
    if (entries.length === 0) return 0;
    
    // Sort by date (oldest first)
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Remove oldest entries
    const toDelete = Math.min(count, entries.length);
    const remaining = entries.slice(toDelete);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    return toDelete;
  } catch (error) {
    console.error("Failed to delete old entries:", error);
    return 0;
  }
}
