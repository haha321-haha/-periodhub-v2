#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
全面补充症状评估工具翻译键
"""

import json
import sys

def main():
    print("=== 全面补充症状评估工具翻译键 ===")

    # 读取JSON文件
    with open('messages/zh.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 确保interactiveTools.symptomAssessment结构完整
    if 'interactiveTools' not in data:
        data['interactiveTools'] = {}
    if 'symptomAssessment' not in data['interactiveTools']:
        data['interactiveTools']['symptomAssessment'] = {}

    # 添加所有必要的翻译键
    symptom_assessment = data['interactiveTools']['symptomAssessment']

    # 基础信息
    symptom_assessment['title'] = '症状评估工具'
    symptom_assessment['description'] = '专业的痛经症状评估工具，帮助您了解疼痛程度和获得个性化建议'
    symptom_assessment['subtitle'] = '专业医疗评估'

    # 开始页面
    symptom_assessment['start'] = {
        'title': '开始症状评估',
        'description': '通过5个专业问题，全面评估您的痛经症状',
        'feature1': '专业评估',
        'feature2': '个性化建议',
        'feature3': '即时缓解',
        'feature4': '长期管理',
        'startButton': '开始评估',
        'disclaimer': '本评估仅供参考，不能替代专业医疗诊断'
    }

    # 问题相关
    symptom_assessment['questions'] = {
        'painLevel': '疼痛程度',
        'painDuration': '疼痛持续时间',
        'painLocation': '疼痛位置',
        'accompanyingSymptoms': '伴随症状',
        'reliefPreference': '缓解偏好'
    }

    # 选项
    symptom_assessment['options'] = {
        'mild': '轻度 (1-3/10)',
        'moderate': '中度 (4-6/10)',
        'severe': '重度 (7-8/10)',
        'verySevere': '极重度 (9-10/10)',
        'hours': '持续几个小时',
        'days': '持续1-2天',
        'long': '持续3天或更长时间',
        'variable': '疼痛不可预测'
    }

    # 严重程度
    symptom_assessment['severity'] = {
        'mild': '轻度',
        'moderate': '中度',
        'severe': '重度',
        'verySevere': '极重度',
        'workplace': '职场影响'
    }

    # 优先级
    symptom_assessment['priority'] = {
        'high': '高优先级',
        'medium': '中等优先级',
        'low': '低优先级'
    }

    # 消息
    symptom_assessment['messages'] = {
        'assessmentComplete': '评估完成',
        'assessmentCompleteDesc': '您的症状评估已完成。请查看结果和建议。',
        'assessmentFailed': '评估失败',
        'assessmentFailedDesc': '评估过程中发生错误。请重试。',
        'loading': '正在评估...',
        'calculating': '正在计算分数...',
        'generatingRecommendations': '正在生成建议...'
    }

    # 按钮和操作
    symptom_assessment['buttons'] = {
        'next': '下一步',
        'previous': '上一步',
        'submit': '提交评估',
        'restart': '重新开始',
        'viewResults': '查看结果',
        'downloadReport': '下载报告',
        'shareResults': '分享结果'
    }

    # 结果页面
    symptom_assessment['results'] = {
        'title': '评估结果',
        'score': '疼痛评分',
        'severity': '严重程度',
        'recommendations': '个性化建议',
        'immediate': '即时缓解',
        'longTerm': '长期管理',
        'workplace': '职场支持',
        'medical': '医疗建议'
    }

    # 保存文件
    with open('messages/zh.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("✅ 所有症状评估工具翻译键已添加")

    # 验证添加的键
    print("\n=== 验证关键翻译键 ===")
    key_checks = [
        'interactiveTools.symptomAssessment.title',
        'interactiveTools.symptomAssessment.start.title',
        'interactiveTools.symptomAssessment.start.startButton',
        'interactiveTools.symptomAssessment.messages.assessmentComplete',
        'interactiveTools.symptomAssessment.severity.moderate',
        'interactiveTools.symptomAssessment.priority.medium'
    ]

    for key_path in key_checks:
        keys = key_path.split('.')
        value = data
        try:
            for key in keys:
                value = value[key]
            print(f"✅ {key_path}: {value}")
        except (KeyError, TypeError):
            print(f"❌ {key_path}: 缺失")

if __name__ == "__main__":
    main()
