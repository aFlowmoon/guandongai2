import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const quickActions = [
  { 
    name: '知识上传', 
    icon: 'fa-solid fa-upload',
    action: () => window.location.href = "/knowledge#upload"
  },
  { 
    name: '模板搜索', 
    icon: 'fa-solid fa-magnifying-glass',
    action: () => window.location.href = "/templates"
  },
  { 
    name: '我的收藏', 
    icon: 'fa-solid fa-heart',
    action: () => window.location.href = "/profile#favorites"
  }
];

export default function QuickAccess() {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "grid grid-cols-3 gap-4",
      "bg-[var(--card-bg)] rounded-xl p-4 shadow-[var(--card-shadow)] border border-gray-100"
    )}>
      {quickActions.map((action) => (
        <motion.div 
          key={action.name}
          className={cn(
            "flex flex-col items-center gap-2 p-2",
            "cursor-pointer hover:text-[var(--primary-color)] rounded-lg",
            "transition-colors"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.action}
        >
          <motion.div 
            className="p-3 bg-[var(--primary-color)]/10 rounded-full"
            whileHover={{ rotate: 10 }}
          >
            <i className={`${action.icon} text-2xl text-[var(--primary-color)]`}></i>
          </motion.div>
          <span className="text-sm font-medium">{action.name}</span>
        </motion.div>
      ))}
    </div>
  );
}