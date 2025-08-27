// 各功能对应的智能体API Key配置（根据实际需求替换）
export const AGENT_CONFIG = {
    writing: {
      name: "帮我写作",
      apiKey: "app-ngW2ijJTWYiSNnMCx7BlrR1j", // 写作智能体的API Key
      description: "支持文案创作、通知撰写、信件生成等"
    },
    image: {
      name: "图片生成",
      apiKey: "app-7vRMOdglNWOTaal8i2cACia3", // 图片生成智能体的API Key
      description: "根据文本描述生成图片"
    },
    analysis: {
      name: "数据分析",
      apiKey: "app-xxxAnalysisAgentKeyxxx", // 数据分析智能体的API Key
      description: "处理数据统计、趋势分析等需求"
    },
    finance: {
      name: "财务审核",
      apiKey: "app-cCbBhbI2aJKxKiFiehURFz6I", // 财务审核智能体的API Key
      description: "处理票据识别、财务数据审核等"
    },
    default: {
      name:"默认回复",
      apiKey: "app-ngW2ijJTWYiSNnMCx7BlrR1j",
      description:"处理用户其他问题"
    }
  };
  
  // 后端接口基础地址（
  export const API_BASE_URL = "http://192.168.5.49:9900/platform/dify"; 