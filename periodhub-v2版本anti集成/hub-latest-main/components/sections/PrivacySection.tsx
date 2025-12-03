'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Shield, Calendar, Lock } from 'lucide-react';
import { markMedicalTermsInText } from '@/lib/seo/medical-terminology';

export default function PrivacySection() {
  const t = useTranslations('privacySection');
  const locale = useLocale();
  const localeTyped = locale as "en" | "zh";
  
  const subtitle = t('subtitle');
  const markedSubtitle = markMedicalTermsInText(subtitle, localeTyped);

  return (
    <section 
      id="privacy" 
      className="py-20 px-4 sm:px-6 lg:px-8"
      data-ai-searchable="true"
      data-entity="PRIVACY_POLICY"
      data-quotable="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            {t('title')}
          </h2>
          <p 
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: markedSubtitle }}
          />
        </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="space-y-6">
            {/* 100% Local Storage */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {t('features.localStorage.title')}
                </h3>
                <p 
                  className="text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ 
                    __html: markMedicalTermsInText(t('features.localStorage.description'), localeTyped) 
                  }}
                />
              </div>
            </div>

            {/* HIPAA & CCPA Compliant */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {t('features.hipaaCompliant.title')}
                </h3>
                <p 
                  className="text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ 
                    __html: markMedicalTermsInText(t('features.hipaaCompliant.description'), localeTyped) 
                  }}
                />
              </div>
            </div>

            {/* End-to-End Encryption */}
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {t('features.encryption.title')}
                </h3>
                <p 
                  className="text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ 
                    __html: markMedicalTermsInText(t('features.encryption.description'), localeTyped) 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-6 dark:text-white">
            {t('disclaimer.title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('disclaimer.paragraph1')}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('disclaimer.paragraph2')}
          </p>

          <h4 className="font-semibold mb-3 dark:text-white">
            {t('disclaimer.dataPrivacyTitle')}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('disclaimer.dataPrivacyText')}
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}

