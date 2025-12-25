
import React, { useState } from 'react';
import { 
  Award, Search, Plus, Filter, ChevronLeft, Edit, Trash2, Box, 
  Settings, Layers, Save, X, Cpu, Cable, ArrowRight, MoreHorizontal,
  FileCode, CheckCircle2, AlertTriangle, List, Plug, Server, LayoutGrid, Database, Tag,
  ChevronDown
} from 'lucide-react';
import { 
  Brand, ProductModel, ProtocolMapping, ModbusRegisterType, ModbusDataType, StandardDP 
} from '../types';

// --- Mock Data ---

const MOCK_MAPPINGS: ProtocolMapping[] = [
  { dpIdentifier: 'temp_set', registerAddress: 40001, registerType: 'HoldingRegister', dataType: 'int16', scaleFactor: 0.1, unitConversion: '°C' },
  { dpIdentifier: 'mode', registerAddress: 40002, registerType: 'HoldingRegister', dataType: 'int16', enumMapping: '{"0":"cool","1":"heat"}' },
  { dpIdentifier: 'power', registerAddress: 40005, registerType: 'HoldingRegister', dataType: 'bool' },
];

const MOCK_MODELS: ProductModel[] = [
  {
    id: 'MOD-001',
    name: 'Daikin VRV-X Series',
    code: 'daikin_vrv_x',
    categoryId: 'CAT-002',
    categoryName: '暖通空调 (HVAC)',
    description: 'VRV X系列商用多联机，支持Modbus RTU接入。',
    deviceCount: 45,
    dps: [
        { id: 'dp1', identifier: 'temp_set', name: '目标温度', dataType: 'Integer', accessMode: 'RW' },
        { id: 'dp2', identifier: 'mode', name: '模式', dataType: 'Enum', accessMode: 'RW' },
        { id: 'dp3', identifier: 'power', name: '开关', dataType: 'Boolean', accessMode: 'RW' }
    ],
    mappings: MOCK_MAPPINGS
  },
  {
    id: 'MOD-002',
    name: 'Daikin SkyAir',
    code: 'daikin_skyair',
    categoryId: 'CAT-002',
    categoryName: '暖通空调 (HVAC)',
    description: '适用于中小店铺的SkyAir系列。',
    deviceCount: 12,
    dps: [],
    mappings: []
  }
];

const MOCK_BRANDS: Brand[] = [
  {
    id: 'BRD-001',
    name: 'Daikin 大金',
    code: 'daikin',
    description: '全球领先的空调制造商，提供先进的VRV空调系统。',
    models: MOCK_MODELS,
    deviceCount: 57,
    pluginPath: 'daikin_adapter_v2.so',
    createTime: '2023-01-10',
    updateTime: '2023-11-05'
  },
  {
    id: 'BRD-002',
    name: 'Philips 飞利浦',
    code: 'philips',
    description: '照明领域的领导品牌，提供智能互联照明解决方案。',
    models: [
        {
            id: 'MOD-003',
            name: 'Hue Bridge v2',
            code: 'hue_bridge_v2',
            categoryId: 'CAT-001',
            categoryName: '照明系统',
            description: 'Hue智能网关，支持Zigbee转Modbus协议接入。',
            deviceCount: 120,
            dps: [],
            mappings: []
        }
    ],
    deviceCount: 120,
    pluginPath: 'philips_hue_v1.so',
    createTime: '2023-02-15',
    updateTime: '2023-09-20'
  },
  {
    id: 'BRD-003',
    name: 'Chint 正泰',
    code: 'chint',
    description: '国内知名电气品牌，提供各类智能电表和配电设备。',
    models: [],
    deviceCount: 85,
    createTime: '2023-03-22',
    updateTime: '2023-08-10'
  }
];

// --- Modal: Brand Editor ---
interface BrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Brand) => void;
    initialData?: Brand | null;
}

const BrandModal: React.FC<BrandModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Partial<Brand>>({ name: '', code: '', description: '', pluginPath: '' });

    React.useEffect(() => {
        if(isOpen) {
            setFormData(initialData ? {...initialData} : { name: '', code: '', description: '', pluginPath: '' });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <h3 className="font-bold text-[#2D4965]">{initialData ? '编辑品牌' : '添加新品牌'}</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">品牌名称</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如: Siemens" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">品牌代码 (Code)</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 font-mono" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="siemens" disabled={!!initialData} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">品牌描述</label>
                        <textarea className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 h-20 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">适配插件路径 (Plugin Path)</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 font-mono text-gray-600" value={formData.pluginPath} onChange={e => setFormData({...formData, pluginPath: e.target.value})} placeholder="driver_v1.so" />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">取消</button>
                    <button onClick={() => onSubmit(formData as Brand)} className="px-4 py-2 text-sm font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg shadow-md shadow-blue-200">保存</button>
                </div>
            </div>
        </div>
    );
}

// --- Component: Model Editor (Tabs: Info, DPs, Protocol) ---
interface ModelEditorProps {
    model: ProductModel | null; // null for new
    brandId: string;
    onSave: (model: ProductModel) => void;
    onCancel: () => void;
}

const ModelEditor: React.FC<ModelEditorProps> = ({ model, brandId, onSave, onCancel }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'dp' | 'protocol'>('info');
    const [formData, setFormData] = useState<Partial<ProductModel>>({
        name: '', code: '', categoryId: '', description: '', dps: [], mappings: []
    });

    React.useEffect(() => {
        if (model) {
            setFormData(JSON.parse(JSON.stringify(model)));
        } else {
            setFormData({ name: '', code: '', categoryId: '', description: '', dps: [], mappings: [] });
        }
    }, [model]);

    const handleMappingChange = (index: number, field: keyof ProtocolMapping, value: any) => {
        const newMappings = [...(formData.mappings || [])];
        newMappings[index] = { ...newMappings[index], [field]: value };
        setFormData({ ...formData, mappings: newMappings });
    };

    const addMapping = () => {
        setFormData({
            ...formData,
            mappings: [...(formData.mappings || []), { dpIdentifier: '', registerAddress: 0, registerType: 'HoldingRegister', dataType: 'int16' }]
        });
    };

    const removeMapping = (index: number) => {
        const newMappings = [...(formData.mappings || [])];
        newMappings.splice(index, 1);
        setFormData({ ...formData, mappings: newMappings });
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             {/* Header */}
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                 <div>
                     <h3 className="text-lg font-bold text-[#2D4965]">{model ? '编辑产品型号' : '添加产品型号'}</h3>
                     <p className="text-xs text-[#92A2C3] mt-0.5">{model?.name || '定义新型号及其协议映射'}</p>
                 </div>
                 <div className="flex gap-2">
                     <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-[#535E73] bg-white border border-gray-200 hover:bg-gray-50 rounded-lg">取消</button>
                     <button onClick={() => onSave(formData as ProductModel)} className="px-4 py-2 text-xs font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg flex items-center gap-2"><Save size={14}/> 保存配置</button>
                 </div>
             </div>
             
             {/* Tabs */}
             <div className="px-6 border-b border-gray-100 flex gap-6 bg-white">
                {(['info', 'dp', 'protocol'] as const).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === tab ? 'border-[#225AC8] text-[#225AC8]' : 'border-transparent text-[#92A2C3] hover:text-[#535E73]'}`}
                    >
                        {tab === 'info' && <><Box size={16}/> 基本信息</>}
                        {tab === 'dp' && <><List size={16}/> DP点定义</>}
                        {tab === 'protocol' && <><Cable size={16}/> 协议映射配置</>}
                    </button>
                ))}
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#F8FAFC]">
                 {activeTab === 'info' && (
                     <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border border-gray-100 space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">型号名称</label>
                                 <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如: VRV-X 5HP" />
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">型号代码 (Unique)</label>
                                 <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 font-mono" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="vrv_x_5hp" />
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">所属品类</label>
                                 <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                                     <option value="">选择品类...</option>
                                     <option value="CAT-001">照明系统</option>
                                     <option value="CAT-002">暖通空调 (HVAC)</option>
                                     <option value="CAT-003">智能电表</option>
                                 </select>
                             </div>
                             <div className="col-span-2">
                                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">型号描述</label>
                                 <textarea className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none h-24 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                             </div>
                         </div>
                     </div>
                 )}

                 {activeTab === 'dp' && (
                     <div className="max-w-4xl mx-auto space-y-4">
                         <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center">
                             <div>
                                 <h4 className="text-sm font-bold text-[#225AC8]">DP 功能点管理</h4>
                                 <p className="text-xs text-[#535E73] mt-0.5">定义该型号支持的所有标准功能点。可从品类标准继承或自定义。</p>
                             </div>
                             <button className="px-3 py-1.5 bg-white border border-blue-200 text-[#225AC8] text-xs font-bold rounded-lg hover:bg-blue-50">
                                 + 从品类导入标准DP
                             </button>
                         </div>
                         <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                             <table className="w-full text-left text-sm">
                                 <thead className="bg-gray-50 text-[#92A2C3] font-bold text-xs uppercase">
                                     <tr>
                                         <th className="px-4 py-3">Identifier</th>
                                         <th className="px-4 py-3">名称</th>
                                         <th className="px-4 py-3">类型</th>
                                         <th className="px-4 py-3">RW</th>
                                         <th className="px-4 py-3">操作</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-gray-50">
                                     {formData.dps?.length === 0 ? (
                                         <tr><td colSpan={5} className="text-center py-8 text-gray-400">暂无 DP 定义</td></tr>
                                     ) : (
                                        formData.dps?.map((dp, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3 font-mono">{dp.identifier}</td>
                                                <td className="px-4 py-3">{dp.name}</td>
                                                <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{dp.dataType}</span></td>
                                                <td className="px-4 py-3 text-xs">{dp.accessMode}</td>
                                                <td className="px-4 py-3"><button className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button></td>
                                            </tr>
                                        ))
                                     )}
                                 </tbody>
                             </table>
                             <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                                 <button className="text-xs font-bold text-[#225AC8] hover:underline">+ 添加自定义 DP</button>
                             </div>
                         </div>
                     </div>
                 )}

                 {activeTab === 'protocol' && (
                     <div className="max-w-5xl mx-auto space-y-4">
                         <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-sm font-bold text-[#2D4965] flex items-center gap-2"><Cable size={16}/> Modbus 协议映射配置</h4>
                                <p className="text-xs text-[#92A2C3] mt-0.5">配置 Modbus 寄存器与 DP 点的对应关系及转换规则</p>
                            </div>
                            <button onClick={addMapping} className="px-3 py-1.5 bg-[#225AC8] text-white text-xs font-bold rounded-lg hover:bg-[#1e4eaf] flex items-center gap-1">
                                <Plus size={14}/> 添加映射规则
                            </button>
                         </div>
                         
                         <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                             <table className="w-full text-left text-xs">
                                 <thead className="bg-[#F8FAFC] text-[#92A2C3] font-bold border-b border-gray-100">
                                     <tr>
                                         <th className="px-3 py-3 w-16">No.</th>
                                         <th className="px-3 py-3 w-40">关联 DP (Identifier)</th>
                                         <th className="px-3 py-3">寄存器类型</th>
                                         <th className="px-3 py-3 w-24">地址 (Dec)</th>
                                         <th className="px-3 py-3 w-28">数据类型</th>
                                         <th className="px-3 py-3 w-24">缩放 (Scale)</th>
                                         <th className="px-3 py-3 w-24">偏移 (Offset)</th>
                                         <th className="px-3 py-3 w-10"></th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-gray-50">
                                     {formData.mappings?.map((map, idx) => (
                                         <tr key={idx} className="hover:bg-blue-50/20">
                                             <td className="px-3 py-2 text-center text-gray-400">{idx + 1}</td>
                                             <td className="px-3 py-2">
                                                 <select 
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-500 font-mono text-[#2D4965]"
                                                    value={map.dpIdentifier}
                                                    onChange={e => handleMappingChange(idx, 'dpIdentifier', e.target.value)}
                                                 >
                                                     <option value="">Select DP...</option>
                                                     {formData.dps?.map(dp => <option key={dp.id} value={dp.identifier}>{dp.identifier} ({dp.name})</option>)}
                                                 </select>
                                             </td>
                                             <td className="px-3 py-2">
                                                 <select 
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none"
                                                    value={map.registerType}
                                                    onChange={e => handleMappingChange(idx, 'registerType', e.target.value)}
                                                 >
                                                     <option value="HoldingRegister">Holding (4x)</option>
                                                     <option value="InputRegister">Input (3x)</option>
                                                     <option value="Coil">Coil (0x)</option>
                                                     <option value="DiscreteInput">Discrete (1x)</option>
                                                 </select>
                                             </td>
                                             <td className="px-3 py-2">
                                                 <input 
                                                    type="number" 
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none font-mono"
                                                    value={map.registerAddress}
                                                    onChange={e => handleMappingChange(idx, 'registerAddress', parseInt(e.target.value))}
                                                 />
                                             </td>
                                             <td className="px-3 py-2">
                                                <select 
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none"
                                                    value={map.dataType}
                                                    onChange={e => handleMappingChange(idx, 'dataType', e.target.value)}
                                                 >
                                                     <option value="int16">int16</option>
                                                     <option value="uint16">uint16</option>
                                                     <option value="int32">int32</option>
                                                     <option value="float32">float32</option>
                                                     <option value="bool">bool</option>
                                                 </select>
                                             </td>
                                             <td className="px-3 py-2">
                                                 <input 
                                                    type="number" step="0.1" 
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none font-mono text-gray-500"
                                                    placeholder="1.0"
                                                    value={map.scaleFactor || ''}
                                                    onChange={e => handleMappingChange(idx, 'scaleFactor', parseFloat(e.target.value))}
                                                 />
                                             </td>
                                             <td className="px-3 py-2">
                                                 <input 
                                                    type="number" 
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 outline-none font-mono text-gray-500"
                                                    placeholder="0"
                                                    value={map.offset || ''}
                                                    onChange={e => handleMappingChange(idx, 'offset', parseFloat(e.target.value))}
                                                 />
                                             </td>
                                             <td className="px-3 py-2 text-center">
                                                 <button onClick={() => removeMapping(idx)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                             {(!formData.mappings || formData.mappings.length === 0) && (
                                 <div className="p-8 text-center text-gray-400 text-xs">暂无协议映射规则，请点击右上角添加。</div>
                             )}
                         </div>
                         <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-[10px] text-yellow-700 flex gap-2">
                             <AlertTriangle size={14} className="flex-shrink-0" />
                             <p>注意: 寄存器地址为十进制 (Decimal)。Scale 和 Offset 将应用于读取的值: Value = (Raw * Scale) + Offset。</p>
                         </div>
                     </div>
                 )}
             </div>
        </div>
    );
};

// --- Main Component ---

const BrandManager: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail' | 'model_edit'>('list');
  const [brands, setBrands] = useState<Brand[]>(MOCK_BRANDS);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Handlers
  const handleSaveBrand = (data: Brand) => {
    if (editingBrand) {
        setBrands(prev => prev.map(b => b.id === data.id ? data : b));
        if (selectedBrand?.id === data.id) setSelectedBrand(data);
    } else {
        const newBrand = { ...data, id: `BRD-${Date.now()}`, models: [], deviceCount: 0, createTime: new Date().toLocaleDateString(), updateTime: new Date().toLocaleDateString() };
        setBrands(prev => [newBrand, ...prev]);
    }
    setIsBrandModalOpen(false);
    setEditingBrand(null);
  };

  const handleDeleteBrand = (id: string) => {
      if(window.confirm('确定删除该品牌吗？')) {
          setBrands(prev => prev.filter(b => b.id !== id));
          if(selectedBrand?.id === id) setView('list');
      }
  };

  const handleSaveModel = (modelData: ProductModel) => {
      if (!selectedBrand) return;
      const updatedBrand = { ...selectedBrand };
      
      if (selectedModel) {
          // Update
          updatedBrand.models = updatedBrand.models.map(m => m.id === modelData.id ? modelData : m);
      } else {
          // Create
          const newModel = { ...modelData, id: `MOD-${Date.now()}`, deviceCount: 0 };
          updatedBrand.models = [...updatedBrand.models, newModel];
      }
      
      setSelectedBrand(updatedBrand);
      setBrands(prev => prev.map(b => b.id === updatedBrand.id ? updatedBrand : b));
      setView('detail');
      setSelectedModel(null);
  };

  // Views
  const renderListView = () => (
      <div className="space-y-6 h-full flex flex-col">
          {/* 1. Header */}
          <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-[#2D4965] flex items-center gap-3">
                  <span className="w-1.5 h-5 bg-[#27509F] rounded-full"></span>
                  品牌管理
              </h1>
              <p className="text-xs text-[#92A2C3] mt-1.5 ml-4">负责品牌产品型号的配置和管理</p>
          </div>

          {/* 2. KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#225AC8] flex items-center justify-center shadow-sm">
                    <Award size={28} />
                </div>
                <div>
                    <p className="text-xs text-[#92A2C3] font-medium mb-1">合作品牌总数</p>
                    <p className="text-3xl font-bold text-[#2D4965] tracking-tight">{brands.length}</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
                    <Box size={28} />
                </div>
                <div>
                    <p className="text-xs text-[#92A2C3] font-medium mb-1">产品型号库</p>
                    <p className="text-3xl font-bold text-[#2D4965] tracking-tight">{brands.reduce((acc, b) => acc + b.models.length, 0)}</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                    <Server size={28} />
                </div>
                <div>
                    <p className="text-xs text-[#92A2C3] font-medium mb-1">接入设备总量</p>
                    <p className="text-3xl font-bold text-[#2D4965] tracking-tight">{brands.reduce((acc, b) => acc + b.deviceCount, 0)}</p>
                </div>
             </div>
          </div>

          {/* 3. List Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
              <div className="p-5 flex justify-between items-center bg-white rounded-t-2xl">
                  <div className="flex items-center gap-3">
                     <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#535E73] text-sm font-bold rounded-xl hover:bg-gray-50 transition-all">
                        <Filter size={16} /> 筛选
                     </button>
                     <div className="relative group w-80">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#225AC8] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="搜索品类名称/代码..." 
                            className="w-full pl-11 pr-10 py-2.5 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-xl text-sm outline-none transition-all placeholder-gray-400 text-[#535E73]"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                     </div>
                  </div>
                  <button onClick={() => { setEditingBrand(null); setIsBrandModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#27509F] text-white text-sm font-bold rounded-xl hover:bg-[#1e4eaf] shadow-md shadow-blue-200 transition-all">
                      <Plus size={18} /> 添加品牌
                  </button>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold border-b border-gray-50 sticky top-0 z-10">
                          <tr>
                              <th className="px-6 py-4">品牌名称 / 代码</th>
                              <th className="px-4 py-4">描述</th>
                              <th className="px-4 py-4">适配插件 (DRIVER)</th>
                              <th className="px-4 py-4">型号/设备</th>
                              <th className="px-4 py-4">更新时间</th>
                              <th className="px-6 py-4 text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map(brand => (
                              <tr key={brand.id} className="hover:bg-blue-50/20 transition-colors group cursor-pointer" onClick={() => { setSelectedBrand(brand); setView('detail'); }}>
                                  <td className="px-6 py-5">
                                      <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-gray-50 text-[#2D4965] flex items-center justify-center font-bold text-lg border border-gray-100 shadow-sm">
                                              {brand.name.charAt(0)}
                                          </div>
                                          <div>
                                              <div className="font-bold text-[#2D4965] text-sm mb-1">{brand.name}</div>
                                              <span className="text-[10px] text-[#92A2C3] bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold">{brand.code}</span>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-4 py-5 text-xs text-[#535E73] max-w-xs truncate">{brand.description}</td>
                                  <td className="px-4 py-5">
                                     <div className="flex items-center gap-1.5 text-xs text-[#535E73]">
                                        <FileCode size={14} className="text-[#92A2C3]"/>
                                        <span className="font-mono">{brand.pluginPath ? brand.pluginPath.split('/').pop() : '-'}</span>
                                     </div>
                                  </td>
                                  <td className="px-4 py-5">
                                      <div className="flex flex-col gap-1 text-xs text-[#535E73]">
                                          <div className="flex items-center gap-2"><Box size={14} className="text-[#92A2C3]"/> {brand.models.length} 型号</div>
                                          <div className="flex items-center gap-2"><Server size={14} className="text-[#92A2C3]"/> {brand.deviceCount} 设备</div>
                                      </div>
                                  </td>
                                  <td className="px-4 py-5 text-xs text-[#92A2C3] font-mono">{brand.updateTime}</td>
                                  <td className="px-6 py-5 text-right">
                                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={(e) => { e.stopPropagation(); setEditingBrand(brand); setIsBrandModalOpen(true); }} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all" title="编辑"><Edit size={16}/></button>
                                          <button onClick={(e) => { e.stopPropagation(); handleDeleteBrand(brand.id); }} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all" title="删除"><Trash2 size={16}/></button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Footer Pagination */}
              <div className="p-4 border-t border-gray-100 flex justify-end items-center gap-4 flex-shrink-0 bg-white rounded-b-2xl">
                 <span className="text-xs text-[#92A2C3]">共 {brands.length} 条</span>
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
    if (!selectedBrand) return null;
    return (
        <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between flex-shrink-0 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                     <button onClick={() => setView('list')} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-[#535E73] transition-all"><ChevronLeft size={20}/></button>
                     <div className="flex items-baseline gap-3">
                        <h2 className="text-2xl font-bold text-[#2D4965]">{selectedBrand.name}</h2>
                        <span className="text-sm font-mono text-[#225AC8] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{selectedBrand.code}</span>
                     </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => { setEditingBrand(selectedBrand); setIsBrandModalOpen(true); }} className="px-4 py-2 bg-white border border-gray-200 text-[#535E73] text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Edit size={16}/> 编辑品牌
                    </button>
                     <button onClick={() => { if(confirm('确定删除该品牌吗？')) { /* delete logic */ setView('list'); } }} className="px-4 py-2 bg-red-50 border border-red-100 text-red-500 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">
                        <Trash2 size={16}/> 删除
                    </button>
                </div>
            </div>

            {/* Top Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
                {/* Left: Basic Info Card (Takes 2 cols) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                    <h3 className="text-lg font-bold text-[#2D4965] flex items-center gap-2"><Tag size={20} className="text-[#225AC8]"/> 品牌基本信息</h3>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs text-[#92A2C3] mb-1">品牌名称</p>
                            <p className="text-base font-bold text-[#2D4965]">{selectedBrand.name}</p>
                        </div>
                         <div>
                            <p className="text-xs text-[#92A2C3] mb-1">品牌代码</p>
                            <p className="text-base font-bold text-[#535E73] font-mono bg-gray-50 px-2 py-1 rounded w-fit">{selectedBrand.code}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-[#92A2C3] mb-2">品牌描述</p>
                        <div className="bg-[#F8FAFC] p-4 rounded-xl text-sm text-[#535E73] leading-relaxed border border-gray-100">
                            {selectedBrand.description || '暂无描述信息'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-2">
                         <div>
                            <p className="text-xs text-[#92A2C3] mb-1">创建时间</p>
                            <p className="text-sm font-medium text-[#535E73]">{selectedBrand.createTime}</p>
                        </div>
                         <div>
                            <p className="text-xs text-[#92A2C3] mb-1">更新时间</p>
                            <p className="text-sm font-medium text-[#535E73]">{selectedBrand.updateTime}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Stats Cards (Takes 1 col, stacked) */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center flex-1 min-h-[140px]">
                        <p className="text-4xl font-bold text-[#225AC8] mb-2">{selectedBrand.models.length}</p>
                        <p className="text-sm font-bold text-[#535E73]">产品型号</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center flex-1 min-h-[140px]">
                         <p className="text-4xl font-bold text-green-600 mb-2">{selectedBrand.deviceCount}</p>
                         <p className="text-sm font-bold text-[#535E73]">关联设备</p>
                    </div>
                </div>
            </div>

            {/* Bottom: Product Model List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
                 <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
                      <h3 className="text-lg font-bold text-[#2D4965] flex items-center gap-2"><Server size={20} className="text-[#225AC8]"/> 产品型号列表</h3>
                      <button onClick={() => { setSelectedModel(null); setView('model_edit'); }} className="px-4 py-2 bg-[#27509F] text-white text-sm font-bold rounded-lg hover:bg-[#1e4eaf] flex items-center gap-2 shadow-md shadow-blue-200">
                          <Plus size={16}/> 添加产品型号
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-auto custom-scrollbar p-0">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold uppercase border-b border-gray-100 sticky top-0">
                           <tr>
                              <th className="px-6 py-4 font-bold">型号名称</th>
                              <th className="px-6 py-4 font-bold">型号代码</th>
                              <th className="px-6 py-4 font-bold text-center">DP 数量</th>
                              <th className="px-6 py-4 font-bold text-center">协议映射</th>
                              <th className="px-6 py-4 font-bold">更新时间</th>
                              <th className="px-6 py-4 font-bold text-right">操作</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {selectedBrand.models.length === 0 ? (
                               <tr><td colSpan={6} className="text-center py-12 text-gray-400">暂无产品型号，请点击右上角添加。</td></tr>
                           ) : (
                               selectedBrand.models.map(model => (
                                  <tr key={model.id} className="hover:bg-blue-50/20 transition-colors group">
                                     <td className="px-6 py-4">
                                        <div className="font-bold text-[#2D4965] text-base">{model.name}</div>
                                        <div className="text-xs text-[#92A2C3] mt-1">{model.description || '无描述'}</div>
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className="font-mono text-sm text-[#535E73]">{model.code}</span>
                                     </td>
                                     <td className="px-6 py-4 text-center">
                                         <span className="font-bold text-[#535E73]">{model.dps?.length || 0}</span>
                                     </td>
                                     <td className="px-6 py-4 text-center">
                                         {model.mappings?.length > 0 ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded border border-green-100"><CheckCircle2 size={12}/> 已配置</span>
                                         ) : (
                                            <span className="inline-flex items-center gap-1 text-[#F59E0B] text-xs font-bold bg-orange-50 px-2 py-1 rounded border border-orange-100"><AlertTriangle size={12}/> 未配置</span>
                                         )}
                                     </td>
                                     <td className="px-6 py-4 text-xs text-[#92A2C3] font-mono">
                                        2024-03-20 {/* Mock date as it's not in ProductModel type yet */}
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-4">
                                            <button onClick={() => { setSelectedModel(model); setView('model_edit'); }} className="text-[#225AC8] hover:underline font-bold text-sm">配置</button>
                                            <button onClick={() => {
                                                if(window.confirm('确认删除该型号？')) {
                                                    const updatedBrand = {...selectedBrand, models: selectedBrand.models.filter(m => m.id !== model.id)};
                                                    setSelectedBrand(updatedBrand);
                                                    setBrands(prev => prev.map(b => b.id === updatedBrand.id ? updatedBrand : b));
                                                }
                                            }} className="text-red-500 hover:underline font-bold text-sm">删除</button>
                                        </div>
                                     </td>
                                  </tr>
                               ))
                           )}
                        </tbody>
                     </table>
                  </div>
            </div>
        </div>
    );
  };

  return (
    <>
        <BrandModal 
            isOpen={isBrandModalOpen}
            onClose={() => setIsBrandModalOpen(false)}
            onSubmit={handleSaveBrand}
            initialData={editingBrand}
        />

        {view === 'list' && renderListView()}
        {view === 'detail' && renderDetailView()}
        {view === 'model_edit' && selectedBrand && (
            <div className="h-full animate-in zoom-in-95 duration-200">
                <ModelEditor 
                    model={selectedModel} 
                    brandId={selectedBrand.id}
                    onSave={handleSaveModel}
                    onCancel={() => setView('detail')}
                />
            </div>
        )}
    </>
  );
};

export default BrandManager;
