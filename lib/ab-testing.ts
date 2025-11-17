// A/B测试配置
// Day 3 增强：免费版本价值提升测试
// Day 5 升级：集成真实数据收集系统

export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  variants: {
    control: {
      name: string;
      weight: number;
      features: string[];
    };
    treatment: {
      name: string;
      weight: number;
      features: string[];
    };
  };
  targetMetric: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'paused' | 'completed';
}

// Day 3 A/B测试：免费版本增强效果测试
export const freeVersionEnhancementTest: ABTestConfig = {
  id: 'day3-free-version-enhancement',
  name: '免费版本增强效果测试',
  description: '测试增强免费版本对用户参与度和转化率的影响',
  
  variants: {
    control: {
      name: '原版免费版',
      weight: 50, // 50%用户看到原版本
      features: [
        '前3个评估问题',
        '基础压力评分',
        '2个基础建议'
      ]
    },
    treatment: {
      name: '增强免费版',
      weight: 50, // 50%用户看到增强版本
      features: [
        '前5个评估问题',
        '雷达图可视化',
        '3个个性化建议',
        'PHQ-9评估入口'
      ]
    }
  },
  
  targetMetric: 'assessment_completion_rate', // 评估完成率
  startDate: new Date('2025-01-10'),
  endDate: new Date('2025-01-24'), // 2周测试期
  status: 'active'
};

// 用户分组逻辑
export function assignUserToVariant(userId: string, testConfig: ABTestConfig): 'control' | 'treatment' {
  // 简单的hash函数来确保用户一致性分组
  const hash = userId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  const percentage = (hash % 100) + 1; // 1-100的范围
  
  if (percentage <= testConfig.variants.control.weight) {
    return 'control';
  } else {
    return 'treatment';
  }
}

// 测试结果追踪
export interface TestMetrics {
  variant: 'control' | 'treatment';
  userId: string;
  event: string;
  timestamp: Date;
  value?: number;
  metadata?: Record<string, any>;
}

// 转化事件定义
export const conversionEvents = {
  assessmentStarted: 'assessment_started',
  assessmentCompleted: 'assessment_completed', 
  phq9Started: 'phq9_started',
  phq9Completed: 'phq9_completed',
  paywallViewed: 'paywall_viewed',
  paywallClicked: 'paywall_clicked',
  premiumUpgrade: 'premium_upgrade'
} as const;

// A/B Test Results Analysis
export class ABTestAnalyzer {
  private metrics: TestMetrics[] = [];
  
  addMetric(metric: TestMetrics) {
    this.metrics.push(metric);
  }
  
  getCompletionRates(): { control: number; treatment: number } {
    const controlMetrics = this.metrics.filter(m => m.variant === 'control');
    const treatmentMetrics = this.metrics.filter(m => m.variant === 'treatment');
    
    const controlCompleted = controlMetrics.filter(m => 
      m.event === conversionEvents.assessmentCompleted
    ).length;
    const controlStarted = controlMetrics.filter(m => 
      m.event === conversionEvents.assessmentStarted
    ).length;
    
    const treatmentCompleted = treatmentMetrics.filter(m => 
      m.event === conversionEvents.assessmentCompleted
    ).length;
    const treatmentStarted = treatmentMetrics.filter(m => 
      m.event === conversionEvents.assessmentStarted
    ).length;
    
    return {
      control: controlStarted > 0 ? (controlCompleted / controlStarted) * 100 : 0,
      treatment: treatmentStarted > 0 ? (treatmentCompleted / treatmentStarted) * 100 : 0
    };
  }
  
  getConversionRates(): { control: number; treatment: number } {
    const controlMetrics = this.metrics.filter(m => m.variant === 'control');
    const treatmentMetrics = this.metrics.filter(m => m.variant === 'treatment');
    
    const controlConverted = controlMetrics.filter(m => 
      m.event === conversionEvents.premiumUpgrade
    ).length;
    const controlTotal = controlMetrics.filter(m => 
      m.event === conversionEvents.assessmentStarted
    ).length;
    
    const treatmentConverted = treatmentMetrics.filter(m => 
      m.event === conversionEvents.premiumUpgrade
    ).length;
    const treatmentTotal = treatmentMetrics.filter(m => 
      m.event === conversionEvents.assessmentStarted
    ).length;
    
    return {
      control: controlTotal > 0 ? (controlConverted / controlTotal) * 100 : 0,
      treatment: treatmentTotal > 0 ? (treatmentConverted / treatmentTotal) * 100 : 0
    };
  }
  
  generateReport() {
    const completionRates = this.getCompletionRates();
    const conversionRates = this.getConversionRates();
    
    return {
      testName: 'Free Version Enhancement Test',
      completionRates,
      conversionRates,
      improvement: {
        completion: ((completionRates.treatment - completionRates.control) / completionRates.control) * 100,
        conversion: ((conversionRates.treatment - conversionRates.control) / conversionRates.control) * 100
      },
      sampleSize: {
        control: this.metrics.filter(m => m.variant === 'control').length,
        treatment: this.metrics.filter(m => m.variant === 'treatment').length
      }
    };
  }
}

// 本地存储的A/B测试数据管理
export class ABTestManager {
  private static readonly STORAGE_KEY = 'ab_test_data';
  
  static saveTestAssignment(userId: string, testId: string, variant: 'control' | 'treatment') {
    const existing = this.getTestAssignments(userId);
    const updated = { ...existing, [testId]: variant };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }
  
  static getTestAssignment(userId: string, testId: string): 'control' | 'treatment' {
    const assignments = this.getTestAssignments(userId);
    const assignment = assignments[testId];
    if (assignment === 'control' || assignment === 'treatment') {
      return assignment;
    }
    return assignUserToVariant(userId, freeVersionEnhancementTest);
  }
  
  private static getTestAssignments(userId: string): Record<string, string> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }
  
  static trackEvent(userId: string, testId: string, event: string, metadata?: any) {
    const variant = this.getTestAssignment(userId, testId);
    const analyzer = new ABTestAnalyzer();
    
    analyzer.addMetric({
      variant,
      userId,
      event,
      timestamp: new Date(),
      metadata
    });
    
    // 这里可以发送到分析服务
    console.log('A/B Test Event:', { variant, userId, event, metadata });
  }
}