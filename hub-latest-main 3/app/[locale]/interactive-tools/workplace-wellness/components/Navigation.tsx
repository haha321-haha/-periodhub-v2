/**
 * Workplace Wellness Assistant - Navigation Component
 * Day 10: User Experience Optimization - Responsive Design Optimization
 * Based on HVsLYEp Navigation function design
 */

'use client';

import { Calendar, Apple, Download, Briefcase, BarChart3, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useActiveTab, useWorkplaceWellnessActions } from '../hooks/useWorkplaceWellnessStore';
import ResponsiveContainer, { TouchFriendlyButton } from './ResponsiveContainer';
import { TouchFeedback } from './TouchGestures';

export default function Navigation() {
  const activeTab = useActiveTab();
  const { setActiveTab } = useWorkplaceWellnessActions();
  const t = useTranslations('workplaceWellness');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 导航标签配置 - 基于HVsLYEp的tabs结构，增强Day 11功能
  const tabs = [
    { id: 'calendar', name: t('nav.calendar'), icon: Calendar },
    { id: 'nutrition', name: t('nav.nutrition'), icon: Apple },
    { id: 'work-impact', name: t('nav.workImpact'), icon: Briefcase },
    { id: 'analysis', name: t('nav.analysis'), icon: BarChart3 },
    { id: 'export', name: t('nav.export'), icon: Download },
    { id: 'settings', name: t('nav.settings'), icon: Settings }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as any);
    setIsMobileMenuOpen(false);
  };

  return (
    <ResponsiveContainer>
      <nav className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <TouchFeedback key={tab.id}>
                  <TouchFriendlyButton
                    onClick={() => handleTabClick(tab.id)}
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
                  </TouchFriendlyButton>
                </TouchFeedback>
              );
            })}
          </div>
        </div>
      </nav>
    </ResponsiveContainer>
  );
}
