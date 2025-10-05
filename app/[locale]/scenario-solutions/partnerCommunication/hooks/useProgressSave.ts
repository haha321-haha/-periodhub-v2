/**
 * 进度保存Hook
 * 提供断点续测、自动保存等功能
 */

import { useEffect, useCallback, useRef } from "react";
import { usePartnerHandbookStore } from "../stores/partnerHandbookStore";
import { progressManager } from "../utils/progressManager";

export const useProgressSave = () => {
  const store = usePartnerHandbookStore();
  const lastSaveTime = useRef<Date>(new Date());
  const isSaving = useRef<boolean>(false);

  // 保存进度
  const saveProgress = useCallback(async () => {
    if (isSaving.current) return;

    try {
      isSaving.current = true;

      // 使用选择器获取当前状态
      const currentState = {
        stageProgress: store.stageProgress,
        currentStage: store.currentStage,
        overallResult: store.overallResult,
        userPreferences: store.userPreferences,
        lastVisitDate: store.lastVisitDate,
      };
      const success = progressManager.saveProgress(currentState);

      if (success) {
        lastSaveTime.current = new Date();
        console.log("💾 进度保存成功");
      }
    } catch (error) {
      console.error("❌ 进度保存失败:", error);
    } finally {
      isSaving.current = false;
    }
  }, [store]);

  // 加载进度
  const loadProgress = useCallback(() => {
    try {
      const success = progressManager.restoreProgress(store);
      if (success) {
        console.log("📂 进度加载成功");
        return true;
      }
    } catch (error) {
      console.error("❌ 进度加载失败:", error);
    }
    return false;
  }, [store]);

  // 清除进度
  const clearProgress = useCallback(() => {
    try {
      const success = progressManager.clearProgress();
      if (success) {
        // 重置store状态
        store.resetAllStages();
        console.log("🗑️ 进度清除成功");
      }
      return success;
    } catch (error) {
      console.error("❌ 进度清除失败:", error);
      return false;
    }
  }, [store]);

  // 检查断点续测
  const checkResumePoint = useCallback(() => {
    try {
      const resumePoint = progressManager.checkResumePoint();
      if (resumePoint) {
        console.log("🔄 发现断点续测点:", resumePoint);
        return resumePoint;
      }
    } catch (error) {
      console.error("❌ 检查断点续测失败:", error);
    }
    return null;
  }, []);

  // 导出进度
  const exportProgress = useCallback(() => {
    try {
      const exportData = progressManager.exportProgress();
      if (exportData) {
        // 创建下载链接
        const blob = new Blob([exportData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `partner-handbook-progress-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("📤 进度导出成功");
        return true;
      }
    } catch (error) {
      console.error("❌ 进度导出失败:", error);
    }
    return false;
  }, []);

  // 导入进度
  const importProgress = useCallback(
    (file: File) => {
      return new Promise<boolean>((resolve) => {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string;
              const success = progressManager.importProgress(content);
              if (success) {
                // 重新加载进度到store
                loadProgress();
                console.log("📥 进度导入成功");
              }
              resolve(success);
            } catch (error) {
              console.error("❌ 进度导入失败:", error);
              resolve(false);
            }
          };
          reader.onerror = () => {
            console.error("❌ 文件读取失败");
            resolve(false);
          };
          reader.readAsText(file);
        } catch (error) {
          console.error("❌ 进度导入失败:", error);
          resolve(false);
        }
      });
    },
    [loadProgress],
  );

  // 获取进度统计
  const getProgressStats = useCallback(() => {
    try {
      return progressManager.getProgressStats();
    } catch (error) {
      console.error("❌ 获取进度统计失败:", error);
      return null;
    }
  }, []);

  // 创建进度快照
  const createSnapshot = useCallback(() => {
    try {
      return progressManager.createSnapshot();
    } catch (error) {
      console.error("❌ 创建进度快照失败:", error);
      return null;
    }
  }, []);

  // 恢复进度快照
  const restoreSnapshot = useCallback(
    (snapshotData: string) => {
      try {
        const success = progressManager.restoreSnapshot(snapshotData);
        if (success) {
          loadProgress();
          console.log("🔄 进度快照恢复成功");
        }
        return success;
      } catch (error) {
        console.error("❌ 进度快照恢复失败:", error);
        return false;
      }
    },
    [loadProgress],
  );

  // 监听状态变化，自动保存
  useEffect(() => {
    // 注意：Zustand store不支持直接的subscribe方法
    // 这里使用定时器来定期检查状态变化
    const interval = setInterval(() => {
      const now = new Date();
      const timeSinceLastSave = now.getTime() - lastSaveTime.current.getTime();

      // 如果距离上次保存超过30秒，则保存
      if (timeSinceLastSave > 30000) {
        saveProgress();
      }
    }, 10000); // 每10秒检查一次

    return () => {
      clearInterval(interval);
    };
  }, [saveProgress]);

  // 页面卸载时保存进度
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveProgress]);

  // 页面可见性变化时保存进度
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveProgress();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [saveProgress]);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    checkResumePoint,
    exportProgress,
    importProgress,
    getProgressStats,
    createSnapshot,
    restoreSnapshot,
  };
};
