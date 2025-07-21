import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { agents } from "@/data/mock";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
};

export default function AgentChat() {
  const { id } = useParams();
  const agent = agents.find(a => a.id === id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!agent) {
    return <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4">智能体不存在</h2>
          <p>未找到ID为 {id} 的智能体</p>
        </div>
      </main>
      <Footer />
    </div>;
  }

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
    toast.success("消息已发送");

    // 模拟智能体回复
    setTimeout(() => {
      const responses = [
        `我已收到您的消息: "${inputValue}"`,
        `关于"${inputValue}"，我可以为您提供以下帮助...`,
        `感谢您的提问，${inputValue}是常见问题，解决方案是...`,
        `正在处理您的请求: ${inputValue}`
      ];
      const agentMessage: Message = {
        id: Date.now().toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-6">
            <i className={`${agent.icon} text-4xl text-blue-500`}></i>
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <p className="text-gray-500">{agent.category}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-bold mb-4">对话区域</h2>
            <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">与 {agent.name} 开始对话</p>
              ) : (
                <div className="space-y-3">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex",
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div className={cn(
                        "max-w-xs md:max-w-md p-3 rounded-lg",
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white rounded-br-none' 
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      )}>
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="输入消息..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSendMessage}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}