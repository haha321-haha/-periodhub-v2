#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
结果页面翻译键完整性检查脚本
"""

import json
import sys

def check_result_page_keys():
    print("=== 结果页面翻译键完整性检查 ===")
    
    # 读取JSON文件
    with open('messages/zh.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 定义所有需要的结果页面翻译键
    required_keys = [
        # 结果页面基础
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
        
        # 优先级
        'interactiveTools.symptomAssessment.result.workplaceSupport',
        'interactiveTools.symptomAssessment.result.mediumPriority',
        'interactiveTools.symptomAssessment.result.highPriority',
        'interactiveTools.symptomAssessment.result.lowPriority',
        
        # 时间框架
        'interactiveTools.symptomAssessment.result.immediate',
        'interactiveTools.symptomAssessment.result.shortTerm',
        'interactiveTools.symptomAssessment.result.longTerm',
        
        # 建议类型
        'interactiveTools.symptomAssessment.result.workplaceImpact',
        'interactiveTools.symptomAssessment.result.personalCare',
        'interactiveTools.symptomAssessment.result.medicalAdvice',
        
        # 建议内容
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
        print(f"\n🎉 所有结果页面翻译键都已存在！")
    
    return len(missing_keys) == 0

if __name__ == "__main__":
    success = check_result_page_keys()
    sys.exit(0 if success else 1)
