/**
 * HVsLYEp职场健康助手 - 营养建议组件
 * 基于HVsLYEp的NutritionAdvisorComponent函数设计
 */

'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, ShoppingCart } from 'lucide-react';
import { useNutrition, useWorkplaceWellnessActions, useLanguage } from '../hooks/useWorkplaceWellnessStore';
import { createTranslationFunction, getNutritionData } from '../data';
import { NutritionRecommendation } from '../types';

export default function NutritionComponent() {
  const nutrition = useNutrition();
  const lang = useLanguage();
  const { updateNutrition } = useWorkplaceWellnessActions();
  const t = createTranslationFunction(lang);

  const nutritionData = getNutritionData(lang);
  const [searchTerm, setSearchTerm] = useState('');
  const [mealPlan, setMealPlan] = useState<NutritionRecommendation[]>([]);

  // 过滤营养建议
  const filteredNutrition = useMemo(() => {
    if (!searchTerm) {
      return nutritionData.filter(item => item.phase === nutrition.selectedPhase);
    }
    
    return nutritionData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [nutritionData, nutrition.selectedPhase, searchTerm]);

  const handlePhaseChange = (phase: string) => {
    updateNutrition({ selectedPhase: phase as any });
  };

  const handleConstitutionChange = (constitution: string) => {
    updateNutrition({ constitutionType: constitution as any });
  };

  const addToMealPlan = (item: NutritionRecommendation) => {
    setMealPlan(prev => [...prev, item]);
  };

  const removeFromMealPlan = (index: number) => {
    setMealPlan(prev => prev.filter((_, i) => i !== index));
  };

  const generateShoppingList = () => {
    const uniqueItems = [...new Set(mealPlan.map(item => item.name))];
    const shoppingList = uniqueItems.join(', ');
    navigator.clipboard.writeText(shoppingList);
    // 这里可以添加成功提示
  };

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {t('nutrition.title')}
        </h2>
      </div>

      {/* 选择区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 月经阶段选择 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              {t('nutrition.phaseLabel')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(t('nutrition.phases')).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handlePhaseChange(key)}
                  className={`p-3 text-sm rounded-lg border transition-colors duration-200 ${
                    nutrition.selectedPhase === key
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <span className="mr-2">{t(`nutrition.phaseIcons.${key}`)}</span>
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* 中医体质选择 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              {t('nutrition.constitutionLabel')}
            </label>
            <select
              value={nutrition.constitutionType}
              onChange={(e) => handleConstitutionChange(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {Object.entries(t('nutrition.constitutions')).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 搜索区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder={t('nutrition.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* 推荐食物 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          {t('nutrition.foodTitle')}
        </h3>
        
        {filteredNutrition.length === 0 ? (
          <p className="text-center text-neutral-500 py-8">
            {t('nutrition.noResults')}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNutrition.map((item, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-neutral-900">{item.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.tcmNature === 'warm' ? 'bg-red-100 text-red-800' :
                    item.tcmNature === 'cool' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {t(`nutrition.tcmNature.${item.tcmNature}`)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-neutral-700">
                      {t('nutrition.benefitsLabel')}:
                    </span>
                    <ul className="text-sm text-neutral-600 mt-1">
                      {item.benefits.map((benefit, i) => (
                        <li key={i}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-neutral-700">
                      {t('nutrition.nutrientsLabel')}:
                    </span>
                    <p className="text-sm text-neutral-600 mt-1">
                      {item.nutrients.join(', ')}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => addToMealPlan(item)}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors duration-200"
                >
                  <Plus size={16} />
                  {t('nutrition.addButton')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 今日餐单 */}
      {mealPlan.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              {t('nutrition.planTitle')}
            </h3>
            <button
              onClick={generateShoppingList}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm font-medium hover:bg-secondary-600 transition-colors duration-200"
            >
              <ShoppingCart size={16} />
              {t('nutrition.generateButton')}
            </button>
          </div>
          
          <div className="space-y-2">
            {mealPlan.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-neutral-900">{item.name}</span>
                <button
                  onClick={() => removeFromMealPlan(index)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  移除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
