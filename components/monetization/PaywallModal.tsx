"use client";

import { X, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface PaywallModalProps {
  painPoint?: string;
  assessmentScore?: number;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

export default function PaywallModal({ 
  painPoint: _painPoint = 'unknown', 
  assessmentScore: _assessmentScore = 0,
  onClose, 
  onUpgrade 
}: PaywallModalProps) {
  // painPoint和assessmentScore当前未使用，但保留接口兼容性
  void _painPoint;
  void _assessmentScore;
  const t = useTranslations('Pro.pricing');

  const plans = [
    {
      id: 'monthly',
      name: t('plans.monthly.name'),
      price: t('plans.monthly.price'),
      features: Array.isArray(t.raw('plans.monthly.features')) ? (t.raw('plans.monthly.features') as string[]) : [],
      recommended: false
    },
    {
      id: 'yearly',
      name: t('plans.yearly.name'),
      price: t('plans.yearly.price'),
      features: Array.isArray(t.raw('plans.yearly.features')) ? (t.raw('plans.yearly.features') as string[]) : [],
      recommended: true
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {t('hero.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {t('hero.subtitle')}
          </p>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-xl p-4 ${plan.recommended
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                  }`}
              >
                {plan.recommended && (
                  <div className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full inline-block mb-2">
                    {t('plans.yearly.badge')}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-2xl font-bold text-purple-600 mb-4">
                  {plan.price}
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => onUpgrade(plan.id)}
                  className={`w-full ${plan.recommended
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                >
                  {t('buttons.subscribe')}
                </Button>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {t('faq.title')}
            </h4>
            <p className="text-sm text-gray-600">
              {t('support.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}