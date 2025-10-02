import React from 'react';
import { FAQSystem } from '@/components/faq/FAQSystem';

export default function FAQDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            FAQ系统演示
          </h1>
          <p className="text-gray-600">
            这是一个完整的FAQ系统实现，包含搜索、分类筛选和响应式设计
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 首页版本 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">首页版本</h2>
            <FAQSystem variant="home" locale="zh" />
          </div>

          {/* 综合版本 */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-center">综合版本</h2>
            <FAQSystem variant="comprehensive" locale="zh" />
          </div>
        </div>

        {/* 专家版本 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">专家版本</h2>
          <FAQSystem variant="expert" locale="zh" />
        </div>

        {/* 功能说明 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">功能特性</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4">
              <h4 className="font-medium text-gray-900 mb-2">🔍 智能搜索</h4>
              <p className="text-sm text-gray-600">支持中文模糊搜索，实时高亮搜索结果</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-medium text-gray-900 mb-2">📂 分类筛选</h4>
              <p className="text-sm text-gray-600">按类别快速筛选FAQ内容</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-medium text-gray-900 mb-2">📱 响应式设计</h4>
              <p className="text-sm text-gray-600">完美适配各种设备屏幕</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-medium text-gray-900 mb-2">♿ 无障碍访问</h4>
              <p className="text-sm text-gray-600">支持键盘导航和屏幕阅读器</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-medium text-gray-900 mb-2">🌐 国际化支持</h4>
              <p className="text-sm text-gray-600">支持中英文切换</p>
            </div>
            <div className="bg-white rounded p-4">
              <h4 className="font-medium text-gray-900 mb-2">⚡ 高性能</h4>
              <p className="text-sm text-gray-600">客户端搜索，响应速度<100ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}















