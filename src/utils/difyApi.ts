// src/api/difyApi.ts
import axios from 'axios';

export interface AskRequest {
  content: string;
  apiKey: string;
  fileId?: string;
  functionId?: string;
  deepThinking?: boolean;
}

export interface UploadResponse {
  success: boolean;
  data: any; // 返回的文件信息
  message?: string;
}

/**
 * 上传文件到后端 Dify
 */
export async function uploadFileToDify(file: File, apiKey: string, userId: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('apiKey', apiKey);
  formData.append('userId', userId);

  const resp = await axios.post('/platform/dify/upload', formData, {
    headers: {},
    onUploadProgress: (e) => { /* 可选：这里处理进度 */ },
    validateStatus: () => true,
  });

  if (resp.status < 200 || resp.status >= 300) {
    throw new Error(resp.data?.message || `上传失败，状态码：${resp.status}`);
  }

  return resp.data;
}

/**
 * 向 Dify 提问
 */
export async function askDify(request: AskRequest) {
  const resp = await axios.post('/platform/dify/ask', request, {
    headers: { 'Content-Type': 'application/json' },
    validateStatus: () => true
  });

  if (resp.status < 200 || resp.status >= 300) {
    throw new Error(resp.data?.message || `请求失败，状态码：${resp.status}`);
  }

  return resp.data;
}

/**
 * 上传文件并自动提问
 */
export async function uploadFileAndAsk(file: File, question: string, apiKey: string, userId: string) {
  const uploadResult = await uploadFileToDify(file, apiKey, userId);
  const fileId = uploadResult?.data?.id || uploadResult?.data || ''; // 后端返回结构
  if (!fileId) throw new Error('未获取到文件ID');
  return await askDify({ content: question, apiKey, fileId });
}
