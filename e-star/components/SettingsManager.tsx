
import React, { useState } from 'react';
import { 
  Settings, UserCog, Activity, ShieldAlert, Save, RotateCcw, 
  Globe, Zap, Bell, Database, Edit, Trash2, KeyRound, 
  Search, Filter, Download, Monitor, HardDrive, Cpu, 
  CheckCircle2, XCircle, Plus, Eye, Lock, FileText,
  AlertTriangle, User, ChevronRight, Layout, Terminal, Server,
  Mail, Smartphone, MessageSquare, Network, ShieldCheck, Shield, Laptop, RefreshCw, X,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { SystemConfig, User as UserType, Role, AuditLog, LoginLog, PageView } from '../types';

// --- Mock Data ---

const MOCK_CONFIG: SystemConfig = {
  basic: {
    systemName: '云控智联能源管理系统',
    description: '企业级分布式能源监控与管理平台',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
  },
  energy: {
    peakPrice: 1.25,
    valleyPrice: 0.45,
    billingCycle: 'monthly',
    precision: '2',
    unit: 'kWh',
  },
  alarm: {
    powerThreshold: 800,
    energyThreshold: 5000,
    faultFrequency: 5,
    notifications: ['email'],
    recipients: 'admin@example.com; monitor@example.com',
  },
  retention: {
    rawDataDays: 180,
    statsDataDays: 1095,
    logDays: 365,
    archivePolicy: 'auto',
  },
};

const MOCK_USERS: UserType[] = [
  { id: 'U1', username: 'admin', role: 'Super Admin', roleId: 'R1', status: 'active', lastLogin: '2023-11-01 09:30', email: 'admin@ecomanage.com' },
  { id: 'U2', username: 'manager_sh', role: 'Store Manager', roleId: 'R2', status: 'active', lastLogin: '2023-11-01 10:15', email: 'zhang@sh.store' },
  { id: 'U3', username: 'operator_bj', role: 'Operator', roleId: 'R3', status: 'inactive', lastLogin: '2023-10-25 14:20', email: 'li@bj.store' },
];

const MOCK_ROLES: Role[] = [
  { id: 'R1', name: 'Super Admin', description: '系统超级管理员，拥有所有权限', permissions: ['ALL'], dataScope: 'ALL', isDefault: true, userCount: 1 },
  { id: 'R2', name: 'Store Manager', description: '门店经理，管理特定区域设备与策略', permissions: ['sys:device:read', 'sys:device:write', 'sys:strategy:read', 'sys:strategy:write'], dataScope: 'STORE', isDefault: true, userCount: 1 },
  { id: 'R3', name: 'Operator', description: '普通操作员，仅查看数据与处理告警', permissions: ['sys:device:read', 'sys:alarm:handle'], dataScope: 'AREA', isDefault: true, userCount: 1 },
];

const MOCK_LOGIN_LOGS: LoginLog[] = Array.from({ length: 12 }, (_, i) => ({
  id: `LOG-${i}`,
  userId: i % 3 === 0 ? 'U1' : i % 3 === 1 ? 'U2' : 'U3',
  username: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'manager_sh' : 'operator_bj',
  time: `2023-11-01 ${String(10 + i).padStart(2, '0')}:30:00`,
  ip: `192.168.1.${100 + i}`,
  device: i % 2 === 0 ? 'Chrome / Windows 10' : 'Safari / macOS',
  status: i === 5 ? 'failure' : 'success',
  reason: i === 5 ? '密码错误' : undefined
}));

const MOCK_LOGS: AuditLog[] = Array.from({ length: 15 }, (_, i) => ({
  id: `LOG-${1000 + i}`,
  time: `2023-11-01 ${String(10 + i % 8).padStart(2, '0')}:${String(i * 4).padStart(2, '0')}:00`,
  user: i % 3 === 0 ? 'admin' : 'manager_sh',
  actionType: i % 4 === 0 ? 'CONFIG_CHANGE' : i % 4 === 1 ? 'USER_UPDATE' : 'AUTH_LOGIN',
  content: i % 4 === 0 ? '修改了电价参数配置' : '登录系统',
  result: i % 10 === 0 ? 'failure' : 'success',
  ip: `192.168.1.${100 + i}`,
}));

const RESOURCE_TREND_DATA = [
  { time: '10:00', cpu: 28, memory: 48, network: 55 },
  { time: '10:01', cpu: 38, memory: 47, network: 58 },
  { time: '10:02', cpu: 45, memory: 48, network: 57 },
  { time: '10:03', cpu: 46, memory: 50, network: 50 },
  { time: '10:04', cpu: 32, memory: 51, network: 40 },
  { time: '10:05', cpu: 25, memory: 51, network: 28 },
  { time: '10:06', cpu: 38, memory: 52, network: 42 },
  { time: '10:07', cpu: 42, memory: 53, network: 45 },
  { time: '10:08', cpu: 25, memory: 48, network: 58 },
  { time: '10:09', cpu: 28, memory: 52, network: 45 },
  { time: '10:10', cpu: 30, memory: 52, network: 35 },
  { time: '10:11', cpu: 28, memory: 48, network: 22 },
  { time: '10:12', cpu: 35, memory: 45, network: 18 },
  { time: '10:13', cpu: 48, memory: 49, network: 30 },
  { time: '10:14', cpu: 35, memory: 55, network: 42 },
  { time: '10:15', cpu: 28, memory: 48, network: 58 },
  { time: '10:16', cpu: 45, memory: 49, network: 52 },
  { time: '10:17', cpu: 38, memory: 50, network: 45 },
  { time: '10:18', cpu: 42, memory: 51, network: 28 },
  { time: '10:19', cpu: 35, memory: 52, network: 22 },
];

const PERMISSION_TREE = [
  { category: '设备管理', codes: [
      { code: 'sys:device:read', label: '查看设备' },
      { code: 'sys:device:write', label: '编辑设备' },
      { code: 'sys:device:delete', label: '删除设备' },
      { code: 'sys:device:control', label: '远程控制' }
  ]},
  { category: '策略管理', codes: [
      { code: 'sys:strategy:read', label: '查看策略' },
      { code: 'sys:strategy:write', label: '管理策略' },
  ]},
  { category: '统计报表', codes: [
      { code: 'sys:stats:read', label: '查看报表' },
      { code: 'sys:stats:export', label: '导出数据' },
  ]},
  { category: '系统管理', codes: [
      { code: 'sys:user:manage', label: '用户管理' },
      { code: 'sys:role:manage', label: '角色管理' },
      { code: 'sys:settings:manage', label: '系统设置' },
  ]},
];

// --- Sub-components ---

interface SectionCardProps {
  title: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  headerColor?: string;
}

const SectionCard = ({ title, icon: Icon, children, className = '', headerColor = 'text-[#225AC8]' }: SectionCardProps) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col ${className}`}>
    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-white">
      <Icon size={18} className={headerColor} />
      <h3 className={`font-bold text-sm ${headerColor}`}>{title}</h3>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      {children}
    </div>
  </div>
);

// --- Modals ---

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<UserType> & { password?: string }) => void;
  roles: Role[];
  initialData?: UserType | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, roles, initialData }) => {
  const [formData, setFormData] = useState<any>({
    username: '', email: '', roleId: '', status: 'active', password: ''
  });
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData, password: '' });
      } else {
        setFormData({ username: '', email: '', roleId: roles[0]?.id || '', status: 'active', password: '' });
      }
      setError('');
    }
  }, [isOpen, initialData, roles]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validation
    if (!formData.username || !/^[a-zA-Z0-9_]{3,50}$/.test(formData.username)) {
      setError('用户名必填，3-50字符，仅限字母数字下划线');
      return;
    }
    if (!initialData && (!formData.password || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/.test(formData.password))) {
      setError('密码必填，8-32字符，必须包含字母和数字');
      return;
    }
    
    // Role Name resolution
    const selectedRole = roles.find(r => r.id === formData.roleId);
    onSubmit({
      ...formData,
      role: selectedRole?.name || 'Unknown'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-[#2D4965]">{initialData ? '编辑用户' : '添加新用户'}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}
          
          <div>
            <label className="block text-xs font-bold text-[#535E73] mb-1.5">用户名 <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" 
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})}
              disabled={!!initialData}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#535E73] mb-1.5">邮箱地址</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          {!initialData && (
            <div>
              <label className="block text-xs font-bold text-[#535E73] mb-1.5">初始密码 <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="8-32位，包含字母和数字"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-[#535E73] mb-1.5">角色分配</label>
                <select 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  value={formData.roleId} 
                  onChange={e => setFormData({...formData, roleId: e.target.value})}
                >
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-[#535E73] mb-1.5">账号状态</label>
                <select 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">启用 (Active)</option>
                  <option value="inactive">禁用 (Inactive)</option>
                </select>
             </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">取消</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg">保存</button>
        </div>
      </div>
    </div>
  );
};

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  username: string;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose, onSubmit, username }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!password || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/.test(password)) {
      setError('密码必须包含字母和数字，长度8-32位');
      return;
    }
    onSubmit(password);
    setPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-[#2D4965]">重置密码: {username}</h3>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="p-2 bg-red-50 text-red-500 text-xs rounded">{error}</div>}
          <input 
            type="password" 
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
            placeholder="输入新密码..." 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <p className="text-[10px] text-[#92A2C3]">要求：长度 8-32 字符，必须包含字母和数字。</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">取消</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg">确认重置</button>
        </div>
      </div>
    </div>
  );
};

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: Partial<Role>) => void;
  initialData?: Role | null;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Role>>({ name: '', description: '', permissions: [], dataScope: 'SELF' });
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? {...initialData} : { name: '', description: '', permissions: [], dataScope: 'SELF' });
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const togglePermission = (code: string) => {
    setFormData(prev => {
      const perms = prev.permissions || [];
      if (perms.includes(code)) return { ...prev, permissions: perms.filter(p => p !== code) };
      return { ...prev, permissions: [...perms, code] };
    });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      setError('角色名称不能为空');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-[#2D4965]">{initialData ? '编辑角色' : '创建新角色'}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {error && <div className="p-2 bg-red-50 text-red-500 text-xs rounded">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-[#535E73] mb-1.5">角色名称 <span className="text-red-500">*</span></label>
               <input 
                 type="text" 
                 className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" 
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-[#535E73] mb-1.5">角色描述</label>
               <input 
                 type="text" 
                 className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" 
                 value={formData.description}
                 onChange={e => setFormData({...formData, description: e.target.value})}
               />
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-[#535E73] mb-1.5 flex items-center gap-2"><Database size={14} className="text-[#225AC8]"/> 数据权限范围</label>
             <select 
               className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
               value={formData.dataScope}
               onChange={e => setFormData({...formData, dataScope: e.target.value as any})}
             >
                <option value="ALL">全部数据权限 (All Data)</option>
                <option value="STORE">所在门店数据 (Store Only)</option>
                <option value="AREA">所在区域数据 (Area Only)</option>
                <option value="SELF">仅本人数据 (Self Only)</option>
             </select>
             <p className="text-[10px] text-[#92A2C3] mt-1">控制该角色用户可访问的业务数据范围</p>
          </div>
          
          <div>
             <label className="block text-xs font-bold text-[#535E73] mb-3 flex items-center gap-2"><ShieldCheck size={14} className="text-[#225AC8]"/> 功能权限配置</label>
             <div className="space-y-4">
                {PERMISSION_TREE.map(cat => (
                   <div key={cat.category} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-[#2D4965] mb-2">{cat.category}</p>
                      <div className="grid grid-cols-3 gap-2">
                         {cat.codes.map(perm => (
                            <label key={perm.code} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded transition-colors">
                               <input 
                                 type="checkbox" 
                                 className="rounded text-blue-600 focus:ring-0" 
                                 checked={formData.permissions?.includes(perm.code)}
                                 onChange={() => togglePermission(perm.code)}
                               />
                               <span className="text-xs text-[#535E73]">{perm.label}</span>
                            </label>
                         ))}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">取消</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-bold text-white bg-[#225AC8] hover:bg-[#1e4eaf] rounded-lg">保存配置</button>
        </div>
      </div>
    </div>
  );
};

const PermissionPreviewModal: React.FC<{ isOpen: boolean; onClose: () => void; user: UserType | null; roles: Role[] }> = ({ isOpen, onClose, user, roles }) => {
  if (!isOpen || !user) return null;
  const userRole = roles.find(r => r.id === user.roleId);
  const permissions = userRole?.permissions || [];
  const dataScope = userRole?.dataScope || 'SELF';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-[#2D4965] flex items-center gap-2"><Shield size={16}/> 权限预览: {user.username}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
        </div>
        <div className="p-6 space-y-4">
           <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#225AC8] flex items-center justify-center font-bold">{user.username.charAt(0).toUpperCase()}</div>
              <div>
                 <p className="text-sm font-bold text-[#2D4965]">{user.role}</p>
                 <p className="text-xs text-[#92A2C3] mt-0.5">Data Scope: <span className="font-mono text-[#225AC8] bg-blue-50 px-1 rounded">{dataScope}</span></p>
              </div>
           </div>
           
           <div>
              <p className="text-xs font-bold text-[#535E73] mb-2">已授权功能点 ({permissions.length})</p>
              <div className="max-h-60 overflow-y-auto custom-scrollbar border border-gray-100 rounded-lg p-2 bg-gray-50/50">
                 {permissions.includes('ALL') ? (
                    <div className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={12}/> 超级管理员 - 所有权限</div>
                 ) : (
                    <div className="grid grid-cols-2 gap-2">
                       {permissions.map(p => (
                          <div key={p} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-[#535E73] font-mono truncate" title={p}>
                             {p}
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const LoginLogsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-[#2D4965] flex items-center gap-2"><User size={18}/> 登录日志</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar p-0">
           <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold uppercase sticky top-0 border-b border-gray-100">
                 <tr>
                    <th className="px-6 py-3">时间</th>
                    <th className="px-4 py-3">用户</th>
                    <th className="px-4 py-3">IP 地址</th>
                    <th className="px-4 py-3">设备信息</th>
                    <th className="px-4 py-3">状态</th>
                    <th className="px-4 py-3">备注</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {MOCK_LOGIN_LOGS.map(log => (
                    <tr key={log.id} className="hover:bg-blue-50/20">
                       <td className="px-6 py-3 font-mono text-[#535E73] text-xs">{log.time}</td>
                       <td className="px-4 py-3 font-bold text-[#2D4965] text-xs">{log.username}</td>
                       <td className="px-4 py-3 font-mono text-[#535E73] text-xs">{log.ip}</td>
                       <td className="px-4 py-3 text-[#535E73] text-xs flex items-center gap-1">
                          <Laptop size={12} className="text-[#92A2C3]"/> {log.device}
                       </td>
                       <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                             {log.status === 'success' ? '成功' : '失败'}
                          </span>
                       </td>
                       <td className="px-4 py-3 text-xs text-red-400">{log.reason}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

interface SettingsManagerProps {
  view: PageView;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ view }) => {
  const [config, setConfig] = useState<SystemConfig>(MOCK_CONFIG);
  const [users, setUsers] = useState<UserType[]>(MOCK_USERS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [logFilter, setLogFilter] = useState('');

  // Modal States for User Permissions Tab
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isPwdResetModalOpen, setIsPwdResetModalOpen] = useState(false);
  const [pwdResetUser, setPwdResetUser] = useState<UserType | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isLoginLogOpen, setIsLoginLogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState<UserType | null>(null);

  // Handlers
  const handleConfigChange = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNotificationToggle = (type: string) => {
    const current = config.alarm.notifications;
    const updated = current.includes(type) 
      ? current.filter(t => t !== type) 
      : [...current, type];
    handleConfigChange('alarm', 'notifications', updated);
  };

  const handleSaveConfig = () => {
    alert('系统配置已保存生效！');
  };

  // User Management Handlers
  const handleSaveUser = (userData: Partial<UserType> & { password?: string }) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } as UserType : u));
    } else {
      const newUser = {
        ...userData,
        id: `U${Date.now()}`,
        lastLogin: '从未登录',
      } as UserType;
      setUsers(prev => [newUser, ...prev]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    // Current user check (Mock ID 'U1' as admin)
    if (id === 'U1') {
      alert('无法删除当前登录用户！');
      return;
    }
    if (confirm('确定删除该用户吗？删除后不可恢复。')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleResetPassword = (newPassword: string) => {
    // In real app, call API
    alert(`用户 ${pwdResetUser?.username} 密码已重置！`);
    setIsPwdResetModalOpen(false);
    setPwdResetUser(null);
  };

  // Role Management Handlers
  const handleSaveRole = (roleData: Partial<Role>) => {
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === roleData.id ? { ...r, ...roleData } as Role : r));
    } else {
      const newRole = {
        ...roleData,
        id: `R${Date.now()}`,
        isDefault: false,
        userCount: 0
      } as Role;
      setRoles(prev => [...prev, newRole]);
    }
    setIsRoleModalOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isDefault) {
      alert('系统默认角色无法删除！');
      return;
    }
    if (role?.userCount && role.userCount > 0) {
      alert('该角色下尚有用户，无法删除！');
      return;
    }
    if (confirm('确定删除该角色吗？')) {
      setRoles(prev => prev.filter(r => r.id !== id));
    }
  };

  const openPreview = (user: UserType) => {
    setPreviewUser(user);
    setIsPreviewOpen(true);
  };

  // --- Views ---

  const renderConfigTab = () => (
    <div className="p-2 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-end gap-2 mb-2">
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#535E73] font-bold rounded-xl hover:bg-gray-50 transition-all text-xs shadow-sm">
             <RotateCcw size={14} /> 重置更改
         </button>
         <button onClick={handleSaveConfig} className="flex items-center gap-2 px-6 py-2 bg-[#225AC8] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#1e4eaf] transition-all text-xs">
             <Save size={14} /> 保存配置
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Card 1: System Basic Info */}
        <SectionCard title="系统基本信息" icon={Server} headerColor="text-[#2D4965]">
           <div className="flex gap-6 items-start mb-6">
              <div className="flex-shrink-0 flex flex-col gap-2">
                 <p className="text-xs font-bold text-[#535E73]">系统 Logo</p>
                 <div className="w-24 h-24 bg-[#27509F] rounded-lg flex items-center justify-center text-white text-4xl font-bold shadow-md">
                    E
                 </div>
              </div>
              <div className="flex-1 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-[#535E73] mb-1.5">系统名称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all"
                      value={config.basic.systemName}
                      onChange={e => handleConfigChange('basic', 'systemName', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-[#535E73] mb-1.5">系统描述</label>
                    <textarea 
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all resize-none h-20"
                      value={config.basic.description}
                      onChange={e => handleConfigChange('basic', 'description', e.target.value)}
                    />
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">时区</label>
                 <div className="relative">
                   <select 
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      value={config.basic.timezone}
                      onChange={e => handleConfigChange('basic', 'timezone', e.target.value)}
                   >
                      <option value="Asia/Shanghai">Asia/Shanghai</option>
                      <option value="UTC">UTC</option>
                   </select>
                   <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"/>
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">语言</label>
                 <div className="relative">
                   <select 
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      value={config.basic.language}
                      onChange={e => handleConfigChange('basic', 'language', e.target.value)}
                   >
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                   </select>
                   <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"/>
                 </div>
              </div>
           </div>
        </SectionCard>

        {/* Card 2: Energy Calculation */}
        <SectionCard title="能耗计算参数" icon={Activity} headerColor="text-green-600">
           <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">峰时电价 (元/kWh) <span className="text-red-500">*</span></label>
                 <input 
                    type="number" step="0.01"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 transition-all"
                    value={config.energy.peakPrice}
                    onChange={e => handleConfigChange('energy', 'peakPrice', parseFloat(e.target.value))}
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">谷时电价 (元/kWh) <span className="text-red-500">*</span></label>
                 <input 
                    type="number" step="0.01"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 transition-all"
                    value={config.energy.valleyPrice}
                    onChange={e => handleConfigChange('energy', 'valleyPrice', parseFloat(e.target.value))}
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">计算周期</label>
                 <div className="relative">
                    <select 
                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 transition-all appearance-none cursor-pointer"
                       value={config.energy.billingCycle}
                       onChange={e => handleConfigChange('energy', 'billingCycle', e.target.value)}
                    >
                       <option value="monthly">按月 (Monthly)</option>
                       <option value="daily">按日 (Daily)</option>
                    </select>
                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"/>
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">计算精度 (小数位)</label>
                 <div className="relative">
                    <select 
                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 transition-all appearance-none cursor-pointer"
                       value={config.energy.precision}
                       onChange={e => handleConfigChange('energy', 'precision', e.target.value)}
                    >
                       <option value="0">整数</option>
                       <option value="1">1位小数</option>
                       <option value="2">2位小数</option>
                       <option value="3">3位小数</option>
                    </select>
                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"/>
                 </div>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-[#535E73] mb-2.5">能耗单位</label>
              <div className="flex gap-6 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="unit" 
                      checked={config.energy.unit === 'kWh'} 
                      onChange={() => handleConfigChange('energy', 'unit', 'kWh')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-[#535E73]">千瓦时 (kWh)</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="unit" 
                      checked={config.energy.unit === 'MWh'} 
                      onChange={() => handleConfigChange('energy', 'unit', 'MWh')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-[#535E73]">兆瓦时 (MWh)</span>
                 </label>
              </div>
           </div>
        </SectionCard>

        {/* Card 3: Alarm Configuration */}
        <SectionCard title="告警阈值配置" icon={AlertTriangle} headerColor="text-orange-500">
           <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">功率阈值 (kW)</label>
                 <input 
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500 transition-all"
                    value={config.alarm.powerThreshold}
                    onChange={e => handleConfigChange('alarm', 'powerThreshold', parseFloat(e.target.value))}
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">能耗阈值 (kWh)</label>
                 <input 
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500 transition-all"
                    value={config.alarm.energyThreshold}
                    onChange={e => handleConfigChange('alarm', 'energyThreshold', parseFloat(e.target.value))}
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">故障频次 (/天)</label>
                 <input 
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500 transition-all"
                    value={config.alarm.faultFrequency}
                    onChange={e => handleConfigChange('alarm', 'faultFrequency', parseFloat(e.target.value))}
                 />
              </div>
           </div>

           <div className="mb-6">
              <label className="block text-xs font-bold text-[#535E73] mb-2.5">通知方式</label>
              <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleNotificationToggle('email')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${config.alarm.notifications.includes('email') ? 'bg-blue-50 border-blue-200 text-[#225AC8]' : 'bg-white border-gray-200 text-[#92A2C3] hover:border-blue-100 hover:text-[#535E73]'}`}
                  >
                     <Mail size={20} className="mb-1"/>
                     <span className="text-xs font-bold">邮件通知</span>
                  </button>
                  <button 
                    onClick={() => handleNotificationToggle('sms')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${config.alarm.notifications.includes('sms') ? 'bg-blue-50 border-blue-200 text-[#225AC8]' : 'bg-white border-gray-200 text-[#92A2C3] hover:border-blue-100 hover:text-[#535E73]'}`}
                  >
                     <Smartphone size={20} className="mb-1"/>
                     <span className="text-xs font-bold">短信推送</span>
                  </button>
                  <button 
                    onClick={() => handleNotificationToggle('site')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${config.alarm.notifications.includes('site') ? 'bg-blue-50 border-blue-200 text-[#225AC8]' : 'bg-white border-gray-200 text-[#92A2C3] hover:border-blue-100 hover:text-[#535E73]'}`}
                  >
                     <MessageSquare size={20} className="mb-1"/>
                     <span className="text-xs font-bold">站内消息</span>
                  </button>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-[#535E73] mb-1.5">通知接收人</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500 transition-all"
                value={config.alarm.recipients}
                onChange={e => handleConfigChange('alarm', 'recipients', e.target.value)}
              />
           </div>
        </SectionCard>

        {/* Card 4: Retention Policy */}
        <SectionCard title="数据保留策略" icon={Database} headerColor="text-purple-600">
           <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">原始数据 (天)</label>
                 <input 
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500 transition-all text-center"
                    value={config.retention.rawDataDays}
                    onChange={e => handleConfigChange('retention', 'rawDataDays', parseInt(e.target.value))}
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">统计数据 (天)</label>
                 <input 
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500 transition-all text-center"
                    value={config.retention.statsDataDays}
                    onChange={e => handleConfigChange('retention', 'statsDataDays', parseInt(e.target.value))}
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#535E73] mb-1.5">日志保留 (天)</label>
                 <input 
                    type="number"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500 transition-all text-center"
                    value={config.retention.logDays}
                    onChange={e => handleConfigChange('retention', 'logDays', parseInt(e.target.value))}
                 />
              </div>
           </div>

           <div className="mb-6">
              <label className="block text-xs font-bold text-[#535E73] mb-2.5">归档策略</label>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-6">
                 <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="archive" 
                      checked={config.retention.archivePolicy === 'auto'} 
                      onChange={() => handleConfigChange('retention', 'archivePolicy', 'auto')}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                       <span className="text-sm font-bold text-[#535E73] block">自动归档</span>
                       <span className="text-[10px] text-[#92A2C3]">过期数据自动迁移至冷存储</span>
                    </div>
                 </label>
                 <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="archive" 
                      checked={config.retention.archivePolicy === 'manual'} 
                      onChange={() => handleConfigChange('retention', 'archivePolicy', 'manual')}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                       <span className="text-sm font-bold text-[#535E73] block">手动处理</span>
                       <span className="text-[10px] text-[#92A2C3]">需管理员确认后清理或导出</span>
                    </div>
                 </label>
              </div>
           </div>

           <div className="mt-auto bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-2">
              <Monitor size={16} className="text-[#225AC8] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#535E73] leading-relaxed">
                 <span className="font-bold text-[#225AC8]">提示：</span>
                 调整保留策略可能会影响历史数据查询。对于 "原始数据" 建议保留不超过 180 天以保证系统性能，"统计数据" 可长期保存。
              </p>
           </div>
        </SectionCard>

      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full animate-in fade-in slide-in-from-right-4 duration-300">
       
       {/* User Management (Left 2/3) */}
       <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
             <div>
                <h3 className="font-bold text-[#2D4965] flex items-center gap-2"><UserCog size={18} className="text-[#225AC8]"/> 用户列表</h3>
                <p className="text-[10px] text-[#92A2C3]">管理系统用户及其访问权限</p>
             </div>
             <button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="text-xs font-bold bg-[#225AC8] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#1e4eaf] shadow-md shadow-blue-200 transition-all">
                <Plus size={14}/> 添加用户
             </button>
          </div>
          
          {/* Filters (Optional enhancement, currently static) */}
          <div className="px-6 py-3 border-b border-gray-50 bg-white flex gap-3">
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="搜索用户..." className="pl-9 pr-4 py-1.5 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 w-48" />
             </div>
             <select className="px-3 py-1.5 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs outline-none text-[#535E73]">
                <option value="">全部角色</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
             </select>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
             <table className="w-full text-left text-sm">
               <thead className="bg-[#F8FAFC] text-[#92A2C3] font-bold text-xs uppercase border-b border-gray-50 sticky top-0">
                 <tr>
                   <th className="px-6 py-3">用户信息</th>
                   <th className="px-4 py-3">角色</th>
                   <th className="px-4 py-3">状态</th>
                   <th className="px-4 py-3">最后登录</th>
                   <th className="px-6 py-3 text-right">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {users.map(u => (
                   <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-100 text-[#225AC8] flex items-center justify-center font-bold text-xs">
                              {u.username.substring(0, 2).toUpperCase()}
                           </div>
                           <div>
                              <div className="font-bold text-[#2D4965] text-xs">{u.username}</div>
                              <div className="text-[10px] text-[#92A2C3]">{u.email}</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-4">
                        <span className="bg-gray-100 text-[#535E73] px-2 py-0.5 rounded text-[10px] font-bold border border-gray-200">{u.role}</span>
                     </td>
                     <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${u.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                           {u.status === 'active' ? <CheckCircle2 size={10}/> : <XCircle size={10}/>}
                           {u.status === 'active' ? '启用' : '禁用'}
                        </span>
                     </td>
                     <td className="px-4 py-4 text-[10px] text-[#535E73] font-mono">{u.lastLogin}</td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => openPreview(u)} className="p-1.5 text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors" title="权限预览"><Shield size={14}/></button>
                           <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="编辑"><Edit size={14}/></button>
                           <button onClick={() => { setPwdResetUser(u); setIsPwdResetModalOpen(true); }} className="p-1.5 text-orange-500 bg-orange-50 rounded hover:bg-orange-100 transition-colors" title="重置密码"><KeyRound size={14}/></button>
                           <button onClick={() => handleDeleteUser(u.id)} className={`p-1.5 rounded transition-colors ${u.id === 'U1' ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 bg-red-50 hover:bg-red-100'}`} disabled={u.id === 'U1'} title="删除"><Trash2 size={14}/></button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
       </div>

       {/* Right Column: Roles & Logs (1/3) */}
       <div className="flex flex-col gap-6 h-full min-h-0">
          
          {/* Roles List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden flex-1 min-h-0">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div>
                    <h3 className="font-bold text-[#2D4965] flex items-center gap-2"><ShieldAlert size={18} className="text-[#225AC8]"/> 角色权限</h3>
                    <p className="text-[10px] text-[#92A2C3]">配置角色与功能访问控制</p>
                </div>
                <button onClick={() => { setEditingRole(null); setIsRoleModalOpen(true); }} className="text-[10px] font-bold text-[#225AC8] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors">+ 新建角色</button>
              </div>
              <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar">
                {roles.map(role => (
                    <div key={role.id} className="border border-gray-200 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition-all bg-white group">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <h4 className="font-bold text-[#2D4965] text-xs">{role.name}</h4>
                             {role.isDefault && <span className="bg-gray-100 text-gray-500 text-[9px] px-1 rounded">System</span>}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => { setEditingRole(role); setIsRoleModalOpen(true); }} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={12}/></button>
                             {!role.isDefault && <button onClick={() => handleDeleteRole(role.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={12}/></button>}
                          </div>
                      </div>
                      <p className="text-[10px] text-[#92A2C3] mb-2 leading-relaxed line-clamp-2">{role.description}</p>
                      <div className="flex justify-between items-center border-t border-gray-50 pt-2">
                          <span className="text-[10px] text-[#535E73] font-bold flex items-center gap-1"><User size={10}/> {role.userCount} Users</span>
                          <span className="text-[9px] bg-blue-50 text-[#225AC8] px-1.5 py-0.5 rounded font-mono">{role.permissions.includes('ALL') ? 'ALL ACCESS' : `${role.permissions.length} perms`}</span>
                      </div>
                    </div>
                ))}
              </div>
          </div>
          
          {/* Quick Action: Login Logs */}
          <div className="bg-gradient-to-br from-[#27509F] to-[#225AC8] rounded-2xl p-5 text-white shadow-lg shadow-blue-200 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group flex-shrink-0" onClick={() => setIsLoginLogOpen(true)}>
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><User size={60} /></div>
              <h4 className="font-bold text-lg mb-1 relative z-10 flex items-center gap-2"><ShieldCheck size={20}/> 登录日志</h4>
              <p className="text-xs text-blue-100 mb-4 relative z-10 max-w-[200px]">查看系统所有用户的登录历史、IP地址及设备信息。</p>
              <button className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center gap-1 backdrop-blur-sm relative z-10 transition-colors w-fit">
                  <Eye size={12}/> 查看完整日志
              </button>
          </div>
       </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6 h-full flex flex-col p-2 animate-in fade-in">
       {/* Top Row: 4 Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card 1: Version */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
             <div className="text-xs text-[#535E73] font-bold mb-1">系统版本</div>
             <div className="text-2xl font-bold text-[#2D4965] mb-1">v2.4.0</div>
             <div className="text-xs text-[#92A2C3]">Build 20240515</div>
          </div>
          {/* Card 2: Status */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
             <div className="text-xs text-[#535E73] font-bold mb-1">运行状态</div>
             <div className="text-2xl font-bold text-green-600 mb-1 flex items-center gap-2">
                <CheckCircle2 size={24} /> 正常
             </div>
             <div className="text-xs text-[#92A2C3]">所有服务运行中</div>
          </div>
          {/* Card 3: Uptime */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
             <div className="text-xs text-[#535E73] font-bold mb-1">系统运行时长</div>
             <div className="text-2xl font-bold text-[#225AC8] mb-1">15d 4h 22m</div>
             <div className="text-xs text-[#92A2C3]">Since 2024-05-05</div>
          </div>
          {/* Card 4: DB */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
             <div className="text-xs text-[#535E73] font-bold mb-1">数据库状态</div>
             <div className="text-2xl font-bold text-[#2D4965] mb-1">Connected</div>
             <div className="text-xs text-[#92A2C3]">PostgreSQL 14.2</div>
          </div>
       </div>

       {/* Middle Row: Chart */}
       <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#2D4965] flex items-center gap-2">
                 <Activity size={18} className="text-[#225AC8]" /> 系统资源监控
              </h3>
              <div className="flex gap-4 text-xs font-bold">
                 <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#225AC8]"></span>CPU</div>
                 <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>内存</div>
                 <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>网络</div>
              </div>
          </div>
          <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={RESOURCE_TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{fontSize: 10, fill: '#92A2C3'}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 80]} tick={{fontSize: 10, fill: '#92A2C3'}} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#225AC8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="network" stroke="#10B981" strokeWidth={2} dot={false} />
                 </LineChart>
              </ResponsiveContainer>
          </div>
       </div>

       {/* Bottom Row: 3 Metrics */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-[#225AC8] rounded-lg"><Cpu size={24}/></div>
               <div>
                  <div className="text-xs text-[#92A2C3]">CPU 使用率</div>
                  <div className="text-xl font-bold text-[#225AC8]">24%</div>
               </div>
           </div>
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><HardDrive size={24}/></div>
               <div>
                  <div className="text-xs text-[#92A2C3]">内存使用率</div>
                  <div className="text-xl font-bold text-purple-600">42%</div>
               </div>
           </div>
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Network size={24}/></div>
               <div>
                  <div className="text-xs text-[#92A2C3]">网络吞吐</div>
                  <div className="text-xl font-bold text-green-600">1.2 MB/s</div>
               </div>
           </div>
       </div>
    </div>
  );

  const renderAuditTab = () => (
     <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
           <div className="flex items-center gap-4">
              <div>
                <h3 className="font-bold text-[#2D4965] flex items-center gap-2"><FileText size={18} className="text-[#225AC8]"/> 操作审计日志</h3>
                <p className="text-[10px] text-[#92A2C3]">Operation Audit Logs</p>
              </div>
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="搜索日志内容/用户..." 
                   className="pl-9 pr-4 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 w-64 transition-all"
                   value={logFilter}
                   onChange={e => setLogFilter(e.target.value)}
                 />
              </div>
           </div>
           <div className="flex gap-2">
              <button className="text-xs font-bold text-[#535E73] bg-white border border-gray-200 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"><Filter size={14}/> 筛选</button>
              <button className="text-xs font-bold text-white bg-[#225AC8] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1e4eaf] transition-colors shadow-sm"><Download size={14}/> 导出日志</button>
           </div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
           <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] text-[#92A2C3] font-bold text-xs uppercase border-b border-gray-50 sticky top-0">
                 <tr>
                    <th className="px-6 py-3">时间</th>
                    <th className="px-4 py-3">操作人</th>
                    <th className="px-4 py-3">操作类型</th>
                    <th className="px-6 py-3">操作内容</th>
                    <th className="px-4 py-3">IP 地址</th>
                    <th className="px-4 py-3">结果</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {MOCK_LOGS.filter(l => l.content.includes(logFilter) || l.user.includes(logFilter)).map(log => (
                    <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-[#535E73]">{log.time}</td>
                       <td className="px-4 py-4 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-50 text-[#225AC8] flex items-center justify-center text-[10px] font-bold">{log.user.charAt(0).toUpperCase()}</div>
                          <span className="font-bold text-[#2D4965] text-xs">{log.user}</span>
                       </td>
                       <td className="px-4 py-4"><span className="bg-gray-100 text-[#535E73] px-2 py-0.5 rounded text-[10px] font-mono font-bold">{log.actionType}</span></td>
                       <td className="px-6 py-4 text-xs text-[#535E73]">{log.content}</td>
                       <td className="px-4 py-4 text-xs text-[#92A2C3] font-mono">{log.ip}</td>
                       <td className="px-4 py-4">
                          <span className={`flex items-center gap-1 text-[10px] font-bold ${log.result === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                             {log.result === 'success' ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                             {log.result.toUpperCase()}
                          </span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );

  return (
    <>
      <UserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onSubmit={handleSaveUser}
        roles={roles}
        initialData={editingUser}
      />
      <PasswordResetModal 
        isOpen={isPwdResetModalOpen}
        onClose={() => setIsPwdResetModalOpen(false)}
        onSubmit={handleResetPassword}
        username={pwdResetUser?.username || ''}
      />
      <RoleModal 
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSubmit={handleSaveRole}
        initialData={editingRole}
      />
      <PermissionPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        user={previewUser}
        roles={roles}
      />
      <LoginLogsModal 
        isOpen={isLoginLogOpen}
        onClose={() => setIsLoginLogOpen(false)}
      />

      <div className="h-full flex flex-col bg-[#F4F5F9] rounded-2xl overflow-hidden">
         <div className="flex-1 min-w-0 h-full overflow-hidden">
             {view === PageView.SETTINGS_CONFIG && (
                <div className="h-full overflow-y-auto custom-scrollbar p-1">
                   {renderConfigTab()}
                </div>
             )}
             {view === PageView.SETTINGS_USERS && renderUsersTab()}
             {view === PageView.SETTINGS_SYSTEM && renderSystemTab()}
             {view === PageView.SETTINGS_AUDIT && renderAuditTab()}
         </div>
      </div>
    </>
  );
};

export default SettingsManager;
