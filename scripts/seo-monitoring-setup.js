#!/usr/bin/env node

/**
 * PeriodHub SEO监测配置脚本
 * 用于设置关键词排名监测和效果追踪
 */

const fs = require('fs');
const path = require('path');

// 目标关键词配置
const targetKeywords = {
  // 中文核心关键词
  zh: [
    '痛经疼痛原理',
    '痛经机制',
    '经期疼痛原因',
    '痛经为什么痛',
    '痛经补镁',
    '经期补充镁',
    '痛经科学解释',
    '月经疼痛机制',
    '痛经计算器',
    '经期疼痛评估',
    '痛经严重度测试',
    '痛经疼痛程度评估',
    '经期镁缺乏症状',
    '月经期间补镁剂量'
  ],

  // 英文核心关键词
  en: [
    'period pain mechanisms',
    'menstrual cramp causes',
    'why periods hurt',
    'dysmenorrhea pathophysiology',
    'magnesium period pain',
    'menstrual pain science',
    'period pain calculator',
    'menstrual pain assessment',
    'prostaglandin period pain',
    'how does magnesium help period cramps',
    'period pain relief mechanisms',
    'menstrual pain severity assessment',
    'period pain evaluation tool',
    'dysmenorrhea treatment guide'
  ]
};

// 监测目标页面
const targetPages = [
  {
    url: 'https://www.periodhub.health/zh/interactive-tools/symptom-assessment',
    title: '痛经严重度计算器',
    primaryKeywords: ['痛经计算器', '痛经严重度评估', '经期疼痛测试'],
    locale: 'zh'
  },
  {
    url: 'https://www.periodhub.health/en/interactive-tools/symptom-assessment',
    title: 'Period Pain Calculator',
    primaryKeywords: ['period pain calculator', 'menstrual pain assessment', 'dysmenorrhea severity test'],
    locale: 'en'
  },
  {
    url: 'https://www.periodhub.health/zh/interactive-tools/pain-tracker',
    title: '痛经智能分析器',
    primaryKeywords: ['痛经追踪器', '经期疼痛分析', '痛经预测工具'],
    locale: 'zh'
  },
  {
    url: 'https://www.periodhub.health/en/interactive-tools/pain-tracker',
    title: 'Period Pain Tracker',
    primaryKeywords: ['period pain tracker', 'menstrual pain analysis', 'pain prediction tool'],
    locale: 'en'
  }
];

// 性能目标设置
const performanceTargets = {
  keywordRanking: {
    '痛经疼痛原理': { current: 'unranked', target: 3, priority: 'high' },
    'period pain mechanisms': { current: 'unranked', target: 5, priority: 'high' },
    '痛经补镁': { current: 'unranked', target: 3, priority: 'high' },
    'magnesium menstrual cramps': { current: 10, target: 5, priority: 'medium' },
    '痛经计算器': { current: 'unranked', target: 3, priority: 'high' }
  },

  trafficTargets: {
    month1: { increase: '15%', description: 'Quick wins from title optimization' },
    month2: { increase: '35%', description: 'Content optimization takes effect' },
    month3: { increase: '60%', description: 'Tool optimization completed' },
    month6: { increase: '120%', description: 'Long-tail keyword effects' }
  },

  userBehaviorTargets: {
    pageStayTime: { current: '45s', target: '90s', increase: '+100%' },
    toolUsageRate: { current: '12%', target: '25%', increase: '+108%' },
    contentShareRate: { current: '2%', target: '3%', increase: '+50%' },
    returnVisitorRate: { current: '15%', target: '25%', increase: '+67%' }
  }
};

// Google Analytics 4 事件配置
const ga4EventConfig = {
  medicalContentEvents: [
    {
      eventName: 'emergency_guide_used',
      category: 'Medical_Content',
      description: '紧急缓解指南使用',
      trigger: 'click on emergency relief guide'
    },
    {
      eventName: 'magnesium_guide_viewed',
      category: 'Medical_Content',
      description: '镁补充指南查看',
      trigger: 'view magnesium supplementation guide'
    },
    {
      eventName: 'pain_mechanism_explored',
      category: 'Medical_Content',
      description: '疼痛机制内容探索',
      trigger: 'expand pain mechanism sections'
    },
    {
      eventName: 'medical_disclaimer_viewed',
      category: 'Compliance',
      description: '医疗声明查看',
      trigger: 'medical disclaimer in viewport'
    },
    {
      eventName: 'pain_calculator_completed',
      category: 'Tool_Usage',
      description: '疼痛计算器完成',
      trigger: 'complete pain assessment form'
    }
  ]
};

// 生成监测配置文件
function generateMonitoringConfig() {
  const config = {
    projectName: 'PeriodHub SEO Optimization',
    setupDate: new Date().toISOString(),
    targetKeywords,
    targetPages,
    performanceTargets,
    ga4EventConfig,

    // 监测计划
    monitoringSchedule: {
      daily: ['keyword ranking checks', 'traffic analysis'],
      weekly: ['content performance review', 'user behavior analysis'],
      monthly: ['comprehensive SEO audit', 'target adjustment']
    },

    // 报告模板
    reportTemplate: {
      keywordRankingReport: {
        frequency: 'weekly',
        metrics: ['ranking position', 'search volume', 'click-through rate', 'impressions'],
        format: 'json + csv export'
      },
      trafficAnalysisReport: {
        frequency: 'monthly',
        metrics: ['organic traffic growth', 'page views', 'session duration', 'bounce rate'],
        format: 'dashboard + pdf summary'
      }
    }
  };

  // 保存配置文件
  const configPath = path.join(__dirname, '../seo-monitoring-config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  console.log('✅ SEO监测配置已生成:', configPath);
  return config;
}

// 生成Google Analytics追踪代码
function generateGA4TrackingCode() {
  const trackingCode = `
<!-- Google Analytics 4 - PeriodHub医疗内容专用事件追踪 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');

  // 医疗内容专用事件追踪函数
  function trackMedicalEvent(eventName, contentType, additionalParams = {}) {
    gtag('event', eventName, {
      'event_category': 'Medical_Content',
      'event_label': contentType,
      'page_title': document.title,
      'language': document.documentElement.lang || 'en',
      'timestamp': new Date().toISOString(),
      ...additionalParams
    });

    console.log('📊 Medical event tracked:', eventName, contentType);
  }

  // 自动追踪关键交互
  document.addEventListener('DOMContentLoaded', function() {
    // 紧急指南使用追踪
    const emergencyGuide = document.querySelector('[data-component="emergency-relief-guide"]');
    if (emergencyGuide) {
      emergencyGuide.addEventListener('click', () => {
        trackMedicalEvent('emergency_guide_used', 'pain_relief', {
          'guide_section': 'emergency_steps'
        });
      });
    }

    // 疼痛机制内容展开追踪
    const mechanismSections = document.querySelectorAll('[data-mechanism-section]');
    mechanismSections.forEach(section => {
      section.addEventListener('click', () => {
        const mechanismType = section.getAttribute('data-mechanism-section');
        trackMedicalEvent('pain_mechanism_explored', 'educational_content', {
          'mechanism_type': mechanismType
        });
      });
    });

    // 医疗声明查看追踪（使用Intersection Observer）
    const disclaimer = document.querySelector('[data-component="medical-disclaimer"]');
    if (disclaimer) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trackMedicalEvent('medical_disclaimer_viewed', 'compliance', {
              'viewport_percentage': Math.round(entry.intersectionRatio * 100)
            });
          }
        });
      }, { threshold: 0.5 });

      observer.observe(disclaimer);
    }

    // 疼痛计算器完成追踪
    const painCalculator = document.querySelector('[data-component="pain-calculator"]');
    if (painCalculator) {
      painCalculator.addEventListener('submit', (e) => {
        const formData = new FormData(e.target);
        const painLevel = formData.get('painLevel');

        trackMedicalEvent('pain_calculator_completed', 'assessment_tool', {
          'pain_level': painLevel,
          'assessment_type': 'severity_calculator'
        });
      });
    }
  });
</script>
`;

  const trackingPath = path.join(__dirname, '../ga4-medical-tracking.html');
  fs.writeFileSync(trackingPath, trackingCode, 'utf8');

  console.log('✅ GA4追踪代码已生成:', trackingPath);
  return trackingCode;
}

// 主执行函数
function main() {
  console.log('🚀 开始设置PeriodHub SEO监测系统...\n');

  try {
    // 生成监测配置
    const config = generateMonitoringConfig();
    console.log('📊 监测目标关键词数量:',
      config.targetKeywords.zh.length + config.targetKeywords.en.length);

    // 生成GA4追踪代码
    generateGA4TrackingCode();

    // 输出执行摘要
    console.log('\n📋 SEO监测设置完成摘要:');
    console.log('├── 目标关键词:', config.targetKeywords.zh.length + config.targetKeywords.en.length, '个');
    console.log('├── 监测页面:', config.targetPages.length, '个');
    console.log('├── GA4事件:', config.ga4EventConfig.medicalContentEvents.length, '个');
    console.log('└── 预期效果: 6个月内有机流量增长120%');

    console.log('\n🎯 下一步行动:');
    console.log('1. 将GA4追踪代码添加到页面头部');
    console.log('2. 在Google Search Console中设置关键词监测');
    console.log('3. 配置每周自动化SEO报告');
    console.log('4. 开始执行内容优化计划');

  } catch (error) {
    console.error('❌ 设置过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  generateMonitoringConfig,
  generateGA4TrackingCode,
  targetKeywords,
  targetPages,
  performanceTargets
};
