const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 测试文章处理的各个组件
async function measureArticleProcessing() {
  console.log('=== 文章处理性能分析 ===\n');

  const testArticles = [
    '5-minute-period-pain-relief',
    'nsaid-menstrual-pain-professional-guide',
    'comprehensive-medical-guide-to-dysmenorrhea'
  ];

  for (const slug of testArticles) {
    console.log(`测试文章: ${slug}`);
    await measureSingleArticle(slug, 'zh');
    console.log('---');
  }
}

async function measureSingleArticle(slug, locale) {
  const articlesPath = path.join(process.cwd(), 'content/articles', locale);

  // 1. 测量文件系统访问时间
  const fsStart = process.hrtime.bigint();
  const filePath = path.join(articlesPath, `${slug}.md`);
  const exists = fs.existsSync(filePath);
  const fsEnd = process.hrtime.bigint();
  const fsTime = Number(fsEnd - fsStart) / 1000000; // 转换为毫秒

  console.log(`  文件系统检查: ${fsTime.toFixed(2)}ms`);

  if (!exists) {
    console.log(`  ❌ 文件不存在`);
    return;
  }

  // 2. 测量文件读取时间
  const readStart = process.hrtime.bigint();
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const readEnd = process.hrtime.bigint();
  const readTime = Number(readEnd - readStart) / 1000000;

  console.log(`  文件读取: ${readTime.toFixed(2)}ms`);
  console.log(`  文件大小: ${Math.round(fileContents.length / 1024)}KB`);

  // 3. 测量Markdown解析时间
  const parseStart = process.hrtime.bigint();
  const { data, content } = matter(fileContents);
  const parseEnd = process.hrtime.bigint();
  const parseTime = Number(parseEnd - parseStart) / 1000000;

  console.log(`  Markdown解析: ${parseTime.toFixed(2)}ms`);
  console.log(`  内容长度: ${Math.round(content.length / 1024)}KB`);

  const totalTime = fsTime + readTime + parseTime;
  console.log(`  ✅ 总计: ${totalTime.toFixed(2)}ms`);
}

measureArticleProcessing().catch(console.error);
