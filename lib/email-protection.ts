/**
 * 邮箱地址隐私保护工具
 * 用于动态生成和显示邮箱地址，防止爬虫抓取
 */

// Base64编码的邮箱地址
const ENCODED_EMAIL = 'dGl5aWJhb2Z1QG91dGxvb2suY29t';

/**
 * 解码邮箱地址
 * @returns 解码后的邮箱地址
 */
export function decodeEmail(): string {
  if (typeof window === 'undefined') {
    // 服务端渲染时返回占位符
    return 'contact@example.com';
  }
  
  try {
    return atob(ENCODED_EMAIL);
  } catch (error) {
    console.error('Failed to decode email:', error);
    return 'contact@example.com';
  }
}

/**
 * 生成mailto链接
 * @param subject 邮件主题
 * @param body 邮件正文
 * @returns mailto链接
 */
export function generateMailtoLink(subject?: string, body?: string): string {
  // 直接使用Base64编码，避免服务端渲染问题
  const ENCODED_EMAIL = 'dGl5aWJhb2Z1QG91dGxvb2suY29t';
  
  // 在服务端和客户端都使用相同的逻辑
  let email: string;
  try {
    email = typeof atob !== 'undefined' ? atob(ENCODED_EMAIL) : 'tiyibaofu@outlook.com';
  } catch (error) {
    email = 'tiyibaofu@outlook.com';
  }
  
  let mailto = `mailto:${email}`;
  
  if (subject || body) {
    const params = new URLSearchParams();
    if (subject) {
      params.append('subject', subject);
    }
    if (body) {
      params.append('body', body);
    }
    mailto += `?${params.toString()}`;
  }
  
  return mailto;
}

/**
 * 显示邮箱地址（带反爬虫保护）
 * @returns 格式化的邮箱显示文本
 */
export function displayEmail(): string {
  if (typeof window === 'undefined') {
    return '联系我们';
  }
  
  const email = decodeEmail();
  // 添加一些视觉混淆，但仍然可读
  return email.replace('@', ' [at] ');
}

/**
 * 生成邮箱图片数据URL（用于重要页面）
 * @returns 邮箱图片的data URL
 */
export function generateEmailImageUrl(): string {
  const email = decodeEmail();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="20" viewBox="0 0 200 20">
      <text x="10" y="15" font-family="Arial, sans-serif" font-size="12" fill="#333">
        ${email}
      </text>
    </svg>
  `;
  
  if (typeof window === 'undefined') {
    return '';
  }
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 邮箱验证工具
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 生成联系表单的默认值
 */
export function getContactFormDefaults() {
  return {
    email: '',
    subject: '网站咨询',
    message: '',
    source: 'website',
    timestamp: new Date().toISOString(),
  };
}
