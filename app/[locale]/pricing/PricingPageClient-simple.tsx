export default function PricingPageClient() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f9fafb, #ffffff)",
        padding: "64px 16px",
      }}
    >
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "16px",
          }}
        >
          PeriodHub Pro
        </h1>
        <p style={{ fontSize: "20px", color: "#6b7280", marginBottom: "64px" }}>
          简化版定价页面 - 测试中
        </p>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            padding: "32px",
          }}
        >
          <p>定价页面加载成功！</p>
        </div>
      </div>
    </div>
  );
}
