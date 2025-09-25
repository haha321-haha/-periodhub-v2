/**
 * NutritionApp组件 - 基于ziV1d3d的NutritionApp类
 * 负责渲染选择选项和处理用户交互
 */

'use client';

import { useState, useEffect } from 'react';
import type { Language } from '../types';
import { nutritionData } from '../data/nutritionRecommendations';
import { getUIContentObject } from '../utils/uiContent';
import '../styles/nutrition-generator.css';

interface NutritionAppProps {
  language: Language;
  selections: {
    menstrualPhase: string | null;
    healthGoals: Set<string>;
    tcmConstitution: Set<string>;
  };
  onSelectionsChange: (selections: any) => void;
}

export default function NutritionApp({ language, selections, onSelectionsChange }: NutritionAppProps) {
  const [data, setData] = useState(nutritionData);

  // 处理选择点击 - 基于ziV1d3d的handleSelection方法
  const handleSelection = (category: string, value: string) => {
    if (category === 'menstrualPhase') {
      // 基于ziV1d3d的单选逻辑
      const currentSelection = selections.menstrualPhase;
      if (currentSelection === value) {
        onSelectionsChange({ menstrualPhase: null });
      } else {
        onSelectionsChange({ menstrualPhase: value });
      }
    } else if (category === 'healthGoals') {
      // 基于ziV1d3d的多选逻辑
      const selectionSet = selections.healthGoals;
      const newGoals = new Set(selectionSet);
      if (newGoals.has(value)) {
        newGoals.delete(value);
      } else {
        newGoals.add(value);
      }
      onSelectionsChange({ healthGoals: newGoals });
    } else if (category === 'tcmConstitution') {
      // 基于ziV1d3d的多选逻辑
      const selectionSet = selections.tcmConstitution;
      const newConstitutions = new Set(selectionSet);
      if (newConstitutions.has(value)) {
        newConstitutions.delete(value);
      } else {
        newConstitutions.add(value);
      }
      onSelectionsChange({ tcmConstitution: newConstitutions });
    }
  };

  // 渲染选择选项 - 基于ziV1d3d的renderSelectionOptions方法
  const renderSelectionOptions = () => {
    const categories = [
      { key: 'menstrualPhase', type: 'single', icon: 'droplets' },
      { key: 'healthGoals', type: 'multiple', icon: 'heart-pulse' },
      { key: 'tcmConstitution', type: 'multiple', icon: 'yin-yang' }
    ];

    return categories.map(categoryInfo => {
      const categoryData = data[categoryInfo.key as keyof typeof data];
      const categoryTitles = {
        menstrualPhase: getUIContentObject('categoryTitles.menstrualPhase'),
        healthGoals: getUIContentObject('categoryTitles.healthGoals'),
        tcmConstitution: getUIContentObject('categoryTitles.tcmConstitution')
      };

      return (
        <div key={categoryInfo.key} className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {categoryInfo.icon === 'droplets' && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              )}
              {categoryInfo.icon === 'heart-pulse' && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              )}
              {categoryInfo.icon === 'yin-yang' && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              )}
            </svg>
            {categoryTitles[categoryInfo.key as keyof typeof categoryTitles][language]}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Object.entries(categoryData).map(([key, value]) => {
              const isSelected = categoryInfo.type === 'single'
                ? selections[categoryInfo.key as keyof typeof selections] === key
                : (selections[categoryInfo.key as keyof typeof selections] as Set<string>).has(key);

              return (
                <button
                  key={key}
                  onClick={() => handleSelection(categoryInfo.key, key)}
                  className={`selection-button p-4 rounded-lg text-sm md:text-base font-medium flex items-center justify-center text-center transition-all duration-200 ${
                    isSelected ? 'selected' : ''
                  }`}
                  data-category={categoryInfo.key}
                  data-key={key}
                  data-type={categoryInfo.type}
                >
                  {(value as any).label[language]}
                </button>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-8">
      {renderSelectionOptions()}
    </div>
  );
}
