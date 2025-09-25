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
      title: '伴侣沟通手册 - 30天暖心伴侣训练营 | Period Hub',
      description: '男朋友不理解痛经？通过30天训练营让他变成暖心伴侣。包含伴侣理解度测试、个性化训练计划、专业健康指导。',
      keywords: '伴侣沟通,痛经理解,暖心伴侣,训练营,伴侣支持,经期健康,关系改善',
    },
    en: {
      title: 'Partner Communication Handbook - Training Camp | Period Hub',
      description: 'Transform your partner into a caring supporter with our 30-day training camp. Includes understanding test and personalized training plan.',
      keywords: 'partner communication,period pain understanding,caring partner,training camp,partner support,menstrual health,relationship improvement',
    }
  };

  const currentMetadata = metadata[locale];

  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    openGraph: {
      title: currentMetadata.title,
      description: currentMetadata.description,
      type: 'website',
      locale: locale,
      siteName: 'Period Hub',
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMetadata.title,
      description: currentMetadata.description,
    },
    alternates: {
      canonical: `/${locale}/articles/partner-communication-handbook`,
      languages: {
        'zh': '/zh/articles/partner-communication-handbook',
        'en': '/en/articles/partner-communication-handbook',
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
