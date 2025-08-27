import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { posterTemplates, financialBills } from "@/data/mock";
import { toast } from "sonner";

const tools = [
  { id: 'writing', name: '帮我写作', icon: 'fa-solid fa-pen-nib' },
  { id: 'image', name: '图片生成', icon: 'fa-solid fa-image' },
  { id: 'analysis', name: '数据分析', icon: 'fa-solid fa-chart-bar' },
  { id: 'finance', name: '财务审核', icon: 'fa-solid fa-file-invoice-dollar' } // 新增财务审核工具
];

// 写作助手组件
function WritingAssistant() {
  // 1. 状态管理
  const [inputContent, setInputContent] = useState(""); // 用户输入的写作需求
  const [replyResult, setReplyResult] = useState(""); // 智能体返回的结果
  const [loading, setLoading] = useState(false); // 接口请求加载状态
  const [errorMsg, setErrorMsg] = useState(""); // 错误提示

  // 2. 获取当前功能的配置（从agentConfig.ts中拿）
  const currentFunction = "writing"; // 固定为写作功能
  const { apiKey, description } = AGENT_CONFIG[currentFunction]; // 解构API Key和描述

  // 3. 点击"生成内容"按钮时调用的函数（核心逻辑）
  const handleGenerate = async () => {
    // 先做输入校验
    if (!inputContent.trim()) {
      setErrorMsg("请输入写作需求（如“写一篇产品上线通知”）");
      // 3秒后自动隐藏错误提示
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    // 准备调用接口
    setReplyResult(""); // 清空旧结果
    setLoading(true); // 显示加载状态
    setErrorMsg(""); // 清空旧错误

    try {
      // 调用后端接口（传用户输入、API Key）
      const result = await askAgent(
        currentFunction,
        inputContent,
        apiKey
      );

      // 接口成功：展示智能体的答复
      setReplyResult(result);
    } catch (err) {
      // 接口失败：显示错误提示
      setErrorMsg("生成失败，请稍后重试");
    } finally {
      // 无论成功失败，都关闭加载状态
      setLoading(false);
    }
  };

  // 4. UI渲染（绑定状态和函数）
  return (
    <div className="space-y-6">
      {/* 标题和描述 */}
      <div>
        <h3 className="text-lg font-bold flex items-center">
          <i className="fa-solid fa-pen-nib mr-2 text-blue-500"></i>
          帮我写作
        </h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      {/* 错误提示区 */}
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
          <i className="fa-solid fa-exclamation-circle mr-2"></i>
          {errorMsg}
        </div>
      )}

      {/* 用户输入区 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          请描述你的写作需求
        </label>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
          placeholder="例如：帮我写一封给客户的感谢信，主题是感谢长期合作，需要包含近期合作成果和未来展望..."
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)} // 实时保存输入内容
          disabled={loading} // 加载时禁止编辑
        />
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate} // 点击触发接口调用
        disabled={loading || !inputContent.trim()} // 加载中/无输入时禁用
        className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
      >
        {loading ? (
          // 加载中显示"生成中..."
          <>
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            智能体生成中...
          </>
        ) : (
          // 正常状态显示"生成内容"
          <>
            <i className="fa-solid fa-magic mr-2"></i>
            生成内容
          </>
        )}
      </button>

      {/* 结果展示区（有结果时显示） */}
      {replyResult && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <i className="fa-solid fa-comment-dots mr-2 text-blue-500"></i>
            写作智能体的答复：
          </h4>
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {replyResult}
          </div>
        </div>
      )}
    </div>
  );
}

// 图片生成组件
function ImageGenerator() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">图片生成</h3>
      <textarea className="w-full h-24 p-2 border rounded-lg" placeholder="请输入图片描述..." />
      <button className="px-4 py-2 bg-green-500 text-white rounded-lg">生成图片</button>
    </div>
  );
}

// 数据分析组件
function DataAnalysis() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">数据分析</h3>
      <textarea className="w-full h-24 p-2 border rounded-lg" placeholder="请输入需要分析的数据或问题..." />
      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">开始分析</button>
    </div>
  );
}

// 财务审核组件（新增）
function FinancialReview() {
  // 票据列表状态（从localStorage初始化）
  const [financeList, setFinanceList] = useState<{id:string, file:string, note:string}[]>(() => {
    return JSON.parse(localStorage.getItem('financeList') || '[]');
  });
  const [financeFile, setFinanceFile] = useState<File|null>(null);
  const [financeNote, setFinanceNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 同步到localStorage
  useEffect(() => {
    localStorage.setItem('financeList', JSON.stringify(financeList));
  }, [financeList]);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('仅支持JPG/PNG/GIF/PDF格式的票据');
        return;
      }
      setFinanceFile(file);
    }
  };

  // 处理票据上传
  const handleUpload = () => {
    if (!financeFile) {
      toast.error('请先选择需要上传的票据');
      return;
    }

    // 模拟文件读取（实际项目中需上传到服务器）
    const reader = new FileReader();
    reader.onload = () => {
      const newBill = {
        id: Date.now().toString(),
        file: reader.result as string,
        note: financeNote
      };
      setFinanceList(prev => [newBill, ...prev]);
      setFinanceFile(null);
      setFinanceNote('');
      // 清空input值
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('票据上传成功');
    };
    reader.readAsDataURL(financeFile);
  };

  // 处理票据删除
  const handleDelete = (id: string) => {
    setFinanceList(prev => prev.filter(bill => bill.id !== id));
    toast.info('票据已删除');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">财务票据审核</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择票据文件
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                id="finance-file"
              />
              <label
                htmlFor="finance-file"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
              >
                <i className="fa-solid fa-upload mr-1"></i> 选择文件
              </label>
              <span className="text-sm text-gray-500 truncate">
                {financeFile ? financeFile.name : '未选择文件'}
              </span>
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              票据备注
            </label>
            <input
              type="text"
              value={financeNote}
              onChange={(e) => setFinanceNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="例如：2024年6月办公费发票"
            />
          </div>
          <div className="col-span-1">
            <button
              onClick={handleUpload}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              <i className="fa-solid fa-check mr-1"></i> 上传票据
            </button>
          </div>
        </div>
      </div>

      {/* 已上传票据列表 */}
      <div>
        <h4 className="text-base font-medium mb-3 flex items-center">
          <i className="fa-solid fa-list-ul mr-1 text-gray-500"></i>
          已上传票据 ({financeList.length})
        </h4>
        {financeList.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg text-gray-500">
            <i className="fa-solid fa-file-circle-question text-2xl mb-2"></i>
            <p>暂无上传的票据，请先上传需要审核的财务票据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {financeList.map(bill => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {/* 票据预览 */}
                  <div className="w-12 h-12 rounded flex items-center justify-center bg-gray-100 overflow-hidden">
                    {bill.file.includes('pdf') ? (
                      <i className="fa-solid fa-file-pdf text-red-500 text-xl"></i>
                    ) : (
                      <img
                        src={bill.file}
                        alt="票据预览"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {bill.note || `票据_${bill.id.slice(-6)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(parseInt(bill.id)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(bill.id)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50"
                  title="删除票据"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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
      case 'finance': return <FinancialReview />; // 新增财务审核组件渲染
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
            <div className="bg-white rounded-lg p-6 shadow-md min-h-[500px]">
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