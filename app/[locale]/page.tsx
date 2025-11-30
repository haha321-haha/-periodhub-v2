import { setRequestLocale } from "next-intl/server";
import V2Home from "@/components/landing/V2Home";

export const dynamic = "force-dynamic";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return <V2Home locale={locale} />;
}
