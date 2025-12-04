# 🌐 翻译键管理流程文档

## 📋 目录

1. [概述](#概述)
2. [命名规范](#命名规范)
3. [开发流程](#开发流程)
4. [检查工具](#检查工具)
5. [修复流程](#修复流程)
6. [质量保障](#质量保障)

---

## 概述

本文档定义了翻译键的完整管理流程，确保：

- ✅ 所有文本使用翻译键，禁止硬编码
- ✅ 翻译键命名规范统一
- ✅ 中英文翻译键同步
- ✅ 类型安全
- ✅ 自动化检查

---

## 命名规范

### 1. 命名空间结构

```
{pageName}.{sectionName}.{keyName}
```

**示例**：

- `homePage.hero.title`
- `articles.painManagement.introduction`
- `interactiveTools.painTracker.startButton`
- `periodPainImpactCalculator.results.title`

### 2. 命名规则

#### 2.1 页面级别

- 使用 camelCase
- 与路由路径对应（去除 `/` 和 `-`）
- 示例：`period-pain-impact-calculator` → `periodPainImpactCalculator`

#### 2.2 区块级别

- 使用 camelCase
- 描述功能区块
- 示例：`hero`, `navigation`, `results`, `recommendations`

#### 2.3 键名级别

- 使用 camelCase
- 简洁明确
- 示例：`title`, `description`, `startButton`, `retakeAssessment`

### 3. 特殊命名

#### 3.1 通用键

放在 `common` 命名空间下：

```json
{
  "common": {
    "loading": "加载中...",
    "error": "错误",
    "submit": "提交",
    "cancel": "取消"
  }
}
```

#### 3.2 面包屑

放在 `interactiveTools.breadcrumb` 下：

```json
{
  "interactiveTools": {
    "breadcrumb": {
      "home": "首页",
      "interactiveTools": "互动工具",
      "painTracker": "痛经追踪器"
    }
  }
}
```

---

## 开发流程

### 步骤 1：添加新功能前

1. **确定命名空间**

   ```typescript
   // 如果是新页面
   const namespace = "newPageName";

   // 如果是现有页面的新功能
   const namespace = "existingPageName.newSection";
   ```

2. **规划翻译键结构**
   ```json
   {
     "newPageName": {
       "section1": {
         "title": "...",
         "description": "..."
       },
       "section2": {
         "title": "..."
       }
     }
   }
   ```

### 步骤 2：开发时

1. **使用翻译 Hook**

   ```tsx
   import { useTranslations } from "next-intl";

   const t = useTranslations("newPageName");

   return <h1>{t("section1.title")}</h1>;
   ```

2. **禁止硬编码**
   ❌ **错误**：

   ```tsx
   const isZh = locale === "zh";
   const title = isZh ? "标题" : "Title";
   ```

   ✅ **正确**：

   ```tsx
   const t = useTranslations("newPageName");
   const title = t("section1.title");
   ```

3. **同时添加中英文翻译**

   ```json
   // messages/zh.json
   {
     "newPageName": {
       "section1": {
         "title": "标题"
       }
     }
   }

   // messages/en.json
   {
     "newPageName": {
       "section1": {
         "title": "Title"
       }
     }
   }
   ```

### 步骤 3：提交前

1. **运行检查工具**

   ```bash
   # 检查翻译键同步
   npm run translations:check

   # 检查硬编码
   npm run translations:hardcode-check

   # 生成类型定义
   npm run translations:generate-types
   ```

2. **修复所有错误**
   - 缺失的翻译键
   - 硬编码字符串
   - 类型错误

---

## 检查工具

### 1. 翻译键同步检查

**工具**：`scripts/check-translation-sync.js`

**功能**：

- ✅ 检查中英文翻译键结构一致性
- ✅ 检测缺失的翻译键
- ✅ 生成详细报告

**使用**：

```bash
node scripts/check-translation-sync.js
```

### 2. 硬编码检测

**工具**：`scripts/enforce-translation-standards.js`

**功能**：

- ✅ 检测 `isZh ? ... : ...` 模式
- ✅ 检测中文字符串硬编码
- ✅ 检测英文字符串硬编码

**使用**：

```bash
node scripts/enforce-translation-standards.js
```

### 3. ESLint 规则

**文件**：`eslint-rules/enforce-translation-keys.js`

**功能**：

- ✅ 实时检查翻译键存在性
- ✅ IDE 中显示错误
- ✅ 提交前自动检查

**配置**：已在 `.eslintrc.js` 中配置

### 4. 类型生成

**工具**：`scripts/generate-translation-types.js`

**功能**：

- ✅ 自动生成 TypeScript 类型定义
- ✅ 提供类型安全
- ✅ 自动补全支持

**使用**：

```bash
npm run translations:generate-types
```

---

## 修复流程

### 场景 1：修复硬编码

1. **识别硬编码**

   ```tsx
   // ❌ 硬编码
   const title = locale === "zh" ? "标题" : "Title";
   ```

2. **添加翻译键**

   ```json
   // messages/zh.json
   {
     "pageName": {
       "title": "标题"
     }
   }

   // messages/en.json
   {
     "pageName": {
       "title": "Title"
     }
   }
   ```

3. **替换代码**

   ```tsx
   // ✅ 使用翻译键
   const t = useTranslations("pageName");
   const title = t("title");
   ```

4. **验证**
   ```bash
   npm run translations:check
   ```

### 场景 2：修复缺失的翻译键

1. **运行检查工具**

   ```bash
   node scripts/check-translation-sync.js
   ```

2. **查看报告**

   - 缺失的键列表
   - 所在文件位置

3. **添加翻译键**

   - 在 `messages/zh.json` 中添加中文
   - 在 `messages/en.json` 中添加英文

4. **验证**
   ```bash
   npm run translations:check
   ```

### 场景 3：修复命名不一致

1. **识别问题**

   - 命名空间不一致
   - 键名不规范

2. **统一命名**

   - 按照命名规范重命名
   - 更新所有引用

3. **验证**
   ```bash
   npm run translations:check
   npm run translations:generate-types
   ```

---

## 质量保障

### 1. 多层防护

```
第1层: IDE 实时检查 (ESLint)
  ↓ 开发者可能忽略

第2层: 保存时自动检查 (lint-staged)
  ↓ 开发者可能禁用

第3层: Git Pre-commit Hook
  ↓ 开发者可能 --no-verify

第4层: Git Pre-push Hook
  ↓ 开发者可能 --no-verify

第5层: CI/CD 检查 (GitHub Actions)
  ↓ 开发者无法绕过

第6层: 分支保护规则
  ↓ 管理员也无法绕过 ✅
```

### 2. 自动化检查

#### Pre-commit Hook

```bash
# .git/hooks/pre-commit
npm run translations:check
```

#### Pre-push Hook

```bash
# .git/hooks/pre-push
npm run translations:check
npm run translations:hardcode-check
```

#### CI/CD

```yaml
# .github/workflows/translations.yml
- name: Check Translation Keys
  run: npm run translations:check

- name: Check Hardcode
  run: npm run translations:hardcode-check
```

### 3. 代码审查清单

提交 PR 前检查：

- [ ] 所有文本使用翻译键
- [ ] 无 `isZh ? ... : ...` 模式
- [ ] 无中文字符串硬编码
- [ ] 无英文字符串硬编码
- [ ] 中英文翻译键同步
- [ ] 翻译键命名规范
- [ ] 类型定义已更新

---

## 快速参考

### 常用命令

```bash
# 检查翻译键同步
npm run translations:check

# 检查硬编码
npm run translations:hardcode-check

# 生成类型定义
npm run translations:generate-types

# 全面检查
npm run translations:all
```

### 常用模式

```tsx
// 1. 基本使用
const t = useTranslations("pageName");
<h1>{t("title")}</h1>;

// 2. 带参数
const t = useTranslations("pageName");
<p>{t("welcome", { name: "User" })}</p>;

// 3. 数组翻译
const t = useTranslations("pageName");
const items = t.raw("items") as string[];

// 4. 嵌套命名空间
const t = useTranslations("pageName.section");
<h2>{t("title")}</h2>;
```

---

## 相关文档

- [翻译系统使用指南](./TRANSLATION_SYSTEM_GUIDE.md)
- [翻译系统"防火"方案](../README_TRANSLATION_SYSTEM.md)
- [TypeScript 类型定义](../types/translations.d.ts)

---

## 更新日志

- 2025-01-XX: 创建文档
- 2025-01-XX: 添加命名规范
- 2025-01-XX: 添加修复流程
