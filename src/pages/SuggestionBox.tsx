import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SideNav from "@/components/SideNav";
import { useNavigate } from "react-router-dom";

export default function SuggestionBox() {
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const [suggestionType, setSuggestionType] = useState("feature");

  // 从localStorage加载现有建议
  const loadSuggestions = () => {
    const saved = localStorage.getItem("suggestions");
    return saved ? JSON.parse(saved) : [];
  };

  // 保存建议到localStorage
  const saveSuggestion = (newSuggestion: any) => {
    const suggestions = loadSuggestions();
    suggestions.push({
      ...newSuggestion,
      id: Date.now().toString(),
      date: new Date().toISOString()
    });
    localStorage.setItem("suggestions", JSON.stringify(suggestions));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!suggestion.trim()) {
      toast.error("请输入您的建议");
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟API提交延迟
    setTimeout(() => {
      const newSuggestion = {
        type: suggestionType,
        content: suggestion,
        status: "pending"
      };
      
      saveSuggestion(newSuggestion);
      setSuggestion("");
      toast.success("感谢您的建议！我们会认真考虑。");
      setIsSubmitting(false);
    }, 800);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
         {/* 侧边栏 */}
         <SideNav visible={sidebarVisible} onToggle={toggleSidebar} 
           history={[]}
           onSelectHistory={() => {}}
           onDeleteHistory={() => {}}
           onNewChat={() => {}}
         />
        
         {/* 主内容区 */}
         <div className={`flex-1 flex flex-col overflow-auto bg-white p-8 transition-all duration-300 ${sidebarVisible ? '' : 'ml-0'}`}>
          <div className="max-w-2xl mx-auto w-full">
            {/* 返回主页面按钮 */}
            <button
              className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              onClick={() => navigate("/")}
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>返回主页面
            </button>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">建议箱</h1>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    建议类型
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm transition-colors",
                        suggestionType === "feature" 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                      onClick={() => setSuggestionType("feature")}
                    >
                      功能建议
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm transition-colors",
                        suggestionType === "bug" 
                          ? "bg-red-500 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                      onClick={() => setSuggestionType("bug")}
                    >
                      问题反馈
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm transition-colors",
                        suggestionType === "other" 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                      onClick={() => setSuggestionType("other")}
                    >
                      其他建议
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    建议内容
                  </label>
                  <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none h-40"
                    placeholder="请详细描述您的建议..."
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    返回
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    {isSubmitting && <i className="fa-solid fa-spinner animate-spin text-xs"></i>}
                    {isSubmitting ? "提交中..." : "提交建议"}
                  </button>
                </div>
              </form>
            </div>
            
            {/* 历史建议列表 */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">我的历史建议</h2>
              <div className="space-y-4">
                {loadSuggestions().slice(0, 3).map((item: any) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${
                        item.type === 'feature' ? 'bg-blue-500' : 
                        item.type === 'bug' ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        {item.type === 'feature' ? '功能建议' : 
                         item.type === 'bug' ? '问题反馈' : '其他建议'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{item.content}</p>
                    <div className="mt-2 flex justify-end">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                        {item.status === 'pending' ? '待处理' : '已处理'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {loadSuggestions().length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <i className="fa-regular fa-comment text-4xl text-gray-300 mb-2"></i>
                    <p className="text-gray-500">您还没有提交过建议</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
