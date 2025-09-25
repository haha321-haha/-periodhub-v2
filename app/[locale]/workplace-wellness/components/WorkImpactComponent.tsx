/**
 * HVsLYEp职场健康助手 - 工作影响组件
 * 基于HVsLYEp的WorkImpactTracker函数设计
 */

'use client';

import { useState } from 'react';
import { Activity, Copy, Mail } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useWorkImpact, useWorkplaceWellnessActions } from '../hooks/useWorkplaceWellnessStore';
import { createTranslationFunction, getLeaveTemplates } from '../data';
import { LeaveTemplate } from '../types';

export default function WorkImpactComponent() {
  const workImpact = useWorkImpact();
  const locale = useLocale();
  const { updateWorkImpact, selectTemplate } = useWorkplaceWellnessActions();
  const t = createTranslationFunction(locale as 'zh' | 'en');
  
  const templates = getLeaveTemplates(locale as 'zh' | 'en');
  const [selectedTemplate, setSelectedTemplate] = useState<LeaveTemplate | null>(null);

  const handlePainLevelChange = (level: number) => {
    updateWorkImpact({ painLevel: level as any });
  };

  const handleEfficiencyChange = (efficiency: number) => {
    updateWorkImpact({ efficiency });
  };

  const handleTemplateSelect = (template: LeaveTemplate) => {
    setSelectedTemplate(template);
    selectTemplate(template.id);
  };

  const copyTemplate = () => {
    if (selectedTemplate) {
      navigator.clipboard.writeText(selectedTemplate.content);
      // 这里可以添加成功提示
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {t('workImpact.title')}
        </h2>
      </div>

      {/* 症状记录区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="space-y-6">
          {/* 疼痛程度 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              {t('workImpact.painLevel')}
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={workImpact.painLevel}
                onChange={(e) => handlePainLevelChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-neutral-600">10</span>
              <div className="w-12 text-center">
                <span className="text-lg font-bold text-primary-600">
                  {workImpact.painLevel}
                </span>
              </div>
            </div>
          </div>

          {/* 工作效率 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              {t('workImpact.efficiency')}
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">0%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={workImpact.efficiency}
                onChange={(e) => handleEfficiencyChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-neutral-600">100%</span>
              <div className="w-12 text-center">
                <span className="text-lg font-bold text-primary-600">
                  {workImpact.efficiency}%
                </span>
              </div>
            </div>
          </div>

          {/* 工作调整选项 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              {t('workImpact.adjustment')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(t('workImpact.adjustOptions') as unknown as string[]).map((option: string, index: number) => (
                <button
                  key={index}
                  className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="pt-4">
            <button className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200">
              {t('workImpact.saveButton')}
            </button>
          </div>
        </div>
      </div>

      {/* 请假模板区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          {t('workImpact.templatesTitle')}
        </h3>
        
        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedTemplate?.id === template.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-neutral-900">{template.title}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  template.severity === 'mild' ? 'bg-green-100 text-green-800' :
                  template.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {t(`workImpact.severity.${template.severity}`)}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{template.subject}</p>
            </div>
          ))}
        </div>

        {/* 模板预览 */}
        {selectedTemplate && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <h4 className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
              <Mail size={16} />
              {t('workImpact.preview')}
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-neutral-700">
                  {t('workImpact.subject')}
                </span>
                <p className="text-sm text-neutral-600">{selectedTemplate.subject}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-700">
                  {t('workImpact.content')}
                </span>
                <p className="text-sm text-neutral-600 mt-1">{selectedTemplate.content}</p>
              </div>
            </div>
            <button
              onClick={copyTemplate}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors duration-200"
            >
              <Copy size={16} />
              {t('workImpact.copyButton')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
