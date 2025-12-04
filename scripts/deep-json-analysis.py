#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys
import os

def analyze_json_error(file_path):
    """深度分析JSON文件错误"""
    print(f"🔍 深度分析JSON文件: {file_path}")
    print("=" * 60)

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 尝试解析JSON
        try:
            json.loads(content)
            print("✅ JSON格式正确")
            return True
        except json.JSONDecodeError as e:
            print(f"❌ JSON解析错误:")
            print(f"   错误信息: {e.msg}")
            print(f"   错误行号: {e.lineno}")
            print(f"   错误列号: {e.colno}")
            print(f"   错误位置: {e.pos}")

            # 显示错误位置的上下文
            print(f"\n📍 错误位置上下文:")
            start_pos = max(0, e.pos - 50)
            end_pos = min(len(content), e.pos + 50)
            context = content[start_pos:end_pos]

            # 标记错误位置
            error_in_context = e.pos - start_pos
            context_lines = context.split('\n')

            print(f"   位置 {start_pos}-{end_pos}:")
            for i, line in enumerate(context_lines):
                marker = ">>> " if i == len(context_lines)//2 else "    "
                print(f"{marker}{line}")

            # 分析具体字符
            if e.pos < len(content):
                error_char = content[e.pos]
                print(f"\n🔤 错误位置的字符:")
                print(f"   字符: '{error_char}'")
                print(f"   ASCII码: {ord(error_char)}")
                print(f"   十六进制: {hex(ord(error_char))}")

            # 检查前后字符
            print(f"\n🔍 错误位置前后字符分析:")
            for i in range(max(0, e.pos-5), min(len(content), e.pos+6)):
                char = content[i]
                marker = ">>>" if i == e.pos else "   "
                print(f"{marker} 位置{i}: '{char}' (ASCII: {ord(char)}, HEX: {hex(ord(char))})")

            # 分析括号匹配
            print(f"\n🔗 括号匹配分析:")
            analyze_bracket_matching(content, e.pos)

            # 检查常见问题
            print(f"\n🚨 常见问题检查:")
            check_common_issues(content, e.pos)

            return False

    except Exception as e:
        print(f"❌ 文件读取错误: {e}")
        return False

def analyze_bracket_matching(content, error_pos):
    """分析括号匹配情况"""
    brackets = {'(': ')', '[': ']', '{': '}'}
    stack = []

    for i, char in enumerate(content[:error_pos]):
        if char in brackets:
            stack.append((char, i))
        elif char in brackets.values():
            if stack:
                open_bracket, open_pos = stack.pop()
                if brackets[open_bracket] != char:
                    print(f"   ⚠️  括号不匹配: 位置{open_pos}的'{open_bracket}'与位置{i}的'{char}'")
            else:
                print(f"   ⚠️  多余的闭合括号: 位置{i}的'{char}'")

    if stack:
        print(f"   ⚠️  未闭合的括号:")
        for bracket, pos in stack:
            print(f"      位置{pos}: '{bracket}'")
    else:
        print(f"   ✅ 错误位置前的括号匹配正常")

def check_common_issues(content, error_pos):
    """检查常见的JSON格式问题"""
    # 检查是否有多余的逗号
    context = content[max(0, error_pos-20):min(len(content), error_pos+20)]

    if ',}' in context or ',]' in context:
        print("   ⚠️  发现多余的逗号")

    if '}{' in context:
        print("   ⚠️  发现连续的大括号，可能缺少逗号")

    if '""' in context and context.count('"') % 2 != 0:
        print("   ⚠️  可能存在未闭合的字符串")

    # 检查是否有非ASCII字符
    for i, char in enumerate(context):
        if ord(char) > 127:
            print(f"   ℹ️  发现非ASCII字符: 位置{error_pos-20+i}的'{char}'")

def suggest_fixes(file_path):
    """建议修复方案"""
    print(f"\n💡 修复建议:")
    print("1. 检查错误位置附近是否有多余的逗号或括号")
    print("2. 确认所有字符串都正确闭合")
    print("3. 验证对象属性之间的逗号分隔")
    print("4. 检查是否有隐藏的Unicode字符")
    print("5. 考虑使用JSON格式化工具重新格式化文件")

def main():
    file_path = "messages/zh.json"

    if not os.path.exists(file_path):
        print(f"❌ 文件不存在: {file_path}")
        return

    # 分析文件
    is_valid = analyze_json_error(file_path)

    if not is_valid:
        suggest_fixes(file_path)

    # 检查文件编码
    print(f"\n📄 文件信息:")
    stat = os.stat(file_path)
    print(f"   文件大小: {stat.st_size} 字节")

    # 尝试检测编码
    try:
        with open(file_path, 'rb') as f:
            raw_content = f.read()

        # 检查BOM
        if raw_content.startswith(b'\xef\xbb\xbf'):
            print("   ⚠️  文件包含UTF-8 BOM")
        elif raw_content.startswith(b'\xff\xfe'):
            print("   ⚠️  文件可能是UTF-16 LE编码")
        elif raw_content.startswith(b'\xfe\xff'):
            print("   ⚠️  文件可能是UTF-16 BE编码")
        else:
            print("   ✅ 文件编码看起来正常")

    except Exception as e:
        print(f"   ❌ 无法检查文件编码: {e}")

if __name__ == "__main__":
    main()
