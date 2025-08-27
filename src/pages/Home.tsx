// Home.tsx
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";
import { functionButtons, announcements } from "@/data/mock";
import Announcement from "@/components/Announcement";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// 引入与agents.tsx共用的智能体配置
import { AGENT_CONFIG } from "@/config/agentConfig";
import axios from "axios";
import { uploadFileAndAsk } from '@/utils/difyApi';

// 消息类型定义
type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: "text" | "file"; 
  fileName?: string;
  fileSize?: number;
};

// 历史会话类型定义
type ChatHistoryItem = {
  id: string;
  title: string;
  messages: Message[];
  time: string;
};

// 生成唯一ID（时间戳+3位随机数，避免key重复）
const generateUniqueId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}-${random}`;
};

export default function Home() {
  // 基础状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatTitle, setChatTitle] = useState('新会话');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [deepThinking, setDeepThinking] = useState(false);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);
  
  // 与agents.tsx对齐：记录当前选择的工具ID（匹配AGENT_CONFIG的key）
  const [selectedToolId, setSelectedToolId] = useState<string>('default');
  // 加载状态（统一用户体验）
  const [isLoading, setIsLoading] = useState(false);

  // 上传进度相关
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // 历史会话状态（修复：确保时间戳为Date对象）
  const [history, setHistory] = useState<ChatHistoryItem[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    if (!saved) return [];
    
    try {
      const parsedHistory = JSON.parse(saved);
      // 过滤无效会话并确保时间戳为Date对象
      const validHistory = parsedHistory.filter((chat: any) => 
        chat.id && chat.messages && Array.isArray(chat.messages) && chat.title
      );
      
      return validHistory.map((chat: any) => ({
        ...chat,
        messages: chat.messages.map((msg: any) => ({
          id: msg.id || generateUniqueId(),
          content: msg.content || '',
          sender: msg.sender === 'user' ? 'user' : 'assistant',
          // 关键修复：确保timestamp是Date对象
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }))
      }));
    } catch (err) {
      localStorage.removeItem('chatHistory');
      return [];
    }
  });

  // 侧边栏切换（仅控制显示/隐藏，位置固定）
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // 监听新建会话事件
  useEffect(() => {
    const handleStorageChange = () => {
      const newChatEvent = localStorage.getItem('newChatEvent');
      if (newChatEvent) {
        const eventData = JSON.parse(newChatEvent);
        setCurrentChatId(eventData.id);
        setChatTitle('新会话');
        setMessages([]);
        setSelectedToolId('default');
        
        // 欢迎消息
        const welcomeMessage: Message = {
          id: generateUniqueId(),
          content: '你好！我是智能助手，有什么可以帮您的吗？',
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 会话标题自动更新
  useEffect(() => {
    if (messages.length > 1 && chatTitle === '新会话' && messages[1].sender === 'user') {
      const newTitle = messages[1].content.length > 15 
        ? messages[1].content.substring(0, 15) + '...' 
        : messages[1].content;
      
      setChatTitle(newTitle);
      
      if (currentChatId) {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          const updatedHistory = history.map((chat: any) => 
            chat.id === currentChatId ? { ...chat, title: newTitle, time: '刚刚' } : chat
          );
          localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        }
      }
    }
  }, [messages, chatTitle, currentChatId]);

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateUniqueId(),
      content: '你好！我是智能助手，有什么可以帮您的吗？',
      sender: 'assistant',
      timestamp: new Date()
    };
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  // 消息自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: generateUniqueId(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const currentAgentConfig = AGENT_CONFIG[selectedToolId as keyof typeof AGENT_CONFIG] || AGENT_CONFIG.default;
      const response = await fetch("/platform/dify/ask", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionId: selectedToolId,
          content: inputValue.trim(),
          apiKey: currentAgentConfig.apiKey,
          deepThinking: deepThinking
        })
      });

      if (!response.ok) throw new Error(`请求失败（状态码：${response.status}）`);
      const data = await response.json();
      
      // 添加AI回复
      const aiMessage: Message = {
        id: generateUniqueId(),
        content: data.content,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: Message = {
        id: generateUniqueId(),
        content: '抱歉，智能体暂时无法响应，请稍后再试',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('智能体请求失败：' + (error as Error).message);

    } finally {
      setIsLoading(false);
      setDeepThinking(false);
    }
  };

  // 发送任意内容到后端智能体
  const sendContentToAgent = async (content: string) => {
    const userMsg: Message = {
      id: generateUniqueId(),
      content: content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    setIsLoading(true);
    try {
      const currentAgentConfig = AGENT_CONFIG[selectedToolId as keyof typeof AGENT_CONFIG] || AGENT_CONFIG.default;
      const resp = await fetch('/platform/dify/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functionId: selectedToolId,
          content: content,
          apiKey: currentAgentConfig.apiKey,
          deepThinking: false
        })
      });

      if (!resp.ok) throw new Error(`请求失败（状态码：${resp.status}）`);
      const data = await resp.json();

      const aiMessage: Message = {
        id: generateUniqueId(),
        content: data.content || '（智能体未返回内容）',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('自动发送文件上下文失败', err);
      const errorMsg: Message = {
        id: generateUniqueId(),
        content: '上传后将文件发送给智能体时出错。',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      toast.error('将文件上下文发送给智能体失败：' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // 文件上传
  const handleFileUpload = async (file: File) => {
    const currentAgentConfig = AGENT_CONFIG[selectedToolId as keyof typeof AGENT_CONFIG] || AGENT_CONFIG.default;
    const apiKey = currentAgentConfig?.apiKey || '';
    const userId = localStorage.getItem('userId') || 'anonymous';
  
    setUploadingFile(file.name);
    setUploadProgress(0);
    const toastId = toast.loading(`正在上传: ${file.name}`);
  
    try {
      const question = inputValue.trim() || `请分析上传的文件: ${file.name}`;
  
      // 使用 axios 发送 FormData，支持上传进度
      const formData = new FormData();
      formData.append('file', file);
      formData.append('apiKey', apiKey);
      formData.append('userId', userId);
  
      const uploadRes = await axios.post('http://192.168.5.49:9900/platform/dify/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
        }
      });
      
  
      const fileId = uploadRes.data?.data?.id;
      if (!fileId) throw new Error('上传文件未返回文件ID');
  
      toast.dismiss(toastId);
      toast.success(`文件 "${file.name}" 上传成功`);
  
      // 添加文件上传消息
      const fileMessage: Message = {
        id: generateUniqueId(),
        content: "文件已上传",
        sender: "assistant",
        timestamp: new Date(),
        type: "file",        
        fileName: file.name, 
        fileSize: file.size, 
      };
      setMessages(prev => [...prev, fileMessage]);
  
      // 自动发送文件内容提问到智能体
      setIsLoading(true);
      const askRes = await axios.post('/platform/dify/ask', {
        functionId: selectedToolId,
        content: question,
        apiKey: apiKey,
        fileId: fileId
      });
  
      const aiMessage: Message = {
        id: generateUniqueId(),
        content: askRes.data?.content || '（智能体未返回内容）',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
  
    } catch (err) {
      console.error('文件上传失败或提问失败', err);
      toast.dismiss(toastId);
      toast.error(`上传文件失败或提问失败: ${(err as Error).message}`);
      const errorMsg: Message = {
        id: generateUniqueId(),
        content: '文件上传或智能体回答失败',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setTimeout(() => {
        setUploadingFile(null);
        setUploadProgress(null);
        setIsLoading(false);
      }, 500);
    }
  };

  // 功能按钮点击
  const handleFunctionSelect = (id: string, name: string) => {
    if (id === 'more') {
      toast.info('更多功能即将上线');
      return;
    }

    setSelectedToolId(id);
    setInputValue(`使用${name}功能: `);

    setTimeout(() => {
      const inputElement = document.getElementById('chat-input');
      inputElement?.focus();
    }, 0);
  };

  // Enter发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 历史会话选择
  const handleSelectHistory = (chatId: string) => {
    const targetChat = history.find(h => h.id === chatId);
    if (!targetChat) {
      toast.warning('会话数据不存在，请尝试新建会话');
      return;
    }

    setViewingHistoryId(chatId);
    setCurrentChatId(chatId);
    setChatTitle(targetChat.title);
    setMessages(JSON.parse(JSON.stringify(targetChat.messages)));
    setSelectedToolId('default');
    setIsLoading(false);
  };

  // 新建会话
  const handleNewChat = () => {
    if (messages.length > 1) {
      const firstUserMsg = messages.find(m => m.sender === 'user');
      const title = firstUserMsg ? (firstUserMsg.content.length > 15 ? firstUserMsg.content.slice(0, 15) + '...' : firstUserMsg.content) : '未命名会话';
      const newHistory: ChatHistoryItem = {
        id: generateUniqueId(),
        title,
        messages,
        time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      };
      const updated = [newHistory, ...history];
      setHistory(updated);
      localStorage.setItem('chatHistory', JSON.stringify(updated));
    }

    setCurrentChatId(generateUniqueId());
    setChatTitle('新会话');
    setMessages([
      {
        id: generateUniqueId(),
        content: '你好！我是智能助手，有什么可以帮您的吗？',
        sender: 'assistant',
        timestamp: new Date()
      }
    ]);
    setViewingHistoryId(null);
    setSelectedToolId('default');
    setIsLoading(false);
  };

  // 删除历史会话
  const handleDeleteHistory = (chatId: string) => {
    const updated = history.filter(h => h.id !== chatId);
    setHistory(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));
    if (viewingHistoryId === chatId) {
      setViewingHistoryId(null);
      setMessages([
        {
          id: generateUniqueId(),
          content: '你好！我是智能助手，有什么可以帮您的吗？',
          sender: 'assistant',
          timestamp: new Date()
        }
      ]);
    }
  };

  // 显示的消息
  const displayedMessages = (() => {
    if (!viewingHistoryId) return messages;
    const targetChat = history.find(h => h.id === viewingHistoryId);
    return targetChat?.messages || [
      {
        id: generateUniqueId(),
        content: '会话数据加载失败，请重新选择或新建会话',
        sender: 'assistant',
        timestamp: new Date()
      }
    ];
  })();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏：固定位置，不滚动 */}
      <Navbar />
      
      {/* 主容器：侧边栏+内容区并排，均固定高度 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏：固定宽度、固定位置（不随内容滚动），仅控制显示/隐藏 */}
        <SideNav
          visible={sidebarVisible}
          onToggle={toggleSidebar}
          history={history}
          onSelectHistory={handleSelectHistory}
          onDeleteHistory={handleDeleteHistory}
          onNewChat={handleNewChat}
        />
        
        {/* 右侧内容区：占满剩余空间，内部用flex-col实现「对话区滚动+输入框固定」 */}
        <div className={`flex-1 flex flex-col overflow-hidden bg-white transition-all duration-300 ${sidebarVisible ? '' : 'ml-0'}`}>
          {/* 对话区域：仅这里可滚动，隐藏滚动条，占满内容区除输入框的空间 */}
          <div 
            className="flex-1 overflow-y-auto p-6 pb-20 custom-scrollbar" 

          >
            <div className="max-w-3xl mx-auto space-y-6">
              {/* 会话标题 */}
              <div className="text-center py-4">
                <h2 className="text-xl font-bold text-gray-800">{chatTitle}</h2>
                <p className="text-sm text-gray-500">与智能助手的对话</p>
              </div>

              {/* 消息列表：仅随对话区滚动 */}
              {displayedMessages.map((message) => (
                <div 
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'assistant' && (
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mr-3">
                      <img src="/assets/OIP.png" alt="智能助手头像" className="w-10 h-10 object-contain rounded-full" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-lg shadow-sm",
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  )}>
                      {message.type === "file" ? (
    <div className="flex items-center p-3 border rounded-lg bg-gray-50">
      <div className="flex-shrink-0 mr-3">
        <i className="fa-solid fa-file text-blue-500 text-2xl"></i>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{message.fileName}</p>
        <p className="text-xs text-gray-500">
          {(message.fileSize ? (message.fileSize / 1024).toFixed(1) : 0)} KB
        </p>
      </div>
      <button
        onClick={() =>
          setMessages((prev) => prev.filter((m) => m.id !== message.id))
        }
        className="text-gray-400 hover:text-red-500 transition"
        title="删除文件"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  ) : (
    <p className="whitespace-pre-wrap">{message.content}</p>
  )}
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString() : ''}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ml-3">
                      <i className="fa-solid fa-user text-gray-500"></i>
                    </div>
                  )}
                </div>
              ))}

              {/* 加载状态 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mr-3">
                    <img src="/assets/OIP.png" alt="智能助手头像" className="w-10 h-10 object-contain rounded-full" />
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg rounded-bl-none">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin text-gray-600"></i>
                      <p className="text-sm text-gray-600">智能体生成中...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 滚动锚点：确保新消息自动滚到底部 */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* 输入区域：固定在内容区底部，不随对话滚动 */}
{viewingHistoryId == null && (
  <div className="border-t border-gray-200 p-3 bg-white">
    <div className="max-w-2xl mx-auto">
      {/* 输入框区域 */}
      <div className="relative">
        
        <textarea
          id="chat-input"
          placeholder="发消息、输入@选择技能或/选择文件..."
          className="w-full p-4 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 pt-8"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          aria-label="输入聊天内容"
        />
        
        {/* 输入框底部操作栏 */}
        <div className="absolute left-0 right-0 bottom-2 flex items-center gap-2 px-2">
          {/* 附件上传 */}
          <label htmlFor="attachment-upload" className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all cursor-pointer" title="上传附件">
            <i className="fa-solid fa-paperclip"></i>
          </label>
          
          <div className="flex-1" />
          
          {/* 发送按钮 */}
          <button 
            onClick={handleSendMessage} 
            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed" 
            title="发送消息"
            disabled={isLoading || !inputValue.trim()}
          >
            <i className="fa-solid fa-paper-plane text-lg"></i>
          </button>
        </div>
        
        {/* 附件上传输入 */}
        <input 
          id="attachment-upload" 
          type="file" 
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            (e.target as HTMLInputElement).value = '';
            if (file) {
              const validTypes = [
                'image/jpeg', 'image/png', 'image/gif',
                'application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv' 
              ];                          
              if (!validTypes.includes(file.type)) {
                toast.error('不支持的文件类型，请上传图片或文档');
                return;
              }
              if (file.size > 10 * 1024 * 1024) {
                toast.error('文件大小不能超过10MB');
                return;
              }
              handleFileUpload(file);
            }
          }} 
        />

        {/* 上传进度条 */}
        {uploadingFile && uploadProgress !== null && (
          <div className="absolute left-4 right-4 -top-10">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-gray-600">{uploadingFile}</div>
              <div className="text-xs text-gray-600">{uploadProgress}%</div>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div style={{ width: `${uploadProgress}%` }} className="h-2 rounded-full bg-blue-500 transition-all" />
            </div>
          </div>
        )}
      </div>
      
      {/* 功能按钮区域 */}
      <div className="w-full flex justify-center mt-2">
        <div className="flex items-center gap-0 bg-transparent">
          {functionButtons.map((button, idx) => (
            <React.Fragment key={button.id}>
              {idx !== 0 && (
                <div key={`divider-${button.id}`} className="h-6 w-px bg-gray-200 mx-1" />
              )}
              <button
                onClick={() => handleFunctionSelect(button.id, button.name)}
                className="flex items-center px-4 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap gap-1.5"
                style={{ color: button.color }}
                disabled={isLoading}
                aria-label={`选择${button.name}功能`}
              >
                <i className={button.icon}></i>
                <span>{button.name}</span>
              </button>
            </React.Fragment>
          ))}
          {/* 财务审核快捷按钮 */}
          <div key="divider-finance" className="h-6 w-px bg-gray-200 mx-1" />
          <button
            className="flex items-center px-4 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap gap-1.5"
            style={{ color: '#000000' }}
            onClick={() => handleFunctionSelect('finance', '财务审核')}
            disabled={isLoading}
            aria-label="选择财务审核功能"
          >
            <i className="fa-solid fa-file-invoice-dollar"></i>
            <span>财务审核</span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        </div>
      </div>
      
      {/* 底部Footer：固定位置 */}
      <Footer />
    </div>
  );
}