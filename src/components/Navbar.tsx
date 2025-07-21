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
        className="flex items-center gap-3 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        onClick={() => navigate('/')}
      >
        <i className="fa-solid fa-robot text-2xl text-blue-500"></i>
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
            >
              <i className="fa-solid fa-user text-gray-600"></i>
            </motion.div>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 hidden group-hover:block transition-all">
              <button 
                onClick={() => navigate('/profile')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i className="fa-solid fa-user-circle mr-2"></i>个人资料
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <i className="fa-solid fa-sign-out-alt mr-2"></i>退出登录
              </button>
            </div>
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