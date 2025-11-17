import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Locale } from './types/common';
import PartnerHandbookClient from './components/PartnerHandbookClient';

interface PartnerHandbookPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PartnerHandbookPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const metadata = {
    zh: {
      title: '伴侣沟通场景 - 痛经理解度测试与30天训练营 | Period Hub',
      description: '专业的伴侣沟通场景解决方案，包含理解度测试、30天训练营和个性化指导。帮助伴侣更好地理解痛经，提供针对性的沟通策略和情感支持技巧。基于循证医学的专业指导，适合各年龄段伴侣使用。',
      keywords: '伴侣沟通,痛经理解,伴侣支持,情感沟通,关系改善,痛经教育,伴侣训练营,理解度测试',
    },
    en: {
      title: 'Partner Communication Scenario - Understanding Test & Training | Period Hub',
      description: 'Professional partner communication scenario solutions with understanding test, 30-day training camp and personalized guidance. Help partners better understand period pain with targeted communication strategies and emotional support techniques.',
      keywords: 'partner communication,period pain understanding,partner support,emotional communication,relationship improvement,period education,partner training camp,understanding test',
    }
  };

  const currentMetadata = metadata[locale];

  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    other: {
      'http-equiv': 'content-language',
      content: locale === 'zh' ? 'zh-CN' : 'en-US',
    },
    openGraph: {
      title: currentMetadata.title,
      description: currentMetadata.description,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Period Hub',
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMetadata.title,
      description: currentMetadata.description,
    },
    alternates: {
      canonical: `/${locale}/scenario-solutions/partnerCommunication`,
      languages: {
        'zh': '/zh/scenario-solutions/partnerCommunication',
        'en': '/en/scenario-solutions/partnerCommunication',
      },
    },
  };
}

export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' },
  ];
}

export default async function PartnerHandbookPage({ params }: PartnerHandbookPageProps) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  return <PartnerHandbookClient locale={locale} />;
}
