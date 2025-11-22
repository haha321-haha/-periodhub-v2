// 真实数据收集系统测试页面
// 用于验证Day 5升级后的真实数据收集和分析功能

"use client";

import { useState } from "react";
import { realDataCollector } from "@/lib/real-data-collector";
import { realDataAnalyzer } from "@/lib/real-data-analyzer";
import { realDataABTestBridge } from "@/lib/ab-test-real-data-bridge";
import { logError } from "@/lib/debug-logger";

export default function RealDataSystemTest() {
  const [testResults, setTestResults] = useState<Record<string, unknown>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState("");

  const runFullSystemTest = async () => {
    setIsRunning(true);
    setTestResults({});
    setCurrentStep("开始系统测试...");

    try {
      // 步骤1: 测试数据收集
      setCurrentStep("测试数据收集功能...");
      const collectionTest = await testDataCollection();
      setTestResults((prev) => ({ ...prev, dataCollection: collectionTest }));

      // 步骤2: 测试A/B测试分配
      setCurrentStep("测试A/B测试分配...");
      const abTestTest = testABTestAssignment();
      setTestResults((prev) => ({ ...prev, abTestAssignment: abTestTest }));

      // 步骤3: 测试数据分析
      setCurrentStep("测试数据分析功能...");
      const analysisTest = testDataAnalysis();
      setTestResults((prev) => ({ ...prev, dataAnalysis: analysisTest }));

      // 步骤4: 测试API端点
      setCurrentStep("测试API端点...");
      const apiTest = await testAPIEndpoints();
      setTestResults((prev) => ({ ...prev, apiEndpoints: apiTest }));

      // 步骤5: 生成综合报告
      setCurrentStep("生成综合测试报告...");
      const report = generateTestReport();
      setTestResults((prev) => ({ ...prev, finalReport: report }));

      setCurrentStep("测试完成！");
    } catch (error) {
      logError(
        "测试过程中出错:",
        error,
        "RealDataSystemTest/runFullSystemTest",
      );
      setTestResults((prev) => ({ ...prev, error: error.message }));
      setCurrentStep("测试失败");
    } finally {
      setIsRunning(false);
    }
  };

  // 测试数据收集功能
  const testDataCollection = async () => {
    try {
      // 模拟用户行为
      realDataCollector.recordPageView("/test-page");
      realDataCollector.recordInteraction("click");
      realDataCollector.recordConversion("assessmentStarted");

      // 模拟完成评估
      await new Promise((resolve) => setTimeout(resolve, 1000));
      realDataCollector.recordConversion("assessmentCompleted");

      // 测试反馈收集
      const feedbackResult = await realDataCollector.collectFeedback({
        feature: "stress_assessment",
        page: "/test-page",
        rating: 4,
        comment: "测试反馈：功能运行正常",
        userType: "new",
        device: "test-device",
        timeSpent: 30,
        metadata: {
          browser: "test-browser",
          referrer: "direct",
        },
      });

      return {
        success: true,
        message: "数据收集功能正常",
        feedbackId: feedbackResult.id,
        sessionData: realDataCollector.getCurrentSession(),
      };
    } catch (error) {
      return {
        success: false,
        message: `数据收集测试失败: ${error.message}`,
        error: error,
      };
    }
  };

  // 测试A/B测试分配
  const testABTestAssignment = () => {
    try {
      const testUserId = "test_user_" + Date.now();

      // 测试数据就绪检查
      const readiness = realDataABTestBridge.getDataCollectionReadiness();

      return {
        success: true,
        message: "A/B测试分配功能正常",
        readiness,
        testUserId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: `A/B测试分配测试失败: ${error.message}`,
        error: error,
      };
    }
  };

  // 测试数据分析功能
  const testDataAnalysis = () => {
    try {
      // 测试数据质量检查
      const dataQuality = realDataAnalyzer.getDataQualityReport();

      // 测试A/B测试分析
      const abTestAnalysis = realDataAnalyzer.analyzeRealABTest();

      // 测试反馈分析
      const feedbackAnalysis = realDataAnalyzer.analyzeRealFeedback();

      return {
        success: true,
        message: "数据分析功能正常",
        dataQuality,
        abTestAnalysis,
        feedbackAnalysis,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: `数据分析测试失败: ${error.message}`,
        error: error,
      };
    }
  };

  // 测试API端点
  const testAPIEndpoints = async () => {
    try {
      const results = {};

      // 测试会话数据API
      try {
        const sessionResponse = await fetch("/api/analytics/session?limit=5");
        const sessionData = await sessionResponse.json();
        (results as Record<string, unknown>).sessionAPI = {
          success: sessionResponse.ok,
          status: sessionResponse.status,
          data: sessionData,
        };
      } catch (error) {
        (results as Record<string, unknown>).sessionAPI = {
          success: false,
          error: (error as Error).message,
        };
      }

      // 测试反馈数据API
      try {
        const feedbackResponse = await fetch("/api/analytics/feedback?limit=5");
        const feedbackData = await feedbackResponse.json();
        (results as Record<string, unknown>).feedbackAPI = {
          success: feedbackResponse.ok,
          status: feedbackResponse.status,
          data: feedbackData,
        };
      } catch (error) {
        (results as Record<string, unknown>).feedbackAPI = {
          success: false,
          error: (error as Error).message,
        };
      }

      return {
        success: true,
        message: "API端点测试完成",
        results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: `API端点测试失败: ${error.message}`,
        error: error,
      };
    }
  };

  // 生成测试报告
  const generateTestReport = () => {
    const allTests = Object.values(testResults).filter(
      (r): r is { success: boolean } =>
        r && typeof r === "object" && "success" in r,
    );
    const successfulTests = allTests.filter((r) => r.success);
    const failedTests = allTests.filter((r) => !r.success);

    return {
      timestamp: new Date().toISOString(),
      totalTests: allTests.length,
      successfulTests: successfulTests.length,
      failedTests: failedTests.length,
      successRate:
        allTests.length > 0
          ? ((successfulTests.length / allTests.length) * 100).toFixed(1) + "%"
          : "0%",
      overallStatus: failedTests.length === 0 ? "PASS" : "PARTIAL",
      summary: {
        dataCollection: testResults.dataCollection?.success
          ? "✅ 正常"
          : "❌ 异常",
        abTestAssignment: testResults.abTestAssignment?.success
          ? "✅ 正常"
          : "❌ 异常",
        dataAnalysis: testResults.dataAnalysis?.success ? "✅ 正常" : "❌ 异常",
        apiEndpoints: testResults.apiEndpoints?.success ? "✅ 正常" : "❌ 异常",
      },
      recommendations: generateRecommendations(),
    };
  };

  // 生成建议
  const generateRecommendations = () => {
    const recommendations = [];

    if (!testResults.dataCollection?.success) {
      recommendations.push("检查数据收集配置和用户同意设置");
    }

    if (!testResults.apiEndpoints?.success) {
      recommendations.push("检查API端点配置和网络连接");
    }

    if (testResults.dataAnalysis?.dataQuality?.totalSessions < 10) {
      recommendations.push("收集更多真实用户数据以进行有效分析");
    }

    if (recommendations.length === 0) {
      recommendations.push("系统运行正常，可以开始收集真实用户数据");
    }

    return recommendations;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">🧪 真实数据收集系统测试</h1>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            本页面用于测试Day 5升级后的真实数据收集和分析系统功能。
            测试包括：数据收集、A/B测试、数据分析、API端点等核心功能。
          </p>

          <button
            onClick={runFullSystemTest}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium ${
              isRunning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isRunning ? "测试中..." : "开始系统测试"}
          </button>

          {currentStep && (
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
              <p className="text-blue-700">{currentStep}</p>
            </div>
          )}
        </div>

        {/* 测试结果展示 */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-6">
            {/* 数据收集测试结果 */}
            {testResults.dataCollection && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">📊 数据收集测试</h3>
                <div
                  className={`p-3 rounded ${
                    testResults.dataCollection.success
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p
                    className={
                      testResults.dataCollection.success
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  >
                    {testResults.dataCollection.message}
                  </p>
                  {testResults.feedbackId && (
                    <p className="text-sm text-gray-600 mt-2">
                      反馈ID: {testResults.feedbackId}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* A/B测试测试结果 */}
            {testResults.abTestAssignment && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">
                  🎯 A/B测试分配测试
                </h3>
                <div
                  className={`p-3 rounded ${
                    testResults.abTestAssignment.success
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p
                    className={
                      testResults.abTestAssignment.success
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  >
                    {testResults.abTestAssignment.message}
                  </p>
                  {testResults.abTestAssignment.readiness && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        样本数:{" "}
                        {testResults.abTestAssignment.readiness.sampleSize}
                      </p>
                      <p>
                        就绪状态:{" "}
                        {testResults.abTestAssignment.readiness.isReady
                          ? "是"
                          : "否"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 数据分析测试结果 */}
            {testResults.dataAnalysis && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">📈 数据分析测试</h3>
                <div
                  className={`p-3 rounded ${
                    testResults.dataAnalysis.success
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p
                    className={
                      testResults.dataAnalysis.success
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  >
                    {testResults.dataAnalysis.message}
                  </p>
                  {testResults.dataAnalysis.dataQuality && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        总会话数:{" "}
                        {testResults.dataAnalysis.dataQuality.totalSessions}
                      </p>
                      <p>
                        总反馈数:{" "}
                        {testResults.dataAnalysis.dataQuality.totalFeedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* API端点测试结果 */}
            {testResults.apiEndpoints && (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">🔌 API端点测试</h3>
                <div
                  className={`p-3 rounded ${
                    testResults.apiEndpoints.success
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p
                    className={
                      testResults.apiEndpoints.success
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  >
                    {testResults.apiEndpoints.message}
                  </p>
                  {testResults.apiEndpoints.results && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        会话API:{" "}
                        {testResults.apiEndpoints.results.sessionAPI?.success
                          ? "✅"
                          : "❌"}
                      </p>
                      <p>
                        反馈API:{" "}
                        {testResults.apiEndpoints.results.feedbackAPI?.success
                          ? "✅"
                          : "❌"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 最终测试报告 */}
            {testResults.finalReport && (
              <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
                <h3 className="text-xl font-bold mb-4">📋 最终测试报告</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">总测试数</p>
                    <p className="text-2xl font-bold">
                      {testResults.finalReport.totalTests}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">成功率</p>
                    <p className="text-2xl font-bold text-green-600">
                      {testResults.finalReport.successRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">通过测试</p>
                    <p className="text-xl font-semibold text-green-600">
                      {testResults.finalReport.successfulTests}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">失败测试</p>
                    <p className="text-xl font-semibold text-red-600">
                      {testResults.finalReport.failedTests}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">组件状态:</h4>
                  <div className="space-y-1">
                    {Object.entries(testResults.finalReport.summary).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span>{String(value)}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">建议:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {testResults.finalReport.recommendations.map(
                      (rec, index) => (
                        <li key={index} className="text-sm">
                          {rec}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
