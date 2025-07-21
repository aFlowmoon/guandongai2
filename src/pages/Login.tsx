import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/App";

// 登录表单验证 schema
const loginSchema = z.object({
  username: z.string().min(3, "用户名至少需要3个字符"),
  password: z.string().min(6, "密码至少需要6个字符")
});

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // 模拟 API 请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录验证 (实际项目中应该调用后端 API)
      if (formData.username === "admin" && formData.password === "password") {
        // 登录成功，保存认证状态
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        toast.success("登录成功！");
        navigate("/"); // 重定向到主页
      } else {
        toast.error("用户名或密码错误");
      }
    } catch (error) {
      toast.error("登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-robot text-2xl text-blue-500"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">社区智能助手</h1>
              <p className="text-gray-500 mt-1">请登录您的账号</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-user text-gray-400"></i>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all",
                      errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    )}
                    placeholder="请输入用户名"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock text-gray-400"></i>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all",
                      errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    )}
                    placeholder="请输入密码"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
              >
                {isLoading && <i className="fa-solid fa-spinner animate-spin"></i>}
                {isLoading ? "登录中..." : "登录"}
              </button>
            </form>
            
            <div className="text-center text-sm text-gray-500">
              <p>
                演示账号: <span className="font-medium">admin</span> | 密码: <span className="font-medium">password</span>
              </p>
            </div>
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          © 2025 社区智能助手平台 - 基于Coze风格设计
        </p>
      </div>
    </div>
  );
}
