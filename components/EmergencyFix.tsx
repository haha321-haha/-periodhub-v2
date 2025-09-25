
'use client';

import { useState } from 'react';

export default function EmergencyFix() {
  const [isFixing, setIsFixing] = useState(false);
  
  const handleEmergencyFix = () => {
    setIsFixing(true);
    
    // 清理所有可能导致问题的数据
    if (typeof window !== 'undefined') {
      try {
        // 清理localStorage
        localStorage.clear();
        
        // 清理sessionStorage
        sessionStorage.clear();
        
        // 清理IndexedDB
        if ('indexedDB' in window) {
          indexedDB.databases().then(databases => {
            databases.forEach(db => {
              indexedDB.deleteDatabase(db.name);
            });
          });
        }
        
        console.log('✅ 紧急清理完成');
        
        // 延迟刷新页面
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        console.error('紧急修复失败:', error);
        setIsFixing(false);
      }
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleEmergencyFix}
        disabled={isFixing}
        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 disabled:opacity-50"
      >
        {isFixing ? '修复中...' : '紧急修复'}
      </button>
    </div>
  );
}
