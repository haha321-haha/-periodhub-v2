"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Brain,
  Users,
  Cloud,
  FileText,
  TrendingUp,
  Target,
  Award,
  Shield,
  Activity,
  Heart,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Settings,
  Download,
  Share2,
} from "lucide-react";

// 动态导入P2组件 - 代码分割优化
import dynamic from "next/dynamic";

const AnalyticsDashboard = dynamic(
  () => import("../shared/components/AnalyticsDashboard"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const PersonalizedRecommendationEngine = dynamic(
  () => import("../shared/components/PersonalizedRecommendationEngine"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const SocialFeatures = dynamic(
  () => import("../shared/components/SocialFeatures"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

const DataSync = dynamic(() => import("../shared/components/DataSync"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
});

const ReportGenerator = dynamic(
  () => import("../shared/components/ReportGenerator"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

interface P2AdvancedFeaturesProps {
  locale: string;
  userId?: string;
}

export default function P2AdvancedFeatures({
  locale,
  userId,
}: P2AdvancedFeaturesProps) {
  const t = useTranslations("interactiveTools");
  const [activeFeature, setActiveFeature] = useState<
    "analytics" | "ai" | "social" | "sync" | "reports"
  >("analytics");
  const [userProfile] = useState({
    id: userId || "demo-user",
    age: 28,
    cycleLength: 28,
    painLevel: 6.8,
    lifestyle: {
      exercise: "moderate" as const,
      stress: "moderate" as const,
      diet: "average" as const,
      sleep: "average" as const,
    },
    medicalHistory: [],
    preferences: {
      naturalRemedies: true,
      medications: true,
      lifestyleChanges: true,
      alternativeTherapies: true,
    },
  });

  const features = [
    {
      id: "analytics",
      title:
        locale === "zh" ? "数据分析与可视化" : "Data Analytics & Visualization",
      description:
        locale === "zh"
          ? "深入了解您的健康模式和趋势"
          : "Deep insights into your health patterns and trends",
      icon: BarChart3,
      color: "blue",
      stats: { charts: 5, insights: 12, accuracy: "95%" },
    },
    {
      id: "ai",
      title:
        locale === "zh" ? "AI个性化推荐" : "AI Personalized Recommendations",
      description:
        locale === "zh"
          ? "基于机器学习的智能建议系统"
          : "Machine learning-powered intelligent recommendation system",
      icon: Brain,
      color: "purple",
      stats: { algorithms: 8, accuracy: "92%", studies: 50 },
    },
    {
      id: "social",
      title: locale === "zh" ? "社交功能集成" : "Social Features Integration",
      description:
        locale === "zh"
          ? "与社区成员分享经验获得支持"
          : "Share experiences with community members and get support",
      icon: Users,
      color: "green",
      stats: { members: "10K+", posts: "5K+", groups: 25 },
    },
    {
      id: "sync",
      title: locale === "zh" ? "实时数据同步" : "Real-time Data Sync",
      description:
        locale === "zh"
          ? "跨设备安全同步您的健康数据"
          : "Securely sync your health data across devices",
      icon: Cloud,
      color: "indigo",
      stats: { devices: 3, uptime: "99.9%", security: "A+" },
    },
    {
      id: "reports",
      title: locale === "zh" ? "高级报告生成" : "Advanced Report Generation",
      description:
        locale === "zh"
          ? "生成专业的个人健康报告"
          : "Generate professional personal health reports",
      icon: FileText,
      color: "emerald",
      stats: { formats: 3, templates: 12, exports: "PDF/HTML" },
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      green: "from-green-500 to-green-600",
      indigo: "from-indigo-500 to-indigo-600",
      emerald: "from-emerald-500 to-emerald-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBgColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-50 to-blue-100",
      purple: "from-purple-50 to-purple-100",
      green: "from-green-50 to-green-100",
      indigo: "from-indigo-50 to-indigo-100",
      emerald: "from-emerald-50 to-emerald-100",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            {locale === "zh"
              ? "P2阶段：高级功能"
              : "P2 Phase: Advanced Features"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up">
            {locale === "zh"
              ? "体验下一代经期健康管理工具，包含AI智能分析、社交功能、实时同步和高级报告生成"
              : "Experience next-generation menstrual health management tools with AI analytics, social features, real-time sync, and advanced reporting"}
          </p>
        </div>

        {/* 功能导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.id;

              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id as any)}
                  className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${getColorClasses(
                          feature.color,
                        )} text-white shadow-lg`
                      : `bg-gradient-to-r ${getBgColorClasses(
                          feature.color,
                        )} text-gray-700 hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive ? "bg-white/20" : "bg-white/50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs opacity-80">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 功能统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeFeature === feature.id;

            return (
              <div
                key={feature.id}
                className={`rounded-lg p-4 transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${getColorClasses(
                        feature.color,
                      )} text-white shadow-lg transform scale-105`
                    : `bg-white border border-gray-200 hover:shadow-md`
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  />
                  {isActive && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <h4
                  className={`font-semibold text-sm mb-2 ${
                    isActive ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h4>
                <div className="space-y-1">
                  {Object.entries(feature.stats).map(([key, value]) => (
                    <div
                      key={key}
                      className={`text-xs ${
                        isActive ? "text-white/80" : "text-gray-600"
                      }`}
                    >
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 功能内容区域 */}
        <div className="animate-fade-in">
          {activeFeature === "analytics" && (
            <AnalyticsDashboard locale={locale} userId={userId} />
          )}

          {activeFeature === "ai" && (
            <PersonalizedRecommendationEngine
              locale={locale}
              userProfile={userProfile}
              assessmentHistory={[]}
            />
          )}

          {activeFeature === "social" && (
            <SocialFeatures locale={locale} userId={userId} />
          )}

          {activeFeature === "sync" && (
            <DataSync locale={locale} userId={userId} />
          )}

          {activeFeature === "reports" && (
            <ReportGenerator locale={locale} userId={userId} />
          )}
        </div>

        {/* 底部行动号召 */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              {locale === "zh"
                ? "准备体验完整功能？"
                : "Ready to experience the full features?"}
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {locale === "zh"
                ? "立即开始使用P2阶段的所有高级功能，获得更智能、更个性化的经期健康管理体验"
                : "Start using all P2 advanced features now for a smarter, more personalized menstrual health management experience"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                {locale === "zh" ? "立即开始" : "Get Started Now"}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                {locale === "zh" ? "分享给朋友" : "Share with Friends"}
              </button>
            </div>
          </div>
        </div>

        {/* 技术特性展示 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale === "zh" ? "企业级安全" : "Enterprise Security"}
            </h3>
            <p className="text-gray-600">
              {locale === "zh"
                ? "端到端加密，符合GDPR和HIPAA标准"
                : "End-to-end encryption, GDPR and HIPAA compliant"}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale === "zh" ? "实时性能" : "Real-time Performance"}
            </h3>
            <p className="text-gray-600">
              {locale === "zh"
                ? "毫秒级响应，99.9%可用性保证"
                : "Millisecond response time, 99.9% uptime guarantee"}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale === "zh" ? "科学验证" : "Scientifically Validated"}
            </h3>
            <p className="text-gray-600">
              {locale === "zh"
                ? "基于50+医学研究，92%准确率"
                : "Based on 50+ medical studies, 92% accuracy rate"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
