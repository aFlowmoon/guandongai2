export const favorites: string[] = ['1', '3'];

export const agents = [
  {
    id: '1',
    name: '社区海报',
    icon: 'fa-solid fa-image',
    status: 'online',
    category: '宣传'
  },
  {
    id: '2',
    name: '财务审核',
    icon: 'fa-solid fa-file-invoice-dollar',
    status: 'online',
    category: '财务'
  },
  {
    id: '3',
    name: '走访记录',
    icon: 'fa-solid fa-clipboard-list',
    status: 'busy',
    category: '服务'
  },
  {
    id: '4',
    name: '活动策划',
    icon: 'fa-solid fa-calendar-check',
    status: 'offline',
    category: '组织'
  },
  {
    id: '5',
    name: '图片生成',
    icon: 'fa-solid fa-camera',
    status: 'online',
    category: '工具'
  },
  {
    id: '6',
    name: '会议纪要',
    icon: 'fa-solid fa-file-lines',
    status: 'online',
    category: '办公'
  }
];

export const announcements = [
  {
    id: '1',
    title: '系统升级通知',
    content: '平台将于本周五凌晨进行系统升级，预计停机2小时。',
    date: '2025-07-10'
  },
  {
    id: '2',
    title: '新功能上线',
    content: '财务审核智能体新增自动票据识别功能，欢迎体验。',
    date: '2025-07-05'
  }
];

export const posterTemplates = [
  {
    id: '1',
    name: '节日活动海报',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E8%8A%82%E6%97%A5%E6%B4%BB%E5%8A%A8%E6%B5%B7%E6%8A%A5%E6%A8%A1%E6%9D%BF&sign=b4776236c6125ed6a46cf922e4f773f5'
  },
  {
    id: '2',
    name: '社区通知海报',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%A4%BE%E5%8C%BA%E9%80%9A%E7%9F%A5%E6%B5%B7%E6%8A%A5%E6%A8%A1%E6%9D%BF&sign=0476ad9516b00e17319650f06624c679'
  }
];

export const financialBills = [
  {
    id: '1',
    type: '办公用品',
    amount: 1200,
    date: '2025-07-01'
  },
  {
    id: '2',
    type: '活动经费',
    amount: 3500,
    date: '2025-07-05'
  }
];

export const knowledgeItems = [
  {
    id: '1',
    title: '社区养老服务政策',
    content: '最新社区养老服务政策解读...\n1. 服务对象\n2. 服务内容\n3. 申请流程',
    status: 'approved',
    category: '政策',
    owner: 'admin',
    isShared: true
  },
  {
    id: '2',
    title: '暑期儿童活动安排',
    content: '7月15日-8月20日暑期活动安排...\n包括书法、绘画、手工等课程',
    status: 'pending',
    category: '活动',
    owner: 'admin',
    isShared: false
  },
  {
    id: '3',
    title: '社区便民服务指南',
    content: '水电维修、家政服务等联系方式...',
    status: 'approved',
    category: '服务',
    owner: 'system',
    isShared: true
  },
  {
    id: '4',
    title: '垃圾分类新规草案',
    content: '拟实施的垃圾分类新标准...',
    status: 'draft',
    category: '政策',
    owner: 'admin',
    isShared: false
  },
  {
    id: '5',
    title: '社区安全管理规范',
    content: '社区安全巡逻制度及应急处理流程...',
    status: 'approved',
    category: '管理',
    owner: 'system',
    isShared: true
  },
  {
    id: '6',
    title: '个人工作笔记',
    content: '7月走访记录及居民反馈整理...',
    status: 'draft',
    category: '个人',
    owner: 'admin',
    isShared: false
  }
];

// 新增：历史会话数据
export const chatHistory = [
  {
    id: '1',
    title: '社区海报设计',
    time: '今天 09:25',
    agentId: '1'
  },
  {
    id: '2',
    title: '7月财务审核',
    time: '昨天 14:30',
    agentId: '2'
  },
  {
    id: '3',
    title: '走访记录整理',
    time: '07月15日',
    agentId: '3'
  },
  {
    id: '4',
    title: '社区活动策划',
    time: '07月10日',
    agentId: '4'
  }
];

// 新增：底部功能按钮
export const functionButtons = [
  {
    id: 'poster',
    name: '社区海报',
    icon: 'fa-solid fa-image',
    color: 'bg-blue-500'
  },
  {
    id: 'finance',
    name: '财务审核',
    icon: 'fa-solid fa-file-invoice-dollar',
    color: 'bg-green-500'
  },
  {
    id: 'image-gen',
    name: '图片生成',
    icon: 'fa-solid fa-camera',
    color: 'bg-purple-500'
  },
  {
    id: 'meeting',
    name: '会议纪要',
    icon: 'fa-solid fa-file-lines',
    color: 'bg-amber-500'
  },
  {
    id: 'more',
    name: '更多',
    icon: 'fa-solid fa-ellipsis',
    color: 'bg-gray-500'
  }
];