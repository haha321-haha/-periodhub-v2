#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ✅ 添加依赖检查
let matter;
try {
  matter = require('gray-matter');
} catch (error) {
  console.error('❌ gray-matter not installed. Run: npm install gray-matter');
  process.exit(1);
}

function buildArticlesIndex() {
  const locales = ['en', 'zh'];
  const index = {};

  locales.forEach(locale => {
    const articlesDir = path.join(process.cwd(), `content/articles/${locale}`);
    
    if (!fs.existsSync(articlesDir)) {
      console.warn(`⚠️  Directory not found: ${articlesDir}`);
      index[locale] = [];
      return;
    }

    const filenames = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
    
    index[locale] = filenames.map(filename => {
      const filePath = path.join(articlesDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title || '',
        title_zh: data.title_zh,
        date: data.date || '',
        summary: data.summary || '',
        summary_zh: data.summary_zh,
        tags: data.tags || [],
        tags_zh: data.tags_zh,
        category: data.category || '',
        category_zh: data.category_zh,
        author: data.author || '',
        featured_image: data.featured_image || '',
        reading_time: data.reading_time || '',
        reading_time_zh: data.reading_time_zh,
      };
    });

    console.log(`✅ Indexed ${index[locale].length} articles for ${locale}`);
  });

  const outputPath = path.join(process.cwd(), 'public/articles-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  
  console.log(`✅ Articles index generated: ${outputPath}`);
  console.log(`📊 Total size: ${(JSON.stringify(index).length / 1024).toFixed(2)} KB`);
}

buildArticlesIndex();
