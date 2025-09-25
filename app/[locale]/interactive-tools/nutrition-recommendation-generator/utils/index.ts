/**
 * 营养推荐生成器 - 工具函数导出
 * 统一导出所有工具函数
 */

export {
  generateRecommendations,
  validateSelections,
  getRecommendationStats
} from './recommendationEngine';

export {
  aggregateRecommendations,
  formatResultsForDisplay,
  hasValidSelections,
  getNoSelectionMessage
} from './dataAggregator';

export {
  getUIContent,
  getUIContentObject
} from './uiContent';

export {
  PerformanceMonitor,
  debounce,
  throttle,
  lazyLoad,
  MemoryOptimizer,
  optimizeRender,
  batchUpdate
} from './performance';

export {
  WebVitalsMonitor,
  ErrorMonitor,
  UserBehaviorMonitor
} from './monitoring';

export {
  generateSEOMetadata,
  generateSitemap,
  generateRobotsTxt
} from './seo';

export {
  InputValidator,
  CSRFProtection,
  RateLimiter,
  generateSecurityHeaders,
  securityMiddleware
} from './security';

export {
  FinalValidator
} from './finalValidation';
