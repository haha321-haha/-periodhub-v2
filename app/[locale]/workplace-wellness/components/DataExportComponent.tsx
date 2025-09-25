/**
 * HVsLYEp职场健康助手 - 数据导出组件
 * 基于HVsLYEp的DataExportComponent函数设计
 */

'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileImage } from 'lucide-react';
import { useExport, useWorkplaceWellnessActions, useLanguage } from '../hooks/useWorkplaceWellnessStore';
import { createTranslationFunction, getPeriodData, getNutritionData } from '../data';

export default function DataExportComponent() {
  const exportConfig = useExport();
  const lang = useLanguage();
  const { updateExport, setExporting } = useWorkplaceWellnessActions();
  const t = createTranslationFunction(lang);

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const periodData = getPeriodData();
  const nutritionData = getNutritionData(lang);

  const handleExportTypeChange = (type: string) => {
    updateExport({ exportType: type as any });
  };

  const handleFormatChange = (format: string) => {
    updateExport({ format: format as any });
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');
    
    try {
      // 模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 根据选择的类型和格式生成数据
      let exportData;
      
      switch (exportConfig.exportType) {
        case 'period':
          exportData = periodData;
          break;
        case 'nutrition':
          exportData = nutritionData;
          break;
        case 'all':
          exportData = {
            period: periodData,
            nutrition: nutritionData,
            exportDate: new Date().toISOString()
          };
          break;
        default:
          exportData = periodData;
      }

      // 根据格式处理数据
      let blob: Blob;
      let filename: string;
      
      switch (exportConfig.format) {
        case 'json':
          blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          filename = `workplace-wellness-data-${Date.now()}.json`;
          break;
        case 'csv':
          const csvData = convertToCSV(exportData);
          blob = new Blob([csvData], { type: 'text/csv' });
          filename = `workplace-wellness-data-${Date.now()}.csv`;
          break;
        case 'pdf':
          // 这里可以实现PDF生成逻辑
          blob = new Blob(['PDF content would be here'], { type: 'application/pdf' });
          filename = `workplace-wellness-data-${Date.now()}.pdf`;
          break;
        default:
          blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          filename = `workplace-wellness-data-${Date.now()}.json`;
      }

      // 下载文件
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus('success');
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any) => {
    if (Array.isArray(data)) {
      const headers = Object.keys(data[0] || {});
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
      ];
      return csvRows.join('\n');
    }
    return JSON.stringify(data);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json':
        return <FileText size={20} />;
      case 'csv':
        return <FileSpreadsheet size={20} />;
      case 'pdf':
        return <FileImage size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {t('export.title')}
        </h2>
        <p className="text-neutral-600">
          {t('export.subtitle')}
        </p>
      </div>

      {/* 导出配置 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="space-y-6">
          {/* 导出类型选择 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              {t('export.typeLabel')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(t('export.types')).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleExportTypeChange(key)}
                  className={`p-4 text-left border rounded-lg transition-colors duration-200 ${
                    exportConfig.exportType === key
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <div className="font-medium">{value}</div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {key === 'period' && `${periodData.length} 条经期记录`}
                    {key === 'nutrition' && `${nutritionData.length} 条营养建议`}
                    {key === 'all' && '包含所有数据'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 导出格式选择 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              {t('export.formatLabel')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(t('export.formats')).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleFormatChange(key)}
                  className={`p-4 text-left border rounded-lg transition-colors duration-200 ${
                    exportConfig.format === key
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getFormatIcon(key)}
                    <div>
                      <div className="font-medium">{value}</div>
                      <div className="text-sm text-neutral-600">
                        {key === 'json' && '结构化数据格式'}
                        {key === 'csv' && '表格数据格式'}
                        {key === 'pdf' && '文档格式'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 导出按钮 */}
          <div className="pt-4">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                isExporting
                  ? 'bg-neutral-400 text-white cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              <Download size={20} />
              {isExporting ? t('common.loading') : t('export.exportButton')}
            </button>
          </div>

          {/* 状态提示 */}
          {exportStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {t('export.successMessage')}
              </div>
            </div>
          )}

          {exportStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {t('export.errorMessage')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 数据预览 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          数据预览
        </h3>
        <div className="bg-neutral-50 rounded-lg p-4">
          <pre className="text-sm text-neutral-600 overflow-x-auto">
            {JSON.stringify(
              exportConfig.exportType === 'period' ? periodData :
              exportConfig.exportType === 'nutrition' ? nutritionData :
              { period: periodData, nutrition: nutritionData },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
