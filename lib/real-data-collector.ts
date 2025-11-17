// 真实数据收集系统核心组件
// 基于Day 5框架，升级为真实数据处理

interface RealUserSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  device: {
    type: 'mobile' | 'desktop' | 'tablet';
    browser: string;
    os: string;
    screenResolution: string;
  };
  navigation: {
    entryPage: string;
    pagesVisited: string[];
    timeOnEachPage: { [page: string]: number };
    scrollDepth: { [page: string]: number };
  };
  interactions: {
    clicks: number;
    hovers: number;
    formSubmissions: number;
    timeSpent: number;
  };
  conversion: {
    assessmentStarted: boolean;
    assessmentCompleted: boolean;
    paywallReached: boolean;
    feedbackSubmitted: boolean;
    phq9Started: boolean;
    phq9Completed: boolean;
  };
  abTestVariant: 'control' | 'treatment';
}

interface RealFeedbackData {
  id: string;
  sessionId: string;
  userId: string;
  timestamp: Date;
  feature: string;
  page: string;
  rating: number; // 1-5
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  userType: 'new' | 'returning';
  device: string;
  timeSpent: number;
  metadata: {
    browser: string;
    referrer: string;
    utmSource?: string;
    utmCampaign?: string;
  };
}

class RealDataCollector {
  private sessions: Map<string, RealUserSession> = new Map();
  private currentSession: RealUserSession | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeDataCollection();
  }

  private async initializeDataCollection() {
    // 检查用户同意
    if (!this.hasUserConsent()) {
      console.log('用户未同意数据收集');
      return;
    }

    // 创建或恢复用户会话
    const userId = this.getOrCreateUserId();
    const sessionId = this.generateSessionId();
    
    this.currentSession = {
      sessionId,
      userId,
      startTime: new Date(),
      device: this.detectDevice(),
      navigation: {
        entryPage: window.location.pathname,
        pagesVisited: [window.location.pathname],
        timeOnEachPage: {},
        scrollDepth: {}
      },
      interactions: {
        clicks: 0,
        hovers: 0,
        formSubmissions: 0,
        timeSpent: 0
      },
      conversion: {
        assessmentStarted: false,
        assessmentCompleted: false,
        paywallReached: false,
        feedbackSubmitted: false,
        phq9Started: false,
        phq9Completed: false
      },
      abTestVariant: this.getABTestVariant(userId)
    };

    this.sessions.set(sessionId, this.currentSession);
    this.isInitialized = true;

    // 设置自动数据上传
    this.setupAutoUpload();
    
    // 设置页面卸载事件处理
    this.setupPageLifecycleHandlers();
    
    // 开始计时
    this.startTiming();
  }

  private hasUserConsent(): boolean {
    // 检查本地存储中的用户同意状态
    const consent = localStorage.getItem('data_collection_consent');
    if (consent === 'granted') {
      return true;
    }
    
    // 如果没有同意，显示同意对话框
    this.showConsentDialog();
    return false;
  }

  private showConsentDialog() {
    const consentHTML = `
      <div id="data-consent-dialog" style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          background: white; padding: 2rem; border-radius: 8px;
          max-width: 500px; margin: 1rem;
        ">
          <h3>数据收集同意</h3>
          <p>为了改善我们的服务，我们希望收集一些匿名使用数据，包括：</p>
          <ul>
            <li>页面访问和使用时长</li>
            <li>功能使用情况</li>
            <li>设备信息（浏览器类型、屏幕尺寸）</li>
            <li>匿名化的用户反馈</li>
          </ul>
          <p>这些数据将用于改善产品体验，不包含任何个人身份信息。</p>
          <div style="margin-top: 1rem;">
            <button id="consent-accept" style="
              background: #007bff; color: white; border: none;
              padding: 0.5rem 1rem; margin-right: 1rem; border-radius: 4px;
            ">同意</button>
            <button id="consent-decline" style="
              background: #6c757d; color: white; border: none;
              padding: 0.5rem 1rem; border-radius: 4px;
            ">不同意</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', consentHTML);

    // 处理同意按钮
    document.getElementById('consent-accept')?.addEventListener('click', () => {
      localStorage.setItem('data_collection_consent', 'granted');
      localStorage.setItem('consent_timestamp', new Date().toISOString());
      document.getElementById('data-consent-dialog')?.remove();
      this.initializeDataCollection(); // 重新初始化
    });

    // 处理拒绝按钮
    document.getElementById('consent-decline')?.addEventListener('click', () => {
      localStorage.setItem('data_collection_consent', 'declined');
      localStorage.setItem('consent_timestamp', new Date().toISOString());
      document.getElementById('data-consent-dialog')?.remove();
    });
  }

  private getOrCreateUserId(): string {
    let userId = localStorage.getItem('anonymous_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('anonymous_user_id', userId);
    }
    return userId;
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private detectDevice() {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    return {
      type: (isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop')) as 'mobile' | 'tablet' | 'desktop',
      browser: this.getBrowserName(userAgent),
      os: this.getOSName(userAgent),
      screenResolution: `${screen.width}x${screen.height}`
    };
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOSName(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  private getABTestVariant(userId: string): 'control' | 'treatment' {
    // 使用哈希函数确保用户一致性分配
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return hash % 2 === 0 ? 'control' : 'treatment';
  }

  // 记录页面访问
  public recordPageView(pagePath: string, timeOnPage?: number) {
    if (!this.currentSession) return;

    const currentTime = Date.now();
    
    // 更新页面访问记录
    if (!this.currentSession.navigation.pagesVisited.includes(pagePath)) {
      this.currentSession.navigation.pagesVisited.push(pagePath);
    }

    // 记录在每个页面的时间
    const timeSpent = timeOnPage || (currentTime - this.currentSession.startTime.getTime());
    this.currentSession.navigation.timeOnEachPage[pagePath] = 
      (this.currentSession.navigation.timeOnEachPage[pagePath] || 0) + timeSpent;

    this.currentSession.interactions.timeSpent += timeSpent;
  }

  // 记录用户交互
  public recordInteraction(type: 'click' | 'hover' | 'form_submission') {
    if (!this.currentSession) return;

    switch (type) {
      case 'click':
        this.currentSession.interactions.clicks++;
        break;
      case 'hover':
        this.currentSession.interactions.hovers++;
        break;
      case 'form_submission':
        this.currentSession.interactions.formSubmissions++;
        break;
    }
  }

  // 记录转化事件
  public recordConversion(event: keyof RealUserSession['conversion']) {
    if (!this.currentSession) return;
    
    this.currentSession.conversion[event] = true;
    
    // 立即上传重要的转化事件
    if (['assessmentCompleted', 'feedbackSubmitted', 'phq9Completed'].includes(event)) {
      this.uploadData();
    }
  }

  // 记录滚动深度
  public recordScrollDepth(pagePath: string, scrollDepth: number) {
    if (!this.currentSession) return;
    
    this.currentSession.navigation.scrollDepth[pagePath] = 
      Math.max(this.currentSession.navigation.scrollDepth[pagePath] || 0, scrollDepth);
  }

  // 收集用户反馈
  public async collectFeedback(feedback: Omit<RealFeedbackData, 'id' | 'sessionId' | 'userId' | 'timestamp' | 'sentiment' | 'topics'>) {
    const feedbackId = 'feedback_' + Math.random().toString(36).substr(2, 9);
    
    // 简单的情感分析
    const sentiment = this.analyzeSentiment(feedback.comment);
    
    // 提取主题
    const topics = this.extractTopics(feedback.comment);
    
    const realFeedback: RealFeedbackData = {
      id: feedbackId,
      sessionId: this.currentSession?.sessionId || 'unknown',
      userId: this.currentSession?.userId || 'unknown',
      timestamp: new Date(),
      sentiment,
      topics,
      ...feedback
    };

    // 保存到本地存储
    this.saveFeedbackLocally(realFeedback);
    
    // 立即上传反馈数据
    await this.uploadFeedback(realFeedback);

    return realFeedback;
  }

  private analyzeSentiment(comment: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['好', '满意', '喜欢', '有用', '不错', '棒', '优秀', '推荐', 'good', 'great', 'excellent', 'love', 'amazing'];
    const negativeWords = ['差', '不满意', '糟糕', '没用', '不好', '差劲', '失望', 'bad', 'terrible', 'hate', 'awful', 'useless'];
    
    const lowerComment = comment.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerComment.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerComment.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractTopics(comment: string): string[] {
    const topics = [];
    const topicKeywords = {
      'performance': ['慢', '快', '卡', '加载', '性能', 'speed', 'slow', 'fast', 'loading'],
      'ui_ux': ['界面', '设计', '美观', '复杂', '简单', 'ui', 'design', 'beautiful', 'complex', 'simple'],
      'functionality': ['功能', '有用', '实用', '功能缺失', 'function', 'useful', 'practical', 'missing'],
      'content': ['内容', '信息', '建议', '有用', 'content', 'information', 'advice', 'helpful'],
      'mobile': ['手机', '移动', '手机版', 'mobile', 'phone', 'responsive']
    };

    const lowerComment = comment.toLowerCase();
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerComment.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  private saveFeedbackLocally(feedback: RealFeedbackData) {
    const existingFeedback = JSON.parse(localStorage.getItem('user_feedback_data') || '[]');
    existingFeedback.push(feedback);
    
    // 只保留最近1000条反馈
    if (existingFeedback.length > 1000) {
      existingFeedback.splice(0, existingFeedback.length - 1000);
    }
    
    localStorage.setItem('user_feedback_data', JSON.stringify(existingFeedback));
  }

  private setupAutoUpload() {
    // 每5分钟自动上传一次数据
    setInterval(() => {
      this.uploadData();
    }, 5 * 60 * 1000);
  }

  private setupPageLifecycleHandlers() {
    // 页面卸载时保存数据
    window.addEventListener('beforeunload', () => {
      this.endSession();
      this.uploadData();
    });

    // 页面隐藏时暂停计时
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });
  }

  private startTiming() {
    setInterval(() => {
      if (this.currentSession && !document.hidden) {
        this.currentSession.interactions.timeSpent += 1000; // 每秒增加1秒
      }
    }, 1000);
  }

  private pauseSession() {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
    }
  }

  private resumeSession() {
    if (this.currentSession && this.currentSession.endTime) {
      const pauseDuration = new Date().getTime() - this.currentSession.endTime.getTime();
      this.currentSession.startTime = new Date(this.currentSession.startTime.getTime() + pauseDuration);
      this.currentSession.endTime = undefined;
    }
  }

  private endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
    }
  }

  private async uploadData() {
    if (!this.currentSession || !this.isInitialized) return;

    try {
      const sessionData = {
        ...this.currentSession,
        uploadTimestamp: new Date().toISOString()
      };

      // 这里应该是实际的上传到您的分析服务的代码
      console.log('上传用户会话数据:', sessionData);
      
      // 模拟API调用
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });

    } catch (error) {
      console.error('数据上传失败:', error);
      // 上传失败时，数据会保留在本地，下一次会重试
    }
  }

  private async uploadFeedback(feedback: RealFeedbackData) {
    try {
      // 这里应该是实际的上传反馈数据的代码
      console.log('上传用户反馈数据:', feedback);
      
      // 模拟API调用
      await fetch('/api/analytics/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });

    } catch (error) {
      console.error('反馈数据上传失败:', error);
    }
  }

  // 获取当前会话数据（用于调试）
  public getCurrentSession(): RealUserSession | null {
    return this.currentSession;
  }

  // 手动结束会话
  public endCurrentSession() {
    this.endSession();
    this.uploadData();
    this.currentSession = null;
  }
}

// 导出单例实例
export const realDataCollector = new RealDataCollector();

// 使用示例：
/*
// 在应用入口启动数据收集
useEffect(() => {
  realDataCollector.recordPageView(window.location.pathname);
}, []);

// 在用户完成评估时记录转化
const handleAssessmentComplete = () => {
  realDataCollector.recordConversion('assessmentCompleted');
};

// 在用户提交反馈时
const handleFeedbackSubmit = (rating, comment) => {
  realDataCollector.collectFeedback({
    feature: 'stress_assessment',
    page: window.location.pathname,
    rating,
    comment,
    userType: 'returning',
    device: navigator.userAgent,
    timeSpent: 300 // 假设用户花费了5分钟
  });
};
*/

export type { RealUserSession, RealFeedbackData };