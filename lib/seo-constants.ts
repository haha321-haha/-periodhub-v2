/**
 * SEO 相关常量配置
 * 统一管理所有 SEO 相关的路径和配置，避免硬编码
 */

/**
 * Open Graph 图片路径配置
 * 所有 OG 图片统一放在 /images/ 目录下
 */
export const OG_IMAGES = {
  /** 默认 OG 图片 - 用于所有未指定 OG 图片的页面 */
  DEFAULT: "/images/og-default.jpg",
  
  /** 首页 Hero 背景图 */
  HERO: "/images/hero-bg.jpg",
  
  /** 文章默认图片 */
  ARTICLE_DEFAULT: "/images/article-image.jpg",
  
  /** 营养推荐生成器 OG 图片 */
  NUTRITION_GENERATOR: "/images/nutrition-generator-og.jpg",
  
  /** 营养推荐生成器 Twitter 图片 */
  NUTRITION_GENERATOR_TWITTER: "/images/nutrition-generator-twitter.jpg",
  
  /** 职场健康助手 OG 图片（中文） */
  WORKPLACE_WELLNESS_ZH: "/images/workplace-wellness-og-zh.jpg",
  
  /** 职场健康助手 OG 图片（英文） */
  WORKPLACE_WELLNESS_EN: "/images/workplace-wellness-og-en.jpg",
} as const;

/**
 * SEO 元数据默认配置
 */
export const SEO_DEFAULTS = {
  /** 默认 OG 图片 */
  OG_IMAGE: OG_IMAGES.DEFAULT,
  
  /** 默认站点名称 */
  SITE_NAME: "PeriodHub",
  
  /** Twitter 创建者 */
  TWITTER_CREATOR: "@periodhub",
  
  /** 主题色 */
  THEME_COLOR: "#ff6b9d",
} as const;

