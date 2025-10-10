# PeriodHub 维护指南

## 📋 概述

本文档提供了PeriodHub网站维护的详细指南，包括SEO优化、重定向管理、错误监控等内容。

## 🔧 系统架构维护

### 1. 重定向系统

#### 维护文件
- `middleware.ts` - 多语言重定向处理
- `next.config.js` - Next.js重定向规则
- `test-multilang-redirects.sh` - 重定向测试脚本

#### 定期检查项目
- [ ] 验证所有重定向规则正常工作
- [ ] 测试多语言重定向准确性
- [ ] 检查重定向目标页面可访问性
- [ ] 监控重定向性能影响

#### 故障处理
```bash
# 测试重定向规则
./test-multilang-redirects.sh

# 手动测试特定重定向
curl -I -H "Accept-Language: zh-CN" https://www.periodhub.health/download-center
curl -I -H "Accept-Language: en-US" https://www.periodhub.health/download-center
```

### 2. SEO系统

#### 维护文件
- `app/sitemap.ts` - 站点地图生成
- `app/robots.ts` - 搜索引擎爬虫规则
- `lib/seo/canonical-url-utils.ts` - Canonical URL工具
- `scripts/fix-canonical-urls.js` - Canonical URL检查脚本

#### 定期检查项目
- [ ] 验证sitemap.xml可访问性
- [ ] 检查robots.txt配置正确性
- [ ] 运行canonical URL检查脚本
- [ ] 监控Google Search Console错误

#### 维护脚本
```bash
# 检查canonical URL配置
node scripts/fix-canonical-urls.js

# 验证sitemap
curl -s https://www.periodhub.health/sitemap.xml | head -20

# 检查robots.txt
curl -s https://www.periodhub.health/robots.txt
```

## 📊 监控和维护

### 1. Google Search Console监控

#### 关键指标
- **覆盖率报告**: 监控页面索引状态
- **重复内容警告**: 监控canonical URL问题
- **重定向错误**: 监控404和重定向问题
- **站点地图状态**: 监控sitemap提交和错误

#### 检查频率
- **每日**: 检查新增错误
- **每周**: 分析错误趋势
- **每月**: 全面SEO健康检查

#### 常见问题处理
```bash
# 重新提交sitemap
# 在Google Search Console中操作

# 请求页面重新索引
# 使用URL检查工具

# 检查canonical URL配置
node scripts/fix-canonical-urls.js
```

### 2. Vercel部署监控

#### 监控项目
- **部署状态**: 检查部署是否成功
- **构建日志**: 查看构建错误
- **性能指标**: 监控页面加载速度
- **错误日志**: 查看运行时错误

#### 检查命令
```bash
# 检查部署状态
vercel logs

# 测试页面可访问性
curl -I https://www.periodhub.health/zh/downloads/medication-guide
curl -I https://www.periodhub.health/en/downloads/medication-guide
```

### 3. 性能监控

#### 关键指标
- **页面加载速度**: LCP, FID, CLS
- **Core Web Vitals**: 用户体验指标
- **重定向性能**: 重定向延迟
- **缓存命中率**: CDN缓存效率

#### 优化策略
- 定期检查图片优化
- 监控JavaScript包大小
- 优化重定向规则性能
- 调整缓存策略

## 🚨 故障排除

### 1. 重定向问题

#### 症状
- 用户报告404错误
- Google Search Console显示重定向错误
- 页面无法正常访问

#### 诊断步骤
1. 检查Vercel部署日志
2. 测试重定向规则
3. 验证目标页面存在
4. 检查缓存状态

#### 解决方案
```bash
# 1. 测试重定向
./test-multilang-redirects.sh

# 2. 检查目标页面
curl -I https://www.periodhub.health/zh/downloads
curl -I https://www.periodhub.health/en/downloads

# 3. 清除缓存（如果需要）
# 在Vercel Dashboard重新部署
```

### 2. SEO问题

#### 症状
- Google Search Console报告重复内容
- 页面未被索引
- 搜索排名下降

#### 诊断步骤
1. 运行canonical URL检查
2. 验证sitemap配置
3. 检查robots.txt规则
4. 分析页面元数据

#### 解决方案
```bash
# 1. 检查canonical URL
node scripts/fix-canonical-urls.js

# 2. 验证sitemap
curl -s https://www.periodhub.health/sitemap.xml | grep medication-guide

# 3. 检查robots.txt
curl -s https://www.periodhub.health/robots.txt | grep -i disallow
```

### 3. 部署问题

#### 症状
- 构建失败
- 页面显示错误
- 功能异常

#### 诊断步骤
1. 检查构建日志
2. 验证环境变量
3. 测试本地构建
4. 检查依赖版本

#### 解决方案
```bash
# 1. 本地测试构建
npm run build

# 2. 检查环境变量
vercel env ls

# 3. 重新部署
git push origin main
```

## 📅 维护计划

### 日常维护（每日）
- [ ] 检查Google Search Console错误
- [ ] 监控Vercel部署状态
- [ ] 验证关键页面可访问性

### 周维护（每周）
- [ ] 运行重定向测试脚本
- [ ] 检查canonical URL配置
- [ ] 分析性能指标趋势

### 月维护（每月）
- [ ] 全面SEO健康检查
- [ ] 更新依赖包版本
- [ ] 备份重要配置文件
- [ ] 性能优化评估

### 季维护（每季度）
- [ ] 安全漏洞扫描
- [ ] 代码质量审计
- [ ] 用户体验评估
- [ ] 文档更新

## 🔐 安全维护

### 安全检查项目
- [ ] 依赖包安全漏洞
- [ ] 环境变量安全性
- [ ] API密钥轮换
- [ ] 访问日志分析

### 安全工具
```bash
# 检查依赖包漏洞
npm audit

# 修复安全漏洞
npm audit fix

# 检查过期依赖
npm outdated
```

## 📈 性能优化

### 优化策略
1. **图片优化**: 使用Next.js Image组件
2. **代码分割**: 动态导入大型组件
3. **缓存策略**: 优化静态资源缓存
4. **重定向优化**: 减少重定向链长度

### 监控工具
- Vercel Analytics
- Google PageSpeed Insights
- WebPageTest
- Lighthouse CI

## 📝 文档维护

### 需要更新的文档
- [ ] `REDIRECT_RULES_DOCUMENTATION.md` - 重定向规则变更
- [ ] `MAINTENANCE_GUIDE.md` - 维护流程更新
- [ ] `README.md` - 项目说明更新
- [ ] API文档 - 接口变更

### 文档更新流程
1. 记录变更原因
2. 更新相关文档
3. 通知团队成员
4. 版本控制提交

## 🆘 紧急联系

### 紧急情况处理
1. **服务中断**: 立即检查Vercel状态页面
2. **安全漏洞**: 立即修复并通知团队
3. **数据丢失**: 恢复备份并分析原因

### 联系信息
- **技术负责人**: [联系信息]
- **运维团队**: [联系信息]
- **安全团队**: [联系信息]

---

**文档版本**: 1.0  
**最后更新**: 2025-10-10  
**维护者**: Development Team  
**审核者**: Technical Lead
