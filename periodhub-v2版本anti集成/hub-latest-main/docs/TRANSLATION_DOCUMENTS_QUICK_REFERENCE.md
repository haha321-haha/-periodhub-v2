# 🚀 翻译系统文档快速参考

**最后更新：** 2025-01-19

---

## 📋 文档位置速查

### 核心文档（必读）

| 文档 | 位置 | 用途 |
|------|------|------|
| **总体方案** | `../../README_TRANSLATION_SYSTEM.md` | 了解"防火"方案和整体架构 |
| **使用指南** | `../../docs/TRANSLATION_SYSTEM_GUIDE.md` | 快速上手和常用命令 |
| **管理流程** | `docs/TRANSLATION_KEY_MANAGEMENT_PROCESS.md` | 命名规范和开发流程 |
| **最佳实践** | `../../docs/TRANSLATION_BEST_PRACTICES.md` | 学习最佳实践和常见模式 |
| **规范建议** | `../../docs/TRANSLATION_KEY_STANDARDIZATION_RECOMMENDATIONS.md` | 深入理解规范和改进建议 |
| **实施路线** | `../../docs/TRANSLATION_IMPLEMENTATION_ROADMAP.md` | 查看实施计划和执行步骤 |
| **文档索引** | `docs/TRANSLATION_SYSTEM_INDEX.md` | 完整文档体系导航 |

---

## 🎯 按场景查找

### 场景1：新开发者入门

**阅读顺序**：
1. `../../README_TRANSLATION_SYSTEM.md` - 了解整体架构
2. `../../docs/TRANSLATION_SYSTEM_GUIDE.md` - 学习基本使用
3. `docs/TRANSLATION_KEY_MANAGEMENT_PROCESS.md` - 掌握开发规范

### 场景2：开发新功能

**参考文档**：
- `docs/TRANSLATION_KEY_MANAGEMENT_PROCESS.md` - 命名规范
- `../../docs/TRANSLATION_BEST_PRACTICES.md` - 最佳实践

### 场景3：修复翻译问题

**参考文档**：
- `docs/TRANSLATION_KEY_MANAGEMENT_PROCESS.md` - 修复流程
- `../../docs/TRANSLATION_SYSTEM_GUIDE.md` - 工具使用

### 场景4：代码审查

**参考文档**：
- `../../docs/TRANSLATION_KEY_STANDARDIZATION_RECOMMENDATIONS.md` - 规范检查
- `../../docs/TRANSLATION_BEST_PRACTICES.md` - 最佳实践

---

## ⚡ 常用命令速查

### 开发前准备

```bash
# 设置 Git Hooks
npm run setup:hooks

# 生成翻译类型
npm run types:generate

# 检查翻译键同步
npm run translations:check
```

### 开发中检查

```bash
# 运行 ESLint
npm run lint

# 类型检查
npm run type-check

# 完整检查
npm run translations:validate
```

### 提交前验证

```bash
# 翻译键同步检查
npm run translations:check

# 生成类型并检查
npm run translations:validate

# 完整验证
npm run translations:full-check
```

---

## 📖 核心概念速查

### 命名规范

```
{pageName}.{sectionName}.{keyName}
```

**示例**：
- `homePage.hero.title`
- `interactiveTools.painTracker.title`
- `v2Home.hero.trust`

### 开发流程

1. **准备**：设置 Git Hooks，生成类型
2. **开发**：使用 `useTranslations` hook
3. **检查**：运行翻译键同步检查
4. **提交**：Git Hooks 自动验证

### 多层防护

1. IDE 实时检查 (ESLint)
2. 保存时自动检查 (lint-staged)
3. Git Pre-commit Hook
4. Git Pre-push Hook
5. CI/CD 检查
6. 分支保护规则

---

## 🔍 快速查找

### 我需要...

| 需求 | 查看文档 |
|------|---------|
| 了解整体架构 | `README_TRANSLATION_SYSTEM.md` |
| 学习如何使用 | `docs/TRANSLATION_SYSTEM_GUIDE.md` |
| 查看命名规范 | `docs/TRANSLATION_KEY_MANAGEMENT_PROCESS.md` |
| 学习最佳实践 | `docs/TRANSLATION_BEST_PRACTICES.md` |
| 查看实施计划 | `docs/TRANSLATION_IMPLEMENTATION_ROADMAP.md` |
| 深入理解规范 | `docs/TRANSLATION_KEY_STANDARDIZATION_RECOMMENDATIONS.md` |
| 查看完整索引 | `docs/TRANSLATION_SYSTEM_INDEX.md` |

---

## 💡 重要提示

1. **立即使用**：以整合后的文档作为开发标准
2. **检查规范**：开发前查看文档，确保符合规范
3. **避免修复**：遵循规范，避免因不规范导致的频繁修复
4. **持续改进**：参考最佳实践，持续优化代码质量

---

**提示**：所有路径相对于 `periodhub-v2版本anti集成/hub-latest-main/` 目录。

