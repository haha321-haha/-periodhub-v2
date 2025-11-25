/**
 * JSON Serialization Utilities
 * 用于安全序列化包含可能 undefined 值的数据
 */

/**
 * 清理数据，移除 undefined 值，确保可以安全序列化为 JSON
 * 递归遍历所有对象和数组，移除所有 undefined 值
 *
 * @param data - 要清理的数据
 * @returns 清理后的数据，不包含任何 undefined 值
 */
export function cleanDataForJSON(data: unknown): unknown {
  if (data === null || data === undefined) {
    return null;
  }
  if (Array.isArray(data)) {
    return data.map(cleanDataForJSON).filter((item) => item !== null);
  }
  if (typeof data === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        const cleanedValue = cleanDataForJSON(value);
        if (cleanedValue !== null && cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }
  return data;
}

/**
 * 安全地序列化数据为 JSON 字符串
 * 自动清理 undefined 值，避免序列化错误
 *
 * @param data - 要序列化的数据
 * @param space - 缩进空格数（可选，默认 2）
 * @returns JSON 字符串
 */
export function safeStringify(data: unknown, space: number = 2): string {
  const cleaned = cleanDataForJSON(data);
  return JSON.stringify(cleaned, null, space);
}
