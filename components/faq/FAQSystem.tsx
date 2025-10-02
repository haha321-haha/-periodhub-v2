import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FAQList } from './FAQList';
import { FAQSearchBar } from './FAQSearchBar';
import { FAQCategoryFilter } from './FAQCategoryFilter';
import { FaqSearchEngine } from '../../lib/faq/search-engine';
import { getFAQsByLocale } from '../../lib/faq/mock-data';
import { FAQSystemProps, SearchResult, FAQCategory } from '../../types/faq';
import { debounce } from 'lodash';

export const FAQSystem: React.FC<FAQSystemProps> = ({
  variant = 'comprehensive',
  locale = 'zh',
  config = {},
  initialCategory = 'all',
  maxResults = 20
}) => {
  // 状态管理
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'all'>(initialCategory);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);

  // 获取FAQ数据
  const faqs = useMemo(() => getFAQsByLocale(locale), [locale]);

  // 创建搜索引擎实例
  const searchEngine = useMemo(() => {
    return new FaqSearchEngine(faqs);
  }, [faqs]);

  // 防抖搜索
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setIsSearching(false);
    }, 300),
    []
  );

  // 执行搜索
  const performSearch = useCallback((query: string, category: FAQCategory | 'all') => {
    setIsSearching(true);
    const results = searchEngine.searchWithCategory(query, category, {
      maxResults
    });
    debouncedSearch(query);
    return results;
  }, [searchEngine, maxResults, debouncedSearch]);

  // 搜索结果
  const searchResults = useMemo(() => {
    return performSearch(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, performSearch]);

  // 获取搜索建议
  const searchSuggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchEngine.getSearchSuggestions(searchQuery, 5);
  }, [searchQuery, searchEngine]);

  // 切换FAQ展开状态
  const toggleExpand = useCallback((faqId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  }, []);

  // 处理搜索输入
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
  }, []);

  // 处理分类变化
  const handleCategoryChange = useCallback((category: FAQCategory | 'all') => {
    setSelectedCategory(category);
  }, []);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  // 获取当前显示的FAQ
  const getDisplayFAQs = useCallback((): SearchResult[] => {
    if (searchQuery) {
      return searchResults;
    }
    
    // 无搜索时显示默认结果
    const filteredFaqs = selectedCategory === 'all' 
      ? faqs 
      : faqs.filter(faq => faq.category === selectedCategory);
    
    return filteredFaqs.slice(0, maxResults).map(faq => ({
      faq,
      score: 0,
      matches: [],
      highlights: []
    }));
  }, [searchQuery, searchResults, selectedCategory, faqs, maxResults]);

  // 渲染内容
  const renderContent = () => {
    switch (variant) {
      case 'home':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">常见问题</h2>
            <FAQList
              faqs={getDisplayFAQs()}
              expandedItems={expandedItems}
              onToggle={toggleExpand}
            />
          </div>
        );
      
      case 'comprehensive':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">常见问题解答</h1>
              <p className="text-gray-600">找到您需要的答案</p>
            </div>
            
            <FAQSearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              suggestions={searchSuggestions}
              placeholder="搜索常见问题..."
            />
            
            <FAQCategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            {searchQuery && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  找到 {searchResults.length} 个相关问题
                </div>
                <button
                  onClick={clearSearch}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  清除搜索
                </button>
              </div>
            )}
            
            <FAQList
              faqs={getDisplayFAQs()}
              expandedItems={expandedItems}
              onToggle={toggleExpand}
              loading={isSearching}
            />
          </div>
        );
      
      case 'expert':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">专家深度解答</h2>
            <FAQList
              faqs={getDisplayFAQs()}
              expandedItems={expandedItems}
              onToggle={toggleExpand}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="faq-system max-w-4xl mx-auto p-6" data-variant={variant}>
      {renderContent()}
    </div>
  );
};
