// 全局 Lemon Squeezy 支付处理函数
// 这个文件会自动导出一个全局函数，供所有组件调用

import { ProUpgradeRequest } from "@/types/payments";

declare global {
  interface Window {
    handleProUpgrade: (options: ProUpgradeRequest) => void;
  }
}

export async function handleProUpgrade(options: ProUpgradeRequest) {
  console.log("🔓 开始处理升级请求:", options);

  try {
    // 构建 API 请求体
    const requestBody = {
      plan: options.plan,
      painPoint: options.painPoint || "unknown",
      assessmentScore: options.assessmentScore || 0,
      customData: {
        source: options.source || "web",
        ...options.customData,
      },
    };

    console.log("📤 发送支付请求:", requestBody);

    // 调用 Lemon Squeezy API 创建结账会话
    const response = await fetch("/api/lemonsqueezy/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ 支付请求失败:", errorData);
      throw new Error(errorData.error || "Payment request failed");
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error("No checkout URL received");
    }

    console.log("✅ 支付页面创建成功:", data.url);

    // 重定向到支付页面
    window.location.href = data.url;
  } catch (error) {
    console.error("❌ 支付处理失败:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 提供更友好的错误消息
    if (errorMessage.includes("Payment service is not configured")) {
      alert("支付服务暂时不可用，请联系客服或稍后再试");
    } else if (errorMessage.includes("503")) {
      alert("支付服务维护中，请稍后再试");
    } else if (errorMessage.includes("401")) {
      alert("支付认证失败，请联系客服");
    } else {
      alert(`支付初始化失败: ${errorMessage}，请联系客服处理`);
    }
  }
}

// 在页面加载时注册全局函数
if (typeof window !== "undefined") {
  window.handleProUpgrade = handleProUpgrade;
}
