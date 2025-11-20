'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  RefreshCw as Sync,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Server,
  Smartphone,
  Laptop
} from 'lucide-react';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  syncInProgress: boolean;
  syncError: string | null;
  pendingChanges: number;
  conflictCount: number;
}

interface DeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastSeen: Date;
  isActive: boolean;
}

interface DataSyncProps {
  locale: string;
  userId?: string;
  onSyncComplete?: (data: any) => void;
  onSyncError?: (error: string) => void;
}

export default function DataSync({
  locale,
  userId,
  onSyncComplete,
  onSyncError
}: DataSyncProps) {
  const t = useTranslations('interactiveTools.sync');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSync: null,
    syncInProgress: false,
    syncError: null,
    pendingChanges: 0,
    conflictCount: 0
  });
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState(5); // 分钟
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 检测网络状态
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true, syncError: null }));
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 模拟设备数据
  useEffect(() => {
    const mockDevices: DeviceInfo[] = [
      {
        id: 'device1',
        name: 'iPhone 15 Pro',
        type: 'mobile',
        lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2分钟前
        isActive: true
      },
      {
        id: 'device2',
        name: 'MacBook Pro',
        type: 'desktop',
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
        isActive: false
      },
      {
        id: 'device3',
        name: 'iPad Air',
        type: 'tablet',
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
        isActive: false
      }
    ];
    setDevices(mockDevices);
  }, []);

  // 自动同步
  useEffect(() => {
    if (!autoSync || !syncStatus.isOnline) return;

    const interval = setInterval(() => {
      if (!syncStatus.syncInProgress) {
        performSync();
      }
    }, syncInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoSync, syncInterval, syncStatus.isOnline, syncStatus.syncInProgress]);

  // 执行同步
  const performSync = useCallback(async () => {
    if (!syncStatus.isOnline) {
      setSyncStatus(prev => ({
        ...prev,
        syncError: locale === 'zh' ? '网络连接不可用' : 'Network connection unavailable'
      }));
      return;
    }

    setSyncStatus(prev => ({ ...prev, syncInProgress: true, syncError: null }));

    try {
      // 模拟同步过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟随机成功/失败
      const success = Math.random() > 0.1; // 90% 成功率

      if (success) {
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          syncInProgress: false,
          pendingChanges: 0,
          conflictCount: 0,
          syncError: null
        }));

        if (onSyncComplete) {
          onSyncComplete({ timestamp: new Date(), changes: 0 });
        }
      } else {
        throw new Error(locale === 'zh' ? '同步失败，请重试' : 'Sync failed, please try again');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        syncError: errorMessage
      }));

      if (onSyncError) {
        onSyncError(errorMessage);
      }
    }
  }, [syncStatus.isOnline, locale, onSyncComplete, onSyncError]);

  // 手动同步
  const handleManualSync = () => {
    performSync();
  };

  // 解决冲突
  const handleResolveConflicts = () => {
    // 模拟解决冲突
    setSyncStatus(prev => ({ ...prev, conflictCount: 0 }));
  };

  // 导出数据
  const handleExportData = () => {
    const data = {
      userId,
      lastSync: syncStatus.lastSync,
      devices,
      timestamp: new Date()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `periodhub-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'desktop': return <Laptop className="w-4 h-4" />;
      case 'tablet': return <Smartphone className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'syncing': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      {/* 标题和状态 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Cloud className="w-6 h-6 mr-2 text-blue-600" />
            {locale === 'zh' ? '数据同步' : 'Data Sync'}
          </h2>
          <p className="text-gray-600">
            {locale === 'zh' ? '跨设备同步您的健康数据，确保数据安全' : 'Sync your health data across devices securely'}
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {syncStatus.isOnline ? (
            <div className="flex items-center text-green-600">
              <Wifi className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{locale === 'zh' ? '在线' : 'Online'}</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <WifiOff className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{locale === 'zh' ? '离线' : 'Offline'}</span>
            </div>
          )}
        </div>
      </div>

      {/* 同步状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 连接状态 */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-full ${syncStatus.isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
              {syncStatus.isOnline ? (
                <Cloud className="w-6 h-6 text-green-600" />
              ) : (
                <CloudOff className="w-6 h-6 text-red-600" />
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(syncStatus.isOnline ? 'online' : 'offline')}`}>
              {syncStatus.isOnline ? (locale === 'zh' ? '已连接' : 'Connected') : (locale === 'zh' ? '离线' : 'Offline')}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {locale === 'zh' ? '网络状态' : 'Network Status'}
          </h3>
          <p className="text-sm text-gray-600">
            {syncStatus.isOnline
              ? (locale === 'zh' ? '云端连接正常' : 'Cloud connection active')
              : (locale === 'zh' ? '无法连接到云端' : 'Cannot connect to cloud')
            }
          </p>
        </div>

        {/* 最后同步 */}
        <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-green-100">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {syncStatus.lastSync ? (locale === 'zh' ? '已同步' : 'Synced') : (locale === 'zh' ? '未同步' : 'Not Synced')}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {locale === 'zh' ? '最后同步' : 'Last Sync'}
          </h3>
          <p className="text-sm text-gray-600">
            {syncStatus.lastSync
              ? syncStatus.lastSync.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')
              : (locale === 'zh' ? '从未同步' : 'Never synced')
            }
          </p>
        </div>

        {/* 待同步更改 */}
        <div className="bg-gradient-to-br from-gray-50 to-yellow-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-yellow-100">
              <Database className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              {syncStatus.pendingChanges} {locale === 'zh' ? '待同步' : 'Pending'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {locale === 'zh' ? '待同步更改' : 'Pending Changes'}
          </h3>
          <p className="text-sm text-gray-600">
            {syncStatus.pendingChanges === 0
              ? (locale === 'zh' ? '所有数据已同步' : 'All data synced')
              : `${syncStatus.pendingChanges} ${locale === 'zh' ? '项更改待同步' : 'changes pending'}`
            }
          </p>
        </div>

        {/* 冲突数量 */}
        <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-full bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              {syncStatus.conflictCount} {locale === 'zh' ? '冲突' : 'Conflicts'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {locale === 'zh' ? '数据冲突' : 'Data Conflicts'}
          </h3>
          <p className="text-sm text-gray-600">
            {syncStatus.conflictCount === 0
              ? (locale === 'zh' ? '无冲突' : 'No conflicts')
              : `${syncStatus.conflictCount} ${locale === 'zh' ? '个冲突需解决' : 'conflicts to resolve'}`
            }
          </p>
        </div>
      </div>

      {/* 同步控制 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Sync className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '同步控制' : 'Sync Control'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {locale === 'zh' ? '自动同步' : 'Auto Sync'}
              </label>
              <button
                onClick={() => setAutoSync(!autoSync)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoSync ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoSync ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {autoSync && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '同步间隔' : 'Sync Interval'}
                </label>
                <select
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>{locale === 'zh' ? '1分钟' : '1 minute'}</option>
                  <option value={5}>{locale === 'zh' ? '5分钟' : '5 minutes'}</option>
                  <option value={15}>{locale === 'zh' ? '15分钟' : '15 minutes'}</option>
                  <option value={30}>{locale === 'zh' ? '30分钟' : '30 minutes'}</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleManualSync}
              disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {syncStatus.syncInProgress ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {locale === 'zh' ? '同步中...' : 'Syncing...'}
                </>
              ) : (
                <>
                  <Sync className="w-4 h-4 mr-2" />
                  {locale === 'zh' ? '立即同步' : 'Sync Now'}
                </>
              )}
            </button>

            {syncStatus.conflictCount > 0 && (
              <button
                onClick={handleResolveConflicts}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                {locale === 'zh' ? '解决冲突' : 'Resolve Conflicts'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 设备管理 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '设备管理' : 'Device Management'}
        </h3>

        <div className="space-y-4">
          {devices.map(device => (
            <div key={device.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{device.name}</h4>
                    <p className="text-sm text-gray-600">
                      {device.lastSeen.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    device.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {device.isActive ? (locale === 'zh' ? '活跃' : 'Active') : (locale === 'zh' ? '离线' : 'Offline')}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Shield className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '数据管理' : 'Data Management'}
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            {locale === 'zh' ? '导出数据' : 'Export Data'}
          </button>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            {locale === 'zh' ? '高级设置' : 'Advanced Settings'}
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '数据保留期限' : 'Data Retention Period'}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="1year">{locale === 'zh' ? '1年' : '1 Year'}</option>
                  <option value="2years">{locale === 'zh' ? '2年' : '2 Years'}</option>
                  <option value="5years">{locale === 'zh' ? '5年' : '5 Years'}</option>
                  <option value="forever">{locale === 'zh' ? '永久' : 'Forever'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '加密级别' : 'Encryption Level'}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="standard">{locale === 'zh' ? '标准' : 'Standard'}</option>
                  <option value="high">{locale === 'zh' ? '高级' : 'High'}</option>
                  <option value="maximum">{locale === 'zh' ? '最高' : 'Maximum'}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误显示 */}
      {syncStatus.syncError && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{syncStatus.syncError}</span>
          </div>
        </div>
      )}
    </div>
  );
}

