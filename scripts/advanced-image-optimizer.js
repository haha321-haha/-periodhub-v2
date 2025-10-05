#!/usr/bin/env node

/**
 * 🖼️ PeriodHub 高级图片优化脚本
 *
 * 功能：
 * 1. 清理重复图片文件
 * 2. 批量转换为现代格式 (WebP, AVIF)
 * 3. 生成响应式图片尺寸
 * 4. 优化文件结构
 * 5. 生成优化报告
 */

const fs = require('fs');
const path = require('path');

class AdvancedImageOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.publicDir = path.join(this.projectRoot, 'public');
    this.imagesDir = path.join(this.publicDir, 'images');

    // 响应式图片尺寸配置
    this.sizes = {
      mobile: [320, 640],
      tablet: [768, 1024],
      desktop: [1280, 1920, 2560]
    };

    // 支持的输入格式
    this.inputFormats = ['.jpg', '.jpeg', '.png'];

    // 输出格式配置
    this.outputFormats = {
      webp: { quality: 85, effort: 6 },
      avif: { quality: 80, effort: 4 }
    };

    this.stats = {
      totalFiles: 0,
      processed: 0,
      duplicates: 0,
      originalSize: 0,
      optimizedSize: 0,
      errors: []
    };
  }

  async run() {
    console.log('🖼️ 开始高级图片优化...\n');

    try {
      // 1. 扫描所有图片文件
      console.log('📂 扫描图片文件...');
      const allImages = this.scanAllImages();
      console.log(`发现 ${allImages.length} 个图片文件\n`);

      // 2. 识别重复文件
      console.log('🔍 识别重复文件...');
      const duplicates = this.findDuplicates(allImages);
      console.log(`发现 ${duplicates.length} 个重复文件\n`);

      // 3. 清理重复文件
      console.log('🧹 清理重复文件...');
      await this.cleanupDuplicates(duplicates);

      // 4. 批量优化图片
      console.log('⚡ 批量优化图片...');
      await this.batchOptimizeImages(allImages);

      // 5. 生成优化报告
      console.log('📊 生成优化报告...');
      await this.generateReport();

      console.log('\n🎉 图片优化完成！');

    } catch (error) {
      console.error('❌ 优化过程中出现错误:', error.message);
      process.exit(1);
    }
  }

  scanAllImages() {
    const images = [];

    const scanDirectory = (dir, relativePath = '') => {
      if (!fs.existsSync(dir)) return;

      const files = fs.readdirSync(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativeFilePath = path.join(relativePath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDirectory(fullPath, relativeFilePath);
        } else if (this.inputFormats.includes(path.extname(file).toLowerCase())) {
          images.push({
            fullPath,
            relativePath: relativeFilePath,
            name: path.basename(file, path.extname(file)),
            ext: path.extname(file).toLowerCase(),
            size: stat.size,
            modified: stat.mtime
          });
          this.stats.totalFiles++;
          this.stats.originalSize += stat.size;
        }
      }
    };

    scanDirectory(this.imagesDir);
    return images;
  }

  findDuplicates(images) {
    const duplicates = [];
    const groups = {};

    // 按文件名分组
    for (const image of images) {
      const baseName = image.name.replace(/[-_](\d+x\d+)$/, ''); // 移除尺寸后缀

      if (!groups[baseName]) {
        groups[baseName] = [];
      }
      groups[baseName].push(image);
    }

    // 找出重复组
    for (const [baseName, group] of Object.entries(groups)) {
      if (group.length > 1) {
        // 按优先级排序：WebP > PNG > JPG
        group.sort((a, b) => {
          const priority = { '.webp': 3, '.png': 2, '.jpg': 1, '.jpeg': 1 };
          return (priority[b.ext] || 0) - (priority[a.ext] || 0);
        });

        // 保留第一个（最高优先级），其余为重复
        const keep = group[0];
        const remove = group.slice(1);

        duplicates.push({
          baseName,
          keep,
          remove,
          savedSpace: remove.reduce((sum, img) => sum + img.size, 0)
        });

        this.stats.duplicates += remove.length;
      }
    }

    return duplicates;
  }

  async cleanupDuplicates(duplicates) {
    for (const duplicate of duplicates) {
      console.log(`🗑️  清理重复: ${duplicate.baseName}`);
      console.log(`   保留: ${duplicate.keep.relativePath} (${this.formatSize(duplicate.keep.size)})`);

      for (const file of duplicate.remove) {
        console.log(`   删除: ${file.relativePath} (${this.formatSize(file.size)})`);
        try {
          fs.unlinkSync(file.fullPath);
          this.stats.originalSize -= file.size;
        } catch (error) {
          console.error(`   ❌ 删除失败: ${error.message}`);
          this.stats.errors.push({
            file: file.relativePath,
            error: `删除失败: ${error.message}`
          });
        }
      }
    }

    console.log(`\n✅ 清理完成，释放空间: ${this.formatSize(duplicates.reduce((sum, d) => sum + d.savedSpace, 0))}\n`);
  }

  async batchOptimizeImages(images) {
    // 创建优化目录结构
    this.ensureOptimizedDirectories();

    for (const image of images) {
      try {
        await this.optimizeImage(image);
        this.stats.processed++;

        if (this.stats.processed % 10 === 0) {
          console.log(`进度: ${this.stats.processed}/${this.stats.totalFiles}`);
        }

      } catch (error) {
        console.error(`❌ 优化失败: ${image.relativePath} - ${error.message}`);
        this.stats.errors.push({
          file: image.relativePath,
          error: error.message
        });
      }
    }
  }

  ensureOptimizedDirectories() {
    const directories = [
      'optimized',
      'optimized/webp',
      'optimized/avif',
      'optimized/responsive'
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.imagesDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  async optimizeImage(image) {
    // 这里需要sharp库，如果没有安装会跳过
    try {
      const sharp = require('sharp');
      await this.optimizeWithSharp(image, sharp);
    } catch (error) {
      // 如果sharp不可用，使用基础优化
      await this.basicOptimize(image);
    }
  }

  async optimizeWithSharp(image, sharp) {
    const imageProcessor = sharp(image.fullPath);
    const metadata = await imageProcessor.metadata();

    // 生成WebP版本
    const webpPath = path.join(this.imagesDir, 'optimized', 'webp', `${image.name}.webp`);
    await imageProcessor
      .webp(this.outputFormats.webp)
      .toFile(webpPath);

    // 生成AVIF版本
    const avifPath = path.join(this.imagesDir, 'optimized', 'avif', `${image.name}.avif`);
    await imageProcessor
      .avif(this.outputFormats.avif)
      .toFile(avifPath);

    // 生成响应式版本
    await this.generateResponsiveVersions(image, imageProcessor, metadata);

    // 更新统计
    const webpStats = fs.statSync(webpPath);
    const avifStats = fs.statSync(avifPath);
    this.stats.optimizedSize += webpStats.size + avifStats.size;
  }

  async generateResponsiveVersions(image, processor, metadata) {
    const allSizes = [...this.sizes.mobile, ...this.sizes.tablet, ...this.sizes.desktop];

    for (const size of allSizes) {
      if (size <= metadata.width) {
        // WebP响应式版本
        const webpResponsivePath = path.join(
          this.imagesDir,
          'optimized',
          'responsive',
          `${image.name}-${size}w.webp`
        );

        await processor
          .clone()
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp(this.outputFormats.webp)
          .toFile(webpResponsivePath);

        // AVIF响应式版本
        const avifResponsivePath = path.join(
          this.imagesDir,
          'optimized',
          'responsive',
          `${image.name}-${size}w.avif`
        );

        await processor
          .clone()
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .avif(this.outputFormats.avif)
          .toFile(avifResponsivePath);
      }
    }
  }

  async basicOptimize(image) {
    // 基础优化：重命名和移动文件
    console.log(`📝 基础优化: ${image.relativePath}`);

    const webpPath = path.join(this.imagesDir, 'optimized', 'webp', `${image.name}.webp`);

    // 如果已经是WebP，直接复制
    if (image.ext === '.webp') {
      fs.copyFileSync(image.fullPath, webpPath);
    } else {
      // 否则保持原格式但移动到优化目录
      const optimizedPath = path.join(this.imagesDir, 'optimized', 'webp', `${image.name}${image.ext}`);
      fs.copyFileSync(image.fullPath, optimizedPath);
    }
  }

  async generateReport() {
    const compressionRatio = this.stats.originalSize > 0
      ? ((this.stats.originalSize - this.stats.optimizedSize) / this.stats.originalSize * 100).toFixed(2)
      : 0;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.stats.totalFiles,
        processed: this.stats.processed,
        duplicates: this.stats.duplicates,
        originalSize: this.stats.originalSize,
        optimizedSize: this.stats.optimizedSize,
        spaceSaved: this.stats.originalSize - this.stats.optimizedSize,
        compressionRatio: `${compressionRatio}%`
      },
      errors: this.stats.errors,
      recommendations: this.generateRecommendations()
    };

    // 保存报告
    fs.writeFileSync(
      path.join(this.projectRoot, 'image-optimization-report.json'),
      JSON.stringify(report, null, 2)
    );

    // 控制台输出
    console.log('\n📊 图片优化报告');
    console.log('═'.repeat(50));
    console.log(`总文件数: ${this.stats.totalFiles}`);
    console.log(`已处理: ${this.stats.processed}`);
    console.log(`重复文件: ${this.stats.duplicates}`);
    console.log(`原始大小: ${this.formatSize(this.stats.originalSize)}`);
    console.log(`优化后大小: ${this.formatSize(this.stats.optimizedSize)}`);
    console.log(`节省空间: ${this.formatSize(this.stats.originalSize - this.stats.optimizedSize)}`);
    console.log(`压缩率: ${compressionRatio}%`);
    console.log(`错误数: ${this.stats.errors.length}`);

    if (this.stats.errors.length > 0) {
      console.log('\n❌ 错误详情:');
      this.stats.errors.forEach(error => {
        console.log(`  - ${error.file}: ${error.error}`);
      });
    }

    console.log('\n💡 优化建议:');
    report.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.stats.duplicates > 0) {
      recommendations.push(`清理了 ${this.stats.duplicates} 个重复文件`);
    }

    if (this.stats.optimizedSize < this.stats.originalSize * 0.5) {
      recommendations.push('图片压缩效果显著，建议更新组件使用优化版本');
    }

    if (this.stats.errors.length > 0) {
      recommendations.push('部分文件优化失败，建议检查文件权限和格式');
    }

    recommendations.push('建议在Next.js配置中启用图片优化');
    recommendations.push('考虑使用CDN加速图片加载');
    recommendations.push('实施图片懒加载策略');

    return recommendations;
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// 主执行函数
async function main() {
  const optimizer = new AdvancedImageOptimizer();
  await optimizer.run();
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AdvancedImageOptimizer;
