# SEO关键页面硬编码修复 Spec

## 📋 项目概述

本项目旨在修复对SEO有直接影响的关键页面中的硬编码问题，采用优先级驱动的渐进式修复策略。

### 背景

- **历史遗留**: Phase 1和Phase 2已修复面包屑导航和核心组件（约554处），但页面内容硬编码（Phase 3）从未启动
- **问题规模**: 全站约2000+处硬编码，分布在96个文件中
- **修复策略**: 不是全部修复，而是聚焦于对SEO影响最大的元素

### 项目范围

**包含**:

- ✅ 页面元数据（title, description, keywords, OG标签）
- ✅ H1/H2/H3标题标签
- ✅ 首页和主要着陆页的关键内容
- ✅ 高流量页面的用户界面文本
- ✅ 按钮和CTA文本

**不包含**:

- ❌ 页面正文的医疗专业内容（可作为内容策略保持中文）
- ❌ 示例数据和占位符
- ❌ 低流量测试页面

---

## 🎯 项目目标

### 短期目标（2周）

- P0页面（3个）硬编码清零
- 自动化检测工具上线
- ESLint规则配置完成

### 中期目标（4周）

- P0和P1页面（7个）硬编码清零
- 语言切换功能测试通过率100%
- 新增硬编码数量为0

### 长期目标（8周）

- SEO关键元素硬编码清零率100%
- 搜索引擎索引多语言页面数量提升
- 用户语言切换使用率提升

---

## 📊 优先级分类

### P0 - 立即修复（Week 1）

1. **首页** `app/[locale]/page.tsx` - 3处硬编码
2. **Interactive Tools主页** - 20处硬编码
3. **Scenario Solutions主页** - 26处硬编码

**预计工作量**: 1周

### P1 - 高优先级（Week 2-3）

1. **Understanding Pain** - 153处硬编码
2. **Relief Methods** - 142处硬编码
3. **Commute场景** - 115处硬编码
4. **Emergency Kit场景** - 110处硬编码

**预计工作量**: 2-3周

### P2 - 中优先级（Week 4+）

- 其他Health Guide页面
- 其他Scenario Solutions页面
- Teen Health页面

**预计工作量**: 2-3周（可选，根据资源情况）

---

## 📁 文档结构

```
.kiro/specs/seo-critical-hardcode-fix/
├── README.md                 # 本文件 - 项目概述
├── requirements.md           # 需求文档 - 8个主要需求
├── design.md                 # 设计文档 - 技术设计和架构
└── tasks.md                  # 任务列表 - 42个可执行任务
```

---

## 🚀 快速开始

### 1. 查看需求文档

```bash
# 了解项目的8个主要需求
cat .kiro/specs/seo-critical-hardcode-fix/requirements.md
```

### 2. 查看设计文档

```bash
# 了解技术设计和实施策略
cat .kiro/specs/seo-critical-hardcode-fix/design.md
```

### 3. 开始执行任务

```bash
# 查看任务列表
cat .kiro/specs/seo-critical-hardcode-fix/tasks.md

# 从任务1开始：建立基础设施
# 在Kiro中打开tasks.md，点击"Start task"按钮
```

---

## 🛠️ 核心工具

### 1. 硬编码检测脚本

```bash
# 将在任务1.1中创建
node scripts/detect-seo-hardcode.js
```

### 2. ESLint规则

```bash
# 将在任务1.2中配置
npm run lint
```

### 3. Pre-commit Hook（可选）

```bash
# 将在任务1.4中配置
# 自动阻止包含硬编码的提交
```

---

## 📈 进度追踪

### 当前状态

- ✅ Spec文档创建完成
- ⏳ 等待开始执行任务

### 里程碑

- [ ] **Milestone 1**: 基础设施建立（任务1）
- [ ] **Milestone 2**: P0页面修复完成（任务2-5）
- [ ] **Milestone 3**: P1页面修复完成（任务6-10）
- [ ] **Milestone 4**: 持续监控机制建立（任务11）
- [ ] **Milestone 5**: 项目交付（任务12）

---

## 💡 关键原则

1. **SEO优先**: 优先修复直接影响搜索排名的元素
2. **渐进式**: 按P0/P1/P2优先级分阶段完成
3. **自动化**: 建立工具防止新增硬编码
4. **可维护**: 清晰的翻译键结构和命名规范
5. **测试驱动**: 每个阶段都有验证步骤

---

## 🔗 相关资源

### 现有文档

- `SITE_WIDE_HARDCODE_AUDIT_REPORT.md` - 全站硬编码审计报告
- `HARDCODE_SITUATION_DEEP_ANALYSIS.md` - 硬编码问题深度分析
- `.kiro/specs/pain-pattern-education-content/i18n-implementation-guide.md` - 国际化实施指南

### 翻译文件

- `messages/zh.json` - 中文翻译
- `messages/en.json` - 英文翻译

### 配置文件

- `.eslintrc.json` - ESLint配置
- `.eslintignore` - ESLint忽略规则

---

## 👥 团队协作

### 角色分工

- **开发团队**: 执行代码重构任务
- **内容团队**: 提供和审核翻译内容
- **QA团队**: 验证修复效果和语言切换功能
- **SEO团队**: 监控SEO指标变化

### 沟通机制

- 每周进度同步会议
- 每个阶段完成后的验收会议
- 问题和风险及时上报

---

## ⚠️ 风险和注意事项

### 主要风险

1. **翻译质量**: 需要专业翻译审核
2. **功能回归**: 需要完整的测试覆盖
3. **性能影响**: 需要监控翻译文件大小

### 缓解措施

- 建立翻译审核流程
- 灰度发布和快速回滚机制
- 性能测试和优化

---

## 📞 支持和反馈

如有问题或建议，请：

1. 查看设计文档中的故障排除部分
2. 参考国际化实施指南
3. 联系项目负责人

---

## 📝 更新日志

### 2025-10-06

- ✅ 创建项目spec
- ✅ 完成需求文档（8个主要需求）
- ✅ 完成设计文档（完整技术设计）
- ✅ 完成任务列表（42个可执行任务）
- ✅ 创建README文档

---

**项目状态**: 🟢 Ready to Start  
**预计完成时间**: 4-5周  
**优先级**: 🔴 High - SEO关键项目
