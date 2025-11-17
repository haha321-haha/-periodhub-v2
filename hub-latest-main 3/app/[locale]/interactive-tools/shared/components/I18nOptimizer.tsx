'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Globe,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Languages,
  FileText,
  BarChart3
} from 'lucide-react';

interface TranslationStatus {
  totalKeys: number;
  missingKeys: string[];
  inconsistentKeys: string[];
  qualityScore: number;
}

interface I18nOptimizerProps {
  locale: string;
  onTranslationUpdate?: (status: TranslationStatus) => void;
}

export default function I18nOptimizer({ 
  locale, 
  onTranslationUpdate 
}: I18nOptimizerProps) {
  const t = useTranslations('interactiveTools.i18n');
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // 检查翻译完整性
  useEffect(() => {
    const checkTranslations = async () => {
      try {
        // 模拟翻译检查
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStatus: TranslationStatus = {
          totalKeys: 3710,
          missingKeys: [
            'interactiveTools.analytics.charts.pieChart',
            'interactiveTools.analytics.charts.lineChart',
            'interactiveTools.ai.recommendations.priority.high',
            'interactiveTools.social.community.posts.create',
            'interactiveTools.sync.devices.mobile',
            'interactiveTools.reports.export.pdf',
            'interactiveTools.reports.export.html',
            'interactiveTools.reports.templates.medical',
            'interactiveTools.reports.templates.summary',
            'interactiveTools.reports.templates.detailed'
          ],
          inconsistentKeys: [
            'interactiveTools.symptomAssessment.subtitle',
            'interactiveTools.workplaceAssessment.subtitle',
            'interactiveTools.settings.privacy.dataSharing'
          ],
          qualityScore: 85
        };

        setTranslationStatus(mockStatus);
        setLoading(false);
      } catch (error) {
        console.error('Translation check failed:', error);
        setLoading(false);
      }
    };

    checkTranslations();
  }, []);

  // 执行翻译优化
  const optimizeTranslations = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      // 模拟优化过程
      const steps = [
        '检查缺失翻译键...',
        '补充缺失翻译...',
        '修复不一致翻译...',
        '验证翻译质量...',
        '更新翻译缓存...',
        '完成优化'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setOptimizationProgress(Math.round(((i + 1) / steps.length) * 100));
      }

      // 更新状态
      if (translationStatus) {
        const updatedStatus: TranslationStatus = {
          ...translationStatus,
          missingKeys: [],
          inconsistentKeys: [],
          qualityScore: 98
        };
        setTranslationStatus(updatedStatus);
        
        if (onTranslationUpdate) {
          onTranslationUpdate(updatedStatus);
        }
      }

      setIsOptimizing(false);
    } catch (error) {
      console.error('Translation optimization failed:', error);
      setIsOptimizing(false);
    }
  };

  // 导出翻译报告
  const exportTranslationReport = () => {
    if (!translationStatus) return;

    const report = {
      timestamp: new Date().toISOString(),
      locale,
      status: translationStatus,
      recommendations: [
        '补充缺失的210个英文翻译键',
        '统一翻译术语和风格',
        '优化长文本的布局适配',
        '添加文化适应性调整'
      ]
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-report-${locale}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      {/* 标题和状态 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-600" />
            {locale === 'zh' ? '国际化优化' : 'Internationalization Optimization'}
          </h2>
          <p className="text-gray-600">
            {locale === 'zh' ? '完善翻译质量，优化多语言支持' : 'Improve translation quality and optimize multilingual support'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            translationStatus?.qualityScore && translationStatus.qualityScore >= 90
              ? 'bg-green-100 text-green-700'
              : translationStatus?.qualityScore && translationStatus.qualityScore >= 70
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {translationStatus?.qualityScore}% {locale === 'zh' ? '质量分数' : 'Quality Score'}
          </div>
        </div>
      </div>

      {/* 翻译状态概览 */}
      {translationStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{translationStatus.totalKeys}</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              {locale === 'zh' ? '总翻译键' : 'Total Keys'}
            </h3>
            <p className="text-sm text-blue-700">
              {locale === 'zh' ? '中英文翻译键总数' : 'Total translation keys in both languages'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{translationStatus.missingKeys.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              {locale === 'zh' ? '缺失翻译' : 'Missing Keys'}
            </h3>
            <p className="text-sm text-red-700">
              {locale === 'zh' ? '需要补充的翻译键' : 'Translation keys that need to be added'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <RefreshCw className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{translationStatus.inconsistentKeys.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              {locale === 'zh' ? '不一致翻译' : 'Inconsistent Keys'}
            </h3>
            <p className="text-sm text-yellow-700">
              {locale === 'zh' ? '需要修复的翻译键' : 'Translation keys that need to be fixed'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{translationStatus.qualityScore}%</span>
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {locale === 'zh' ? '质量分数' : 'Quality Score'}
            </h3>
            <p className="text-sm text-green-700">
              {locale === 'zh' ? '整体翻译质量评分' : 'Overall translation quality score'}
            </p>
          </div>
        </div>
      )}

      {/* 优化进度 */}
      {isOptimizing && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            {locale === 'zh' ? '正在优化翻译...' : 'Optimizing translations...'}
          </h3>
          
          <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${optimizationProgress}%` }}
            />
          </div>
          
          <p className="text-sm text-blue-700">
            {optimizationProgress}% {locale === 'zh' ? '完成' : 'Complete'}
          </p>
        </div>
      )}

      {/* 缺失翻译详情 */}
      {translationStatus && translationStatus.missingKeys.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200 mb-8">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {locale === 'zh' ? '缺失翻译键' : 'Missing Translation Keys'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {translationStatus.missingKeys.slice(0, 10).map((key, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-red-100">
                <code className="text-sm text-red-700 font-mono">{key}</code>
              </div>
            ))}
          </div>
          
          {translationStatus.missingKeys.length > 10 && (
            <p className="text-sm text-red-600">
              {locale === 'zh' 
                ? `还有 ${translationStatus.missingKeys.length - 10} 个缺失的翻译键...`
                : `And ${translationStatus.missingKeys.length - 10} more missing keys...`
              }
            </p>
          )}
        </div>
      )}

      {/* 不一致翻译详情 */}
      {translationStatus && translationStatus.inconsistentKeys.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 mb-8">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            {locale === 'zh' ? '不一致翻译键' : 'Inconsistent Translation Keys'}
          </h3>
          
          <div className="space-y-3">
            {translationStatus.inconsistentKeys.map((key, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-yellow-100">
                <code className="text-sm text-yellow-700 font-mono">{key}</code>
                <p className="text-xs text-yellow-600 mt-1">
                  {locale === 'zh' ? '需要统一翻译风格' : 'Needs consistent translation style'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 优化建议 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200 mb-8">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '优化建议' : 'Optimization Recommendations'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {locale === 'zh' ? '补充缺失翻译' : 'Add Missing Translations'}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === 'zh' ? '补充210个缺失的英文翻译键' : 'Add 210 missing English translation keys'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {locale === 'zh' ? '统一翻译风格' : 'Unify Translation Style'}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === 'zh' ? '确保医学术语翻译的一致性' : 'Ensure consistency in medical terminology'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {locale === 'zh' ? '优化布局适配' : 'Optimize Layout Adaptation'}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === 'zh' ? '调整长文本的显示布局' : 'Adjust layout for long text content'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {locale === 'zh' ? '文化适应性' : 'Cultural Adaptation'}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === 'zh' ? '根据文化背景调整表达方式' : 'Adjust expressions based on cultural context'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={optimizeTranslations}
          disabled={isOptimizing}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              {locale === 'zh' ? '优化中...' : 'Optimizing...'}
            </>
          ) : (
            <>
              <Settings className="w-5 h-5 mr-2" />
              {locale === 'zh' ? '开始优化' : 'Start Optimization'}
            </>
          )}
        </button>
        
        <button
          onClick={exportTranslationReport}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <Download className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '导出报告' : 'Export Report'}
        </button>
      </div>
    </div>
  );
}
