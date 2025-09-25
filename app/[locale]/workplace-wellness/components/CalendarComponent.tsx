/**
 * HVsLYEp职场健康助手 - 日历组件
 * 基于HVsLYEp的PeriodCalendarComponent函数设计
 */

'use client';

import { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCalendar, useWorkplaceWellnessActions } from '../hooks/useWorkplaceWellnessStore';
import { createTranslationFunction, getPeriodData } from '../data';
import { PeriodRecord } from '../types';

export default function CalendarComponent() {
  const calendar = useCalendar();
  const locale = useLocale();
  const { updateCalendar, setCurrentDate } = useWorkplaceWellnessActions();
  const t = createTranslationFunction(locale as 'zh' | 'en');
  
  const periodData = getPeriodData();
  const [showAddForm, setShowAddForm] = useState(false);

  // 基于HVsLYEp的日历逻辑
  const { currentDate } = calendar;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 生成日历天数数组 - 基于HVsLYEp的days生成逻辑
  let days = Array(startingDayOfWeek).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // 获取某天的经期状态 - 基于HVsLYEp的getDayStatus函数
  const getDayStatus = (day: number): PeriodRecord | null => {
    if (!day) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return periodData.find(d => d.date === dateStr) || null;
  };

  // 获取日期样式 - 基于HVsLYEp的getDayStyles函数
  const getDayStyles = (day: number, status: PeriodRecord | null) => {
    if (!day) return 'invisible';
    let styles = 'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors duration-200 ';
    if (status) {
      if (status.type === 'period') styles += 'bg-secondary-500 text-white hover:bg-secondary-600';
      else if (status.type === 'predicted') styles += 'bg-secondary-500/10 text-secondary-700 border-2 border-dashed border-secondary-300 hover:bg-secondary-500/20';
    } else {
      styles += 'hover:bg-neutral-100 text-neutral-800';
    }
    return styles;
  };
  
  // 获取预测日期 - 基于HVsLYEp的逻辑
  const predictedDateEntry = periodData.find(d => d.type === 'predicted');
  const formattedPredictedDate = predictedDateEntry 
    ? new Date(predictedDateEntry.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
        month: 'short',
        day: 'numeric'
      })
    : '';

  // 月份导航 - 基于HVsLYEp的导航逻辑
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // 添加经期记录
  const handleAddRecord = () => {
    setShowAddForm(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      {/* 头部 - 基于HVsLYEp的头部设计 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900">
            {t('calendar.title')}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            {t('calendar.subtitle')}
          </p>
        </div>
        <button 
          onClick={handleAddRecord}
          className="rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 text-base bg-primary-500 hover:bg-primary-600 text-white"
        >
          <Plus className="w-4 h-4" />
          {t('calendar.recordButton')}
        </button>
      </div>

      {/* 月份导航 - 基于HVsLYEp的导航设计 */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigateMonth('prev')}
          className="hover:bg-neutral-100 text-neutral-800 rounded-lg p-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="text-lg font-medium text-neutral-900">{monthName}</h4>
        <button 
          onClick={() => navigateMonth('next')}
          className="hover:bg-neutral-100 text-neutral-800 rounded-lg p-2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 星期标题 - 基于HVsLYEp的星期显示 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {(t('calendar.days') as unknown as string[]).map((day: string, index: number) => (
          <div key={index} className="h-10 flex items-center justify-center text-sm font-medium text-neutral-600">
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 - 基于HVsLYEp的日历网格 */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={getDayStyles(day, getDayStatus(day))}
          >
            {day || ''}
          </div>
        ))}
      </div>
      
      {/* 图例 - 基于HVsLYEp的图例设计 */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary-500"></div>
          <span className="text-neutral-600">{t('calendar.legendPeriod')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary-500/10 border-2 border-dashed border-secondary-300"></div>
          <span className="text-neutral-600">{t('calendar.legendPredicted')}</span>
        </div>
      </div>

      {/* 统计信息 - 基于HVsLYEp的统计显示 */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100">
        <div className="text-center">
          <div className="text-2xl font-semibold text-neutral-900">28</div>
          <div className="text-sm text-neutral-600">{t('calendar.statCycle')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-neutral-900">5</div>
          <div className="text-sm text-neutral-600">{t('calendar.statLength')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-secondary-500">{formattedPredictedDate}</div>
          <div className="text-sm text-neutral-600">{t('calendar.statNext')}</div>
        </div>
      </div>

      {/* 添加经期记录表单 */}
      {showAddForm && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h4 className="text-lg font-medium text-neutral-900 mb-4">
            {t('calendar.addRecord')}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                {t('calendar.date')}
              </label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                {t('calendar.type')}
              </label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="period">{t('calendar.typePeriod')}</option>
                <option value="predicted">{t('calendar.typePredicted')}</option>
                <option value="ovulation">{t('calendar.typeOvulation')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                {t('calendar.painLevel')}
              </label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                defaultValue="0"
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                {t('common.save')}
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors duration-200"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}