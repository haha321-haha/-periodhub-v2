/**
 * 集成测试 - 基于ziV1d3d的完整功能测试
 * 测试所有组件的集成功能和交互
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import NutritionGenerator from '../components/NutritionGenerator';

// 基于ziV1d3d的测试数据
const mockMessages = {
  nutritionGenerator: {
    pageTitle: 'Nutrition Recommendation Generator',
    mainTitle: 'Nutrition Suggestion Generator',
    subtitle: 'Scientific nutrition guidance based on menstrual cycle, health goals, and TCM constitution',
    generateBtn: 'Generate My Plan',
    generating: 'Generating...',
    noSelection: 'Please make a selection to generate recommendations.',
    footerText: 'Personalized wellness at your fingertips.',
    categories: {
      menstrualPhase: 'Menstrual Phase',
      healthGoals: 'Health Goals',
      tcmConstitution: 'TCM Constitution'
    },
    results: {
      title: 'Your Personalized Nutrition Recommendations',
      subtitle: 'Based on your selections, we recommend the following nutrition guidance',
      recommendedFoods: 'Recommended Foods',
      foodsToAvoid: 'Foods to Avoid',
      lifestyleTips: 'Lifestyle & Dietary Tips'
    }
  }
};

// 基于ziV1d3d的测试包装器
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider locale="en" messages={mockMessages}>
    {children}
  </NextIntlClientProvider>
);

describe('Nutrition Generator Integration Tests', () => {
  // 基于ziV1d3d的初始化测试
  test('should render with correct initial state', () => {
    render(
      <TestWrapper>
        <NutritionGenerator />
      </TestWrapper>
    );

    // 测试ziV1d3d的主要元素
    expect(screen.getByText('Nutrition Suggestion Generator')).toBeInTheDocument();
    expect(screen.getByText('中文')).toBeInTheDocument();
    expect(screen.getByText('Generate My Plan')).toBeInTheDocument();
    expect(screen.getByText('Personalized wellness at your fingertips.')).toBeInTheDocument();
  });

  // 基于ziV1d3d的语言切换测试
  test('should toggle language correctly', () => {
    render(
      <TestWrapper>
        <NutritionGenerator />
      </TestWrapper>
    );

    const langToggle = screen.getByText('中文');
    fireEvent.click(langToggle);

    // 验证语言切换后的文本
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  // 基于ziV1d3d的选择功能测试
  test('should handle selection correctly', async () => {
    render(
      <TestWrapper>
        <NutritionGenerator />
      </TestWrapper>
    );

    // 测试月经阶段选择
    const menstrualPhaseButton = screen.getByText('Menstrual Phase');
    fireEvent.click(menstrualPhaseButton);

    // 验证选择状态
    expect(menstrualPhaseButton).toHaveClass('selected');
  });

  // 基于ziV1d3d的推荐生成测试
  test('should generate recommendations correctly', async () => {
    render(
      <TestWrapper>
        <NutritionGenerator />
      </TestWrapper>
    );

    // 选择一个选项
    const menstrualPhaseButton = screen.getByText('Menstrual Phase');
    fireEvent.click(menstrualPhaseButton);

    // 点击生成按钮
    const generateButton = screen.getByText('Generate My Plan');
    fireEvent.click(generateButton);

    // 等待推荐结果
    await waitFor(() => {
      expect(screen.getByText('Your Personalized Nutrition Recommendations')).toBeInTheDocument();
    });
  });

  // 基于ziV1d3d的错误处理测试
  test('should show error when no selection is made', async () => {
    render(
      <TestWrapper>
        <NutritionGenerator />
      </TestWrapper>
    );

    // 直接点击生成按钮
    const generateButton = screen.getByText('Generate My Plan');
    fireEvent.click(generateButton);

    // 验证错误消息
    await waitFor(() => {
      expect(screen.getByText('Please make a selection to generate recommendations.')).toBeInTheDocument();
    });
  });

  // 基于ziV1d3d的多选功能测试
  test('should handle multiple selections correctly', async () => {
    render(
      <TestWrapper>
        <NutritionGenerator />
      </TestWrapper>
    );

    // 选择多个健康目标
    const anemiaPreventionButton = screen.getByText('Prevent Iron-Deficiency Anemia');
    const pmsReliefButton = screen.getByText('Alleviate PMS Symptoms');

    fireEvent.click(anemiaPreventionButton);
    fireEvent.click(pmsReliefButton);

    // 验证多选状态
    expect(anemiaPreventionButton).toHaveClass('selected');
    expect(pmsReliefButton).toHaveClass('selected');
  });

  // 基于ziV1d3d的取消选择测试
  test('should handle deselection correctly', async () => {
    render(
      <TestWrapper>
        <NutritionGenerator />
      </TestWrapper>
    );

    // 选择然后取消选择
    const menstrualPhaseButton = screen.getByText('Menstrual Phase');
    fireEvent.click(menstrualPhaseButton);
    expect(menstrualPhaseButton).toHaveClass('selected');

    fireEvent.click(menstrualPhaseButton);
    expect(menstrualPhaseButton).not.toHaveClass('selected');
  });
});
