import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";
 import { functionButtons, announcements } from "@/data/mock";
import Announcement from "@/components/Announcement";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

// 历史会话类型
type ChatHistoryItem = {
  id: string;
  title: string;
  messages: Message[];
  time: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatTitle, setChatTitle] = useState('新会话');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [deepThinking, setDeepThinking] = useState(false);
  const [history, setHistory] = useState<ChatHistoryItem[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputAtBottom, setInputAtBottom] = useState(false);
  const [showSkillMenu, setShowSkillMenu] = useState(false);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);
  
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
        
        // 添加欢迎消息
        const welcomeMessage: Message = {
          id: 'welcome',
          content: '你好！我是鄂小荟，有什么可以帮您的吗？',
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    };
    
    // 初始检查
    handleStorageChange();
    
    // 添加存储事件监听器
    window.addEventListener('storage', handleStorageChange);
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 当发送消息时更新会话标题（首次消息）
  useEffect(() => {
    if (messages.length > 1 && chatTitle === '新会话' && messages[1].sender === 'user') {
      const newTitle = messages[1].content.length > 15 
        ? messages[1].content.substring(0, 15) + '...' 
        : messages[1].content;
      
      setChatTitle(newTitle);
      
      // 更新localStorage中的会话标题
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
  
  // 欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: '你好！我是鄂小荟，有什么可以帮您的吗？',
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);
  
  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // 模拟AI回复
    setTimeout(() => {
      const replies = [
        "感谢您的提问，我正在处理您的请求...",
        "这个问题我需要进一步了解，请提供更多细节。",
        "好的，我明白了。这是相关的信息和建议...",
        "您的需求已收到，正在为您生成解决方案..."
      ];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: replies[Math.floor(Math.random() * replies.length)],
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFunctionSelect = (id: string, name: string) => {
    if (id === 'more') {
      toast.info('更多功能即将上线');
      return;
    }
    
    setInputValue(`使用${name}功能: `);
    // 自动聚焦到输入框
    setTimeout(() => {
      const inputElement = document.getElementById('chat-input');
      inputElement?.focus();
    }, 0);
  };

  // 切换历史会话
  const handleSelectHistory = (chatId: string) => {
    setViewingHistoryId(chatId);
    const chat = history.find(h => h.id === chatId);
    if (chat) {
      setCurrentChatId(chat.id);
      setChatTitle(chat.title);
      setMessages(chat.messages);
    }
  };
  // 新建会话
  const handleNewChat = () => {
    // 如果当前会话有内容且不是初始欢迎消息，则保存到历史
    if (messages.length > 1) {
      const firstUserMsg = messages.find(m => m.sender === 'user');
      const title = firstUserMsg ? (firstUserMsg.content.length > 15 ? firstUserMsg.content.slice(0, 15) + '...' : firstUserMsg.content) : '未命名会话';
      const newHistory: ChatHistoryItem = {
        id: Date.now().toString(),
        title,
        messages,
        time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      };
      const updated = [newHistory, ...history];
      setHistory(updated);
      localStorage.setItem('chatHistory', JSON.stringify(updated));
    }
    // 清空当前会话
    setCurrentChatId(Date.now().toString());
    setChatTitle('新会话');
    setMessages([
      {
        id: 'welcome',
        content: '你好！我是鄂小荟，有什么可以帮您的吗？',
        sender: 'assistant',
        timestamp: new Date()
      }
    ]);
    setViewingHistoryId(null);
  };
  // 删除历史会话
  const handleDeleteHistory = (chatId: string) => {
    const updated = history.filter(h => h.id !== chatId);
    setHistory(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));
  };

  // 主内容区显示的消息
  const displayedMessages = viewingHistoryId
    ? (history.find(h => h.id === viewingHistoryId)?.messages || [])
    : messages;

  // 财务审核相关
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [financeList, setFinanceList] = useState<{id:string, file:string, note:string}[]>(() => {
    return JSON.parse(localStorage.getItem('financeList') || '[]');
  });
  const [financeFile, setFinanceFile] = useState<File|null>(null);
  const [financeNote, setFinanceNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    localStorage.setItem('financeList', JSON.stringify(financeList));
  }, [financeList]);
  const handleFinanceUpload = () => {
    if (!financeFile) return toast.error('请上传票据图片');
    const reader = new FileReader();
    reader.onload = () => {
      setFinanceList(list => [
        { id: Date.now().toString(), file: reader.result as string, note: financeNote },
        ...list
      ]);
      setShowFinanceModal(false);
      setFinanceFile(null);
      setFinanceNote('');
      toast.success('票据上传成功');
    };
    reader.readAsDataURL(financeFile);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
         {/* 侧边栏 */}
         <SideNav
           visible={sidebarVisible}
           onToggle={toggleSidebar}
           history={history}
           onSelectHistory={handleSelectHistory}
           onDeleteHistory={handleDeleteHistory}
           onNewChat={handleNewChat}
         />
        
         {/* 主内容区 - 对话框 */}
         <div className={`flex-1 flex flex-col overflow-hidden bg-white transition-all duration-300 ${sidebarVisible ? '' : 'ml-0'}`}>
           {/* 对话区域 */}
           <div className="flex-1 overflow-y-auto p-6">
             <div className="max-w-3xl mx-auto space-y-6">
               {/* 会话标题 */}
               <div className="text-center py-4">
                 <h2 className="text-xl font-bold text-gray-800">{chatTitle}</h2>
                 <p className="text-sm text-gray-500">与鄂小荟的对话</p>
               </div>
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
                      <img src="/assets/avatar-girl.png" alt="小人头像" className="w-10 h-10 object-contain rounded-full" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-lg shadow-sm",
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ml-3">
                      <i className="fa-solid fa-user text-gray-500"></i>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* 输入区域：仅新会话时可用，查看历史会话时不显示输入区 */}
          {viewingHistoryId == null ? (
            <>
              <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-2xl">
                  {/* 输入区域内容 */}
                  <div className="relative">
                    <textarea
                      id="chat-input"
                      placeholder="发消息、输入@选择技能或/选择文件..."
                      className="w-full p-4 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-24"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <div className="absolute left-0 right-0 bottom-2 flex items-center gap-2 px-2">
                      <label htmlFor="attachment-upload" className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all cursor-pointer" title="上传附件">
                        <i className="fa-solid fa-paperclip"></i>
                      </label>
                      <button type="button" className={`flex items-center gap-1 p-2 pr-3 rounded-full transition-all cursor-pointer border text-xs font-medium ${deepThinking ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 border-transparent'}`} title="深度思考" onClick={() => setDeepThinking(v => !v)}>
                        <i className="fa-solid fa-brain"></i>
                        <span>深度思考</span>
                      </button>
                      <div className="flex-1" />
                      <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </div>
                    <input id="attachment-upload" type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // 简单的文件验证
                        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                        if (!validTypes.includes(file.type)) {
                          toast.error('不支持的文件类型，请上传图片或文档');
                          return;
                        }

                        // 限制文件大小为10MB
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error('文件大小不能超过10MB');
                          return;
                        }

                        // 模拟文件上传
                        toast.loading(`正在上传: ${file.name}`);
                        setTimeout(() => {
                          toast.success(`文件 "${file.name}" 上传成功`);
                          // 在实际应用中，这里应该有上传到服务器的逻辑
                          // 上传成功后可以将文件信息添加到消息中
                        }, 1500);
                      }
                    }} />
                  </div>
                  {/* 功能选择区域紧贴输入框下方 */}
                  <div className="w-full flex justify-center mt-2">
                    <div className="flex items-center gap-0 bg-transparent">
                      {functionButtons.map((button, idx) => (
                        <>
                          {idx !== 0 && (
                            <div className="h-8 w-px bg-gray-200 mx-2" />
                          )}
                          <button
                            key={button.id}
                            onClick={() => handleFunctionSelect(button.id, button.name)}
                            className="flex items-center px-6 py-2 rounded-2xl border border-gray-200 bg-white text-base font-medium shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap gap-2"
                            style={{ color: button.color }}
                          >
                            <i className={button.icon}></i>
                            <span>{button.name}</span>
                          </button>
                        </>
                      ))}
                      {/* 新增财务审核按钮前加竖线分割 */}
                      <div className="h-8 w-px bg-gray-200 mx-2" />
                      <button
                        className="flex items-center px-6 py-2 rounded-2xl border border-gray-200 bg-white text-base font-medium shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap gap-2"
                        style={{ color: '#22c55e' }}
                        onClick={() => handleFunctionSelect('finance', '财务审核')}
                      >
                        <i className="fa-solid fa-file-invoice-dollar"></i>
                        <span>财务审核</span>
                      </button>
                    </div>
                  </div>
                  {/* 财务审核弹窗和票据列表已移除 */}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
