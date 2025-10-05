/**
 * HVsLYEp职场健康助手 - PDF生成器
 * 基于HTML格式生成PDF报告
 */

import { PeriodRecord, NutritionRecommendation, ExportType } from '../types';

export interface PDFReportData {
  exportDate: string;
  locale: string;
  exportType: ExportType;
  periodData?: PeriodRecord[];
  nutritionData?: NutritionRecommendation[];
  allData?: {
    period: PeriodRecord[];
    nutrition: NutritionRecommendation[];
  };
}

export class PDFGenerator {
  private locale: string;

  constructor(locale: string) {
    this.locale = locale;
  }

  /**
   * 生成HTML格式的PDF报告
   */
  generateHTMLReport(data: PDFReportData): string {
    const isZh = this.locale === 'zh';

    return `
<!DOCTYPE html>
<html lang="${this.locale}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isZh ? '工作场所健康数据报告' : 'Workplace Health Data Report'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }

        .report-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }

        .report-info h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 20px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .info-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .info-value {
            color: #333;
            font-size: 16px;
        }

        .data-section {
            margin-bottom: 30px;
        }

        .data-section h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 18px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .data-table th {
            background: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }

        .data-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
        }

        .data-table tr:hover {
            background: #f8f9fa;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge-period {
            background: #e3f2fd;
            color: #1976d2;
        }

        .badge-predicted {
            background: #fff3e0;
            color: #f57c00;
        }

        .badge-warm {
            background: #ffebee;
            color: #d32f2f;
        }

        .badge-cool {
            background: #e3f2fd;
            color: #1976d2;
        }

        .badge-neutral {
            background: #e8f5e8;
            color: #388e3c;
        }

        .footer {
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }

        .privacy-notice {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 6px;
            padding: 15px;
            margin-top: 20px;
        }

        .privacy-notice h4 {
            color: #1976d2;
            margin-bottom: 10px;
        }

        @media print {
            body {
                padding: 0;
            }

            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }

            .data-table th {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${isZh ? '工作场所健康数据报告' : 'Workplace Health Data Report'}</h1>
        <div class="subtitle">${isZh ? 'Period Hub 职场健康助手' : 'Period Hub Workplace Wellness Assistant'}</div>
    </div>

    <div class="report-info">
        <h2>${isZh ? '报告信息' : 'Report Information'}</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">${isZh ? '导出时间' : 'Export Time'}</div>
                <div class="info-value">${new Date(data.exportDate).toLocaleString(this.locale === 'zh' ? 'zh-CN' : 'en-US')}</div>
            </div>
            <div class="info-item">
                <div class="info-label">${isZh ? '导出类型' : 'Export Type'}</div>
                <div class="info-value">${this.getExportTypeLabel(data.exportType)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">${isZh ? '语言版本' : 'Language'}</div>
                <div class="info-value">${isZh ? '中文' : 'English'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">${isZh ? '数据条数' : 'Data Records'}</div>
                <div class="info-value">${this.getDataCount(data)}</div>
            </div>
        </div>
    </div>

    ${this.generateDataSections(data)}

    <div class="footer">
        <div class="privacy-notice">
            <h4>${isZh ? '隐私保护声明' : 'Privacy Protection Notice'}</h4>
            <p>${isZh
                ? '本报告包含个人健康数据，请妥善保管，避免泄露。所有数据均存储在您的本地设备中，我们不会收集或存储您的个人信息。'
                : 'This report contains personal health data. Please keep it secure and avoid disclosure. All data is stored locally on your device. We do not collect or store your personal information.'
            }</p>
        </div>
        <p style="margin-top: 15px;">
            ${isZh
                ? '报告生成时间: ' + new Date().toLocaleString('zh-CN')
                : 'Report generated at: ' + new Date().toLocaleString('en-US')
            }
        </p>
    </div>
</body>
</html>`;
  }

  /**
   * 获取导出类型标签
   */
  private getExportTypeLabel(type: ExportType): string {
    const labels = {
      zh: {
        period: '经期数据',
        nutrition: '营养数据',
        all: '全部数据'
      },
      en: {
        period: 'Period Data',
        nutrition: 'Nutrition Data',
        all: 'All Data'
      }
    };

    return labels[this.locale][type];
  }

  /**
   * 获取数据条数
   */
  private getDataCount(data: PDFReportData): string {
    const isZh = this.locale === 'zh';

    switch (data.exportType) {
      case 'period':
        return `${data.periodData?.length || 0} ${isZh ? '条记录' : 'records'}`;
      case 'nutrition':
        return `${data.nutritionData?.length || 0} ${isZh ? '条记录' : 'records'}`;
      case 'all':
        const periodCount = data.allData?.period.length || 0;
        const nutritionCount = data.allData?.nutrition.length || 0;
        return `${periodCount + nutritionCount} ${isZh ? '条记录' : 'records'}`;
      default:
        return '0';
    }
  }

  /**
   * 生成数据部分
   */
  private generateDataSections(data: PDFReportData): string {
    const isZh = this.locale === 'zh';
    let sections = '';

    if (data.exportType === 'period' || data.exportType === 'all') {
      sections += this.generatePeriodSection(data.periodData || data.allData?.period || []);
    }

    if (data.exportType === 'nutrition' || data.exportType === 'all') {
      sections += this.generateNutritionSection(data.nutritionData || data.allData?.nutrition || []);
    }

    return sections;
  }

  /**
   * 生成经期数据部分
   */
  private generatePeriodSection(periodData: PeriodRecord[]): string {
    const isZh = this.locale === 'zh';

    if (periodData.length === 0) {
      return `
        <div class="data-section">
          <h3>${isZh ? '经期数据' : 'Period Data'}</h3>
          <p style="color: #666; font-style: italic;">${isZh ? '暂无经期数据记录' : 'No period data records'}</p>
        </div>
      `;
    }

    return `
      <div class="data-section">
        <h3>${isZh ? '经期数据' : 'Period Data'}</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>${isZh ? '日期' : 'Date'}</th>
              <th>${isZh ? '类型' : 'Type'}</th>
              <th>${isZh ? '疼痛等级' : 'Pain Level'}</th>
              <th>${isZh ? '流量' : 'Flow'}</th>
              <th>${isZh ? '备注' : 'Notes'}</th>
            </tr>
          </thead>
          <tbody>
            ${periodData.map(record => `
              <tr>
                <td>${new Date(record.date).toLocaleDateString(this.locale === 'zh' ? 'zh-CN' : 'en-US')}</td>
                <td>
                  <span class="badge ${record.type === 'period' ? 'badge-period' : 'badge-predicted'}">
                    ${isZh
                      ? (record.type === 'period' ? '经期' : '预测')
                      : (record.type === 'period' ? 'Period' : 'Predicted')
                    }
                  </span>
                </td>
                <td>${record.painLevel || '-'}</td>
                <td>${record.flow || '-'}</td>
                <td>${record.notes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * 生成营养数据部分
   */
  private generateNutritionSection(nutritionData: NutritionRecommendation[]): string {
    const isZh = this.locale === 'zh';

    if (nutritionData.length === 0) {
      return `
        <div class="data-section">
          <h3>${isZh ? '营养数据' : 'Nutrition Data'}</h3>
          <p style="color: #666; font-style: italic;">${isZh ? '暂无营养数据记录' : 'No nutrition data records'}</p>
        </div>
      `;
    }

    return `
      <div class="data-section">
        <h3>${isZh ? '营养数据' : 'Nutrition Data'}</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>${isZh ? '食物名称' : 'Food Name'}</th>
              <th>${isZh ? '经期阶段' : 'Menstrual Phase'}</th>
              <th>${isZh ? '中医性质' : 'TCM Nature'}</th>
              <th>${isZh ? '主要功效' : 'Main Benefits'}</th>
              <th>${isZh ? '关键营养素' : 'Key Nutrients'}</th>
            </tr>
          </thead>
          <tbody>
            ${nutritionData.map(item => `
              <tr>
                <td><strong>${item.name}</strong></td>
                <td>${this.getPhaseLabel(item.phase)}</td>
                <td>
                  <span class="badge badge-${item.tcmNature}">
                    ${this.getTCMNatureLabel(item.tcmNature)}
                  </span>
                </td>
                <td>${item.benefits.join(', ')}</td>
                <td>${item.nutrients.join(', ')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * 获取经期阶段标签
   */
  private getPhaseLabel(phase: string): string {
    const labels = {
      zh: {
        menstrual: '经期',
        follicular: '卵泡期',
        ovulation: '排卵期',
        luteal: '黄体期'
      },
      en: {
        menstrual: 'Menstrual',
        follicular: 'Follicular',
        ovulation: 'Ovulation',
        luteal: 'Luteal'
      }
    };

    return labels[this.locale][phase as keyof typeof labels.zh] || phase;
  }

  /**
   * 获取中医性质标签
   */
  private getTCMNatureLabel(nature: string): string {
    const labels = {
      zh: {
        warm: '温性',
        cool: '凉性',
        neutral: '平性'
      },
      en: {
        warm: 'Warm',
        cool: 'Cool',
        neutral: 'Neutral'
      }
    };

    return labels[this.locale][nature as keyof typeof labels.zh] || nature;
  }

  /**
   * 生成PDF并下载
   */
  async generateAndDownloadPDF(data: PDFReportData): Promise<void> {
    const htmlContent = this.generateHTMLReport(data);

    // 创建新窗口显示HTML内容
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();

      // 等待内容加载完成后打印
      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
        }, 500);
      };
    }
  }

  /**
   * 生成PDF并跳转到下载中心
   */
  async generateAndRedirectToDownloads(data: PDFReportData): Promise<void> {
    const htmlContent = this.generateHTMLReport(data);

    // 创建blob URL
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // 跳转到下载中心并传递PDF数据
    const downloadUrl = `/${this.locale}/downloads?pdfData=${encodeURIComponent(JSON.stringify(data))}`;
    window.open(downloadUrl, '_blank');

    // 清理blob URL
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
