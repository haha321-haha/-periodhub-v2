/**
 * Day 12: 性能测试框架
 * 基于HVsLYEp的性能需求，实现全面的性能测试和监控
 */

import { PerformanceMonitor, MemoryMonitor, ComponentCache } from './performanceOptimizer';

/**
 * 性能测试结果接口
 */
export interface PerformanceTestResult {
  testName: string;
  duration: number;
  memoryUsage: {
    before: number;
    after: number;
    delta: number;
  };
  success: boolean;
  error?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * 性能测试套件
 */
export class PerformanceTestSuite {
  private results: PerformanceTestResult[] = [];
  private isRunning = false;

  /**
   * 运行单个性能测试
   */
  async runTest(
    testName: string,
    testFunction: () => Promise<void> | void,
    metadata?: Record<string, any>
  ): Promise<PerformanceTestResult> {
    const startTime = Date.now();
    const memoryBefore = MemoryMonitor.getMemoryInfo();
    let success = true;
    let error: string | undefined;

    try {
      PerformanceMonitor.startMeasure(testName);

      if (testFunction instanceof Promise) {
        await testFunction();
      } else {
        testFunction();
      }

      PerformanceMonitor.endMeasure(testName);
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : String(err);
      console.error(`性能测试失败: ${testName}`, err);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const memoryAfter = MemoryMonitor.getMemoryInfo();

    const result: PerformanceTestResult = {
      testName,
      duration,
      memoryUsage: {
        before: memoryBefore?.usedJSHeapSize || 0,
        after: memoryAfter?.usedJSHeapSize || 0,
        delta: (memoryAfter?.usedJSHeapSize || 0) - (memoryBefore?.usedJSHeapSize || 0),
      },
      success,
      error,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.results.push(result);
    return result;
  }

  /**
   * 运行测试套件
   */
  async runTestSuite(tests: Array<{
    name: string;
    test: () => Promise<void> | void;
    metadata?: Record<string, any>;
  }>): Promise<PerformanceTestResult[]> {
    this.isRunning = true;
    this.results = [];

    console.log('🧪 开始运行性能测试套件...');

    for (const test of tests) {
      console.log(`🔍 运行测试: ${test.name}`);
      await this.runTest(test.name, test.test, test.metadata);
    }

    this.isRunning = false;
    console.log('✅ 性能测试套件完成');
    return this.results;
  }

  /**
   * 获取测试结果
   */
  getResults(): PerformanceTestResult[] {
    return [...this.results];
  }

  /**
   * 生成测试报告
   */
  generateReport(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const averageDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / totalTests;
    const totalMemoryDelta = this.results.reduce((sum, r) => sum + r.memoryUsage.delta, 0);

    const report = `
📊 性能测试报告
====================================
总测试数: ${totalTests}
通过测试: ${passedTests}
失败测试: ${failedTests}
成功率: ${((passedTests / totalTests) * 100).toFixed(2)}%
平均执行时间: ${averageDuration.toFixed(2)}ms
总内存变化: ${totalMemoryDelta} bytes

详细结果:
${this.results.map(r => `
✅ ${r.testName}
   执行时间: ${r.duration}ms
   内存变化: ${r.memoryUsage.delta} bytes
   状态: ${r.success ? '通过' : '失败'}
   ${r.error ? `错误: ${r.error}` : ''}
`).join('')}
====================================
    `;

    return report;
  }

  /**
   * 清理测试结果
   */
  clearResults(): void {
    this.results = [];
  }
}

/**
 * 组件渲染性能测试
 */
export class ComponentRenderTest {
  private static testSuite = new PerformanceTestSuite();

  /**
   * 测试组件渲染性能
   */
  static async testComponentRender(
    componentName: string,
    renderFunction: () => void,
    iterations: number = 100
  ): Promise<PerformanceTestResult> {
    return this.testSuite.runTest(
      `${componentName}-render-${iterations}iterations`,
      () => {
        for (let i = 0; i < iterations; i++) {
          renderFunction();
        }
      },
      { componentName, iterations }
    );
  }

  /**
   * 测试组件重新渲染性能
   */
  static async testComponentRerender(
    componentName: string,
    setupFunction: () => void,
    rerenderFunction: () => void,
    iterations: number = 50
  ): Promise<PerformanceTestResult> {
    return this.testSuite.runTest(
      `${componentName}-rerender-${iterations}iterations`,
      () => {
        setupFunction();
        for (let i = 0; i < iterations; i++) {
          rerenderFunction();
        }
      },
      { componentName, iterations }
    );
  }

  /**
   * 获取渲染测试结果
   */
  static getResults(): PerformanceTestResult[] {
    return this.testSuite.getResults();
  }

  /**
   * 生成渲染性能报告
   */
  static generateReport(): string {
    return this.testSuite.generateReport();
  }
}

/**
 * 状态管理性能测试
 */
export class StateManagementTest {
  private static testSuite = new PerformanceTestSuite();

  /**
   * 测试状态更新性能
   */
  static async testStateUpdate(
    updateFunction: () => void,
    iterations: number = 1000,
    testName: string = 'state-update'
  ): Promise<PerformanceTestResult> {
    return this.testSuite.runTest(
      `${testName}-${iterations}iterations`,
      () => {
        for (let i = 0; i < iterations; i++) {
          updateFunction();
        }
      },
      { iterations }
    );
  }

  /**
   * 测试状态订阅性能
   */
  static async testStateSubscription(
    subscribeFunction: () => () => void,
    iterations: number = 100,
    testName: string = 'state-subscription'
  ): Promise<PerformanceTestResult> {
    return this.testSuite.runTest(
      `${testName}-${iterations}iterations`,
      () => {
        const unsubscribeFunctions: (() => void)[] = [];
        for (let i = 0; i < iterations; i++) {
          unsubscribeFunctions.push(subscribeFunction());
        }
        // 清理订阅
        unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
      },
      { iterations }
    );
  }

  /**
   * 获取状态管理测试结果
   */
  static getResults(): PerformanceTestResult[] {
    return this.testSuite.getResults();
  }
}

/**
 * 内存性能测试
 */
export class MemoryPerformanceTest {
  private static testSuite = new PerformanceTestSuite();

  /**
   * 测试内存泄漏
   */
  static async testMemoryLeak(
    setupFunction: () => void,
    cleanupFunction: () => void,
    iterations: number = 10
  ): Promise<PerformanceTestResult> {
    return this.testSuite.runTest(
      `memory-leak-test-${iterations}iterations`,
      () => {
        for (let i = 0; i < iterations; i++) {
          setupFunction();
          cleanupFunction();
        }
      },
      { iterations }
    );
  }

  /**
   * 测试垃圾回收性能
   */
  static async testGarbageCollection(
    createObjectsFunction: () => void,
    iterations: number = 100
  ): Promise<PerformanceTestResult> {
    return this.testSuite.runTest(
      `garbage-collection-test-${iterations}iterations`,
      () => {
        for (let i = 0; i < iterations; i++) {
          createObjectsFunction();
          // 强制垃圾回收
          MemoryMonitor.forceGC();
        }
      },
      { iterations }
    );
  }

  /**
   * 获取内存测试结果
   */
  static getResults(): PerformanceTestResult[] {
    return this.testSuite.getResults();
  }
}

/**
 * 网络性能测试
 */
export class NetworkPerformanceTest {
  private static testSuite = new PerformanceTestSuite();

  /**
   * 测试API响应时间
   */
  static async testApiResponseTime(
    apiCall: () => Promise<any>,
    testName: string = 'api-response'
  ): Promise<PerformanceTestResult> {
    return this.testSuite.runTest(
      testName,
      async () => {
        await apiCall();
      },
      { type: 'api' }
    );
  }

  /**
   * 测试并发请求性能
   */
  static async testConcurrentRequests(
    apiCalls: (() => Promise<any>)[],
    testName: string = 'concurrent-requests'
  ): Promise<PerformanceTestResult> {
    return this.testSuite.runTest(
      testName,
      async () => {
        await Promise.all(apiCalls.map(call => call()));
      },
      { type: 'concurrent', requestCount: apiCalls.length }
    );
  }

  /**
   * 获取网络测试结果
   */
  static getResults(): PerformanceTestResult[] {
    return this.testSuite.getResults();
  }
}

/**
 * 综合性能测试运行器
 */
export class PerformanceTestRunner {
  private static instance: PerformanceTestRunner;
  private allResults: PerformanceTestResult[] = [];

  static getInstance(): PerformanceTestRunner {
    if (!this.instance) {
      this.instance = new PerformanceTestRunner();
    }
    return this.instance;
  }

  /**
   * 运行所有性能测试
   */
  async runAllTests(): Promise<PerformanceTestResult[]> {
    console.log('🚀 开始运行综合性能测试...');

    // 清理之前的结果
    this.allResults = [];
    PerformanceMonitor.clearMeasurements();

    try {
      // 运行组件渲染测试
      console.log('📱 运行组件渲染测试...');
      const renderResults = ComponentRenderTest.getResults();
      this.allResults.push(...renderResults);

      // 运行状态管理测试
      console.log('🏪 运行状态管理测试...');
      const stateResults = StateManagementTest.getResults();
      this.allResults.push(...stateResults);

      // 运行内存性能测试
      console.log('💾 运行内存性能测试...');
      const memoryResults = MemoryPerformanceTest.getResults();
      this.allResults.push(...memoryResults);

      // 运行网络性能测试
      console.log('🌐 运行网络性能测试...');
      const networkResults = NetworkPerformanceTest.getResults();
      this.allResults.push(...networkResults);

      console.log('✅ 所有性能测试完成');
      return this.allResults;

    } catch (error) {
      console.error('❌ 性能测试执行失败:', error);
      throw error;
    }
  }

  /**
   * 生成综合性能报告
   */
  generateComprehensiveReport(): string {
    const totalTests = this.allResults.length;
    const passedTests = this.allResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    const report = `
🎯 综合性能测试报告
====================================
测试时间: ${new Date().toLocaleString()}
总测试数: ${totalTests}
通过测试: ${passedTests}
失败测试: ${failedTests}
成功率: ${((passedTests / totalTests) * 100).toFixed(2)}%

性能指标:
- 平均执行时间: ${(this.allResults.reduce((sum, r) => sum + r.duration, 0) / totalTests).toFixed(2)}ms
- 总内存变化: ${this.allResults.reduce((sum, r) => sum + r.memoryUsage.delta, 0)} bytes
- 最大内存使用: ${Math.max(...this.allResults.map(r => r.memoryUsage.after))} bytes

详细结果:
${this.allResults.map(r => `
${r.success ? '✅' : '❌'} ${r.testName}
   执行时间: ${r.duration}ms
   内存变化: ${r.memoryUsage.delta} bytes
   时间戳: ${new Date(r.timestamp).toLocaleTimeString()}
   ${r.error ? `错误: ${r.error}` : ''}
`).join('')}
====================================
    `;

    return report;
  }

  /**
   * 导出测试结果为JSON
   */
  exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      totalTests: this.allResults.length,
      results: this.allResults,
    }, null, 2);
  }
}

// 导出所有测试工具
export default {
  PerformanceTestSuite,
  ComponentRenderTest,
  StateManagementTest,
  MemoryPerformanceTest,
  NetworkPerformanceTest,
  PerformanceTestRunner,
};

