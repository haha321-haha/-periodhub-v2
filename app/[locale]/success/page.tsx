import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

interface SuccessPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    checkout_id?: string;
  }>;
}

export async function generateMetadata({
  params,
}: SuccessPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "payment.success" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { locale } = await params;
  const { checkout_id } = await searchParams;
  const t = await getTranslations({ locale, namespace: "payment.success" });

  // 如果没有checkout_id，重定向到首页
  if (!checkout_id) {
    redirect("/pricing");
  }

  // TODO: 这里可以添加验证checkout状态的逻辑
  // 调用Lemon Squeezy API验证订单状态

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("title")}</h1>

        <p className="text-lg text-gray-600 mb-8">{t("message")}</p>

        <div className="space-y-4">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <Link href="/dashboard">{t("goToDashboard")}</Link>
          </Button>

          <Button variant="outline" className="w-full">
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            {t("orderIdLabel")}: {checkout_id}
          </p>
        </div>
      </div>
    </div>
  );
}
