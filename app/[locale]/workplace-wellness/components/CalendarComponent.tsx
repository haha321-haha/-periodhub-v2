/**
 * HVsLYEp职场健康助手 - 日历组件
 * 基于HVsLYEp的PeriodCalendarComponent函数设计
 */

'use client';

import { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar, useWorkplaceWellnessActions } from '../hooks/useWorkplaceWellnessStore';
import { useLanguage } from '../hooks/useWorkplaceWellnessStore';
import { createTranslationFunction, getPeriodData } from '../data';
import { PeriodRecord } from '../types';

export default function CalendarComponent() {
  const calendar = useCalendar();
  const language = useLanguage();
  const { updateCalendar, setCurrentDate } = useWorkplaceWellnessActions();
  const t = createTranslationFunction(language);
  
  const periodData = getPeriodData();
  const [showAddForm, setShowAddForm] = useState(false);

  // 获取当前月份的第一天
  const firstDayOfMonth = new Date(calendar.currentDate.getFullYear(), calendar.currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(calendar.currentDate.getFullYear(), calendar.currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();

  // 生成日历天数
  const daysInMonth = lastDayOfMonth.getDate();
  const calendarDays = [];

  // 添加上个月的空白天数
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }

  // 添加当前月的天数
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // 检查某天是否有经期记录
  const getPeriodRecord = (day: number) => {
    const dateStr = `${calendar.currentDate.getFullYear()}-${String(calendar.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return periodData.find(record => record.date === dateStr);
  };

  // 获取日期样式类
  const getDateClasses = (day: number, record: PeriodRecord | undefined) => {
    const baseClasses = "w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors duration-200";
    
    if (record) {
      if (record.type === 'period') {
        return `${baseClasses} bg-secondary-100 text-secondary-800 hover:bg-secondary-200`;
      } else if (record.type === 'predicted') {
        return `${baseClasses} bg-primary-100 text-primary-800 hover:bg-primary-200`;
      }
    }
    
    return `${baseClasses} hover:bg-neutral-100`;
  };

  // 月份导航
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendar.currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {t('calendar.title')}
        </h2>
        <p className="text-neutral-600">
          {t('calendar.subtitle')}
        </p>
      </div>

      {/* 日历主体 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        {/* 月份导航 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h3 className="text-lg font-semibold text-neutral-900">
            {calendar.currentDate.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {(t('calendar.days') as unknown as string[]).map((day: string, index: number) => (
            <div key={index} className="text-center text-sm font-medium text-neutral-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* 日历网格 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="w-10 h-10" />;
            }
            
            const record = getPeriodRecord(day);
            
            return (
              <button
                key={day}
                className={getDateClasses(day, record)}
                onClick={() => updateCalendar({ selectedDate: new Date(calendar.currentDate.getFullYear(), calendar.currentDate.getMonth(), day) })}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary-100 rounded"></div>
            <span className="text-sm text-neutral-600">{t('calendar.legendPeriod')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-100 rounded"></div>
            <span className="text-sm text-neutral-600">{t('calendar.legendPredicted')}</span>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary-600">28</div>
          <div className="text-sm text-neutral-600">{t('calendar.statCycle')}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary-600">5</div>
          <div className="text-sm text-neutral-600">{t('calendar.statLength')}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary-600">12</div>
          <div className="text-sm text-neutral-600">{t('calendar.statNext')}</div>
        </div>
      </div>

      {/* 记录按钮 */}
      <div className="text-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200"
        >
          <Plus size={20} />
          {t('calendar.recordButton')}
        </button>
      </div>
    </div>
  );
}
