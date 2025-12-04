
import { Tool, Stat, Scenario, NavItem } from './types';

export const STATS: Stat[] = [
  { value: '600K+', label: 'Active Users' },
  { value: '4.8/5', label: 'User Rating' },
  { value: '43', label: 'Medical Guides' },
  { value: '100%', label: 'HIPAA Compliant' },
];

export const TOOLS: Tool[] = [
  {
    id: 'pain-tracker',
    title: 'Pain Tracker',
    description: 'Smart pain pattern recording & analysis.',
    icon: '📊',
    badge: 'PRO',
    href: '#tracker',
  },
  {
    id: 'cycle-tracker',
    title: 'Cycle Tracker',
    description: 'Comprehensive menstrual prediction.',
    icon: '📅',
    badge: 'NEW',
    href: '#cycle',
  },
  {
    id: 'workplace',
    title: 'Workplace Wellness',
    description: 'Impact tracking & work strategies.',
    icon: '💼',
    badge: 'HOT',
    href: '#workplace',
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'teen-zone',
    title: 'Teen Menstrual Health Zone',
    description: 'Safe space for girls 12-18. Campus guides & emotional support.',
    icon: '🌸',
    badge: 'NEW',
    href: '#teen',
    type: 'zone',
  },
  {
    id: 'partner-zone',
    title: 'Partner Communication Zone',
    description: 'Help partners understand period pain. Support strategies.',
    icon: '💕',
    badge: 'HOT',
    href: '#partner',
    type: 'zone',
  },
  {
    id: 'office',
    title: 'Office Work',
    description: 'Professional strategies',
    icon: '🏢',
    href: '#',
    type: 'card',
  },
  {
    id: 'commute',
    title: 'Commute & Travel',
    description: 'On-the-go solutions',
    icon: '🚇',
    href: '#',
    type: 'card',
  },
  {
    id: 'exercise',
    title: 'Exercise & Sports',
    description: 'Safe activity guides',
    icon: '🏃‍♀️',
    href: '#',
    type: 'card',
  },
  {
    id: 'sleep',
    title: 'Sleep & Rest',
    description: 'Quality rest tips',
    icon: '😴',
    href: '#',
    type: 'card',
  },
];

export const NAVIGATION: NavItem[] = [
  { label: 'Home', href: '#home' },
  { 
    label: 'Interactive Tools', 
    href: '#tools',
    children: TOOLS
  },
  { label: 'Articles & Downloads', href: '#downloads' },
  { label: 'Scenario Solutions', href: '#scenarios' },
  { label: 'Natural Therapies', href: '#therapies' },
  { label: 'Health Guide', href: '#health-guide' },
];

export const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      tools: 'Interactive Tools',
      downloads: 'Articles & Downloads',
      scenarios: 'Scenario Solutions',
      naturalTherapies: 'Natural Therapies',
      healthGuide: 'Health Guide',
      getStarted: 'Get Started'
    },
    hero: {
      badge: 'ACOG Guidelines Powered',
      h1_prefix: 'Stop Guessing.',
      h1_highlight: 'Start Healing.',
      h2_prefix: 'Painkillers only score 6.2/10.',
      h2_highlight: 'Try the 7.5/10 method',
      description: 'The first AI-powered symptom checker built on ACOG guidelines—not search engine rumors. Track patterns, identify risks, and generate doctor-ready reports in seconds.',
      cta_primary: 'Start Free Assessment',
      cta_secondary: 'View Evidence',
      trust: ['100% Private', 'Local Storage', 'HIPAA Compliant'],
      no_credit_card: 'No credit card required • Local data only'
    },
    sections: {
      tools_title: 'Interactive Tools',
      tools_desc: 'Professional tools designed for your health journey, powered by data and medical expertise.',
      view_all: 'View all 8+ tools',
      scenarios_title: 'Scenario Solutions',
      scenarios_desc: 'Tailored support for every stage of life and situation.',
      start_tool: 'Start Tool',
      enter_zone: 'Enter Zone',
      downloads_title: 'Articles & Downloads',
      downloads_desc: 'Access our comprehensive collection of evidence-based guides and resources.'
    },
    privacy: {
      title: 'Your Privacy Is Our Priority',
      subtitle: 'HIPAA compliant, local-first architecture',
      features: {
        local_storage: {
          title: '100% Local Storage',
          description: 'Your health data never leaves your device. Everything is encrypted and stored locally.'
        },
        hipaa_compliant: {
          title: 'HIPAA & CCPA Compliant',
          description: 'We exceed federal privacy standards. Your PHI is never sold or shared.'
        },
        encryption: {
          title: 'End-to-End Encryption',
          description: 'Military-grade AES-256 encryption protects your data even on your own device.'
        }
      },
      disclaimer: {
        title: 'Medical Disclaimer',
        paragraph1: 'PeriodHub is a health information management tool, not a medical device. The insights provided are based on clinical guidelines (ACOG/WHO) but do not constitute medical diagnosis or treatment.',
        paragraph2: 'Always consult a healthcare professional for medical advice. If you experience severe pain, heavy bleeding, or other concerning symptoms, seek immediate medical attention.',
        data_privacy_title: 'Data Privacy (HIPAA/CCPA)',
        data_privacy_text: 'Your health data belongs to you. We utilize Local-First Architecture, meaning your sensitive cycle data is encrypted and stored directly on your device. We do not sell, trade, or share your personal health information (PHI) with third-party advertisers.'
      }
    },
    cta: {
      title: 'Ready to Take Control of Your Period Pain?',
      description: 'Join 600,000+ women who\'ve found relief with evidence-based solutions',
      button: 'Start Your Free Assessment Now',
      note: 'No credit card required • 100% private • Cancel anytime'
    },
    footer: {
      tagline: 'Evidence-based period care powered by ACOG guidelines',
      columns: {
        tools: 'Tools',
        resources: 'Resources',
        legal: 'Legal'
      },
      links: {
        tools: {
          symptom_checker: 'AI Symptom Checker',
          cycle_tracker: 'Cycle Tracker',
          pain_diary: 'Pain Diary',
          doctor_reports: 'Doctor Reports'
        },
        resources: {
          medical_guides: 'Medical Guides',
          natural_remedies: 'Natural Remedies',
          emergency_guide: 'Emergency Guide',
          research_papers: 'Research Papers'
        },
        legal: {
          privacy_policy: 'Privacy Policy',
          hipaa_compliance: 'HIPAA Compliance',
          terms_of_service: 'Terms of Service',
          medical_disclaimer: 'Medical Disclaimer'
        }
      },
      copyright: '© 2024 PeriodHub. All rights reserved. | Made with ❤️ for women\'s health'
    },
    tools: [
      {
        id: 'pain-tracker',
        title: 'Pain Tracker',
        description: 'Smart pain pattern recording & analysis.'
      },
      {
        id: 'cycle-tracker',
        title: 'Cycle Tracker',
        description: 'Comprehensive menstrual prediction.'
      },
      {
        id: 'workplace',
        title: 'Workplace Wellness',
        description: 'Impact tracking & work strategies.'
      }
    ],
    scenarios: [
      {
        id: 'teen-zone',
        title: 'Teen Menstrual Health Zone',
        description: 'Safe space for girls 12-18. Campus guides & emotional support.'
      },
      {
        id: 'partner-zone',
        title: 'Partner Communication Zone',
        description: 'Help partners understand period pain. Support strategies.'
      },
      {
        id: 'office',
        title: 'Office Work',
        description: 'Professional strategies'
      },
      {
        id: 'commute',
        title: 'Commute & Travel',
        description: 'On-the-go solutions'
      },
      {
        id: 'exercise',
        title: 'Exercise & Sports',
        description: 'Safe activity guides'
      },
      {
        id: 'sleep',
        title: 'Sleep & Rest',
        description: 'Quality rest tips'
      }
    ],
    stats: [
      { value: '600K+', label: 'Active Users' },
      { value: '4.8/5', label: 'User Rating' },
      { value: '43', label: 'Medical Guides' },
      { value: '100%', label: 'HIPAA Compliant' }
    ]
  },
  zh: {
    nav: {
      home: '首页',
      tools: '互动工具',
      downloads: '文章与下载',
      scenarios: '场景解决方案',
      naturalTherapies: '自然疗法',
      healthGuide: '健康指南',
      getStarted: '立即开始'
    },
    hero: {
      badge: 'ACOG 指南支持',
      h1_prefix: '停止猜测。',
      h1_highlight: '开始治愈。',
      h2_prefix: '止痛药只得6.2分。',
      h2_highlight: '试试7.5分的方法',
      description: '首个基于ACOG指南的AI症状检查器——而非搜索引擎传言。追踪模式，识别风险，几秒钟生成医生就绪的报告。',
      cta_primary: '开始免费评估',
      cta_secondary: '查看证据',
      trust: ['100% 隐私', '本地存储', 'HIPAA 合规'],
      no_credit_card: '无需信用卡 • 仅本地数据'
    },
    sections: {
      tools_title: '互动工具',
      tools_desc: '专为您的健康旅程设计的专业工具，由数据和医学专业知识支持。',
      view_all: '查看所有8+个工具',
      scenarios_title: '场景解决方案',
      scenarios_desc: '为每个生活阶段和情况提供定制支持。',
      start_tool: '开始使用',
      enter_zone: '进入专区',
      downloads_title: '文章与下载',
      downloads_desc: '访问我们全面的循证指南和资源集合。'
    },
    privacy: {
      title: '您的隐私是我们的首要任务',
      subtitle: 'HIPAA 合规，本地优先架构',
      features: {
        local_storage: {
          title: '100% 本地存储',
          description: '您的健康数据永远不会离开您的设备。所有数据都经过加密并存储在本地。'
        },
        hipaa_compliant: {
          title: 'HIPAA 和 CCPA 合规',
          description: '我们超越联邦隐私标准。您的 PHI 永远不会被出售或共享。'
        },
        encryption: {
          title: '端到端加密',
          description: '军用级 AES-256 加密保护您的数据，即使在您自己的设备上也是如此。'
        }
      },
      disclaimer: {
        title: '医疗免责声明',
        paragraph1: 'PeriodHub 是一个健康信息管理工具，不是医疗设备。提供的见解基于临床指南（ACOG/WHO），但不构成医疗诊断或治疗。',
        paragraph2: '请始终咨询医疗专业人士以获得医疗建议。如果您经历严重疼痛、大量出血或其他令人担忧的症状，请立即寻求医疗帮助。',
        data_privacy_title: '数据隐私（HIPAA/CCPA）',
        data_privacy_text: '您的健康数据属于您。我们采用本地优先架构，这意味着您的敏感周期数据经过加密并直接存储在您的设备上。我们不会向第三方广告商出售、交易或共享您的个人健康信息（PHI）。'
      }
    },
    cta: {
      title: '准备好掌控您的经期疼痛了吗？',
      description: '加入 60万+ 女性，通过循证解决方案找到缓解',
      button: '立即开始免费评估',
      note: '无需信用卡 • 100% 隐私 • 随时取消'
    },
    footer: {
      tagline: '基于 ACOG 指南的循证经期护理',
      columns: {
        tools: '工具',
        resources: '资源',
        legal: '法律'
      },
      links: {
        tools: {
          symptom_checker: 'AI 症状检查器',
          cycle_tracker: '周期追踪器',
          pain_diary: '疼痛日记',
          doctor_reports: '医生报告'
        },
        resources: {
          medical_guides: '医学指南',
          natural_remedies: '自然疗法',
          emergency_guide: '急救指南',
          research_papers: '研究论文'
        },
        legal: {
          privacy_policy: '隐私政策',
          hipaa_compliance: 'HIPAA 合规',
          terms_of_service: '服务条款',
          medical_disclaimer: '医疗免责声明'
        }
      },
      copyright: '© 2024 PeriodHub. 保留所有权利。| 为女性健康而做 ❤️'
    },
    tools: [
      {
        id: 'pain-tracker',
        title: '疼痛追踪器',
        description: '智能疼痛模式记录与分析。'
      },
      {
        id: 'cycle-tracker',
        title: '周期追踪器',
        description: '全面的月经周期预测。'
      },
      {
        id: 'workplace',
        title: '职场健康',
        description: '影响追踪与工作策略。'
      }
    ],
    scenarios: [
      {
        id: 'teen-zone',
        title: '青少年月经健康专区',
        description: '12-18岁女孩的安全空间。校园指南与情感支持。'
      },
      {
        id: 'partner-zone',
        title: '伴侣沟通专区',
        description: '帮助伴侣理解经期疼痛。支持策略。'
      },
      {
        id: 'office',
        title: '办公室工作',
        description: '专业策略'
      },
      {
        id: 'commute',
        title: '通勤与旅行',
        description: '移动解决方案'
      },
      {
        id: 'exercise',
        title: '运动与体育',
        description: '安全活动指南'
      },
      {
        id: 'sleep',
        title: '睡眠与休息',
        description: '优质休息建议'
      }
    ],
    stats: [
      { value: '60万+', label: '活跃用户' },
      { value: '4.8/5', label: '用户评分' },
      { value: '43', label: '医学指南' },
      { value: '100%', label: 'HIPAA 合规' }
    ]
  }
};
