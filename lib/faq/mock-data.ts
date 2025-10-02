import { FAQ } from '../../types/faq';

export const mockFAQs: FAQ[] = [
  {
    id: 'faq-001',
    question: '痛经是什么？',
    answer: '痛经是指女性在月经期间出现的下腹部疼痛，通常表现为痉挛性疼痛，可能伴有腰痛、头痛等症状。痛经分为原发性痛经和继发性痛经两种类型。',
    category: 'basic-knowledge',
    tags: ['痛经', '基础知识', '月经'],
    priority: 1,
    lastUpdated: new Date(),
    locale: 'zh'
  },
  {
    id: 'faq-002',
    question: '如何快速缓解痛经？',
    answer: '快速缓解痛经的方法包括：1）热敷下腹部；2）适量运动如散步；3）按摩腹部；4）服用非处方止痛药；5）保持充足睡眠和规律作息。',
    category: 'pain-relief',
    tags: ['痛经', '缓解', '疼痛'],
    priority: 2,
    lastUpdated: new Date(),
    locale: 'zh'
  },
  {
    id: 'faq-003',
    question: '什么时候需要看医生？',
    answer: '如果痛经严重影响日常生活，或出现以下症状应及时就医：疼痛持续加重、月经量异常、发热、恶心呕吐等。医生会根据症状进行相应检查和治疗。',
    category: 'medical-care',
    tags: ['就医', '医生', '检查'],
    priority: 3,
    lastUpdated: new Date(),
    locale: 'zh'
  },
  {
    id: 'faq-004',
    question: '痛经期间应该注意什么饮食？',
    answer: '痛经期间建议：1）多喝温水，避免冷饮；2）适量补充铁质，如瘦肉、菠菜；3）避免辛辣、油腻食物；4）适量补充维生素B6和镁；5）避免咖啡因和酒精。',
    category: 'lifestyle',
    tags: ['饮食', '营养', '生活'],
    priority: 4,
    lastUpdated: new Date(),
    locale: 'zh'
  },
  {
    id: 'faq-005',
    question: '痛经可以吃什么药？',
    answer: '常用的痛经药物包括：1）非甾体抗炎药（如布洛芬）；2）对乙酰氨基酚；3）避孕药（需医生指导）；4）中药调理。用药前请咨询医生，避免自行用药。',
    category: 'medication',
    tags: ['药物', '止痛', '治疗'],
    priority: 5,
    lastUpdated: new Date(),
    locale: 'zh'
  },
  {
    id: 'faq-006',
    question: '痛经会影响生育吗？',
    answer: '大多数原发性痛经不会影响生育能力。但如果是继发性痛经（如子宫内膜异位症），可能会影响生育。建议有生育计划的女性及时就医检查，排除相关疾病。',
    category: 'basic-knowledge',
    tags: ['生育', '怀孕', '健康'],
    priority: 6,
    lastUpdated: new Date(),
    locale: 'zh'
  },
  {
    id: 'faq-007',
    question: '运动对痛经有帮助吗？',
    answer: '适量运动对缓解痛经有帮助：1）促进血液循环；2）释放内啡肽，天然止痛；3）改善情绪；4）增强体质。推荐瑜伽、散步、游泳等温和运动，避免剧烈运动。',
    category: 'lifestyle',
    tags: ['运动', '锻炼', '健康'],
    priority: 7,
    lastUpdated: new Date(),
    locale: 'zh'
  },
  {
    id: 'faq-008',
    question: '痛经会随着年龄减轻吗？',
    answer: '原发性痛经通常在生育后或30岁后有所减轻，因为激素水平变化。但继发性痛经可能随年龄加重。如果痛经持续或加重，建议及时就医检查。',
    category: 'basic-knowledge',
    tags: ['年龄', '变化', '发展'],
    priority: 8,
    lastUpdated: new Date(),
    locale: 'zh'
  }
];

// 英文版本FAQ数据
export const mockFAQsEN: FAQ[] = [
  {
    id: 'faq-en-001',
    question: 'What is menstrual pain?',
    answer: 'Menstrual pain, also known as dysmenorrhea, refers to cramping pain in the lower abdomen during menstruation. It can be accompanied by back pain, headaches, and other symptoms.',
    category: 'basic-knowledge',
    tags: ['menstrual pain', 'basics', 'menstruation'],
    priority: 1,
    lastUpdated: new Date(),
    locale: 'en'
  },
  {
    id: 'faq-en-002',
    question: 'How to quickly relieve menstrual pain?',
    answer: 'Quick relief methods include: 1) Apply heat to the lower abdomen; 2) Light exercise like walking; 3) Abdominal massage; 4) Over-the-counter pain relievers; 5) Adequate sleep and regular routine.',
    category: 'pain-relief',
    tags: ['relief', 'pain', 'quick'],
    priority: 2,
    lastUpdated: new Date(),
    locale: 'en'
  },
  {
    id: 'faq-en-003',
    question: 'When should I see a doctor?',
    answer: 'Seek medical attention if menstrual pain severely affects daily life or if you experience: worsening pain, abnormal bleeding, fever, nausea, or vomiting. A doctor can provide appropriate examination and treatment.',
    category: 'medical-care',
    tags: ['doctor', 'medical', 'examination'],
    priority: 3,
    lastUpdated: new Date(),
    locale: 'en'
  }
];

// 根据语言获取FAQ数据
export const getFAQsByLocale = (locale: 'zh' | 'en'): FAQ[] => {
  return locale === 'zh' ? mockFAQs : mockFAQsEN;
};

// 根据分类获取FAQ数据
export const getFAQsByCategory = (category: string, locale: 'zh' | 'en' = 'zh'): FAQ[] => {
  const faqs = getFAQsByLocale(locale);
  return category === 'all' ? faqs : faqs.filter(faq => faq.category === category);
};
