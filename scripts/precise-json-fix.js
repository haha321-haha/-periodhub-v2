#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 精确修复 messages/zh.json 格式问题...');

const filePath = path.join(__dirname, '..', 'messages', 'zh.json');

try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    console.log(`📖 已读取文件，总长度: ${content.length} 字符`);
    
    // 备份原文件
    const backupPath = filePath + '.backup.' + Date.now();
    fs.writeFileSync(backupPath, content);
    console.log(`💾 已创建备份文件: ${backupPath}`);
    
    // 逐行分析问题
    const lines = content.split('\n');
    console.log(`📊 文件总行数: ${lines.length}`);
    
    // 寻找JSON解析错误的精确位置
    let errorLine = null;
    let errorChar = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 检查常见问题模式
        if (line.includes('},') && line.includes('}')) {
            console.log(`⚠️  第${i + 1}行可能有问题: ${line.trim()}`);
        }
        
        // 检查未闭合的字符串
        if (line.includes('"') && (line.split('"').length - 1) % 2 !== 0) {
            console.log(`⚠️  第${i + 1}行可能有未闭合的字符串: ${line.trim()}`);
        }
    }
    
    // 尝试分段解析来定位问题
    console.log('\n🔍 分段解析定位问题...');
    
    let validLength = 0;
    for (let i = 1000; i < content.length; i += 1000) {
        try {
            JSON.parse(content.substring(0, i));
            validLength = i;
        } catch (error) {
            console.log(`❌ 在第${i}个字符处发现错误: ${error.message}`);
            break;
        }
    }
    
    console.log(`✅ 有效JSON长度: ${validLength} 字符`);
    
    // 分析问题区域
    const problemArea = content.substring(Math.max(0, validLength - 500), validLength + 100);
    console.log('\n📍 问题区域内容:');
    console.log(problemArea);
    
    // 尝试修复策略
    console.log('\n🔧 尝试修复策略...');
    
    // 策略1: 删除多余的逗号和括号
    let fixedContent = content;
    
    // 删除多余的右花括号和逗号组合
    fixedContent = fixedContent.replace(/\s*}\s*,\s*}\s*,\s*}/g, '}');
    fixedContent = fixedContent.replace(/\s*}\s*,\s*}/g, '}');
    
    // 删除文件末尾多余的逗号
    fixedContent = fixedContent.replace(/,\s*}\s*$/, '}');
    
    // 确保文件以正确的结构结束
    fixedContent = fixedContent.trim();
    if (!fixedContent.endsWith('}')) {
        fixedContent += '\n}';
    }
    
    // 验证修复结果
    try {
        JSON.parse(fixedContent);
        console.log('✅ 修复成功！');
        
        // 格式化并保存
        const parsed = JSON.parse(fixedContent);
        const formatted = JSON.stringify(parsed, null, 2);
        fs.writeFileSync(filePath, formatted);
        console.log('💾 已保存修复后的文件');
        
    } catch (error) {
        console.log(`❌ 修复失败: ${error.message}`);
        
        // 尝试更保守的修复
        console.log('🔧 尝试保守修复...');
        
        // 找到最后一个完整的对象
        let lastBrace = fixedContent.lastIndexOf('}');
        if (lastBrace > 0) {
            let conservativeContent = fixedContent.substring(0, lastBrace + 1);
            
            try {
                JSON.parse(conservativeContent);
                console.log('✅ 保守修复成功！');
                fs.writeFileSync(filePath, conservativeContent);
            } catch (e) {
                console.log(`❌ 保守修复也失败: ${e.message}`);
                // 恢复备份
                fs.writeFileSync(filePath, fs.readFileSync(backupPath));
                console.log('🔄 已恢复备份文件');
            }
        }
    }
    
} catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
}