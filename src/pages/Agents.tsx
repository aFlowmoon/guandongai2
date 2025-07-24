import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { posterTemplates, financialBills } from "@/data/mock";

const tools = [
  { id: 'writing', name: '帮我写作', icon: 'fa-solid fa-pen-nib' },
  { id: 'image', name: '图片生成', icon: 'fa-solid fa-image' },
  { id: 'analysis', name: '数据分析', icon: 'fa-solid fa-chart-bar' }
];

function WritingAssistant() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">帮我写作</h3>
      <textarea className="w-full h-32 p-2 border rounded-lg" placeholder="请输入您的写作需求..." />
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">生成内容</button>
    </div>
  );
}

function ImageGenerator() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">图片生成</h3>
      <textarea className="w-full h-24 p-2 border rounded-lg" placeholder="请输入图片描述..." />
      <button className="px-4 py-2 bg-green-500 text-white rounded-lg">生成图片</button>
    </div>
  );
}

function DataAnalysis() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">数据分析</h3>
      <textarea className="w-full h-24 p-2 border rounded-lg" placeholder="请输入需要分析的数据或问题..." />
      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">开始分析</button>
    </div>
  );
}

export default function Agents() {
  const [activeTool, setActiveTool] = useState('writing');
  
  const renderToolContent = () => {
    switch(activeTool) {
      case 'writing': return <WritingAssistant />;
      case 'image': return <ImageGenerator />;
      case 'analysis': return <DataAnalysis />;
      default: return null;
    }
  };

  return (
     <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E6F0FF] to-[#F5F9FF]">
      <Navbar />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="flex gap-6">
          {/* 左侧工具面板 */}
          <div className="w-1/5">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-bold mb-4">智能体工具</h2>
              <div className="space-y-2">
                {tools.map(tool => (
                  <div
                    key={tool.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg cursor-pointer",
                      activeTool === tool.id ? "bg-[#FFA500]/20" : "hover:bg-gray-100"
                    )}
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <i className={`${tool.icon} text-[#FFA500]`}></i>
                    <span>{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 右侧工作区 */}
          <div className="w-4/5">
            <div className="bg-white rounded-lg p-6 shadow-md">
              {renderToolContent()}
            </div>
          </div>
        </div>
        
        {/* 底部状态栏 */}
        <div className="mt-4 p-3 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">数据互通状态: 正常</span>
            <span className="text-sm text-gray-500">协作人员: 3人在线</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}