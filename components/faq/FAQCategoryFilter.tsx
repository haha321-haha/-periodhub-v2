import React from 'react';
import { FAQCategory } from '../../types/faq';

interface FAQCategoryFilterProps {
  selectedCategory: FAQCategory | 'all';
  onCategoryChange: (category: FAQCategory | 'all') => void;
}

const categoryLabels: Record<FAQCategory | 'all', string> = {
  'all': '全部',
  'basic-knowledge': '基础知识',
  'pain-relief': '疼痛缓解',
  'medical-care': '就医指导',
  'lifestyle': '生活调理',
  'emergency': '紧急情况',
  'medication': '药物治疗'
};

const categoryColors: Record<FAQCategory | 'all', string> = {
  'all': 'bg-gray-100 text-gray-800',
  'basic-knowledge': 'bg-blue-100 text-blue-800',
  'pain-relief': 'bg-red-100 text-red-800',
  'medical-care': 'bg-green-100 text-green-800',
  'lifestyle': 'bg-yellow-100 text-yellow-800',
  'emergency': 'bg-orange-100 text-orange-800',
  'medication': 'bg-purple-100 text-purple-800'
};

export const FAQCategoryFilter: React.FC<FAQCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories: (FAQCategory | 'all')[] = [
    'all',
    'basic-knowledge',
    'pain-relief',
    'medical-care',
    'lifestyle',
    'emergency',
    'medication'
  ];

  return (
    <div className="faq-category-filter">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category
                ? `${categoryColors[category]} ring-2 ring-offset-2 ring-current`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-pressed={selectedCategory === category}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    </div>
  );
};
