#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
批量补充中文翻译键脚本
安全地添加缺失的中文翻译键
"""

import json
import os
from datetime import datetime

def load_json_file(filepath):
    """加载JSON文件"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 加载文件失败 {filepath}: {e}")
        return None

def save_json_file(filepath, data):
    """保存JSON文件"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"❌ 保存文件失败 {filepath}: {e}")
        return False

def main():
    print("=== 批量补充中文翻译键 ===")

    # 备份文件
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"messages/zh_backup_{timestamp}.json"

    # 加载文件
    zh_data = load_json_file("messages/zh.json")
    en_data = load_json_file("messages/en.json")

    if not zh_data or not en_data:
        print("❌ 无法加载翻译文件")
        return

    # 备份中文文件
    if save_json_file(backup_file, zh_data):
        print(f"✅ 备份文件已创建: {backup_file}")

    # 定义要添加的翻译键
    translations_to_add = {
        # 数字和范围键
        "0-2": "0-2",
        "3-4": "3-4",
        "4": "4",
        "5-7": "5-7",
        "8-10": "8-10",

        # 功能键
        "benefitsLabel": "益处标签",
        "foods": "食物",
        "actionSteps": "行动步骤",
        "step": "步骤",
        "steps": "步骤",

        # 评估相关
        "assessment": "评估",
        "assessmentTool": "评估工具",
        "assessmentResult": "评估结果",
        "assessmentHistory": "评估历史",

        # 建议相关
        "recommendation": "建议",
        "recommendations": "建议",
        "personalizedRecommendations": "个性化建议",
        "immediateRecommendations": "即时建议",
        "longTermRecommendations": "长期建议",

        # 症状相关
        "symptom": "症状",
        "symptoms": "症状",
        "symptomAssessment": "症状评估",
        "symptomTracker": "症状追踪",
        "symptomHistory": "症状历史",

        # 疼痛相关
        "pain": "疼痛",
        "painLevel": "疼痛等级",
        "painDuration": "疼痛持续时间",
        "painLocation": "疼痛位置",
        "painTracker": "疼痛追踪",

        # 周期相关
        "cycle": "周期",
        "cycleTracker": "周期追踪",
        "cycleLength": "周期长度",
        "cycleHistory": "周期历史",

        # 体质相关
        "constitution": "体质",
        "constitutionTest": "体质测试",
        "constitutionType": "体质类型",
        "constitutionRecommendations": "体质建议",

        # 营养相关
        "nutrition": "营养",
        "nutritionGuide": "营养指南",
        "nutritionRecommendations": "营养建议",
        "diet": "饮食",
        "dietGuide": "饮食指南",

        # 运动相关
        "exercise": "运动",
        "exercises": "运动",
        "exerciseGuide": "运动指南",
        "stretching": "拉伸",
        "yoga": "瑜伽",

        # 生活方式
        "lifestyle": "生活方式",
        "lifestyleRecommendations": "生活方式建议",
        "sleep": "睡眠",
        "stress": "压力",
        "stressManagement": "压力管理",

        # 医疗相关
        "medical": "医疗",
        "medicalAdvice": "医疗建议",
        "doctor": "医生",
        "doctorVisit": "看医生",
        "emergency": "紧急情况",

        # 工具相关
        "tool": "工具",
        "tools": "工具",
        "tracker": "追踪器",
        "calculator": "计算器",
        "guide": "指南",

        # 用户界面
        "button": "按钮",
        "buttons": "按钮",
        "menu": "菜单",
        "navigation": "导航",
        "settings": "设置",
        "preferences": "偏好设置",

        # 状态和消息
        "loading": "加载中",
        "error": "错误",
        "success": "成功",
        "warning": "警告",
        "info": "信息",
        "message": "消息",
        "notification": "通知",

        # 时间和日期
        "date": "日期",
        "time": "时间",
        "duration": "持续时间",
        "frequency": "频率",
        "schedule": "时间表",

        # 数据相关
        "data": "数据",
        "record": "记录",
        "records": "记录",
        "history": "历史",
        "statistics": "统计",
        "analytics": "分析",
        "report": "报告",
        "export": "导出",
        "import": "导入",

        # 社交功能
        "community": "社区",
        "social": "社交",
        "share": "分享",
        "support": "支持",
        "help": "帮助",
        "feedback": "反馈",

        # 技术相关
        "sync": "同步",
        "backup": "备份",
        "restore": "恢复",
        "update": "更新",
        "version": "版本",
        "performance": "性能",
        "optimization": "优化",

        # 无障碍
        "accessibility": "无障碍",
        "aria": "ARIA",
        "screenReader": "屏幕阅读器",
        "keyboard": "键盘",
        "focus": "焦点",

        # 测试相关
        "test": "测试",
        "testing": "测试",
        "validation": "验证",
        "quality": "质量",
        "coverage": "覆盖率",

        # 文档相关
        "documentation": "文档",
        "tutorial": "教程",
        "manual": "手册",
        "api": "API",
        "reference": "参考"
    }

    # 添加翻译键
    added_count = 0
    for key, value in translations_to_add.items():
        if key not in zh_data:
            zh_data[key] = value
            added_count += 1
            print(f"✅ 添加: {key} = {value}")

    # 保存更新后的文件
    if save_json_file("messages/zh.json", zh_data):
        print(f"\n=== 批量补充完成 ===")
        print(f"添加的键数量: {added_count}")
        print(f"新的中文键数量: {len(zh_data)}")
        print(f"英文键数量: {len(en_data)}")
        print(f"覆盖率: {len(zh_data) * 100 / len(en_data):.2f}%")
        print(f"备份文件: {backup_file}")
    else:
        print("❌ 保存失败")

if __name__ == "__main__":
    main()
