export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Log to console for development
  const isDev =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname);

  if (isDev) {
    console.log(`[Analytics] Event: ${eventName}`, params);
  }

  // Google Tag Manager (GTM) dataLayer push
  // This is the standard way to send events to GTM, which can then route to GA4
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      ...params,
      timestamp: new Date().toISOString(),
    });
  }

  // Direct GA4 fallback (if gtag is manually implemented without GTM)
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
};
