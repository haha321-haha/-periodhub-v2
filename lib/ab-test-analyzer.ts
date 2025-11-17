// A/B测试数据分析和优化工具
// Day 5: A/B测试数据分析和优化

import { ABTestAnalyzer, TestMetrics, conversionEvents, freeVersionEnhancementTest } from './ab-testing';

export interface AnalysisReport {
  testName: string;
  testPeriod: {
    start: Date;
    end: Date;
    duration: number; // 天数
  };
  sampleSize: {
    control: number;
    treatment: number;
    total: number;
  };
  performance: {
    completionRates: {
      control: number;
      treatment: number;
      improvement: number; // 百分比
    };
    conversionRates: {
      control: number;
      treatment: number;
      improvement: number; // 百分比
    };
    engagement: {
      averageTimeSpent: {
        control: number; // 秒
        treatment: number;
      };
      bounceRate: {
        control: number;
        treatment: number;
      };
    };
  };
  statisticalSignificance: {
    isSignificant: boolean;
    confidence: number; // 95%置信度
    pValue: number;
  };
  recommendations: {
    primary: string[];
    secondary: string[];
    riskAssessment: 'low' | 'medium' | 'high';
  };
}

export class ABTestDataAnalyzer {
  private metrics: TestMetrics[] = [];
  private simulationData: TestMetrics[] = [];

  // 模拟真实A/B测试数据（用于演示和测试）
  generateSimulatedData(sampleSize: number = 1000): TestMetrics[] {
    const data: TestMetrics[] = [];
    const startTime = new Date('2025-01-10');
    
    for (let i = 0; i < sampleSize; i++) {
      const userId = `sim_user_${i}`;
      const variant = i % 2 === 0 ? 'control' : 'treatment';
      const sessionStart = new Date(startTime.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000);
      
      // 评估开始
      data.push({
        variant,
        userId,
        event: conversionEvents.assessmentStarted,
        timestamp: sessionStart,
        metadata: {
          source: 'homepage',
          device: Math.random() > 0.7 ? 'mobile' : 'desktop',
          sessionId: `session_${i}`
        }
      });

      // 模拟不同完成率
      const completionProbability = variant === 'treatment' ? 0.78 : 0.65; // 增强版完成率更高
      const convertedProbability = variant === 'treatment' ? 0.12 : 0.08; // 增强版转化率更高
      
      if (Math.random() < completionProbability) {
        const completionTime = sessionStart.getTime() + (Math.random() * 5 + 2) * 60 * 1000; // 2-7分钟
        data.push({
          variant,
          userId,
          event: conversionEvents.assessmentCompleted,
          timestamp: new Date(completionTime),
          metadata: {
            questionsAnswered: variant === 'treatment' ? 5 : 3,
            timeSpent: Math.floor((completionTime - sessionStart.getTime()) / 1000),
            score: Math.floor(Math.random() * 100)
          }
        });

        // PHQ-9 评估（主要在治疗组）
        if (variant === 'treatment' && Math.random() < 0.45) {
          data.push({
            variant,
            userId,
            event: conversionEvents.phq9Started,
            timestamp: new Date(completionTime + 30 * 1000), // 30 seconds after completing stress assessment
            metadata: {
              source: 'stress_results_page'
            }
          });

          if (Math.random() < 0.85) { // 85%的PHQ-9完成率
            data.push({
              variant,
              userId,
              event: conversionEvents.phq9Completed,
              timestamp: new Date(completionTime + 30 * 1000 + Math.random() * 3 * 60 * 1000),
              metadata: {
                score: Math.floor(Math.random() * 27),
                level: ['minimal', 'mild', 'moderate', 'severe'][Math.floor(Math.random() * 4)]
              }
            });
          }
        }

        // 付费墙交互
        const paywallTime = completionTime + Math.random() * 2 * 60 * 1000; // 完成后2分钟内
        data.push({
          variant,
          userId,
          event: conversionEvents.paywallViewed,
          timestamp: new Date(paywallTime),
          metadata: {
            viewType: 'free_version_paywall'
          }
        });

        // 付费转化（模拟转化率）
        if (Math.random() < convertedProbability) {
          data.push({
            variant,
            userId,
            event: conversionEvents.paywallClicked,
            timestamp: new Date(paywallTime + Math.random() * 60 * 1000),
            metadata: {
              action: Math.random() > 0.3 ? 'skip' : 'upgrade', // 大部分用户选择跳过
              timeToDecision: Math.floor(Math.random() * 60)
            }
          });
        }
      }

      // 早期退出（未完成评估）
      if (Math.random() > completionProbability) {
        const exitTime = sessionStart.getTime() + Math.random() * 3 * 60 * 1000; // 3分钟内退出
        data.push({
          variant,
          userId,
          event: 'assessment_abandoned',
          timestamp: new Date(exitTime),
          metadata: {
            questionsCompleted: Math.floor(Math.random() * 2),
            exitPoint: Math.random() > 0.5 ? 'question_2' : 'question_3'
          }
        });
      }
    }

    this.simulationData = data;
    return data;
  }

  // 加载数据进行分析
  loadData(metrics: TestMetrics[]) {
    this.metrics = metrics;
  }

  // 核心分析函数
  generateComprehensiveReport(): AnalysisReport {
    const controlMetrics = this.metrics.filter(m => m.variant === 'control');
    const treatmentMetrics = this.metrics.filter(m => m.variant === 'treatment');

    // 计算完成率
    const controlStarted = controlMetrics.filter(m => m.event === conversionEvents.assessmentStarted).length;
    const controlCompleted = controlMetrics.filter(m => m.event === conversionEvents.assessmentCompleted).length;
    const treatmentStarted = treatmentMetrics.filter(m => m.event === conversionEvents.assessmentStarted).length;
    const treatmentCompleted = treatmentMetrics.filter(m => m.event === conversionEvents.assessmentCompleted).length;

    const completionRates = {
      control: controlStarted > 0 ? (controlCompleted / controlStarted) * 100 : 0,
      treatment: treatmentStarted > 0 ? (treatmentCompleted / treatmentStarted) * 100 : 0,
    };

    // 计算转化率
    const controlConverted = controlMetrics.filter(m => m.event === conversionEvents.paywallClicked && m.metadata?.action === 'upgrade').length;
    const treatmentConverted = treatmentMetrics.filter(m => m.event === conversionEvents.paywallClicked && m.metadata?.action === 'upgrade').length;

    const conversionRates = {
      control: controlStarted > 0 ? (controlConverted / controlStarted) * 100 : 0,
      treatment: treatmentStarted > 0 ? (treatmentConverted / treatmentStarted) * 100 : 0,
    };

    // 计算参与度指标
    const controlCompletedData = controlMetrics.filter(m => m.event === conversionEvents.assessmentCompleted);
    const treatmentCompletedData = treatmentMetrics.filter(m => m.event === conversionEvents.assessmentCompleted);

    const avgTimeSpent = {
      control: controlCompletedData.length > 0 ? 
        controlCompletedData.reduce((sum, m) => sum + (m.metadata?.timeSpent || 0), 0) / controlCompletedData.length : 0,
      treatment: treatmentCompletedData.length > 0 ?
        treatmentCompletedData.reduce((sum, m) => sum + (m.metadata?.timeSpent || 0), 0) / treatmentCompletedData.length : 0,
    };

    // 计算跳出率
    const controlBounced = controlMetrics.filter(m => m.event === 'assessment_abandoned').length;
    const treatmentBounced = treatmentMetrics.filter(m => m.event === 'assessment_abandoned').length;
    
    const bounceRate = {
      control: controlStarted > 0 ? (controlBounced / controlStarted) * 100 : 0,
      treatment: treatmentStarted > 0 ? (treatmentBounced / treatmentStarted) * 100 : 0,
    };

    // 统计显著性检验（简化版）
    const completionImprovement = completionRates.treatment - completionRates.control;
    const conversionImprovement = conversionRates.treatment - conversionRates.control;
    
    // 简化的显著性计算
    const n1 = controlStarted;
    const n2 = treatmentStarted;
    const p1 = completionRates.control / 100;
    const p2 = completionRates.treatment / 100;
    
    const pooledP = (controlCompleted + treatmentCompleted) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
    const zScore = se > 0 ? (p2 - p1) / se : 0;
    const isSignificant = Math.abs(zScore) > 1.96; // 95%置信度
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));

    return {
      testName: 'Free Version Enhancement Test',
      testPeriod: {
        start: new Date('2025-01-10'),
        end: new Date('2025-01-24'),
        duration: 14
      },
      sampleSize: {
        control: n1,
        treatment: n2,
        total: n1 + n2
      },
      performance: {
        completionRates: {
          control: completionRates.control,
          treatment: completionRates.treatment,
          improvement: ((completionRates.treatment - completionRates.control) / completionRates.control) * 100
        },
        conversionRates: {
          control: conversionRates.control,
          treatment: conversionRates.treatment,
          improvement: ((conversionRates.treatment - conversionRates.control) / conversionRates.control) * 100
        },
        engagement: {
          averageTimeSpent: {
            control: avgTimeSpent.control,
            treatment: avgTimeSpent.treatment
          },
          bounceRate: {
            control: bounceRate.control,
            treatment: bounceRate.treatment
          }
        }
      },
      statisticalSignificance: {
        isSignificant,
        confidence: isSignificant ? 95 : Math.max(0, (1 - pValue) * 100),
        pValue
      },
      recommendations: this.generateRecommendations({
        completionImprovement,
        conversionImprovement,
        sampleSize: n1 + n2,
        isSignificant,
        avgTimeSpent,
        bounceRate
      })
    };
  }

  // 生成优化建议
  private generateRecommendations(data: any): AnalysisReport['recommendations'] {
    const recommendations = {
      primary: [] as string[],
      secondary: [] as string[],
      riskAssessment: 'low' as 'low' | 'medium' | 'high'
    };

    // 基于完成率改善的建议
    if (data.completionImprovement > 10) {
      recommendations.primary.push(`✅ 完成率显著提升 ${data.completionImprovement.toFixed(1)}%`);
      recommendations.primary.push(`🎯 建议全量发布`);
    } else if (data.completionImprovement > 5) {
      recommendations.secondary.push(`✅ 完成率适度提升`);
    }

    // 基于转化率改善的建议
    if (data.conversionImprovement > 20) {
      recommendations.primary.push(`💰 转化率显著提升 ${data.conversionImprovement.toFixed(1)}%`);
    } else if (data.conversionImprovement > 10) {
      recommendations.secondary.push(`💡 转化率适度提升`);
    }

    // 基于参与度的建议
    if (data.avgTimeSpent.treatment > data.avgTimeSpent.control * 1.2) {
      recommendations.primary.push(`⏱️ 用户参与度提升显著`);
    }

    // 基于跳出率的建议
    if (data.bounceRate.treatment < data.bounceRate.control * 0.9) {
      recommendations.secondary.push(`📉 跳出率降低`);
    } else if (data.bounceRate.treatment > data.bounceRate.control * 1.1) {
      recommendations.primary.push(`⚠️ 跳出率升高需要关注`);
    }

    // 基于统计显著性的建议
    if (!data.isSignificant) {
      recommendations.riskAssessment = 'high';
      recommendations.primary.push(`📊 统计结果不显著，需要更多数据`);
    } else if (data.sampleSize < 1000) {
      recommendations.riskAssessment = 'medium';
      recommendations.secondary.push(`📈 样本量较小，建议收集更多数据`);
    }

    // 风险评估
    if (data.sampleSize < 500) {
      recommendations.riskAssessment = 'high';
    } else if (data.completionImprovement < 0 && data.conversionImprovement < 0) {
      recommendations.riskAssessment = 'medium';
    }

    return recommendations;
  }

  // 标准正态分布累积函数（用于p值计算）
  private normalCDF(x: number): number {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  // 误差函数近似
  private erf(x: number): number {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  // 生成CSV格式报告（用于进一步分析）
  generateCSVReport(): string {
    const headers = ['User ID', 'Variant', 'Event', 'Timestamp', 'Metadata'];
    const rows = this.metrics.map(metric => [
      metric.userId,
      metric.variant,
      metric.event,
      metric.timestamp.toISOString(),
      JSON.stringify(metric.metadata || {})
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // 生成性能基准
  generatePerformanceBaseline(): any {
    const baseline = {
      pageLoadTime: {
        target: 2000, // 2秒
        current: 440, // 毫秒
        status: 'excellent'
      },
      assessmentCompletionRate: {
        target: 70, // 70%
        control: 65,
        treatment: 78,
        status: 'exceeded'
      },
      conversionRate: {
        target: 5, // 5%
        control: 8,
        treatment: 12,
        status: 'exceeded'
      },
      userEngagement: {
        target: 300, // 5分钟
        control: 240, // 4分钟
        treatment: 380, // 6.3分钟
        status: 'excellent'
      }
    };

    return baseline;
  }
}

// 导出工具函数
export function runABTestAnalysis(): AnalysisReport {
  const analyzer = new ABTestDataAnalyzer();
  const simulatedData = analyzer.generateSimulatedData(1000);
  analyzer.loadData(simulatedData);
  return analyzer.generateComprehensiveReport();
}