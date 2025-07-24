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

const mockTemplates = [
  {
    id: '1',
    title: '社区活动通知',
    description: '适用于社区节日活动、居民会议等通知场景',
    rating: 4.5,
    useCount: 128
  },
  {
    id: '2',
    title: '财务公示模板',
    description: '社区财务收支公示标准模板',
    rating: 4.2,
    useCount: 86
  }
];

export default function Profile() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userProfile');
    return savedUser ? JSON.parse(savedUser) : {
      name: '社区工作者',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%A4%BE%E5%8C%BA%E5%B7%A5%E4%BD%9C%E8%80%85%E5%A4%B4%E5%83%8F&sign=33ec6bb5cb9e4e54a61496b915bbcf64',
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

            {/* 我的知识部分 */}
            <section id="knowledge" className="scroll-mt-20">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">我的知识</h3>
                <div className="space-y-3">
                  {knowledgeItems
                    .filter(item => item.status === 'approved')
                    .map(item => (
                      <div 
                        key={item.id}
                        className={cn(
                          "p-4 border rounded-lg hover:shadow-md",
                          "flex justify-between items-center"
                        )}
                      >
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{item.content}</p>
                        </div>
                        <button
                          className="px-3 py-1 bg-[#FFA500]/10 text-[#FFA500] rounded-lg text-sm hover:bg-[#FFA500]/20"
                          onClick={() => navigateToSource('knowledge', item.id)}
                        >
                          查看
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </section>

            {/* 常用模板部分 */}
            <section id="templates" className="scroll-mt-20">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">常用模板</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockTemplates.map(template => (
                    <div 
                      key={template.id}
                      className={cn(
                        "p-4 border rounded-lg hover:shadow-md",
                        "flex flex-col"
                      )}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{template.title}</h4>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {template.useCount}次使用
                        </span>
                        <button
                          className="px-3 py-1 bg-[#FFA500]/10 text-[#FFA500] rounded-lg text-sm hover:bg-[#FFA500]/20"
                          onClick={() => navigateToSource('template', template.id)}
                        >
                          使用模板
                        </button>
                      </div>
                    </div>
                  ))}
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