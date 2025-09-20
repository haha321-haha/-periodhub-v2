# 站点地图优化实施检查清单

## 准备阶段 ✅

### 环境检查
- [ ] 确认当前站点地图正常工作
- [ ] 备份现有sitemap.ts文件
- [ ] 确认Search Console访问权限
- [ ] 准备监控工具

### 文件清单确认
**HTML文件** (13个中文 + 13个英文 = 26个):
- [ ] constitution-guide.html / constitution-guide-en.html
- [ ] parent-communication-guide.html / parent-communication-guide-en.html
- [ ] zhan-zhuang-baduanjin-illustrated-guide.html / zhan-zhuang-baduanjin-illustrated-guide-en.html
- [ ] teacher-collaboration-handbook.html / teacher-collaboration-handbook-en.html
- [ ] healthy-habits-checklist.html / healthy-habits-checklist-en.html
- [ ] specific-menstrual-pain-management-guide.html / specific-menstrual-pain-management-guide-en.html
- [ ] natural-therapy-assessment.html / natural-therapy-assessment-en.html
- [ ] menstrual-cycle-nutrition-plan.html / menstrual-cycle-nutrition-plan-en.html
- [ ] campus-emergency-checklist.html / campus-emergency-checklist-en.html
- [ ] menstrual-pain-complications-management.html / menstrual-pain-complications-management-en.html
- [ ] magnesium-gut-health-menstrual-pain-guide.html / magnesium-gut-health-menstrual-pain-guide-en.html
- [ ] pain-tracking-form.html / pain-tracking-form-en.html
- [ ] teacher-health-manual.html / teacher-health-manual-en.html

## Day 1-3: HTML页面优化（时间线调整）

### 任务1.1: rel="alternate"标记添加

**每个HTML文件需要添加的标记模板**:
```html
<!-- 在<head>部分，现有标记之后添加 -->
<!-- PDF版本引用 - 增强版 -->
<link rel="alternate" type="application/pdf" 
      href="/downloads/[filename].pdf" 
      title="PDF版本 - 适合打印和离线阅读"
      media="print">
<link rel="alternate" type="application/pdf" 
      href="/downloads/[filename]-en.pdf" 
      title="English PDF Version - Print and Offline Reading"
      hreflang="en" 
      media="print">

<!-- 搜索引擎优化标记 -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="googlebot" content="index, follow">
```

**检查清单**:
- [ ] constitution-guide.html - 标记已添加
- [ ] constitution-guide-en.html - 标记已添加
- [ ] parent-communication-guide.html - 标记已添加
- [ ] parent-communication-guide-en.html - 标记已添加
- [ ] zhan-zhuang-baduanjin-illustrated-guide.html - 标记已添加
- [ ] zhan-zhuang-baduanjin-illustrated-guide-en.html - 标记已添加
- [ ] teacher-collaboration-handbook.html - 标记已添加
- [ ] teacher-collaboration-handbook-en.html - 标记已添加
- [ ] healthy-habits-checklist.html - 标记已添加
- [ ] healthy-habits-checklist-en.html - 标记已添加
- [ ] specific-menstrual-pain-management-guide.html - 标记已添加
- [ ] specific-menstrual-pain-management-guide-en.html - 标记已添加
- [ ] natural-therapy-assessment.html - 标记已添加
- [ ] natural-therapy-assessment-en.html - 标记已添加
- [ ] menstrual-cycle-nutrition-plan.html - 标记已添加
- [ ] menstrual-cycle-nutrition-plan-en.html - 标记已添加
- [ ] campus-emergency-checklist.html - 标记已添加
- [ ] campus-emergency-checklist-en.html - 标记已添加
- [ ] menstrual-pain-complications-management.html - 标记已添加
- [ ] menstrual-pain-complications-management-en.html - 标记已添加
- [ ] magnesium-gut-health-menstrual-pain-guide.html - 标记已添加
- [ ] magnesium-gut-health-menstrual-pain-guide-en.html - 标记已添加
- [ ] pain-tracking-form.html - 标记已添加
- [ ] pain-tracking-form-en.html - 标记已添加
- [ ] teacher-health-manual.html - 标记已添加
- [ ] teacher-health-manual-en.html - 标记已添加

### 任务1.2: 结构化数据添加

**简化医疗内容Schema模板**（基于专家建议）:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "[文档标题]",
  "description": "[文档描述 - 50-160字符]",
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Patient"
  }
}
</script>
```

**渐进式复杂化策略**：
- **第1周**: 使用上述简化版本
- **第2周**: 根据初步反应考虑增加复杂性
- **避免**: 过度工程化导致的实施延误

**完整版本**（第2周可选）:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "[文档标题]",
  "description": "[文档描述]",
  "url": "https://www.periodhub.health/downloads/[filename].html",
  "inLanguage": "zh-CN",
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Patient"
  },
  "author": {
    "@type": "Organization",
    "name": "PeriodHub Health"
  },
  "dateModified": "2024-09-20"
}
</script>
```

**结构化数据检查清单**:
- [ ] 所有中文HTML文件 - Schema已添加
- [ ] 所有英文HTML文件 - Schema已添加 (inLanguage: "en-US")
- [ ] Schema验证通过 (使用Google Rich Results Test)

## Day 4-5: 站点地图优化（时间线调整）

### 任务2.1: sitemap.ts优化

**调整后的优先级策略**（基于专家建议）:
```typescript
// HTML文件优先级调整 - 避免优先级通胀
const htmlEntries: MetadataRoute.Sitemap = htmlFiles.map((html) => {
  const isChineseVersion = !html.includes('-en.html');
  const isHighPriority = html.includes('constitution-guide') || 
                         html.includes('pain-tracking-form') ||
                         html.includes('specific-menstrual-pain-management-guide');
  
  let priority = 0.7; // 基础优先级调整为0.7
  if (!isChineseVersion) priority = 0.75; // 英文版本稍高，但不超过0.8
  if (isHighPriority) priority = Math.min(priority + 0.05, 0.8); // 高优先级内容，最高0.8
  
  return {
    url: `${baseUrl}${html}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: priority, // 确保在0.7-0.8范围内
  };
});
```

**优先级层级结构**：
- **主页**: 1.0 (保持最高优先级)
- **主分类页面**: 0.9 (中间层级)
- **HTML医疗指南**: 0.7-0.8 (避免与主页竞争)
- **PDF文件**: 0.6 (保持现有优先级)

**站点地图检查清单**:
- [ ] HTML文件优先级已提升
- [ ] PDF文件优先级保持不变
- [ ] 站点地图生成测试通过
- [ ] 本地验证sitemap.xml格式正确

### 任务2.2: 站点地图元数据增强

**添加更多元数据**:
```typescript
// 为HTML文件添加更详细的元数据
const getChangeFrequency = (filename: string) => {
  if (filename.includes('constitution-guide') || filename.includes('pain-tracking-form')) {
    return 'weekly' as const;
  }
  return 'monthly' as const;
};

const getLastModified = (filename: string) => {
  // 根据文件类型返回不同的最后修改时间
  if (filename.includes('constitution-guide')) {
    return new Date('2024-09-15'); // 最近更新的内容
  }
  return currentDate;
};
```

## Day 6: 内部链接优化（时间线调整）

### 任务3.1: 下载页面链接结构优化

**app/[locale]/downloads/page.tsx 需要的修改**:

**HTML优先链接结构**:
```tsx
{/* 每个下载项目的优化结构 */}
<div className="download-item" itemScope itemType="https://schema.org/DigitalDocument">
  <h3 itemProp="name">
    <a href="/downloads/constitution-guide.html" 
       className="primary-link"
       itemProp="url">
      中医体质养生指南
    </a>
  </h3>
  <p className="description" itemProp="description">
    基于中医理论的个性化体质调理指南，帮助缓解月经疼痛
  </p>
  <div className="download-options">
    <a href="/downloads/constitution-guide.html" 
       className="html-version primary-cta"
       rel="bookmark">
      📖 在线阅读 (推荐)
    </a>
    <a href="/downloads/constitution-guide.pdf" 
       className="pdf-version secondary-cta"
       rel="alternate" 
       type="application/pdf"
       download>
      📄 PDF下载
    </a>
  </div>
  <div className="file-info">
    <span className="format">HTML + PDF</span>
    <span className="language">中文/English</span>
  </div>
</div>
```

**内部链接检查清单**:
- [ ] 下载页面HTML链接优先显示
- [ ] PDF链接包含正确的rel属性
- [ ] 结构化数据标记已添加
- [ ] 链接描述清晰明确

## Day 7: 测试与提交（时间线调整）

### 任务4.1: 技术验证

**本地测试清单**:
- [ ] 站点地图生成无错误
- [ ] HTML文件可正常访问
- [ ] PDF文件可正常下载
- [ ] rel="alternate"标记正确显示
- [ ] 结构化数据验证通过

**工具验证**:
- [ ] Google Rich Results Test - 所有HTML文件通过
- [ ] W3C Markup Validator - HTML语法正确
- [ ] 站点地图XML格式验证通过
- [ ] 页面加载速度测试通过

### 任务4.2: Search Console提交

**提交流程清单**:
- [ ] 登录Google Search Console
- [ ] 提交更新的站点地图
- [ ] 请求重新抓取关键HTML页面 (前5个优先级最高的)
- [ ] 设置监控提醒
- [ ] 记录提交时间和状态

**重点页面重新抓取**:
- [ ] /downloads/constitution-guide.html
- [ ] /downloads/constitution-guide-en.html
- [ ] /downloads/specific-menstrual-pain-management-guide.html
- [ ] /downloads/specific-menstrual-pain-management-guide-en.html
- [ ] /downloads/pain-tracking-form.html

## 监控设置

### 第一周监控指标
- [ ] HTML页面索引状态
- [ ] PDF文件索引状态变化
- [ ] 搜索印象数变化
- [ ] 点击率变化
- [ ] 下载流量变化

### 监控工具设置
- [ ] Google Search Console 监控设置
- [ ] Google Analytics 事件跟踪
- [ ] 服务器日志分析准备
- [ ] 每日检查提醒设置

## 应急预案

### 回滚准备
- [ ] 原始sitemap.ts文件已备份
- [ ] 原始HTML文件已备份
- [ ] 回滚脚本已准备
- [ ] 监控异常情况的阈值设定

### 问题处理
- [ ] 如果索引下降 > 10%，立即回滚
- [ ] 如果下载流量下降 > 15%，检查链接结构
- [ ] 如果出现404错误，立即修复
- [ ] 如果Search Console报错，优先处理

---

**完成标准**: 所有复选框都被勾选，且监控数据显示正常或改善趋势。