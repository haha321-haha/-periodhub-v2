/**
 * 无选择状态组件 - 基于ziV1d3d的displayNoSelectionMessage方法
 * 显示用户未选择任何选项时的提示
 */

'use client';

import type { Language } from '../types';
import { getUIContent } from '../utils/uiContent';

interface NoSelectionStateProps {
  language: Language;
}

export default function NoSelectionState({ language }: NoSelectionStateProps) {
  return (
    <div className="text-center p-8 bg-neutral-100 rounded-lg">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.571M15 6.343A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.571" />
        </svg>
      </div>
      <p className="font-medium text-neutral-600">
        {getUIContent('noSelection', language)}
      </p>
    </div>
  );
}
