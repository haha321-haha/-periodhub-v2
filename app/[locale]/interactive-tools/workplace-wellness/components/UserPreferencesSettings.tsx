"use client";

import { useState } from "react";
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Eye,
  Download,
  Save,
  RotateCcw,
  Database,
  Info,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import {
  useUserPreferences,
  useUserPreferencesActions,
  useCalendar,
} from "../hooks/useWorkplaceWellnessStore";
import { useTranslations } from "next-intl";
import {
  Theme,
  FontSize,
  DateFormat,
  TimeFormat,
  SettingsValidationResult,
} from "../types";
import { THEME_CONFIG, FONT_SIZE_CONFIG } from "../types/defaults";
import { PeriodRecord } from "../types";

// 数据保留设置组件
function DataRetentionSection({
  periodData,
  t,
  onNavigateToExport,
}: {
  periodData: PeriodRecord[];
  t: (key: string) => string;
  onNavigateToExport: () => void;
}) {
  const RETENTION_PERIOD_MONTHS = 6; // 6个月保留期限
  const WARNING_DAYS = 30; // 提前30天提醒

  // 计算数据统计
  const calculateStats = () => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - RETENTION_PERIOD_MONTHS);
    const warningDate = new Date();
    warningDate.setMonth(warningDate.getMonth() - (RETENTION_PERIOD_MONTHS * 30 - WARNING_DAYS) / 30);

    const allRecords = periodData || [];
    const validRecords = allRecords.filter((r) => {
      try {
        const recordDate = new Date(r.date);
        return recordDate >= sixMonthsAgo;
      } catch {
        return false;
      }
    });

    const expiringRecords = allRecords.filter((r) => {
      try {
        const recordDate = new Date(r.date);
        return recordDate < warningDate && recordDate >= sixMonthsAgo;
      } catch {
        return false;
      }
    });

    const oldestRecord = validRecords.length > 0
      ? validRecords.reduce((oldest, current) => {
          const currentDate = new Date(current.date);
          const oldestDate = new Date(oldest.date);
          return currentDate < oldestDate ? current : oldest;
        })
      : null;

    // 估算存储大小（粗略估算）
    const estimatedSize = JSON.stringify(allRecords).length / 1024; // KB

    return {
      totalRecords: allRecords.length,
      validRecords: validRecords.length,
      expiringRecords: expiringRecords.length,
      oldestRecord,
      estimatedSize: estimatedSize.toFixed(2),
    };
  };

  const stats = calculateStats();

  // 格式化日期
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 计算距离过期天数
  const getDaysUntilExpiry = (recordDate: Date) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - RETENTION_PERIOD_MONTHS);
    const diffTime = recordDate.getTime() - sixMonthsAgo.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          {t("userPreferences.dataRetention") || "数据保留设置"}
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          {t("userPreferences.dataRetentionDescription") ||
            "为保证最佳性能，我们自动保留最近的数据，旧数据将被清理"}
        </p>
      </div>

      {/* 数据保留期限说明 */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-700 font-medium mb-1">
              {t("userPreferences.retentionPolicy") ||
                "数据保留期限"}
            </p>
            <p className="text-sm text-blue-600">
              {t("userPreferences.retentionPolicyDescription") ||
                `为保证最佳性能，我们保留最近 ${RETENTION_PERIOD_MONTHS} 个月的数据。超过 ${RETENTION_PERIOD_MONTHS} 个月的旧数据将被自动清理。您可以随时导出数据以保留完整历史记录。`}
            </p>
          </div>
        </div>
      </div>

      {/* 数据即将过期提醒 */}
      {stats.expiringRecords > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-yellow-700 font-medium mb-1">
                {t("userPreferences.expiringDataWarning") ||
                  "数据即将过期提醒"}
              </p>
              <p className="text-sm text-yellow-600 mb-3">
                {(t("userPreferences.expiringDataDescription") ||
                  `您有 {count} 条记录将在 30 天后自动清理。建议导出备份以保留完整历史记录。`).replace('{count}', stats.expiringRecords.toString())}
              </p>
              <button
                onClick={onNavigateToExport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Download size={16} />
                {t("userPreferences.exportNow") || "立即导出备份"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 当前数据状态 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-neutral-700 mb-4">
          {t("userPreferences.currentDataStatus") || "当前数据状态"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">
              {t("userPreferences.totalRecords") || "总记录数"}
            </span>
            <span className="text-sm font-medium text-neutral-800">
              {stats.totalRecords} {t("userPreferences.records") || "条"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">
              {t("userPreferences.validRecords") || "有效记录数"}
            </span>
            <span className="text-sm font-medium text-neutral-800">
              {stats.validRecords} {t("userPreferences.records") || "条"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">
              {t("userPreferences.oldestRecord") || "最早记录"}
            </span>
            <span className="text-sm font-medium text-neutral-800">
              {stats.oldestRecord
                ? formatDate(new Date(stats.oldestRecord.date))
                : "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">
              {t("userPreferences.storageSize") || "存储大小"}
            </span>
            <span className="text-sm font-medium text-neutral-800">
              {stats.estimatedSize} KB
            </span>
          </div>
        </div>
      </div>

      {/* 导出数据按钮 */}
      <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-primary-900 mb-1">
            {t("userPreferences.exportAllData") || "导出所有数据"}
          </p>
          <p className="text-xs text-primary-700">
            {t("userPreferences.exportAllDataDescription") ||
              "导出所有数据以保留完整历史记录，支持 JSON、CSV、PDF 等格式"}
          </p>
        </div>
        <button
          onClick={onNavigateToExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download size={16} />
          {t("userPreferences.export") || "导出"}
        </button>
      </div>

      {/* 数据保留期限说明 */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-3">
          {t("userPreferences.retentionDetails") || "数据保留详情"}
        </h4>
        <div className="space-y-2 text-sm text-neutral-600">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 mt-0.5 text-neutral-400" />
            <div>
              <p className="font-medium text-neutral-700">
                {t("userPreferences.retentionPeriod") || "保留期限"}
              </p>
              <p>
                {t("userPreferences.retentionPeriodDescription") ||
                  `最近 ${RETENTION_PERIOD_MONTHS} 个月的数据将被保留，超过此期限的数据将被自动清理。`}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-neutral-400" />
            <div>
              <p className="font-medium text-neutral-700">
                {t("userPreferences.exportRecommendation") || "导出建议"}
              </p>
              <p>
                {t("userPreferences.exportRecommendationDescription") ||
                  "建议定期导出数据以保留完整历史记录。导出的数据可以随时导入或查看。"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserPreferencesSettings() {
  const preferences = useUserPreferences();
  const calendar = useCalendar();
  const {
    updateUserPreferences,
    setTheme,
    setFontSize,
    toggleAnimations,
    toggleCompactMode,
    updateNotificationSettings,
    updatePrivacySettings,
    updateAccessibilitySettings,
    validateSettings,
    resetPreferences,
  } = useUserPreferencesActions();

  const t = useTranslations("workplaceWellness");
  const [activeTab, setActiveTab] = useState<
    "ui" | "notifications" | "privacy" | "accessibility" | "export" | "dataRetention"
  >("ui");
  const [validationResult, setValidationResult] =
    useState<SettingsValidationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 验证设置
  const handleValidateSettings = () => {
    const result = validateSettings();
    setValidationResult(result);
    return result.isValid;
  };

  // 保存设置
  const handleSaveSettings = async () => {
    setIsSaving(true);

    // 验证设置
    if (!handleValidateSettings()) {
      setIsSaving(false);
      return;
    }

    try {
      // 模拟保存延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 更新最后修改时间
      updateUserPreferences({
        lastUpdated: new Date().toISOString(),
      });

      // eslint-disable-next-line no-console
      console.log("Settings saved successfully");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 重置设置
  const handleResetSettings = () => {
    if (
      window.confirm(
        t("userPreferences.resetConfirm") || "确定要重置所有设置吗？",
      )
    ) {
      resetPreferences();
      setValidationResult(null);
    }
  };

  const tabs = [
    { id: "ui", name: t("userPreferences.uiPreferences"), icon: Palette },
    {
      id: "notifications",
      name: t("userPreferences.notificationSettings"),
      icon: Bell,
    },
    { id: "privacy", name: t("userPreferences.privacySettings"), icon: Shield },
    {
      id: "accessibility",
      name: t("userPreferences.accessibilitySettings"),
      icon: Eye,
    },
    {
      id: "export",
      name: t("userPreferences.exportPreferences"),
      icon: Download,
    },
    {
      id: "dataRetention",
      name: t("userPreferences.dataRetention") || "数据保留",
      icon: Database,
    },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">
            {t("userPreferences.title")}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleResetSettings}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            {t("userPreferences.reset") || "重置"}
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {isSaving
              ? t("userPreferences.saving") || "保存中..."
              : t("userPreferences.save") || "保存"}
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex space-x-1 mb-6 bg-neutral-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  activeTab === tab.id
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
                }
              `}
            >
              <Icon size={16} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {/* 界面偏好设置 */}
        {activeTab === "ui" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-800">
              {t("userPreferences.uiPreferences")}
            </h3>

            {/* 主题设置 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t("userPreferences.theme")}
                </label>
                <select
                  value={preferences.ui.theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.keys(THEME_CONFIG).map((key) => (
                    <option key={key} value={key}>
                      {t(`themeConfig.${key}.name`)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  {t(`themeConfig.${preferences.ui.theme}.description`)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t("userPreferences.fontSize")}
                </label>
                <select
                  value={preferences.ui.fontSize}
                  onChange={(e) => setFontSize(e.target.value as FontSize)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.keys(FONT_SIZE_CONFIG).map((key) => (
                    <option key={key} value={key}>
                      {t(`fontSizeConfig.${key}.name`)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  {t(`fontSizeConfig.${preferences.ui.fontSize}.description`)}
                </p>
              </div>
            </div>

            {/* 其他UI设置 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      {t("userPreferences.animations")}
                    </label>
                    <p className="text-xs text-neutral-500">
                      {t("descriptions.animations")}
                    </p>
                  </div>
                  <button
                    onClick={toggleAnimations}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${
                        preferences.ui.animations
                          ? "bg-primary-600"
                          : "bg-neutral-300"
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          preferences.ui.animations
                            ? "translate-x-6"
                            : "translate-x-1"
                        }
                      `}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      {t("userPreferences.compactMode")}
                    </label>
                    <p className="text-xs text-neutral-500">
                      {t("descriptions.compactMode")}
                    </p>
                  </div>
                  <button
                    onClick={toggleCompactMode}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${
                        preferences.ui.compactMode
                          ? "bg-primary-600"
                          : "bg-neutral-300"
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          preferences.ui.compactMode
                            ? "translate-x-6"
                            : "translate-x-1"
                        }
                      `}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("userPreferences.dateFormat")}
                  </label>
                  <select
                    value={preferences.ui.dateFormat}
                    onChange={(e) =>
                      updateUserPreferences({
                        ui: {
                          ...preferences.ui,
                          dateFormat: e.target.value as DateFormat,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t("userPreferences.timeFormat")}
                  </label>
                  <select
                    value={preferences.ui.timeFormat}
                    onChange={(e) =>
                      updateUserPreferences({
                        ui: {
                          ...preferences.ui,
                          timeFormat: e.target.value as TimeFormat,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="24h">{t("timeFormatConfig.24h")}</option>
                    <option value="12h">{t("timeFormatConfig.12h")}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 通知设置 */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-800">
              {t("userPreferences.notificationSettings")}
            </h3>

            {/* 通知开关 */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  {t("userPreferences.notifications")}
                </label>
                <p className="text-xs text-neutral-500">
                  {t("descriptions.notifications")}
                </p>
              </div>
              <button
                onClick={() =>
                  updateNotificationSettings({
                    enabled: !preferences.notifications.enabled,
                  })
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${
                    preferences.notifications.enabled
                      ? "bg-primary-600"
                      : "bg-neutral-300"
                  }
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${
                      preferences.notifications.enabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }
                  `}
                />
              </button>
            </div>

            {preferences.notifications.enabled && (
              <div className="space-y-6">
                {/* 通知类型 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    通知类型
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(preferences.notifications.types).map(
                      ([type, enabled]) => (
                        <div
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-neutral-700">
                            {t(`notificationTypes.${type}`) || type}
                          </span>
                          <button
                            onClick={() =>
                              updateNotificationSettings({
                                types: {
                                  ...preferences.notifications.types,
                                  [type]: !enabled,
                                },
                              })
                            }
                            className={`
                            relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                            ${enabled ? "bg-primary-600" : "bg-neutral-300"}
                          `}
                          >
                            <span
                              className={`
                              inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                              ${enabled ? "translate-x-5" : "translate-x-1"}
                            `}
                            />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* 通知渠道 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    通知渠道
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(preferences.notifications.channels).map(
                      ([channel, enabled]) => (
                        <div
                          key={channel}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-neutral-700">
                            {t(`notificationChannels.${channel}`) || channel}
                          </span>
                          <button
                            onClick={() =>
                              updateNotificationSettings({
                                channels: {
                                  ...preferences.notifications.channels,
                                  [channel]: !enabled,
                                },
                              })
                            }
                            className={`
                            relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                            ${enabled ? "bg-primary-600" : "bg-neutral-300"}
                          `}
                          >
                            <span
                              className={`
                              inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                              ${enabled ? "translate-x-5" : "translate-x-1"}
                            `}
                            />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* 提醒时间 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t("userPreferences.reminderTime")}
                    </label>
                    <input
                      type="time"
                      value={preferences.notifications.reminderTime}
                      onChange={(e) =>
                        updateNotificationSettings({
                          reminderTime: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      提醒频率
                    </label>
                    <select
                      value={preferences.notifications.frequency}
                      onChange={(e) =>
                        updateNotificationSettings({
                          frequency: e.target.value as
                            | "immediate"
                            | "daily"
                            | "weekly",
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="immediate">
                        {t("frequencyConfig.immediate")}
                      </option>
                      <option value="daily">
                        {t("frequencyConfig.daily")}
                      </option>
                      <option value="weekly">
                        {t("frequencyConfig.weekly")}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 隐私设置 */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-800">
              {t("userPreferences.privacySettings")}
            </h3>

            <div className="space-y-4">
              {Object.entries(preferences.privacy).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                >
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      {t(`userPreferences.${key}`) || key}
                    </label>
                    <p className="text-xs text-neutral-500">
                      {key === "dataRetention" ? `${value}天` : ""}
                    </p>
                  </div>
                  {typeof value === "boolean" ? (
                    <button
                      onClick={() =>
                        updatePrivacySettings({ [key]: !value } as Record<
                          string,
                          boolean
                        >)
                      }
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${value ? "bg-primary-600" : "bg-neutral-300"}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${value ? "translate-x-6" : "translate-x-1"}
                        `}
                      />
                    </button>
                  ) : (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        updatePrivacySettings({
                          [key]: parseInt(e.target.value),
                        } as Record<string, number>)
                      }
                      className="w-20 px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="30"
                      max="3650"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 无障碍设置 */}
        {activeTab === "accessibility" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-800">
              {t("userPreferences.accessibilitySettings")}
            </h3>

            <div className="space-y-4">
              {Object.entries(preferences.accessibility).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                >
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      {t(`userPreferences.${key}`) || key}
                    </label>
                    <p className="text-xs text-neutral-500">
                      {key === "textScaling" ? `${value}x` : ""}
                    </p>
                  </div>
                  {typeof value === "boolean" ? (
                    <button
                      onClick={() =>
                        updateAccessibilitySettings({ [key]: !value } as Record<
                          string,
                          boolean
                        >)
                      }
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${value ? "bg-primary-600" : "bg-neutral-300"}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${value ? "translate-x-6" : "translate-x-1"}
                        `}
                      />
                    </button>
                  ) : (
                    <input
                      type="range"
                      min="0.8"
                      max="2.0"
                      step="0.1"
                      value={value}
                      onChange={(e) =>
                        updateAccessibilitySettings({
                          [key]: parseFloat(e.target.value),
                        } as Record<string, number>)
                      }
                      className="w-24"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 导出偏好设置 */}
        {activeTab === "export" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-800">
              {t("userPreferences.exportPreferences")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t("userPreferences.defaultFormat")}
                </label>
                <select
                  value={preferences.export.defaultFormat}
                  onChange={(e) =>
                    updateUserPreferences({
                      export: {
                        ...preferences.export,
                        defaultFormat: e.target.value as
                          | "pdf"
                          | "json"
                          | "csv"
                          | "xlsx",
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pdf">{t("exportFormatConfig.pdf")}</option>
                  <option value="json">{t("exportFormatConfig.json")}</option>
                  <option value="csv">{t("exportFormatConfig.csv")}</option>
                  <option value="xlsx">{t("exportFormatConfig.xlsx")}</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      {t("userPreferences.autoSave")}
                    </label>
                    <p className="text-xs text-neutral-500">
                      {t("descriptions.autoSave")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateUserPreferences({
                        export: {
                          ...preferences.export,
                          autoSave: !preferences.export.autoSave,
                        },
                      })
                    }
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${
                        preferences.export.autoSave
                          ? "bg-primary-600"
                          : "bg-neutral-300"
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          preferences.export.autoSave
                            ? "translate-x-6"
                            : "translate-x-1"
                        }
                      `}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">
                      {t("userPreferences.includeCharts")}
                    </label>
                    <p className="text-xs text-neutral-500">
                      {t("descriptions.includeCharts")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateUserPreferences({
                        export: {
                          ...preferences.export,
                          includeCharts: !preferences.export.includeCharts,
                        },
                      })
                    }
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${
                        preferences.export.includeCharts
                          ? "bg-primary-600"
                          : "bg-neutral-300"
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          preferences.export.includeCharts
                            ? "translate-x-6"
                            : "translate-x-1"
                        }
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 数据保留设置 */}
        {activeTab === "dataRetention" && (
          <DataRetentionSection
            periodData={calendar.periodData || []}
            t={t}
            onNavigateToExport={() => {
              setActiveTab("export");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>

      {/* 验证结果显示 */}
      {validationResult && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            validationResult.isValid
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                validationResult.isValid ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                validationResult.isValid ? "text-green-800" : "text-red-800"
              }`}
            >
              {validationResult.isValid ? "设置验证通过" : "设置验证失败"}
            </span>
          </div>

          {validationResult.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-red-700 mb-1">错误：</p>
              <ul className="text-sm text-red-600 space-y-1">
                {validationResult.errors.map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.warnings.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-yellow-700 mb-1">警告：</p>
              <ul className="text-sm text-yellow-600 space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <li key={index}>• {warning.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
