import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/App";
import { toast } from "sonner";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem("isAuthenticated");
    toast.success("已成功登出");
    navigate("/login");
  };
  
  return (
     <header className={cn(
      "flex items-center justify-between p-4 px-6",
      "bg-white",
      "shadow-sm",
      "border-b border-gray-200 z-10"
    )}>
      <motion.div 
        className="flex items-center gap-3 cursor-pointer ml-16"
        whileHover={{ scale: 1.02 }}
        onClick={() => navigate('/')}
      >
        <img src="/assets/avatar-girl.png" alt="小人头像" className="w-10 h-10 object-contain" />
         <h1 className="text-xl font-bold text-gray-800">
           社区智能助手
         </h1>
      </motion.div>
      
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <motion.button 
            className="p-2 rounded-full hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-regular fa-bell text-lg text-gray-600 hover:text-blue-500"></i>
          </motion.button>
          
          <div className="relative group">
            <motion.div 
              className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-blue-200 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
            >
              <i className="fa-solid fa-user text-gray-600"></i>
            </motion.div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          登录
        </button>
      )}
    </header>
  );
}