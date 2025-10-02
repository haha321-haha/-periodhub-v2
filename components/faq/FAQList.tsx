import React from 'react';
import { FAQItem } from './FAQItem';
import { SearchResult } from '../../types/faq';

interface FAQListProps {
  faqs: SearchResult[];
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
  loading?: boolean;
}

export const FAQList: React.FC<FAQListProps> = ({
  faqs,
  expandedItems,
  onToggle,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="faq-list-loading">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="faq-list-empty text-center py-12">
        <div className="text-gray-500 text-lg mb-2">没有找到相关问题</div>
        <div className="text-gray-400 text-sm">
          尝试使用不同的关键词或浏览其他分类
        </div>
      </div>
    );
  }

  return (
    <div className="faq-list space-y-4">
      {faqs.map((result) => (
        <FAQItem
          key={result.faq.id}
          faq={result.faq}
          isExpanded={expandedItems.has(result.faq.id)}
          onToggle={() => onToggle(result.faq.id)}
        />
      ))}
    </div>
  );
};
