const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 对比文章路由与其他路由的处理差异
async function compareRouteProcessing() {
  console.log('=== 路由处理差异分析 ===\n');

  // 测试文章路由处理
  console.log('📄 文章路由处理分析：');
  await measureArticleRouteProcessing();

  console.log('\n' + '='.repeat(50) + '\n');

  // 模拟其他路由的简单处理
  console.log('🏠 其他路由处理分析（模拟）：');
  await measureOtherRouteProcessing();
}

async function measureArticleRouteProcessing() {
  const testArticles = [
    'comprehensive-medical-guide-to-dysmenorrhea', // 长文章
    'nsaid-menstrual-pain-professional-guide',     // 复杂文章
    '5-minute-period-pain-relief'                  // 简单文章
  ];

  for (const slug of testArticles) {
    console.log(`\n分析文章: ${slug}`);
    await measureComplexArticleProcessing(slug, 'zh');
  }
}

async function measureComplexArticleProcessing(slug, locale) {
  const totalStart = process.hrtime.bigint();

  // 1. 文章获取（模拟getArticleBySlug）
  const fetchStart = process.hrtime.bigint();
  const articlesPath = path.join(process.cwd(), 'content/articles', locale);
  const filePath = path.join(articlesPath, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ 文件不存在`);
    return;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const fetchEnd = process.hrtime.bigint();
  const fetchTime = Number(fetchEnd - fetchStart) / 1000000;

  // 2. 模拟相关文章计算（复杂操作）
  const relatedStart = process.hrtime.bigint();
  // 模拟扫描所有文章进行相关性计算
  const allArticles = fs.readdirSync(articlesPath)
    .filter(file => file.endsWith('.md'))
    .slice(0, 10); // 模拟处理前10个进行相关性分析

  let relatedScore = 0;
  for (const file of allArticles) {
    const otherPath = path.join(articlesPath, file);
    const otherContent = fs.readFileSync(otherPath, 'utf8');
    const { data: otherData } = matter(otherContent);
    // 模拟复杂的相关性计算
    relatedScore += (data.tags || []).filter(tag =>
      (otherData.tags || []).includes(tag)
    ).length;
  }
  const relatedEnd = process.hrtime.bigint();
  const relatedTime = Number(relatedEnd - relatedStart) / 1000000;

  // 3. 模拟复杂内容处理
  const contentStart = process.hrtime.bigint();
  // 模拟复杂的内容处理（检查特殊标记、图片等）
  const hasComplexContent = content.includes('```') ||
                           content.includes('![') ||
                           content.length > 10000;
  let complexProcessingTime = 0;
  if (hasComplexContent) {
    // 模拟额外处理时间
    await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
    complexProcessingTime = Math.random() * 20;
  }
  const contentEnd = process.hrtime.bigint();
  const contentTime = Number(contentEnd - contentStart) / 1000000 + complexProcessingTime;

  // 4. 模拟元数据生成
  const metaStart = process.hrtime.bigint();
  const metadata = {
    title: data.title,
    description: data.summary,
    tags: data.tags,
    readingTime: Math.ceil(content.length / 200), // 模拟阅读时间计算
    wordCount: content.split(/\s+/).length
  };
  const metaEnd = process.hrtime.bigint();
  const metaTime = Number(metaEnd - metaStart) / 1000000;

  const totalEnd = process.hrtime.bigint();
  const totalTime = Number(totalEnd - totalStart) / 1000000;

  console.log(`  文章获取: ${fetchTime.toFixed(2)}ms`);
  console.log(`  相关文章计算: ${relatedTime.toFixed(2)}ms (处理${allArticles.length}个文章)`);
  console.log(`  复杂内容处理: ${contentTime.toFixed(2)}ms`);
  console.log(`  元数据生成: ${metaTime.toFixed(2)}ms`);
  console.log(`  文件大小: ${Math.round(fileContents.length / 1024)}KB`);
  console.log(`  内容复杂度: ${hasComplexContent ? '高' : '低'}`);
  console.log(`  ✅ 总计: ${totalTime.toFixed(2)}ms`);
}

async function measureOtherRouteProcessing() {
  console.log('模拟简单路由处理（如首页、关于页面）：');

  const simpleStart = process.hrtime.bigint();

  // 模拟简单的静态内容处理
  const simpleContent = {
    title: "Simple Page",
    content: "Simple static content",
    metadata: { updated: new Date() }
  };

  // 模拟简单处理
  await new Promise(resolve => setTimeout(resolve, 1));

  const simpleEnd = process.hrtime.bigint();
  const simpleTime = Number(simpleEnd - simpleStart) / 1000000;

  console.log(`  内容处理: ${simpleTime.toFixed(2)}ms`);
  console.log(`  复杂度: 低`);
  console.log(`  依赖: 无额外依赖`);
  console.log(`  ✅ 总计: ${simpleTime.toFixed(2)}ms`);

  console.log(`\n📊 处理复杂度对比：`);
  console.log(`  文章路由: 多步骤处理，文件I/O密集，计算复杂`);
  console.log(`  其他路由: 简单处理，最小依赖，快速响应`);
}

compareRouteProcessing().catch(console.error);
