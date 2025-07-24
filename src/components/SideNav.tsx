import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chatHistory } from "@/data/mock";

interface SideNavProps {
  visible: boolean;
  onToggle: () => void;
  history: Array<{
    id: string;
    title: string;
    time: string;
  }>;
  onSelectHistory: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onNewChat: () => void;
}

export default function SideNav({ visible, onToggle, history, onSelectHistory, onDeleteHistory, onNewChat }: SideNavProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNewChat = () => {
    setActiveChat(null);
    onNewChat();
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    onSelectHistory(chatId);
  };

  const handleDelete = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteHistory(chatId);
    if (activeChat === chatId) setActiveChat(null);
  };

  const handleKnowledgeUpload = () => {
    navigate('/knowledge#upload');
  };

  const handleSuggestionBox = () => {
    navigate('/suggestions');
  };

  return (
    <>
      {/* 固定左上角的侧边栏切换按钮 */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 p-2 bg-white rounded-full shadow-md border border-gray-200 group"
        aria-label={visible ? "收起侧栏" : "展开侧栏"}
      >
        <i className={`fa-solid ${visible ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
          {visible ? '收起侧栏' : '展开侧栏'}
        </span>
      </button>
      <div className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ease-in-out ${visible ? 'w-64' : 'w-0 overflow-hidden'}`}>
        {/* 新建会话按钮 */}
        <div className="p-3">
          <button 
            onClick={handleNewChat}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>新建会话</span>
          </button>
        </div>

      {/* 功能菜单 */}
      <div className="px-2 py-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">功能菜单</h3>
        <div className="space-y-1">
          <button
            onClick={handleKnowledgeUpload}
            className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-upload"></i>
            </div>
            <span>知识上传</span>
          </button>
          
          <button
            onClick={handleSuggestionBox}
            className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-lightbulb"></i>
            </div>
           <span>建议箱</span>
         </button>
         
         <button
           onClick={() => navigate('/manual')}
           className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
         >
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
             <i className="fa-solid fa-book"></i>
           </div>
           <span>使用手册</span>
         </button>
        </div>
      </div>

      {/* 历史会话 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-3 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">历史会话</h3>
          <div className="space-y-1">
            {history.length === 0 && <div className="text-gray-400 text-sm px-3 py-6">暂无历史会话</div>}
            {history.map((chat) => (
              <motion.div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group",
                  activeChat === chat.id 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                whileHover={{ x: 2 }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-comment text-gray-500"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500">{chat.time}</p>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-colors"
                  title="删除会话"
                  onClick={e => handleDelete(chat.id, e)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}