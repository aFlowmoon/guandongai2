import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { knowledgeItems } from "@/data/mock";

const categories = ['全部', '政策', '服务', '活动', '其他'];

function KnowledgeStatus({ status }: { status: string }) {
  const statusColor = {
    draft: 'bg-gray-400',
    pending: 'bg-yellow-400',
    approved: 'bg-green-400'
  };

  const statusText = {
    draft: '草稿',
    pending: '待审核',
    approved: '已通过'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full text-white ${statusColor[status as keyof typeof statusColor]}`}>
      {statusText[status as keyof typeof statusText]}
    </span>
  );
}

function KnowledgeItem({ item }: { item: typeof knowledgeItems[0] }) {
  const [isImportant, setIsImportant] = useState(false);

  const handleSubmit = () => {
    if (isImportant) {
      toast.success('已提交重要知识审核!', {
        style: { borderLeft: '4px solid red' }
      });
    } else {
      toast('已提交知识审核');
    }
  };

  return (
    <div 
      className={cn(
        "p-4 mb-4 bg-white rounded-lg shadow-sm",
        "border border-transparent hover:border-[#FFA500]",
        isImportant ? "animate-pulse border-red-500" : ""
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{item.title}</h3>
        <KnowledgeStatus status={item.status} />
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.content}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{item.category}</span>
        <div className="flex gap-2">
          <button 
            className="text-xs px-2 py-1 bg-[#FFA500]/10 text-[#FFA500] rounded"
            onClick={() => setIsImportant(!isImportant)}
          >
            {isImportant ? '取消重要' : '标记重要'}
          </button>
          <button 
            className="text-xs px-2 py-1 bg-[#FFA500] text-white rounded"
            onClick={handleSubmit}
          >
            提交审核
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Knowledge() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [items, setItems] = useState(knowledgeItems);

  const filteredItems = knowledgeItems.filter(item => {
    const matchesCategory = activeCategory === '全部' || item.category === activeCategory;
    const matchesSearch = item.title.includes(searchQuery) || 
                         item.content.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
     <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />
      
      <main className="flex-1 container mx-auto p-4">
        {/* 分类筛选和搜索 */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category}
                className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  activeCategory === category 
                    ? "bg-[#FFA500] text-white" 
                    : "bg-gray-100 hover:bg-gray-200"
                )}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="搜索知识..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 知识列表和编辑器 */}
        <div className="flex gap-6">
          {/* 知识列表 */}
          <div className="w-2/3">
            <h2 className="text-xl font-bold mb-4">社区知识库</h2>
            <div className="space-y-3">
              {filteredItems.map(item => (
                <KnowledgeItem key={item.id} item={item} />
              ))}
            </div>
          </div>

           {/* 知识上传区 */}
          <div id="upload" className="w-1/3 scroll-mt-20">
            <h2 className="text-xl font-bold mb-4">知识上传</h2>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <i className="fa-solid fa-cloud-arrow-up text-4xl text-blue-500 mb-3"></i>
                <p className="mb-4">拖放文件到此处或</p>
                <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                  选择文件
                  <input type="file" className="hidden" onChange={(e) => {
                    if (e.target.files?.[0]) {
                      toast.success(`${e.target.files[0].name} 上传成功`);
                    }
                  }}/>
                </label>
                <p className="mt-3 text-sm text-gray-500">支持 PDF, DOCX, PPT, JPG, PNG</p>
              </div>
              
              <h3 className="mt-6 text-lg font-bold mb-2">知识编辑</h3>
              <textarea
                className="w-full h-40 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                placeholder="输入知识内容..."
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
              />
              <button 
                className="mt-3 w-full py-2 bg-[#FFA500] text-white rounded-lg hover:bg-[#FF8C00]"
                onClick={() => toast('知识已保存')}
              >
                保存知识
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}