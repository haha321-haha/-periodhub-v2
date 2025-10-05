#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 智能修复 messages/zh.json 格式问题...');

const filePath = path.join(__dirname, '..', 'messages', 'zh.json');

try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    console.log(`📖 已读取文件，总长度: ${content.length} 字符`);

    // 备份原文件
    const backupPath = filePath + '.backup.' + Date.now();
    fs.writeFileSync(backupPath, content);
    console.log(`💾 已创建备份文件: ${backupPath}`);

    // 分析并修复未闭合的字符串
    console.log('\n🔍 分析字符串闭合问题...');

    const lines = content.split('\n');
    let fixed = false;

    // 检查每一行的字符串闭合情况
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const quoteCount = (line.match(/"/g) || []).length;

        // 如果引号数量是奇数，说明字符串未闭合
        if (quoteCount % 2 !== 0) {
            console.log(`⚠️  第${i + 1}行字符串未闭合: ${line.trim()}`);

            // 尝试修复：在行末添加缺失的引号
            if (!line.trim().endsWith('"')) {
                lines[i] = line.trim() + '"';
                fixed = true;
                console.log(`🔧 已修复第${i + 1}行`);
            }
        }
    }

    if (fixed) {
        content = lines.join('\n');
        console.log('✅ 已修复未闭合的字符串');
    }

    // 修复多余的括号和逗号
    console.log('\n🔧 修复括号和逗号问题...');

    // 删除文件末尾多余的逗号和括号
    content = content.trim();

    // 删除末尾多余的右花括号
    while (content.endsWith('},') || content.endsWith('}')) {
        if (content.endsWith('},')) {
            content = content.slice(0, -2);
        } else if (content.endsWith('}')) {
            content = content.slice(0, -1);
        }
        content = content.trim();
    }

    // 确保文件以正确的结构结束
    if (!content.endsWith('}')) {
        content += '\n}';
    }

    // 验证修复结果
    console.log('\n✅ 验证修复结果...');

    try {
        JSON.parse(content);
        console.log('✅ JSON格式验证通过！');

        // 格式化并保存
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);
        fs.writeFileSync(filePath, formatted);
        console.log('💾 已保存修复后的文件');

        // 再次验证
        JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log('✅ 最终验证通过！');

        console.log('\n🎉 修复完成！');

    } catch (error) {
        console.error(`❌ JSON验证失败: ${error.message}`);

        // 尝试更激进的修复
        console.log('🔧 尝试更激进的修复...');

        // 找到最后一个完整的JSON对象
        let lastBrace = content.lastIndexOf('}');
        if (lastBrace > 0) {
            let conservativeContent = content.substring(0, lastBrace + 1);

            try {
                JSON.parse(conservativeContent);
                console.log('✅ 激进修复成功！');

                // 格式化并保存
                const parsed = JSON.parse(conservativeContent);
                const formatted = JSON.stringify(parsed, null, 2);
                fs.writeFileSync(filePath, formatted);

                // 最终验证
                JSON.parse(fs.readFileSync(filePath, 'utf8'));
                console.log('✅ 最终验证通过！');

            } catch (e) {
                console.error(`❌ 激进修复也失败了: ${e.message}`);

                // 恢复备份
                fs.writeFileSync(filePath, fs.readFileSync(backupPath));
                console.log('🔄 已恢复备份文件');

                // 提供手动修复建议
                console.log('\n📋 手动修复建议:');
                console.log('1. 检查第31行是否有未闭合的字符串');
                console.log('2. 检查第4594行是否有多余的逗号或括号');
                console.log('3. 使用专业的JSON编辑器进行修复');
            }
        }
    }

} catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
}
