import { API_BASE_URL } from "@/config/agentConfig";
import { toast } from "sonner"; // 用你项目中的提示组件

// 聊天接口请求（对应后端/ask接口）
export const askAgent = async (
  functionType: keyof typeof AGENT_CONFIG, // 功能类型（如"writing"）
  content: string, // 用户输入内容
  apiKey: string // 该功能对应的API Key
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 后端如果需要其他headers（如认证）可在此添加
      },
      body: JSON.stringify({
        content: content.trim(), // 对应后端UserInput的content字段
        apiKey: apiKey // 对应后端UserInput的apiKey字段（必填）
      })
    });

    // 解析后端响应（后端返回NutMap格式，对应前端的JSON对象）
    const result = await response.json();

    // 处理后端错误状态（根据后端Controller的错误返回格式）
    if (!response.ok || result.code) {
      // 后端返回错误码（如"invalid_input"）时，提取错误信息
      const errorMsg = result.message || "请求失败，请重试";
      toast.error(`[${functionType}] ${errorMsg}`);
      throw new Error(`${result.code}: ${errorMsg}`);
    }

    // 成功时返回后端的content字段（智能体答复内容）
    return result.content;
  } catch (err) {
    console.error(`[${functionType}] 接口调用失败:`, err);
    throw err; // 抛出错误让组件处理
  }
};

// 文件上传接口请求（对应后端/upload接口）
export const uploadFileToAgent = async (
  functionType: keyof typeof AGENT_CONFIG,
  file: File,
  apiKey: string,
  userId?: string // 可选的用户ID
) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // 对应后端的@Param("file")
    formData.append("apiKey", apiKey); // 对应后端的@Param("apiKey")
    if (userId) formData.append("userId", userId); // 对应后端的@Param("userId")

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData // 上传文件无需设置Content-Type，浏览器会自动添加
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorMsg = result.message || "文件上传失败";
      toast.error(`[${functionType}] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    return result.data; // 返回后端的上传结果数据
  } catch (err) {
    console.error(`[${functionType}] 文件上传失败:`, err);
    throw err;
  }
};