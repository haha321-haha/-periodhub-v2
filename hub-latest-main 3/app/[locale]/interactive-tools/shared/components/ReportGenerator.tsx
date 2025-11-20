'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Heart,
  Settings,
  BarChart3,
  PieChart,
  Clock,
  User,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Share2,
  Mail,
  Printer,
  Eye,
  Filter,
  Search,
  Edit,
  Save,
  X,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Database,
  Cloud,
  Wifi,
  Battery,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Router,
  Server,
  Terminal,
  Code,
  Award,
  AlertTriangle,
  Brain,
  LineChart
} from 'lucide-react';

interface ReportData {
  userProfile: {
    name: string;
    age: number;
    assessmentCount: number;
    joinDate: string;
  };
  assessmentSummary: {
    totalAssessments: number;
    averagePainLevel: number;
    painTrend: 'improving' | 'stable' | 'worsening';
    mostEffectiveTreatment: string;
    cyclePattern: string;
  };
  insights: Array<{
    category: 'pattern' | 'correlation' | 'recommendation' | 'warning';
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    timeframe: string;
    effectiveness: number;
  }>;
  charts: {
    painTrend: Array<{ date: string; pain: number; mood: number }>;
    treatmentEffectiveness: Array<{ treatment: string; effectiveness: number }>;
    cyclePattern: Array<{ cycle: number; duration: number; intensity: number }>;
  };
}

interface ReportGeneratorProps {
  locale: string;
  userId?: string;
  timeRange?: 'month' | 'quarter' | 'year';
  onReportGenerated?: (report: ReportData) => void;
}

export default function ReportGenerator({
  locale,
  userId,
  timeRange = 'quarter',
  onReportGenerated
}: ReportGeneratorProps) {
  const t = useTranslations('interactiveTools.reports');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'medical'>('summary');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState<'standard' | 'enhanced' | 'maximum'>('standard');

  // 生成报告数据
  const generateReport = async () => {
    setLoading(true);

    try {
      // 模拟报告生成过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockReportData: ReportData = {
        userProfile: {
          name: '用户',
          age: 28,
          assessmentCount: 24,
          joinDate: '2024-01-01'
        },
        assessmentSummary: {
          totalAssessments: 24,
          averagePainLevel: 6.8,
          painTrend: 'improving',
          mostEffectiveTreatment: '热敷疗法',
          cyclePattern: '规律（28-30天）'
        },
        insights: [
          {
            category: 'pattern',
            title: '疼痛模式识别',
            description: '您的疼痛通常在月经开始前2天达到峰值，建议提前预防',
            confidence: 0.85,
            actionable: true
          },
          {
            category: 'correlation',
            title: '活动与疼痛关联',
            description: '轻度运动与疼痛缓解呈正相关，建议增加日常活动量',
            confidence: 0.72,
            actionable: true
          },
          {
            category: 'recommendation',
            title: '个性化建议',
            description: '基于您的数据，热敷疗法是最有效的缓解方法',
            confidence: 0.91,
            actionable: true
          },
          {
            category: 'warning',
            title: '医疗建议',
            description: '疼痛程度较高，建议咨询专业医生进行进一步检查',
            confidence: 0.88,
            actionable: true
          }
        ],
        recommendations: [
          {
            priority: 'high',
            category: '治疗',
            title: '热敷疗法优化',
            description: '在疼痛高峰期前1天开始热敷，每次30-45分钟',
            timeframe: '立即开始',
            effectiveness: 0.85
          },
          {
            priority: 'high',
            category: '生活方式',
            title: '运动计划',
            description: '每周进行3次低强度有氧运动，每次20-30分钟',
            timeframe: '2-4周见效',
            effectiveness: 0.78
          },
          {
            priority: 'medium',
            category: '饮食',
            title: '抗炎饮食',
            description: '增加Omega-3脂肪酸摄入，减少精制糖和加工食品',
            timeframe: '3-4周见效',
            effectiveness: 0.68
          }
        ],
        charts: {
          painTrend: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            pain: Math.random() * 10,
            mood: Math.random() * 10
          })),
          treatmentEffectiveness: [
            { treatment: '热敷', effectiveness: 8.5 },
            { treatment: '布洛芬', effectiveness: 7.8 },
            { treatment: '瑜伽', effectiveness: 6.2 },
            { treatment: '按摩', effectiveness: 7.1 }
          ],
          cyclePattern: Array.from({ length: 6 }, (_, i) => ({
            cycle: i + 1,
            duration: 28 + Math.random() * 7 - 3.5,
            intensity: Math.random() * 10
          }))
        }
      };

      setReportData(mockReportData);

      if (onReportGenerated) {
        onReportGenerated(mockReportData);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 导出PDF
  const exportToPDF = () => {
    if (!reportData) return;

    // 这里可以实现实际的PDF生成逻辑
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `periodhub-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 生成报告内容
  const generateReportContent = () => {
    if (!reportData) return '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PeriodHub 健康报告</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .section { margin-bottom: 30px; }
          .chart { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PeriodHub 个人健康报告</h1>
          <p>生成时间: ${new Date().toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}</p>
        </div>

        <div class="section">
          <h2>用户概况</h2>
          <p>姓名: ${reportData.userProfile.name}</p>
          <p>年龄: ${reportData.userProfile.age}岁</p>
          <p>评估次数: ${reportData.userProfile.assessmentCount}次</p>
        </div>

        <div class="section">
          <h2>评估总结</h2>
          <p>总评估次数: ${reportData.assessmentSummary.totalAssessments}</p>
          <p>平均疼痛等级: ${reportData.assessmentSummary.averagePainLevel}/10</p>
          <p>疼痛趋势: ${reportData.assessmentSummary.painTrend}</p>
          <p>最有效治疗方法: ${reportData.assessmentSummary.mostEffectiveTreatment}</p>
        </div>

        <div class="section">
          <h2>智能洞察</h2>
          ${reportData.insights.map(insight => `
            <div>
              <h3>${insight.title}</h3>
              <p>${insight.description}</p>
              <p>置信度: ${Math.round(insight.confidence * 100)}%</p>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>个性化建议</h2>
          ${reportData.recommendations.map(rec => `
            <div>
              <h3>${rec.title}</h3>
              <p>${rec.description}</p>
              <p>时间框架: ${rec.timeframe}</p>
              <p>有效性: ${Math.round(rec.effectiveness * 100)}%</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'pattern': return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case 'correlation': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'recommendation': return <Award className="w-4 h-4 text-purple-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      {/* 标题和控制 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-green-600" />
            {locale === 'zh' ? '高级报告生成' : 'Advanced Report Generation'}
          </h2>
          <p className="text-gray-600">
            {locale === 'zh' ? '生成专业的个人健康报告和数据分析' : 'Generate professional personal health reports and data analysis'}
          </p>
        </div>

        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                {locale === 'zh' ? '生成中...' : 'Generating...'}
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                {locale === 'zh' ? '生成报告' : 'Generate Report'}
              </>
            )}
          </button>

          {reportData && (
            <button
              onClick={exportToPDF}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              {locale === 'zh' ? '导出PDF' : 'Export PDF'}
            </button>
          )}
        </div>
      </div>

      {/* 报告配置 */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '报告配置' : 'Report Configuration'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'zh' ? '报告类型' : 'Report Type'}
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">{locale === 'zh' ? '摘要报告' : 'Summary Report'}</option>
              <option value="detailed">{locale === 'zh' ? '详细报告' : 'Detailed Report'}</option>
              <option value="medical">{locale === 'zh' ? '医疗报告' : 'Medical Report'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'zh' ? '时间范围' : 'Time Range'}
            </label>
            <select
              value={timeRange}
              onChange={(e) => {/* handle time range change */}}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="month">{locale === 'zh' ? '最近1个月' : 'Last Month'}</option>
              <option value="quarter">{locale === 'zh' ? '最近3个月' : 'Last Quarter'}</option>
              <option value="year">{locale === 'zh' ? '最近1年' : 'Last Year'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'zh' ? '隐私级别' : 'Privacy Level'}
            </label>
            <select
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">{locale === 'zh' ? '标准' : 'Standard'}</option>
              <option value="enhanced">{locale === 'zh' ? '增强' : 'Enhanced'}</option>
              <option value="maximum">{locale === 'zh' ? '最高' : 'Maximum'}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{locale === 'zh' ? '包含图表' : 'Include Charts'}</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeRecommendations}
                onChange={(e) => setIncludeRecommendations(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{locale === 'zh' ? '包含建议' : 'Include Recommendations'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* 报告内容 */}
      {reportData && (
        <div className="space-y-8">
          {/* 用户概况 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              {locale === 'zh' ? '用户概况' : 'User Profile'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{reportData.userProfile.age}</div>
                <div className="text-sm text-blue-700">{locale === 'zh' ? '年龄' : 'Age'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{reportData.userProfile.assessmentCount}</div>
                <div className="text-sm text-green-700">{locale === 'zh' ? '评估次数' : 'Assessments'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{reportData.assessmentSummary.averagePainLevel}</div>
                <div className="text-sm text-purple-700">{locale === 'zh' ? '平均疼痛等级' : 'Avg Pain Level'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {reportData.assessmentSummary.painTrend === 'improving' && '↗'}
                  {reportData.assessmentSummary.painTrend === 'stable' && '→'}
                  {reportData.assessmentSummary.painTrend === 'worsening' && '↘'}
                </div>
                <div className="text-sm text-orange-700">{locale === 'zh' ? '疼痛趋势' : 'Pain Trend'}</div>
              </div>
            </div>
          </div>

          {/* 智能洞察 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              {locale === 'zh' ? '智能洞察' : 'Smart Insights'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getInsightIcon(insight.category)}
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {Math.round(insight.confidence * 100)}% {locale === 'zh' ? '置信度' : 'Confidence'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                  {insight.actionable && (
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {locale === 'zh' ? '可执行建议' : 'Actionable Recommendation'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 个性化建议 */}
          {includeRecommendations && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                {locale === 'zh' ? '个性化建议' : 'Personalized Recommendations'}
              </h3>
              <div className="space-y-4">
                {reportData.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                        <p className="text-sm text-gray-600">{rec.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority === 'high' && (locale === 'zh' ? '高优先级' : 'High Priority')}
                        {rec.priority === 'medium' && (locale === 'zh' ? '中优先级' : 'Medium Priority')}
                        {rec.priority === 'low' && (locale === 'zh' ? '低优先级' : 'Low Priority')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {rec.timeframe}
                      </div>
                      <div className="flex items-center text-green-600">
                        <Star className="w-4 h-4 mr-1" />
                        {Math.round(rec.effectiveness * 100)}% {locale === 'zh' ? '有效性' : 'Effectiveness'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 图表 */}
          {includeCharts && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                {locale === 'zh' ? '数据可视化' : 'Data Visualization'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">{locale === 'zh' ? '疼痛趋势' : 'Pain Trend'}</h4>
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    <LineChart className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">{locale === 'zh' ? '治疗方法效果' : 'Treatment Effectiveness'}</h4>
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    <PieChart className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 隐私保护说明 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              {locale === 'zh' ? '隐私保护' : 'Privacy Protection'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{locale === 'zh' ? '数据加密' : 'Data Encryption'}</h4>
                <p className="text-sm text-gray-600">{locale === 'zh' ? '所有数据采用端到端加密' : 'End-to-end encryption for all data'}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{locale === 'zh' ? '隐私控制' : 'Privacy Control'}</h4>
                <p className="text-sm text-gray-600">{locale === 'zh' ? '您完全控制数据的使用' : 'You have full control over data usage'}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{locale === 'zh' ? '合规认证' : 'Compliance'}</h4>
                <p className="text-sm text-gray-600">{locale === 'zh' ? '符合GDPR和HIPAA标准' : 'GDPR and HIPAA compliant'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

