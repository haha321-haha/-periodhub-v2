# 生产环境元数据验证脚本

## 验证目标
检查实际网站使用的Meta描述，与文件分析结果对比

## 需要验证的页面
1. https://www.periodhub.health/en/articles/ginger-menstrual-pain-relief-guide
2. https://www.periodhub.health/zh/articles/understanding-your-cycle  
3. https://www.periodhub.health/en/articles/period-pain-simulator-accuracy-analysis
4. https://www.periodhub.health/zh/articles/menstrual-nausea-relief-guide
5. https://www.periodhub.health/zh/articles/menstrual-pain-accompanying-symptoms-guide

## 验证方法
1. 访问每个页面
2. 查看页面源代码
3. 找到 `<meta name="description" content="...">` 标签
4. 记录实际内容长度
5. 与文件分析结果对比

## 预期发现
- 实际使用的字段（seo_description vs summary）
- 实际长度与文件分析的差异
- 语言切换对元数据的影响

## 验证清单
□ 检查5个页面的实际meta标签
□ 记录每个页面的description内容
□ 测量实际字符长度
□ 对比文件分析结果
□ 识别字段映射问题
□ 确定真正的问题页面



