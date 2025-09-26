'use client';

export default function PeriodPainImpactCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-4">
            痛经影响算法 - 症状评估与职场分析完整解决方案
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            免费专业经期疼痛影响评估工具，科学评估痛经症状严重程度及对工作生活的影响，提供个性化建议和缓解方案，帮助女性科学管理经期健康。
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
              选择评估模式
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border-2 border-purple-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold mb-2">简化版</h3>
                <p className="text-sm text-neutral-600">快速评估, 适合一般用户</p>
              </div>
              
              <div className="border-2 border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">详细版</h3>
                <p className="text-sm text-neutral-600">全面评估, 提供详细建议</p>
              </div>
              
              <div className="border-2 border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">👩‍⚕️</div>
                <h3 className="text-lg font-semibold mb-2">医疗专业版</h3>
                <p className="text-sm text-neutral-600">专业评估, 包含临床指导</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                开始症状评估
              </button>
              <button className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                工作场所影响评估
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
