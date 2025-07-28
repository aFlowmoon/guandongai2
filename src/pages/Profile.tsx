import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SideNav from "@/components/SideNav";
import AvatarUpload from "@/components/AvatarUpload";
import ProfileCard from "@/components/ProfileCard";
import { knowledgeItems } from "@/data/mock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AuthContext } from "@/App";

export default function Profile() {
  const [user, setUser] = useState(() => {
    // 临时清除localStorage以使用新的默认头像
    localStorage.removeItem('userProfile');
    return {
      name: '社区工作者',
      avatar: './assets/touxiang.png',
      role: '社区管理员'
    };
  });

  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  const handleAvatarUpload = (file: File) => {
    // 模拟上传逻辑
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        setUser({...user, avatar: reader.result as string});
      };
      reader.readAsDataURL(file);
    }, 500);
  };

  const handleSaveProfile = async (data: { name: string }) => {
    setUser({...user, name: data.name});
    toast.success('个人信息已保存');
  };

  const navigateToSource = (type: 'knowledge' | 'template', id: string) => {
    if (type === 'knowledge') {
      navigate('/knowledge');
    } else {
      navigate('/templates');
    }
    toast.info(`已跳转到${type === 'knowledge' ? '知识库' : '模板工坊'}`);
  };

  return (
     <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E6F0FF] to-[#F5F9FF]">
      <Navbar />
      
      <main className="flex-1 container mx-auto p-4">
        {/* 退出登录按钮 */}
        <div className="flex justify-end mb-6">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            onClick={() => {
              logout();
              localStorage.removeItem("isAuthenticated");
              window.location.href = "/login";
            }}
          >
            <i className="fa-solid fa-sign-out-alt"></i>退出登录
          </button>
        </div>
        <div className="flex gap-6">
          {/* 右侧内容区 */}
          <div className="flex-1 space-y-6">
            {/* 返回主页面按钮 */}
            <button
              className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              onClick={() => navigate("/")}
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>返回主页面
            </button>
            {/* 个人信息部分 */}
            <section id="account" className="scroll-mt-20">
              <div className="flex gap-6">
                <div className="w-1/4">
                  <AvatarUpload 
                    avatar={user.avatar} 
                    onUpload={handleAvatarUpload} 
                  />
                </div>
                <div className="flex-1">
                  <ProfileCard user={user} onSave={handleSaveProfile} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}