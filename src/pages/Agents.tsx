import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { posterTemplates, financialBills } from "@/data/mock";

const tools = [
  { id: 'poster', name: '社区海报生成', icon: 'fa-solid fa-image' },
  { id: 'finance', name: '财务审核', icon: 'fa-solid fa-file-invoice-dollar' },
  { id: 'visit', name: '走访记录', icon: 'fa-solid fa-clipboard-list' }
];

function PosterGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">海报模板选择</h3>
      <div className="grid grid-cols-2 gap-4">
        {posterTemplates.map(template => (
          <div 
            key={template.id}
            className={cn(
              "border rounded-lg overflow-hidden cursor-pointer",
              selectedTemplate === template.id ? "ring-2 ring-[#FFA500]" : ""
            )}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-2 text-center">{template.name}</div>
          </div>
        ))}
      </div>
      {selectedTemplate && (
        <div className="mt-4 p-4 bg-white rounded-lg">
          <h3 className="text-lg font-bold mb-2">海报编辑区</h3>
          <textarea 
            className="w-full h-32 p-2 border rounded-lg" 
            placeholder="输入海报内容..."
          />
        </div>
      )}
    </div>
  );
}

function FinanceReview() {
  const [bills, setBills] = useState(financialBills);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">财务票据审核</h3>
      <div className="space-y-2">
        {bills.map(bill => (
          <div key={bill.id} className="p-3 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between">
              <span>{bill.type}</span>
              <span className="font-bold">¥{bill.amount}</span>
            </div>
            <div className="text-sm text-gray-500">{bill.date}</div>
          </div>
        ))}
      </div>
      <button className="mt-4 px-4 py-2 bg-[#FFA500] text-white rounded-lg">
        生成财务报告
      </button>
    </div>
  );
}

function VisitRecord() {
  const [content, setContent] = useState("");
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">走访记录</h3>
      <textarea 
        className="w-full h-40 p-2 border rounded-lg" 
        placeholder="记录走访情况..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="px-4 py-2 bg-[#FFA500] text-white rounded-lg">
        生成走访报告
      </button>
    </div>
  );
}

export default function Agents() {
  const [activeTool, setActiveTool] = useState('poster');
  
  const renderToolContent = () => {
    switch(activeTool) {
      case 'poster': return <PosterGenerator />;
      case 'finance': return <FinanceReview />;
      case 'visit': return <VisitRecord />;
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