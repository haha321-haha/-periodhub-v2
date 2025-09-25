'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { Locale } from '../types/common';
import { QuizAnswer, QuizResult } from '../types/quiz';
import { TrainingProgress, TrainingSession } from '../types/training';

interface PartnerHandbookState {
  // 语言设置
  currentLanguage: Locale;
  
  // 测试相关状态
  quizAnswers: QuizAnswer[];
  currentQuestionIndex: number;
  quizResult: QuizResult | null;
  isQuizCompleted: boolean;
  
  // 训练计划相关状态
  trainingProgress: Record<string, boolean>;
  completedDays: string[];
  currentDay: number;
  trainingSessions: TrainingSession[];
  
  // 用户偏好设置
  userPreferences: {
    notifications: boolean;
    reminderTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
    autoAdvance: boolean;
  };
  
  // 时间戳
  lastVisitDate: Date | null;
  createdAt: Date;
}

interface PartnerHandbookActions {
  // 语言管理
  setLanguage: (lang: Locale) => void;
  
  // 测试管理
  setAnswer: (index: number, answer: QuizAnswer) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  completeQuiz: (result: QuizResult) => void;
  
  // 训练计划管理
  completeTraining: (day: string) => void;
  startTrainingSession: (dayId: string) => void;
  endTrainingSession: (dayId: string, notes?: string, rating?: number) => void;
  resetTraining: () => void;
  
  // 用户偏好管理
  updatePreferences: (preferences: Partial<PartnerHandbookState['userPreferences']>) => void;
  
  // 工具方法
  getQuizScore: () => number;
  getTrainingProgress: () => number;
  getCurrentStreak: () => number;
  getLongestStreak: () => number;
  getCompletionRate: () => number;
  
  // 数据管理
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => void;
}

type PartnerHandbookStore = PartnerHandbookState & PartnerHandbookActions;

const defaultState: PartnerHandbookState = {
  currentLanguage: 'zh',
  quizAnswers: [],
  currentQuestionIndex: 0,
  quizResult: null,
  isQuizCompleted: false,
  trainingProgress: {},
  completedDays: [],
  currentDay: 1,
  trainingSessions: [],
  userPreferences: {
    notifications: true,
    reminderTime: '09:00',
    difficulty: 'medium',
    autoAdvance: true
  },
  lastVisitDate: null,
  createdAt: new Date()
};

export const usePartnerHandbookStore = create<PartnerHandbookStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,
        
        // 语言管理
        setLanguage: (lang) => {
          set({ currentLanguage: lang });
        },
        
        // 测试管理
        setAnswer: (index, answer) => {
          set((state) => ({
            quizAnswers: [
              ...state.quizAnswers.slice(0, index),
              answer,
              ...state.quizAnswers.slice(index + 1)
            ]
          }));
        },
        
        nextQuestion: () => {
          set((state) => ({
            currentQuestionIndex: state.currentQuestionIndex + 1
          }));
        },
        
        resetQuiz: () => {
          set({
            quizAnswers: [],
            currentQuestionIndex: 0,
            quizResult: null,
            isQuizCompleted: false
          });
        },
        
        completeQuiz: (result) => {
          set({
            quizResult: result,
            isQuizCompleted: true,
            lastVisitDate: new Date()
          });
        },
        
        // 训练计划管理
        completeTraining: (day) => {
          set((state) => {
            const newCompletedDays = [...state.completedDays];
            if (!newCompletedDays.includes(day)) {
              newCompletedDays.push(day);
            }
            
            return {
              trainingProgress: {
                ...state.trainingProgress,
                [day]: true
              },
              completedDays: newCompletedDays,
              currentDay: Math.max(state.currentDay, parseInt(day.replace('day', '')) + 1),
              lastVisitDate: new Date()
            };
          });
        },
        
        startTrainingSession: (dayId) => {
          const session: TrainingSession = {
            dayId,
            startTime: new Date(),
            completedTasks: []
          };
          
          set((state) => ({
            trainingSessions: [...state.trainingSessions, session]
          }));
        },
        
        endTrainingSession: (dayId, notes, rating) => {
          set((state) => ({
            trainingSessions: state.trainingSessions.map(session =>
              session.dayId === dayId
                ? {
                    ...session,
                    endTime: new Date(),
                    notes,
                    rating
                  }
                : session
            )
          }));
        },
        
        resetTraining: () => {
          set({
            trainingProgress: {},
            completedDays: [],
            currentDay: 1,
            trainingSessions: []
          });
        },
        
        // 用户偏好管理
        updatePreferences: (preferences) => {
          set((state) => ({
            userPreferences: {
              ...state.userPreferences,
              ...preferences
            }
          }));
        },
        
        // 工具方法
        getQuizScore: () => {
          const state = get();
          return state.quizResult?.totalScore || 0;
        },
        
        getTrainingProgress: () => {
          const state = get();
          const totalDays = 30; // 30天训练计划
          return Math.round((state.completedDays.length / totalDays) * 100);
        },
        
        getCurrentStreak: () => {
          const state = get();
          const sortedDays = state.completedDays
            .map(day => parseInt(day.replace('day', '')))
            .sort((a, b) => a - b);
          
          if (sortedDays.length === 0) return 0;
          
          let streak = 1;
          for (let i = sortedDays.length - 1; i > 0; i--) {
            if (sortedDays[i] - sortedDays[i - 1] === 1) {
              streak++;
            } else {
              break;
            }
          }
          
          return streak;
        },
        
        getLongestStreak: () => {
          const state = get();
          const sortedDays = state.completedDays
            .map(day => parseInt(day.replace('day', '')))
            .sort((a, b) => a - b);
          
          if (sortedDays.length === 0) return 0;
          
          let longestStreak = 1;
          let currentStreak = 1;
          
          for (let i = 1; i < sortedDays.length; i++) {
            if (sortedDays[i] - sortedDays[i - 1] === 1) {
              currentStreak++;
            } else {
              longestStreak = Math.max(longestStreak, currentStreak);
              currentStreak = 1;
            }
          }
          
          return Math.max(longestStreak, currentStreak);
        },
        
        getCompletionRate: () => {
          const state = get();
          const totalSessions = state.trainingSessions.length;
          const completedSessions = state.trainingSessions.filter(
            session => session.endTime !== undefined
          ).length;
          
          return totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
        },
        
        // 数据管理
        clearAllData: () => {
          set({
            ...defaultState,
            createdAt: new Date()
          });
        },
        
        exportData: () => {
          const state = get();
          const exportData = {
            quizAnswers: state.quizAnswers,
            quizResult: state.quizResult,
            trainingProgress: state.trainingProgress,
            completedDays: state.completedDays,
            trainingSessions: state.trainingSessions,
            userPreferences: state.userPreferences,
            exportDate: new Date().toISOString()
          };
          
          return JSON.stringify(exportData, null, 2);
        },
        
        importData: (data) => {
          try {
            const importedData = JSON.parse(data);
            
            set((state) => ({
              ...state,
              quizAnswers: importedData.quizAnswers || [],
              quizResult: importedData.quizResult || null,
              trainingProgress: importedData.trainingProgress || {},
              completedDays: importedData.completedDays || [],
              trainingSessions: importedData.trainingSessions || [],
              userPreferences: {
                ...state.userPreferences,
                ...importedData.userPreferences
              }
            }));
          } catch (error) {
            console.error('Failed to import data:', error);
          }
        }
      }),
      {
        name: 'partner-handbook-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentLanguage: state.currentLanguage,
          quizAnswers: state.quizAnswers,
          quizResult: state.quizResult,
          isQuizCompleted: state.isQuizCompleted,
          trainingProgress: state.trainingProgress,
          completedDays: state.completedDays,
          currentDay: state.currentDay,
          trainingSessions: state.trainingSessions,
          userPreferences: state.userPreferences,
          lastVisitDate: state.lastVisitDate,
          createdAt: state.createdAt
        })
      }
    ),
    {
      name: 'partner-handbook-store'
    }
  )
);

// 选择器hooks，用于优化性能
export const useQuizState = () => usePartnerHandbookStore(state => ({
  answers: state.quizAnswers,
  currentQuestionIndex: state.currentQuestionIndex,
  result: state.quizResult,
  isCompleted: state.isQuizCompleted
}));

export const useTrainingState = () => usePartnerHandbookStore(state => ({
  progress: state.trainingProgress,
  completedDays: state.completedDays,
  currentDay: state.currentDay,
  sessions: state.trainingSessions
}));

export const useUserPreferences = () => usePartnerHandbookStore(state => ({
  preferences: state.userPreferences,
  updatePreferences: state.updatePreferences
}));



