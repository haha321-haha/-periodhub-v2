import React from 'react';
import PainPatternEducationContent from '../components/PainPatternEducationContent';

// This is an example of how to integrate the pain pattern education content
// into the existing understanding-pain page
export default function UnderstandingPainPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Existing page content would go here */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Existing content sections */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
              理解痛经
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              深入了解痛经的原因、类型和生理机制，为有效管理奠定科学基础。
            </p>
          </section>

          {/* Existing sections would be here */}
          {/* ... existing content ... */}

          {/* NEW: Pain Pattern Education Content */}
          <PainPatternEducationContent 
            className="mt-16"
            showInfluencingFactors={true}
            showOptimizationStrategies={true}
          />

          {/* Existing sections would continue here */}
          {/* ... more existing content ... */}
        </div>
      </div>
    </div>
  );
}