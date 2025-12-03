import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
  Clock,
  Pill,
  Leaf,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function ComparisonSection() {
  const t = useTranslations("comparison");
  const locale = useLocale();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("title")}</h2>
        <p className="text-xl text-purple-600 font-medium">{t("subtitle")}</p>
      </div>

      <div className="relative flex flex-col md:flex-row gap-8 items-stretch justify-center">
        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl border-4 border-gray-50 font-black text-xl text-gray-800">
          {t("vs")}
        </div>

        {/* Left Card: Pills */}
        <div className="flex-1 bg-gray-50 rounded-3xl p-8 border border-gray-200 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Pill size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <Pill className="w-5 h-5" />
              <span className="font-semibold tracking-wide uppercase text-sm">
                {t("pills.title")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400"
                >
                  <Pill size={16} />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{t("pills.duration")}</span>
              </div>
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{t("pills.cons")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Natural Relief */}
        <div className="flex-1 bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl transform md:scale-105 z-0">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Leaf size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-purple-100 mb-4">
              <Leaf className="w-5 h-5" />
              <span className="font-semibold tracking-wide uppercase text-sm">
                {t("natural.title")}
              </span>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
              <Leaf size={32} className="text-white" />
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1 rounded-full">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg">
                  {t("natural.duration")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg">{t("natural.pros")}</span>
              </div>
            </div>

            <Link
              href={`/${locale}/immediate-relief`}
              className="inline-flex items-center justify-center w-full py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors"
            >
              {t("subtitle")} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
