#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
英文症状评估工具翻译键完整性检查脚本
"""

import json
import sys

def check_english_translation_keys():
    print("=== 英文症状评估工具翻译键完整性检查 ===")

    # 读取JSON文件
    with open('messages/en.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 定义所有需要的英文翻译键
    required_keys = [
        # 基础信息
        'interactiveTools.symptomAssessment.title',
        'interactiveTools.symptomAssessment.description',
        'interactiveTools.symptomAssessment.subtitle',

        # 开始页面
        'interactiveTools.symptomAssessment.start.title',
        'interactiveTools.symptomAssessment.start.description',
        'interactiveTools.symptomAssessment.start.feature1',
        'interactiveTools.symptomAssessment.start.feature2',
        'interactiveTools.symptomAssessment.start.feature3',
        'interactiveTools.symptomAssessment.start.feature4',
        'interactiveTools.symptomAssessment.start.startButton',
        'interactiveTools.symptomAssessment.start.disclaimer',

        # 进度
        'interactiveTools.symptomAssessment.progress.questionOf',
        'interactiveTools.symptomAssessment.progress.step',
        'interactiveTools.symptomAssessment.progress.completed',
        'interactiveTools.symptomAssessment.progress.remaining',

        # 导航
        'interactiveTools.symptomAssessment.navigation.previous',
        'interactiveTools.symptomAssessment.navigation.next',
        'interactiveTools.symptomAssessment.navigation.skip',
        'interactiveTools.symptomAssessment.navigation.back',
        'interactiveTools.symptomAssessment.navigation.continue',
        'interactiveTools.symptomAssessment.navigation.finish',

        # 问题
        'interactiveTools.symptomAssessment.questions.painLevel',
        'interactiveTools.symptomAssessment.questions.painDuration',
        'interactiveTools.symptomAssessment.questions.painLocation',
        'interactiveTools.symptomAssessment.questions.accompanyingSymptoms',
        'interactiveTools.symptomAssessment.questions.reliefPreference',
        'interactiveTools.symptomAssessment.questions.cyclePattern',
        'interactiveTools.symptomAssessment.questions.workplaceImpact',
        'interactiveTools.symptomAssessment.questions.sleepQuality',
        'interactiveTools.symptomAssessment.questions.moodChanges',
        'interactiveTools.symptomAssessment.questions.energyLevel',

        # 选项
        'interactiveTools.symptomAssessment.options.mild',
        'interactiveTools.symptomAssessment.options.moderate',
        'interactiveTools.symptomAssessment.options.severe',
        'interactiveTools.symptomAssessment.options.verySevere',
        'interactiveTools.symptomAssessment.options.hours',
        'interactiveTools.symptomAssessment.options.days',
        'interactiveTools.symptomAssessment.options.long',
        'interactiveTools.symptomAssessment.options.variable',
        'interactiveTools.symptomAssessment.options.regular',
        'interactiveTools.symptomAssessment.options.irregular',
        'interactiveTools.symptomAssessment.options.yes',
        'interactiveTools.symptomAssessment.options.no',
        'interactiveTools.symptomAssessment.options.sometimes',

        # 严重程度
        'interactiveTools.symptomAssessment.severity.mild',
        'interactiveTools.symptomAssessment.severity.moderate',
        'interactiveTools.symptomAssessment.severity.severe',
        'interactiveTools.symptomAssessment.severity.verySevere',
        'interactiveTools.symptomAssessment.severity.workplace',

        # 优先级
        'interactiveTools.symptomAssessment.priority.high',
        'interactiveTools.symptomAssessment.priority.medium',
        'interactiveTools.symptomAssessment.priority.low',

        # 消息
        'interactiveTools.symptomAssessment.messages.assessmentComplete',
        'interactiveTools.symptomAssessment.messages.assessmentCompleteDesc',
        'interactiveTools.symptomAssessment.messages.assessmentFailed',
        'interactiveTools.symptomAssessment.messages.assessmentFailedDesc',
        'interactiveTools.symptomAssessment.messages.loading',
        'interactiveTools.symptomAssessment.messages.calculating',
        'interactiveTools.symptomAssessment.messages.generatingRecommendations',

        # 按钮
        'interactiveTools.symptomAssessment.buttons.next',
        'interactiveTools.symptomAssessment.buttons.previous',
        'interactiveTools.symptomAssessment.buttons.submit',
        'interactiveTools.symptomAssessment.buttons.restart',
        'interactiveTools.symptomAssessment.buttons.viewResults',
        'interactiveTools.symptomAssessment.buttons.downloadReport',
        'interactiveTools.symptomAssessment.buttons.shareResults',

        # 结果
        'interactiveTools.symptomAssessment.result.title',
        'interactiveTools.symptomAssessment.result.yourScore',
        'interactiveTools.symptomAssessment.result.severity',
        'interactiveTools.symptomAssessment.result.riskLevel',
        'interactiveTools.symptomAssessment.result.summary',
        'interactiveTools.symptomAssessment.result.recommendations',
        'interactiveTools.symptomAssessment.result.timeframe',
        'interactiveTools.symptomAssessment.result.actionSteps',
        'interactiveTools.symptomAssessment.result.retakeAssessment',
        'interactiveTools.symptomAssessment.result.saveResults',
        'interactiveTools.symptomAssessment.result.settings',

        # 建议
        'interactiveTools.symptomAssessment.recommendations.workplaceSupport.title',
        'interactiveTools.symptomAssessment.recommendations.workplaceSupport.description',
        'interactiveTools.symptomAssessment.recommendations.workplaceSupport.action1',
        'interactiveTools.symptomAssessment.recommendations.workplaceSupport.action2',
        'interactiveTools.symptomAssessment.recommendations.workplaceSupport.action3',
        'interactiveTools.symptomAssessment.recommendations.workplaceSupport.timeframe',

        'interactiveTools.symptomAssessment.recommendations.personalCare.title',
        'interactiveTools.symptomAssessment.recommendations.personalCare.description',
        'interactiveTools.symptomAssessment.recommendations.personalCare.action1',
        'interactiveTools.symptomAssessment.recommendations.personalCare.action2',
        'interactiveTools.symptomAssessment.recommendations.personalCare.action3',
        'interactiveTools.symptomAssessment.recommendations.personalCare.timeframe',

        'interactiveTools.symptomAssessment.recommendations.medicalAdvice.title',
        'interactiveTools.symptomAssessment.recommendations.medicalAdvice.description',
        'interactiveTools.symptomAssessment.recommendations.medicalAdvice.action1',
        'interactiveTools.symptomAssessment.recommendations.medicalAdvice.action2',
        'interactiveTools.symptomAssessment.recommendations.medicalAdvice.action3',
        'interactiveTools.symptomAssessment.recommendations.medicalAdvice.timeframe'
    ]

    missing_keys = []
    present_keys = []

    for key_path in required_keys:
        keys = key_path.split('.')
        value = data
        try:
            for key in keys:
                value = value[key]
            present_keys.append(key_path)
        except (KeyError, TypeError):
            missing_keys.append(key_path)

    print(f"\n📊 检查结果:")
    print(f"✅ 已存在: {len(present_keys)} 个翻译键")
    print(f"❌ 缺失: {len(missing_keys)} 个翻译键")

    if missing_keys:
        print(f"\n❌ 缺失的翻译键:")
        for key in missing_keys:
            print(f"   - {key}")
    else:
        print(f"\n🎉 所有英文翻译键都已存在！")

    return len(missing_keys) == 0

if __name__ == "__main__":
    success = check_english_translation_keys()
    sys.exit(0 if success else 1)
