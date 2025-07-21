import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AgentTile({ agent }: { agent: {
  id: string;
  name: string;
  icon: string;
  status: 'online'|'busy'|'offline';
  category: string;
}}) {
  const [currentStatus, setCurrentStatus] = useState(agent.status);
  const [isActive, setIsActive] = useState(false);

  const statusColor = {
    online: 'bg-green-500',
    busy: 'bg-yellow-500',
    offline: 'bg-gray-500'
  };

  const statusText = {
    online: '在线',
    busy: '忙碌',
    offline: '离线'
  };

  const navigate = useNavigate();

  const handleClick = () => {
    setIsActive(!isActive);
    toast.success(`已${isActive ? '取消' : ''}选择 ${agent.name}`);
    navigate(`/agent/${agent.id}`);
  };

  const toggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statuses = ['online', 'busy', 'offline'] as const;
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    setCurrentStatus(nextStatus);
    toast.info(`${agent.name} 状态已设为 ${statusText[nextStatus]}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex flex-col items-center p-4 gap-2",
        "bg-[var(--card-bg)] rounded-xl shadow-[var(--card-shadow)] hover:shadow-md",
        "cursor-pointer transition-all duration-200",
        "border border-gray-100 hover:border-[var(--accent-color)]",
        isActive ? "ring-2 ring-[var(--accent-color)]" : ""
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <i className={`${agent.icon} text-3xl text-[var(--primary-color)]`}></i>
        <div 
          className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${statusColor[currentStatus]} cursor-pointer`}
          onClick={toggleStatus}
          title="点击切换状态"
        />
      </div>
      <span className="font-medium">{agent.name}</span>
      <span className="text-xs text-gray-500">{agent.category}</span>
    </motion.div>
  );
}