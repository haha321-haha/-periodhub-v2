"use client";

import { useEffect } from "react";

export function PageRefreshTool() {
  useEffect(() => {
    // 检查页面是否卡死
    let lastActivity = Date.now();

    const checkActivity = () => {
      const now = Date.now();
      if (now - lastActivity > 30000) {
        // 30秒无活动
        console.warn("页面可能卡死，尝试恢复...");
        // 清理状态
        if (typeof window !== "undefined") {
          // 清理可能导致问题的状态
          const keysToRemove = ["partner-handbook-store"];
          keysToRemove.forEach((key) => {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.warn("清理状态失败:", e);
            }
          });
        }
      }
      lastActivity = now;
    };

    // 监听用户活动
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, () => {
        lastActivity = Date.now();
      });
    });

    // 定期检查
    const interval = setInterval(checkActivity, 10000);

    return () => {
      clearInterval(interval);
      events.forEach((event) => {
        document.removeEventListener(event, () => {});
      });
    };
  }, []);

  return null;
}
