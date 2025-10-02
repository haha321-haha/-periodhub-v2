import React from 'react';
import { FAQ } from '../../types/faq';

interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery?: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({
  faq,
  isExpanded,
  onToggle,
  searchQuery
}) => {
  return (
    <div className="faq-item border border-gray-200 rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset rounded-lg"
        aria-expanded={isExpanded}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <div className="flex justify-between items-center">
          <span className="text-left">{faq.question}</span>
          <span className="text-gray-400 text-xl font-light ml-4 flex-shrink-0">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </button>
      
      {isExpanded && (
        <div
          id={`faq-answer-${faq.id}`}
          className="px-4 pb-3 text-gray-600 border-t border-gray-100"
        >
          <div 
            className="pt-3 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: faq.answer }} 
          />
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
