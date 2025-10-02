import Fuse from 'fuse.js';
import { FAQ, SearchResult, SearchOptions, FuseResultMatch } from '../../types/faq';

export class FaqSearchEngine {
  private fuse: Fuse<FAQ>;
  private faqs: FAQ[];

  constructor(faqs: FAQ[]) {
    this.faqs = faqs;
    this.initializeFuse();
  }

  private initializeFuse() {
    const options: Fuse.IFuseOptions<FAQ> = {
      keys: [
        { name: 'question', weight: 0.7 },
        { name: 'answer', weight: 0.3 },
        { name: 'tags', weight: 0.5 }
      ],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true
    };

    this.fuse = new Fuse(this.faqs, options);
  }

  // 基础搜索
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    if (!query.trim()) {
      return this.getDefaultResults(options);
    }

    const fuseResults = this.fuse.search(query, {
      limit: options.maxResults || 20
    });

    return fuseResults.map(result => ({
      faq: result.item,
      score: result.score || 0,
      matches: result.matches || [],
      highlights: this.generateHighlights(result.matches || [])
    }));
  }

  // 分类筛选搜索
  searchWithCategory(query: string, category: string, options: SearchOptions = {}): SearchResult[] {
    const filteredFaqs = category === 'all' 
      ? this.faqs 
      : this.faqs.filter(faq => faq.category === category);

    // 临时创建新的Fuse实例用于筛选后的数据
    const tempFuse = new Fuse(filteredFaqs, this.fuse.options);
    
    if (!query.trim()) {
      return filteredFaqs.slice(0, options.maxResults || 20).map(faq => ({
        faq,
        score: 0,
        matches: [],
        highlights: []
      }));
    }

    const results = tempFuse.search(query, {
      limit: options.maxResults || 20
    });

    return results.map(result => ({
      faq: result.item,
      score: result.score || 0,
      matches: result.matches || [],
      highlights: this.generateHighlights(result.matches || [])
    }));
  }

  // 生成高亮信息
  private generateHighlights(matches: FuseResultMatch[]): string[] {
    return matches.map(match => {
      if (!match.indices || !match.value) return '';
      
      let highlighted = match.value;
      // 从后往前替换，避免索引偏移
      for (let i = match.indices.length - 1; i >= 0; i--) {
        const [start, end] = match.indices[i];
        highlighted = 
          highlighted.slice(0, start) + 
          '<mark>' + 
          highlighted.slice(start, end + 1) + 
          '</mark>' + 
          highlighted.slice(end + 1);
      }
      return highlighted;
    });
  }

  // 获取默认结果（无搜索时）
  private getDefaultResults(options: SearchOptions): SearchResult[] {
    const faqs = options.category && options.category !== 'all'
      ? this.faqs.filter(faq => faq.category === options.category)
      : this.faqs;

    return faqs
      .slice(0, options.maxResults || 20)
      .map(faq => ({
        faq,
        score: 0,
        matches: [],
        highlights: []
      }));
  }

  // 更新FAQ数据
  updateFaqs(faqs: FAQ[]) {
    this.faqs = faqs;
    this.initializeFuse();
  }

  // 获取搜索建议
  getSearchSuggestions(query: string, limit: number = 5): string[] {
    if (query.length < 2) return [];

    const suggestions: string[] = [];
    
    // 从FAQ问题中提取建议
    this.faqs.forEach(faq => {
      if (faq.question.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(faq.question);
      }
    });

    // 从标签中提取建议
    this.faqs.forEach(faq => {
      faq.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query.toLowerCase()) && !suggestions.includes(tag)) {
          suggestions.push(tag);
        }
      });
    });

    return suggestions.slice(0, limit);
  }

  // 获取热门搜索词
  getPopularSearches(limit: number = 10): string[] {
    const tagCounts: { [key: string]: number } = {};
    
    this.faqs.forEach(faq => {
      faq.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);
  }
}
