/**
 * JSON Serialization Utilities
 * 用于安全序列化包含可能 undefined 值的数据
 */

/**
 * 清理数据，移除 undefined 值，确保可以安全序列化为 JSON
 * 递归遍历所有对象和数组，移除所有 undefined 值
 * 处理 Date、Function、Symbol、BigInt 等特殊类型
 *
 * @param data - 要清理的数据
 * @param seen - 用于检测循环引用的 WeakSet
 * @returns 清理后的数据，不包含任何 undefined 值
 */
export function cleanDataForJSON(
  data: unknown,
  seen: WeakSet<object> = new WeakSet(),
): unknown {
  // 处理 null 和 undefined
  if (data === null || data === undefined) {
    return null;
  }

  // 处理 Date 对象 - 转换为 ISO 字符串
  if (data instanceof Date) {
    return data.toISOString();
  }

  // 处理函数 - 跳过（不能序列化）
  if (typeof data === "function") {
    return undefined;
  }

  // 处理 Symbol - 跳过（不能序列化）
  if (typeof data === "symbol") {
    return undefined;
  }

  // 处理 BigInt - 转换为字符串
  if (typeof data === "bigint") {
    return data.toString();
  }

  // 处理数组
  if (Array.isArray(data)) {
    return data
      .map((item) => cleanDataForJSON(item, seen))
      .filter((item) => item !== undefined);
  }

  // 处理对象
  if (typeof data === "object") {
    // 检测循环引用
    if (seen.has(data as object)) {
      return undefined; // 跳过循环引用
    }
    seen.add(data as object);

    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // 跳过 undefined 值
      if (value === undefined) {
        continue;
      }

      const cleanedValue = cleanDataForJSON(value, seen);
      // 只添加非 undefined 的值（null 是有效的 JSON 值，应该保留）
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }

  // 处理基本类型（string, number, boolean）
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
  try {
    const cleaned = cleanDataForJSON(data);
    // 如果清理后的数据是 undefined，返回空对象
    if (cleaned === undefined) {
      return JSON.stringify({}, null, space);
    }
    return JSON.stringify(cleaned, null, space);
  } catch (error) {
    // 如果序列化失败，返回错误信息（在生产环境中应该记录日志）
    console.error("safeStringify error:", error);
    return JSON.stringify({ error: "Serialization failed" }, null, space);
  }
}
