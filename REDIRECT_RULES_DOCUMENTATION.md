# 重定向规则文档

## 📋 概述

本文档记录了PeriodHub网站的所有重定向规则，包括配置位置、规则逻辑和维护说明。

## 🎯 重定向规则分类

### 1. 多语言重定向（middleware.ts处理）

**处理文件**: `middleware.ts`
**优先级**: 最高（在Next.js重定向规则之前执行）

#### 1.1 重复downloads页面重定向
```typescript
// 路径匹配
if (pathname === '/download-center' || pathname === '/downloads-new' || pathname === '/articles-pdf-center') {
  // 语言检测逻辑
  const acceptLanguage = request.headers.get('accept-language') || '';
  const isChinese = acceptLanguage.includes('zh');
  const redirectPath = isChinese ? '/zh/downloads' : '/en/downloads';
  // 301重定向
  return NextResponse.redirect(new URL(redirectPath, request.url), 301);
}
```

**重定向规则**:
- **中文用户** (`Accept-Language: zh*`):
  - `/download-center` → `/zh/downloads`
  - `/downloads-new` → `/zh/downloads`
  - `/articles-pdf-center` → `/zh/downloads`
- **英文用户** (默认):
  - `/download-center` → `/en/downloads`
  - `/downloads-new` → `/en/downloads`
  - `/articles-pdf-center` → `/en/downloads`

#### 1.2 其他中间件重定向
```typescript
// 青少年健康页面
'/teen-health' → '/zh/teen-health'

// 文章页面（基于语言检测）
'/articles' → '/zh/downloads' (中文用户)
'/articles' → '/en/downloads' (英文用户)

// 评估页面
'/zh/assessment' → '/zh/interactive-tools/symptom-assessment'
'/assessment' → '/en/interactive-tools/symptom-assessment'
```

### 2. Next.js重定向规则（next.config.js处理）

**处理文件**: `next.config.js`
**优先级**: 中等（在中间件之后执行）

#### 2.1 根路径重定向
```javascript
{
  source: '/',
  destination: '/zh',
  permanent: false  // 302临时重定向
}
```

#### 2.2 文章重定向
```javascript
// 中文用户文章重定向
{
  source: '/articles',
  has: [
    {
      type: 'header',
      key: 'accept-language',
      value: '.*zh.*',
    },
  ],
  destination: '/zh/downloads',
  permanent: true
},
// 英文用户文章重定向（默认）
{
  source: '/articles',
  destination: '/en/downloads',
  permanent: true
}
```

#### 2.3 页面重定向
```javascript
// 不存在的文章重定向
{
  source: '/zh/articles/pain-relief-methods',
  destination: '/zh/articles/5-minute-period-pain-relief',
  permanent: true
}

// 特殊疗法页面重定向
{
  source: '/zh/special-therapies',
  destination: '/zh/natural-therapies',
  permanent: true
}

// 理解周期页面重定向
{
  source: '/zh/articles/understanding-your-cycle',
  destination: '/zh/health-guide',
  permanent: true
}
```

## 🔧 技术实现细节

### 语言检测逻辑
```typescript
const acceptLanguage = request.headers.get('accept-language') || '';
const isChinese = acceptLanguage.includes('zh');
```

**检测规则**:
- 如果 `Accept-Language` 头部包含 `zh` → 中文用户
- 其他情况 → 英文用户（默认）

**支持的语言代码**:
- `zh`, `zh-CN`, `zh-TW`, `zh-HK` 等

### HTTP状态码使用
- **301 Permanent Redirect**: 用于永久重定向（页面迁移、URL结构变更）
- **302 Temporary Redirect**: 用于临时重定向（根路径重定向）

### 调试日志
```typescript
console.log(`[Middleware] Redirecting ${pathname} to ${redirectPath} (Accept-Language: ${acceptLanguage})`);
```

## 📊 重定向规则统计

### 按类型统计
- **多语言重定向**: 6个规则
- **页面迁移重定向**: 8个规则
- **URL结构修复**: 3个规则
- **总计**: 17个重定向规则

### 按文件统计
- **middleware.ts**: 6个规则
- **next.config.js**: 11个规则

## 🚨 维护注意事项

### 1. 规则优先级
1. **middleware.ts** (最高优先级)
2. **next.config.js redirects()**
3. **next.config.js rewrites()**

### 2. 性能考虑
- 中间件重定向在请求处理早期执行，性能最佳
- Next.js重定向规则在路由匹配时执行
- 避免复杂的正则表达式匹配

### 3. 缓存影响
- 301重定向会被浏览器和CDN缓存
- 修改重定向规则后需要等待缓存过期
- Vercel部署后通常需要1-2小时完全生效

### 4. SEO影响
- 301重定向传递SEO权重
- 确保重定向目标页面存在且可访问
- 避免重定向链（A→B→C）

## 🔍 测试和验证

### 测试脚本
使用 `test-multilang-redirects.sh` 脚本测试多语言重定向：

```bash
# 运行测试
./test-multilang-redirects.sh

# 手动测试示例
curl -I -H "Accept-Language: zh-CN" https://www.periodhub.health/download-center
curl -I -H "Accept-Language: en-US" https://www.periodhub.health/download-center
```

### 验证要点
1. **状态码**: 确认返回301或302
2. **目标URL**: 确认重定向到正确页面
3. **语言检测**: 确认多语言重定向正确
4. **页面可访问**: 确认目标页面存在

## 📝 修改记录

### 2025-10-10
- **问题**: 重复downloads路径导致404错误
- **修复**: 添加多语言重定向规则
- **影响**: 解决Google Search Console报告的错误

### 2025-10-10 (优化)
- **问题**: 硬编码中文语言前缀影响英文用户
- **修复**: 实现基于Accept-Language头部的智能重定向
- **影响**: 提升多语言用户体验

## 🎯 最佳实践

### 1. 添加新重定向规则
```javascript
// 在next.config.js中添加
{
  source: '/old-path',
  destination: '/new-path',
  permanent: true  // 或 false
}

// 或在middleware.ts中添加
if (pathname === '/old-path') {
  const redirectUrl = new URL('/new-path', request.url);
  return NextResponse.redirect(redirectUrl, 301);
}
```

### 2. 测试新规则
1. 本地测试: `npm run dev`
2. 部署测试: 推送到staging环境
3. 生产验证: 使用curl或浏览器测试

### 3. 监控重定向
1. **Google Search Console**: 监控404错误
2. **Vercel Analytics**: 查看重定向流量
3. **服务器日志**: 检查重定向执行情况

## 📞 故障排除

### 常见问题
1. **重定向不生效**: 检查规则优先级和缓存
2. **循环重定向**: 检查重定向链
3. **语言检测错误**: 检查Accept-Language头部

### 调试步骤
1. 检查Vercel部署日志
2. 使用curl测试重定向
3. 检查浏览器开发者工具
4. 查看服务器响应头

---

**文档版本**: 1.0  
**最后更新**: 2025-10-10  
**维护者**: Development Team
