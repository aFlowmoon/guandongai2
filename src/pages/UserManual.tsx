import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 手册章节数据
const manualSections = [
  {
    id: 'introduction',
    title: '简介',
    content: `
      <h3>欢迎使用社区智能助手平台</h3>
      <p>社区智能助手平台是一款专为社区工作者设计的综合管理工具，集成了智能对话、知识管理、模板库等功能，旨在提高社区工作效率，简化日常工作流程。</p>
      <h4 class="mt-4">主要功能</h4>
      <ul class="list-disc pl-5 space-y-1 mt-2">
        <li>智能助手对话 - 通过AI助手获取信息和帮助</li>
        <li>知识管理 - 上传、管理和分享社区知识库</li>
        <li>模板工坊 - 使用各类社区工作模板</li>
        <li>个人中心 - 管理个人信息和偏好设置</li>
        <li>建议箱 - 提交功能建议和问题反馈</li>
      </ul>
    `
  },
  {
    id: 'login',
    title: '登录与账户',
    content: `
      <h3>账户登录</h3>
      <p>访问平台时，您需要先进行登录：</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>在登录页面输入用户名和密码</li>
        <li>点击"登录"按钮</li>
        <li>登录成功后将自动跳转至首页</li>
      </ol>
      <div class="bg-blue-50 p-3 rounded-lg mt-4">
        <p class="text-sm"><strong>演示账号：</strong>admin</p>
        <p class="text-sm"><strong>密码：</strong>password</p>
      </div>
      <h4 class="mt-4">个人资料管理</h4>
      <p>您可以在个人中心修改个人信息：</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>点击右上角头像，选择"个人资料"</li>
        <li>在个人资料页面可以：
          <ul class="list-disc pl-5 mt-1">
            <li>上传或更换头像</li>
            <li>修改姓名</li>
            <li>查看我的知识和常用模板</li>
          </ul>
        </li>
        <li>完成修改后点击"保存"按钮</li>
      </ol>
    `
  },
  {
    id: 'dashboard',
    title: '首页与仪表盘',
    content: `
      <h3>首页概览</h3>
      <p>登录后，您将看到平台首页，包含以下主要区域：</p>
      <ul class="list-disc pl-5 space-y-2 mt-2">
        <li><strong>导航栏</strong> - 包含平台logo和用户菜单</li>
        <li><strong>侧边栏</strong> - 包含主要功能导航和历史会话</li>
        <li><strong>对话区域</strong> - 与智能助手交互的主要区域</li>
        <li><strong>功能按钮区</strong> - 快速访问常用功能</li>
        <li><strong>输入区域</strong> - 输入消息和上传文件</li>
      </ul>
      <h4 class="mt-4">侧边栏使用</h4>
      <p>侧边栏可以展开或收起，包含：</p>
      <ul class="list-disc pl-5 space-y-2 mt-2">
        <li>"新建会话"按钮 - 开始新的对话</li>
        <li>"功能菜单" - 包含知识上传和建议箱</li>
        <li>"历史会话" - 查看和继续之前的对话</li>
      </ul>
      <p class="mt-2">点击侧边栏左上角的箭头按钮可以切换侧边栏显示状态。</p>
    `
  },
  {
    id: 'chat',
    title: '智能对话',
    content: `
      <h3>与智能助手对话</h3>
      <p>平台提供智能助手功能，帮助您完成各种社区工作任务：</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>在底部输入框中输入您的问题或需求</li>
        <li>点击发送按钮或按Enter键发送消息</li>
        <li>智能助手将回复您的问题或执行相应任务</li>
      </ol>
      <h4 class="mt-4">功能按钮使用</h4>
      <p>输入框上方的功能按钮可以快速使用特定功能：</p>
      <ul class="list-disc pl-5 space-y-2 mt-2">
        <li><strong>社区海报</strong> - 生成社区活动海报</li>
        <li><strong>财务审核</strong> - 进行财务票据审核</li>
        <li><strong>图片生成</strong> - 生成所需图片</li>
        <li><strong>会议纪要</strong> - 生成会议纪要</li>
      </ul>
      <h4 class="mt-4">文件上传</h4>
      <p>您可以通过以下方式上传文件：</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>点击输入框左侧的回形针图标</li>
        <li>选择要上传的文件（支持图片和文档类型）</li>
        <li>等待上传完成，文件将自动添加到对话中</li>
      </ol>
      <p class="text-sm text-gray-500 mt-2">注意：文件大小限制为10MB</p>
    `
  },
  {
    id: 'knowledge',
    title: '知识管理',
    content: `
      <h3>知识库功能</h3>
      <p>知识库用于管理和共享社区相关知识和信息：</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>点击侧边栏的"知识上传"或顶部导航的"知识库"进入</li>
        <li>知识库页面分为两个区域：
          <ul class="list-disc pl-5 mt-1">
            <li>左侧：知识列表和分类筛选</li>
            <li>右侧：知识上传和编辑区域</li>
          </ul>
        </li>
      </ol>
      <h4 class="mt-4">上传知识</h4>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>在右侧上传区域，可以通过两种方式添加知识：
          <ul class="list-disc pl-5 mt-1">
            <li>拖放文件到上传区域</li>
            <li>点击"选择文件"按钮选择本地文件</li>
            <li>直接在编辑器中输入知识内容</li>
          </ul>
        </li>
        <li>支持的文件格式：PDF, DOCX, PPT, JPG, PNG</li>
        <li>点击"保存知识"按钮完成上传</li>
      </ol>
      <h4 class="mt-4">知识分类与搜索</h4>
      <p>您可以通过以下方式快速找到所需知识：</p>
      <ul class="list-disc pl-5 space-y-2 mt-2">
        <li>使用顶部分类按钮筛选不同类别的知识</li>
        <li>在搜索框中输入关键词搜索</li>
        <li>知识项显示状态标签：草稿、待审核、已通过</li>
      </ul>
    `
  },
  {
    id: 'templates',
    title: '模板工坊',
    content: `
      <h3>模板使用指南</h3>
      <p>模板工坊提供各类社区工作常用模板，帮助您快速完成工作：</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>点击顶部导航的"模板"进入模板工坊</li>
        <li>浏览可用模板或使用搜索功能查找特定模板</li>
        <li>点击模板卡片查看详情</li>
        <li>点击"使用模板"按钮应用该模板</li>
      </ol>
      <h4 class="mt-4">模板排序与筛选</h4>
      <p>您可以通过以下方式组织模板列表：</p>
      <ul class="list-disc pl-5 space-y-2 mt-2">
        <li>按评分排序 - 优先显示评分高的模板</li>
        <li>按使用量排序 - 优先显示使用次数多的模板</li>
        <li>我的收藏 - 只显示您收藏的模板</li>
      </ul>
      <h4 class="mt-4">收藏模板</h4>
      <p>为方便日后使用，您可以收藏常用模板：</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>找到需要收藏的模板</li>
        <li>点击模板标题旁的心形图标</li>
        <li>图标变为红色表示收藏成功</li>
        <li>收藏的模板可以在"我的收藏"中快速访问</li>
      </ol>
    `
  },
  {
    id: 'suggestion',
    title: '建议箱',
    content: `
      <h3>提交建议与反馈</h3>
      <p>建议箱功能允许您提交功能建议或问题反馈：</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>通过以下任一方式进入建议箱：
          <ul class="list-disc pl-5 mt-1">
            <li>点击侧边栏的"建议箱"按钮</li>
            <li>在任意页面使用顶部导航菜单</li>
          </ul>
        </li>
        <li>在建议箱页面，选择建议类型：
          <ul class="list-disc pl-5 mt-1">
            <li>功能建议 - 对新功能的建议</li>
            <li>问题反馈 - 报告使用中遇到的问题</li>
            <li>其他建议 - 其他类型的反馈</li>
          </ul>
        </li>
        <li>在文本框中详细描述您的建议</li>
        <li>点击"提交建议"按钮发送</li>
      </ol>
      <h4 class="mt-4">查看历史建议</h4>
      <p>您可以在建议箱页面底部查看之前提交的建议及其状态：</p>
      <ul class="list-disc pl-5 space-y-2 mt-2">
        <li>每条建议显示提交时间和当前状态</li>
        <li>状态包括：待处理、已处理</li>
        <li>建议按提交时间倒序排列</li>
      </ul>
    `
  },
  {
    id: 'faq',
    title: '常见问题',
    content: `
      <h3>常见问题解答</h3>
      
      <div class="mb-4">
        <h4 class="font-medium">如何修改我的密码？</h4>
        <p>目前系统暂不支持自助修改密码，请联系管理员进行密码重置。</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-medium">我可以上传多大的文件？</h4>
        <p>系统支持最大10MB的文件上传，支持的格式包括：JPEG, PNG, GIF, PDF, DOCX等。</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-medium">如何查看我的历史对话？</h4>
        <p>在侧边栏的"历史会话"部分可以查看您之前的对话记录，点击任意会话即可继续。</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-medium">知识库中的内容可以导出吗？</h4>
        <p>是的，您可以通过点击知识项旁的"导出"按钮将知识内容导出为PDF或Word格式。</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-medium">如何联系技术支持？</h4>
        <p>如有任何问题或需要技术支持，请通过建议箱提交反馈，我们将尽快回复您。</p>
      </div>
    `
  }
];

const UserManual = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  // 滚动到指定章节
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
         {/* 侧边栏 */}
         <SideNav visible={sidebarVisible} onToggle={toggleSidebar} />
        
        {/* 主内容区 */}
        <div className={`flex-1 flex flex-col overflow-auto bg-white transition-all duration-300 ${sidebarVisible ? '' : 'ml-0'}`}>
          <div className="max-w-4xl mx-auto w-full p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 目录 */}
              <div className="md:w-1/5 lg:w-1/6 sticky top-6 self-start">
                <div className="bg-white rounded-xl shadow-md p-2 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">目录</h2>
                  <ul className="space-y-1">
                    {manualSections.map(section => (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                            activeSection === section.id 
                              ? "bg-blue-500 text-white font-medium" 
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* 内容区域 */}
              <div className="md:w-3/4 lg:w-4/5 space-y-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">产品使用手册</h1>
                  <p className="text-gray-500">社区智能助手平台 - 使用指南</p>
                </div>
                
                {manualSections.map(section => (
                  <section 
                    key={section.id} 
                    id={section.id}
                    ref={el => sectionRefs.current[section.id] = el}
                    className={cn(
                      "bg-white rounded-xl shadow-md p-6 border border-gray-100",
                      activeSection === section.id ? "ring-2 ring-blue-500" : ""
                    )}
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </section>
                ))}
                
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h2 className="text-xl font-bold text-blue-800 mb-3">获取帮助</h2>
                  <p className="text-blue-700">
                    如果您在使用过程中遇到任何问题，请通过建议箱提交反馈，我们的团队将尽快为您提供帮助和支持。
                  </p>
                  <button 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      window.location.href = '/suggestions';
                      toast.info('跳转到建议箱页面');
                    }}
                  >
                    前往建议箱
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserManual;