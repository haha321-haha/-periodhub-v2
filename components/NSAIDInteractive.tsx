"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface NSAIDInteractiveProps {
  locale: "en" | "zh";
}

export default function NSAIDInteractive({ locale }: NSAIDInteractiveProps) {
  // Feature flag: enable via NEXT_PUBLIC_ENABLE_NSAID_INTERACTIVE=true
  const ENABLE_NSAID_INTERACTIVE =
    process.env.NEXT_PUBLIC_ENABLE_NSAID_INTERACTIVE === "true";

  // If feature is disabled, render nothing (progressive enhancement)
  if (!ENABLE_NSAID_INTERACTIVE) {
    return null;
  }

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log("🔧 NSAIDInteractive component mounted");
    setIsClient(true);

    // Load the CSS file dynamically with absolute URL to avoid i18n middleware interference
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${window.location.origin}/styles/nsaid-interactive.css`;
    document.head.appendChild(link);

    console.log("✅ CSS file loaded");

    return () => {
      // Cleanup: remove the CSS link when component unmounts
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

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
