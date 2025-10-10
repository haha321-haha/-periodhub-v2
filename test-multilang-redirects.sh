#!/bin/bash

echo "🌍 测试多语言重定向规则"
echo "================================"

# 测试URLs
URLS=(
    "download-center"
    "downloads-new" 
    "articles-pdf-center"
)

# 测试中文重定向
echo "📱 测试中文用户重定向 (Accept-Language: zh-CN)"
echo "----------------------------------------"
for url in "${URLS[@]}"; do
    echo -n "测试 /$url (中文): "
    response=$(curl -s -I -H "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8" "https://www.periodhub.health/$url")
    
    if echo "$response" | grep -q "location.*zh/downloads"; then
        echo "✅ 正确重定向到 /zh/downloads"
    elif echo "$response" | grep -q "location.*downloads"; then
        echo "⚠️  重定向到 /downloads (缺少语言前缀)"
    else
        echo "❌ 未找到重定向或返回错误"
    fi
done

echo ""

# 测试英文重定向
echo "🌍 测试英文用户重定向 (Accept-Language: en-US)"
echo "----------------------------------------"
for url in "${URLS[@]}"; do
    echo -n "测试 /$url (英文): "
    response=$(curl -s -I -H "Accept-Language: en-US,en;q=0.9" "https://www.periodhub.health/$url")
    
    if echo "$response" | grep -q "location.*en/downloads"; then
        echo "✅ 正确重定向到 /en/downloads"
    elif echo "$response" | grep -q "location.*zh/downloads"; then
        echo "⚠️  重定向到 /zh/downloads (应该是英文)"
    elif echo "$response" | grep -q "location.*downloads"; then
        echo "⚠️  重定向到 /downloads (缺少语言前缀)"
    else
        echo "❌ 未找到重定向或返回错误"
    fi
done

echo ""

# 测试默认重定向（无Accept-Language头部）
echo "🔧 测试默认重定向 (无Accept-Language头部)"
echo "----------------------------------------"
for url in "${URLS[@]}"; do
    echo -n "测试 /$url (默认): "
    response=$(curl -s -I "https://www.periodhub.health/$url")
    
    if echo "$response" | grep -q "location.*en/downloads"; then
        echo "✅ 正确重定向到 /en/downloads (默认英文)"
    elif echo "$response" | grep -q "location.*zh/downloads"; then
        echo "⚠️  重定向到 /zh/downloads (应该是默认英文)"
    elif echo "$response" | grep -q "location.*downloads"; then
        echo "⚠️  重定向到 /downloads (缺少语言前缀)"
    else
        echo "❌ 未找到重定向或返回错误"
    fi
done

echo ""
echo "🎯 预期结果："
echo "- 中文用户: 重定向到 /zh/downloads"
echo "- 英文用户: 重定向到 /en/downloads" 
echo "- 默认用户: 重定向到 /en/downloads"
echo ""
echo "如果看到 ⚠️ 或 ❌，说明重定向规则还未完全生效，"
echo "可能需要等待Vercel部署和缓存清除。"
