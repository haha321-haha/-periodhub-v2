import { User, Mail, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface ProfilePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600">{t("description")}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              P
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("user.name")}
              </h2>
              <p className="text-gray-600">{t("user.email")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">
                  {t("user.memberSince.label")}
                </div>
                <div className="text-sm text-gray-600">
                  {t("user.memberSince.value")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">
                  {t("user.subscription.label")}
                </div>
                <div className="text-sm text-gray-600">
                  {t("user.subscription.value")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t("settings.title")}
          </h3>

          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Link href="/pricing" className="flex items-center gap-3">
                <User className="w-4 h-4" />
                {t("settings.managePlan")}
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Link
                href="/settings/notifications"
                className="flex items-center gap-3"
              >
                <Mail className="w-4 h-4" />
                {t("settings.notifications")}
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Link
                href="/settings/privacy"
                className="flex items-center gap-3"
              >
                <Shield className="w-4 h-4" />
                {t("settings.privacy")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1">
            <Link href="/dashboard">{t("actions.backToDashboard")}</Link>
          </Button>

          <Button variant="outline" className="flex-1">
            <Link href="/">{t("actions.backToHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
