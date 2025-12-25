
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Tags, ChevronLeft, Edit, Trash2, 
  Database, Layers, Box, Hash, Type, FileText, CheckCircle2, 
  MoreHorizontal, Settings2, Sliders, Info, ListTree, Save, X, Server,
  ChevronDown, Globe, ShieldCheck, Zap, FileCode, ArrowDownUp
} from 'lucide-react';
import { DeviceCategory, StandardDP, DataType, AccessMode } from '../types';

// --- Mock Data ---

const MOCK_CATEGORIES: DeviceCategory[] = [
  {
    id: 'CAT-001',
    name: '照明设备',
    code: 'lighting',
    description: '包括各类智能灯具、灯带、筒灯等照明控制设备，支持开关、亮度调节及色温控制。',
    standardDPs: [
      { id: 'dp1', identifier: 'switch', name: '开关', dataType: 'Boolean', accessMode: 'RW', description: '灯光开关控制' },
      { id: 'dp2', identifier: 'brightness', name: '亮度', dataType: 'Integer', accessMode: 'RW', range: '0-100', unit: '%', step: 1, description: '光度调节' },
      { id: 'dp3', identifier: 'color_temp', name: '色温', dataType: 'Integer', accessMode: 'RW', range: '2700-6500', unit: 'K', step: 100, description: '色温调节' },
    ],
    brandCount: 4,
    deviceCount: 156,
    createTime: '2023-11-15',
    updateTime: '2024-03-20'
  },
  {
    id: 'CAT-002',
    name: '暖通空调 (HVAC)',
    code: 'hvac',
    description: '适用于中央空调、VRV、分体空调及新风系统。包含温度控制、模式切换及风速调节。',
    standardDPs: [
      { id: 'dp1', identifier: 'switch', name: '电源开关', dataType: 'Boolean', accessMode: 'RW', description: '设备启停' },
      { id: 'dp2', identifier: 'temp_set', name: '目标温度', dataType: 'Integer', accessMode: 'RW', range: '16-32', unit: '°C', step: 1, description: '设定目标温度' },
      { id: 'dp3', identifier: 'temp_current', name: '当前温度', dataType: 'Integer', accessMode: 'RO', range: '-20-100', unit: '°C', description: '环境回风温度' },
      { id: 'dp4', identifier: 'mode', name: '运行模式', dataType: 'Enum', accessMode: 'RW', range: 'cool,heat,fan,dry,auto', description: '工作模式切换' },
      { id: 'dp5', identifier: 'fan_speed', name: '风速', dataType: 'Enum', accessMode: 'RW', range: 'auto,low,mid,high', description: '风机转速' },
    ],
    brandCount: 8,
    deviceCount: 156,
    createTime: '2023-02-10',
    updateTime: '2023-10-05'
  },
  {
    id: 'CAT-003',
    name: '智能电表',
    code: 'meter_elec',
    description: '单相/三相智能电表，支持电压、电流、功率、功率因数及电能计量数据上报。',
    standardDPs: [
      { id: 'dp1', identifier: 'voltage_a', name: 'A相电压', dataType: 'Integer', accessMode: 'RO', unit: 'V', multiplier: 0.1, description: 'A相电压值' },
      { id: 'dp2', identifier: 'current_a', name: 'A相电流', dataType: 'Integer', accessMode: 'RO', unit: 'A', multiplier: 0.001, description: 'A相电流值' },
      { id: 'dp3', identifier: 'active_power', name: '有功功率', dataType: 'Integer', accessMode: 'RO', unit: 'kW', multiplier: 0.001, description: '总有功功率' },
      { id: 'dp4', identifier: 'total_energy', name: '总电能', dataType: 'Integer', accessMode: 'RO', unit: 'kWh', multiplier: 0.01, description: '累计有功总电能' },
    ],
    brandCount: 5,
    deviceCount: 85,
    createTime: '2023-03-22',
    updateTime: '2023-09-12'
  }
];

const MOCK_ASSOCIATED_BRANDS = [
    { name: 'Philips Hue', devices: 45, logo: 'PH', status: '已适配' },
    { name: 'Yeelight', devices: 32, logo: 'YL', status: '已适配' },
    { name: 'Lifx', devices: 12, logo: 'LX', status: '已适配' },
    { name: '欧普照明', devices: 67, logo: 'OP', status: '已适配' },
];

// --- Sub-components ---

const DataPointBadge = ({ type }: { type: DataType }) => {
  const styles: any = {
    Boolean: 'bg-blue-50 text-blue-600 border-blue-100',
    Integer: 'bg-green-50 text-green-600 border-green-100',
    Enum: 'bg-purple-50 text-purple-600 border-purple-100',
    String: 'bg-gray-100 text-gray-600 border-gray-200',
    Json: 'bg-orange-50 text-orange-600 border-orange-100',
  };
  
  // Icon mapping
  const icons: any = {
      Boolean: <CheckCircle2 size={10} className="mr-1"/>,
      Integer: <Hash size={10} className="mr-1"/>,
      Enum: <ListTree size={10} className="mr-1"/>,
      String: <Type size={10} className="mr-1"/>,
      Json: <FileCode size={10} className="mr-1"/>
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center w-fit ${styles[type]}`}>
      {icons[type]} {type.toUpperCase()}
    </span>
  );
};

const AccessModeBadge = ({ mode }: { mode: AccessMode }) => {
  const styles: any = {
    RW: 'bg-green-100 text-green-700',
    RO: 'bg-blue-100 text-blue-700',
    WO: 'bg-orange-100 text-orange-700',
  };
  return <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${styles[mode]}`}>{mode}</span>;
};

// --- Modal Component ---

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceCategory) => void;
  initialData?: DeviceCategory | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'dp'>('basic');
  const [formData, setFormData] = useState<Partial<DeviceCategory>>({
    name: '', code: '', description: '', standardDPs: []
  });

  // State for new DP input
  const [newDP, setNewDP] = useState<Partial<StandardDP>>({
    identifier: '', name: '', dataType: 'Boolean', accessMode: 'RW', description: ''
  });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData))); // Deep copy
      } else {
        setFormData({ name: '', code: '', description: '', standardDPs: [], brandCount: 0, deviceCount: 0 });
      }
      setActiveTab('basic');
      setNewDP({ identifier: '', name: '', dataType: 'Boolean', accessMode: 'RW', description: '' });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleAddDP = () => {
    if (!newDP.identifier || !newDP.name) {
      alert('请填写DP点标识符和名称');
      return;
    }
    const dp: StandardDP = {
      ...newDP as StandardDP,
      id: `dp-${Date.now()}`,
    };
    setFormData(prev => ({
      ...prev,
      standardDPs: [...(prev.standardDPs || []), dp]
    }));
    setNewDP({ identifier: '', name: '', dataType: 'Boolean', accessMode: 'RW', description: '' });
  };

  const removeDP = (id: string) => {
    setFormData(prev => ({
      ...prev,
      standardDPs: prev.standardDPs?.filter(d => d.id !== id)
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) return;
    onSubmit({
      ...formData,
      createTime: formData.createTime || new Date().toISOString().split('T')[0],
      updateTime: new Date().toISOString().split('T')[0],
    } as DeviceCategory);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-[#2D4965]">{initialData ? '编辑设备品类' : '创建新设备品类'}</h3>
            <p className="text-xs text-[#92A2C3] mt-0.5">定义品类基础属性及标准功能点 (DP)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-100 flex gap-6 bg-white sticky top-0 z-10">
          <button 
            onClick={() => setActiveTab('basic')}
            className={`py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'basic' ? 'border-[#225AC8] text-[#225AC8]' : 'border-transparent text-[#92A2C3] hover:text-[#535E73]'}`}
          >
            基础信息
          </button>
          <button 
            onClick={() => setActiveTab('dp')}
            className={`py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'dp' ? 'border-[#225AC8] text-[#225AC8]' : 'border-transparent text-[#92A2C3] hover:text-[#535E73]'}`}
          >
            标准 DP 定义 <span className="ml-1 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full text-[10px]">{formData.standardDPs?.length || 0}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#F8FAFC]">
          {activeTab === 'basic' ? (
            <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-6 max-w-2xl mx-auto">
               <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2">
                   <label className="block text-xs font-bold text-[#535E73] mb-1.5">品类名称 <span className="text-red-500">*</span></label>
                   <input 
                     type="text" 
                     className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                     placeholder="例如：智能窗帘"
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-[#535E73] mb-1.5">品类代码 (Unique Code) <span className="text-red-500">*</span></label>
                   <input 
                     type="text" 
                     className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-mono"
                     placeholder="e.g. curtain_smart"
                     value={formData.code}
                     onChange={e => setFormData({...formData, code: e.target.value})}
                     disabled={!!initialData}
                   />
                   <p className="text-[10px] text-[#92A2C3] mt-1">创建后不可修改，用于系统唯一标识</p>
                 </div>
                 <div className="col-span-2">
                   <label className="block text-xs font-bold text-[#535E73] mb-1.5">品类描述</label>
                   <textarea 
                     className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none h-24"
                     placeholder="描述该品类的功能特性和适用范围..."
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                   />
                 </div>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
               {/* Add DP Form */}
               <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <h4 className="text-xs font-bold text-[#225AC8] uppercase tracking-wider mb-3">添加标准 DP 点</h4>
                  <div className="grid grid-cols-12 gap-3 items-end">
                     <div className="col-span-2">
                        <label className="text-[10px] text-[#92A2C3] block mb-1">标识符 (Identifier)</label>
                        <input type="text" className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-blue-500 font-mono" placeholder="switch_led" value={newDP.identifier} onChange={e => setNewDP({...newDP, identifier: e.target.value})} />
                     </div>
                     <div className="col-span-2">
                        <label className="text-[10px] text-[#92A2C3] block mb-1">功能名称</label>
                        <input type="text" className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-blue-500" placeholder="开关" value={newDP.name} onChange={e => setNewDP({...newDP, name: e.target.value})} />
                     </div>
                     <div className="col-span-2">
                        <label className="text-[10px] text-[#92A2C3] block mb-1">数据类型</label>
                        <select className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-blue-500" value={newDP.dataType} onChange={e => setNewDP({...newDP, dataType: e.target.value as DataType})}>
                           <option value="Boolean">Boolean</option>
                           <option value="Integer">Integer</option>
                           <option value="Enum">Enum</option>
                           <option value="String">String</option>
                           <option value="Json">Json</option>
                        </select>
                     </div>
                     <div className="col-span-2">
                        <label className="text-[10px] text-[#92A2C3] block mb-1">读写属性</label>
                        <select className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-blue-500" value={newDP.accessMode} onChange={e => setNewDP({...newDP, accessMode: e.target.value as AccessMode})}>
                           <option value="RW">读写 (RW)</option>
                           <option value="RO">只读 (RO)</option>
                           <option value="WO">只写 (WO)</option>
                        </select>
                     </div>
                     <div className="col-span-2">
                        <label className="text-[10px] text-[#92A2C3] block mb-1">取值范围/枚举</label>
                        <input type="text" className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-blue-500" placeholder="0-100 或 on,off" value={newDP.range || ''} onChange={e => setNewDP({...newDP, range: e.target.value})} />
                     </div>
                     <div className="col-span-2">
                        <button onClick={handleAddDP} className="w-full py-1.5 bg-blue-50 text-[#225AC8] border border-blue-100 hover:bg-[#225AC8] hover:text-white rounded text-xs font-bold transition-colors">
                           <Plus size={14} className="inline mr-1" /> 添加
                        </button>
                     </div>
                  </div>
               </div>

               {/* DP List */}
               <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                     <thead className="bg-gray-50 text-[#92A2C3] font-medium border-b border-gray-100">
                        <tr>
                           <th className="px-4 py-3">标识符 / 名称</th>
                           <th className="px-4 py-3">类型</th>
                           <th className="px-4 py-3">属性</th>
                           <th className="px-4 py-3">范围限制</th>
                           <th className="px-4 py-3">单位</th>
                           <th className="px-4 py-3 w-10"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {formData.standardDPs?.length === 0 ? (
                           <tr><td colSpan={6} className="text-center py-8 text-gray-400">暂无标准 DP 定义</td></tr>
                        ) : (
                           formData.standardDPs?.map((dp, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                 <td className="px-4 py-3">
                                    <div className="font-mono font-bold text-[#2D4965]">{dp.identifier}</div>
                                    <div className="text-[10px] text-[#92A2C3]">{dp.name}</div>
                                 </td>
                                 <td className="px-4 py-3"><DataPointBadge type={dp.dataType} /></td>
                                 <td className="px-4 py-3"><AccessModeBadge mode={dp.accessMode} /></td>
                                 <td className="px-4 py-3 font-mono text-[#535E73]">{dp.range || '-'}</td>
                                 <td className="px-4 py-3 font-mono text-[#535E73]">{dp.unit || '-'}</td>
                                 <td className="px-4 py-3 text-right">
                                    <button onClick={() => removeDP(dp.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={14}/></button>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#535E73] hover:bg-gray-100 rounded-lg transition-colors">取消</button>
           <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
              <Save size={16} /> 保存配置
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const CategoryManager: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [categories, setCategories] = useState<DeviceCategory[]>(MOCK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [searchScope, setSearchScope] = useState<'all' | 'name' | 'code'>('all');
  const [sortBy, setSortBy] = useState<'updateTime' | 'deviceCount' | 'brandCount'>('updateTime');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DeviceCategory | null>(null);

  // CRUD
  const handleSaveCategory = (data: DeviceCategory) => {
    if (editingCategory) {
       setCategories(prev => prev.map(c => c.id === data.id ? data : c));
       if (selectedCategory?.id === data.id) setSelectedCategory(data);
    } else {
       const newCat = { ...data, id: `CAT-${Date.now()}` };
       setCategories(prev => [newCat, ...prev]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
     if (window.confirm('确认删除该品类吗？这将删除关联的协议配置。')) {
        setCategories(prev => prev.filter(c => c.id !== id));
        if (selectedCategory?.id === id) setView('list');
     }
  };

  const openCreate = () => {
     setEditingCategory(null);
     setIsModalOpen(true);
  };

  const openEdit = (cat: DeviceCategory, e?: React.MouseEvent) => {
     e?.stopPropagation();
     setEditingCategory(cat);
     setIsModalOpen(true);
  };

  // Filter Logic
  const filteredCategories = categories.filter(c => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    
    if (searchScope === 'all') {
        return c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term);
    } else if (searchScope === 'name') {
        return c.name.toLowerCase().includes(term);
    } else if (searchScope === 'code') {
        return c.code.toLowerCase().includes(term);
    }
    return true;
  }).sort((a, b) => {
      if (sortBy === 'deviceCount') return b.deviceCount - a.deviceCount;
      if (sortBy === 'brandCount') return b.brandCount - a.brandCount;
      // Default: Update Time descending
      return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime();
  });

  const renderListView = () => (
    <div className="space-y-6 h-full flex flex-col">
       {/* 1. Header */}
       <div className="flex-shrink-0">
          <h1 className="text-xl font-bold text-[#2D4965] flex items-center gap-3">
              <span className="w-1.5 h-5 bg-[#27509F] rounded-full"></span>
              品类管理
          </h1>
          <p className="text-xs text-[#92A2C3] mt-1.5 ml-4">负责设备品类的分类、配置和管理</p>
       </div>

       {/* 2. KPI Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#225AC8] flex items-center justify-center shadow-sm">
                <Tags size={28}/>
             </div>
             <div>
                <p className="text-xs text-[#92A2C3] font-medium mb-1">定义品类总数</p>
                <p className="text-3xl font-bold text-[#2D4965] tracking-tight">{categories.length}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
                <Database size={28}/>
             </div>
             <div>
                <p className="text-xs text-[#92A2C3] font-medium mb-1">标准 DP 总数</p>
                <p className="text-3xl font-bold text-[#2D4965] tracking-tight">{categories.reduce((acc, c) => acc + (c.standardDPs?.length || 0), 0)}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                <Box size={28}/>
             </div>
             <div>
                <p className="text-xs text-[#92A2C3] font-medium mb-1">关联设备总量</p>
                <p className="text-3xl font-bold text-[#2D4965] tracking-tight">{categories.reduce((acc, c) => acc + c.deviceCount, 0)}</p>
             </div>
          </div>
       </div>

       {/* 3. List Content */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
          {/* Toolbar */}
          <div className="p-5 flex flex-col gap-4 bg-white rounded-t-2xl border-b border-gray-50">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all ${isFilterExpanded ? 'bg-blue-50 border-blue-200 text-[#225AC8]' : 'bg-white border-gray-200 text-[#535E73] hover:bg-gray-50'}`}
                    >
                        <Filter size={16} /> 筛选
                    </button>
                    <div className="relative group w-80">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#225AC8] transition-colors" />
                        <input 
                            type="text" 
                            placeholder={searchScope === 'all' ? "搜索品类名称/代码..." : searchScope === 'name' ? "搜索品类名称..." : "搜索品类代码..."}
                            className="w-full pl-11 pr-10 py-2.5 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-xl text-sm outline-none transition-all placeholder-gray-400 text-[#535E73]"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={14}/>
                            </button>
                        )}
                    </div>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#27509F] text-white text-sm font-bold rounded-xl hover:bg-[#1e4eaf] shadow-md shadow-blue-200 transition-all">
                    <Plus size={18} /> 添加品类
                </button>
             </div>

             {/* Expanded Filters */}
             {isFilterExpanded && (
                 <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in slide-in-from-top-2">
                     <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-[#92A2C3] uppercase flex items-center gap-1"><Search size={12}/> 搜索范围</label>
                         <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                             <button onClick={() => setSearchScope('all')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${searchScope === 'all' ? 'bg-blue-50 text-[#225AC8]' : 'text-[#535E73] hover:bg-gray-50'}`}>全部</button>
                             <button onClick={() => setSearchScope('name')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${searchScope === 'name' ? 'bg-blue-50 text-[#225AC8]' : 'text-[#535E73] hover:bg-gray-50'}`}>品类名称</button>
                             <button onClick={() => setSearchScope('code')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${searchScope === 'code' ? 'bg-blue-50 text-[#225AC8]' : 'text-[#535E73] hover:bg-gray-50'}`}>品类代码</button>
                         </div>
                     </div>
                     <div className="h-10 w-px bg-gray-200"></div>
                     <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-[#92A2C3] uppercase flex items-center gap-1"><ArrowDownUp size={12}/> 排序方式</label>
                         <div className="relative">
                             <select 
                                className="pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#535E73] outline-none appearance-none cursor-pointer w-40 hover:border-blue-200 transition-colors"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                             >
                                 <option value="updateTime">更新时间 (默认)</option>
                                 <option value="deviceCount">关联设备数量</option>
                                 <option value="brandCount">关联品牌数量</option>
                             </select>
                             <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                         </div>
                     </div>
                 </div>
             )}
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
             <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold border-b border-gray-50 sticky top-0 z-10">
                   <tr>
                      <th className="px-6 py-4">品类名称/代码</th>
                      <th className="px-4 py-4">功能描述</th>
                      <th className="px-4 py-4 text-center">标准 DP 数</th>
                      <th className="px-4 py-4">关联设备</th>
                      <th className="px-4 py-4">更新时间</th>
                      <th className="px-6 py-4 text-right">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredCategories.length > 0 ? (
                       filteredCategories.map(cat => (
                          <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => { setSelectedCategory(cat); setView('detail'); }}>
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#225AC8] flex items-center justify-center font-bold text-lg shadow-sm border border-blue-100">
                                      {cat.name.charAt(0)}
                                   </div>
                                   <div>
                                      <div className="font-bold text-[#2D4965] text-sm mb-1">{cat.name}</div>
                                      <span className="text-[10px] text-[#535E73] bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold">{cat.code}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-4 py-5 text-xs text-[#535E73] max-w-xs leading-relaxed">{cat.description}</td>
                             <td className="px-4 py-5 text-center">
                                <span className="inline-block w-8 h-8 rounded-full bg-gray-50 text-[#535E73] text-xs font-bold leading-8 border border-gray-100 shadow-sm">{cat.standardDPs?.length || 0}</span>
                             </td>
                             <td className="px-4 py-5">
                                <div className="flex flex-col gap-1 text-xs text-[#535E73]">
                                   <div className="flex items-center gap-2"><Box size={12} className="text-[#92A2C3]"/> <span>{cat.brandCount} 品牌</span></div>
                                   <div className="flex items-center gap-2"><Server size={12} className="text-[#92A2C3]"/> <span>{cat.deviceCount} 设备</span></div>
                                </div>
                             </td>
                             <td className="px-4 py-5 text-xs text-[#92A2C3] font-mono">{cat.updateTime.split(' ')[0]}</td>
                             <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                   <button onClick={(e) => openEdit(cat, e)} className="p-2 text-[#225AC8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-all" title="编辑"><Edit size={16}/></button>
                                   <button onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all" title="删除"><Trash2 size={16}/></button>
                                </div>
                             </td>
                          </tr>
                       ))
                   ) : (
                       <tr>
                           <td colSpan={6} className="px-6 py-12 text-center text-[#92A2C3] text-xs">
                               没有找到匹配的品类记录
                           </td>
                       </tr>
                   )}
                </tbody>
             </table>
          </div>

          {/* Footer Pagination */}
          <div className="p-4 border-t border-gray-100 flex justify-end items-center gap-4 flex-shrink-0 bg-white rounded-b-2xl">
             <span className="text-xs text-[#92A2C3]">共 {filteredCategories.length} 条</span>
             <div className="flex items-center gap-2">
                 <div className="relative">
                    <select className="bg-white border border-gray-200 text-xs text-[#535E73] rounded-lg pl-3 pr-8 py-1.5 outline-none cursor-pointer hover:border-blue-200 transition-colors appearance-none shadow-sm">
                        <option>5条/页</option>
                        <option>10条/页</option>
                        <option>20条/页</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                 </div>
                 <div className="flex gap-1.5">
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#92A2C3] hover:bg-gray-100 hover:text-[#535E73] transition-colors"><ChevronLeft size={14} /></button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#27509F] text-white text-xs font-bold shadow-md shadow-blue-200">1</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-[#535E73] hover:bg-gray-50 transition-colors text-xs">2</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#92A2C3] hover:bg-gray-100 hover:text-[#535E73] transition-colors"><ChevronLeft size={14} className="rotate-180" /></button>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-[#92A2C3] ml-2">
                     前往
                     <input type="text" className="w-10 h-8 bg-white border border-gray-200 rounded-lg text-center outline-none focus:border-blue-200 text-[#535E73] transition-colors" defaultValue="1" />
                     页
                 </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderDetailView = () => {
    if (!selectedCategory) return null;
    return (
       <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto custom-scrollbar pr-2 pb-6">
          
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-[#535E73] transition-all"><ChevronLeft size={20}/></button>
                <div>
                   <h2 className="text-xl font-bold text-[#2D4965] flex items-center gap-2">
                      {selectedCategory.name}
                      <span className="text-sm font-normal text-[#92A2C3] font-mono">{selectedCategory.code}</span>
                   </h2>
                   <p className="text-xs text-[#92A2C3] mt-1">品类详情与标准协议定义</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button onClick={(e) => { handleDelete(selectedCategory.id); }} className="px-4 py-2 border border-red-100 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                   <Trash2 size={14}/> 删除
                </button>
                <button onClick={(e) => openEdit(selectedCategory, e)} className="px-4 py-2 bg-[#225AC8] text-white text-xs font-bold rounded-lg hover:bg-[#1e4eaf] transition-colors flex items-center gap-2 shadow-lg shadow-blue-200/50">
                   <Edit size={14}/> 编辑配置
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Left Column (2/3 width) */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                   <h3 className="text-sm font-bold text-[#2D4965] mb-6 flex items-center gap-2">
                      <FileText size={18} className="text-[#225AC8]"/> 基本属性
                   </h3>
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-8">
                         <div>
                            <label className="text-[10px] text-[#92A2C3] block mb-1">品类名称</label>
                            <p className="text-base font-bold text-[#2D4965]">{selectedCategory.name}</p>
                         </div>
                         <div>
                            <label className="text-[10px] text-[#92A2C3] block mb-1">品类代码</label>
                            <p className="text-base font-bold text-[#535E73] font-mono">{selectedCategory.code}</p>
                         </div>
                      </div>
                      
                      <div>
                         <label className="text-[10px] text-[#92A2C3] block mb-2">功能描述</label>
                         <div className="bg-[#F8FAFC] p-4 rounded-xl text-xs text-[#535E73] leading-relaxed border border-gray-50">
                            {selectedCategory.description}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 pt-2">
                         <div>
                            <label className="text-[10px] text-[#92A2C3] block mb-1">创建时间</label>
                            <p className="text-xs font-mono text-[#535E73]">{selectedCategory.createTime}</p>
                         </div>
                         <div>
                            <label className="text-[10px] text-[#92A2C3] block mb-1">更新时间</label>
                            <p className="text-xs font-mono text-[#535E73]">{selectedCategory.updateTime}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 2. Features Description */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                   <h3 className="text-sm font-bold text-[#2D4965] mb-4 flex items-center gap-2">
                      <Layers size={18} className="text-[#225AC8]"/> 功能特性说明
                   </h3>
                   <div className="text-xs text-[#535E73] leading-loose space-y-2">
                      <p>该品类设备遵循标准物联网协议规范，支持双向通信。设备支持心跳检测 (默认间隔 300s)、离线重连机制以及异常状态自动上报。</p>
                      <ul className="list-disc pl-5 space-y-1 text-[#535E73]">
                         <li>支持标准 DP 数据点透传</li>
                         <li>具备边缘断网自治能力</li>
                         <li>支持 OTA 远程固件升级</li>
                         <li>具备过载保护与异常告警功能</li>
                      </ul>
                   </div>
                </div>

                {/* 3. Standard DP List (Moved here for better flow) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                       <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2">
                          <ListTree size={18} className="text-[#225AC8]"/> 标准 DP 定义 (Standard Data Points)
                       </h3>
                       <span className="bg-white border border-gray-200 text-[#92A2C3] px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
                          共 {selectedCategory.standardDPs?.length} 个功能点
                       </span>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm">
                          <thead className="bg-white text-[#92A2C3] text-xs font-bold sticky top-0 z-10 border-b border-gray-50">
                             <tr>
                                <th className="px-6 py-3 w-16">ID</th>
                                <th className="px-4 py-3">标识符 / 名称</th>
                                <th className="px-4 py-3">数据类型</th>
                                <th className="px-4 py-3">读写模式</th>
                                <th className="px-4 py-3">数据定义 (范围/枚举)</th>
                                <th className="px-4 py-3">功能描述</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {selectedCategory.standardDPs?.map((dp, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="px-6 py-4 text-[#92A2C3] font-mono text-xs">{idx + 1}</td>
                                   <td className="px-4 py-4">
                                      <div className="font-bold text-[#2D4965] text-sm mb-0.5">{dp.identifier}</div>
                                      <div className="text-xs text-[#92A2C3]">{dp.name}</div>
                                   </td>
                                   <td className="px-4 py-4"><DataPointBadge type={dp.dataType} /></td>
                                   <td className="px-4 py-4"><AccessModeBadge mode={dp.accessMode} /></td>
                                   <td className="px-4 py-4">
                                      <div className="text-xs text-[#535E73] font-mono italic">
                                         {dp.dataType === 'Boolean' ? 'True / False' : (dp.range || '-')}
                                         {dp.step && <span className="text-[#92A2C3] ml-2">| Step: {dp.step}</span>}
                                      </div>
                                   </td>
                                   <td className="px-4 py-4 text-xs text-[#535E73]">{dp.description}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                </div>
             </div>

             {/* Right Column (1/3 width) */}
             <div className="space-y-6">
                
                {/* 1. Stats Cards */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                   <h3 className="text-sm font-bold text-[#2D4965] mb-4 flex items-center gap-2"><Box size={18} className="text-[#225AC8]"/> 关联统计</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-center">
                         <div className="text-3xl font-bold text-[#225AC8] mb-1">{selectedCategory.brandCount}</div>
                         <div className="text-xs text-[#92A2C3] font-bold">关联品牌</div>
                      </div>
                      <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 text-center">
                         <div className="text-3xl font-bold text-purple-600 mb-1">{selectedCategory.deviceCount}</div>
                         <div className="text-xs text-[#92A2C3] font-bold">关联设备</div>
                      </div>
                   </div>
                </div>

                {/* 2. Associated Brands List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2"><Tags size={18} className="text-[#225AC8]"/> 关联品牌</h3>
                      <button className="text-xs text-[#225AC8] hover:underline font-bold">查看全部</button>
                   </div>
                   
                   <div className="space-y-4">
                      {MOCK_ASSOCIATED_BRANDS.map((brand, i) => (
                         <div key={i} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-[#535E73] border border-gray-100 shadow-sm group-hover:border-blue-200 transition-colors">
                                  {brand.logo}
                               </div>
                               <div>
                                  <div className="text-xs font-bold text-[#2D4965] group-hover:text-[#225AC8] transition-colors">{brand.name}</div>
                                  <div className="text-[10px] text-[#92A2C3]">接入设备: {brand.devices}</div>
                               </div>
                            </div>
                            <span className="text-[10px] text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded font-bold">
                               {brand.status}
                            </span>
                         </div>
                      ))}
                   </div>
                </div>

             </div>
          </div>
       </div>
    );
  };

  return (
    <>
       <CategoryModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         onSubmit={handleSaveCategory}
         initialData={editingCategory}
       />
       {view === 'list' ? renderListView() : renderDetailView()}
    </>
  );
};

export default CategoryManager;
