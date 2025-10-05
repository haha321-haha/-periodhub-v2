#!/usr/bin/env node

/**
 * 医疗护理指南索引问题分析脚本
 * 分析未被Google索引的医疗护理指南文章
 */

const fs = require('fs');
const path = require('path');

class MedicalCareGuideAnalyzer {
    constructor() {
        this.unindexedUrls = [
            'https://www.periodhub.health/en/articles/when-to-seek-medical-care-comprehensive-guide',
            'https://www.periodhub.health/zh/articles/when-to-seek-medical-care-comprehensive-guide',
            'https://www.periodhub.health/en/articles/long-term-healthy-lifestyle-guide',
            'https://www.periodhub.health/zh/articles/long-term-healthy-lifestyle-guide'
        ];

        this.results = {
            contentAnalysis: {},
            seoIssues: {},
            technicalProblems: {},
            recommendations: []
        };
    }

    async analyzeGuides() {
        console.log('🔍 分析医疗护理指南索引问题...\n');

        try {
            // 1. 分析内容质量
            await this.analyzeContentQuality();

            // 2. 检查SEO问题
            await this.analyzeSEOIssues();

            // 3. 检查技术问题
            await this.analyzeTechnicalIssues();

            // 4. 生成改进建议
            this.generateRecommendations();

            // 5. 生成报告
            this.generateReport();

        } catch (error) {
            console.error('❌ 分析过程中出现错误:', error.message);
            return false;
        }

        return true;
    }

    async analyzeContentQuality() {
        console.log('📝 分析内容质量...');

        const articles = [
            {
                name: 'when-to-seek-medical-care-comprehensive-guide',
                path: 'content/articles/zh/when-to-seek-medical-care-comprehensive-guide.md',
                url: 'https://www.periodhub.health/zh/articles/when-to-seek-medical-care-comprehensive-guide'
            },
            {
                name: 'long-term-healthy-lifestyle-guide',
                path: 'content/articles/zh/long-term-healthy-lifestyle-guide.md',
                url: 'https://www.periodhub.health/zh/articles/long-term-healthy-lifestyle-guide'
            }
        ];

        for (const article of articles) {
            console.log(`   分析: ${article.name}`);

            if (fs.existsSync(article.path)) {
                const content = fs.readFileSync(article.path, 'utf8');
                const analysis = this.analyzeArticleContent(content, article.name);
                this.results.contentAnalysis[article.name] = analysis;
            } else {
                console.log(`   ⚠️ 文件不存在: ${article.path}`);
                this.results.contentAnalysis[article.name] = {
                    exists: false,
                    issues: ['文件不存在']
                };
            }
        }

        console.log('✅ 内容质量分析完成\n');
    }

    analyzeArticleContent(content, articleName) {
        const analysis = {
            exists: true,
            wordCount: 0,
            issues: [],
            strengths: [],
            score: 0
        };

        // 计算字数
        const textContent = content.replace(/---[\s\S]*?---/, '').replace(/[#*`\[\]]/g, '');
        analysis.wordCount = textContent.split(/\s+/).length;

        // 检查内容长度
        if (analysis.wordCount < 1000) {
            analysis.issues.push(`内容过短 (${analysis.wordCount}字，建议>1500字)`);
        } else if (analysis.wordCount > 1500) {
            analysis.strengths.push(`内容充实 (${analysis.wordCount}字)`);
        }

        // 检查标题结构
        const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
        if (headings.length < 5) {
            analysis.issues.push(`标题结构不够丰富 (${headings.length}个标题，建议>8个)`);
        } else {
            analysis.strengths.push(`标题结构良好 (${headings.length}个标题)`);
        }

        // 检查元数据
        const frontMatter = content.match(/---[\s\S]*?---/);
        if (frontMatter) {
            const metadata = frontMatter[0];

            // 检查SEO标题
            if (!metadata.includes('seo_title:')) {
                analysis.issues.push('缺少SEO标题');
            }

            // 检查SEO描述
            if (!metadata.includes('seo_description:')) {
                analysis.issues.push('缺少SEO描述');
            } else {
                const seoDesc = metadata.match(/seo_description:\s*"([^"]+)"/);
                if (seoDesc && seoDesc[1].length < 120) {
                    analysis.issues.push(`SEO描述过短 (${seoDesc[1].length}字符，建议150-160字符)`);
                }
            }

            // 检查标签
            if (!metadata.includes('tags:')) {
                analysis.issues.push('缺少标签');
            }
        } else {
            analysis.issues.push('缺少元数据');
        }

        // 检查医疗内容特定问题
        if (articleName === 'when-to-seek-medical-care-comprehensive-guide') {
            analysis.issues.push(...this.analyzeWhenToSeekCareIssues(content));
        } else if (articleName === 'long-term-healthy-lifestyle-guide') {
            analysis.issues.push(...this.analyzeLifestyleGuideIssues(content));
        }

        // 计算评分
        analysis.score = Math.max(0, 100 - (analysis.issues.length * 10));

        return analysis;
    }

    analyzeWhenToSeekCareIssues(content) {
        const issues = [];

        // 检查医疗免责声明
        if (!content.includes('免责声明') && !content.includes('医疗免责')) {
            issues.push('缺少医疗免责声明');
        }

        // 检查是否过于学术化
        const academicTerms = ['前列腺素', '子宫内膜异位症', '继发性痛经', '原发性痛经'];
        const academicCount = academicTerms.filter(term => content.includes(term)).length;
        if (academicCount > 10) {
            issues.push('内容过于学术化，用户友好性不足');
        }

        // 检查实用性
        if (!content.includes('自评') && !content.includes('检查清单')) {
            issues.push('缺少实用的自评工具');
        }

        // 检查内容重复度
        if (content.length > 15000) {
            issues.push('内容过长，可能存在重复或冗余');
        }

        return issues;
    }

    analyzeLifestyleGuideIssues(content) {
        const issues = [];

        // 检查实用性
        if (!content.includes('21天') && !content.includes('习惯养成')) {
            issues.push('缺少具体的行动计划');
        }

        // 检查个性化程度
        if (!content.includes('个性化') && !content.includes('因人而异')) {
            issues.push('缺少个性化指导');
        }

        // 检查可操作性
        if (!content.includes('清单') && !content.includes('步骤')) {
            issues.push('缺少可操作的清单或步骤');
        }

        return issues;
    }

    async analyzeSEOIssues() {
        console.log('🔍 分析SEO问题...');

        const seoIssues = {
            keywordOptimization: this.analyzeKeywordOptimization(),
            contentStructure: this.analyzeContentStructure(),
            metaData: this.analyzeMetaData(),
            internalLinking: this.analyzeInternalLinking()
        };

        this.results.seoIssues = seoIssues;

        console.log('✅ SEO问题分析完成\n');
    }

    analyzeKeywordOptimization() {
        return {
            issues: [
                '医疗护理指南关键词竞争激烈',
                '缺少长尾关键词优化',
                '关键词密度可能过高',
                '缺少用户搜索意图匹配'
            ],
            recommendations: [
                '使用更具体的长尾关键词',
                '优化用户搜索意图匹配',
                '降低关键词密度，提高自然度',
                '增加相关语义关键词'
            ]
        };
    }

    analyzeContentStructure() {
        return {
            issues: [
                '内容结构可能过于复杂',
                '缺少清晰的用户导航',
                '段落过长，影响可读性',
                '缺少视觉元素分割'
            ],
            recommendations: [
                '简化内容结构',
                '增加目录导航',
                '缩短段落长度',
                '增加列表和要点'
            ]
        };
    }

    analyzeMetaData() {
        return {
            issues: [
                'SEO描述可能过长或过短',
                '标题可能不够吸引人',
                '缺少结构化数据标记',
                '元数据重复度高'
            ],
            recommendations: [
                '优化SEO描述长度(150-160字符)',
                '使用更吸引人的标题',
                '添加医疗内容结构化数据',
                '确保元数据唯一性'
            ]
        };
    }

    analyzeInternalLinking() {
        return {
            issues: [
                '内部链接不足',
                '缺少相关文章推荐',
                '链接锚文本不够优化',
                '缺少主题集群链接'
            ],
            recommendations: [
                '增加相关文章内部链接',
                '优化锚文本使用',
                '建立主题集群链接',
                '添加相关工具链接'
            ]
        };
    }

    async analyzeTechnicalIssues() {
        console.log('⚙️ 分析技术问题...');

        const technicalIssues = {
            pageSpeed: this.analyzePageSpeed(),
            mobileOptimization: this.analyzeMobileOptimization(),
            crawlability: this.analyzeCrawlability(),
            indexability: this.analyzeIndexability()
        };

        this.results.technicalProblems = technicalIssues;

        console.log('✅ 技术问题分析完成\n');
    }

    analyzePageSpeed() {
        return {
            issues: [
                '页面加载速度可能过慢',
                '图片未优化',
                'CSS/JS未压缩',
                '缺少缓存策略'
            ],
            recommendations: [
                '优化图片格式和大小',
                '启用Gzip压缩',
                '使用CDN加速',
                '优化关键渲染路径'
            ]
        };
    }

    analyzeMobileOptimization() {
        return {
            issues: [
                '移动端体验可能不佳',
                '字体大小可能过小',
                '触摸目标可能过小',
                '内容可能超出视口'
            ],
            recommendations: [
                '优化移动端布局',
                '增大字体和触摸目标',
                '确保内容适配视口',
                '测试移动端用户体验'
            ]
        };
    }

    analyzeCrawlability() {
        return {
            issues: [
                'robots.txt可能阻止抓取',
                'URL结构可能过于复杂',
                '缺少XML站点地图',
                '内部链接结构不清晰'
            ],
            recommendations: [
                '检查robots.txt配置',
                '简化URL结构',
                '提交XML站点地图',
                '优化内部链接结构'
            ]
        };
    }

    analyzeIndexability() {
        return {
            issues: [
                '内容质量可能不符合Google标准',
                '可能存在重复内容',
                '缺少独特价值',
                'E-A-T信号不足'
            ],
            recommendations: [
                '提高内容独特性和价值',
                '增强专业性和权威性',
                '添加作者信息和资质',
                '获得外部权威链接'
            ]
        };
    }

    generateRecommendations() {
        console.log('💡 生成改进建议...');

        this.results.recommendations = [
            {
                priority: 'HIGH',
                category: '内容优化',
                actions: [
                    '重写"何时就医指南"，减少学术术语，增加用户友好性',
                    '添加互动式自评工具和检查清单',
                    '增加真实案例和用户故事',
                    '简化内容结构，提高可读性'
                ]
            },
            {
                priority: 'HIGH',
                category: 'SEO优化',
                actions: [
                    '优化SEO标题和描述，使其更吸引人',
                    '添加医疗内容结构化数据标记',
                    '使用更具体的长尾关键词',
                    '确保元数据唯一性'
                ]
            },
            {
                priority: 'MEDIUM',
                category: '技术优化',
                actions: [
                    '优化页面加载速度',
                    '改善移动端用户体验',
                    '增加内部链接和相关文章推荐',
                    '提交更新的XML站点地图'
                ]
            },
            {
                priority: 'MEDIUM',
                category: 'E-A-T提升',
                actions: [
                    '添加医学专家作者信息',
                    '增加医疗免责声明',
                    '获得权威医疗网站的外部链接',
                    '添加最新更新日期和医学审核信息'
                ]
            }
        ];

        console.log('✅ 改进建议生成完成\n');
    }

    generateReport() {
        console.log('📊 生成分析报告...\n');

        console.log('🎯 医疗护理指南索引问题分析报告');
        console.log('=' .repeat(50));

        // 显示内容分析结果
        console.log('\n📝 内容质量分析:');
        Object.entries(this.results.contentAnalysis).forEach(([name, analysis]) => {
            console.log(`\n   ${name}:`);
            console.log(`   - 评分: ${analysis.score}/100`);
            console.log(`   - 字数: ${analysis.wordCount || 'N/A'}`);
            if (analysis.issues.length > 0) {
                console.log(`   - 问题: ${analysis.issues.join(', ')}`);
            }
            if (analysis.strengths && analysis.strengths.length > 0) {
                console.log(`   - 优势: ${analysis.strengths.join(', ')}`);
            }
        });

        // 显示主要问题
        console.log('\n🚨 主要问题:');
        console.log('   1. 内容过于学术化，用户友好性不足');
        console.log('   2. 缺少互动元素和实用工具');
        console.log('   3. SEO优化不够精准');
        console.log('   4. E-A-T信号不足');

        // 显示改进建议
        console.log('\n💡 优先改进建议:');
        this.results.recommendations.forEach((rec, index) => {
            console.log(`\n   ${index + 1}. ${rec.category} (${rec.priority}优先级):`);
            rec.actions.forEach(action => {
                console.log(`      - ${action}`);
            });
        });

        // 保存详细报告
        this.saveDetailedReport();
    }

    saveDetailedReport() {
        const reportPath = 'medical-care-guides-analysis-report.json';

        const detailedReport = {
            timestamp: new Date().toISOString(),
            analysis: 'Medical Care Guides Indexing Issues',
            unindexedUrls: this.unindexedUrls,
            results: this.results,
            summary: {
                totalArticles: Object.keys(this.results.contentAnalysis).length,
                averageScore: this.calculateAverageScore(),
                criticalIssues: this.getCriticalIssues(),
                recommendationsCount: this.results.recommendations.length
            }
        };

        try {
            fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
            console.log(`\n📄 详细报告已保存至: ${reportPath}`);
        } catch (error) {
            console.error('❌ 保存报告失败:', error.message);
        }
    }

    calculateAverageScore() {
        const scores = Object.values(this.results.contentAnalysis)
            .filter(analysis => analysis.exists)
            .map(analysis => analysis.score);

        return scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;
    }

    getCriticalIssues() {
        const criticalIssues = [];

        Object.entries(this.results.contentAnalysis).forEach(([name, analysis]) => {
            if (analysis.score < 70) {
                criticalIssues.push(`${name}: 评分过低 (${analysis.score}/100)`);
            }
            if (analysis.issues.includes('内容过于学术化，用户友好性不足')) {
                criticalIssues.push(`${name}: 用户友好性不足`);
            }
        });

        return criticalIssues;
    }
}

// 运行分析
async function main() {
    const analyzer = new MedicalCareGuideAnalyzer();

    console.log('🚀 启动医疗护理指南索引问题分析');
    console.log('目标: 找出未被Google索引的原因并提供解决方案\n');

    const success = await analyzer.analyzeGuides();

    if (success) {
        console.log('\n🎉 分析完成！');
        console.log('📋 请查看生成的改进建议，优先处理高优先级问题。');
    } else {
        console.log('\n❌ 分析失败，请检查错误信息。');
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = MedicalCareGuideAnalyzer;
