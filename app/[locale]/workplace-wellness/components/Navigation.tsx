/**
 * HVsLYEp职场健康助手 - 导航组件
 * 基于HVsLYEp的Navigation函数设计
 */

'use client';

import { Calendar, Apple, Download } from 'lucide-react';
import { useActiveTab, useWorkplaceWellnessActions, useLanguage } from '../hooks/useWorkplaceWellnessStore';
import { createTranslationFunction } from '../data';

export default function Navigation() {
  const activeTab = useActiveTab();
  const lang = useLanguage();
  const { setActiveTab } = useWorkplaceWellnessActions();
  const t = createTranslationFunction(lang);

  // 导航标签配置 - 基于HVsLYEp的tabs结构
  const tabs = [
    { id: 'calendar', name: t('nav.calendar'), icon: Calendar },
    { id: 'nutrition', name: t('nav.nutrition'), icon: Apple },
    { id: 'export', name: t('nav.export'), icon: Download }
  ];

  return (
    <nav className="bg-white border-b border-neutral-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200
                  ${isActive 
                    ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }
                `}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
