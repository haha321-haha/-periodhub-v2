/**
 * HVsLYEp职场健康助手 - 数据导出组件
 * 基于HVsLYEp的DataExportComponent函数设计
 */

'use client';

import { useState } from 'react';
import { Download, ShieldCheck, FileText, FileSpreadsheet, FileImage } from 'lucide-react';
import { useExport, useWorkplaceWellnessActions, useLanguage } from '../hooks/useWorkplaceWellnessStore';
import { createTranslationFunction, getPeriodData, getNutritionData } from '../data';
import { ExportFormat, ExportType } from '../types';
import { PDFGenerator, PDFReportData } from '../utils/pdfGenerator';

export default function DataExportComponent() {
  const exportConfig = useExport();
  const lang = useLanguage();
  const { updateExport, setExporting } = useWorkplaceWellnessActions();
  const t = createTranslationFunction(lang);

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const periodData = getPeriodData();
  const nutritionData = getNutritionData(lang);

  // 导出类型选择
  const handleExportTypeChange = (type: ExportType) => {
    updateExport({ exportType: type });
  };

  // 导出格式选择
  const handleExportFormatChange = (format: ExportFormat) => {
    updateExport({ format });
  };

  // 生成导出数据
  const generateExportData = () => {
    const baseData = {
      exportDate: new Date().toISOString(),
      language: lang,
      version: '1.0.0'
    };

    switch (exportConfig.exportType) {
      case 'period':
        return {
          ...baseData,
          type: 'period',
          data: periodData
        };
      case 'nutrition':
        return {
          ...baseData,
          type: 'nutrition',
          data: nutritionData
        };
      case 'all':
        return {
          ...baseData,
          type: 'all',
          data: {
            period: periodData,
            nutrition: nutritionData
          }
        };
      default:
        return baseData;
    }
  };

  // 导出为JSON
  const exportAsJSON = (data: any) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workplace-wellness-${exportConfig.exportType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导出为CSV
  const exportAsCSV = (data: any) => {
    let csvContent = '';
    
    if (exportConfig.exportType === 'period') {
      csvContent = 'Date,Type,Pain Level,Flow\n';
      data.data.forEach((record: any) => {
        csvContent += `${record.date},${record.type},${record.painLevel || ''},${record.flow || ''}\n`;
      });
    } else if (exportConfig.exportType === 'nutrition') {
      csvContent = 'Name,Phase,TCM Nature,Benefits,Nutrients\n';
      data.data.forEach((item: any) => {
        csvContent += `"${item.name}","${item.phase}","${item.tcmNature}","${item.benefits.join('; ')}","${item.nutrients.join('; ')}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workplace-wellness-${exportConfig.exportType}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导出为PDF（使用HTML格式）
  const exportAsPDF = async (data: any) => {
    try {
      const pdfGenerator = new PDFGenerator(lang);
      const pdfData: PDFReportData = {
        exportDate: new Date().toISOString(),
        language: lang,
        exportType: exportConfig.exportType,
        periodData: exportConfig.exportType === 'period' ? data.data : undefined,
        nutritionData: exportConfig.exportType === 'nutrition' ? data.data : undefined,
        allData: exportConfig.exportType === 'all' ? data.data : undefined
      };
      
      // 使用新的PDF生成器
      await pdfGenerator.generateAndDownloadPDF(pdfData);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(t('export.errorMessage'));
    }
  };

  // 执行导出
  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');
    setExporting(true);

    try {
      const data = generateExportData();
      
      // 模拟导出延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (exportConfig.format) {
        case 'json':
          exportAsJSON(data);
          break;
        case 'csv':
          exportAsCSV(data);
          break;
        case 'pdf':
          exportAsPDF(data);
          break;
        default:
          throw new Error('Unsupported export format');
      }
      
      setExportStatus('success');
      alert(t('export.successMessage'));
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
      alert(t('export.errorMessage'));
    } finally {
      setIsExporting(false);
      setExporting(false);
    }
  };

  // 获取格式图标
  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'json':
        return <FileText className="w-4 h-4" />;
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'pdf':
        return <FileImage className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <h4 className="text-lg font-semibold text-neutral-900 mb-4">{t('export.title')}</h4>
      
      <div className="space-y-4">
        {/* 导出内容选择 */}
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">{t('export.contentLabel')}</label>
          <div className="space-y-2">
            {(['period', 'nutrition', 'all'] as ExportType[]).map(typeId => (
              <label 
                key={typeId}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  exportConfig.exportType === typeId 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="exportType" 
                  value={typeId} 
                  checked={exportConfig.exportType === typeId}
                  onChange={() => handleExportTypeChange(typeId)}
                  className="mt-1 text-primary-500 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-neutral-900">{t(`export.types.${typeId}`)}</div>
                  <div className="text-sm text-neutral-600">{t(`export.types.${typeId}_desc`)}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 导出格式选择 */}
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">{t('export.formatLabel')}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['json', 'csv', 'pdf'] as ExportFormat[]).map(formatId => (
              <button
                key={formatId}
                onClick={() => handleExportFormatChange(formatId)}
                className={`p-3 text-center rounded-lg border-2 transition-colors duration-200 ${
                  exportConfig.format === formatId 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {getFormatIcon(formatId)}
                </div>
                <div className="font-medium text-neutral-900">{t(`export.formats.${formatId}`)}</div>
                <div className="text-xs text-neutral-600">{t(`export.formats.${formatId}_desc`)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 导出按钮 */}
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className={`w-full rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 text-base ${
            isExporting 
              ? 'bg-primary-500/50 cursor-not-allowed' 
              : 'bg-primary-500 hover:bg-primary-600'
          } text-white`}
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t('export.exportingButton')}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              {t('export.exportButton')}
            </>
          )}
        </button>

        {/* 隐私保护说明 */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex gap-3">
            <ShieldCheck className="text-blue-500 mt-0.5 w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-blue-900">{t('export.privacyTitle')}</div>
              <div className="text-blue-700 mt-1">{t('export.privacyContent')}</div>
            </div>
          </div>
        </div>

        {/* 导出状态 */}
        {exportStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800">
              ✅ {t('export.successMessage')}
            </div>
          </div>
        )}
        
        {exportStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800">
              ❌ {t('export.errorMessage')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}