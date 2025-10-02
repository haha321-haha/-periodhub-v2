// FAQ基础类型定义
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  tags: string[];
  priority: number;
  lastUpdated: Date;
  locale: 'zh' | 'en';
}

export type FAQCategory = 
  | 'basic-knowledge'
  | 'pain-relief' 
  | 'medical-care'
  | 'lifestyle'
  | 'emergency'
  | 'medication';

export interface SearchResult {
  faq: FAQ;
  score: number;
  matches: FuseResultMatch[];
  highlights: string[];
}

export interface SearchOptions {
  maxResults?: number;
  category?: FAQCategory | 'all';
  includeRelated?: boolean;
}

// Fuse.js 结果匹配类型
export interface FuseResultMatch {
  indices: number[][];
  key: string;
  value: string;
}

// FAQ状态管理类型
export interface FAQState {
  data: {
    faqs: FAQ[];
    loading: boolean;
    error: string | null;
    lastUpdated: number;
  };
  search: {
    query: string;
    category: FAQCategory | 'all';
    results: SearchResult[];
    isSearching: boolean;
    searchHistory: string[];
  };
  ui: {
    expandedItems: Set<string>;
    viewMode: 'list' | 'card';
    sortBy: 'relevance' | 'category' | 'date';
    filterOptions: {
      showAnswered: boolean;
      showUnanswered: boolean;
      difficultyLevel: 'all' | 'beginner' | 'intermediate' | 'advanced';
    };
  };
  user: {
    preferences: UserPreferences;
    behavior: {
      viewHistory: string[];
      clickHistory: string[];
      searchPatterns: string[];
    };
  };
  performance: {
    cache: Map<string, any>;
    metrics: {
      searchTime: number;
      renderTime: number;
      cacheHitRate: number;
    };
  };
}

export interface UserPreferences {
  language: 'zh' | 'en';
  categories: FAQCategory[];
  theme: 'light' | 'dark';
}

// 组件Props类型
export interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery?: string;
}

export interface FAQListProps {
  faqs: SearchResult[];
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
  loading?: boolean;
}

export interface FAQSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  placeholder?: string;
  config?: any;
}

export interface FAQSystemProps {
  variant?: 'home' | 'comprehensive' | 'expert';
  locale?: 'zh' | 'en';
  config?: any;
  initialCategory?: FAQCategory | 'all';
  maxResults?: number;
}















