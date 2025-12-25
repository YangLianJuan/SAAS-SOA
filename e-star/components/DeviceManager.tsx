
import React, { useState } from 'react';
import { 
  Search, Filter, Plus, RefreshCw, 
  ChevronLeft, Settings, Power, 
  Activity, AlertTriangle, Cpu, Server, Wifi, MapPin, 
  CheckCircle2, XCircle, Sliders, Box, Clock, Edit, Trash2,
  Save, X, Plug, Thermometer, Sun, Droplets, Fan, List, Terminal, History,
  Database, Bell, Link as LinkIcon, Info, Zap, Gauge, BellRing, Smartphone, Mail,
  LayoutGrid, ArrowUpRight, AlertOctagon, ClipboardList
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Device } from '../types';

// --- Mock Data ---

const INITIAL_DEVICES: Device[] = [
  { id: 'DEV-001', name: '一楼大厅中央空调', type: 'HVAC', brand: 'Daikin', model: 'VRV-X', status: 'online', location: '上海旗舰店-F1-大厅', storeId: 'SH001', gatewayId: 'BOX-001', modbusAddr: 1, lastActive: '10秒前', powerUsage: 12.5, todayEnergy: 45.2 },
  { id: 'DEV-002', name: '生鲜区冷柜组 A', type: 'HVAC', brand: 'Haier', model: 'SC-200', status: 'online', location: '上海旗舰店-B1-生鲜', storeId: 'SH001', gatewayId: 'BOX-001', modbusAddr: 2, lastActive: '30秒前', powerUsage: 0, todayEnergy: 12.1 },
  { id: 'DEV-003', name: '入口主照明', type: 'Lighting', brand: 'Philips', model: 'Hue-Pro', status: 'fault', location: '上海旗舰店-F1-入口', storeId: 'SH001', gatewayId: 'BOX-002', modbusAddr: 1, lastActive: '5分钟前', powerUsage: 0.8, todayEnergy: 6.4 },
  { id: 'DEV-004', name: '总进线智能电表', type: 'Meter', brand: 'Chint', model: 'DTSU666', status: 'online', location: '上海旗舰店-配电房', storeId: 'SH001', gatewayId: 'BOX-001', modbusAddr: 10, lastActive: '1分钟前', powerUsage: 0, todayEnergy: 0 },
  { id: 'DEV-005', name: '办公区新风系统', type: 'HVAC', brand: 'Honeywell', model: 'ERV-350', status: 'offline', location: '上海旗舰店-F2-办公', storeId: 'SH001', gatewayId: 'BOX-002', modbusAddr: 5, lastActive: '2小时前', powerUsage: 0, todayEnergy: 0 },
  { id: 'DEV-006', name: '仓库温湿度传感器', type: 'Sensor', brand: 'Xiaomi', model: 'Mijia-2', status: 'online', location: '上海旗舰店-B2-仓库', storeId: 'SH001', gatewayId: 'BOX-003', modbusAddr: 1, lastActive: '1分钟前', powerUsage: 0.01, todayEnergy: 0.1 },
  { id: 'DEV-007', name: '员工浴室热水器', type: 'WaterHeater', brand: 'Midea', model: 'F60-30', status: 'online', location: '上海旗舰店-B1-后勤', storeId: 'SH001', gatewayId: 'BOX-003', modbusAddr: 6, lastActive: '10分钟前', powerUsage: 2.5, todayEnergy: 8.5 },
];

const MOCK_HISTORY_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  value: Math.floor(Math.random() * 20) + 10, // kW
}));

const MOCK_DAILY_DATA = Array.from({ length: 7 }, (_, i) => ({
  day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
  value: Math.floor(Math.random() * 50) + 30, // kWh
}));

const MOCK_DP_MAPPING = [
  { id: 1, name: 'Switch_On_Off', type: 'Boolean', rw: 'RW', register: '40001', desc: '设备启停控制' },
  { id: 2, name: 'Target_Temp', type: 'Integer', rw: 'RW', register: '40002', desc: '目标温度设定 (0-100)' },
  { id: 3, name: 'Fan_Speed', type: 'Enum', rw: 'RW', register: '40003', desc: '风速档位 (0:Low, 1:Med, 2:High)' },
  { id: 4, name: 'Current_Temp', type: 'Integer', rw: 'RO', register: '30001', desc: '当前环境温度' },
  { id: 5, name: 'Error_Code', type: 'Bitmap', rw: 'RO', register: '30002', desc: '故障代码' },
];

const MOCK_LOGS = [
  { id: 1, time: '2023-10-27 14:30:00', event: '设备上线 (Heartbeat)', operator: 'System', type: 'info' },
  { id: 2, time: '2023-10-27 14:35:12', event: '远程开启设备', operator: 'Admin', type: 'success' },
  { id: 3, time: '2023-10-27 15:00:00', event: '温度设定调整 (24°C -> 22°C)', operator: 'Admin', type: 'warning' },
  { id: 4, time: '2023-10-27 16:20:05', event: '自动模式触发', operator: 'Strategy-01', type: 'info' },
  { id: 5, time: '2023-10-27 18:00:00', event: '夜间节能模式开启', operator: 'System', type: 'success' },
];

const MOCK_DEVICE_FAULTS = [
  { id: 1, type: 'Communication', message: 'Heartbeat timeout (>5min)', time: '2023-10-25 14:00', status: 'Resolved' },
  { id: 2, type: 'Threshold', message: 'Current overload (>16A)', time: '2023-10-26 09:30', status: 'Active' },
  { id: 3, type: 'Device', message: 'Sensor value abnormal', time: '2023-10-27 08:15', status: 'Resolved' },
];

// --- Helper Components ---

const StatusBadge = ({ status }: { status: Device['status'] }) => {
  const styles = {
    online: 'bg-green-50 text-green-600 border-green-100',
    offline: 'bg-gray-100 text-gray-500 border-gray-200',
    fault: 'bg-red-50 text-red-600 border-red-100',
  };
  
  const labels = {
    online: '在线',
    offline: '离线',
    fault: '故障',
  };

  const Icons = {
    online: CheckCircle2,
    offline: XCircle,
    fault: AlertTriangle,
  };

  const Icon = Icons[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border w-fit ${styles[status]}`}>
      <Icon size={12} />
      {labels[status]}
    </span>
  );
};

// --- Reusable Control Panel Component ---

interface DeviceControlPanelProps {
  device: Device;
  variant?: 'modal' | 'card';
  onClose?: () => void;
}

const DeviceControlPanel: React.FC<DeviceControlPanelProps> = ({ device, variant = 'card', onClose }) => {
  const [isOn, setIsOn] = useState(true);
  const [value1, setValue1] = useState(50); // Temp or Brightness
  const [value2, setValue2] = useState(50); // Color Temp or other
  const [mode, setMode] = useState('auto');

  const isModal = variant === 'modal';
  
  // Styles based on variant
  const containerClass = isModal 
    ? `bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative`
    : `bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col relative overflow-hidden`;

  const headerClass = isModal
    ? `p-6 pb-8 ${isOn ? 'bg-[#225AC8]' : 'bg-[#535E73]'} transition-colors duration-300 text-white relative overflow-hidden`
    : `p-5 border-b border-gray-100 flex justify-between items-center bg-white`;
    
  const contentClass = isModal
    ? `p-6 pt-2 transition-opacity duration-300 ${isOn ? 'opacity-100' : 'opacity-40 pointer-events-none'}`
    : `p-5 transition-opacity duration-300 flex-1 ${isOn ? 'opacity-100' : 'opacity-40 pointer-events-none'}`;

  const renderHeader = () => {
    if (isModal) {
      return (
        <div className={headerClass}>
           <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <h3 className="text-lg font-bold relative z-10">{device.name}</h3>
           <p className="text-xs opacity-80 relative z-10 flex items-center gap-1 mt-1">
              <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-400' : 'bg-gray-400'}`}></span>
              {isOn ? '运行中' : '已关闭'}
           </p>
           {onClose && <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"><X size={20}/></button>}
        </div>
      );
    }
    return (
      <div className={headerClass}>
        <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2">
           <Sliders size={16} /> 远程控制
        </h3>
        <div className="flex items-center gap-2">
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOn ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              {isOn ? 'RUNNING' : 'OFF'}
           </span>
           <button 
             onClick={() => setIsOn(!isOn)}
             className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOn ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
           >
             <Power size={14} strokeWidth={3} />
           </button>
        </div>
      </div>
    );
  };

  const renderPowerBtnModal = () => {
    if (!isModal) return null;
    return (
      <div className="px-6 -mt-6 relative z-10 flex justify-end">
          <button 
            onClick={() => setIsOn(!isOn)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 ${isOn ? 'bg-white text-green-500' : 'bg-gray-200 text-gray-500'}`}
          >
             <Power size={24} strokeWidth={3} />
          </button>
      </div>
    );
  };

  const renderControls = () => {
    switch (device.type) {
      case 'HVAC':
        return (
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-gray-50 p-1 rounded-lg flex">
              {['cool', 'heat', 'fan', 'auto'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                    mode === m ? 'bg-white text-[#225AC8] shadow-sm' : 'text-[#92A2C3] hover:text-[#535E73]'
                  }`}
                >
                  {m === 'cool' && '制冷'}
                  {m === 'heat' && '制热'}
                  {m === 'fan' && '送风'}
                  {m === 'auto' && '自动'}
                </button>
              ))}
            </div>

            {/* Temperature */}
            <div className="text-center py-2">
              <div className="text-5xl font-bold text-[#2D4965] mb-2">{Math.floor(16 + (value1 / 100) * 14)}<span className="text-2xl align-top">°C</span></div>
              <p className="text-xs text-[#92A2C3]">目标温度设定</p>
            </div>
            <div className="px-1">
               <input 
                type="range" min="0" max="100" value={value1} onChange={(e) => setValue1(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#225AC8]"
               />
               <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                 <span>16°C</span>
                 <span>30°C</span>
               </div>
            </div>

            {/* Fan Speed */}
            <div>
               <p className="text-xs font-bold text-[#535E73] mb-2 flex items-center gap-1"><Fan size={12}/> 风速设定</p>
               <div className="flex gap-2">
                 {['Low', 'Med', 'High'].map(s => (
                   <button key={s} className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:border-blue-200 hover:bg-blue-50 hover:text-[#225AC8] transition-all text-[#92A2C3] bg-white">
                     {s}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        );
      
      case 'Lighting':
        return (
          <div className="space-y-6">
             {/* Brightness */}
             <div>
                <div className="flex justify-between mb-2">
                   <span className="text-xs font-bold text-[#535E73] flex items-center gap-1"><Sun size={14}/> 亮度</span>
                   <span className="text-xs font-mono text-[#225AC8]">{value1}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={value1} onChange={(e) => setValue1(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                />
             </div>
             
             {/* Color Temp */}
             <div>
                <div className="flex justify-between mb-2">
                   <span className="text-xs font-bold text-[#535E73] flex items-center gap-1"><Thermometer size={14}/> 色温</span>
                   <span className="text-xs font-mono text-[#225AC8]">{2700 + Math.floor(value2/100 * 3800)}K</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={value2} onChange={(e) => setValue2(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{background: 'linear-gradient(to right, #FF9500, #F5F5F5, #4DB6AC)'}}
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                 <span>Warm</span>
                 <span>Cool</span>
               </div>
             </div>
          </div>
        );

      case 'WaterHeater':
        return (
          <div className="space-y-6">
             <div className="text-center py-4 relative">
                <div className="w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center mx-auto relative">
                   <div className="absolute inset-0 rounded-full border-4 border-[#225AC8] border-t-transparent animate-spin duration-[3000ms]"></div>
                   <div>
                      <div className="text-2xl font-bold text-[#2D4965]">{Math.floor(30 + (value1 / 100) * 45)}°C</div>
                   </div>
                </div>
                <div className="text-[10px] text-[#92A2C3] mt-2">当前水温</div>
             </div>
             <div>
                <div className="flex justify-between mb-2">
                   <span className="text-xs font-bold text-[#535E73] flex items-center gap-1"><Droplets size={14}/> 目标水温</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={value1} onChange={(e) => setValue1(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ef4444]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                 <span>30°C</span>
                 <span>75°C</span>
               </div>
             </div>
          </div>
        );

      default:
        return <div className="p-4 text-center text-gray-400 text-xs">此设备类型暂不支持高级参数控制</div>;
    }
  };

  return (
    <div className={containerClass}>
       {renderHeader()}
       {renderPowerBtnModal()}
       <div className={contentClass}>
          {renderControls()}
       </div>
       {isModal && (
         <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center mt-auto">
            <button onClick={onClose} className="text-xs font-bold text-[#535E73] hover:text-[#225AC8]">关闭控制面板</button>
         </div>
       )}
    </div>
  );
};

// --- Modals ---

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: Device) => void;
  initialData?: Device | null;
  mode: 'add' | 'edit';
}

const DeviceModal: React.FC<DeviceModalProps> = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
  const [formData, setFormData] = useState<Partial<Device>>(
    initialData || {
      name: '',
      type: 'HVAC',
      brand: '',
      model: '',
      status: 'offline',
      location: '',
      storeId: '',
      gatewayId: 'BOX-NEW',
      modbusAddr: 1,
      powerUsage: 0,
      todayEnergy: 0,
      lastActive: '从未'
    }
  );

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        id: `DEV-${Math.floor(Math.random() * 10000)}`,
        name: '',
        type: 'HVAC',
        brand: '',
        model: '',
        status: 'offline',
        location: '',
        storeId: '',
        gatewayId: 'BOX-NEW',
        modbusAddr: 1,
        powerUsage: 0,
        todayEnergy: 0,
        lastActive: '从未'
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Device, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-[#2D4965]">{mode === 'add' ? '接入新设备' : '编辑设备信息'}</h3>
            <p className="text-xs text-[#92A2C3] mt-0.5">{mode === 'add' ? '请按步骤配置设备参数与通信协议' : '修改设备基础属性与状态'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-xs font-bold text-[#225AC8] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#225AC8] flex items-center justify-center text-[10px]">1</span> 基础信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">设备名称</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="例如：一楼大厅空调"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">设备类型</label>
                <select 
                  value={formData.type || 'HVAC'} 
                  onChange={e => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                >
                  <option value="HVAC">暖通空调 (HVAC)</option>
                  <option value="Lighting">照明系统 (Lighting)</option>
                  <option value="WaterHeater">热水器 (WaterHeater)</option>
                  <option value="Meter">智能电表 (Meter)</option>
                  <option value="Sensor">传感器 (Sensor)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">设备ID / 序号</label>
                <input 
                  type="text" 
                  value={formData.id || ''} 
                  onChange={e => handleChange('id', e.target.value)}
                  disabled={mode === 'edit'}
                  className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none font-mono ${mode === 'edit' ? 'bg-gray-100 text-gray-500' : 'bg-gray-50'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">品牌</label>
                <input 
                  type="text" 
                  value={formData.brand || ''} 
                  onChange={e => handleChange('brand', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                  placeholder="Brand"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">型号</label>
                <input 
                  type="text" 
                  value={formData.model || ''} 
                  onChange={e => handleChange('model', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                  placeholder="Model"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & Connection */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-xs font-bold text-[#225AC8] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#225AC8] flex items-center justify-center text-[10px]">2</span> 位置与连接
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">所属门店</label>
                <select 
                  value={formData.storeId || ''} 
                  onChange={e => handleChange('storeId', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                >
                  <option value="">请选择门店...</option>
                  <option value="SH001">上海静安旗舰店 (SH001)</option>
                  <option value="BJ001">北京朝阳店 (BJ001)</option>
                  <option value="SZ001">深圳南山店 (SZ001)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">安装位置</label>
                <input 
                  type="text" 
                  value={formData.location || ''} 
                  onChange={e => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                  placeholder="例如：F1-东区-101"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">网关ID</label>
                <input 
                  type="text" 
                  value={formData.gatewayId || ''} 
                  onChange={e => handleChange('gatewayId', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#535E73] mb-1.5">Modbus 地址</label>
                <input 
                  type="number" 
                  value={formData.modbusAddr || 1} 
                  onChange={e => handleChange('modbusAddr', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Edit Specifics or Add Specifics */}
          {mode === 'edit' ? (
             <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h4 className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-50 text-[#F59E0B] flex items-center justify-center text-[10px]">3</span> 状态与能耗 (手动修正)
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#535E73] mb-1.5">设备状态</label>
                    <select 
                      value={formData.status || 'offline'} 
                      onChange={e => handleChange('status', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    >
                      <option value="online">在线</option>
                      <option value="offline">离线</option>
                      <option value="fault">故障</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#535E73] mb-1.5">当前功率 (kW)</label>
                    <input 
                      type="number" 
                      value={formData.powerUsage || 0} 
                      onChange={e => handleChange('powerUsage', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#535E73] mb-1.5">今日能耗 (kWh)</label>
                    <input 
                      type="number" 
                      value={formData.todayEnergy || 0} 
                      onChange={e => handleChange('todayEnergy', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    />
                  </div>
                </div>
             </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
               <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px]">3</span> 协议适配与功能映射
                </h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-dashed border-green-200/50">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-[#535E73]">品牌插件适配</span>
                      <span className="text-xs font-bold text-green-600 bg-green-100/50 px-2 py-1 rounded flex items-center gap-1 border border-green-100">
                        <CheckCircle2 size={12} /> 系统自动识别: {formData.brand ? `${formData.brand} Protocol v2.0` : '等待输入品牌...'}
                      </span>
                   </div>
                   <div className="h-px bg-gray-200"></div>
                   <div>
                      <p className="text-xs text-[#92A2C3] mb-2">DP 功能点自动映射预览:</p>
                      <div className="space-y-1.5">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="flex justify-between items-center text-xs bg-white px-3 py-2 rounded border border-gray-100 text-[#535E73]">
                              <span className="font-mono text-[#92A2C3]">DP_{i}0{i}</span>
                              <span className="flex-1 mx-3 border-b border-dotted border-gray-300"></span>
                              <span className="font-mono text-[#225AC8] font-medium">Reg: 4000{i} (RW)</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#535E73] hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => onSubmit(formData as Device)}
            className="px-6 py-2 text-sm font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            {mode === 'add' ? '确认接入' : '保存修改'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
}

const ControlModal: React.FC<ControlModalProps> = ({ isOpen, onClose, device }) => {
  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <DeviceControlPanel device={device} variant="modal" onClose={onClose} />
    </div>
  );
};

// --- Main Component ---

const DeviceManager: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'fault'>('all');
  const [activeTab, setActiveTab] = useState<'basic' | 'config' | 'dp' | 'alarm' | 'faults'>('basic');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // CRUD Operations
  const handleAddDevice = (newDevice: Device) => {
    setDevices(prev => [newDevice, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
    setIsEditModalOpen(false);
    // If we are editing the currently selected detailed device, update it too
    if (selectedDevice && selectedDevice.id === updatedDevice.id) {
      setSelectedDevice(updatedDevice);
    }
  };

  const handleDeleteDevice = (id: string) => {
    if (confirm('确认删除该设备吗？删除后将停止数据采集。')) {
      setDevices(prev => prev.filter(d => d.id !== id));
      if (view === 'detail') handleBack();
    }
  };

  const openEditModal = (device: Device, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingDevice(device);
    setIsEditModalOpen(true);
  };

  const openControlModal = (device: Device, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingDevice(device);
    setIsControlModalOpen(true);
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setActiveTab('basic');
    setView('detail');
  };

  const handleBack = () => {
    setSelectedDevice(null);
    setView('list');
  };

  // Filtered Devices
  const filteredDevices = devices.filter(d => {
    const matchesText = d.name.toLowerCase().includes(filterText.toLowerCase()) || 
                       d.location.toLowerCase().includes(filterText.toLowerCase()) ||
                       d.id.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesText && matchesStatus;
  });

  const ConfigTabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all flex-shrink-0 ${
         activeTab === id 
         ? 'border-[#225AC8] text-[#225AC8] bg-blue-50/50' 
         : 'border-transparent text-[#92A2C3] hover:text-[#535E73] hover:bg-gray-50'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );

  // --- List View Render ---
  const renderListView = () => {
    // Stats Calculation
    const total = devices.length;
    const online = devices.filter(d => d.status === 'online').length;
    const offline = devices.filter(d => d.status === 'offline').length;
    const fault = devices.filter(d => d.status === 'fault').length;
    const onlineRate = total > 0 ? Math.round((online / total) * 100) : 0;

    return (
      <div className="h-full flex flex-col space-y-6">
        {/* 1. Header Section */}
        <div className="flex justify-between items-end flex-shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-[#2D4965]">设备管理</h2>
                <p className="text-[#92A2C3] text-xs font-medium mt-1">设备接入、状态监控与远程运维</p>
            </div>
            <div className="flex gap-3">
                <button className="bg-white border border-gray-200 text-[#535E73] hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
                    <Box size={16} /> 盒子管理
                </button>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#27509F] hover:bg-[#1e4eaf] text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-200/50 transition-all"
                >
                    <Plus size={18} /> 
                    接入设备
                </button>
            </div>
        </div>

        {/* 2. Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
            {/* Total */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-[#92A2C3] font-bold mb-1">总设备数</p>
                    <p className="text-3xl font-bold text-[#2D4965]">{total}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#225AC8] flex items-center justify-center">
                    <LayoutGrid size={20} />
                </div>
            </div>
            {/* Online */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-[#92A2C3] font-bold mb-1">在线运行</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-[#2D4965]">{online}</p>
                        <span className="text-sm font-bold text-green-500">{onlineRate}%</span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                </div>
            </div>
            {/* Offline */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-xs text-[#92A2C3] font-bold mb-1">离线设备</p>
                    <p className="text-3xl font-bold text-[#2D4965]">{offline}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
                    <XCircle size={20} />
                </div>
            </div>
            {/* Fault */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-xs text-[#92A2C3] font-bold mb-1">故障告警</p>
                    <p className="text-3xl font-bold text-[#2D4965]">{fault}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <AlertTriangle size={20} />
                </div>
            </div>
        </div>

        {/* 3. Main Content Card */}
        <div className="bg-white p-0 rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
             {/* Toolbar */}
             <div className="p-4 border-b border-gray-100 flex justify-between items-center gap-4 bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3 flex-1">
                    {/* Filter Button */}
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all ${isFilterOpen ? 'bg-blue-50 border-blue-200 text-[#225AC8]' : 'border-gray-200 text-[#535E73] hover:bg-gray-50'}`}
                    >
                        <Filter size={16} /> 
                        筛选
                    </button>

                    {/* Search Bar */}
                    <div className="relative w-full max-w-xl">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="搜索设备名称/SN码..." 
                            className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-xl text-sm outline-none transition-all placeholder-gray-400 text-[#535E73]"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                </div>
             </div>

             {/* Expanded Filter Area */}
             {isFilterOpen && (
                 <div className="mb-0 p-4 bg-gray-50/50 border-b border-gray-100 animate-in slide-in-from-top-2">
                     <div className="flex items-center gap-4">
                         <span className="text-xs font-bold text-[#92A2C3] uppercase">状态筛选:</span>
                         <div className="flex gap-2">
                            {(['all', 'online', 'offline', 'fault'] as const).map(status => (
                                <button 
                                    key={status}
                                    onClick={() => setStatusFilter(status)} 
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === status ? 'bg-white text-[#225AC8] shadow-sm border border-gray-100' : 'text-[#535E73] hover:bg-gray-100'}`}
                                >
                                    {status === 'all' && '全部'}
                                    {status === 'online' && '在线'}
                                    {status === 'offline' && '离线'}
                                    {status === 'fault' && '故障'}
                                </button>
                            ))}
                         </div>
                     </div>
                 </div>
             )}

             {/* Table */}
             <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 w-12 text-center border-b border-gray-50">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer" />
                            </th>
                            <th className="px-6 py-4 border-b border-gray-50">设备信息</th>
                            <th className="px-6 py-4 border-b border-gray-50">类型/品牌</th>
                            <th className="px-6 py-4 border-b border-gray-50">所属门店/位置</th>
                            <th className="px-6 py-4 border-b border-gray-50">状态监控</th>
                            <th className="px-6 py-4 border-b border-gray-50">最后通讯</th>
                            <th className="px-6 py-4 text-right border-b border-gray-50">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredDevices.map(device => (
                            <tr key={device.id} className="hover:bg-blue-50/20 group transition-colors">
                                <td className="px-6 py-4 text-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer" />
                                </td>
                                <td className="px-6 py-4 cursor-pointer" onClick={() => handleDeviceClick(device)}>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#2D4965] text-sm group-hover:text-[#225AC8] transition-colors">{device.name}</span>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-[#92A2C3]">
                                            <Box size={12}/> 
                                            <span className="font-mono">{device.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#225AC8]">
                                            <Cpu size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#535E73] text-xs">{device.brand}</span>
                                            <span className="text-[10px] text-[#92A2C3] font-mono">{device.model}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#535E73] text-xs">{(device.storeId === 'SH001' ? '上海静安旗舰店' : device.storeId)}</span>
                                        <span className="text-[10px] text-[#92A2C3] mt-0.5">{device.location}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={device.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-[#92A2C3]">{device.lastActive}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-4">
                                        <button onClick={(e) => openControlModal(device, e)} className="flex items-center gap-1 text-[#225AC8] hover:text-[#1e4eaf] text-xs font-bold transition-colors">
                                            <Power size={14} /> 控制
                                        </button>
                                        <button onClick={(e) => openEditModal(device, e)} className="flex items-center gap-1 text-[#535E73] hover:text-[#2D4965] text-xs font-bold transition-colors">
                                            <Edit size={14} /> 编辑
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteDevice(device.id); }} className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-bold transition-colors">
                                            <Trash2 size={14} /> 删除
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>

             {/* Footer */}
             <div className="p-4 border-t border-gray-100 flex justify-end items-center gap-4 flex-shrink-0 bg-white">
                 <span className="text-xs text-[#92A2C3]">显示 1 到 {Math.min(5, filteredDevices.length)} 条，共 {filteredDevices.length} 条</span>
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
  };

  // --- Detail View Render ---
  const renderDetailView = () => {
    if (!selectedDevice) return null;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* 1. Header Navigation */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                  onClick={handleBack}
                  className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-[#535E73] transition-colors shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-[#2D4965] tracking-tight">{selectedDevice.name}</h2>
                    <StatusBadge status={selectedDevice.status} />
                  </div>
                  <p className="text-[#92A2C3] text-xs font-medium mt-1 font-mono flex items-center gap-2">
                    SN: {selectedDevice.id}
                  </p>
                </div>
            </div>
             <button 
                onClick={() => openEditModal(selectedDevice)}
                className="bg-[#225AC8] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200/50 hover:bg-[#1e4eaf]"
             >
                <Edit size={14} /> 编辑设备
             </button>
        </div>

        {/* 2. Top Status Cards Row (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Communication Status */}
             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Wifi size={24} /></div>
                <div>
                   <p className="text-[#92A2C3] text-xs font-bold uppercase mb-0.5">通信状态</p>
                   <p className="text-lg font-bold text-[#2D4965]">在线 (Heartbeat)</p>
                   <p className="text-[10px] text-green-600 flex items-center gap-1 mt-0.5"><Activity size={10} className="animate-pulse"/> 信号强度: 优</p>
                </div>
             </div>

             {/* Running Mode */}
             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Zap size={24} /></div>
                <div>
                   <p className="text-[#92A2C3] text-xs font-bold uppercase mb-0.5">运行模式</p>
                   <p className="text-lg font-bold text-[#2D4965]">制冷运行中</p>
                   <p className="text-[10px] text-blue-600 flex items-center gap-1 mt-0.5"><Clock size={10}/> 已运行: 4h 23m</p>
                </div>
             </div>

             {/* Real-time Power */}
             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex items-center gap-4">
                 <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Gauge size={24} /></div>
                 <div>
                   <p className="text-[#92A2C3] text-xs font-bold uppercase mb-0.5">实时功率</p>
                   <p className="text-lg font-bold text-[#2D4965]">{selectedDevice.powerUsage} <span className="text-xs text-[#92A2C3] font-normal">kW</span></p>
                   <p className="text-[10px] text-orange-500 flex items-center gap-1 mt-0.5"><ArrowUpRight size={10}/> 负载率: 45%</p>
                </div>
             </div>
        </div>

        {/* 3. Middle Row: Config Tabs (Left 2/3) & Control (Right 1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             {/* Left: Info & Config Tabs */}
             <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[420px]">
                 {/* Tabs Header */}
                 <div className="flex border-b border-gray-100 bg-white px-2">
                    <ConfigTabButton id="basic" label="基本信息" icon={Info} />
                    <ConfigTabButton id="config" label="通信配置" icon={LinkIcon} />
                    <ConfigTabButton id="dp" label="功能点映射" icon={Database} />
                    <ConfigTabButton id="alarm" label="告警配置" icon={BellRing} />
                    <ConfigTabButton id="faults" label="故障管理" icon={AlertOctagon} />
                 </div>

                 {/* Tab Content Area */}
                 <div className="p-6 flex-1">
                    {activeTab === 'basic' && (
                       <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                          <div>
                             <p className="text-xs text-[#92A2C3] mb-1">设备名称</p>
                             <p className="text-base font-bold text-[#2D4965]">{selectedDevice.name}</p>
                          </div>
                          <div>
                             <p className="text-xs text-[#92A2C3] mb-1">安装位置</p>
                             <p className="text-base font-bold text-[#535E73] flex items-center gap-1"><MapPin size={16} className="text-[#92A2C3]"/> {selectedDevice.location}</p>
                          </div>
                          <div>
                             <p className="text-xs text-[#92A2C3] mb-1">品牌 / 型号</p>
                             <p className="text-base font-bold text-[#2D4965]">{selectedDevice.brand} - {selectedDevice.model}</p>
                          </div>
                          <div>
                             <p className="text-xs text-[#92A2C3] mb-1">所属门店</p>
                             <p className="text-base font-bold text-[#2D4965]">{selectedDevice.storeId}</p>
                          </div>
                          <div>
                             <p className="text-xs text-[#92A2C3] mb-1">设备类型</p>
                             <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{selectedDevice.type}</span>
                          </div>
                          <div>
                             <p className="text-xs text-[#92A2C3] mb-1">入网时间</p>
                             <p className="text-base font-bold text-[#2D4965]">2023-05-12 10:00:00</p>
                          </div>
                       </div>
                    )}

                    {activeTab === 'config' && (
                       <div className="space-y-6">
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="p-3 bg-white rounded-lg shadow-sm text-[#225AC8]"><Box size={24}/></div>
                             <div>
                                <p className="text-xs text-[#92A2C3] uppercase">Gateway ID</p>
                                <p className="text-lg font-mono font-bold text-[#2D4965]">{selectedDevice.gatewayId}</p>
                             </div>
                             <div className="ml-auto text-right">
                                <p className="text-xs text-[#92A2C3] uppercase">Protocol</p>
                                <p className="text-sm font-bold text-[#535E73]">Modbus RTU over TCP</p>
                             </div>
                          </div>
                          <div className="grid grid-cols-3 gap-6">
                             <div className="p-3 border border-gray-100 rounded-lg">
                                <p className="text-xs text-[#92A2C3] mb-1">Slave Address</p>
                                <p className="font-mono font-bold text-[#2D4965] text-lg">{selectedDevice.modbusAddr}</p>
                             </div>
                             <div className="p-3 border border-gray-100 rounded-lg">
                                <p className="text-xs text-[#92A2C3] mb-1">Baud Rate</p>
                                <p className="font-mono font-bold text-[#2D4965] text-lg">9600 bps</p>
                             </div>
                             <div className="p-3 border border-gray-100 rounded-lg">
                                <p className="text-xs text-[#92A2C3] mb-1">Parity</p>
                                <p className="font-mono font-bold text-[#2D4965] text-lg">None (8N1)</p>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'dp' && (
                       <div>
                          <table className="w-full text-left text-xs">
                             <thead className="text-[#92A2C3] border-b border-gray-100 bg-gray-50">
                                <tr>
                                   <th className="py-2 px-3 rounded-tl-lg">ID</th>
                                   <th className="py-2 px-3">功能点名称 (DP Name)</th>
                                   <th className="py-2 px-3">数据类型</th>
                                   <th className="py-2 px-3">读写</th>
                                   <th className="py-2 px-3 rounded-tr-lg">Modbus 寄存器</th>
                                </tr>
                             </thead>
                             <tbody className="text-[#535E73]">
                                {MOCK_DP_MAPPING.map((dp) => (
                                   <tr key={dp.id} className="border-b border-gray-50 hover:bg-blue-50/20">
                                      <td className="py-3 px-3 font-mono">{dp.id}</td>
                                      <td className="py-3 px-3 font-medium">
                                         {dp.name}
                                         <p className="text-[10px] text-[#92A2C3] font-normal">{dp.desc}</p>
                                      </td>
                                      <td className="py-3 px-3 bg-gray-50/50">{dp.type}</td>
                                      <td className="py-3 px-3">
                                         <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${dp.rw === 'RW' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {dp.rw}
                                         </span>
                                      </td>
                                      <td className="py-3 px-3 font-mono text-[#225AC8]">{dp.register}</td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    )}

                    {activeTab === 'alarm' && (
                       <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-4">
                                <h4 className="text-xs font-bold text-[#535E73] flex items-center gap-2"><Sliders size={12}/> 阈值配置</h4>
                                <div>
                                   <label className="text-xs text-[#92A2C3] block mb-1">过压报警阈值 (V)</label>
                                   <div className="flex items-center gap-2">
                                      <input type="number" defaultValue={250} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-200" />
                                      <span className="text-xs text-[#535E73]">Max</span>
                                   </div>
                                </div>
                                <div>
                                   <label className="text-xs text-[#92A2C3] block mb-1">过流报警阈值 (A)</label>
                                   <div className="flex items-center gap-2">
                                      <input type="number" defaultValue={16} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-200" />
                                      <span className="text-xs text-[#535E73]">Max</span>
                                   </div>
                                </div>
                             </div>
                             <div className="space-y-4">
                                <h4 className="text-xs font-bold text-[#535E73] flex items-center gap-2"><BellRing size={12}/> 通知方式</h4>
                                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                   <span className="text-xs font-medium text-[#535E73] flex items-center gap-2"><Smartphone size={14}/> APP 推送</span>
                                   <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer bg-green-500">
                                      <span className="absolute left-4 top-0.5 bg-white w-3 h-3 rounded-full transition-all"></span>
                                   </div>
                                </div>
                                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                   <span className="text-xs font-medium text-[#535E73] flex items-center gap-2"><Mail size={14}/> 邮件通知</span>
                                   <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer bg-gray-200">
                                      <span className="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-all"></span>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="flex justify-end pt-4 border-t border-gray-50">
                             <button className="px-4 py-2 bg-[#225AC8] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">保存告警配置</button>
                          </div>
                       </div>
                    )}
                    
                    {activeTab === 'faults' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold text-[#535E73] flex items-center gap-2"><ClipboardList size={12}/> 历史故障记录</h4>
                                <span className="text-[10px] text-gray-400">最近 30 天</span>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 text-[#92A2C3] font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-3">时间</th>
                                            <th className="px-4 py-3">故障类型</th>
                                            <th className="px-4 py-3">详细信息</th>
                                            <th className="px-4 py-3">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {MOCK_DEVICE_FAULTS.map(fault => (
                                            <tr key={fault.id} className="hover:bg-red-50/20">
                                                <td className="px-4 py-3 text-[#535E73] font-mono">{fault.time}</td>
                                                <td className="px-4 py-3 font-bold text-[#2D4965]">{fault.type}</td>
                                                <td className="px-4 py-3 text-[#535E73]">{fault.message}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        fault.status === 'Active' ? 'bg-red-50 text-red-500 border border-red-100 animate-pulse' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {fault.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                 </div>
             </div>

             {/* Right: Remote Control Panel */}
             <div className="xl:col-span-1 h-full min-h-[420px]">
                 <DeviceControlPanel device={selectedDevice} variant="card" />
             </div>
        </div>

        {/* 4. Bottom Row: Charts (Left 2/3) & Logs (Right 1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             {/* Charts */}
             <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[350px]">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2">
                       <History size={18} className="text-[#225AC8]" /> 
                       历史运行数据 (可视化)
                    </h3>
                    <div className="flex gap-2">
                       <button className="px-3 py-1 text-xs font-bold bg-blue-50 text-[#225AC8] rounded-lg">功率趋势</button>
                       <button className="px-3 py-1 text-xs font-medium text-[#92A2C3] hover:bg-gray-50 rounded-lg">每日能耗</button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Area Chart */}
                    <div className="lg:col-span-2 h-[240px]">
                        <p className="text-xs font-bold text-[#92A2C3] mb-2 text-center">24小时功率波动曲线 (kW)</p>
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={MOCK_HISTORY_DATA}>
                             <defs>
                               <linearGradient id="colorPowerBig" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#225AC8" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#225AC8" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="time" tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} interval={3} />
                             <YAxis tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                             <Area type="monotone" dataKey="value" stroke="#225AC8" strokeWidth={3} fill="url(#colorPowerBig)" activeDot={{r: 6}} />
                           </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Side Bar Chart */}
                    <div className="h-[240px] border-l border-gray-50 pl-6 hidden lg:block">
                        <p className="text-xs font-bold text-[#92A2C3] mb-2 text-center">近7日能耗 (kWh)</p>
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={MOCK_DAILY_DATA} layout="vertical" barSize={12}>
                             <XAxis type="number" hide />
                             <YAxis dataKey="day" type="category" tick={{fill: '#535E73', fontSize: 10}} axisLine={false} tickLine={false} width={30} />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                             <Bar dataKey="value" fill="#94A3B8" radius={[0, 4, 4, 0]} background={{ fill: '#F1F5F9', radius: 4 }} />
                           </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
             </div>

             {/* Logs */}
             <div className="xl:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2">
                        <History size={16} /> 状态变化与操作日志
                     </h3>
                     <button className="text-[#92A2C3] hover:text-[#225AC8]"><ArrowUpRight size={14}/></button>
                 </div>
                 <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {MOCK_LOGS.map((log) => (
                       <div key={log.id} className="flex gap-3 relative pb-4 border-l border-gray-100 last:pb-0 last:border-0 pl-4 group hover:bg-gray-50/50 rounded-r-lg transition-colors p-1">
                          <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-white ${
                             log.type === 'info' ? 'bg-blue-400' : 
                             log.type === 'success' ? 'bg-green-400' : 'bg-orange-400'
                          }`}></div>
                          <div>
                             <p className="text-xs font-bold text-[#535E73] group-hover:text-[#225AC8] transition-colors">{log.event}</p>
                             <div className="flex gap-2 text-[10px] text-[#92A2C3] mt-1">
                                <span>{log.time.split(' ')[1]}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 bg-gray-100 px-1.5 rounded text-gray-500"><Terminal size={8}/> {log.operator}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <button className="w-full mt-4 py-2 text-xs text-[#225AC8] font-bold border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                    查看完整日志
                 </button>
             </div>
        </div>
      </div>
    );
  };

  return (
    <>
       <DeviceModal 
         isOpen={isAddModalOpen} 
         onClose={() => setIsAddModalOpen(false)} 
         onSubmit={handleAddDevice}
         mode="add"
       />
       <DeviceModal 
         isOpen={isEditModalOpen} 
         onClose={() => setIsEditModalOpen(false)} 
         onSubmit={handleUpdateDevice}
         initialData={editingDevice}
         mode="edit"
       />
       <ControlModal 
         isOpen={isControlModalOpen}
         onClose={() => setIsControlModalOpen(false)}
         device={editingDevice}
       />
       {view === 'list' ? renderListView() : renderDetailView()}
    </>
  );
};

export default DeviceManager;
