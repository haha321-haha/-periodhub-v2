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