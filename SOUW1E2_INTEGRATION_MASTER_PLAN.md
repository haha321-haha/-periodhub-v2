# souW1e2 集成总方案

## 📋 方案概览

基于技术日志 `DYSMENORRHEA_ARTICLE_INTEGRATION_TECHNICAL_LOG.md` 的成功经验，制定参考代码 souW1e2 的完整集成方案。

**目标**: 将 souW1e2 集成到项目中，解决"何时就医指南"的索引问题，从70分提升至95+分。

## 🎯 技术日志经验应用

### 成功经验借鉴

根据痛经文章重写的成功经验（从60分提升至89分），应用以下关键策略：

1. **用户导向设计** - souW1e2已体现，保持不变
2. **模块化架构** - 需要转换为React组件
3. **国际化支持** - souW1e2已完善，需要适配next-intl
4. **性能优化** - 应用懒加载和代码分割
5. **样式冲突解决** - 使用CSS Modules
6. **数据存储管理** - 实现命名空间管理

## 🏗️ 集成架构设计

### 目标文件结构

```
app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/
├── page.tsx                           # 主页面组件
├── components/                        # 交互组件目录
│   ├── PainAssessmentTool.tsx        # 疼痛评估工具
│   ├── SymptomChecklist.tsx          # 症状检查清单
│   ├── DecisionTree.tsx              # 决策树工具
│   ├── ComparisonTable.tsx           # 对比表格
│   └── __tests__/                    # 组件测试
│       ├── PainAssessmentTool.test.tsx
│       ├── SymptomChecklist.test.tsx
│       └── DecisionTree.test.tsx
├── hooks/                            # 自定义Hooks
│   ├── usePainAssessment.ts          # 疼痛评估逻辑
│   ├── useSymptomChecker.ts          # 症状检查逻辑
│   └── useDecisionTree.ts            # 决策树逻辑
├── utils/                            # 工具函数
│   ├── medicalCareData.ts            # 数据定义
│   ├── assessmentLogic.ts            # 评估逻辑
│   └── storageManager.ts             # 存储管理
├── styles/                           # 样式文件
│   ├── PainAssessmentTool.module.css
│   ├── SymptomChecklist.module.css
│   └── DecisionTree.module.css
└── types/                            # 类型定义
    └── medical-care-guide.ts
```

### 数据流架构

```
用户交互 → React组件 → 自定义Hooks → 数据处理 → 存储管理
    ↓           ↓           ↓           ↓           ↓
  UI反馈    状态管理    业务逻辑    数据验证    持久化存储
```

## 📋 分阶段集成计划

### 第1阶段：基础架构搭建 (2天)

#### 1.1 项目结构创建

**参考技术日志**: "组件化设计: 将复杂功能拆分为可复用的小组件"

**任务清单**:
- [ ] 创建文章目录结构
- [ ] 设置组件目录和文件
- [ ] 配置TypeScript类型定义
- [ ] 设置CSS Modules配置

**具体操作**:
```bash
# 创建目录结构
mkdir -p app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/{components,hooks,utils,styles,types,__tests__}

# 创建基础文件
touch app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/page.tsx
touch app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/components/{PainAssessmentTool,SymptomChecklist,DecisionTree,ComparisonTable}.tsx
```

#### 1.2 类型系统建立

**参考技术日志**: "类型安全: 使用TypeScript确保类型安全"

**类型定义方案**:
```typescript
// types/medical-care-guide.ts
export interface PainScaleItem {
  level: number;
  title: string;
  advice: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'extreme';
  recommendations: string[];
}

export interface SymptomItem {
  id: string;
  text: string;
  risk: 'emergency' | 'high' | 'medium';
  category: 'pain' | 'bleeding' | 'systemic' | 'pattern';
  description?: string;
}

export interface DecisionTreeNode {
  id: string;
  question?: string;
  options?: {
    yes: string;
    no: string;
  };
  result?: {
    title: string;
    icon: string;
    colorClass: string;
    text: string;
    urgency: 'emergency' | 'urgent' | 'routine' | 'observe';
    actions: string[];
  };
  children?: {
    yes?: DecisionTreeNode;
    no?: DecisionTreeNode;
  };
}

export interface AssessmentResult {
  painLevel: number;
  symptoms: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'emergency';
  recommendations: string[];
  shouldSeeDoctor: boolean;
  urgency: 'immediate' | 'within_week' | 'routine' | 'monitor';
}

export interface MedicalCareGuideStorage {
  assessmentHistory: AssessmentResult[];
  lastAssessment?: AssessmentResult;
  userPreferences: {
    language: string;
    reminderEnabled: boolean;
  };
}
```

### 第2阶段：核心组件转换 (3天)

#### 2.1 主页面组件

**参考技术日志**: "React组件: 92分，共享组件: 88分"

**转换策略**:
```tsx
// page.tsx 结构设计
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 基于技术日志的SEO优化经验
  // 添加结构化数据、优化元数据
}

export default function WhenToSeekMedicalCarePage({ params }: { params: { locale: string } }) {
  // 使用Suspense和懒加载
  // 集成错误边界
  // 应用响应式容器
}
```

#### 2.2 疼痛评估工具组件

**参考技术日志**: "互动性: 90分，评估工具: 95分"

**组件设计**:
```tsx
// components/PainAssessmentTool.tsx
'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { usePainAssessment } from '../hooks/usePainAssessment';
import { medicalCareGuideStorage } from '../utils/storageManager';
import styles from '../styles/PainAssessmentTool.module.css';

interface PainAssessmentToolProps {
  onAssessmentComplete?: (result: AssessmentResult) => void;
  className?: string;
}

export default function PainAssessmentTool({ onAssessmentComplete, className }: PainAssessmentToolProps) {
  // 组件逻辑实现
}
```

#### 2.3 症状检查清单组件

**参考技术日志**: "清单: 90分，可展开内容: 88分"

**组件特性**:
- 动态症状加载
- 风险等级评估
- 实时结果反馈
- 可访问性支持

#### 2.4 决策树工具组件

**参考技术日志**: "决策支持: 90分，用户旅程: 87分"

**决策树逻辑**:
- 分支决策算法
- 结果可视化
- 历史记录追踪
- 导出功能

### 第3阶段：国际化集成 (1天)

#### 3.1 消息文件整合

**参考技术日志**: "翻译完整性: 90分，文化适应: 88分"

**整合方案**:
```json
// messages/zh.json 新增部分
{
  "medicalCareGuide": {
    // 直接使用souW1e2的完整JSON结构
    "meta": {
      "title": "痛经别再忍！医生详述7大妇科危险信号，教你何时就医",
      "description": "你的痛经正常吗？本文教你进行症状自查，识别7个必须就医的危险信号。了解疼痛背后的妇科问题，明确何时就医，不再延误病情，科学管理你的健康。"
    },
    "header": {
      "title": "痛经 or 健康警报？医生教你识别7个必须就医的危险信号",
      "subtitle": "当\"每月一次的折磨\"变成健康警报，学会倾听身体的声音至关重要。"
    },
    // ... 完整的数据结构
  }
}
```

#### 3.2 next-intl适配

**参考技术日志**: "国际化支持: 89分"

**适配策略**:
- 替换自定义i18n为useTranslations
- 保持原有的数据结构
- 添加类型安全的翻译键

### 第4阶段：样式系统重构 (1天)

#### 4.1 CSS Modules实现

**参考技术日志**: "CSS Modules: 解决样式冲突"

**重构方案**:
```css
/* styles/PainAssessmentTool.module.css */
.container {
  @apply bg-white rounded-2xl shadow-lg p-6 md:p-8 my-10 border border-gray-100;
}

.title {
  @apply text-2xl font-bold text-gray-800 mb-4 flex items-center;
}

.slider {
  @apply w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer;
  background: linear-gradient(to right, var(--color-green-300), var(--color-yellow-400), var(--color-red-400));
}

.slider::-webkit-slider-thumb {
  @apply appearance-none w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-pointer shadow-lg;
}
```

#### 4.2 样式变量系统

**参考技术日志**: "配置管理: 解决硬编码问题"

**变量定义**:
```css
/* styles/variables.css */
:root {
  --medical-guide-primary: #3B82F6;
  --medical-guide-success: #10B981;
  --medical-guide-warning: #F59E0B;
  --medical-guide-danger: #EF4444;
  --medical-guide-border-radius: 0.75rem;
  --medical-guide-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### 第5阶段：数据存储管理 (1天)

#### 5.1 存储管理器实现

**参考技术日志**: "localStorage命名空间管理，避免数据冲突"

**存储方案**:
```typescript
// utils/storageManager.ts
import { StorageManager } from '../../../../lib/storage/StorageManager';
import type { MedicalCareGuideStorage, AssessmentResult } from '../types/medical-care-guide';

class MedicalCareGuideStorageManager extends StorageManager {
  constructor() {
    super('medicalCareGuide');
  }

  saveAssessmentResult(result: AssessmentResult): void {
    const history = this.getAssessmentHistory();
    const updatedHistory = [result, ...history.slice(0, 9)]; // 保留最近10次
    
    this.setItem('assessmentHistory', updatedHistory);
    this.setItem('lastAssessment', result);
  }

  getAssessmentHistory(): AssessmentResult[] {
    return this.getItem('assessmentHistory', []);
  }

  getLastAssessment(): AssessmentResult | null {
    return this.getItem('lastAssessment', null);
  }

  clearHistory(): void {
    this.removeItem('assessmentHistory');
    this.removeItem('lastAssessment');
  }
}

export const medicalCareGuideStorage = new MedicalCareGuideStorageManager();
```

#### 5.2 数据迁移服务

**参考技术日志**: "数据版本管理"

**迁移策略**:
```typescript
// utils/dataMigration.ts
import { dataMigration } from '../../../../lib/storage/DataMigration';

const MEDICAL_CARE_GUIDE_MIGRATIONS = [
  {
    version: 1,
    migrate: (data: any) => ({
      ...data,
      version: 1,
      createdAt: new Date().toISOString()
    })
  },
  {
    version: 2,
    migrate: (data: any) => ({
      ...data,
      version: 2,
      assessmentHistory: data.assessmentHistory?.map((item: any) => ({
        ...item,
        timestamp: item.timestamp || new Date().toISOString()
      })) || []
    })
  }
];

export function migrateMedicalCareGuideData(data: any): any {
  return dataMigration.migrate(data, MEDICAL_CARE_GUIDE_MIGRATIONS);
}
```

### 第6阶段：性能优化 (1天)

#### 6.1 懒加载实现

**参考技术日志**: "懒加载优化: 提升页面性能30%+"

**优化方案**:
```tsx
// page.tsx 中的懒加载
import { lazy, Suspense } from 'react';
import { LoadingSystem } from '../../../interactive-tools/shared/components/LoadingSystem';

const PainAssessmentTool = lazy(() => import('./components/PainAssessmentTool'));
const SymptomChecklist = lazy(() => import('./components/SymptomChecklist'));
const DecisionTree = lazy(() => import('./components/DecisionTree'));

export default function WhenToSeekMedicalCarePage() {
  return (
    <article>
      {/* 静态内容 */}
      
      <Suspense fallback={<LoadingSystem type="component" />}>
        <PainAssessmentTool />
      </Suspense>
      
      <Suspense fallback={<LoadingSystem type="component" />}>
        <SymptomChecklist />
      </Suspense>
      
      <Suspense fallback={<LoadingSystem type="component" />}>
        <DecisionTree />
      </Suspense>
    </article>
  );
}
```

#### 6.2 代码分割优化

**参考技术日志**: "代码分割和缓存策略"

**分割策略**:
- 组件级别分割
- 数据处理逻辑分割
- 样式文件分割
- 第三方库分割

### 第7阶段：SEO优化增强 (1天)

#### 7.1 结构化数据完善

**参考技术日志**: "结构化数据: 89分，技术SEO: 89分"

**Schema实现**:
```tsx
// page.tsx 中的结构化数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = params.locale === 'zh';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    'name': isZh ? '痛经就医指南' : 'Period Pain Medical Guide',
    'description': isZh ? '专业的痛经就医指导' : 'Professional period pain medical guidance',
    'medicalAudience': {
      '@type': 'MedicalAudience',
      'audienceType': 'Patient'
    },
    'about': {
      '@type': 'MedicalCondition',
      'name': 'Dysmenorrhea',
      'alternateName': isZh ? '痛经' : 'Period Pain',
      'associatedAnatomy': {
        '@type': 'AnatomicalStructure',
        'name': isZh ? '子宫' : 'Uterus'
      }
    },
    'mainEntity': {
      '@type': 'MedicalSignOrSymptom',
      'name': isZh ? '痛经症状' : 'Menstrual Pain Symptoms',
      'possibleTreatment': {
        '@type': 'MedicalTherapy',
        'name': isZh ? '痛经治疗' : 'Dysmenorrhea Treatment'
      }
    },
    'author': {
      '@type': 'Organization',
      'name': 'PeriodHub Health',
      'url': 'https://www.periodhub.health'
    },
    'datePublished': '2025-09-20',
    'dateModified': '2025-09-20',
    'inLanguage': params.locale,
    'isAccessibleForFree': true
  };

  return {
    title: isZh 
      ? '痛经别再忍！医生详述7大妇科危险信号，教你何时就医 | PeriodHub'
      : 'Period Pain or Health Alert? A Doctor\'s Guide to 7 Red Flags | PeriodHub',
    description: isZh
      ? '你的痛经正常吗？本文教你进行症状自查，识别7个必须就医的危险信号。包含互动评估工具、决策树和专业医疗建议，科学管理你的健康。'
      : 'Is your period pain normal? Learn to self-check symptoms, identify 7 critical red flags requiring medical attention. Interactive assessment tools, decision tree, and professional medical guidance.',
    keywords: isZh
      ? '痛经, 何时就医, 妇科疾病, 症状自查, 医疗指南, 月经疼痛, 健康评估'
      : 'period pain, when to see doctor, gynecological conditions, symptom checker, medical guide, menstrual pain, health assessment',
    openGraph: {
      title: isZh ? '痛经就医指南 - 识别7个危险信号' : 'Period Pain Medical Guide - 7 Warning Signs',
      description: isZh ? '专业的痛经评估和就医指导' : 'Professional period pain assessment and medical guidance',
      type: 'article',
      locale: params.locale,
      alternateLocale: params.locale === 'zh' ? 'en' : 'zh'
    },
    alternates: {
      canonical: `https://www.periodhub.health/${params.locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
      languages: {
        'en': 'https://www.periodhub.health/en/articles/when-to-seek-medical-care-comprehensive-guide',
        'zh': 'https://www.periodhub.health/zh/articles/when-to-seek-medical-care-comprehensive-guide'
      }
    },
    other: {
      'structured-data': JSON.stringify(structuredData)
    }
  };
}
```

#### 7.2 内部链接优化

**参考技术日志**: "内部链接: 88分，用户旅程: 87分"

**链接策略**:
- 链接到相关的痛经文章
- 链接到疼痛追踪工具
- 链接到紧急缓解指南
- 链接到医疗免责声明

### 第8阶段：测试与验证 (2天)

#### 8.1 组件测试

**参考技术日志**: "测试覆盖: 综合测试套件"

**测试方案**:
```typescript
// components/__tests__/PainAssessmentTool.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'next-intl';
import PainAssessmentTool from '../PainAssessmentTool';

const messages = {
  medicalCareGuide: {
    painTool: {
      title: 'Pain Assessment Tool',
      description: 'Rate your pain level'
    }
  }
};

describe('PainAssessmentTool', () => {
  const renderWithIntl = (component: React.ReactElement) => {
    return render(
      <IntlProvider locale="en" messages={messages}>
        {component}
      </IntlProvider>
    );
  };

  test('renders pain assessment tool correctly', () => {
    renderWithIntl(<PainAssessmentTool />);
    expect(screen.getByText('Pain Assessment Tool')).toBeInTheDocument();
  });

  test('updates pain level when slider changes', () => {
    renderWithIntl(<PainAssessmentTool />);
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '7' } });
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  test('provides appropriate advice based on pain level', () => {
    renderWithIntl(<PainAssessmentTool />);
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '8' } });
    expect(screen.getByText(/severe pain/i)).toBeInTheDocument();
  });
});
```

#### 8.2 集成测试

**参考技术日志**: "16项综合测试，覆盖内容、SEO、UX、技术四大维度"

**测试覆盖**:
- 内容质量测试
- SEO优化测试
- 用户体验测试
- 技术整合测试
- 性能测试
- 可访问性测试

#### 8.3 端到端测试

```typescript
// __tests__/medical-care-guide-e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Medical Care Guide E2E', () => {
  test('complete user journey', async ({ page }) => {
    await page.goto('/zh/articles/when-to-seek-medical-care-comprehensive-guide');
    
    // 测试疼痛评估工具
    await page.locator('[data-testid="pain-slider"]').fill('7');
    await expect(page.locator('[data-testid="pain-advice"]')).toContainText('严重疼痛');
    
    // 测试症状检查清单
    await page.locator('[data-testid="symptom-s1"]').check();
    await page.locator('[data-testid="analyze-symptoms"]').click();
    await expect(page.locator('[data-testid="assessment-result"]')).toBeVisible();
    
    // 测试决策树
    await page.locator('[data-testid="decision-yes"]').click();
    await expect(page.locator('[data-testid="decision-result"]')).toContainText('建议就医');
  });
});
```

## 🔧 技术实现细节

### 自定义Hooks设计

#### usePainAssessment Hook

```typescript
// hooks/usePainAssessment.ts
import { useState, useCallback, useEffect } from 'react';
import { medicalCareGuideStorage } from '../utils/storageManager';
import type { PainScaleItem, AssessmentResult } from '../types/medical-care-guide';

export function usePainAssessment() {
  const [painLevel, setPainLevel] = useState(0);
  const [currentAdvice, setCurrentAdvice] = useState<PainScaleItem | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);

  const updatePainLevel = useCallback((level: number) => {
    setPainLevel(level);
    // 获取对应的建议
    const advice = getPainAdvice(level);
    setCurrentAdvice(advice);
  }, []);

  const saveAssessment = useCallback((result: AssessmentResult) => {
    medicalCareGuideStorage.saveAssessmentResult(result);
    setAssessmentHistory(prev => [result, ...prev.slice(0, 9)]);
  }, []);

  useEffect(() => {
    // 加载历史记录
    const history = medicalCareGuideStorage.getAssessmentHistory();
    setAssessmentHistory(history);
  }, []);

  return {
    painLevel,
    currentAdvice,
    assessmentHistory,
    updatePainLevel,
    saveAssessment
  };
}
```

#### useSymptomChecker Hook

```typescript
// hooks/useSymptomChecker.ts
import { useState, useCallback } from 'react';
import type { SymptomItem, AssessmentResult } from '../types/medical-care-guide';

export function useSymptomChecker(symptoms: SymptomItem[]) {
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const toggleSymptom = useCallback((symptomId: string) => {
    setCheckedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  }, []);

  const analyzeSymptoms = useCallback(() => {
    const checkedSymptomItems = symptoms.filter(s => checkedSymptoms.includes(s.id));
    const emergencyCount = checkedSymptomItems.filter(s => s.risk === 'emergency').length;
    const highRiskCount = checkedSymptomItems.filter(s => s.risk === 'high').length;

    let riskLevel: AssessmentResult['riskLevel'];
    let shouldSeeDoctor = false;
    let urgency: AssessmentResult['urgency'] = 'monitor';

    if (emergencyCount > 0) {
      riskLevel = 'emergency';
      shouldSeeDoctor = true;
      urgency = 'immediate';
    } else if (highRiskCount >= 2) {
      riskLevel = 'high';
      shouldSeeDoctor = true;
      urgency = 'within_week';
    } else if (highRiskCount === 1) {
      riskLevel = 'medium';
      shouldSeeDoctor = true;
      urgency = 'routine';
    } else {
      riskLevel = 'low';
    }

    const result: AssessmentResult = {
      painLevel: 0, // 将由疼痛评估提供
      symptoms: checkedSymptoms,
      riskLevel,
      recommendations: generateRecommendations(riskLevel, checkedSymptomItems),
      shouldSeeDoctor,
      urgency
    };

    setAssessmentResult(result);
    return result;
  }, [checkedSymptoms, symptoms]);

  return {
    checkedSymptoms,
    assessmentResult,
    toggleSymptom,
    analyzeSymptoms,
    resetAssessment: () => {
      setCheckedSymptoms([]);
      setAssessmentResult(null);
    }
  };
}
```

### 错误处理策略

#### 错误边界实现

```tsx
// components/MedicalCareGuideErrorBoundary.tsx
import { ErrorBoundary } from '../../../interactive-tools/shared/components/ErrorBoundary';
import { useTranslations } from 'next-intl';

interface MedicalCareGuideErrorBoundaryProps {
  children: React.ReactNode;
}

export function MedicalCareGuideErrorBoundary({ children }: MedicalCareGuideErrorBoundaryProps) {
  const t = useTranslations('medicalCareGuide.errors');

  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {t('title')}
          </h3>
          <p className="text-red-700 mb-4">
            {t('description')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {t('reload')}
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 可访问性增强

#### ARIA支持实现

```tsx
// components/AccessiblePainSlider.tsx
interface AccessiblePainSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function AccessiblePainSlider({ 
  value, 
  onChange, 
  min = 0, 
  max = 10, 
  step = 1 
}: AccessiblePainSliderProps) {
  const t = useTranslations('medicalCareGuide.painTool');

  return (
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={styles.slider}
        aria-label={t('sliderLabel')}
        aria-describedby="pain-description"
        aria-valuetext={`${value} ${t('outOf10')}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        role="slider"
      />
      <div id="pain-description" className="sr-only">
        {t('sliderDescription')}
      </div>
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <span>{t('noPain')}</span>
        <span>{t('severePain')}</span>
      </div>
    </div>
  );
}
```

## 📊 质量保证体系

### 代码质量检查

#### ESLint配置

```json
// .eslintrc.medical-care-guide.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error"
  }
}
```

#### TypeScript严格模式

```json
// tsconfig.medical-care-guide.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": [
    "app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/**/*"
  ]
}
```

### 性能监控

#### Core Web Vitals追踪

```typescript
// utils/performanceMonitor.ts
import { PerformanceMonitor } from '../../../../lib/analytics/PerformanceMonitor';

export class MedicalCareGuidePerformanceMonitor extends PerformanceMonitor {
  static trackComponentLoad(componentName: string, loadTime: number) {
    this.trackEvent('component_load', {
      component: componentName,
      load_time: loadTime,
      page: 'medical-care-guide'
    });
  }

  static trackUserInteraction(interaction: string, componentName: string) {
    this.trackEvent('user_interaction', {
      interaction,
      component: componentName,
      page: 'medical-care-guide',
      timestamp: Date.now()
    });
  }

  static trackAssessmentCompletion(assessmentType: string, duration: number) {
    this.trackEvent('assessment_completion', {
      assessment_type: assessmentType,
      duration,
      page: 'medical-care-guide'
    });
  }
}
```

## 🚀 部署与发布

### 部署前检查清单

```bash
#!/bin/bash
# scripts/medical-care-guide-deploy-check.sh

echo "🔍 医疗护理指南部署前检查..."

# 1. TypeScript类型检查
echo "📝 TypeScript类型检查..."
npx tsc --noEmit --project tsconfig.medical-care-guide.json

# 2. ESLint检查
echo "🔧 ESLint检查..."
npx eslint "app/[locale]/articles/when-to-seek-medical-care-comprehensive-guide/**/*.{ts,tsx}"

# 3. 组件测试
echo "🧪 组件测试..."
npm test -- --testPathPattern="when-to-seek-medical-care-comprehensive-guide"

# 4. 可访问性测试
echo "♿ 可访问性测试..."
npx axe-cli http://localhost:3000/zh/articles/when-to-seek-medical-care-comprehensive-guide

# 5. 性能测试
echo "⚡ 性能测试..."
npx lighthouse http://localhost:3000/zh/articles/when-to-seek-medical-care-comprehensive-guide --output=json

# 6. SEO检查
echo "🔍 SEO检查..."
node scripts/seo-check-medical-care-guide.js

echo "✅ 部署前检查完成！"
```

### 渐进式发布策略

```typescript
// lib/featureFlags/medicalCareGuide.ts
export const MEDICAL_CARE_GUIDE_FLAGS = {
  enableNewMedicalCareGuide: {
    enabled: false,
    rolloutPercentage: 0,
    targetAudience: ['beta-users'],
    startDate: '2025-09-25',
    endDate: '2025-10-25'
  },
  enableAdvancedAssessment: {
    enabled: false,
    rolloutPercentage: 0,
    dependencies: ['enableNewMedicalCareGuide']
  }
};
```

## 📈 成功指标与监控

### 关键性能指标 (KPIs)

1. **内容质量指标**
   - 目标：从70分提升至95+分
   - 监控：用户停留时间、跳出率、完成率

2. **SEO表现指标**
   - 目标：Google索引成功
   - 监控：搜索排名、点击率、展现量

3. **用户体验指标**
   - 目标：工具使用率>80%
   - 监控：交互率、完成率、用户反馈

4. **技术性能指标**
   - 目标：LCP<2.5s, FID<100ms, CLS<0.1
   - 监控：Core Web Vitals、错误率

### 监控仪表板

```typescript
// utils/analyticsTracker.ts
export class MedicalCareGuideAnalytics {
  static trackPageView(locale: string) {
    // Google Analytics 4
    gtag('event', 'page_view', {
      page_title: 'Medical Care Guide',
      page_location: window.location.href,
      language: locale
    });
  }

  static trackToolUsage(toolName: string, completed: boolean) {
    gtag('event', 'tool_usage', {
      tool_name: toolName,
      completed: completed,
      page: 'medical-care-guide'
    });
  }

  static trackAssessmentResult(result: AssessmentResult) {
    gtag('event', 'assessment_completed', {
      risk_level: result.riskLevel,
      should_see_doctor: result.shouldSeeDoctor,
      urgency: result.urgency,
      symptoms_count: result.symptoms.length
    });
  }
}
```

## 🎯 预期成果

### 量化目标

| 指标 | 当前状态 | 目标状态 | 提升幅度 |
|------|----------|----------|----------|
| **内容质量评分** | 70/100 | 95+/100 | +36% |
| **Google索引状态** | 未索引 | 已索引 | 100% |
| **用户停留时间** | 2分钟 | 5分钟+ | +150% |
| **工具完成率** | 0% | 80%+ | 新增 |
| **页面加载速度** | 3.5s | <2.5s | +29% |

### 业务价值

1. **解决索引问题** - 提升搜索可见性
2. **改善用户体验** - 提供实用的健康工具
3. **增强内容价值** - 从信息展示转为解决方案提供
4. **建立技术标准** - 为其他文章重写提供模板

## 📋 风险管理

### 技术风险

| 风险 | 影响程度 | 发生概率 | 缓解措施 |
|------|----------|----------|----------|
| 组件转换复杂度 | 中 | 低 | 逐步迁移，保持原有逻辑 |
| 性能回归 | 中 | 低 | 性能监控，优化策略 |
| 样式冲突 | 低 | 中 | CSS Modules隔离 |
| 数据迁移问题 | 低 | 低 | 版本管理，回滚机制 |

### 业务风险

| 风险 | 影响程度 | 发生概率 | 缓解措施 |
|------|----------|----------|----------|
| 用户接受度 | 中 | 低 | A/B测试，用户反馈 |
| SEO效果不佳 | 高 | 低 | 基于成功经验，持续优化 |
| 维护成本增加 | 低 | 中 | 文档完善，代码规范 |

## 🎉 总结

这个集成方案基于痛经文章重写的成功经验，将souW1e2的优秀设计转换为符合项目标准的Next.js实现。通过8个阶段的系统性集成，预期将"何时就医指南"从70分提升至95+分，解决Google索引问题，为用户提供真正有价值的健康工具。

**关键成功因素**:
1. 保持souW1e2的优秀用户体验设计
2. 应用技术日志的成功经验
3. 严格的质量保证体系
4. 渐进式发布和监控策略

**下一步**: 等待确认后开始第1阶段的基础架构搭建工作。