import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import dynamic from 'next/dynamic';
import RelatedToolCard from '../components/RelatedToolCard';
import RelatedArticleCard from '../components/RelatedArticleCard';
import ScenarioSolutionCard from '../components/ScenarioSolutionCard';

// 动态导入互动工具组件 - 代码分割优化
const PainTrackerTool = dynamic(() => import('../components/PainTrackerTool'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const SymptomAssessmentTool = dynamic(() => import('../components/SymptomAssessmentTool'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const ConstitutionTestTool = dynamic(() => import('../components/ConstitutionTestTool'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const PeriodPainAssessmentTool = dynamic(() => import('../components/PeriodPainAssessmentTool'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const CycleTrackerTool = dynamic(() => import('../components/CycleTrackerTool'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const SymptomTrackerTool = dynamic(() => import('../components/SymptomTrackerTool'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

// 动态导入共享组件
const EmergencyReliefGuide = dynamic(() => import('../shared/components/EmergencyReliefGuide'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const MedicalDisclaimer = dynamic(() => import('../shared/components/MedicalDisclaimer'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-24 rounded-lg" />
});

// Types
type Locale = 'en' | 'zh';

// Cycle Tracker 专用推荐数据配置
const getCycleTrackerRecommendations = (locale: Locale) => {
  const isZh = locale === 'zh';
  
  // 相关工具推荐
  const relatedTools = [
    {
      id: 'pain-tracker',
      title: isZh ? '痛经追踪器' : 'Pain Tracker',
      description: isZh 
        ? '记录疼痛模式，分析趋势变化' 
        : 'Track pain patterns and analyze trends',
      href: `/${locale}/interactive-tools/pain-tracker`,
      icon: '📊',
      priority: 'high',
      iconColor: 'blue'
    },
    {
      id: 'symptom-assessment',
      title: isZh ? '症状评估工具' : 'Symptom Assessment',
      description: isZh
        ? '专业症状分析，获得精准建议'
        : 'Professional symptom analysis for precise recommendations',
      href: `/${locale}/interactive-tools/symptom-assessment`,
      icon: '🔍',
      priority: 'high',
      iconColor: 'green'
    },
    {
      id: 'nutrition-recommendation-generator',
      title: isZh ? '营养推荐生成器' : 'Nutrition Recommendation Generator',
      description: isZh
        ? '根据周期阶段推荐个性化营养方案'
        : 'Personalized nutrition recommendations based on cycle phases',
      href: `/${locale}/interactive-tools/nutrition-recommendation-generator`,
      icon: '🥗',
      priority: 'high',
      iconColor: 'green'
    }
  ];

  // 相关文章推荐
  const relatedArticles = [
    {
      id: 'understanding-your-cycle',
      title: isZh ? '了解你的月经周期' : 'Understanding Your Menstrual Cycle',
      description: isZh 
        ? '深入了解月经周期的各个阶段和生理变化'
        : 'Deep understanding of menstrual cycle phases and physiological changes',
      href: `/${locale}/health-guide`,
      category: isZh ? '周期知识' : 'cycle-knowledge',
      readTime: isZh ? '6分钟阅读' : '6 min read',
      priority: 'high',
      icon: '📅',
      iconColor: 'blue',
      anchorTextType: 'cycle_knowledge'
    },
    {
      id: 'period-friendly-recipes',
      title: isZh ? '经期友好食谱' : 'Period-Friendly Recipes',
      description: isZh
        ? '营养丰富的经期食谱，缓解症状'
        : 'Nutritious period-friendly recipes to alleviate symptoms',
      href: `/${locale}/articles/period-friendly-recipes`,
      category: isZh ? '营养健康' : 'nutrition-health',
      readTime: isZh ? '8分钟阅读' : '8 min read',
      priority: 'high',
      icon: '🥗',
      iconColor: 'green',
      anchorTextType: 'cycle_nutrition'
    },
    {
      id: 'when-to-seek-medical-care-comprehensive-guide',
      title: isZh ? '何时需要医疗护理' : 'When to Seek Medical Care',
      description: isZh
        ? '识别需要医疗干预的周期问题'
        : 'Recognize cycle issues that require medical intervention',
      href: `/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`,
      category: isZh ? '健康管理' : 'health-management',
      readTime: isZh ? '7分钟阅读' : '7 min read',
      priority: 'medium',
      icon: '⚖️',
      iconColor: 'purple',
      anchorTextType: 'cycle_management'
    }
  ];

  // 场景解决方案推荐
  const scenarioSolutions = [
    {
      id: 'office',
      title: isZh ? '职场周期管理方案' : 'Workplace Cycle Management',
      description: isZh
        ? '职场女性的周期健康管理策略'
        : 'Cycle health management strategies for working women',
      href: `/${locale}/scenario-solutions/office`,
      icon: '💼',
      priority: 'high',
      iconColor: 'blue'
    },
    {
      id: 'exercise',
      title: isZh ? '运动与周期平衡' : 'Exercise & Cycle Balance',
      description: isZh
        ? '运动爱好者的周期同步训练'
        : 'Cycle-synced training for fitness enthusiasts',
      href: `/${locale}/scenario-solutions/exercise`,
      icon: '🏃‍♀️',
      priority: 'medium',
      iconColor: 'orange'
    },
    {
      id: 'sleep',
      title: isZh ? '睡眠与周期调节' : 'Sleep & Cycle Regulation',
      description: isZh
        ? '优化睡眠质量，改善周期健康'
        : 'Optimize sleep quality to improve cycle health',
      href: `/${locale}/scenario-solutions/sleep`,
      icon: '😴',
      priority: 'medium',
      iconColor: 'purple'
    }
  ];

  return { relatedTools, relatedArticles, scenarioSolutions };
};

// 中医体质测试专用推荐数据配置
const getConstitutionTestRecommendations = (locale: Locale) => {
  const isZh = locale === 'zh';
  
  // 相关工具推荐
  const relatedTools = [
    {
      id: 'pain-tracker',
      title: isZh ? '痛经追踪器' : 'Pain Tracker',
      description: isZh
        ? '记录疼痛模式，分析体质调理效果'
        : 'Track pain patterns and analyze constitution conditioning effects',
      href: `/${locale}/interactive-tools/pain-tracker`,
      category: isZh ? '疼痛管理' : 'pain-management',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '每日2-3分钟' : '2-3 min daily',
      priority: 'high',
      icon: '📊',
      iconColor: 'red'
    },
    {
      id: 'nutrition-recommendation-generator',
      title: isZh ? '营养推荐生成器' : 'Nutrition Generator',
      description: isZh
        ? '根据体质生成个性化营养建议'
        : 'Generate personalized nutrition recommendations based on constitution',
      href: `/${locale}/interactive-tools/nutrition-recommendation-generator`,
      category: isZh ? '营养管理' : 'nutrition-management',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '3-5分钟' : '3-5 min',
      priority: 'high',
      icon: '🥗',
      iconColor: 'green'
    },
    {
      id: 'cycle-tracker',
      title: isZh ? '智能周期追踪器' : 'Smart Cycle Tracker',
      description: isZh
        ? '追踪月经周期，了解体质变化规律'
        : 'Track menstrual cycles and understand constitution patterns',
      href: `/${locale}/interactive-tools/cycle-tracker`,
      category: isZh ? '周期管理' : 'cycle-management',
      difficulty: isZh ? '简单' : 'Easy',
      estimatedTime: isZh ? '每日1分钟' : '1 min daily',
      priority: 'medium',
      icon: '📅',
      iconColor: 'blue'
    }
  ];

  // 相关文章推荐
  const relatedArticles = [
    {
      id: 'tcm-constitution-guide',
      title: isZh ? '中医体质调理完全指南' : 'Complete TCM Constitution Guide',
      description: isZh 
        ? '深入了解中医体质理论，掌握体质调理的科学方法'
        : 'Deep understanding of TCM constitution theory and scientific conditioning methods',
      href: `/${locale}/articles/tcm-constitution-complete-guide`,
      category: isZh ? '中医调理' : 'tcm-conditioning',
      readTime: isZh ? '12分钟阅读' : '12 min read',
      priority: 'high',
      icon: '🌿',
      iconColor: 'green',
      anchorTextType: 'tcm_guide'
    },
    {
      id: 'acupoint-massage-techniques',
      title: isZh ? '穴位按摩技巧大全' : 'Complete Acupoint Massage Guide',
      description: isZh
        ? '掌握专业穴位按摩手法，缓解经期不适'
        : 'Master professional acupoint massage techniques for menstrual relief',
      href: `/${locale}/articles/acupoint-massage-complete-guide`,
      category: isZh ? '穴位疗法' : 'acupoint-therapy',
      readTime: isZh ? '10分钟阅读' : '10 min read',
      priority: 'high',
      icon: '👐',
      iconColor: 'purple',
      anchorTextType: 'acupoint_massage'
    },
    {
      id: 'menstrual-nutrition-tcm',
      title: isZh ? '经期营养中医调理' : 'Menstrual Nutrition TCM Guide',
      description: isZh
        ? '根据体质类型制定个性化营养方案'
        : 'Personalized nutrition plans based on constitution types',
      href: `/${locale}/articles/menstrual-nutrition-tcm-guide`,
      category: isZh ? '营养调理' : 'nutrition-conditioning',
      readTime: isZh ? '8分钟阅读' : '8 min read',
      priority: 'medium',
      icon: '🥗',
      iconColor: 'orange',
      anchorTextType: 'tcm_nutrition'
    }
  ];

  // 场景解决方案推荐
  const scenarioSolutions = [
    {
      id: 'office',
      title: isZh ? '职场健康管理' : 'Workplace Wellness',
      description: isZh
        ? '职场环境下的体质调理策略'
        : 'Constitution conditioning strategies in workplace',
      href: `/${locale}/scenario-solutions/office`,
      icon: '💼',
      priority: 'high',
      iconColor: 'blue'
    },
    {
      id: 'exercise',
      title: isZh ? '运动与体质平衡' : 'Exercise & Constitution Balance',
      description: isZh
        ? '适合不同体质的运动方案'
        : 'Exercise plans suitable for different constitutions',
      href: `/${locale}/scenario-solutions/exercise`,
      icon: '🏃‍♀️',
      priority: 'high',
      iconColor: 'orange'
    },
    {
      id: 'sleep',
      title: isZh ? '睡眠与体质调节' : 'Sleep & Constitution Regulation',
      description: isZh
        ? '优化睡眠质量，改善体质健康'
        : 'Optimize sleep quality to improve constitution health',
      href: `/${locale}/scenario-solutions/sleep`,
      icon: '😴',
      priority: 'medium',
      iconColor: 'purple'
    }
  ];

  return { relatedTools, relatedArticles, scenarioSolutions };
};

// 推荐数据配置 - 精简版，只推荐最相关的内容
const getRecommendationData = (locale: Locale, toolType?: string) => {
  const isZh = locale === 'zh';
  
  // 根据工具类型返回不同的推荐数据
  if (toolType === 'cycle-tracker') {
    return getCycleTrackerRecommendations(locale);
  }
  
  if (toolType === 'constitution-test') {
    return getConstitutionTestRecommendations(locale);
  }
  
  // 默认推荐数据（用于period-pain-assessment）
  // 精简相关工具推荐 - 只推荐2个最相关的
  const relatedTools = [
    {
      id: 'pain-tracker',
      title: isZh ? '痛经追踪器' : 'Pain Tracker',
      description: isZh 
        ? '记录疼痛模式，分析趋势变化' 
        : 'Track pain patterns and analyze trends',
      href: `/${locale}/interactive-tools/pain-tracker`,
      icon: '📊',
      priority: 'high',
      iconColor: 'blue'
    },
    {
      id: 'symptom-assessment',
      title: isZh ? '症状评估工具' : 'Symptom Assessment',
      description: isZh
        ? '专业症状分析，获得精准建议'
        : 'Professional symptom analysis for precise recommendations',
      href: `/${locale}/interactive-tools/symptom-assessment`,
      icon: '🔍',
      priority: 'high',
      iconColor: 'green'
    }
  ];

  // 精简相关文章推荐 - 只推荐3个最相关的
  const relatedArticles = [
    {
      id: 'ginger-menstrual-pain-relief-guide',
      title: isZh ? '生姜缓解痛经完全指南' : 'Complete Ginger Menstrual Pain Relief Guide',
      description: isZh
        ? '科学验证的生姜疗法，天然无副作用缓解痛经'
        : 'Scientifically proven ginger therapy for natural pain relief',
      href: `/${locale}/articles/ginger-menstrual-pain-relief-guide`,
      category: isZh ? '自然疗法' : 'natural-therapy',
      readTime: isZh ? '8分钟阅读' : '8 min read',
      priority: 'high',
      icon: '🫚',
      iconColor: 'orange',
      anchorTextType: 'ginger'
    },
    {
      id: 'heat-therapy-complete-guide',
      title: isZh ? '热敷疗法完全指南' : 'Heat Therapy Complete Guide',
      description: isZh
        ? '热敷的科学原理和正确使用方法'
        : 'Scientific principles and proper usage of heat therapy',
      href: `/${locale}/articles/heat-therapy-complete-guide`,
      category: isZh ? '自然疗法' : 'natural-therapy',
      readTime: isZh ? '6分钟阅读' : '6 min read',
      priority: 'high',
      icon: '🔥',
      iconColor: 'red',
      anchorTextType: 'heat'
    },
    {
      id: 'when-to-see-doctor-period-pain',
      title: isZh ? '痛经何时需要看医生' : 'When to See Doctor for Period Pain',
      description: isZh
        ? '医生专业指导，识别需要医疗干预的症状'
        : 'Professional guidance on recognizing symptoms that need medical attention',
      href: `/${locale}/articles/when-to-see-doctor-period-pain`,
      category: isZh ? '医疗指导' : 'medical-guidance',
      readTime: isZh ? '5分钟阅读' : '5 min read',
      priority: 'high',
      icon: '👩‍⚕️',
      iconColor: 'blue',
      anchorTextType: 'medical'
    }
  ];

  // 精简场景解决方案推荐 - 只推荐2个最相关的，使用正确的路径
  const scenarioSolutions = [
    {
      id: 'office',
      title: isZh ? '职场痛经管理方案' : 'Office Period Management',
      description: isZh
        ? '职场环境下的痛经应对策略'
        : 'Period pain management strategies in office environment',
      href: `/${locale}/scenario-solutions/office`,
      icon: '💼',
      priority: 'high',
      iconColor: 'purple'
    },
    {
      id: 'social',
      title: isZh ? '社交场合痛经应对' : 'Social Occasions Management',
      description: isZh
        ? '聚会、约会等社交场合的痛经处理'
        : 'Managing period pain during social events',
      href: `/${locale}/scenario-solutions/social`,
      icon: '🎉',
      priority: 'medium',
      iconColor: 'pink'
    }
  ];

  return { relatedTools, relatedArticles, scenarioSolutions };
};

interface Tool {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
  };
  content: string;
  locale: Locale;
}

// Mock function to get tool data - replace with actual data fetching
const getToolBySlug = async (slug: string, locale: Locale): Promise<Tool | null> => {
  const sampleTools: Tool[] = [
    {
      slug: 'symptom-assessment',
      frontmatter: {
        title: locale === 'zh' ? '痛经症状评估工具 | 疼痛类型智能识别' : 'Period Pain Symptom Assessment | Smart Pain Type Identification',
        description: locale === 'zh'
          ? '痛经症状评估工具：通过专业医学问卷快速识别痛经类型和疼痛程度，智能分析症状模式，为您提供科学的个性化缓解建议和治疗方案。'
          : 'Period pain symptom assessment tool: Quickly identify menstrual pain types and severity through professional medical questionnaires, intelligently analyze symptom patterns, and provide scientific personalized relief recommendations.',
        category: locale === 'zh' ? '评估工具' : 'Assessment',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '5-10分钟' : '5-10 minutes',
      },
      content: locale === 'zh' ? `
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">开始评估前</h3>
          <p class="text-blue-700">请确保您在一个安静、私密的环境中，可以专心回答问题。这个评估将帮助您更好地了解自己的症状模式。</p>
        </div>
        
        <h2>症状评估问卷</h2>
        <p>请根据您最近3个月的经期体验回答以下问题：</p>
        
        <div class="space-y-6 mt-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">1. 疼痛强度</h3>
            <p class="text-gray-600 mb-3">请评估您经期疼痛的平均强度（1-10分，10分为最痛）：</p>
            <div class="grid grid-cols-5 gap-2">
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">1-2分<br><span class="text-xs text-gray-500">轻微</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">3-4分<br><span class="text-xs text-gray-500">轻度</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">5-6分<br><span class="text-xs text-gray-500">中度</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">7-8分<br><span class="text-xs text-gray-500">重度</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">9-10分<br><span class="text-xs text-gray-500">极重</span></button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">2. 疼痛类型</h3>
            <p class="text-gray-600 mb-3">您的疼痛主要表现为：</p>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 痉挛性疼痛（抽筋样）
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 胀痛（腹部胀满）
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 刺痛（针扎样）
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 钝痛（持续性隐痛）
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 放射痛（向腰背部扩散）
              </label>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">3. 伴随症状</h3>
            <p class="text-gray-600 mb-3">除了腹痛，您还有以下症状吗？</p>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 头痛
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 恶心呕吐
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 腰痛
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 乳房胀痛
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 情绪波动
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 疲劳乏力
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 失眠
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 食欲改变
              </label>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">4. 疼痛时间</h3>
            <p class="text-gray-600 mb-3">疼痛通常在什么时候开始？</p>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="pain-timing" class="mr-3"> 月经前1-2天
              </label>
              <label class="flex items-center">
                <input type="radio" name="pain-timing" class="mr-3"> 月经第一天
              </label>
              <label class="flex items-center">
                <input type="radio" name="pain-timing" class="mr-3"> 月经期间持续
              </label>
              <label class="flex items-center">
                <input type="radio" name="pain-timing" class="mr-3"> 排卵期也有疼痛
              </label>
            </div>
          </div>
          
          <div class="text-center">
            <button class="btn-primary px-8 py-3">
              提交评估
            </button>
          </div>
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
          <h3 class="text-lg font-semibold text-yellow-800 mb-2">重要提醒</h3>
          <p class="text-yellow-700">此评估仅供参考，不能替代专业医疗诊断。如果您的症状严重或持续恶化，请及时就医。</p>
        </div>
      ` : `
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">Before Starting</h3>
          <p class="text-blue-700">Please ensure you're in a quiet, private environment where you can focus on answering the questions. This assessment will help you better understand your symptom patterns.</p>
        </div>
        
        <h2>Symptom Assessment Questionnaire</h2>
        <p>Please answer the following questions based on your menstrual experience over the past 3 months:</p>
        
        <div class="space-y-6 mt-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">1. Pain Intensity</h3>
            <p class="text-gray-600 mb-3">Please rate the average intensity of your menstrual pain (1-10 scale, 10 being the worst):</p>
            <div class="grid grid-cols-5 gap-2">
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">1-2<br><span class="text-xs text-gray-500">Minimal</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">3-4<br><span class="text-xs text-gray-500">Mild</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">5-6<br><span class="text-xs text-gray-500">Moderate</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">7-8<br><span class="text-xs text-gray-500">Severe</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">9-10<br><span class="text-xs text-gray-500">Extreme</span></button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">2. Pain Type</h3>
            <p class="text-gray-600 mb-3">Your pain is mainly characterized as:</p>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Cramping (spasm-like)
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Bloating (abdominal fullness)
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Sharp pain (stabbing)
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Dull ache (continuous)
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Radiating pain (to back/legs)
              </label>
            </div>
          </div>
          
          <div class="text-center">
            <button class="btn-primary px-8 py-3">
              Submit Assessment
            </button>
          </div>
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
          <h3 class="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
          <p class="text-yellow-700">This assessment is for reference only and cannot replace professional medical diagnosis. If your symptoms are severe or worsening, please seek medical attention promptly.</p>
        </div>
      `,
      locale,
    },
    {
      slug: 'pain-tracker',
      frontmatter: {
        title: locale === 'zh' ? '痛经计算器 | 智能疼痛追踪分析' : 'Period Pain Calculator | Smart Pain Tracking & Analysis',
        description: locale === 'zh' 
          ? '痛经严重度计算器：智能分析疼痛模式，计算疼痛等级，预测周期趋势，为您提供个性化缓解建议和治疗优化方案。'
          : 'Period pain severity calculator: Intelligently analyze pain patterns, calculate pain levels, predict cycle trends, and provide personalized relief recommendations.',
        category: locale === 'zh' ? '计算器工具' : 'Calculator Tool',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '每日2-3分钟' : '2-3 minutes daily',
      },
      content: locale === 'zh' ? `
        <h2>痛经计算器 | 智能疼痛分析系统</h2>
        <p>通过每日记录自动计算疼痛等级，智能分析疼痛模式和周期趋势，为您提供科学的疼痛评估和个性化缓解建议。</p>
        
        <div class="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
          <h3 class="text-lg font-semibold text-green-800 mb-2">使用建议</h3>
          <p class="text-green-700">建议每天在固定时间记录，持续至少3个月经周期，以获得更准确的模式分析。</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">今日记录</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">疼痛强度 (0-10)</label>
                <input type="range" min="0" max="10" class="w-full">
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>无痛</span>
                  <span>极痛</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">月经状态</label>
                <select class="w-full p-2 border rounded">
                  <option>请选择</option>
                  <option>月经期</option>
                  <option>月经前期</option>
                  <option>月经后期</option>
                  <option>排卵期</option>
                  <option>其他时期</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">使用的缓解方法</label>
                <div class="space-y-1">
                  <label class="flex items-center text-sm">
                    <input type="checkbox" class="mr-2"> 热敷
                  </label>
                  <label class="flex items-center text-sm">
                    <input type="checkbox" class="mr-2"> 药物
                  </label>
                  <label class="flex items-center text-sm">
                    <input type="checkbox" class="mr-2"> 运动
                  </label>
                  <label class="flex items-center text-sm">
                    <input type="checkbox" class="mr-2"> 休息
                  </label>
                </div>
              </div>
              
              <button class="w-full btn-primary">保存今日记录</button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">趋势分析</h3>
            <div class="space-y-4">
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">本月平均疼痛强度</h4>
                <div class="text-2xl font-bold text-primary-600">6.2/10</div>
                <p class="text-sm text-gray-600">比上月下降 0.8 分</p>
              </div>
              
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">疼痛天数</h4>
                <div class="text-2xl font-bold text-secondary-600">4天</div>
                <p class="text-sm text-gray-600">本周期疼痛持续时间</p>
              </div>
              
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">最有效缓解方法</h4>
                <div class="text-lg font-semibold text-accent-600">热敷 + 休息</div>
                <p class="text-sm text-gray-600">基于您的记录分析</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-8 bg-purple-50 border-l-4 border-purple-500 p-6">
          <h3 class="text-lg font-semibold text-purple-800 mb-2">数据导出</h3>
          <p class="text-purple-700 mb-4">您可以导出疼痛记录，在就医时提供给医生参考。</p>
          <button class="btn-outline">导出PDF报告</button>
        </div>
      ` : `
        <h2>Period Pain Calculator | Smart Pain Analysis System</h2>
        <p>Automatically calculate pain levels through daily records, intelligently analyze pain patterns and cycle trends, providing scientific pain assessment and personalized relief recommendations.</p>
        
        <div class="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
          <h3 class="text-lg font-semibold text-green-800 mb-2">Usage Tips</h3>
          <p class="text-green-700">We recommend recording at the same time each day for at least 3 menstrual cycles to get more accurate pattern analysis.</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">Today's Record</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Pain Intensity (0-10)</label>
                <input type="range" min="0" max="10" class="w-full">
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No Pain</span>
                  <span>Extreme</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Menstrual Status</label>
                <select class="w-full p-2 border rounded">
                  <option>Please select</option>
                  <option>Menstrual period</option>
                  <option>Pre-menstrual</option>
                  <option>Post-menstrual</option>
                  <option>Ovulation</option>
                  <option>Other</option>
                </select>
              </div>
              
              <button class="w-full btn-primary">Save Today's Record</button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">Trend Analysis</h3>
            <div class="space-y-4">
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">Average Pain This Month</h4>
                <div class="text-2xl font-bold text-primary-600">6.2/10</div>
                <p class="text-sm text-gray-600">Decreased by 0.8 from last month</p>
              </div>
              
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">Pain Days</h4>
                <div class="text-2xl font-bold text-secondary-600">4 days</div>
                <p class="text-sm text-gray-600">Duration this cycle</p>
              </div>
            </div>
          </div>
        </div>
      `,
      locale,
    },
    {
      slug: 'constitution-test',
      frontmatter: {
        title: locale === 'zh' ? '中医体质测试' : 'TCM Constitution Test',
        description: locale === 'zh'
          ? '通过11个问题了解您的中医体质类型，获得个性化的穴位、饮食和生活方式建议。'
          : 'Discover your TCM constitution type through 11 questions and get personalized acupoint, diet, and lifestyle recommendations.',
        category: locale === 'zh' ? '体质评估' : 'Constitution Assessment',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '5-8分钟' : '5-8 minutes',
      },
      content: '', // Content will be handled by the ConstitutionTestTool component
      locale,
    },
    {
      slug: 'period-pain-assessment',
      frontmatter: {
        title: locale === 'zh' ? '痛经严重度评估计算器 | 快速疼痛分析' : 'Period Pain Severity Calculator | Quick Pain Analysis',
        description: locale === 'zh'
          ? '回答几个简单问题，初步了解你的痛经类型和严重程度，获得个性化的健康建议。'
          : 'Answer a few simple questions to understand your period pain type and severity, and get personalized health recommendations.',
        category: locale === 'zh' ? '健康评估' : 'Health Assessment',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '3-5分钟' : '3-5 minutes',
      },
      content: '', // Content will be handled by the PeriodPainAssessmentTool component
      locale,
    },
    {
      slug: 'cycle-tracker',
      frontmatter: {
        title: locale === 'zh' ? '智能周期追踪器' : 'Smart Cycle Tracker',
        description: locale === 'zh'
          ? '智能追踪月经周期，预测下次月经时间，记录症状变化，帮助您更好地了解身体规律。'
          : 'Intelligently track your menstrual cycle, predict next period, record symptom changes, and help you better understand your body patterns.',
        category: locale === 'zh' ? '追踪工具' : 'Tracking Tool',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '每日1-2分钟' : '1-2 minutes daily',
      },
      content: '', // Content will be handled by the CycleTrackerTool component
      locale,
    },
    {
      slug: 'symptom-tracker',
      frontmatter: {
        title: locale === 'zh' ? '症状记录器' : 'Symptom Tracker',
        description: locale === 'zh'
          ? '详细记录经期症状，包括疼痛强度、情绪变化、身体反应等，为健康管理提供数据支持。'
          : 'Detailed recording of menstrual symptoms including pain intensity, mood changes, physical reactions, providing data support for health management.',
        category: locale === 'zh' ? '记录工具' : 'Recording Tool',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '每日3-5分钟' : '3-5 minutes daily',
      },
      content: '', // Content will be handled by the SymptomTrackerTool component
      locale,
    }
  ];

  const tool = sampleTools.find(t => t.slug === slug && t.locale === locale);
  return tool || null;
};

// Generate static params for all tools
export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'zh'];
  const toolSlugs = [
    'symptom-assessment',
    'pain-tracker',
    'constitution-test',
    'period-pain-assessment',
    'cycle-tracker',
    'symptom-tracker'
  ];

  const params = [];
  for (const locale of locales) {
    for (const tool of toolSlugs) {
      params.push({ locale, tool });
    }
  }

  return params;
}

// Generate metadata for the tool
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; tool: string }>
}): Promise<Metadata> {
  const { locale, tool } = await params;
  const toolData = await getToolBySlug(tool, locale);

  if (!toolData) {
    return {
      title: locale === 'zh' ? '工具未找到' : 'Tool Not Found',
      description: locale === 'zh' ? '抱歉，我们找不到您要查找的工具。' : 'Sorry, we could not find the tool you are looking for.',
    };
  }

  return {
    title: `${toolData.frontmatter.title} | periodhub.health`,
    description: toolData.frontmatter.description,
    openGraph: {
      title: toolData.frontmatter.title,
      description: toolData.frontmatter.description,
      type: 'website',
    },
  };
}

export default async function ToolPage({
  params
}: {
  params: Promise<{ locale: Locale; tool: string }>
}) {
  const { locale, tool } = await params;
  unstable_setRequestLocale(locale);

  const toolData = await getToolBySlug(tool, locale);
  const t = await getTranslations({ locale, namespace: 'common' });
  const tTool = await getTranslations({ locale, namespace: 'toolPage' });

  if (!toolData) {
    notFound();
  }

  // 获取推荐数据
  const { relatedTools, relatedArticles, scenarioSolutions } = getRecommendationData(locale, tool);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* 面包屑导航 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb 
          items={[
            { label: locale === 'zh' ? '互动工具' : 'Interactive Tools', href: `/${locale}/interactive-tools` },
            { label: toolData.frontmatter.title }
          ]}
        />
      </div>

      {/* Tool Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-neutral-600 mb-4">
            <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full">
              {toolData.frontmatter.category}
            </span>
            <span>• {toolData.frontmatter.difficulty}</span>
            <span>• {toolData.frontmatter.estimatedTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
            {toolData.frontmatter.title}
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            {toolData.frontmatter.description}
          </p>
        </div>
      </header>

      {/* Emergency Relief Guide for symptom assessment and pain-related tools */}
      {(tool === 'symptom-assessment' || tool === 'period-pain-assessment' || tool === 'pain-tracker') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <EmergencyReliefGuide locale={locale} />
          </div>
        </section>
      )}

      {/* Tool Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          }>
            {/* Render interactive tool if available */}
            {tool === 'pain-tracker' ? (
              <PainTrackerTool locale={locale} />
            ) : tool === 'symptom-assessment' ? (
              <SymptomAssessmentTool locale={locale} />
            ) : tool === 'constitution-test' ? (
              <ConstitutionTestTool locale={locale} />
            ) : tool === 'period-pain-assessment' ? (
              <PeriodPainAssessmentTool locale={locale} />
            ) : tool === 'cycle-tracker' ? (
              <CycleTrackerTool locale={locale} />
            ) : tool === 'symptom-tracker' ? (
              <SymptomTrackerTool locale={locale} />
            ) : (
              <div
                className="prose prose-lg max-w-none prose-primary prose-headings:text-neutral-800 prose-p:text-neutral-700"
                dangerouslySetInnerHTML={{ __html: toolData.content }}
              />
            )}
          </Suspense>
        </div>
      </main>

      {/* Medical Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <MedicalDisclaimer locale={locale} />
        </div>
      </section>

      {/* 相关推荐区域 - 仅限痛经评估、周期追踪和中医体质测试页面 */}
      {(tool === 'period-pain-assessment' || tool === 'cycle-tracker' || tool === 'constitution-test') && (
        <div className="bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-12">
              
              {/* 相关工具区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {locale === 'zh' ? '相关工具' : 'Related Tools'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedTools.map((tool) => (
                    <RelatedToolCard key={tool.id} tool={tool} locale={locale} />
                  ))}
                </div>
              </section>

              {/* 相关文章区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {tool === 'cycle-tracker' 
                    ? (locale === 'zh' ? '周期健康文章' : 'Cycle Health Articles')
                    : tool === 'constitution-test'
                    ? (locale === 'zh' ? '中医体质调理文章' : 'TCM Constitution Articles')
                    : (locale === 'zh' ? '相关健康文章' : 'Related Health Articles')
                  }
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((article) => (
                    <RelatedArticleCard key={article.id} article={article} locale={locale} />
                  ))}
                </div>
              </section>

              {/* 场景解决方案区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {tool === 'cycle-tracker' 
                    ? (locale === 'zh' ? '生活场景指导' : 'Life Scenario Guidance')
                    : tool === 'constitution-test'
                    ? (locale === 'zh' ? '体质调理方案' : 'Constitution Solutions')
                    : (locale === 'zh' ? '场景解决方案' : 'Scenario Solutions')
                  }
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {scenarioSolutions.map((solution) => (
                    <ScenarioSolutionCard key={solution.id} solution={solution} locale={locale} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
