
import { Tool, Stat, Scenario, NavItem } from './types';

export const STATS: Stat[] = [
  { value: '8+', label: 'Professional Tools' },
  { value: '43', label: 'Medical Guides' },
  { value: '600K+', label: 'Active Users' },
  { value: '98%', label: 'Satisfaction Rate' },
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
];

export const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      tools: 'Interactive Tools',
      downloads: 'Articles & Downloads',
      scenarios: 'Scenario Solutions',
      getStarted: 'Get Started'
    },
    hero: {
      h1_prefix: 'Scientific Management of',
      h1_highlight: 'Period Pain',
      h2_prefix: 'Free Tools for',
      h2_highlight: '600K+ Women',
      description: 'Get instant period pain relief with free tools trusted by 600,000+ women. 43 evidence-based guides + 8 interactive tools. Start tracking today!',
      cta_primary: 'Get Free Tools',
      cta_secondary: 'View 43 Guides',
      trust: ['Privacy Protected', 'Evidence-based', 'Personalized']
    },
    sections: {
      tools_title: 'Interactive Tools',
      tools_desc: 'Professional tools designed for your health journey, powered by data and medical expertise.',
      view_all: 'View all 8+ tools',
      scenarios_title: 'Scenario Solutions',
      scenarios_desc: 'Tailored support for every stage of life and situation.',
      start_tool: 'Start Tool',
      enter_zone: 'Enter Zone'
    }
  },
  zh: {
    nav: {
      home: '首页',
      tools: '互动工具',
      downloads: '文章与下载',
      scenarios: '场景解决方案',
      getStarted: '立即开始'
    },
    hero: {
      h1_prefix: '科学管理',
      h1_highlight: '经期疼痛',
      h2_prefix: '免费工具服务',
      h2_highlight: '60万+ 女性',
      description: '60万+女性信赖的经期疼痛缓解方案。43份循证医学指南 + 8个专业互动工具。立即开始追踪！',
      cta_primary: '获取免费工具',
      cta_secondary: '查看43份指南',
      trust: ['隐私保护', '循证医学', '个性化定制']
    },
    sections: {
      tools_title: '互动工具',
      tools_desc: '专为您的健康旅程设计的专业工具，由数据和医学专业知识支持。',
      view_all: '查看所有8+个工具',
      scenarios_title: '场景解决方案',
      scenarios_desc: '为每个生活阶段和情况提供定制支持。',
      start_tool: '开始使用',
      enter_zone: '进入专区'
    }
  }
};
