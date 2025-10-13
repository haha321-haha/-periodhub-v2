export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  // 这里应该从数据库或文件系统获取文章列表
  // 暂时返回一个基本的 Atom Feed
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>PeriodHub - 经期健康指南</title>
  <subtitle>专业的女性经期健康信息和工具</subtitle>
  <link href="${baseUrl}/feed.xml" rel="self"/>
  <link href="${baseUrl}"/>
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>PeriodHub Health Team</name>
  </author>
  
  <!-- 这里应该添加实际的文章条目 -->
  <!-- 示例文章条目 -->
  <entry>
    <title>痛经缓解完全指南</title>
    <link href="${baseUrl}/zh/articles/pain-relief-guide"/>
    <id>${baseUrl}/zh/articles/pain-relief-guide</id>
    <updated>2025-10-13T00:00:00Z</updated>
    <summary>全面的痛经缓解方法和建议</summary>
  </entry>
</feed>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
