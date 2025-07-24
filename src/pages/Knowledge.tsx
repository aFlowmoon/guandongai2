import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { knowledgeItems } from "@/data/mock";
import { useEffect } from "react";
import { registeredUsers } from "@/data/mock";

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

function KnowledgeItem({ item, onEdit, onDelete, onToggleImportant, repoType }: {
  item: any;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  onToggleImportant?: (id: string) => void;
  repoType: 'personal' | 'shared';
}) {
  return (
    <div 
      className={cn(
        "p-4 mb-4 bg-white rounded-lg shadow-sm",
        "border border-transparent hover:border-[#FFA500]",
        item.important ? "border-red-500" : ""
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{item.title}</h3>
        {repoType === 'shared' && <KnowledgeStatus status={item.status} />}
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.content}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{item.category}</span>
        <div className="flex gap-2">
          {repoType === 'personal' ? (
            <>
              <button
                className={cn("text-xs px-2 py-1 rounded", item.important ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700")}
                onClick={() => onToggleImportant && onToggleImportant(item.id)}
              >{item.important ? '已标记重要' : '标记重要'}</button>
              <button
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                onClick={() => onEdit && onEdit(item)}
              >编辑</button>
              <button
                className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded"
                onClick={() => onDelete && onDelete(item.id)}
              >删除</button>
            </>
          ) : (
            <>
              <button 
                className="text-xs px-2 py-1 bg-[#FFA500]/10 text-[#FFA500] rounded"
                onClick={() => onToggleImportant && onToggleImportant(item.id)}
              >{item.important ? '已标记重要' : '标记重要'}</button>
              <button 
                className="text-xs px-2 py-1 bg-[#FFA500] text-white rounded"
                onClick={() => onEdit && onEdit(item)}
              >提交审核</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Knowledge() {
  // 当前库类型：personal 或 shared
  const [repoType, setRepoType] = useState<'personal' | 'shared'>('personal');
  // 分类列表
  const [personalCategories, setPersonalCategories] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('personalCategories') || '["全部"]');
  });
  const [sharedCategories, setSharedCategories] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('sharedCategories') || '["全部"]');
  });
  // 当前选中分类
  const [activeCategory, setActiveCategory] = useState('全部');
  // 新建分类输入
  const [newCategory, setNewCategory] = useState('');
  // 知识内容
  const [editorContent, setEditorContent] = useState('');
  // 知识数据
  const [personalItems, setPersonalItems] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('personalItems') || '[]');
  });
  const [sharedItems, setSharedItems] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('sharedItems') || '[]');
  });
  // 搜索
  const [searchQuery, setSearchQuery] = useState('');

  // 编辑相关
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editContent, setEditContent] = useState('');

  // 持久化
  useEffect(() => {
    localStorage.setItem('personalCategories', JSON.stringify(personalCategories));
  }, [personalCategories]);
  useEffect(() => {
    localStorage.setItem('sharedCategories', JSON.stringify(sharedCategories));
  }, [sharedCategories]);
  useEffect(() => {
    localStorage.setItem('personalItems', JSON.stringify(personalItems));
  }, [personalItems]);
  useEffect(() => {
    localStorage.setItem('sharedItems', JSON.stringify(sharedItems));
  }, [sharedItems]);

  // 分类-成员关系（仅共享库）
  const [sharedCategoryMembers, setSharedCategoryMembers] = useState<{ [cat: string]: string[] }>(() => {
    return JSON.parse(localStorage.getItem('sharedCategoryMembers') || '{}');
  });
  useEffect(() => {
    localStorage.setItem('sharedCategoryMembers', JSON.stringify(sharedCategoryMembers));
  }, [sharedCategoryMembers]);

  // 邀请弹窗
  const [inviteCategory, setInviteCategory] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  // 邀请成员
  const handleInvite = () => {
    if (!selectedUserId) return toast.error('请选择成员');
    setSharedCategoryMembers(prev => {
      const old = prev[inviteCategory!] || [];
      if (old.includes(selectedUserId)) {
        toast.error('该成员已在协作列表');
        return prev;
      }
      toast.success('邀请成功');
      return { ...prev, [inviteCategory!]: [...old, selectedUserId] };
    });
    setInviteCategory(null);
    setSelectedUserId('');
  };
  // 移除成员
  const handleRemoveMember = (cat: string, uid: string) => {
    setSharedCategoryMembers(prev => ({
      ...prev,
      [cat]: (prev[cat] || []).filter(id => id !== uid)
    }));
  };

  // 当前库相关数据
  const categories = repoType === 'personal' ? personalCategories : sharedCategories;
  const items = repoType === 'personal' ? personalItems : sharedItems;
  const setItems = repoType === 'personal' ? setPersonalItems : setSharedItems;
  const setCategories = repoType === 'personal' ? setPersonalCategories : setSharedCategories;

  // 过滤知识
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === '全部' || item.category === activeCategory;
    const matchesSearch = item.title?.includes(searchQuery) || item.content?.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // 新建分类
  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (!name) return toast.error('分类名不能为空');
    if (categories.includes(name)) return toast.error('分类已存在');
    setCategories([...categories, name]);
    setNewCategory('');
    toast.success('分类创建成功');
  };

  // 上传知识
  const handleSaveKnowledge = () => {
    if (!editorContent.trim()) return toast.error('知识内容不能为空');
    if (!activeCategory) return toast.error('请选择分类');
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        title: editorContent.slice(0, 10) + (editorContent.length > 10 ? '...' : ''),
        content: editorContent,
        category: activeCategory,
        status: 'draft'
      }
    ]);
    setEditorContent('');
    toast.success('知识已保存');
  };

  // 编辑知识
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditContent(item.content);
  };
  const handleEditSave = () => {
    setItems(items.map(i => i.id === editingItem.id ? { ...i, content: editContent, title: editContent.slice(0, 10) + (editContent.length > 10 ? '...' : '') } : i));
    setEditingItem(null);
    setEditContent('');
    toast.success('知识已更新');
  };
  // 删除知识
  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast.success('已删除');
  };
  // 标记重要
  const handleToggleImportant = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, important: !i.important } : i));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        {/* 返回主页面按钮 */}
        <button
          className="mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
          onClick={() => window.location.href = '/'}
        >
          <i className="fa-solid fa-arrow-left"></i>返回主页面
        </button>
        {/* 库类型切换 */}
        <div className="mb-6 flex gap-4">
          <button
            className={cn(
              "px-6 py-2 rounded-lg font-bold",
              repoType === 'personal' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            )}
            onClick={() => { setRepoType('personal'); setActiveCategory('全部'); }}
          >个人知识库</button>
          <button
            className={cn(
              "px-6 py-2 rounded-lg font-bold",
              repoType === 'shared' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            )}
            onClick={() => { setRepoType('shared'); setActiveCategory('全部'); }}
          >共享知识库</button>
        </div>
        {/* 分类筛选和新建分类 */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <div key={category} className="relative inline-block mr-2 mb-2">
                <button
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    activeCategory === category 
                      ? "bg-[#FFA500] text-white" 
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                  onClick={() => setActiveCategory(category)}
                  style={{ position: 'relative', zIndex: 1 }}
                >{category}</button>
                {/* 显示协作成员 */}
                {repoType === 'shared' && category !== '全部' && sharedCategoryMembers[category]?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {sharedCategoryMembers[category].map(uid => {
                      const user = registeredUsers.find(u => u.id === uid);
                      return user ? (
                        <span key={uid} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                          {user.name}
                          <button className="ml-1 text-red-400 hover:text-red-600" title="移除" onClick={() => handleRemoveMember(category, uid)}>×</button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {category !== '全部' && (
                  <button
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full shadow hover:bg-red-700 transition-colors"
                    title="删除分类"
                    style={{ zIndex: 2 }}
                    onClick={() => {
                      setCategories(categories.filter(c => c !== category));
                      setItems(items.filter(i => i.category !== category));
                      if (activeCategory === category) setActiveCategory('全部');
                      toast.success('分类已删除');
                    }}
                  >×</button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center mb-2">
            <input
              type="text"
              className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="新建分类名称"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
            />
            <button
              className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleAddCategory}
            >新建分类</button>
            {/* 恢复：全局邀请成员按钮，仅共享库下显示 */}
            {repoType === 'shared' && (
              <button
                className="px-4 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 border border-blue-300 ml-2"
                onClick={() => { setInviteCategory(''); setSelectedUserId(''); }}
              >邀请成员</button>
            )}
          </div>
          {/* 恢复：全局邀请成员弹窗 */}
          {repoType === 'shared' && inviteCategory === '' && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
                <h3 className="text-lg font-bold mb-4">邀请成员加入分类</h3>
                <select
                  className="w-full border rounded p-2 mb-4"
                  value={inviteCategory}
                  onChange={e => setInviteCategory(e.target.value)}
                >
                  <option value="">请选择分类</option>
                  {categories.filter(c => c !== '全部').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  className="w-full border rounded p-2 mb-4"
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                >
                  <option value="">请选择成员</option>
                  {registeredUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setInviteCategory(null)}>取消</button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleInvite}>邀请</button>
                </div>
              </div>
            </div>
          )}
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
        {/* 知识列表和上传区 */}
        <div className="flex gap-6">
          {/* 知识列表 */}
          <div className="w-2/3">
            <h2 className="text-xl font-bold mb-4">{repoType === 'personal' ? '个人知识库' : '共享知识库'}</h2>
            <div className="space-y-3">
              {filteredItems.length === 0 && (
                <div className="text-gray-400 text-center py-8">暂无知识</div>
              )}
              {filteredItems.map(item => (
                <KnowledgeItem 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleImportant={handleToggleImportant}
                  repoType={repoType}
                />
              ))}
            </div>
          </div>
          {/* 知识上传区 */}
          <div id="upload" className="w-1/3 scroll-mt-20">
            <h2 className="text-xl font-bold mb-4">知识上传</h2>
            <div className="p-4 bg-white rounded-lg shadow-md">
              {/* 编辑弹窗 */}
              {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                    <h3 className="text-lg font-bold mb-4">编辑知识</h3>
                    <textarea
                      className="w-full h-40 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setEditingItem(null)}>取消</button>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleEditSave}>保存</button>
                    </div>
                  </div>
                </div>
              )}
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
                onClick={handleSaveKnowledge}
              >保存知识</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}