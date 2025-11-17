// 真实数据分析和洞察提取工具
// 基于Day 5分析框架，升级为处理真实数据

import { RealUserSession, RealFeedbackData } from './real-data-collector';

interface DataQualityMetrics {
  completeness: number; // 数据完整性
  accuracy: number; // 数据准确性
  consistency: number; // 数据一致性
  timeliness: number; // 数据时效性
  validity: number; // 数据有效性
}

interface StatisticalResults {
  testName: string;
  pValue: number;
  confidenceInterval: [number, number];
  effectSize: number;
  sampleSize: number;
  power: number;
  isSignificant: boolean;
  practicalSignificance: boolean;
}

interface UserBehaviorInsights {
  dropOffPoints: { page: string; rate: number }[];
  commonPaths: { path: string; frequency: number }[];
  timeSpentAnalysis: { page: string; avgTime: number }[];
  deviceAnalysis: { device: string; usage: number; satisfaction: number }[];
  conversionFunnel: { step: string; rate: number; dropoff: number }[];
}

interface BusinessRecommendations {
  immediate: { action: string; impact: number; effort: number; reason: string }[];
  shortTerm: { action: string; impact: number; effort: number; reason: string }[];
  longTerm: { action: string; impact: number; effort: number; reason: string }[];
}

class RealDataAnalyzer {
  private sessions: RealUserSession[] = [];
  private feedback: RealFeedbackData[] = [];
  private dataQualityMetrics: DataQualityMetrics | null = null;

  constructor() {
    this.loadDataFromStorage();
  }

  // 加载真实数据
  private loadDataFromStorage() {
    try {
      // 加载用户会话数据 (这里需要实现从实际存储加载)
      this.loadSessionsFromDatabase();
      
      // 加载用户反馈数据
      const savedFeedback = localStorage.getItem('user_feedback_data');
      if (savedFeedback) {
        this.feedback = JSON.parse(savedFeedback).map((f: any) => ({
          ...f,
          timestamp: new Date(f.timestamp)
        }));
      }

      // 计算数据质量指标
      this.calculateDataQualityMetrics();
      
    } catch (error) {
      console.error('数据加载失败:', error);
    }
  }

  // 模拟从数据库加载会话数据
  private async loadSessionsFromDatabase() {
    // 这里应该是从实际数据库加载数据的代码
    // 模拟加载一些数据用于演示
    this.sessions = [];
  }

  // 数据质量评估
  private calculateDataQualityMetrics() {
    if (this.sessions.length === 0) {
      this.dataQualityMetrics = {
        completeness: 0,
        accuracy: 0,
        consistency: 0,
        timeliness: 0,
        validity: 0
      };
      return;
    }

    const totalSessions = this.sessions.length;
    let completeSessions = 0;
    let validSessions = 0;
    let consistentSessions = 0;
    let recentSessions = 0;
    let accurateSessions = 0;

    this.sessions.forEach(session => {
      // 检查完整性 (所有必要字段都存在)
      if (this.isSessionComplete(session)) completeSessions++;
      
      // 检查有效性 (数据格式正确)
      if (this.isSessionValid(session)) validSessions++;
      
      // 检查一致性 (数据内部逻辑一致)
      if (this.isSessionConsistent(session)) consistentSessions++;
      
      // 检查时效性 (数据是最近的，24小时内)
      const isRecent = (Date.now() - session.startTime.getTime()) < 24 * 60 * 60 * 1000;
      if (isRecent) recentSessions++;
      
      // 检查准确性 (通过各种验证规则)
      if (this.isSessionAccurate(session)) accurateSessions++;
    });

    this.dataQualityMetrics = {
      completeness: (completeSessions / totalSessions) * 100,
      accuracy: (accurateSessions / totalSessions) * 100,
      consistency: (consistentSessions / totalSessions) * 100,
      timeliness: (recentSessions / totalSessions) * 100,
      validity: (validSessions / totalSessions) * 100
    };
  }

  private isSessionComplete(session: RealUserSession): boolean {
    return !!(session.sessionId && 
              session.userId && 
              session.startTime && 
              session.device && 
              session.navigation.entryPage);
  }

  private isSessionValid(session: RealUserSession): boolean {
    // 检查数据类型和格式
    return typeof session.sessionId === 'string' && 
           session.sessionId.length > 0 &&
           session.startTime instanceof Date &&
           !isNaN(session.startTime.getTime());
  }

  private isSessionConsistent(session: RealUserSession): boolean {
    // 检查数据逻辑一致性
    const hasNavigation = session.navigation.pagesVisited.length > 0;
    const timeSpentPositive = session.interactions.timeSpent >= 0;
    const abTestVariantValid = ['control', 'treatment'].includes(session.abTestVariant);
    
    return hasNavigation && timeSpentPositive && abTestVariantValid;
  }

  private isSessionAccurate(session: RealUserSession): boolean {
    // 简单的准确性检查
    const deviceInfoValid = session.device.type && session.device.browser;
    const timeSpentReasonable = session.interactions.timeSpent < 24 * 60 * 60 * 1000; // 少于24小时
    
    return deviceInfoValid && timeSpentReasonable;
  }

  // 真实A/B测试分析
  public analyzeRealABTest(): StatisticalResults | null {
    if (this.sessions.length === 0) {
      console.warn('没有数据可供分析');
      return null;
    }

    // 分离对照组和治疗组数据
    const controlGroup = this.sessions.filter(s => s.abTestVariant === 'control');
    const treatmentGroup = this.sessions.filter(s => s.abTestVariant === 'treatment');

    if (controlGroup.length === 0 || treatmentGroup.length === 0) {
      console.warn('A/B测试组数据不足');
      return null;
    }

    // 计算完成率
    const controlCompleted = controlGroup.filter(s => s.conversion.assessmentCompleted).length;
    const treatmentCompleted = treatmentGroup.filter(s => s.conversion.assessmentCompleted).length;
    
    const controlRate = controlCompleted / controlGroup.length;
    const treatmentRate = treatmentCompleted / treatmentGroup.length;

    // 卡方检验
    const chiSquareTest = this.performChiSquareTest(
      controlCompleted, controlGroup.length - controlCompleted,
      treatmentCompleted, treatmentGroup.length - treatmentCompleted
    );

    // 效应量计算 (Cohen's d)
    const effectSize = this.calculateEffectSize(
      controlGroup.map(s => s.interactions.timeSpent),
      treatmentGroup.map(s => s.interactions.timeSpent)
    );

    // 置信区间计算
    const confidenceInterval = this.calculateConfidenceInterval(treatmentRate - controlRate, 0.95);

    // 统计功效计算
    const power = this.calculateStatisticalPower(controlRate, treatmentRate, controlGroup.length + treatmentGroup.length);

    const isSignificant = chiSquareTest.pValue < 0.05;
    const practicalSignificance = Math.abs(treatmentRate - controlRate) > 0.05; // 5%的差异认为有实际意义

    return {
      testName: '真实A/B测试 - 评估完成率对比',
      pValue: chiSquareTest.pValue,
      confidenceInterval,
      effectSize,
      sampleSize: controlGroup.length + treatmentGroup.length,
      power,
      isSignificant,
      practicalSignificance
    };
  }

  private performChiSquareTest(a: number, b: number, c: number, d: number) {
    const n = a + b + c + d;
    const chiSquare = (n * Math.pow(a * d - b * c, 2)) / ((a + b) * (c + d) * (a + c) * (b + d));
    const df = 1;
    
    // 简化的p值计算
    const pValue = chiSquare > 3.841 ? 0.05 : (chiSquare > 2.706 ? 0.1 : 0.5);
    
    return { chiSquare, pValue };
  }

  private calculateEffectSize(group1: number[], group2: number[]): number {
    const mean1 = group1.reduce((sum, val) => sum + val, 0) / group1.length;
    const mean2 = group2.reduce((sum, val) => sum + val, 0) / group2.length;
    
    const pooledStd = Math.sqrt(
      ((group1.length - 1) * this.calculateVariance(group1) + (group2.length - 1) * this.calculateVariance(group2)) /
      (group1.length + group2.length - 2)
    );
    
    return Math.abs(mean1 - mean2) / pooledStd;
  }

  private calculateVariance(arr: number[]): number {
    const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  }

  private calculateConfidenceInterval(difference: number, confidenceLevel: number): [number, number] {
    const standardError = Math.sqrt(difference * (1 - difference) / this.sessions.length);
    const zScore = confidenceLevel === 0.95 ? 1.96 : 2.58;
    
    return [
      difference - zScore * standardError,
      difference + zScore * standardError
    ];
  }

  private calculateStatisticalPower(rate1: number, rate2: number, n: number): number {
    // 简化的统计功效计算
    const pooledRate = (rate1 + rate2) / 2;
    const effectSize = Math.abs(rate1 - rate2);
    const standardError = Math.sqrt(2 * pooledRate * (1 - pooledRate) / n);
    
    // 简化的功效估算
    return effectSize > 2 * standardError ? 0.8 : 0.6;
  }

  // 真实用户反馈分析
  public analyzeRealFeedback(): any {
    if (this.feedback.length === 0) {
      return { message: '没有反馈数据可供分析' };
    }

    // 情感分析
    const sentimentCounts = this.feedback.reduce((acc, f) => {
      acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 主题分析
    const topicCounts = this.feedback.reduce((acc, f) => {
      f.topics.forEach(topic => {
        acc[topic] = (acc[topic] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // 评分统计
    const ratingStats = {
      average: this.feedback.reduce((sum, f) => sum + f.rating, 0) / this.feedback.length,
      distribution: this.feedback.reduce((acc, f) => {
        acc[f.rating] = (acc[f.rating] || 0) + 1;
        return acc;
      }, {} as Record<number, number>)
    };

    // 功能满意度分析
    const featureSatisfaction = this.feedback.reduce((acc, f) => {
      if (!acc[f.feature]) {
        acc[f.feature] = { total: 0, count: 0 };
      }
      acc[f.feature].total += f.rating;
      acc[f.feature].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    // 计算平均满意度
    Object.keys(featureSatisfaction).forEach(feature => {
      const data = featureSatisfaction[feature];
      (data as any).average = data.total / data.count;
    });

    return {
      totalFeedback: this.feedback.length,
      sentimentAnalysis: {
        positive: sentimentCounts.positive || 0,
        neutral: sentimentCounts.neutral || 0,
        negative: sentimentCounts.negative || 0,
        positiveRate: (sentimentCounts.positive || 0) / this.feedback.length * 100
      },
      topicAnalysis: Object.entries(topicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      ratingStats,
      featureSatisfaction,
      feedbackQuality: {
        hasComment: this.feedback.filter(f => f.comment.length > 10).length,
        averageCommentLength: this.feedback.reduce((sum, f) => sum + f.comment.length, 0) / this.feedback.length
      }
    };
  }

  // 用户行为分析
  public analyzeUserBehavior(): UserBehaviorInsights {
    if (this.sessions.length === 0) {
      return {
        dropOffPoints: [],
        commonPaths: [],
        timeSpentAnalysis: [],
        deviceAnalysis: [],
        conversionFunnel: []
      };
    }

    // 分析流失点
    const pageExitRates = this.calculatePageExitRates();
    
    // 分析用户路径
    const commonPaths = this.identifyCommonPaths();
    
    // 分析时间花费
    const timeSpentAnalysis = this.analyzeTimeSpent();
    
    // 分析设备使用
    const deviceAnalysis = this.analyzeDeviceUsage();
    
    // 分析转化漏斗
    const conversionFunnel = this.analyzeConversionFunnel();

    return {
      dropOffPoints: pageExitRates,
      commonPaths,
      timeSpentAnalysis,
      deviceAnalysis,
      conversionFunnel
    };
  }

  private calculatePageExitRates() {
    const pageVisits = new Map<string, { visits: number; exits: number }>();
    
    this.sessions.forEach(session => {
      session.navigation.pagesVisited.forEach((page, index) => {
        if (!pageVisits.has(page)) {
          pageVisits.set(page, { visits: 0, exits: 0 });
        }
        
        const pageData = pageVisits.get(page)!;
        pageData.visits++;
        
        // 如果这是用户访问的最后一个页面，计算为退出
        if (index === session.navigation.pagesVisited.length - 1) {
          pageData.exits++;
        }
      });
    });

    return Array.from(pageVisits.entries())
      .map(([page, data]) => ({
        page,
        rate: data.exits / data.visits * 100
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 10);
  }

  private identifyCommonPaths() {
    const pathCounts = new Map<string, number>();
    
    this.sessions.forEach(session => {
      const path = session.navigation.pagesVisited.join(' → ');
      pathCounts.set(path, (pathCounts.get(path) || 0) + 1);
    });

    return Array.from(pathCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, frequency]) => ({ path, frequency }));
  }

  private analyzeTimeSpent() {
    const pageTime = new Map<string, number[]>();
    
    this.sessions.forEach(session => {
      Object.entries(session.navigation.timeOnEachPage).forEach(([page, time]) => {
        if (!pageTime.has(page)) {
          pageTime.set(page, []);
        }
        pageTime.get(page)!.push(time);
      });
    });

    return Array.from(pageTime.entries())
      .map(([page, times]) => ({
        page,
        avgTime: times.reduce((sum, t) => sum + t, 0) / times.length
      }))
      .sort((a, b) => b.avgTime - a.avgTime);
  }

  private analyzeDeviceUsage() {
    const deviceData = new Map<string, { sessions: number; satisfaction: number[] }>();
    
    this.sessions.forEach(session => {
      const device = session.device.type;
      if (!deviceData.has(device)) {
        deviceData.set(device, { sessions: 0, satisfaction: [] });
      }
      
      const data = deviceData.get(device)!;
      data.sessions++;
      
      // 查找对应的反馈评分
      const deviceFeedback = this.feedback.filter(f => 
        f.userId === session.userId
      );
      if (deviceFeedback.length > 0) {
        data.satisfaction.push(deviceFeedback[0].rating);
      }
    });

    return Array.from(deviceData.entries())
      .map(([device, data]) => ({
        device,
        usage: data.sessions,
        satisfaction: data.satisfaction.length > 0 
          ? data.satisfaction.reduce((sum, s) => sum + s, 0) / data.satisfaction.length 
          : 0
      }));
  }

  private analyzeConversionFunnel() {
    const totalUsers = this.sessions.length;
    
    const funnelSteps = [
      { name: '页面访问', count: totalUsers },
      { name: '评估开始', count: this.sessions.filter(s => s.conversion.assessmentStarted).length },
      { name: '评估完成', count: this.sessions.filter(s => s.conversion.assessmentCompleted).length },
      { name: '付费墙到达', count: this.sessions.filter(s => s.conversion.paywallReached).length },
      { name: '反馈提交', count: this.sessions.filter(s => s.conversion.feedbackSubmitted).length }
    ];

    return funnelSteps.map((step, index) => {
      const previousStep = index > 0 ? funnelSteps[index - 1] : step;
      const rate = step.count / totalUsers * 100;
      const dropoff = previousStep.count > 0 
        ? (previousStep.count - step.count) / previousStep.count * 100 
        : 0;
      
      return {
        step: step.name,
        rate,
        dropoff
      };
    });
  }

  // 生成商业建议
  public generateBusinessRecommendations(): BusinessRecommendations {
    const abTestResults = this.analyzeRealABTest();
    const feedbackAnalysis = this.analyzeRealFeedback();
    const behaviorInsights = this.analyzeUserBehavior();
    const dataQuality = this.dataQualityMetrics;

    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: []
    };

    // 基于A/B测试结果的建议
    if (abTestResults && abTestResults.isSignificant) {
      if (abTestResults.practicalSignificance) {
        recommendations.immediate.push({
          action: '推广表现更好的版本到所有用户',
          impact: abTestResults.effectSize,
          effort: 1,
          reason: `A/B测试显示显著改善 (p=${abTestResults.pValue.toFixed(3)})`
        });
      } else {
        recommendations.shortTerm.push({
          action: '进一步优化A/B测试中的功能',
          impact: 0.3,
          effort: 2,
          reason: '统计显著但实际改善有限，需要进一步优化'
        });
      }
    }

    // 基于反馈分析的建议
    if (feedbackAnalysis.featureSatisfaction) {
      Object.entries(feedbackAnalysis.featureSatisfaction).forEach(([feature, data]) => {
        const featureData = data as any;
        if (featureData.average < 3.5) {
          recommendations.immediate.push({
            action: `优先改进${feature}功能`,
            impact: 1,
            effort: 2,
            reason: `用户满意度低 (${featureData.average.toFixed(1)}/5.0)`
          });
        }
      });
    }

    // 基于用户行为分析的建议
    if (behaviorInsights.dropOffPoints.length > 0) {
      const highestDropOff = behaviorInsights.dropOffPoints[0];
      if (highestDropOff.rate > 50) {
        recommendations.immediate.push({
          action: `优化${highestDropOff.page}页面用户体验`,
          impact: 0.8,
          effort: 2,
          reason: `页面退出率过高 (${highestDropOff.rate.toFixed(1)}%)`
        });
      }
    }

    // 基于数据质量的建议
    if (dataQuality && dataQuality.completeness < 80) {
      recommendations.shortTerm.push({
        action: '改进数据收集完整性',
        impact: 0.5,
        effort: 1,
        reason: `数据完整性较低 (${dataQuality.completeness.toFixed(1)}%)`
      });
    }

    return recommendations;
  }

  // 获取数据质量报告
  public getDataQualityReport() {
    return {
      metrics: this.dataQualityMetrics,
      totalSessions: this.sessions.length,
      totalFeedback: this.feedback.length,
      dataFreshness: this.calculateDataFreshness(),
      recommendations: this.generateDataQualityRecommendations()
    };
  }

  private calculateDataFreshness(): string {
    if (this.sessions.length === 0) return '无数据';
    
    const latestSession = this.sessions.reduce((latest, session) => 
      session.startTime > latest ? session.startTime : latest
    , this.sessions[0].startTime);
    
    const hoursSinceLatest = (Date.now() - latestSession.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLatest < 1) return '实时';
    if (hoursSinceLatest < 24) return `${Math.floor(hoursSinceLatest)}小时前`;
    return `${Math.floor(hoursSinceLatest / 24)}天前`;
  }

  private generateDataQualityRecommendations() {
    if (!this.dataQualityMetrics) return [];

    const recommendations = [];
    
    if (this.dataQualityMetrics.completeness < 90) {
      recommendations.push('改进数据收集表单，确保所有必要字段都被填写');
    }
    
    if (this.dataQualityMetrics.accuracy < 85) {
      recommendations.push('增加数据验证规则，过滤明显错误的数据');
    }
    
    if (this.dataQualityMetrics.timeliness < 80) {
      recommendations.push('增加数据上传频率，确保数据的实时性');
    }

    return recommendations;
  }

  // 导出分析报告
  public exportAnalysisReport() {
    const report = {
      timestamp: new Date().toISOString(),
      dataQuality: this.getDataQualityReport(),
      abTestAnalysis: this.analyzeRealABTest(),
      feedbackAnalysis: this.analyzeRealFeedback(),
      behaviorAnalysis: this.analyzeUserBehavior(),
      businessRecommendations: this.generateBusinessRecommendations()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return report;
  }
}

export const realDataAnalyzer = new RealDataAnalyzer();
export type { DataQualityMetrics, StatisticalResults, UserBehaviorInsights, BusinessRecommendations };