# 🌐 翻译键管理流程文档

**最后更新：** 2025-01-19  
**适用项目：** PeriodHub Next.js (hub-latest-main)  
**翻译系统：** next-intl

---

## 📋 目录

1. [概述](#概述)
2. [命名规范](#命名规范)
3. [开发流程](#开发流程)
4. [检查工具](#检查工具)
5. [修复流程](#修复流程)
6. [质量保障](#质量保障)
7. [快速参考](#快速参考)

---

## 概述

本文档定义了 PeriodHub 项目的翻译键完整管理流程，确保：
- ✅ 所有文本使用翻译键，禁止硬编码
- ✅ 翻译键命名规范统一（基于项目实际情况）
- ✅ 中英文翻译键同步
- ✅ 类型安全
- ✅ 自动化检查

### 核心原则

1. **基于项目实际情况**：命名规范反映项目真实使用情况
2. **渐进式改进**：不强制一次性修改所有历史代码
3. **新代码严格规范**：新功能必须遵循规范
4. **自动化优先**：使用工具自动检查，减少人工错误

---

## 命名规范

### 1. 命名空间结构

```
{pageName}.{sectionName}.{keyName}
```

**示例**：
- `v2Home.hero.title`
- `homePage.metadata.title`
- `interactiveTools.breadcrumb.home`
- `footer.links.tools.symptom_checker`

### 2. 命名规则（基于项目实际情况）

#### 2.1 页面级别命名空间

**规则**：
- 使用 **camelCase**（主要）
- 与路由路径对应（去除 `/` 和 `-`）
- 保持简洁明确

**示例**：
- `period-pain-impact-calculator` → `periodPainImpactCalculator`
- `interactive-tools` → `interactiveTools`
- `scenario-solutions` → `scenarioSolutions`

**特殊情况**：
- `v2Home` - 使用简写形式（已存在，保持一致性）
- `homePage` - 使用完整形式（已存在，保持一致性）

#### 2.2 区块级别（Section）

**规则**：
- 使用 **camelCase**（主要）
- 描述功能区块
- 保持简洁

**示例**：
- `hero`, `navigation`, `results`, `recommendations`
- `metadata`, `breadcrumb`, `footer`

#### 2.3 键名级别（Key）

**规则**：根据使用场景选择命名规范

**camelCase**（主要，用于一般键名）：
- `title`, `description`, `startButton`, `retakeAssessment`
- `activeUsers`, `userRating`, `medicalGuides`

**snake_case**（用于链接、导航等）：
- `symptom_checker`, `cycle_tracker`, `pain_diary`
- `natural_therapies`, `health_guide`, `get_started`
- `active_users`, `user_rating`, `hipaa_compliant`

**kebab-case**（用于 ID、路由标识等）：
- `pain-tracker`, `cycle-tracker`, `teen-zone`, `partner-zone`
- 主要用于需要与路由或常量 ID 匹配的场景

**命名规范选择指南**：

| 使用场景 | 命名规范 | 示例 |
|---------|---------|------|
| 一般文本键 | camelCase | `title`, `description`, `startButton` |
| 导航链接 | snake_case | `symptom_checker`, `cycle_tracker` |
| ID/路由标识 | kebab-case | `pain-tracker`, `teen-zone` |
| 统计数据 | snake_case | `active_users`, `user_rating` |
| 元数据 | camelCase | `ogTitle`, `twitterDescription` |

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

#### 3.3 元数据

放在 `{pageName}.metadata` 下：
```json
{
  "homePage": {
    "metadata": {
      "title": "...",
      "description": "...",
      "keywords": "..."
    }
  }
}
```

#### 3.4 Footer 链接

使用嵌套结构，链接键使用 snake_case：
```json
{
  "footer": {
    "links": {
      "tools": {
        "symptom_checker": "症状评估",
        "cycle_tracker": "周期追踪"
      },
      "resources": {
        "medical_guides": "医学指南"
      }
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
   const namespace = 'newPageName';  // camelCase
   
   // 如果是现有页面的新功能
   const namespace = 'existingPageName.newSection';  // camelCase
   ```

2. **规划翻译键结构**
   ```json
   {
     "newPageName": {
       "section1": {
         "title": "...",  // camelCase
         "description": "..."
       },
       "links": {
         "primary_link": "...",  // snake_case for links
         "secondary_link": "..."
       },
       "items": {
         "item-id-1": {  // kebab-case for IDs
           "title": "...",
           "description": "..."
         }
       }
     }
   }
   ```

3. **选择命名规范**
   - 一般键名 → camelCase
   - 链接/导航 → snake_case
   - ID/路由标识 → kebab-case

### 步骤 2：开发时

1. **使用翻译 Hook**

   **客户端组件**：
   ```tsx
   import { useTranslations } from 'next-intl';
   
   const t = useTranslations('newPageName');
   
   return <h1>{t('section1.title')}</h1>;
   ```

   **服务端组件**：
   ```tsx
   import { getTranslations } from 'next-intl/server';
   
   const t = await getTranslations({ locale, namespace: 'newPageName' });
   
   return <h1>{t('section1.title')}</h1>;
   ```

2. **禁止硬编码**

   ❌ **错误**：
   ```tsx
   const isZh = locale === 'zh';
   const title = isZh ? '标题' : 'Title';
   ```

   ✅ **正确**：
   ```tsx
   const t = useTranslations('newPageName');
   const title = t('section1.title');
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

4. **使用正确的命名规范**

   ```tsx
   // ✅ 正确：一般键名使用 camelCase
   t('section1.title')
   t('section1.startButton')
   
   // ✅ 正确：链接使用 snake_case
   t('links.primary_link')
   t('nav.natural_therapies')
   
   // ✅ 正确：ID 使用 kebab-case
   t('tools.pain-tracker.title')
   t('scenarios.teen-zone.title')
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
   - 命名不一致（仅新代码）

---

## 检查工具

### 1. 翻译键同步检查

**工具**：`scripts/check-translation-keys.js`

**功能**：
- ✅ 检查中英文翻译键结构一致性
- ✅ 检测缺失的翻译键
- ✅ 生成详细报告

**使用**：
```bash
node scripts/check-translation-keys.js
# 或
npm run translations:check
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
# 或
npm run translations:hardcode-check
```

### 3. ESLint 规则

**文件**：`eslint-rules/enforce-translation-keys.js`

**功能**：
- ✅ 实时检查翻译键存在性
- ✅ IDE 中显示错误
- ✅ 提交前自动检查

**配置**：已在 `.eslintrc.js` 中配置

### 4. 全面检查工具

**工具**：`scripts/comprehensive-translation-check.js`

**功能**：
- ✅ 综合检查翻译键同步
- ✅ 检查硬编码
- ✅ 生成完整报告

**使用**：
```bash
node scripts/comprehensive-translation-check.js
```

---

## 修复流程

### 场景 1：修复硬编码

1. **识别硬编码**
   ```tsx
   // ❌ 硬编码
   const title = locale === 'zh' ? '标题' : 'Title';
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
   const t = useTranslations('pageName');
   const title = t('title');
   ```

4. **验证**
   ```bash
   npm run translations:check
   ```

### 场景 2：修复缺失的翻译键

1. **运行检查工具**
   ```bash
   node scripts/check-translation-keys.js
   ```

2. **查看报告**
   - 缺失的键列表
   - 所在文件位置

3. **添加翻译键**
   - 在 `messages/zh.json` 中添加中文
   - 在 `messages/en.json` 中添加英文
   - 遵循命名规范

4. **验证**
   ```bash
   npm run translations:check
   ```

### 场景 3：修复命名不一致

**注意**：仅修复新代码或高优先级问题，不强制修改所有历史代码。

1. **识别问题**
   - 命名空间不一致
   - 键名不规范（仅新代码）

2. **统一命名**
   - 按照命名规范重命名
   - 更新所有引用
   - 更新翻译文件

3. **验证**
   ```bash
   npm run translations:check
   npm run translations:generate-types
   ```

---

## 质量保障

### 1. 多层防护体系

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
- [ ] 翻译键命名规范（新代码）
- [ ] 类型定义已更新（如适用）

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
// 1. 基本使用（客户端）
const t = useTranslations('pageName');
<h1>{t('title')}</h1>

// 2. 基本使用（服务端）
const t = await getTranslations({ locale, namespace: 'pageName' });
<h1>{t('title')}</h1>

// 3. 带参数
const t = useTranslations('pageName');
<p>{t('welcome', { name: 'User' })}</p>

// 4. 数组翻译
const t = useTranslations('pageName');
const items = t.raw('items') as string[];

// 5. 嵌套命名空间
const t = useTranslations('pageName.section');
<h2>{t('title')}</h2>

// 6. 访问嵌套键
const t = useTranslations('v2Home');
<h1>{t('privacy.title')}</h1>
<p>{t('privacy.features.local_storage.description')}</p>
```

### 命名规范快速参考

| 使用场景 | 命名规范 | 示例 |
|---------|---------|------|
| 一般文本键 | camelCase | `title`, `description`, `startButton` |
| 导航链接 | snake_case | `symptom_checker`, `cycle_tracker` |
| ID/路由标识 | kebab-case | `pain-tracker`, `teen-zone` |
| 统计数据 | snake_case | `active_users`, `user_rating` |
| 元数据 | camelCase | `ogTitle`, `twitterDescription` |

---

## 相关文档

- [翻译系统使用指南](./TRANSLATION_SYSTEM_GUIDE.md)
- [翻译系统"防火"方案](../../README_TRANSLATION_SYSTEM.md)
- [TypeScript 类型定义](../../types/translations.ts)

---

## 更新日志

- 2025-01-19: 创建文档，基于项目实际情况定义命名规范
- 2025-01-19: 明确命名规范使用场景和选择指南

---

## 注意事项

1. **历史代码兼容性**：不强制修改所有历史代码的命名规范，但新代码必须遵循规范
2. **渐进式改进**：逐步统一命名规范，优先修复高优先级问题
3. **工具优先**：使用自动化工具检查，减少人工错误
4. **文档同步**：更新代码时同步更新翻译文件和文档

---

**📝 文档维护者**：开发团队  
**📅 最后审核**：2025-01-19








