import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Template = {
  id: string;
  title: string;
  description: string;
  rating: number;
  useCount: number;
  isHot?: boolean;
  versions?: {
    id: string;
    version: string;
    updateNote: string;
    date: string;
  }[];
};

const mockTemplates: Template[] = [
  {
    id: '1',
    title: '社区活动通知',
    description: '适用于社区节日活动、居民会议等通知场景',
    rating: 4.5,
    useCount: 128,
    isHot: true,
    versions: [
      { id: '1', version: '1.0', updateNote: '初始版本', date: '2025-06-01' },
      { id: '2', version: '1.1', updateNote: '增加节日问候语', date: '2025-06-15' }
    ]
  },
  {
    id: '2',
    title: '财务公示模板',
    description: '社区财务收支公示标准模板',
    rating: 4.2,
    useCount: 86,
    versions: [
      { id: '1', version: '1.0', updateNote: '初始版本', date: '2025-05-10' }
    ]
  },
  {
    id: '3',
    title: '便民服务指南',
    description: '社区便民服务联系方式集合模板',
    rating: 4.8,
    useCount: 156,
    isHot: true,
    versions: [
      { id: '1', version: '1.0', updateNote: '初始版本', date: '2025-04-20' },
      { id: '2', version: '1.1', updateNote: '增加维修服务分类', date: '2025-05-05' },
      { id: '3', version: '1.2', updateNote: '更新联系方式', date: '2025-06-12' }
    ]
  },
  {
    id: '4',
    title: '走访记录表',
    description: '社区工作人员走访居民记录模板',
    rating: 3.9,
    useCount: 64,
    versions: [
      { id: '1', version: '1.0', updateNote: '初始版本', date: '2025-05-25' }
    ]
  }
];

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [sortBy, setSortBy] = useState<'rating' | 'useCount'>('rating');
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('templateFavorites') || '[]');
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const sortedTemplates = [...templates].sort((a, b) => {
    return b[sortBy] - a[sortBy];
  });

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('templateFavorites', JSON.stringify(newFavorites));
    toast.success(favorites.includes(id) ? '已取消收藏' : '已添加到收藏');
  };

  const handleRate = (id: string, rating: number) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, rating } : template
    ));
    toast.success('评分已提交');
  };

  return (
     <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E6F0FF] to-[#F5F9FF]">
      <Navbar />
      
      <main className="flex-1 container mx-auto p-4">
         {/* 排序筛选栏 */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">模板工坊</h1>
            <div className="flex gap-4">
              <button 
                className={cn(
                  "px-4 py-2 rounded-lg",
                  sortBy === 'rating' ? "bg-[#FFA500] text-white" : "bg-gray-100 hover:bg-gray-200"
                )}
                onClick={() => setSortBy('rating')}
              >
                按评分排序
              </button>
              <button 
                className={cn(
                  "px-4 py-2 rounded-lg",
                  sortBy === 'useCount' ? "bg-[#FFA500] text-white" : "bg-gray-100 hover:bg-gray-200"
                )}
                onClick={() => setSortBy('useCount')}
              >
                按使用量排序
              </button>
              <button 
                className="px-4 py-2 bg-[#FFD700] text-white rounded-lg"
                onClick={() => {
                  setTemplates(mockTemplates.filter(t => favorites.includes(t.id)));
                  toast.success('已筛选收藏模板');
                }}
              >
                <i className="fa-solid fa-heart mr-2"></i>
                我的收藏
              </button>
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="mt-4 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="搜索模板..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                setTemplates(mockTemplates.filter(t => 
                  t.title.toLowerCase().includes(query) || 
                  t.description.toLowerCase().includes(query)
                ));
              }}
            />
          </div>
        </div>

        {/* 模板展示区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedTemplates.map(template => (
            <div 
              key={template.id}
              className={cn(
                "p-4 bg-white rounded-lg shadow-sm",
                "border border-transparent hover:shadow-md",
                "transition-all duration-200",
                "flex flex-col h-full"
              )}
            >
              {/* 模板标题和收藏按钮 */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold">{template.title}</h2>
                <button 
                  onClick={() => toggleFavorite(template.id)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  <i className={cn(
                    "fa-heart",
                    favorites.includes(template.id) 
                      ? "fa-solid text-red-500" 
                      : "fa-regular text-gray-300"
                  )}></i>
                </button>
              </div>

              {/* 热门标识 */}
              {template.isHot && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-tr-lg rounded-bl-lg">
                  热门
                </div>
              )}

              {/* 模板描述 */}
              <p className="text-gray-600 mb-4 flex-1">{template.description}</p>

              {/* 使用量和评分 */}
              <div className="flex justify-between items-center mt-auto">
                <span className="text-sm text-gray-500">
                  <i className="fa-solid fa-download mr-1"></i>
                  {template.useCount}次使用
                </span>
                
                {/* 评分星标 */}
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleRate(template.id, star)}
                      className="text-xl hover:scale-125 transition-transform"
                    >
                      <i className={cn(
                        "fa-star",
                        star <= Math.round(template.rating) 
                          ? "fa-solid text-[#FFD700]" 
                          : "fa-regular text-gray-300"
                      )}></i>
                    </button>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    ({template.rating.toFixed(1)})
                  </span>
                </div>
              </div>

              {/* 版本管理 */}
              {selectedTemplate === template.id && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">版本历史</h3>
                  <ul className="space-y-2">
                    {template.versions?.map(version => (
                      <li key={version.id} className="text-sm">
                        <div className="font-medium">{version.version}</div>
                        <div className="text-gray-500">{version.updateNote}</div>
                        <div className="text-xs text-gray-400">{version.date}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                className="mt-3 text-sm text-[#FFA500] hover:underline"
                onClick={() => setSelectedTemplate(
                  selectedTemplate === template.id ? null : template.id
                )}
              >
                {selectedTemplate === template.id ? '隐藏版本' : '查看版本'}
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}