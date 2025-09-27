/**
 * HVsLYEp职场健康助手 - 营养建议组件
 * 基于HVsLYEp的NutritionAdvisorComponent函数设计
 */

'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, ListChecks } from 'lucide-react';
import { useNutrition, useWorkplaceWellnessActions } from '../hooks/useWorkplaceWellnessStore';
import { useLocale } from 'next-intl';
import { getNutritionData } from '../data';
import { useTranslations } from 'next-intl';
import { NutritionRecommendation } from '../types';

export default function NutritionComponent() {
  const nutrition = useNutrition();
  const locale = useLocale();
  const { updateNutrition } = useWorkplaceWellnessActions();
  const t = useTranslations('workplaceWellness');

  const nutritionData = getNutritionData(locale);
  const [searchTerm, setSearchTerm] = useState('');
  const [mealPlan, setMealPlan] = useState<NutritionRecommendation[]>([]);

  // 过滤营养数据 - 基于HVsLYEp的过滤逻辑
  const filteredFoods = useMemo(() => {
    return nutritionData.filter(food => 
      food.phase === nutrition.selectedPhase && 
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [nutritionData, nutrition.selectedPhase, searchTerm]);

  // 添加到膳食计划
  const addToMealPlan = (food: NutritionRecommendation) => {
    setMealPlan(prev => [...prev, food]);
  };

  // 从膳食计划中移除
  const removeFromMealPlan = (index: number) => {
    setMealPlan(prev => prev.filter((_, i) => i !== index));
  };

  // 生成膳食计划
  const generateMealPlan = () => {
    // 基于HVsLYEp的膳食计划生成逻辑
    const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
    const suggestions = meals.map(meal => ({
      meal,
      suggestion: t(`nutrition.mealSuggestions.${meal}`)
    }));
    
    console.log('Generated meal plan:', suggestions);
    alert(t('nutrition.planGenerated'));
  };

  return (
    <div className="space-y-6">
      {/* 营养建议配置 - 基于HVsLYEp的NutritionAdvisorComponent */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">{t('nutrition.title')}</h3>
        
        {/* 经期阶段选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-800 mb-3">{t('nutrition.phaseLabel')}</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['menstrual', 'follicular', 'ovulation', 'luteal'] as const).map(phase => (
              <button
                key={phase}
                onClick={() => updateNutrition({ selectedPhase: phase })}
                className={`p-3 rounded-lg border-2 transition-colors duration-200 text-center ${
                  nutrition.selectedPhase === phase 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="text-2xl mb-1">{t(`nutrition.phaseIcons.${phase}`)}</div>
                <div className="text-sm font-medium">{t(`nutrition.phases.${phase}`)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 体质类型选择 */}
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">{t('nutrition.constitutionLabel')}</label>
          <select 
            value={nutrition.constitutionType}
            onChange={(e) => updateNutrition({ constitutionType: e.target.value as any })}
            className="w-full px-3 py-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {(['qi_deficiency', 'yang_deficiency', 'yin_deficiency', 'blood_deficiency', 'balanced'] as const).map(type => (
              <option key={type} value={type}>{t(`nutrition.constitutions.${type}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 推荐食物 - 基于HVsLYEp的食物展示逻辑 */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-neutral-900">{t('nutrition.foodTitle')}</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-4 h-4" />
            <input
              type="text"
              placeholder={t('nutrition.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFoods.length > 0 ? filteredFoods.map((food, index) => (
            <div key={index} className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors duration-200">
              <div className="flex items-start justify-between mb-3">
                <h5 className="font-semibold text-neutral-900 text-lg">{food.name}</h5>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  food.tcmNature === 'warm' ? 'bg-red-100 text-red-800' : 'bg-neutral-100 text-neutral-800'
                }`}>
                  {t(`nutrition.tcmNature.${food.tcmNature}`)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h6 className="text-sm font-medium text-neutral-800 mb-2">{t('nutrition.benefitsLabel')}</h6>
                  <div className="flex flex-wrap gap-1">
                    {food.benefits.map((benefit, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-neutral-800 mb-2">{t('nutrition.nutrientsLabel')}</h6>
                  <div className="flex flex-wrap gap-1">
                    {food.nutrients.map((nutrient, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => addToMealPlan(food)}
                  className="w-full rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-3 py-1.5 text-sm border border-primary-500 text-primary-600 hover:bg-primary-500/10"
                >
                  <Plus className="w-4 h-4" /> {t('nutrition.addButton')}
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-neutral-600 md:col-span-2">
              {t('nutrition.noResults')}
            </div>
          )}
        </div>
      </div>

      {/* 膳食计划 - 基于HVsLYEp的膳食计划展示 */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h4 className="text-lg font-semibold text-neutral-900 mb-4">{t('nutrition.planTitle')}</h4>
        
        {/* 膳食建议 */}
        <div className="space-y-4 mb-6">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mealId => (
            <div key={mealId} className="p-4 bg-neutral-50 rounded-lg">
              <h5 className="font-medium text-neutral-900 mb-2">{t(`nutrition.meals.${mealId}`)}</h5>
              <p className="text-sm text-neutral-600">{t(`nutrition.mealSuggestions.${mealId}`)}</p>
            </div>
          ))}
        </div>

        {/* 已选择的食物 */}
        {mealPlan.length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-neutral-900 mb-2">{t('nutrition.selectedFoods')}</h5>
            <div className="space-y-2">
              {mealPlan.map((food, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-neutral-800">{food.name}</span>
                  <button
                    onClick={() => removeFromMealPlan(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          onClick={generateMealPlan}
          className="w-full rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 text-base bg-primary-500 hover:bg-primary-600 text-white"
        >
          <ListChecks className="w-4 h-4" /> {t('nutrition.generateButton')}
        </button>
      </div>
    </div>
  );
}