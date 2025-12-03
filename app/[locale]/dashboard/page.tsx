import { User, Crown, Settings, FileText, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Crown className="w-10 h-10" />
            <h1 className="text-3xl font-bold">{t("welcome")}</h1>
          </div>
          <p className="text-xl text-purple-100">{t("subtitle")}</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Health Assessment */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("cards.assessment.title")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t("cards.assessment.description")}
            </p>
            <Button className="w-full">
              <Link href="/interactive-tools/stress-management">
                {t("cards.assessment.cta")}
              </Link>
            </Button>
          </div>

          {/* Pain Tracker */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("cards.tracker.title")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t("cards.tracker.description")}
            </p>
            <Button variant="outline" className="w-full">
              <Link href="/interactive-tools/pain-tracker">
                {t("cards.tracker.cta")}
              </Link>
            </Button>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("cards.reports.title")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t("cards.reports.description")}
            </p>
            <Button variant="outline" className="w-full">
              <Link href="/downloads">{t("cards.reports.cta")}</Link>
            </Button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("cards.settings.title")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t("cards.settings.description")}
            </p>
            <Button variant="outline" className="w-full">
              <Link href="/profile">{t("cards.settings.cta")}</Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {t("stats.title")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-purple-700">
                {t("stats.assessments")}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">
                {t("stats.trackedDays")}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-700">{t("stats.reports")}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">28</div>
              <div className="text-sm text-gray-700">{t("stats.streak")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
