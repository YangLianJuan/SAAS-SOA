import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { 
  Zap, ArrowUp, ArrowDown, 
  Activity, Timer, MapPin, RefreshCw, Calendar,
  Leaf, Store, Layers,
  AlertOctagon, AlertTriangle, Coins, TrendingUp, X, Download, FileSpreadsheet, FileText, ChevronRight,
  Wifi, Server, Plug
} from 'lucide-react';
import { Alarm, Strategy, RankingItem } from '../types';

// --- Mock Data Generators ---

const generateTrendData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const baseline = 200 + Math.random() * 50 + (i > 8 && i < 20 ? 300 : 0);
    const actual = baseline * (0.85 + Math.random() * 0.1); // ~15% savings
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      baseline: Math.floor(baseline),
      actual: Math.floor(actual),
    });
  }
  return data;
};

const SAVINGS_DATA_WEEK = [
  { name: '周一', baseline: 4200, actual: 3200 },
  { name: '周二', baseline: 3800, actual: 2900 },
  { name: '周三', baseline: 3500, actual: 2800 },
  { name: '周四', baseline: 4100, actual: 3100 },
  { name: '周五', baseline: 4500, actual: 3600 },
  { name: '周六', baseline: 2800, actual: 2100 },
  { name: '周日', baseline: 2600, actual: 1900 },
];

const DEVICE_STATUS_DATA = [
  { name: '在线运行', value: 128, color: '#10B981' }, 
  { name: '离线', value: 15, color: '#94A3B8' }, 
  { name: '故障', value: 8, color: '#EF4444' },   
];

const REALTIME_ALARMS: Alarm[] = [
  { id: '1', message: '生鲜冷库设备离线 (>5min)', level: 'critical', time: '10:23:45', location: 'B1-冷库区' },
  { id: '2', message: '二楼卖场照明电压波动', level: 'warning', time: '09:15:20', location: 'F2-照明A路' },
  { id: '3', message: '顶楼空调机组压缩机故障', level: 'critical', time: '08:45:10', location: 'R-HVAC-01' },
  { id: '4', message: '地下车库能耗超阈值 (20%)', level: 'warning', time: '02:30:00', location: 'B2-车库' },
];

const ACTIVE_STRATEGIES = [
  { id: '1', name: '夜间照明智能调光', status: 'active', savings: 145.2, executeTime: '18:00 - 06:00' },
  { id: '2', name: '空调温度动态平衡', status: 'active', savings: 328.5, executeTime: '全天候' },
  { id: '3', name: '新风系统CO2联动', status: 'active', savings: 89.4, executeTime: '08:00 - 22:00' },
];

const RANKING_DATA: RankingItem[] = [
  { id: '1', name: '上海静安旗舰店', value: 12450, unit: 'kWh', percentage: 88 },
  { id: '2', name: '北京朝阳合生汇店', value: 10230, unit: 'kWh', percentage: 72 },
  { id: '3', name: '深圳南山科技园店', value: 8540, unit: 'kWh', percentage: 65 },
  { id: '4', name: '杭州西湖银泰店', value: 6200, unit: 'kWh', percentage: 45 },
  { id: '5', name: '成都太古里店', value: 5800, unit: 'kWh', percentage: 41 },
];

// --- Components ---

// 3D Tilt Card Component
const TiltCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPct = x / rect.width;
    const yPct = y / rect.height;
    const xRotation = (yPct - 0.5) * -2; // Reduced rotation for cleaner UI
    const yRotation = (xPct - 0.5) * 2;
    
    setTransform(`perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
    setIsHovered(false);
  };

  return (
    <div 
      className={`transition-all duration-300 ease-out ${className}`}
      style={{ transform: isHovered ? transform : 'none' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Section Header
const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-4 px-1">
    <div>
      <h3 className="text-[15px] font-bold text-[#2D4965] flex items-center gap-2">
        <span className="w-1 h-4 bg-[#225AC8] rounded-full shadow-sm"></span>
        {title}
      </h3>
      {subtitle && <p className="text-[10px] text-[#92A2C3] mt-0.5 ml-3 font-medium">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// Custom Tooltip for Savings
const SavingsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const baseline = payload.find((p: any) => p.name === '基准' || p.dataKey === 'baseline')?.value || 0;
    const actual = payload.find((p: any) => p.name === '实际' || p.dataKey === 'actual')?.value || 0;
    const saved = Math.max(0, baseline - actual);
    const money = saved * 1.2; // Assume 1.2 RMB per kWh

    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-blue-100/50 text-xs z-50 min-w-[160px]">
        <p className="font-bold text-[#2D4965] mb-2 pb-1 border-b border-gray-100">{label}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[#92A2C3]">
            <span>基准能耗:</span>
            <span className="font-mono text-[#535E73]">{baseline} kWh</span>
          </div>
          <div className="flex justify-between text-[#225AC8]">
            <span>实际能耗:</span>
            <span className="font-mono">{actual} kWh</span>
          </div>
          <div className="mt-2 pt-1 border-t border-dashed border-gray-200">
             <div className="flex justify-between text-green-600 font-bold">
              <span>节省电量:</span>
              <span className="font-mono">+{saved.toFixed(0)} kWh</span>
            </div>
             <div className="flex justify-between text-[#F59E0B] font-bold text-sm mt-0.5">
              <span>节省费用:</span>
              <span className="font-mono">¥{money.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [trendData, setTrendData] = useState(generateTrendData());
  const [dimension, setDimension] = useState<'store' | 'area' | 'device'>('store');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh simulation
  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000);
    let dataInterval: ReturnType<typeof setInterval>;

    if (autoRefresh) {
      dataInterval = setInterval(() => {
        setTrendData(prev => {
          const newData = [...prev];
          const lastIdx = newData.length - 1;
          // Slight randomization for "live" effect
          newData[lastIdx] = {
            ...newData[lastIdx],
            actual: newData[lastIdx].actual + (Math.random() - 0.5) * 5
          };
          return newData;
        });
      }, 5000); // Refresh every 5s
    }

    return () => {
      clearInterval(clock);
      if (dataInterval) clearInterval(dataInterval);
    };
  }, [autoRefresh]);

  return (
    <div className="flex flex-col gap-5 min-h-full pb-6">
      
      {/* 1. Header & Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="bg-blue-50 p-2 rounded-lg text-[#225AC8]">
              <Activity size={20} />
           </div>
           <div>
             <h1 className="text-xl font-bold text-[#2D4965] tracking-tight">能耗监管大屏</h1>
             <p className="text-xs text-[#92A2C3] flex items-center gap-2 mt-0.5">
               <span className="flex items-center gap-1"><Server size={10}/> 数据源: IoT Gateway / Matter协议</span>
               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
               <span className="flex items-center gap-1"><Timer size={10}/> {time.toLocaleTimeString()}</span>
             </p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           {/* Dimension Switcher */}
           <div className="flex bg-[#F4F5F9] p-1 rounded-lg border border-gray-100">
             {(['store', 'area', 'device'] as const).map(dim => (
               <button 
                key={dim}
                onClick={() => setDimension(dim)} 
                className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${dimension === dim ? 'bg-white text-[#225AC8] shadow-sm' : 'text-[#92A2C3] hover:text-[#535E73]'}`}
               >
                 {dim === 'store' ? '按门店' : dim === 'area' ? '按区域' : '按设备'}
               </button>
             ))}
           </div>

           <div className="h-6 w-px bg-gray-200"></div>

           {/* Actions */}
           <button 
             onClick={() => setAutoRefresh(!autoRefresh)}
             className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${autoRefresh ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
           >
             <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} />
             {autoRefresh ? '5s自动刷新' : '手动刷新'}
           </button>
           <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#27509F] text-white hover:bg-[#1e4eaf] transition-colors shadow-md shadow-blue-200">
             <Download size={12} /> 导出报表
           </button>
        </div>
      </div>

      {/* 2. Main Dashboard Content - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        
        {/* === LEFT COLUMN: Real-time Data & Savings (3 cols) === */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          
          {/* Hero Card: Money Saved */}
          <TiltCard className="bg-gradient-to-br from-[#27509F] to-[#225AC8] rounded-2xl p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Coins size={80} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-blue-100">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <Coins size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">累计节省费用</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold tracking-tight">128,450</span>
                <span className="text-sm font-medium opacity-80">元</span>
              </div>
              <div className="flex items-center gap-2 text-xs bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                <TrendingUp size={12} />
                <span>同比上月增长 12.5%</span>
              </div>
            </div>
          </TiltCard>

          {/* Real-time Metrics Grid */}
          <div className="grid grid-cols-1 gap-4">
             {/* Total Power */}
             <TiltCard className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs text-[#92A2C3] font-bold uppercase">当前总功率</span>
                   <span className="bg-blue-50 text-[#225AC8] p-1.5 rounded-lg"><Zap size={14}/></span>
                </div>
                <div className="flex items-end justify-between">
                   <div>
                      <span className="text-2xl font-bold text-[#2D4965]">842.5</span>
                      <span className="text-xs text-[#92A2C3] ml-1">kW</span>
                   </div>
                   <div className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold flex items-center">
                     <ArrowDown size={10} className="mr-0.5"/> 2.4%
                   </div>
                </div>
             </TiltCard>

             {/* Today's Energy */}
             <TiltCard className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs text-[#92A2C3] font-bold uppercase">今日累计能耗</span>
                   <span className="bg-orange-50 text-orange-500 p-1.5 rounded-lg"><Activity size={14}/></span>
                </div>
                <div className="flex items-end justify-between">
                   <div>
                      <span className="text-2xl font-bold text-[#2D4965]">3,210</span>
                      <span className="text-xs text-[#92A2C3] ml-1">kWh</span>
                   </div>
                   <div className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-bold flex items-center">
                     <ArrowUp size={10} className="mr-0.5"/> 5.1%
                   </div>
                </div>
             </TiltCard>

             {/* Savings Rate */}
             <TiltCard className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs text-[#92A2C3] font-bold uppercase">综合节能率</span>
                   <span className="bg-green-50 text-green-600 p-1.5 rounded-lg"><Leaf size={14}/></span>
                </div>
                <div className="flex items-end justify-between">
                   <div>
                      <span className="text-2xl font-bold text-[#2D4965]">18.5</span>
                      <span className="text-xs text-[#92A2C3] ml-1">%</span>
                   </div>
                   <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[18.5%]"></div>
                   </div>
                </div>
             </TiltCard>
          </div>
        </div>

        {/* === CENTER COLUMN: Visualization & Trends (6 cols) === */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          
          {/* Main Chart: Real-time Trend & Baseline Comparison */}
          <TiltCard className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 min-h-[350px]">
            <SectionHeader 
               title="能耗趋势监控" 
               subtitle="实际负荷 vs 基准负荷 (kW)"
               action={
                 <div className="flex gap-2">
                   <span className="flex items-center gap-1.5 text-[10px] text-[#535E73]"><div className="w-2 h-2 rounded-full bg-[#E2E8F0]"></div>基准</span>
                   <span className="flex items-center gap-1.5 text-[10px] text-[#535E73]"><div className="w-2 h-2 rounded-full bg-[#225AC8]"></div>实际</span>
                 </div>
               }
            />
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#225AC8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#225AC8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} interval={3} />
                  <YAxis tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                  <Tooltip content={<SavingsTooltip />} cursor={{ stroke: '#225AC8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="baseline" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fill="transparent" name="基准" animationDuration={1000} />
                  <Area type="monotone" dataKey="actual" stroke="#225AC8" strokeWidth={3} fill="url(#colorActual)" name="实际" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>

          {/* Sub Chart: Savings Bar Chart */}
          <TiltCard className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 min-h-[300px]">
             <SectionHeader 
               title="节能效果分析" 
               subtitle="周度能耗对比 (kWh)" 
               action={<span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">已执行策略优化</span>}
             />
             <div className="h-[220px] w-full mt-2">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SAVINGS_DATA_WEEK} barGap={0} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip content={<SavingsTooltip />} cursor={{fill: '#F8FAFC'}} />
                    <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} iconType="circle" />
                    <Bar dataKey="baseline" name="基准能耗" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="actual" name="实际能耗" fill="#225AC8" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
          </TiltCard>
        </div>

        {/* === RIGHT COLUMN: Info & Status (3 cols) === */}
        <div className="lg:col-span-3 flex flex-col gap-5">
           
           {/* 1. Device Status Pie */}
           <TiltCard className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <SectionHeader title="设备状态监控" />
              <div className="flex items-center justify-between">
                 <div className="relative h-[120px] w-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DEVICE_STATUS_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {DEVICE_STATUS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <span className="text-xl font-bold text-[#2D4965]">151</span>
                       <span className="text-[8px] text-[#92A2C3]">总数</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2 flex-1 pl-4">
                    {DEVICE_STATUS_DATA.map((item, i) => (
                       <div key={i} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                             <span className="text-[#535E73]">{item.name}</span>
                          </div>
                          <span className="font-bold">{item.value}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </TiltCard>

           {/* 2. Real-time Alarms */}
           <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col">
              <SectionHeader title="实时告警" action={<span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded font-bold animate-pulse">4 待处理</span>} />
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 max-h-[220px]">
                 {REALTIME_ALARMS.map(alarm => (
                    <div key={alarm.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-transparent hover:border-red-100 hover:bg-red-50/30 transition-all group cursor-pointer">
                       <div className="flex gap-3">
                          <div className={`mt-0.5 ${alarm.level === 'critical' ? 'text-red-500' : 'text-[#F59E0B]'}`}>
                             {alarm.level === 'critical' ? <AlertOctagon size={16} /> : <AlertTriangle size={16} />}
                          </div>
                          <div className="flex-1">
                             <p className="text-xs font-bold text-[#535E73] group-hover:text-[#2D4965] line-clamp-2">{alarm.message}</p>
                             <div className="flex justify-between items-center mt-1.5 text-[10px] text-[#92A2C3]">
                                <span className="flex items-center gap-1"><MapPin size={10}/> {alarm.location}</span>
                                <span>{alarm.time}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* 3. Strategy Execution */}
           <div className="bg-gradient-to-br from-[#F0F5FF] to-[#F8FAFC] p-5 rounded-2xl border border-blue-50 shadow-sm">
              <SectionHeader title="策略执行状态" subtitle="正在执行中" />
              <div className="space-y-3 mt-2">
                 {ACTIVE_STRATEGIES.map(strategy => (
                    <div key={strategy.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blue-100/50 shadow-sm">
                       <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-blue-50 text-[#225AC8] rounded-md">
                             <Plug size={12} />
                          </div>
                          <div>
                             <p className="text-[11px] font-bold text-[#2D4965]">{strategy.name}</p>
                             <p className="text-[9px] text-[#92A2C3]">{strategy.executeTime}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                             省 ¥{strategy.savings}
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

        {/* === BOTTOM ROW: Stats & Rankings === */}
        <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <SectionHeader title="能耗统计与排名" subtitle="Top 5 高能耗站点分析" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
            {RANKING_DATA.map((item, index) => (
              <div key={item.id} className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all cursor-pointer group">
                 <div className="flex justify-between mb-3">
                    <span className={`
                      w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold text-white
                      ${index === 0 ? 'bg-[#F59E0B]' : index === 1 ? 'bg-[#94A3B8]' : index === 2 ? 'bg-[#B45309]' : 'bg-gray-200 text-gray-500'}
                    `}>
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-[#225AC8]">{item.percentage}%</span>
                 </div>
                 <p className="text-xs font-bold text-[#2D4965] truncate mb-2" title={item.name}>{item.name}</p>
                 <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-[#225AC8] h-full rounded-full group-hover:bg-gradient-to-r group-hover:from-[#225AC8] group-hover:to-[#60A5FA]" style={{width: `${item.percentage}%`}}></div>
                 </div>
                 <p className="text-sm font-bold text-[#535E73] font-mono">{item.value.toLocaleString()} <span className="text-[10px] text-[#92A2C3] font-normal">kWh</span></p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
