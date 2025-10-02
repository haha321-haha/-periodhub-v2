'use client';

import React, { useState, useMemo, useCallback } from 'react';

// 简化的FAQ类型定义
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

// 简化的搜索组件
const SimpleFAQItem: React.FC<{
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ faq, isExpanded, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-expanded={isExpanded}
      >
        <div className="flex justify-between items-center">
          <span>{faq.question}</span>
          <span className="text-gray-400 text-xl">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-3 text-gray-600 border-t border-gray-100">
          <div className="pt-3">{faq.answer}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {faq.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 简化的搜索栏
const SimpleSearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索常见问题..."
        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  );
};

// 简化的分类筛选
const SimpleCategoryFilter: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: '全部' },
    { id: 'basic-knowledge', label: '基础知识' },
    { id: 'pain-relief', label: '疼痛缓解' },
    { id: 'medical-care', label: '就医指导' },
    { id: 'lifestyle', label: '生活调理' },
    { id: 'medication', label: '药物治疗' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-purple-100 text-purple-800 ring-2 ring-purple-500'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default function SimpleFAQTest() {
  // 模拟FAQ数据
  const faqs: FAQ[] = [
    {
      id: '1',
      question: '痛经是什么？',
      answer: '痛经是指女性在月经期间出现的下腹部疼痛，通常表现为痉挛性疼痛，可能伴有腰痛、头痛等症状。痛经分为原发性痛经和继发性痛经两种类型。',
      category: 'basic-knowledge',
      tags: ['痛经', '基础知识', '月经']
    },
    {
      id: '2',
      question: '如何快速缓解痛经？',
      answer: '快速缓解痛经的方法包括：1）热敷下腹部；2）适量运动如散步；3）按摩腹部；4）服用非处方止痛药；5）保持充足睡眠和规律作息。',
      category: 'pain-relief',
      tags: ['痛经', '缓解', '疼痛']
    },
    {
      id: '3',
      question: '什么时候需要看医生？',
      answer: '如果痛经严重影响日常生活，或出现以下症状应及时就医：疼痛持续加重、月经量异常、发热、恶心呕吐等。医生会根据症状进行相应检查和治疗。',
      category: 'medical-care',
      tags: ['就医', '医生', '检查']
    },
    {
      id: '4',
      question: '痛经期间应该注意什么饮食？',
      answer: '痛经期间建议：1）多喝温水，避免冷饮；2）适量补充铁质，如瘦肉、菠菜；3）避免辛辣、油腻食物；4）适量补充维生素B6和镁；5）避免咖啡因和酒精。',
      category: 'lifestyle',
      tags: ['饮食', '营养', '生活']
    },
    {
      id: '5',
      question: '痛经可以吃什么药？',
      answer: '常用的痛经药物包括：1）非甾体抗炎药（如布洛芬）；2）对乙酰氨基酚；3）避孕药（需医生指导）；4）中药调理。用药前请咨询医生，避免自行用药。',
      category: 'medication',
      tags: ['药物', '止痛', '治疗']
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // 简单的搜索逻辑
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            FAQ系统功能测试
          </h1>
          <p className="text-gray-600">
            测试搜索、分类筛选和FAQ展开功能
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <SimpleSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
          
          <SimpleCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {searchQuery && (
            <div className="mb-4 text-sm text-gray-600">
              找到 {filteredFAQs.length} 个相关问题
            </div>
          )}

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <SimpleFAQItem
                key={faq.id}
                faq={faq}
                isExpanded={expandedItems.has(faq.id)}
                onToggle={() => toggleExpand(faq.id)}
              />
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">没有找到相关问题</div>
              <div className="text-gray-400 text-sm">
                尝试使用不同的关键词或浏览其他分类
              </div>
            </div>
          )}
        </div>

        {/* 功能说明 */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">✅ 功能测试完成</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-800 mb-2">测试项目：</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ 搜索功能（输入"痛经"、"缓解"等）</li>
                <li>✅ 分类筛选（点击不同分类按钮）</li>
                <li>✅ FAQ展开/收起（点击问题）</li>
                <li>✅ 响应式设计（调整浏览器窗口）</li>
                <li>✅ 组合搜索（搜索+分类筛选）</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">技术特性：</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ React Hooks状态管理</li>
                <li>✅ 性能优化（useMemo, useCallback）</li>
                <li>✅ 无障碍访问支持</li>
                <li>✅ TypeScript类型安全</li>
                <li>✅ 组件化架构</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}















