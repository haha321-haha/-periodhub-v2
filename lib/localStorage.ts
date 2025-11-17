/**
 * 本地存储工具 - 用于匿名模式数据管理
 * 符合隐私保护承诺：数据仅存储在用户设备
 */

export interface AssessmentData {
  id: string;
  timestamp: number;
  answers: number[];
  score: number;
  stressLevel: string;
  isPremium: boolean;
}

const STORAGE_KEY = 'stress_assessment_data';
const MAX_ASSESSMENTS = 20; // 最多保存20次评估
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB限制，为localStorage留空间

export class LocalStorageManager {
  /**
   * 保存评估数据到本地存储
   */
  static saveAssessment(data: Omit<AssessmentData, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    const assessment: AssessmentData = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    try {
      const existing = this.getAssessments();
      
      // 添加新评估
      existing.push(assessment);
      
      // 限制保存的评估数量（只保留最近的）
      if (existing.length > MAX_ASSESSMENTS) {
        existing.splice(0, existing.length - MAX_ASSESSMENTS);
      }
      
      // 检查存储空间
      const serializedData = JSON.stringify(existing);
      if (serializedData.length > MAX_STORAGE_SIZE) {
        // 如果数据太大，进一步减少保存的评估数量
        const reducedData = existing.slice(-Math.floor(MAX_ASSESSMENTS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedData));
      } else {
        localStorage.setItem(STORAGE_KEY, serializedData);
      }
      
      console.log(`Assessment saved. Total assessments: ${existing.length}`);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, attempting to clear old data...');
        this.handleQuotaExceeded(data);
      } else {
        console.error('Failed to save assessment:', error);
      }
    }
  }

  /**
   * 处理配额超出错误
   */
  private static handleQuotaExceeded(data: Omit<AssessmentData, 'id' | 'timestamp'>): void {
    try {
      // 清除一半旧数据
      const existing = this.getAssessments();
      if (existing.length > 1) {
        const keepCount = Math.floor(existing.length / 2);
        const trimmedData = existing.slice(-keepCount);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedData));
        
        // 重新尝试保存当前数据
        this.saveAssessment(data);
      } else {
        // 如果只有一条数据，可能是数据本身太大，清空并重试
        localStorage.removeItem(STORAGE_KEY);
        this.saveAssessment(data);
      }
    } catch (error) {
      console.error('Failed to handle quota exceeded:', error);
      // 最后手段：清空所有数据
      this.clearAllData();
      console.warn('Cleared all assessment data due to storage issues');
    }
  }

  /**
   * 获取所有评估历史
   */
  static getAssessments(): AssessmentData[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load assessments:', error);
      return [];
    }
  }

  /**
   * 导出数据为JSON格式
   */
  static exportData(): string {
    const data = this.getAssessments();
    return JSON.stringify(data, null, 2);
  }

  /**
   * 清空所有数据
   */
  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * 获取存储信息
   */
  static getStorageInfo(): { count: number; lastAssessment: number | null; sizeBytes: number } {
    const assessments = this.getAssessments();
    let sizeBytes = 0;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      sizeBytes = data ? new Blob([data]).size : 0;
    } catch (error) {
      console.warn('Could not calculate storage size:', error);
    }
    
    return {
      count: assessments.length,
      lastAssessment: assessments.length > 0 
        ? assessments[assessments.length - 1].timestamp 
        : null,
      sizeBytes,
    };
  }

  /**
   * 获取存储使用情况
   */
  static getStorageUsage(): { used: string; available: string; percentage: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const used = data ? new Blob([data]).size : 0;
      const percentage = Math.min((used / MAX_STORAGE_SIZE) * 100, 100);
      
      return {
        used: this.formatBytes(used),
        available: this.formatBytes(MAX_STORAGE_SIZE - used),
        percentage: Math.round(percentage)
      };
    } catch (error) {
      return {
        used: 'Unknown',
        available: 'Unknown', 
        percentage: 0
      };
    }
  }

  /**
   * 格式化字节数
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 清理过期数据（可选：保留最近N天）
   */
  static cleanupOldData(daysToKeep: number = 30): number {
    if (typeof window === 'undefined') return 0;

    try {
      const existing = this.getAssessments();
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
      
      const recentData = existing.filter(assessment => assessment.timestamp > cutoffTime);
      const removedCount = existing.length - recentData.length;
      
      if (removedCount > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentData));
        console.log(`Cleaned up ${removedCount} old assessments`);
      }
      
      return removedCount;
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
      return 0;
    }
  }
}
