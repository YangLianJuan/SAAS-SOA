
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Play, Pause, Trash2, Edit, ChevronLeft, 
  Clock, Thermometer, Zap, Cloud, Server, CheckCircle2, AlertTriangle, 
  ArrowUpRight, BarChart3, TrendingUp, Settings, Layers, Calendar, 
  MoreHorizontal, RefreshCw, Smartphone, Monitor, Target, Activity,
  ToggleLeft, ToggleRight, FileText, History as HistoryIcon, Gauge,
  Check, X as XIcon, AlertCircle, Power, StopCircle, PlayCircle, Eye,
  Settings2, Save, PenLine, Cpu, ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Strategy, StrategyType, ExecutionLocation } from '../types';

// --- Mock Data ---

const MOCK_STRATEGIES: Strategy[] = [
  { 
    id: 'ST-001', 
    name: '夏季空调峰值优化', 
    description: '当室外温度>30°C时，自动调整空调目标温度至26°C，避免尖峰负荷。',
    type: 'environment', 
    status: 'active', 
    executionLocation: 'cloud',
    targetCount: 156,
    storeCount: 12,
    savingsKwh: 4520,
    savingsMoney: 5424,
    savingRate: 18.5,
    lastRunTime: '10分钟前',
    nextRunTime: '持续监控中',
    algorithm: 'Threshold-v2',
    createTime: '2023-06-15'
  },
  { 
    id: 'ST-002', 
    name: '夜间照明定时关闭', 
    description: '每日22:30后自动关闭所有门店招牌灯及主照明，仅保留安防照明。',
    type: 'time', 
    status: 'active', 
    executionLocation: 'edge',
    targetCount: 340,
    storeCount: 45,
    savingsKwh: 8900,
    savingsMoney: 10680,
    savingRate: 35.2,
    lastRunTime: '昨晚 22:30',
    nextRunTime: '今晚 22:30',
    algorithm: 'Schedule-Basic',
    createTime: '2023-01-10'
  },
  { 
    id: 'ST-003', 
    name: '设备空闲自动待机', 
    description: '检测到设备电流<1A持续30分钟，自动切断电源防止待机能耗。',
    type: 'device', 
    status: 'inactive', 
    executionLocation: 'edge',
    targetCount: 85,
    storeCount: 8,
    savingsKwh: 120,
    savingsMoney: 144,
    savingRate: 5.4,
    lastRunTime: '3天前',
    nextRunTime: '手动触发',
    algorithm: 'Idle-Check',
    createTime: '2023-09-01'
  },
  { 
    id: 'ST-004', 
    name: '冬季热水器恒温策略', 
    description: '根据营业时间自动调节热水器保温温度，非营业时间降至40°C。',
    type: 'time', 
    status: 'active', 
    executionLocation: 'cloud',
    targetCount: 42,
    storeCount: 42,
    savingsKwh: 2100,
    savingsMoney: 2520,
    savingRate: 12.8,
    lastRunTime: '今早 06:00',
    nextRunTime: '今晚 23:00',
    algorithm: 'Schedule-PID',
    createTime: '2023-11-05'
  },
];

const EVALUATION_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  baseline: Math.floor(100 + Math.random() * 50 + (i > 8 && i < 20 ? 100 : 0)),
  actual: 0
})).map(d => ({
  ...d,
  actual: Math.floor(d.baseline * (0.8 + Math.random() * 0.1)) // ~10-20% savings
}));

const MOCK_HISTORY_LOGS = [
  { id: 1, time: '2023-10-27 14:00:00', status: 'success', event: '策略自动触发', details: '调整目标设备: 45台, 成功: 45' },
  { id: 2, time: '2023-10-27 13:00:00', status: 'success', event: '状态检查', details: '设备在线率 100%, 无需操作' },
  { id: 3, time: '2023-10-27 12:00:00', status: 'warning', event: '执行部分失败', details: '调整目标设备: 45台, 成功: 43, 失败: 2 (离线)' },
  { id: 4, time: '2023-10-27 11:00:00', status: 'success', event: '策略自动触发', details: '调整目标设备: 45台, 成功: 45' },
];

const MOCK_RECENT_ALARMS = [
    { id: 1, time: '12:00:05', message: '新风机组 #3 执行超时' },
    { id: 2, time: '11:45:22', message: '策略下发延迟 > 500ms' },
];

// --- Helper Components ---

const StrategyTypeBadge = ({ type }: { type: StrategyType }) => {
  const config = {
    time: { icon: Clock, label: '时间规则', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    environment: { icon: Thermometer, label: '环境规则', color: 'bg-green-50 text-green-600 border-green-100' },
    device: { icon: Zap, label: '设备规则', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  };
  const { icon: Icon, label, color } = config[type];
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold border ${color} w-fit`}>
      <Icon size={12} /> {label}
    </span>
  );
};

const ExecutionBadge = ({ location }: { location: ExecutionLocation }) => {
  const isCloud = location === 'cloud';
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold border w-fit ${isCloud ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {isCloud ? <Cloud size={12} /> : <Server size={12} />}
      {isCloud ? '云端托管' : '边缘执行'}
    </span>
  );
};

// --- Modals ---

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Strategy>) => void;
  initialData?: Strategy | null;
}

const StrategyModal: React.FC<StrategyModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Strategy>>({
    name: '', type: 'time', executionLocation: 'cloud', description: '', status: 'active'
  });
  const [step, setStep] = useState(1);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({ name: '', type: 'time', executionLocation: 'cloud', description: '', status: 'active' });
      }
      setStep(1);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const TEMPLATES = [
    { id: 't1', name: '空调定时启停', type: 'time', desc: '根据营业时间自动控制', icon: Clock },
    { id: 't2', name: '环境恒温控制', type: 'environment', desc: '基于温度传感器反馈', icon: Thermometer },
    { id: 't3', name: '照明智能联动', type: 'device', desc: '人来灯亮，人走灯灭', icon: Zap },
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
       {!initialData && (
         <div>
            <label className="block text-xs font-bold text-[#535E73] mb-2">快速开始：选择模板</label>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map(t => (
                <div key={t.id} className="border border-gray-200 p-3 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group" onClick={() => setFormData({...formData, type: t.type as any, name: t.name})}>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-white text-gray-500 group-hover:text-blue-600 flex items-center justify-center mb-2 transition-colors">
                      <t.icon size={16} />
                    </div>
                    <p className="text-xs font-bold text-[#2D4965]">{t.name}</p>
                    <p className="text-[10px] text-[#92A2C3] mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
         </div>
       )}
       {!initialData && <div className="h-px bg-gray-100"></div>}
       <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
             <label className="block text-xs font-medium text-[#535E73] mb-1.5">策略名称</label>
             <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder="请输入策略名称" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
             <label className="block text-xs font-medium text-[#535E73] mb-1.5">策略类型</label>
             <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                <option value="time">时间规则</option>
                <option value="environment">环境规则</option>
                <option value="device">设备规则</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-medium text-[#535E73] mb-1.5">执行位置</label>
             <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" value={formData.executionLocation} onChange={e => setFormData({...formData, executionLocation: e.target.value as any})}>
                <option value="cloud">云端执行 (SaaS)</option>
                <option value="edge">边缘执行 (AI Box)</option>
             </select>
          </div>
          <div className="col-span-2">
             <label className="block text-xs font-medium text-[#535E73] mb-1.5">策略描述</label>
             <textarea className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none h-20 resize-none" placeholder="描述策略的执行逻辑..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
       </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
       <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h4 className="text-sm font-bold text-[#225AC8] mb-3 flex items-center gap-2"><Settings size={14}/> 规则配置</h4>
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#535E73] w-20">触发条件:</span>
                <div className="flex-1 flex gap-2">
                   <select className="bg-white border border-gray-200 text-xs rounded px-2 py-1.5"><option>时间</option><option>温度</option></select>
                   <select className="bg-white border border-gray-200 text-xs rounded px-2 py-1.5"><option>大于</option><option>等于</option></select>
                   <input type="text" className="bg-white border border-gray-200 text-xs rounded px-2 py-1.5 w-20" placeholder="值" defaultValue="30" />
                </div>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#535E73] w-20">执行动作:</span>
                <div className="flex-1 flex gap-2">
                   <select className="bg-white border border-gray-200 text-xs rounded px-2 py-1.5"><option>设置温度</option><option>关闭设备</option></select>
                   <input type="text" className="bg-white border border-gray-200 text-xs rounded px-2 py-1.5 w-20" placeholder="参数" defaultValue="26" />
                </div>
             </div>
          </div>
       </div>

       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h4 className="text-sm font-bold text-[#535E73] mb-3 flex items-center gap-2"><Target size={14}/> 目标对象</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
             {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded hover:border-blue-200 cursor-pointer">
                   <input type="checkbox" className="rounded text-blue-600" defaultChecked={i < 3} />
                   <div className="flex-1">
                      <p className="text-xs font-bold text-[#2D4965]">上海静安旗舰店 - 空调组 {i}</p>
                   </div>
                   <span className="text-[10px] text-gray-400">Dev-00{i}</span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <h3 className="text-lg font-bold text-[#2D4965]">{initialData ? '编辑策略' : '创建新策略'}</h3>
           <div className="flex gap-1">
              <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-[#225AC8]' : 'bg-gray-300'}`}></span>
              <span className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-[#225AC8]' : 'bg-gray-300'}`}></span>
           </div>
        </div>
        <div className="p-6">
           {step === 1 ? renderStep1() : renderStep2()}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between">
           {step === 2 ? (
             <button onClick={() => setStep(1)} className="px-4 py-2 text-xs font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">上一步</button>
           ) : (
             <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">取消</button>
           )}
           
           {step === 1 ? (
             <button onClick={() => setStep(2)} className="px-4 py-2 text-xs font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg">下一步</button>
           ) : (
             <button onClick={() => { onSubmit(formData); }} className="px-4 py-2 text-xs font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg">确认保存</button>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const StrategyManager: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [activeDetailTab, setActiveDetailTab] = useState<'monitor' | 'config'>('monitor');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>(MOCK_STRATEGIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);

  // Filter Logic
  const filteredStrategies = strategies.filter(s => 
    (filterType === 'all' || s.type === filterType) &&
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStrategyClick = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setActiveDetailTab('monitor');
    setView('detail');
  };

  const handleToggleStatus = (id: string) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
    if (selectedStrategy && selectedStrategy.id === id) {
      setSelectedStrategy(prev => prev ? { ...prev, status: prev.status === 'active' ? 'inactive' : 'active' } : null);
    }
  };

  const handleSaveStrategy = (data: Partial<Strategy>) => {
    if (editingStrategy) {
      // Update existing
      setStrategies(prev => prev.map(s => s.id === editingStrategy.id ? { ...s, ...data } as Strategy : s));
      // If currently viewing details of this strategy, update it there too
      if (selectedStrategy?.id === editingStrategy.id) {
          setSelectedStrategy({ ...selectedStrategy, ...data } as Strategy);
      }
    } else {
      // Create new
      const strategy: Strategy = {
        ...data,
        id: `ST-${Math.floor(Math.random()*1000)}`,
        targetCount: 0,
        storeCount: 0,
        savingsKwh: 0,
        savingsMoney: 0,
        savingRate: 0,
        lastRunTime: '从未',
        nextRunTime: '-',
        algorithm: 'Custom',
        createTime: new Date().toLocaleDateString(),
      } as Strategy;
      setStrategies([strategy, ...strategies]);
    }
    setIsModalOpen(false);
    setEditingStrategy(null);
  };

  const handleDeleteStrategy = (id: string) => {
      if(window.confirm('确定要删除该策略吗？删除后将不可恢复。')) {
          setStrategies(prev => prev.filter(s => s.id !== id));
          if (selectedStrategy?.id === id) setView('list');
      }
  };

  const openCreateModal = () => {
      setEditingStrategy(null);
      setIsModalOpen(true);
  };

  const openEditModal = (strategy: Strategy, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setEditingStrategy(strategy);
      setIsModalOpen(true);
  };

  // --- Render List View ---
  const renderListView = () => (
    <div className="space-y-6 h-full flex flex-col">
       {/* 1. Page Header */}
       <div className="flex-shrink-0">
          <h1 className="text-xl font-bold text-[#2D4965] flex items-center gap-3">
              <span className="w-1.5 h-5 bg-[#27509F] rounded-full"></span>
              策略管理
          </h1>
          <p className="text-xs text-[#92A2C3] mt-1.5 ml-4">管理门店和区域的空间信息</p>
       </div>

       {/* 2. KPI Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
          {/* Card 1: Total Savings (Blue) */}
          <div className="bg-[#27509F] p-6 rounded-2xl text-white shadow-lg shadow-blue-200/50 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
             <div className="absolute right-0 top-0 p-6 opacity-20"><TrendingUp size={80} /></div>
             <div>
                 <p className="text-xs font-medium text-blue-100 mb-2">本月累计节能 (Estimated)</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">15,420</span>
                    <span className="text-sm opacity-80 font-medium">kWh</span>
                 </div>
             </div>
             <div className="mt-4">
                 <span className="text-xs bg-white/20 px-2 py-1 rounded text-white font-medium inline-flex items-center gap-1">
                    <ArrowUpRight size={12} /> 节省 ¥18,504
                 </span>
             </div>
          </div>

          {/* Card 2: Active Strategies */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[140px] relative">
             <div className="flex justify-between items-start">
                <p className="text-xs text-[#535E73] font-bold">活跃策略</p>
                <div className="bg-green-50 text-green-500 p-2 rounded-lg"><Activity size={20}/></div>
             </div>
             <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#2D4965]">{strategies.filter(s => s.status === 'active').length}</span>
                    <span className="text-sm text-[#92A2C3] font-medium">/ {strategies.length} Total</span>
                </div>
             </div>
          </div>

          {/* Card 3: Edge Execution */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[140px] relative">
             <div className="flex justify-between items-start">
                <p className="text-xs text-[#535E73] font-bold">边缘执行率</p>
                <div className="bg-purple-50 text-purple-500 p-2 rounded-lg"><Server size={20}/></div>
             </div>
             <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#2D4965]">45%</span>
                    <span className="text-sm text-[#92A2C3] font-medium">离线自治支持</span>
                </div>
             </div>
          </div>
       </div>

       {/* 3. List Content */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
          {/* Toolbar */}
          <div className="p-5 flex justify-between items-center bg-white rounded-t-2xl">
             <div className="flex gap-3">
                <div className="relative">
                   <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                    type="text" 
                    placeholder="搜索策略..." 
                    className="pl-10 pr-4 py-2.5 bg-[#F8FAFC] border-none rounded-xl text-sm outline-none w-64 text-[#535E73] placeholder-gray-400"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="relative">
                    <select 
                      className="appearance-none pl-4 pr-10 py-2.5 bg-[#F8FAFC] border-none rounded-xl text-sm text-[#535E73] font-bold outline-none cursor-pointer"
                      value={filterType}
                      onChange={e => setFilterType(e.target.value)}
                    >
                       <option value="all">全部类型</option>
                       <option value="time">时间规则</option>
                       <option value="environment">环境规则</option>
                       <option value="device">设备规则</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                </div>
             </div>
             <button onClick={openCreateModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#27509F] text-white text-sm font-bold rounded-xl hover:bg-[#1e4eaf] shadow-md shadow-blue-200 transition-all">
                <Plus size={18} /> 创建策略
             </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar p-0">
             <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold border-b border-gray-50 sticky top-0 z-10">
                   <tr>
                      <th className="px-6 py-4">策略名称</th>
                      <th className="px-6 py-4">类型</th>
                      <th className="px-6 py-4">执行位置</th>
                      <th className="px-6 py-4">目标范围</th>
                      <th className="px-6 py-4">预估节能</th>
                      <th className="px-6 py-4">状态</th>
                      <th className="px-6 py-4 text-right">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredStrategies.map(strategy => (
                      <tr key={strategy.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => handleStrategyClick(strategy)}>
                         <td className="px-6 py-5 align-top">
                            <div className="font-bold text-[#2D4965] text-sm mb-1">{strategy.name}</div>
                            <div className="text-xs text-[#92A2C3] leading-relaxed max-w-xs line-clamp-2">{strategy.description}</div>
                         </td>
                         <td className="px-6 py-5 align-top pt-6">
                             <StrategyTypeBadge type={strategy.type} />
                         </td>
                         <td className="px-6 py-5 align-top pt-6">
                             <ExecutionBadge location={strategy.executionLocation} />
                         </td>
                         <td className="px-6 py-5 align-top">
                            <div className="flex flex-col gap-1.5 text-xs text-[#535E73]">
                                <div className="flex items-center gap-2">
                                    <Layers size={14} className="text-[#92A2C3]"/> 
                                    <span>{strategy.storeCount} 门店</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Server size={14} className="text-[#92A2C3]"/> 
                                    <span>{strategy.targetCount} 设备</span>
                                </div>
                            </div>
                         </td>
                         <td className="px-6 py-5 align-top">
                            <div className="font-bold text-[#27509F]">{strategy.savingsKwh.toLocaleString()} kWh</div>
                            <div className="text-xs text-green-600 font-medium mt-0.5">rate: {strategy.savingRate}%</div>
                         </td>
                         <td className="px-6 py-5 align-top pt-6">
                            <span className={`text-xs font-bold ${strategy.status === 'active' ? 'text-[#535E73]' : 'text-gray-400'}`}>
                                {strategy.status === 'active' ? '已启用' : '已禁用'}
                            </span>
                         </td>
                         <td className="px-6 py-5 align-top text-right pt-5">
                            <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(strategy.id); }}
                                    className={`p-2 rounded-lg transition-all ${strategy.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                    title={strategy.status === 'active' ? '禁用' : '启用'}
                                >
                                    <Power size={16} />
                                </button>
                                <button 
                                    onClick={(e) => openEditModal(strategy, e)}
                                    className="p-2 text-[#225AC8] hover:bg-blue-50 rounded-lg transition-all"
                                    title="编辑"
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteStrategy(strategy.id); }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="删除"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Footer Pagination */}
          <div className="p-4 border-t border-gray-100 flex justify-end items-center gap-4 flex-shrink-0 bg-white rounded-b-2xl">
             <span className="text-xs text-[#92A2C3]">显示 1 到 {Math.min(5, filteredStrategies.length)} 条，共 {filteredStrategies.length} 条</span>
             <div className="flex items-center gap-2">
                 <select className="bg-[#F8FAFC] border border-transparent hover:border-gray-200 text-xs text-[#535E73] rounded-lg px-2 py-1 outline-none cursor-pointer">
                     <option>5条/页</option>
                     <option>10条/页</option>
                     <option>20条/页</option>
                 </select>
                 <div className="flex gap-1">
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#92A2C3] hover:bg-gray-100 hover:text-[#535E73] transition-colors text-xs"><ChevronLeft size={14} /></button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#27509F] text-white text-xs font-bold shadow-sm">1</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#535E73] hover:bg-gray-100 transition-colors text-xs">2</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#92A2C3] hover:bg-gray-100 hover:text-[#535E73] transition-colors text-xs"><ChevronLeft size={14} className="rotate-180" /></button>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-[#92A2C3]">
                     前往
                     <input type="text" className="w-10 h-8 bg-[#F8FAFC] rounded-lg border border-transparent focus:bg-white focus:border-blue-100 text-center outline-none text-[#535E73]" defaultValue="1" />
                     页
                 </div>
             </div>
          </div>
       </div>
    </div>
  );

  // --- Render Detail View ---
  const renderDetailView = () => {
    if (!selectedStrategy) return null;

    return (
       <div className="h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto custom-scrollbar pr-2 pb-6">
          
          {/* 1. Header Bar */}
          <div className="flex items-center justify-between flex-shrink-0 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
               <button onClick={() => setView('list')} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-[#535E73] transition-all"><ChevronLeft size={20}/></button>
               <div>
                  <div className="flex items-center gap-3">
                     <h2 className="text-xl font-bold text-[#2D4965]">{selectedStrategy.name}</h2>
                     <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${selectedStrategy.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {selectedStrategy.status === 'active' ? '执行中' : '已停止'}
                     </span>
                  </div>
                  <p className="text-xs text-[#92A2C3] mt-1 max-w-xl truncate">{selectedStrategy.description}</p>
               </div>
            </div>
            <button 
               onClick={() => handleToggleStatus(selectedStrategy.id)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                  selectedStrategy.status === 'active' 
                  ? 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100' 
                  : 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
               }`}
            >
               {selectedStrategy.status === 'active' ? <StopCircle size={16} /> : <PlayCircle size={16} />}
               {selectedStrategy.status === 'active' ? '停止策略' : '启动策略'}
            </button>
          </div>

          {/* 2. Tabs */}
          <div className="flex gap-6 border-b border-gray-100 px-2">
             <button 
               onClick={() => setActiveDetailTab('monitor')}
               className={`py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeDetailTab === 'monitor' ? 'border-[#225AC8] text-[#225AC8]' : 'border-transparent text-[#92A2C3] hover:text-[#535E73]'}`}
             >
                <Monitor size={16}/> 运行监控
             </button>
             <button 
               onClick={() => setActiveDetailTab('config')}
               className={`py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeDetailTab === 'config' ? 'border-[#225AC8] text-[#225AC8]' : 'border-transparent text-[#92A2C3] hover:text-[#535E73]'}`}
             >
                <Settings size={16}/> 策略配置
             </button>
          </div>

          {/* 3. Content Area */}
          {activeDetailTab === 'monitor' ? (
             <div className="grid grid-cols-12 gap-6">
                {/* Left Column: Strategy Config Summary (1/3) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2"><Settings2 size={16}/> 策略配置参数</h3>
                         <button onClick={() => setActiveDetailTab('config')} className="text-xs font-bold text-[#225AC8] hover:underline">修改</button>
                      </div>
                      
                      <div className="space-y-5">
                         {/* Name */}
                         <div>
                            <p className="text-[10px] text-[#92A2C3] mb-1">策略名称</p>
                            <div className="bg-gray-50 px-3 py-2 rounded-lg font-bold text-[#2D4965] text-sm border border-gray-100">
                               {selectedStrategy.name}
                            </div>
                         </div>

                         {/* Type & Algo */}
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[10px] text-[#92A2C3] mb-1">策略类型</p>
                               <div className="bg-gray-50 px-3 py-2 rounded-lg font-bold text-[#535E73] text-xs border border-gray-100">
                                  {selectedStrategy.type === 'time' ? '时间规则' : '环境规则'}
                               </div>
                            </div>
                            <div>
                               <p className="text-[10px] text-[#92A2C3] mb-1">核心算法</p>
                               <div className="bg-gray-50 px-3 py-2 rounded-lg font-bold text-[#535E73] text-xs border border-gray-100">
                                  {selectedStrategy.algorithm}
                               </div>
                            </div>
                         </div>

                         {/* Algorithm Params */}
                         <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100/50">
                            <p className="text-xs font-bold text-[#225AC8] mb-3">算法参数设定</p>
                            <div className="space-y-2.5">
                               <div className="flex justify-between text-xs border-b border-blue-100/50 pb-2">
                                  <span className="text-[#535E73]">触发阈值 (Temp)</span>
                                  <span className="font-mono font-bold text-[#2D4965]">{'>'} 30°C</span>
                               </div>
                               <div className="flex justify-between text-xs border-b border-blue-100/50 pb-2">
                                  <span className="text-[#535E73]">目标设定 (SetPoint)</span>
                                  <span className="font-mono font-bold text-[#2D4965]">26°C</span>
                               </div>
                               <div className="flex justify-between text-xs">
                                  <span className="text-[#535E73]">执行死区 (Deadband)</span>
                                  <span className="font-mono font-bold text-[#2D4965]">± 1.5°C</span>
                               </div>
                            </div>
                         </div>

                         {/* Scope */}
                         <div>
                            <p className="text-[10px] text-[#92A2C3] mb-1">目标范围</p>
                            <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-3 text-xs text-[#535E73] leading-relaxed">
                               已选择 <span className="font-bold">{selectedStrategy.storeCount}</span> 家门店，共计 <span className="font-bold">{selectedStrategy.targetCount}</span> 台设备。
                               <br/>
                               <span className="text-[10px] text-[#92A2C3] block mt-1">包含: 上海静安旗舰店, 北京朝阳店...</span>
                            </div>
                         </div>

                         {/* Deployment Footer */}
                         <div className="flex justify-between items-end pt-2">
                            <div>
                               <p className="text-[10px] text-[#92A2C3] mb-1">执行位置</p>
                               <div className="flex items-center gap-1.5 text-xs font-bold text-[#535E73]">
                                  {selectedStrategy.executionLocation === 'cloud' ? <Cloud size={14} className="text-purple-500"/> : <Server size={14} className="text-purple-500"/>}
                                  {selectedStrategy.executionLocation === 'cloud' ? '云端 SaaS' : '边缘 Edge'}
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] text-[#92A2C3] mb-1">当前开关</p>
                               <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div> 已启用
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Real-time Monitor Mini */}
                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <Activity size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-[#2D4965]">实时运行监控</p>
                            <p className="text-[10px] text-green-600 font-bold mt-0.5">运行正常</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-bold text-[#2D4965]">15ms</p>
                         <p className="text-[10px] text-[#92A2C3]">平均响应</p>
                      </div>
                      <div className="text-right pl-4 border-l border-gray-100">
                         <p className="text-lg font-bold text-[#2D4965]">100%</p>
                         <p className="text-[10px] text-[#92A2C3]">成功率</p>
                      </div>
                   </div>
                   
                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-xs space-y-2">
                      <div className="flex justify-between">
                         <span className="text-[#92A2C3]">当前心跳</span>
                         <span className="font-mono text-green-600 font-bold">Active (2s ago)</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[#92A2C3]">下次执行</span>
                         <span className="font-mono text-[#225AC8] font-bold">持续监控中</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-1">
                         <div className="bg-green-500 h-full w-[85%]"></div>
                      </div>
                      <p className="text-[9px] text-right text-[#92A2C3]">Target Health: 85%</p>
                   </div>
                </div>

                {/* Right Column: Analysis & History (2/3) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                   {/* Top Card: Effect Evaluation */}
                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2"><BarChart3 size={16}/> 策略效果评估</h3>
                         <div className="flex bg-gray-50 p-1 rounded-lg">
                            <button className="px-3 py-1 text-[10px] font-bold bg-white text-[#225AC8] shadow-sm rounded-md">节能趋势</button>
                            <button className="px-3 py-1 text-[10px] font-bold text-[#92A2C3] hover:text-[#535E73]">同比分析</button>
                         </div>
                      </div>

                      {/* KPIs */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                         <div className="border border-green-100 bg-green-50/30 p-4 rounded-xl">
                            <p className="text-[10px] text-[#535E73] font-bold mb-1">综合节能率</p>
                            <p className="text-2xl font-bold text-green-600">{selectedStrategy.savingRate}%</p>
                            <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1"><TrendingUp size={10}/> 优于 85% 同类策略</p>
                         </div>
                         <div className="border border-blue-100 bg-blue-50/30 p-4 rounded-xl">
                            <p className="text-[10px] text-[#535E73] font-bold mb-1">本月节省电量</p>
                            <p className="text-2xl font-bold text-[#225AC8]">{selectedStrategy.savingsKwh.toLocaleString()} <span className="text-sm">kWh</span></p>
                         </div>
                         <div className="border border-orange-100 bg-orange-50/30 p-4 rounded-xl">
                            <p className="text-[10px] text-[#535E73] font-bold mb-1">预估节省费用</p>
                            <p className="text-2xl font-bold text-[#F59E0B]">¥{selectedStrategy.savingsMoney.toLocaleString()}</p>
                         </div>
                      </div>

                      {/* Chart */}
                      <div className="h-[280px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={EVALUATION_DATA} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                               <defs>
                                  <linearGradient id="chartBlue" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#225AC8" stopOpacity={0.2}/>
                                     <stop offset="95%" stopColor="#225AC8" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                               <XAxis dataKey="time" tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} interval={3} />
                               <YAxis tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                               <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                               <Legend verticalAlign="top" height={36} iconType="circle" />
                               <Area type="monotone" dataKey="baseline" name="策略执行前 (Baseline)" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                               <Area type="monotone" dataKey="actual" name="策略执行后 (Actual)" stroke="#225AC8" strokeWidth={3} fill="url(#chartBlue)" activeDot={{r: 5}} />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   {/* Bottom Card: History Table */}
                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2"><HistoryIcon size={16}/> 执行历史记录</h3>
                         <button className="text-xs text-[#225AC8] font-bold hover:underline">查看全部</button>
                      </div>
                      <div className="overflow-hidden">
                         <table className="w-full text-left text-xs">
                            <thead className="bg-[#F8FAFC] text-[#92A2C3] font-bold border-b border-gray-100">
                               <tr>
                                  <th className="px-4 py-3">时间</th>
                                  <th className="px-4 py-3">事件类型</th>
                                  <th className="px-4 py-3">执行详情</th>
                                  <th className="px-4 py-3">状态</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                               {MOCK_HISTORY_LOGS.map(log => (
                                  <tr key={log.id} className="hover:bg-gray-50/50">
                                     <td className="px-4 py-4 font-mono text-[#535E73]">{log.time}</td>
                                     <td className="px-4 py-4 font-bold text-[#2D4965]">{log.event}</td>
                                     <td className="px-4 py-4 text-[#535E73]">{log.details}</td>
                                     <td className="px-4 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${log.status === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                           {log.status === 'success' ? 'Success' : 'Warning'}
                                        </span>
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>
             </div>
          ) : (
             // Config Tab Content
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Configs */}
                <div className="lg:col-span-2 space-y-6">
                   {/* Basic Config */}
                   <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-bold text-[#2D4965] mb-6 flex items-center gap-2">
                         <Settings2 size={18} className="text-[#225AC8]" /> 策略基础配置
                      </h3>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-[#535E73] mb-2">策略名称</label>
                            <input type="text" defaultValue={selectedStrategy.name} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold text-[#535E73] mb-2">策略类型</label>
                               <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-[#535E73]" defaultValue={selectedStrategy.type}>
                                  <option value="time">时间规则</option>
                                  <option value="environment">环境规则</option>
                                  <option value="device">设备规则</option>
                               </select>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-[#535E73] mb-2">核心算法</label>
                               <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-[#535E73]" defaultValue={selectedStrategy.algorithm}>
                                  <option value="Threshold-v2">Threshold-v2 (阈值控制)</option>
                                  <option value="PID-Controller">PID-Controller</option>
                                  <option value="Schedule-Basic">Schedule-Basic</option>
                               </select>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Algorithm Params */}
                   <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-bold text-[#2D4965] mb-6 flex items-center gap-2">
                         <Activity size={18} className="text-[#225AC8]" /> 算法参数配置
                      </h3>
                      
                      <div className="space-y-6">
                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                               <label className="text-xs font-bold text-[#535E73]">执行时间段</label>
                               <div className="flex items-center gap-1.5 text-xs text-[#92A2C3]">
                                  <Clock size={14} />
                                  <span>工作日循环</span>
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="block text-[10px] text-[#92A2C3] mb-1">开始时间</label>
                                  <input type="time" defaultValue="12:00" className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-sm outline-none" />
                               </div>
                               <div>
                                  <label className="block text-[10px] text-[#92A2C3] mb-1">结束时间</label>
                                  <input type="time" defaultValue="14:00" className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-sm outline-none" />
                               </div>
                            </div>
                         </div>

                         <div>
                            <label className="text-xs font-bold text-[#535E73] block mb-3">控制参数</label>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="block text-[10px] text-[#92A2C3] mb-1">目标温度下限</label>
                                  <div className="relative">
                                     <input type="number" defaultValue="26" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                                     <span className="absolute right-3 top-2 text-xs text-gray-400">°C</span>
                                  </div>
                               </div>
                               <div>
                                  <label className="block text-[10px] text-[#92A2C3] mb-1">风速模式</label>
                                  <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-[#535E73]">
                                     <option>自动</option>
                                     <option>低速</option>
                                     <option>高速</option>
                                  </select>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right Column: Deployment & Targets */}
                <div className="space-y-6">
                   {/* Targets */}
                   <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-bold text-[#535E73] mb-4">执行目标</h3>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-xs text-[#92A2C3] mb-2">目标对象</label>
                            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-[#535E73]">
                               <option>空调设备组 - 总部大楼</option>
                               <option>所有门店 - 照明系统</option>
                            </select>
                         </div>
                         <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-xs text-[#535E73] leading-relaxed">
                            当前选中 <span className="font-bold text-[#225AC8]">{selectedStrategy.targetCount}</span> 台设备，分布在 <span className="font-bold text-[#225AC8]">{selectedStrategy.storeCount}</span> 个区域
                         </div>
                      </div>
                   </div>

                   {/* Deployment */}
                   <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-bold text-[#535E73] mb-4">部署设置</h3>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-xs text-[#92A2C3] mb-2">执行位置</label>
                            <div className="grid grid-cols-2 gap-2">
                               <button className={`py-2 rounded-lg text-xs font-bold border transition-all ${selectedStrategy.executionLocation === 'cloud' ? 'bg-blue-50 border-blue-200 text-[#225AC8]' : 'bg-white border-gray-200 text-gray-500'}`}>
                                  云端执行
                               </button>
                               <button className={`py-2 rounded-lg text-xs font-bold border transition-all ${selectedStrategy.executionLocation === 'edge' ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white border-gray-200 text-gray-500'}`}>
                                  边缘执行
                               </button>
                            </div>
                         </div>
                         <div className="flex items-center justify-between pt-2">
                            <div>
                               <p className="text-xs font-bold text-[#535E73]">启用策略</p>
                               <p className="text-[10px] text-[#92A2C3]">立即生效配置</p>
                            </div>
                            <div className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${selectedStrategy.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>
                               <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${selectedStrategy.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <button className="w-full py-3 bg-[#27509F] text-white rounded-xl text-sm font-bold hover:bg-[#1e4eaf] shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2">
                      <Save size={16} /> 保存配置更改
                   </button>
                </div>
             </div>
          )}
       </div>
    );
  };

  return (
    <>
      <StrategyModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         onSubmit={handleSaveStrategy}
         initialData={editingStrategy}
      />
      {view === 'list' ? renderListView() : renderDetailView()}
    </>
  );
};

export default StrategyManager;
