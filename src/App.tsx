import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Agents from "@/pages/Agents";
import Knowledge from "@/pages/Knowledge";
import Templates from "@/pages/Templates";
import Profile from "@/pages/Profile";
import SuggestionBox from "@/pages/SuggestionBox";
import AgentChat from "@/pages/AgentChat";
import UserManual from "@/pages/UserManual";
import Login from "@/pages/Login";
import { createContext, useState, useEffect } from "react";

// 受保护路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 检查认证状态
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><i className="fa-solid fa-spinner animate-spin text-2xl text-blue-500"></i></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化时检查认证状态
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<Login />} />
          
          {/* 受保护路由 */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />
          <Route path="/knowledge" element={<ProtectedRoute><Knowledge /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/suggestions" element={<ProtectedRoute><SuggestionBox /></ProtectedRoute>} />
        <Route path="/agent/:id" element={<ProtectedRoute><AgentChat /></ProtectedRoute>} />
        <Route path="/manual" element={<ProtectedRoute><UserManual /></ProtectedRoute>} />
        
          {/* 重定向所有其他路由到登录页 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </AuthContext.Provider>
  );
}
