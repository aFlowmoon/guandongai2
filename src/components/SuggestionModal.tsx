import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuggestionModal({ isOpen, onClose }: SuggestionModalProps) {
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      onClose();
      setIsSubmitting(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">建议箱</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                建议类型
              </label>
              <div className="grid grid-cols-3 gap-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                建议内容
              </label>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none h-32"
                placeholder="请详细描述您的建议..."
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                取消
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
      </motion.div>
    </div>
  );
}