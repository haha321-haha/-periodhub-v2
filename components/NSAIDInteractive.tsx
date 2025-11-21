"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
// ✅ 静态导入CSS文件（修复动态加载问题）
import "@/app/styles/nsaid-interactive.css";

interface NSAIDInteractiveProps {
  locale: "en" | "zh";
}

export default function NSAIDInteractive({ locale }: NSAIDInteractiveProps) {
  // Feature flag: enable via NEXT_PUBLIC_ENABLE_NSAID_INTERACTIVE=true
  const ENABLE_NSAID_INTERACTIVE =
    process.env.NEXT_PUBLIC_ENABLE_NSAID_INTERACTIVE === "true";

  // Hooks must be called before any early returns
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log("🔧 NSAIDInteractive component mounted");
    setIsClient(true);
    // ✅ CSS已通过静态导入加载，无需动态加载
  }, []);

  // If feature is disabled, render nothing (progressive enhancement)
  if (!ENABLE_NSAID_INTERACTIVE) {
    return null;
  }

  // Only render scripts on client side to avoid preloading
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Script
        src={`${
          typeof window !== "undefined" ? window.location.origin : ""
        }/scripts/nsaid-interactive.js`}
        strategy="lazyOnload"
        onLoad={() => console.log("✅ NSAID interactive script loaded")}
        onError={(e) => console.error("❌ NSAID interactive script failed:", e)}
      />
    </>
  );
}
