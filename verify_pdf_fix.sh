#!/bin/bash

# PDF链接验证脚本
echo "🔍 开始验证PDF链接状态..."

# 从CSV中提取的PDF链接列表
urls=(
  "http://localhost:3001/downloads/parent-communication-guide-zh.pdf"
  "http://localhost:3001/downloads/zhan-zhuang-baduanjin-illustrated-guide-zh.pdf"
  "http://localhost:3001/downloads/teacher-collaboration-handbook-zh.pdf"
  "http://localhost:3001/downloads/healthy-habits-checklist-zh.pdf"
  "http://localhost:3001/downloads/specific-menstrual-pain-management-guide-zh.pdf"
  "http://localhost:3001/downloads/natural-therapy-assessment-zh.pdf"
  "http://localhost:3001/downloads/menstrual-cycle-nutrition-plan-zh.pdf"
  "http://localhost:3001/downloads/campus-emergency-checklist-zh.pdf"
  "http://localhost:3001/downloads/menstrual-pain-complications-management-zh.pdf"
  "http://localhost:3001/downloads/magnesium-gut-health-menstrual-pain-guide-zh.pdf"
  "http://localhost:3001/downloads/pain-tracking-form-zh.pdf"
  "http://localhost:3001/downloads/teacher-health-manual-zh.pdf"
)

success_count=0
failure_count=0

echo "📊 检测结果："
echo "----------------------------------------"

for url in "${urls[@]}"; do
  # 获取HTTP状态码和响应时间
  response=$(curl -s -o /dev/null -w "%{http_code},%{time_total}" --max-time 10 "$url")
  status_code=$(echo $response | cut -d',' -f1)
  response_time=$(echo $response | cut -d',' -f2)

  filename=$(basename "$url")

  if [ "$status_code" -eq 200 ]; then
    echo "✅ $status_code - $filename (${response_time}s)"
    ((success_count++))

    # 验证文件大小（确保不是空文件）
    file_size=$(curl -s -I "$url" | grep -i content-length | awk '{print $2}' | tr -d '\r')
    if [ -n "$file_size" ] && [ "$file_size" -gt 1000 ]; then
      echo "   📄 文件大小: $(( file_size / 1024 )) KB"
    else
      echo "   ⚠️  文件可能过小或损坏"
    fi
  else
    echo "❌ $status_code - $filename (${response_time}s)"
    ((failure_count++))
  fi
done

echo "----------------------------------------"
echo "📈 统计结果："
echo "✅ 成功: $success_count"
echo "❌ 失败: $failure_count"
echo "📊 总计: $((success_count + failure_count))"

if [ $failure_count -eq 0 ]; then
  echo "🎉 所有PDF链接都正常工作！"
else
  echo "⚠️  仍有 $failure_count 个链接需要修复"
fi

# 额外检查网站资源
echo ""
echo "🔍 检查其他资源..."
echo "----------------------------------------"

other_urls=(
  "http://localhost:3001/favicon.ico"
  "http://localhost:3001/"
)

for url in "${other_urls[@]}"; do
  status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")

  if [ "$status_code" -eq 200 ]; then
    echo "✅ $status_code - $url"
  else
    echo "❌ $status_code - $url"
  fi
done
