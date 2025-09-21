// 医疗护理指南数据处理工具
// 基于souW1e2的数据结构，适配项目标准

import type { 
  PainScaleItem, 
  SymptomItem, 
  DecisionTreeNode, 
  ComparisonTableData,
  AssessmentResult 
} from '../types/medical-care-guide';

// 疼痛等级数据 - 基于souW1e2的完整数据结构
export const PAIN_SCALE_DATA: PainScaleItem[] = [
  {
    level: 0,
    title: 'medicalCareGuide.painTool.levels.0.title',
    advice: 'medicalCareGuide.painTool.levels.0.advice',
    severity: 'none',
    recommendations: [
      'medicalCareGuide.painTool.levels.0.rec1',
      'medicalCareGuide.painTool.levels.0.rec2'
    ],
    colorClass: 'text-green-600'
  },
  {
    level: 1,
    title: 'medicalCareGuide.painTool.levels.1.title',
    advice: 'medicalCareGuide.painTool.levels.1.advice',
    severity: 'mild',
    recommendations: [
      'medicalCareGuide.painTool.levels.1.rec1',
      'medicalCareGuide.painTool.levels.1.rec2'
    ],
    colorClass: 'text-green-500'
  },
  {
    level: 2,
    title: 'medicalCareGuide.painTool.levels.2.title',
    advice: 'medicalCareGuide.painTool.levels.2.advice',
    severity: 'mild',
    recommendations: [
      'medicalCareGuide.painTool.levels.2.rec1',
      'medicalCareGuide.painTool.levels.2.rec2'
    ],
    colorClass: 'text-green-400'
  },
  {
    level: 3,
    title: 'medicalCareGuide.painTool.levels.3.title',
    advice: 'medicalCareGuide.painTool.levels.3.advice',
    severity: 'mild',
    recommendations: [
      'medicalCareGuide.painTool.levels.3.rec1',
      'medicalCareGuide.painTool.levels.3.rec2'
    ],
    colorClass: 'text-yellow-500'
  },
  {
    level: 4,
    title: 'medicalCareGuide.painTool.levels.4.title',
    advice: 'medicalCareGuide.painTool.levels.4.advice',
    severity: 'moderate',
    recommendations: [
      'medicalCareGuide.painTool.levels.4.rec1',
      'medicalCareGuide.painTool.levels.4.rec2'
    ],
    colorClass: 'text-yellow-600'
  },
  {
    level: 5,
    title: 'medicalCareGuide.painTool.levels.5.title',
    advice: 'medicalCareGuide.painTool.levels.5.advice',
    severity: 'moderate',
    recommendations: [
      'medicalCareGuide.painTool.levels.5.rec1',
      'medicalCareGuide.painTool.levels.5.rec2'
    ],
    colorClass: 'text-orange-500'
  },
  {
    level: 6,
    title: 'medicalCareGuide.painTool.levels.6.title',
    advice: 'medicalCareGuide.painTool.levels.6.advice',
    severity: 'moderate',
    recommendations: [
      'medicalCareGuide.painTool.levels.6.rec1',
      'medicalCareGuide.painTool.levels.6.rec2'
    ],
    colorClass: 'text-orange-600'
  },
  {
    level: 7,
    title: 'medicalCareGuide.painTool.levels.7.title',
    advice: 'medicalCareGuide.painTool.levels.7.advice',
    severity: 'severe',
    recommendations: [
      'medicalCareGuide.painTool.levels.7.rec1',
      'medicalCareGuide.painTool.levels.7.rec2'
    ],
    colorClass: 'text-red-500'
  },
  {
    level: 8,
    title: 'medicalCareGuide.painTool.levels.8.title',
    advice: 'medicalCareGuide.painTool.levels.8.advice',
    severity: 'severe',
    recommendations: [
      'medicalCareGuide.painTool.levels.8.rec1',
      'medicalCareGuide.painTool.levels.8.rec2'
    ],
    colorClass: 'text-red-600'
  },
  {
    level: 9,
    title: 'medicalCareGuide.painTool.levels.9.title',
    advice: 'medicalCareGuide.painTool.levels.9.advice',
    severity: 'extreme',
    recommendations: [
      'medicalCareGuide.painTool.levels.9.rec1',
      'medicalCareGuide.painTool.levels.9.rec2'
    ],
    colorClass: 'text-red-700'
  },
  {
    level: 10,
    title: 'medicalCareGuide.painTool.levels.10.title',
    advice: 'medicalCareGuide.painTool.levels.10.advice',
    severity: 'extreme',
    recommendations: [
      'medicalCareGuide.painTool.levels.10.rec1',
      'medicalCareGuide.painTool.levels.10.rec2'
    ],
    colorClass: 'text-red-800'
  }
];

// 症状数据 - 基于souW1e2的7个危险信号
export const SYMPTOM_DATA: SymptomItem[] = [
  {
    id: 's1',
    text: 'medicalCareGuide.symptomChecker.symptoms.s1.text',
    risk: 'emergency',
    category: 'pain',
    description: 'medicalCareGuide.symptomChecker.symptoms.s1.description',
    icon: '🚨'
  },
  {
    id: 's2',
    text: 'medicalCareGuide.symptomChecker.symptoms.s2.text',
    risk: 'emergency',
    category: 'bleeding',
    description: 'medicalCareGuide.symptomChecker.symptoms.s2.description',
    icon: '🩸'
  },
  {
    id: 's3',
    text: 'medicalCareGuide.symptomChecker.symptoms.s3.text',
    risk: 'emergency',
    category: 'systemic',
    description: 'medicalCareGuide.symptomChecker.symptoms.s3.description',
    icon: '🤒'
  },
  {
    id: 's4',
    text: 'medicalCareGuide.symptomChecker.symptoms.s4.text',
    risk: 'high',
    category: 'pain',
    description: 'medicalCareGuide.symptomChecker.symptoms.s4.description',
    icon: '⚡'
  },
  {
    id: 's5',
    text: 'medicalCareGuide.symptomChecker.symptoms.s5.text',
    risk: 'high',
    category: 'pattern',
    description: 'medicalCareGuide.symptomChecker.symptoms.s5.description',
    icon: '🔴'
  },
  {
    id: 's6',
    text: 'medicalCareGuide.symptomChecker.symptoms.s6.text',
    risk: 'high',
    category: 'pattern',
    description: 'medicalCareGuide.symptomChecker.symptoms.s6.description',
    icon: '📈'
  },
  {
    id: 's7',
    text: 'medicalCareGuide.symptomChecker.symptoms.s7.text',
    risk: 'medium',
    category: 'pain',
    description: 'medicalCareGuide.symptomChecker.symptoms.s7.description',
    icon: '💊'
  }
];

// 决策树数据 - 基于souW1e2的智能决策逻辑
export const DECISION_TREE_DATA: DecisionTreeNode = {
  id: 'start',
  question: 'medicalCareGuide.decisionTree.questions.start',
  options: {
    yes: 'medicalCareGuide.decisionTree.options.yes',
    no: 'medicalCareGuide.decisionTree.options.no'
  },
  children: {
    yes: {
      id: 'severe_pain',
      question: 'medicalCareGuide.decisionTree.questions.severePain',
      options: {
        yes: 'medicalCareGuide.decisionTree.options.yes',
        no: 'medicalCareGuide.decisionTree.options.no'
      },
      children: {
        yes: {
          id: 'emergency_result',
          result: {
            title: 'medicalCareGuide.decisionTree.results.emergency.title',
            icon: '🚨',
            colorClass: 'text-red-600 bg-red-50 border-red-200',
            text: 'medicalCareGuide.decisionTree.results.emergency.text',
            urgency: 'emergency',
            actions: [
              'medicalCareGuide.decisionTree.results.emergency.action1',
              'medicalCareGuide.decisionTree.results.emergency.action2',
              'medicalCareGuide.decisionTree.results.emergency.action3'
            ]
          }
        },
        no: {
          id: 'duration_check',
          question: 'medicalCareGuide.decisionTree.questions.duration',
          options: {
            yes: 'medicalCareGuide.decisionTree.options.yes',
            no: 'medicalCareGuide.decisionTree.options.no'
          },
          children: {
            yes: {
              id: 'urgent_result',
              result: {
                title: 'medicalCareGuide.decisionTree.results.urgent.title',
                icon: '⚠️',
                colorClass: 'text-orange-600 bg-orange-50 border-orange-200',
                text: 'medicalCareGuide.decisionTree.results.urgent.text',
                urgency: 'urgent',
                actions: [
                  'medicalCareGuide.decisionTree.results.urgent.action1',
                  'medicalCareGuide.decisionTree.results.urgent.action2',
                  'medicalCareGuide.decisionTree.results.urgent.action3'
                ]
              }
            },
            no: {
              id: 'routine_result',
              result: {
                title: 'medicalCareGuide.decisionTree.results.routine.title',
                icon: '📅',
                colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
                text: 'medicalCareGuide.decisionTree.results.routine.text',
                urgency: 'routine',
                actions: [
                  'medicalCareGuide.decisionTree.results.routine.action1',
                  'medicalCareGuide.decisionTree.results.routine.action2',
                  'medicalCareGuide.decisionTree.results.routine.action3'
                ]
              }
            }
          }
        }
      }
    },
    no: {
      id: 'pattern_check',
      question: 'medicalCareGuide.decisionTree.questions.pattern',
      options: {
        yes: 'medicalCareGuide.decisionTree.options.yes',
        no: 'medicalCareGuide.decisionTree.options.no'
      },
      children: {
        yes: {
          id: 'routine_result',
          result: {
            title: 'medicalCareGuide.decisionTree.results.routine.title',
            icon: '📅',
            colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
            text: 'medicalCareGuide.decisionTree.results.routine.text',
            urgency: 'routine',
            actions: [
              'medicalCareGuide.decisionTree.results.routine.action1',
              'medicalCareGuide.decisionTree.results.routine.action2',
              'medicalCareGuide.decisionTree.results.routine.action3'
            ]
          }
        },
        no: {
          id: 'observe_result',
          result: {
            title: 'medicalCareGuide.decisionTree.results.observe.title',
            icon: '👁️',
            colorClass: 'text-green-600 bg-green-50 border-green-200',
            text: 'medicalCareGuide.decisionTree.results.observe.text',
            urgency: 'observe',
            actions: [
              'medicalCareGuide.decisionTree.results.observe.action1',
              'medicalCareGuide.decisionTree.results.observe.action2',
              'medicalCareGuide.decisionTree.results.observe.action3'
            ]
          }
        }
      }
    }
  }
};

// 对比表格数据 - 基于souW1e2的正常vs异常对比
export const COMPARISON_TABLE_DATA: ComparisonTableData = {
  headers: [
    'medicalCareGuide.comparisonTable.headers.condition',
    'medicalCareGuide.comparisonTable.headers.normal',
    'medicalCareGuide.comparisonTable.headers.concerning',
    'medicalCareGuide.comparisonTable.headers.action'
  ],
  rows: [
    {
      condition: 'medicalCareGuide.comparisonTable.rows.painIntensity.condition',
      normalPain: 'medicalCareGuide.comparisonTable.rows.painIntensity.normal',
      concerningPain: 'medicalCareGuide.comparisonTable.rows.painIntensity.concerning',
      action: 'medicalCareGuide.comparisonTable.rows.painIntensity.action'
    },
    {
      condition: 'medicalCareGuide.comparisonTable.rows.painDuration.condition',
      normalPain: 'medicalCareGuide.comparisonTable.rows.painDuration.normal',
      concerningPain: 'medicalCareGuide.comparisonTable.rows.painDuration.concerning',
      action: 'medicalCareGuide.comparisonTable.rows.painDuration.action'
    },
    {
      condition: 'medicalCareGuide.comparisonTable.rows.painLocation.condition',
      normalPain: 'medicalCareGuide.comparisonTable.rows.painLocation.normal',
      concerningPain: 'medicalCareGuide.comparisonTable.rows.painLocation.concerning',
      action: 'medicalCareGuide.comparisonTable.rows.painLocation.action'
    },
    {
      condition: 'medicalCareGuide.comparisonTable.rows.associatedSymptoms.condition',
      normalPain: 'medicalCareGuide.comparisonTable.rows.associatedSymptoms.normal',
      concerningPain: 'medicalCareGuide.comparisonTable.rows.associatedSymptoms.concerning',
      action: 'medicalCareGuide.comparisonTable.rows.associatedSymptoms.action'
    },
    {
      condition: 'medicalCareGuide.comparisonTable.rows.medicationResponse.condition',
      normalPain: 'medicalCareGuide.comparisonTable.rows.medicationResponse.normal',
      concerningPain: 'medicalCareGuide.comparisonTable.rows.medicationResponse.concerning',
      action: 'medicalCareGuide.comparisonTable.rows.medicationResponse.action'
    },
    {
      condition: 'medicalCareGuide.comparisonTable.rows.dailyImpact.condition',
      normalPain: 'medicalCareGuide.comparisonTable.rows.dailyImpact.normal',
      concerningPain: 'medicalCareGuide.comparisonTable.rows.dailyImpact.concerning',
      action: 'medicalCareGuide.comparisonTable.rows.dailyImpact.action'
    },
    {
      condition: 'medicalCareGuide.comparisonTable.rows.cycleChanges.condition',
      normalPain: 'medicalCareGuide.comparisonTable.rows.cycleChanges.normal',
      concerningPain: 'medicalCareGuide.comparisonTable.rows.cycleChanges.concerning',
      action: 'medicalCareGuide.comparisonTable.rows.cycleChanges.action'
    }
  ]
};

// 工具函数：根据疼痛等级获取建议
export function getPainAdvice(level: number): PainScaleItem | null {
  if (level < 0 || level > 10) {
    return null;
  }
  return PAIN_SCALE_DATA[level] || null;
}

// 工具函数：分析症状风险等级
export function analyzeSymptomRisk(selectedSymptomIds: string[]): {
  riskLevel: AssessmentResult['riskLevel'];
  shouldSeeDoctor: boolean;
  urgency: AssessmentResult['urgency'];
  recommendations: string[];
} {
  const selectedSymptoms = SYMPTOM_DATA.filter(s => selectedSymptomIds.includes(s.id));
  
  const emergencyCount = selectedSymptoms.filter(s => s.risk === 'emergency').length;
  const highRiskCount = selectedSymptoms.filter(s => s.risk === 'high').length;
  const mediumRiskCount = selectedSymptoms.filter(s => s.risk === 'medium').length;

  // 紧急情况：任何紧急症状
  if (emergencyCount > 0) {
    return {
      riskLevel: 'emergency',
      shouldSeeDoctor: true,
      urgency: 'immediate',
      recommendations: [
        'Seek immediate emergency medical care',
        'Do not delay medical attention',
        'Call emergency services if needed',
        'Have someone accompany you to medical care'
      ]
    };
  }

  // 高风险：2个或更多高风险症状
  if (highRiskCount >= 2 || (highRiskCount >= 1 && mediumRiskCount >= 2)) {
    return {
      riskLevel: 'high',
      shouldSeeDoctor: true,
      urgency: 'within_week',
      recommendations: [
        'Schedule urgent appointment with healthcare provider',
        'Contact your doctor within 24-48 hours',
        'Monitor symptoms closely for any worsening',
        'Prepare detailed symptom list for doctor visit'
      ]
    };
  }

  // 中等风险：1个高风险症状或多个中风险症状
  if (highRiskCount === 1 || mediumRiskCount >= 2) {
    return {
      riskLevel: 'medium',
      shouldSeeDoctor: true,
      urgency: 'routine',
      recommendations: [
        'Schedule routine appointment with healthcare provider',
        'Continue monitoring symptoms',
        'Keep detailed symptom diary',
        'Consider lifestyle modifications'
      ]
    };
  }

  // 低风险
  return {
    riskLevel: 'low',
    shouldSeeDoctor: false,
    urgency: 'monitor',
    recommendations: [
      'Continue self-monitoring',
      'Maintain healthy lifestyle habits',
      'Consider preventive measures',
      'Schedule routine check-up if symptoms persist or worsen'
    ]
  };
}

// 工具函数：生成评估结果
export function generateAssessmentResult(
  painLevel: number,
  selectedSymptomIds: string[]
): AssessmentResult {
  const symptomAnalysis = analyzeSymptomRisk(selectedSymptomIds);
  
  // 综合疼痛等级和症状分析
  let finalRiskLevel = symptomAnalysis.riskLevel;
  let finalUrgency = symptomAnalysis.urgency;
  let finalShouldSeeDoctor = symptomAnalysis.shouldSeeDoctor;

  // 如果疼痛等级很高，提升风险等级
  if (painLevel >= 8 && finalRiskLevel === 'low') {
    finalRiskLevel = 'high';
    finalUrgency = 'within_week';
    finalShouldSeeDoctor = true;
  } else if (painLevel >= 7 && finalRiskLevel === 'low') {
    finalRiskLevel = 'medium';
    finalUrgency = 'routine';
    finalShouldSeeDoctor = true;
  }

  return {
    painLevel,
    symptoms: selectedSymptomIds,
    riskLevel: finalRiskLevel,
    recommendations: symptomAnalysis.recommendations,
    shouldSeeDoctor: finalShouldSeeDoctor,
    urgency: finalUrgency,
    timestamp: new Date().toISOString()
  };
}