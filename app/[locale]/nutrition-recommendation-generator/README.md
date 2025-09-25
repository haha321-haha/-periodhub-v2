# 营养推荐生成器 - 基于ziV1d3d的Next.js集成

## 概述

本项目是基于ziV1d3d原始代码的Next.js集成版本，完美复用了ziV1d3d的所有功能和设计。

## 技术栈

- **Next.js 15** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式系统
- **next-intl** - 国际化
- **React Hooks** - 状态管理

## 项目结构

```
nutrition-recommendation-generator/
├── components/           # React组件
│   ├── NutritionGenerator.tsx    # 主组件
│   ├── NutritionApp.tsx          # 选择组件
│   ├── ResultsDisplay.tsx        # 结果展示
│   ├── LoadingState.tsx          # 加载状态
│   ├── NoSelectionState.tsx      # 无选择状态
│   ├── ErrorBoundary.tsx        # 错误边界
│   └── AccessibilityWrapper.tsx  # 可访问性包装器
├── data/                # 数据文件
│   └── nutritionRecommendations.ts  # 营养数据
├── utils/               # 工具函数
│   ├── recommendationEngine.ts   # 推荐引擎
│   ├── dataAggregator.ts         # 数据聚合器
│   ├── uiContent.ts              # UI内容
│   └── performance.ts            # 性能优化
├── styles/              # 样式文件
│   └── nutrition-generator.css   # 主样式
├── __tests__/           # 测试文件
│   └── integration.test.tsx      # 集成测试
└── types/               # 类型定义
    └── index.ts                  # 类型接口
```

## 核心功能

### 1. 完美复用ziV1d3d

- **数据结构** - 100%保持原始JSON结构
- **推荐算法** - 100%保持原始聚合逻辑
- **UI设计** - 100%保持原始视觉设计
- **交互逻辑** - 100%保持原始用户体验

### 2. 现代化改造

- **TypeScript** - 完整的类型安全
- **React Hooks** - 现代状态管理
- **组件化** - 模块化架构
- **国际化** - 多语言支持

### 3. 性能优化

- **性能监控** - 实时性能指标
- **防抖节流** - 优化用户交互
- **内存管理** - 智能缓存系统
- **懒加载** - 按需加载组件

### 4. 可访问性

- **键盘导航** - 完整的键盘支持
- **屏幕阅读器** - ARIA标签支持
- **焦点管理** - 智能焦点控制
- **高对比度** - 视觉辅助支持

### 5. 错误处理

- **错误边界** - 组件级错误捕获
- **优雅降级** - 错误状态处理
- **错误恢复** - 自动重试机制
- **错误日志** - 详细错误信息

## 使用方法

### 基本使用

```tsx
import NutritionGenerator from './components/NutritionGenerator';

function App() {
  return <NutritionGenerator />;
}
```

### 自定义配置

```tsx
import { NutritionGenerator } from './components';

function App() {
  return (
    <NutritionGenerator
      initialLanguage="zh"
      onError={(error) => console.error(error)}
    />
  );
}
```

### 性能监控

```tsx
import { PerformanceMonitor } from './utils';

const monitor = PerformanceMonitor.getInstance();
monitor.startMeasure('custom-operation');
// ... 执行操作
const duration = monitor.endMeasure('custom-operation');
```

## 测试

### 运行测试

```bash
npm test
```

### 测试覆盖

- **单元测试** - 组件功能测试
- **集成测试** - 完整流程测试
- **性能测试** - 性能指标测试
- **可访问性测试** - 无障碍功能测试

## 部署

### 构建

```bash
npm run build
```

### 部署到Vercel

```bash
vercel deploy
```

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 致谢

感谢ziV1d3d项目提供的原始代码和设计灵感。
