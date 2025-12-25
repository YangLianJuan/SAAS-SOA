
import React, { useState } from 'react';
import { 
  Map, Building2, Layers, Search, Plus, Filter, ChevronLeft, Edit, Trash2,
  Store, Server, Phone, MapPin, X, Save, 
  ChevronDown, ArrowUpRight, Activity, Clock, Zap, LayoutGrid, ChevronRight, Cpu, Settings
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { Store as StoreType, Area as AreaType, StoreType as StoreTypeEnum, Device } from '../types';

// --- Mock Data ---

const MOCK_STORES: StoreType[] = [
  {
    id: 's1',
    name: '上海静安旗舰店',
    type: 'CHAIN_STORE',
    address: '上海市浦东新区张江高科路88号',
    contactPerson: '李主管',
    contactPhone: '13900139000',
    status: 'ACTIVE',
    deviceCount: 156,
    areaCount: 4,
    totalEnergy: 12500,
    averagePower: 45.2,
    createTime: '2023-01-10',
    updateTime: '2023-11-20',
    description: '位于核心商圈的旗舰展示店，配备全套智能照明与空调系统。'
  },
  {
    id: 's2',
    name: '北京朝阳合生汇店',
    type: 'CHAIN_STORE',
    address: '上海市黄浦区南京东路100号',
    contactPerson: '张经理',
    contactPhone: '13800138000',
    status: 'ACTIVE',
    deviceCount: 45,
    areaCount: 2,
    totalEnergy: 3200,
    averagePower: 32.8,
    createTime: '2023-03-10',
    updateTime: '2023-10-15'
  },
  {
    id: 's3',
    name: '深圳南山科技园店',
    type: 'FACTORY',
    address: '苏州市工业园区星湖街1号',
    contactPerson: '王店长',
    contactPhone: '13700137000',
    status: 'MAINTENANCE',
    deviceCount: 320,
    areaCount: 8,
    totalEnergy: 45000,
    averagePower: 125.5,
    createTime: '2023-05-22',
    updateTime: '2023-11-25'
  },
   {
    id: 's4',
    name: '杭州西湖银泰店',
    type: 'CHAIN_STORE',
    address: '杭州市上城区延安路98号',
    contactPerson: '刘经理',
    contactPhone: '13600136000',
    status: 'ACTIVE',
    deviceCount: 88,
    areaCount: 3,
    totalEnergy: 6800,
    averagePower: 38.5,
    createTime: '2023-06-15',
    updateTime: '2023-12-01'
  },
  {
    id: 's5',
    name: '成都太古里店',
    type: 'SMALL_BUSINESS',
    address: '成都市锦江区中纱帽街8号',
    contactPerson: '赵店长',
    contactPhone: '13500135000',
    status: 'INACTIVE',
    deviceCount: 12,
    areaCount: 1,
    totalEnergy: 850,
    averagePower: 5.2,
    createTime: '2023-08-01',
    updateTime: '2023-08-01'
  },
];

const MOCK_AREAS: AreaType[] = [
  { id: 'A01', name: '1F 大厅', type: 'FLOOR', storeId: 's1', storeName: '总部大楼 - 东区', status: 'ACTIVE', deviceCount: 24, totalEnergy: 1200, averagePower: 45.2, createTime: '2023-01-12', updateTime: '2024-05-01' },
  { id: 'A02', name: '2F 办公区', type: 'FLOOR', storeId: 's1', storeName: '总部大楼 - 东区', status: 'ACTIVE', deviceCount: 65, totalEnergy: 4500, averagePower: 8.2, createTime: '2023-01-15', updateTime: '2023-01-15' },
  { id: 'A03', name: 'B1 停车场', type: 'ZONE', storeId: 's1', storeName: '总部大楼 - 东区', status: 'INACTIVE', deviceCount: 12, totalEnergy: 800, averagePower: 18.6, createTime: '2023-01-15', updateTime: '2023-01-15' },
  { id: 'A04', name: '营业区', type: 'ZONE', storeId: 's2', storeName: '旗舰店 - 南京路', status: 'ACTIVE', deviceCount: 30, totalEnergy: 2100, averagePower: 15.4, createTime: '2023-03-10', updateTime: '2023-03-10' },
];

const MOCK_DEVICES_PREVIEW: Partial<Device>[] = [
    { id: 'DEV-001', name: '中央空调主机 A1', type: 'HVAC', status: 'online', powerUsage: 12.5 },
    { id: 'DEV-002', name: '大厅照明回路', type: 'Lighting', status: 'online', powerUsage: 2.1 },
    { id: 'DEV-003', name: '冷柜组 #1', type: 'HVAC', status: 'fault', powerUsage: 0 },
    { id: 'DEV-004', name: '电能表-总进线', type: 'Meter', status: 'online', powerUsage: 45.2 },
    { id: 'DEV-005', name: '后勤区热水器', type: 'WaterHeater', status: 'offline', powerUsage: 0 },
];

const ENERGY_TREND_DATA = Array.from({ length: 12 }, (_, i) => ({
  time: `${String(i * 2).padStart(2, '0')}:00`,
  value: Math.floor(Math.random() * 400) + 100,
}));

// --- Helper Components ---

const StoreTypeBadge = ({ type }: { type: StoreTypeEnum }) => {
    const config = {
        CHAIN_STORE: { label: '连锁门店', color: 'text-[#225AC8] border-blue-200 bg-blue-50' },
        BUILDING: { label: '楼宇', color: 'text-[#225AC8] border-blue-200 bg-blue-50' },
        FACTORY: { label: '工厂', color: 'text-[#535E73] border-gray-200 bg-gray-50' },
        SMALL_BUSINESS: { label: '商户', color: 'text-[#225AC8] border-blue-200 bg-blue-50' },
    };
    const { label, color } = config[type] || config.CHAIN_STORE;
    return (
        <span className={`inline-block px-3 py-1 rounded text-xs font-bold border ${color}`}>
            {label}
        </span>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const isMain = status === 'ACTIVE' || status === '正常使用';
    const isMaint = status === 'MAINTENANCE';
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isMain ? 'bg-green-50 text-green-600 border-green-100' : 
            isMaint ? 'bg-orange-50 text-orange-600 border-orange-100' :
            'bg-gray-100 text-gray-500 border-gray-200'
        }`}>
            {status === 'ACTIVE' ? '正常运营' : status === 'MAINTENANCE' ? '维护中' : '已停业'}
        </span>
    );
};

const DeviceStatusBadge = ({ status }: { status: string }) => {
    const config: any = {
        online: { color: 'text-green-600 bg-green-50', label: 'online' },
        offline: { color: 'text-gray-500 bg-gray-100', label: 'offline' },
        fault: { color: 'text-red-500 bg-red-50', label: 'fault' }
    };
    const style = config[status] || config.offline;
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${style.color}`}>
            {style.label}
        </span>
    );
};

// --- Modals ---

interface StoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StoreType) => void;
    initialData?: StoreType | null;
}

const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Partial<StoreType>>({
        name: '', type: 'CHAIN_STORE', address: '', contactPerson: '', contactPhone: '', status: 'ACTIVE'
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData(initialData ? {...initialData} : { name: '', type: 'CHAIN_STORE', address: '', contactPerson: '', contactPhone: '', status: 'ACTIVE' });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <h3 className="font-bold text-[#2D4965]">{initialData ? '编辑门店信息' : '创建新门店'}</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">门店名称</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如: 上海静安旗舰店" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#535E73] mb-1.5">门店类型</label>
                            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                                <option value="CHAIN_STORE">连锁门店</option>
                                <option value="BUILDING">楼宇</option>
                                <option value="FACTORY">工厂配电</option>
                                <option value="SMALL_BUSINESS">小微商户</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-[#535E73] mb-1.5">运营状态</label>
                             <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                                <option value="ACTIVE">正常运营</option>
                                <option value="MAINTENANCE">维护中</option>
                                <option value="INACTIVE">停用</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">详细地址</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="输入门店详细地址" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#535E73] mb-1.5">联系人</label>
                            <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#535E73] mb-1.5">联系电话</label>
                            <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">描述 (可选)</label>
                        <textarea className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none h-20" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">取消</button>
                    <button onClick={() => onSubmit(formData as StoreType)} className="px-4 py-2 text-sm font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg flex items-center gap-2"><Save size={14}/> 保存</button>
                </div>
            </div>
        </div>
    );
};

interface AreaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AreaType) => void;
    initialData?: AreaType | null;
    storeId?: string; // Pre-select if creating from store detail
    stores: StoreType[];
}

const AreaModal: React.FC<AreaModalProps> = ({ isOpen, onClose, onSubmit, initialData, storeId, stores }) => {
    const [formData, setFormData] = useState<Partial<AreaType>>({
        name: '', type: 'FLOOR', status: 'ACTIVE', storeId: storeId || ''
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData(initialData ? {...initialData} : { name: '', type: 'FLOOR', status: 'ACTIVE', storeId: storeId || (stores.length > 0 ? stores[0].id : '') });
        }
    }, [isOpen, initialData, storeId, stores]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <h3 className="font-bold text-[#2D4965]">{initialData ? '编辑区域信息' : '创建新区域'}</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">所属门店</label>
                        <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.storeId} onChange={e => setFormData({...formData, storeId: e.target.value})} disabled={!!storeId && !initialData}>
                             <option value="">请选择门店...</option>
                             {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">区域名称</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如: F1-大厅" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#535E73] mb-1.5">区域类型</label>
                            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                                <option value="FLOOR">楼层</option>
                                <option value="ZONE">功能分区</option>
                                <option value="ROOM">房间</option>
                                <option value="OTHER">其他</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-[#535E73] mb-1.5">使用状态</label>
                             <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                                <option value="ACTIVE">正常使用</option>
                                <option value="INACTIVE">停用</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">描述 (可选)</label>
                        <textarea className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none h-20" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">取消</button>
                    <button onClick={() => onSubmit(formData as AreaType)} className="px-4 py-2 text-sm font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg flex items-center gap-2"><Save size={14}/> 保存</button>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

const SpaceManager: React.FC = () => {
    const [view, setView] = useState<'stores' | 'areas' | 'store-detail' | 'area-detail'>('stores');
    const [backView, setBackView] = useState<'stores' | 'areas' | 'store-detail'>('areas');
    const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
    const [selectedArea, setSelectedArea] = useState<AreaType | null>(null);
    
    const [stores, setStores] = useState<StoreType[]>(MOCK_STORES);
    const [areas, setAreas] = useState<AreaType[]>(MOCK_AREAS);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Advanced Filters State
    const [storeTypeFilter, setStoreTypeFilter] = useState<string>('ALL');
    const [storeStatusFilter, setStoreStatusFilter] = useState<string>('ALL');
    const [areaTypeFilter, setAreaTypeFilter] = useState<string>('ALL');
    const [areaStatusFilter, setAreaStatusFilter] = useState<string>('ALL');
    
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    // Modals
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<StoreType | null>(null);
    const [editingArea, setEditingArea] = useState<AreaType | null>(null);

    // Handlers
    const handleSaveStore = (data: StoreType) => {
        if (editingStore) {
            setStores(prev => prev.map(s => s.id === data.id ? data : s));
            if (selectedStore?.id === data.id) setSelectedStore(data);
        } else {
            const newStore = { ...data, id: `ST-${Date.now()}`, deviceCount: 0, areaCount: 0, totalEnergy: 0, averagePower: 0, createTime: new Date().toLocaleDateString(), updateTime: new Date().toLocaleDateString() };
            setStores(prev => [newStore, ...prev]);
        }
        setIsStoreModalOpen(false);
        setEditingStore(null);
    };

    const handleSaveArea = (data: AreaType) => {
        const store = stores.find(s => s.id === data.storeId);
        const dataWithStoreName = { ...data, storeName: store?.name };
        
        if (editingArea) {
            setAreas(prev => prev.map(a => a.id === data.id ? dataWithStoreName : a));
            if (selectedArea?.id === data.id) setSelectedArea(dataWithStoreName);
        } else {
            const newArea = { ...dataWithStoreName, id: `AR-${Date.now()}`, deviceCount: 0, totalEnergy: 0, averagePower: 0, createTime: new Date().toLocaleDateString(), updateTime: new Date().toLocaleDateString() };
            setAreas(prev => [newArea, ...prev]);
            // Update store area count
            setStores(prev => prev.map(s => s.id === data.storeId ? { ...s, areaCount: s.areaCount + 1 } : s));
        }
        setIsAreaModalOpen(false);
        setEditingArea(null);
    };

    const handleOpenStoreDetail = (store: StoreType) => {
        setSelectedStore(store);
        setView('store-detail');
    };

    const handleOpenAreaDetail = (area: AreaType) => {
        setBackView(view === 'store-detail' ? 'store-detail' : 'areas');
        setSelectedArea(area);
        setView('area-detail');
    };

    // Filter Logic
    const filteredStores = stores.filter(s => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = s.name.toLowerCase().includes(term) || 
                              s.address.toLowerCase().includes(term) ||
                              s.id.toLowerCase().includes(term);
        const matchesType = storeTypeFilter === 'ALL' || s.type === storeTypeFilter;
        const matchesStatus = storeStatusFilter === 'ALL' || s.status === storeStatusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const filteredAreas = areas.filter(a => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = a.name.toLowerCase().includes(term) || 
                              (a.storeName?.toLowerCase().includes(term) ?? false);
        const matchesType = areaTypeFilter === 'ALL' || a.type === areaTypeFilter;
        const matchesStatus = areaStatusFilter === 'ALL' || a.status === areaStatusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    // --- Views ---

    const renderStoreList = () => (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-[#2D4965] flex items-center gap-3">
                    <span className="w-1.5 h-5 bg-[#27509F] rounded-full"></span>
                    空间管理
                </h1>
                <p className="text-xs text-[#92A2C3] mt-1.5 ml-4">管理门店和区域的空间信息</p>
            </div>

            {/* List Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
                
                {/* Toolbar */}
                <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                        <button 
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-all ${isFilterExpanded ? 'bg-blue-50 border-blue-200 text-[#225AC8]' : 'bg-white border-gray-200 text-[#535E73] hover:bg-gray-50'}`}
                        >
                            <Filter size={16} /> 筛选
                        </button>
                        <div className="relative group w-80">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#225AC8] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="搜索门店名称/ID/地址..." 
                                className="w-full pl-9 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={() => setView('areas')} className="px-4 py-2 bg-white border border-gray-200 text-[#535E73] text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
                            <Layers size={16}/> 切换至区域视图
                        </button>
                        <button onClick={() => { setEditingStore(null); setIsStoreModalOpen(true); }} className="px-5 py-2 bg-[#27509F] text-white text-sm font-medium rounded-lg hover:bg-[#1e4eaf] flex items-center gap-2 shadow-sm transition-all">
                            <Plus size={18}/> 添加门店
                        </button>
                    </div>
                </div>

                {/* Expanded Filters */}
                {isFilterExpanded && (
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex gap-4 animate-in slide-in-from-top-2">
                        <div>
                            <select 
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none text-[#535E73] focus:border-blue-500"
                                value={storeTypeFilter}
                                onChange={(e) => setStoreTypeFilter(e.target.value)}
                            >
                                <option value="ALL">全部类型</option>
                                <option value="CHAIN_STORE">连锁门店</option>
                                <option value="BUILDING">楼宇</option>
                                <option value="FACTORY">工厂配电</option>
                                <option value="SMALL_BUSINESS">小微商户</option>
                            </select>
                        </div>
                        <div>
                            <select 
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none text-[#535E73] focus:border-blue-500"
                                value={storeStatusFilter}
                                onChange={(e) => setStoreStatusFilter(e.target.value)}
                            >
                                <option value="ALL">全部状态</option>
                                <option value="ACTIVE">正常运营</option>
                                <option value="MAINTENANCE">维护中</option>
                                <option value="INACTIVE">停用</option>
                            </select>
                        </div>
                        {(storeTypeFilter !== 'ALL' || storeStatusFilter !== 'ALL') && (
                            <button 
                                onClick={() => { setStoreTypeFilter('ALL'); setStoreStatusFilter('ALL'); }}
                                className="text-xs text-[#225AC8] hover:underline"
                            >
                                清除筛选
                            </button>
                        )}
                    </div>
                )}

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold sticky top-0 z-10 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold">门店名称</th>
                                <th className="px-6 py-4 font-bold">类型</th>
                                <th className="px-6 py-4 font-bold">地址 / 联系人</th>
                                <th className="px-6 py-4 font-bold">状态</th>
                                <th className="px-6 py-4 font-bold text-center">空间统计</th>
                                <th className="px-6 py-4 font-bold">能耗概览</th>
                                <th className="px-6 py-4 font-bold text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStores.length > 0 ? (
                                filteredStores.map(store => (
                                <tr key={store.id} className="hover:bg-blue-50/20 transition-colors group cursor-pointer" onClick={() => handleOpenStoreDetail(store)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#225AC8] flex items-center justify-center border border-blue-100 shadow-sm">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#2D4965] text-sm mb-1">{store.name}</div>
                                                <div className="text-[10px] text-[#92A2C3] font-mono">ID: {store.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><StoreTypeBadge type={store.type} /></td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs text-[#535E73]">
                                                <MapPin size={12} className="text-[#92A2C3] flex-shrink-0" />
                                                <span className="truncate max-w-[200px]">{store.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-[#535E73]">
                                                <Phone size={12} className="text-[#92A2C3] flex-shrink-0" />
                                                <span>{store.contactPerson} • {store.contactPhone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={store.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-4 text-xs text-[#535E73]">
                                            <div className="flex items-center gap-1.5" title="区域数量">
                                                <Layers size={14} className="text-[#92A2C3]"/> 
                                                <span className="font-mono">{store.areaCount}</span> <span className="text-[#92A2C3] text-[10px]">区域</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="设备数量">
                                                <Server size={14} className="text-[#92A2C3]"/> 
                                                <span className="font-mono">{store.deviceCount}</span> <span className="text-[#92A2C3] text-[10px]">设备</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#2D4965] text-sm font-mono">{store.totalEnergy.toLocaleString()} <span className="text-[10px] text-[#92A2C3] font-normal">kWh</span></div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setEditingStore(store); setIsStoreModalOpen(true); }} 
                                            className="inline-flex items-center gap-1 text-[#535E73] hover:text-[#225AC8] text-xs font-bold transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
                                        >
                                            <Edit size={14}/> 编辑
                                        </button>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-[#92A2C3] text-xs">
                                        没有找到匹配的门店记录
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex justify-end items-center gap-6 flex-shrink-0 bg-white rounded-b-xl border-t border-gray-100">
                    <span className="text-xs text-[#92A2C3]">共 {filteredStores.length} 条</span>
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

    const renderAreaList = () => (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-[#2D4965] flex items-center gap-3">
                    <span className="w-1.5 h-5 bg-[#27509F] rounded-full"></span>
                    空间管理
                </h1>
                <p className="text-xs text-[#92A2C3] mt-1.5 ml-4">管理门店和区域的空间信息</p>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
                {/* Toolbar */}
                <div className="p-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-50">
                    <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                         <button 
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-all ${isFilterExpanded ? 'bg-blue-50 border-blue-200 text-[#225AC8]' : 'bg-white border-gray-200 text-[#535E73] hover:bg-gray-50'}`}
                        >
                            <Filter size={16} /> 筛选
                        </button>
                        <div className="relative group w-80">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="搜索区域名称/所属门店..." 
                                className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all text-[#535E73]"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={() => setView('stores')} className="px-4 py-2 bg-white border border-gray-200 text-[#535E73] text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all">
                            <Store size={16}/> 切换至门店列表
                        </button>
                        <button onClick={() => { setEditingArea(null); setIsAreaModalOpen(true); }} className="px-4 py-2 bg-[#27509F] text-white text-sm font-medium rounded-lg hover:bg-[#1e4eaf] flex items-center gap-2 shadow-sm transition-all">
                            <Plus size={16}/> 创建区域
                        </button>
                    </div>
                </div>

                {/* Expanded Filters for Area */}
                {isFilterExpanded && (
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex gap-4 animate-in slide-in-from-top-2">
                        <div>
                            <select 
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none text-[#535E73] focus:border-blue-500"
                                value={areaTypeFilter}
                                onChange={(e) => setAreaTypeFilter(e.target.value)}
                            >
                                <option value="ALL">全部类型</option>
                                <option value="FLOOR">楼层</option>
                                <option value="ZONE">功能分区</option>
                                <option value="ROOM">房间</option>
                                <option value="OTHER">其他</option>
                            </select>
                        </div>
                        <div>
                            <select 
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none text-[#535E73] focus:border-blue-500"
                                value={areaStatusFilter}
                                onChange={(e) => setAreaStatusFilter(e.target.value)}
                            >
                                <option value="ALL">全部状态</option>
                                <option value="ACTIVE">正常使用</option>
                                <option value="INACTIVE">停用</option>
                            </select>
                        </div>
                        {(areaTypeFilter !== 'ALL' || areaStatusFilter !== 'ALL') && (
                            <button 
                                onClick={() => { setAreaTypeFilter('ALL'); setAreaStatusFilter('ALL'); }}
                                className="text-xs text-[#225AC8] hover:underline"
                            >
                                清除筛选
                            </button>
                        )}
                    </div>
                )}

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FAFC] text-[#535E73] text-xs font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">区域名称</th>
                                <th className="px-6 py-4 font-medium">所属门店</th>
                                <th className="px-6 py-4 font-medium">类型</th>
                                <th className="px-6 py-4 font-medium">状态</th>
                                <th className="px-6 py-4 font-medium">关联设备</th>
                                <th className="px-6 py-4 font-medium">能耗</th>
                                <th className="px-6 py-4 font-medium text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAreas.length > 0 ? (
                                filteredAreas.map(area => (
                                <tr key={area.id} onClick={() => handleOpenAreaDetail(area)} className="hover:bg-blue-50/20 cursor-pointer transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center">
                                                <MapPin size={18} />
                                            </div>
                                            <span className="font-bold text-[#2D4965] text-sm">{area.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[#535E73] text-sm">
                                            <Store size={16} className="text-[#92A2C3]" />
                                            {area.storeName || '总部大楼 - 东区'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-[#E0F2FE] text-[#0284C7] px-2.5 py-1 rounded text-xs font-medium">
                                            {area.type === 'FLOOR' ? '楼层' : area.type === 'ZONE' ? '区域' : area.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-xs font-medium border ${area.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {area.status === 'ACTIVE' ? '正常运营' : '已停用'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[#535E73] font-medium">{area.deviceCount} <span className="text-xs text-[#92A2C3] font-normal">台</span></span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-[#2D4965] font-mono">{area.totalEnergy} <span className="text-xs text-[#92A2C3] font-normal">kWh</span></span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingArea(area); setIsAreaModalOpen(true); }} 
                                                className="flex items-center gap-1 text-[#535E73] hover:text-[#225AC8] text-xs transition-colors"
                                            >
                                                <Edit size={14}/> 编辑
                                            </button>
                                            <button 
                                                 onClick={(e) => { e.stopPropagation(); /* delete logic */ }}
                                                 className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs transition-colors"
                                            >
                                                <Trash2 size={14}/> 删除
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-[#92A2C3] text-xs">
                                        没有找到匹配的区域记录
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex justify-end items-center gap-6 flex-shrink-0 bg-white rounded-b-xl border-t border-gray-100">
                    <span className="text-xs text-[#92A2C3]">共 {filteredAreas.length} 条</span>
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

    const renderStoreDetail = () => {
        if (!selectedStore) return null;
        return (
            <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between flex-shrink-0 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('stores')} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-[#535E73] transition-all">
                            <ChevronLeft size={20}/>
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-[#2D4965]">{selectedStore.name}</h2>
                                <StatusBadge status={selectedStore.status} />
                            </div>
                            <p className="text-xs text-[#92A2C3] font-mono mt-1">ID: {selectedStore.id}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { setEditingStore(null); setIsAreaModalOpen(true); }} className="px-4 py-2 bg-white border border-gray-200 text-[#535E73] text-sm font-bold rounded-lg hover:bg-gray-50 flex items-center gap-2">
                            <Plus size={16}/> 创建区域
                        </button>
                        <button onClick={() => { setEditingStore(selectedStore); setIsStoreModalOpen(true); }} className="px-4 py-2 bg-[#27509F] text-white text-sm font-bold rounded-lg hover:bg-[#1e4eaf] flex items-center gap-2 shadow-lg shadow-blue-200/50">
                            <Edit size={16}/> 编辑门店
                        </button>
                    </div>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#225AC8] flex items-center justify-center">
                            <Store size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-[#92A2C3] font-medium mb-1">门店类型</p>
                            <StoreTypeBadge type={selectedStore.type} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Layers size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-[#92A2C3] font-medium mb-1">区域总数</p>
                            <p className="text-2xl font-bold text-[#2D4965]">{selectedStore.areaCount} <span className="text-xs font-normal text-[#92A2C3]">个</span></p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-[#92A2C3] font-medium mb-1">设备总数</p>
                            <p className="text-2xl font-bold text-[#2D4965]">{selectedStore.deviceCount} <span className="text-xs font-normal text-[#92A2C3]">台</span></p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-[#92A2C3] font-medium mb-1">累计能耗</p>
                            <p className="text-2xl font-bold text-[#2D4965]">{selectedStore.totalEnergy.toLocaleString()} <span className="text-xs font-normal text-[#92A2C3]">kWh</span></p>
                        </div>
                    </div>
                </div>

                {/* Middle Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
                    {/* Left: Info & Chart */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Info Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2 mb-6">
                                <Settings size={16} className="text-[#225AC8]"/> 基础运营信息
                            </h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <p className="text-xs text-[#92A2C3] mb-1">门店地址</p>
                                    <p className="text-sm text-[#535E73] flex items-center gap-2"><MapPin size={14}/> {selectedStore.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#92A2C3] mb-1">联系人</p>
                                    <p className="text-sm text-[#535E73] flex items-center gap-2"><Phone size={14}/> {selectedStore.contactPerson} ({selectedStore.contactPhone})</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#92A2C3] mb-1">当前运营状态</p>
                                    <StatusBadge status={selectedStore.status} />
                                </div>
                                <div>
                                    <p className="text-xs text-[#92A2C3] mb-1">创建时间</p>
                                    <p className="text-sm text-[#535E73]">{selectedStore.createTime}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs text-[#92A2C3] mb-2">描述备注</p>
                                <div className="bg-[#F8FAFC] p-3 rounded-xl text-xs text-[#535E73] leading-relaxed border border-gray-50">
                                    {selectedStore.description || '无描述'}
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                            <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2 mb-4">
                                <Activity size={16} className="text-[#225AC8]"/> 能耗趋势监控
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={ENERGY_TREND_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                                        <YAxis tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                        <Line type="monotone" dataKey="value" stroke="#225AC8" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right: Area List & Device List */}
                    <div className="flex flex-col gap-6">
                        {/* Area List */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white">
                                <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2"><LayoutGrid size={16}/> 区域列表</h3>
                                <button onClick={() => { setEditingStore(null); setIsAreaModalOpen(true); }} className="text-xs text-[#225AC8] bg-blue-50 px-2 py-1 rounded font-bold hover:bg-blue-100 transition-colors">+ 新增区域</button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#F8FAFC] text-[#92A2C3] font-bold">
                                        <tr>
                                            <th className="px-4 py-3">区域名称</th>
                                            <th className="px-4 py-3">类型</th>
                                            <th className="px-4 py-3 text-right">设备数</th>
                                            <th className="px-4 py-3 w-8"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {areas.filter(a => a.storeId === selectedStore.id).map(area => (
                                            <tr key={area.id} onClick={() => handleOpenAreaDetail(area)} className="hover:bg-gray-50 cursor-pointer group">
                                                <td className="px-4 py-3 font-bold text-[#2D4965]">{area.name}</td>
                                                <td className="px-4 py-3"><span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-[#535E73]">{area.type}</span></td>
                                                <td className="px-4 py-3 text-right font-mono text-[#535E73]">{area.deviceCount}</td>
                                                <td className="px-4 py-3 text-right"><ChevronRight size={14} className="text-gray-300 group-hover:text-[#225AC8]"/></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Device List Preview */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white">
                                <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2"><Server size={16}/> 门店下关联设备 ({selectedStore.deviceCount})</h3>
                                <button className="text-xs text-[#535E73] flex items-center gap-1 hover:text-[#225AC8] font-bold"><Filter size={10}/> 筛选</button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#F8FAFC] text-[#92A2C3] font-bold">
                                        <tr>
                                            <th className="px-4 py-3">设备名称</th>
                                            <th className="px-4 py-3">类型</th>
                                            <th className="px-4 py-3">状态</th>
                                            <th className="px-4 py-3 text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {MOCK_DEVICES_PREVIEW.map((dev, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-bold text-[#2D4965]">{dev.name}</td>
                                                <td className="px-4 py-3"><span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-[#535E73]">{dev.type}</span></td>
                                                <td className="px-4 py-3"><DeviceStatusBadge status={dev.status || 'offline'} /></td>
                                                <td className="px-4 py-3 text-right text-[#225AC8] font-bold cursor-pointer hover:underline">详情</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAreaDetail = () => {
        if (!selectedArea) return null;
        return (
            <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between flex-shrink-0 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView(backView)} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-[#535E73] transition-all">
                            <ChevronLeft size={20}/>
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-[#2D4965]">{selectedArea.name}</h2>
                                <span className="text-xs text-[#92A2C3] uppercase font-bold">{selectedArea.type}</span>
                            </div>
                            <p className="text-xs text-[#92A2C3] mt-1">所属: {selectedArea.storeName || 'Unknown Store'}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { if(confirm('确认删除该区域？')) setView(backView); }} className="px-4 py-2 bg-red-50 border border-red-100 text-red-500 text-sm font-bold rounded-lg hover:bg-red-100 flex items-center gap-2 transition-all">
                            <Trash2 size={16}/> 删除
                        </button>
                        <button onClick={() => { setEditingArea(selectedArea); setIsAreaModalOpen(true); }} className="px-4 py-2 bg-[#225AC8] text-white text-sm font-bold rounded-lg hover:bg-[#1e4eaf] flex items-center gap-2 shadow-lg shadow-blue-200/50 transition-all">
                            <Edit size={16}/> 编辑信息
                        </button>
                    </div>
                </div>

                {/* 3-Column Top Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
                    {/* Left: Info Card */}
                    <div className="col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2 mb-4">
                            <MapPin size={16} className="text-[#225AC8]"/> 区域信息
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <p className="text-xs text-[#92A2C3] mb-1">区域名称</p>
                                <p className="text-lg font-bold text-[#2D4965]">{selectedArea.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#92A2C3] mb-1">所属门店</p>
                                <p className="text-sm font-bold text-[#225AC8] flex items-center gap-1 cursor-pointer hover:underline">
                                    <Store size={14}/> {selectedArea.storeName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-[#92A2C3] mb-1">区域类型</p>
                                <span className="bg-blue-50 text-[#225AC8] px-2 py-1 rounded text-xs font-bold">{selectedArea.type}</span>
                            </div>
                            <div>
                                <p className="text-xs text-[#92A2C3] mb-1">状态</p>
                                <span className={`bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold border border-green-100`}>
                                    {selectedArea.status === 'ACTIVE' ? '正常运营' : '已停用'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-50">
                            <p className="text-xs text-[#92A2C3] mb-2">区域描述</p>
                            <div className="bg-[#F8FAFC] p-3 rounded-lg text-xs text-[#535E73]">
                                {selectedArea.description || '无描述'}
                            </div>
                            <div className="flex gap-8 mt-4 text-[10px] text-[#92A2C3]">
                                <span>创建时间: {selectedArea.createTime}</span>
                                <span>最后更新: {selectedArea.updateTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: KPIs (Stacked) */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between flex-1">
                            <div>
                                <p className="text-xs text-[#92A2C3] font-bold mb-1">设备总数</p>
                                <p className="text-3xl font-bold text-[#2D4965]">{selectedArea.deviceCount}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl text-[#535E73]"><Cpu size={24}/></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between flex-1">
                            <div>
                                <p className="text-xs text-[#92A2C3] font-bold mb-1">区域能耗</p>
                                <p className="text-3xl font-bold text-green-600">{selectedArea.totalEnergy} <span className="text-sm text-[#92A2C3] font-normal">kWh</span></p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl text-green-600"><Zap size={24}/></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between flex-1">
                            <div>
                                <p className="text-xs text-[#92A2C3] font-bold mb-1">平均功率</p>
                                <p className="text-3xl font-bold text-[#225AC8]">{selectedArea.averagePower} <span className="text-sm text-[#92A2C3] font-normal">kW</span></p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl text-[#225AC8]"><Activity size={24}/></div>
                        </div>
                    </div>
                </div>

                {/* Energy Trend Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
                    <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2 mb-4">
                        <Activity size={16} className="text-[#225AC8]"/> 区域能耗趋势
                    </h3>
                    <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ENERGY_TREND_DATA}>
                                <defs>
                                    <linearGradient id="colorAreaEnergy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fill="url(#colorAreaEnergy)" activeDot={{r: 6}} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device List Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2"><Cpu size={16}/> 区域内设备</h3>
                        <button className="px-3 py-1.5 bg-[#2D4965] text-white text-xs font-bold rounded-lg hover:bg-[#1e4eaf] transition-colors">关联设备</button>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8FAFC] text-[#92A2C3] font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4">设备名称</th>
                                    <th className="px-6 py-4">类型</th>
                                    <th className="px-6 py-4">状态</th>
                                    <th className="px-6 py-4 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {MOCK_DEVICES_PREVIEW.map((device, i) => (
                                    <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="px-6 py-4 font-bold text-[#2D4965]">{device.name}</td>
                                        <td className="px-6 py-4 flex items-center gap-2 text-xs text-[#535E73]">
                                            {device.type === 'HVAC' ? <Activity size={14}/> : device.type === 'Lighting' ? <Zap size={14}/> : <Server size={14}/>}
                                            {device.type === 'HVAC' ? '空调' : device.type === 'Lighting' ? '照明' : '其他'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${device.status === 'online' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                                {device.status === 'online' ? '在线' : '故障'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[#2D4965] font-bold text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded flex items-center gap-1 ml-auto">
                                                <Settings size={12}/> 解绑
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <StoreModal 
                isOpen={isStoreModalOpen} 
                onClose={() => setIsStoreModalOpen(false)} 
                onSubmit={handleSaveStore}
                initialData={editingStore}
            />
            <AreaModal 
                isOpen={isAreaModalOpen} 
                onClose={() => setIsAreaModalOpen(false)} 
                onSubmit={handleSaveArea}
                initialData={editingArea}
                stores={stores}
                storeId={selectedStore?.id}
            />

            {view === 'stores' && renderStoreList()}
            {view === 'areas' && renderAreaList()}
            {view === 'store-detail' && renderStoreDetail()}
            {view === 'area-detail' && renderAreaDetail()}
        </>
    );
};

export default SpaceManager;
