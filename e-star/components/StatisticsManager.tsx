
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart as PieChartIcon, Table as TableIcon, Download, FileText, 
  Calendar, Filter, RefreshCw, ChevronDown, Plus, Trash2, Eye, FileSpreadsheet, 
  FileCode, CheckCircle2, AlertCircle, Clock, TrendingUp, ArrowUpRight, ArrowDownRight,
  TrendingDown, Search, Mail, Settings, Save, ToggleLeft, ToggleRight, ListFilter,
  Zap, Activity, Layers, ArrowRight, Leaf, Trees, ChevronLeft, Edit, X, BarChart4, ExternalLink
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, ComposedChart, Line, Bar
} from 'recharts';
import { StatisticsReport } from '../types';

// --- Mock Data ---

// Chart Data with Prediction
const generateQueryTrendData = (period: string) => {
  const hours = ['01:00', '03:00', '05:00', '07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00', '23:00'];
  return hours.map((h, i) => {
    const baseline = 100 + Math.random() * 40;
    const current = baseline * (0.9 + Math.random() * 0.2);
    const isPrediction = i >= 9; // Simulate future hours
    return {
      time: h,
      current: isPrediction ? null : Math.floor(current),
      comparison: Math.floor(baseline), 
      prediction: isPrediction ? Math.floor(current * 1.1) : null,
    };
  });
};

const MOCK_QUERY_DISTRIBUTION = [
  { name: '暖通空调', value: 45, color: '#27509F' },
  { name: '照明系统', value: 25, color: '#4B7BEC' },
  { name: '动力设备', value: 18, color: '#A5B1C2' },
  { name: '其他负荷', value: 12, color: '#E2E8F0' },
];

const MOCK_REPORTS: StatisticsReport[] = [
  { id: 'RPT-20231001', name: '2023年10月度能耗统计报表', type: 'ENERGY', format: 'EXCEL', timeRange: '2023-10-01 ~ 2023-10-31', creator: 'System Admin', createTime: '2023-11-01 08:00', status: 'GENERATED', fileSize: '2.4 MB' },
  { id: 'RPT-20231015', name: 'Q3 季度节能效果评估报告', type: 'SAVINGS', format: 'PDF', timeRange: '2023-07-01 ~ 2023-09-30', creator: 'System Admin', createTime: '2023-10-15 10:30', status: 'GENERATED', fileSize: '1.8 MB' },
  { id: 'RPT-20231020', name: '上海区域设备运行故障汇总', type: 'ALARM', format: 'CSV', timeRange: '2023-10-14 ~ 2023-10-20', creator: 'Manager Zhang', createTime: '2023-10-20 17:00', status: 'GENERATED', fileSize: '0.5 MB' },
  { id: 'RPT-20231028', name: '10月第四周能耗分析', type: 'ENERGY', format: 'PDF', timeRange: '2023-10-21 ~ 2023-10-27', creator: 'System Admin', createTime: '2023-10-28 09:15', status: 'PROCESSING', fileSize: '-' },
  { id: 'RPT-20231029', name: '上海静安店-10月电费核算单', type: 'ENERGY', format: 'PDF', timeRange: '2023-10-01 ~ 2023-10-31', creator: 'Finance Dept', createTime: '2023-11-02 09:00', status: 'GENERATED', fileSize: '1.1 MB' },
];

const MOCK_TABLE_DATA = [
    { id: 1, time: '2023-11-01 08:00', energy: '219.05', power: '48.03', peak: '61.52', yoy: '-9.12%', savings: '14.73%' },
    { id: 2, time: '2023-11-01 09:00', energy: '241.51', power: '59.29', peak: '60.22', yoy: '-4.09%', savings: '10.26%' },
    { id: 3, time: '2023-11-01 10:00', energy: '258.46', power: '47.40', peak: '61.62', yoy: '+5.85%', savings: '11.14%' },
    { id: 4, time: '2023-11-01 11:00', energy: '267.70', power: '48.44', peak: '63.71', yoy: '+9.13%', savings: '13.62%' },
    { id: 5, time: '2023-11-01 12:00', energy: '254.11', power: '48.30', peak: '64.33', yoy: '+9.74%', savings: '6.14%' },
    { id: 6, time: '2023-11-01 13:00', energy: '202.61', power: '40.69', peak: '61.92', yoy: '-1.27%', savings: '2.61%' },
    { id: 7, time: '2023-11-01 14:00', energy: '201.13', power: '50.38', peak: '60.81', yoy: '-9.43%', savings: '1.55%' },
    { id: 8, time: '2023-11-01 15:00', energy: '198.45', power: '49.12', peak: '58.44', yoy: '-1.20%', savings: '3.40%' },
];

// --- Helper Components ---

const StatusBadge = ({ status }: { status: StatisticsReport['status'] }) => {
    const styles = {
        GENERATED: 'bg-green-50 text-green-600 border-green-100',
        PROCESSING: 'bg-blue-50 text-blue-600 border-blue-100',
        FAILED: 'bg-red-50 text-red-600 border-red-100',
    };
    const labels = {
        GENERATED: '生成成功',
        PROCESSING: '生成中...',
        FAILED: '生成失败',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${styles[status]}`}>
            {status === 'GENERATED' && <CheckCircle2 size={12} />}
            {status === 'PROCESSING' && <RefreshCw size={12} className="animate-spin" />}
            {status === 'FAILED' && <AlertCircle size={12} />}
            {labels[status]}
        </span>
    );
};

const FormatIcon = ({ format }: { format: StatisticsReport['format'] }) => {
    if (format === 'PDF') return <FileText size={20} className="text-red-500" />;
    if (format === 'EXCEL') return <FileSpreadsheet size={20} className="text-green-600" />;
    return <FileCode size={20} className="text-gray-500" />;
};

const FormatIconBox = ({ format }: { format: StatisticsReport['format'] }) => {
    const styles = {
        PDF: 'bg-red-50 border-red-100 text-red-500',
        EXCEL: 'bg-green-50 border-green-100 text-green-600',
        CSV: 'bg-gray-50 border-gray-200 text-gray-500',
    };
    
    return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${styles[format]}`}>
            <FormatIcon format={format} />
        </div>
    );
};

// --- Modals ---

interface GenerateReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (report: Partial<StatisticsReport>) => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<StatisticsReport>>({
        name: '', type: 'ENERGY', format: 'EXCEL', timeRange: 'Last Month'
    });

    useEffect(() => {
        if(isOpen && !formData.name) {
            setFormData(prev => ({...prev, name: `能耗统计报表_${new Date().toISOString().slice(0,10)}`}));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <h3 className="font-bold text-[#2D4965]">生成新报表</h3>
                    <button onClick={onClose}><AlertCircle size={20} className="text-gray-400 hover:text-gray-600"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">报表名称</label>
                        <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#27509F]" placeholder="例如: 2023年度能耗汇总" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">报表类型</label>
                        <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#27509F]" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                            <option value="ENERGY">能耗统计报表</option>
                            <option value="SAVINGS">节能效果报表</option>
                            <option value="DEVICE_RUNNING">设备运行报表</option>
                            <option value="ALARM">告警记录报表</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-[#535E73] mb-1.5">统计时间范围</label>
                         <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#27509F]" value={formData.timeRange} onChange={e => setFormData({...formData, timeRange: e.target.value})}>
                            <option value="Last Week">上周</option>
                            <option value="Last Month">上月</option>
                            <option value="Last Quarter">上季度</option>
                            <option value="Last Year">去年</option>
                            <option value="Custom">自定义...</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-1.5">导出格式</label>
                        <div className="flex gap-4">
                             {['EXCEL', 'PDF', 'CSV'].map(fmt => (
                                 <label key={fmt} className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${formData.format === fmt ? 'border-[#27509F] bg-blue-50 text-[#27509F]' : 'border-gray-200 hover:bg-gray-50 text-[#535E73]'}`}>
                                     <input type="radio" name="format" value={fmt} checked={formData.format === fmt} onChange={() => setFormData({...formData, format: fmt as any})} className="hidden" />
                                     <FormatIcon format={fmt as any} />
                                     <span className="text-xs font-bold">{fmt}</span>
                                 </label>
                             ))}
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-[#535E73] hover:bg-gray-200 rounded-lg">取消</button>
                    <button onClick={() => onSubmit(formData)} className="px-4 py-2 text-sm font-bold text-white bg-[#27509F] hover:bg-[#1e4eaf] rounded-lg flex items-center gap-2"><Download size={14}/> 生成报表</button>
                </div>
            </div>
        </div>
    );
};

// --- Report Preview Modal ---

interface ReportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: StatisticsReport | null;
}

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ isOpen, onClose, report }) => {
    if (!isOpen || !report) return null;

    // Mock summary data for preview
    const totalRecords = Math.floor(Math.random() * 2000) + 500;
    const abnormalData = Math.floor(Math.random() * 10);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* 1. Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <FormatIconBox format={report.format} />
                        <div>
                            <h3 className="font-bold text-[#2D4965] text-lg">{report.name}</h3>
                            <p className="text-xs text-[#92A2C3] font-mono mt-0.5">{report.id} • {report.createTime}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={report.status} />
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* 2. Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar bg-white flex-1">
                    <div className="border border-gray-100 rounded-xl p-8 shadow-sm">
                        
                        {/* Title Section */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#2D4965] mb-2">{report.name}</h2>
                            <p className="text-sm text-[#92A2C3]">统计周期: <span className="font-mono text-[#535E73]">{report.timeRange}</span></p>
                            <div className="w-full h-0.5 bg-[#2D4965] mt-6"></div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="border border-blue-100 bg-blue-50/20 rounded-lg p-5 text-center">
                                <p className="text-xs text-[#92A2C3] font-bold mb-2">总记录数</p>
                                <p className="text-2xl font-bold text-[#27509F]">{totalRecords.toLocaleString()}</p>
                            </div>
                            <div className="border border-green-100 bg-green-50/20 rounded-lg p-5 text-center">
                                <p className="text-xs text-[#92A2C3] font-bold mb-2">异常数据</p>
                                <p className="text-2xl font-bold text-green-600">{abnormalData}</p>
                            </div>
                            <div className="border border-gray-200 bg-gray-50/50 rounded-lg p-5 text-center">
                                <p className="text-xs text-[#92A2C3] font-bold mb-2">导出用户</p>
                                <p className="text-lg font-bold text-[#535E73] mt-1">{report.creator}</p>
                            </div>
                        </div>

                        {/* Chart Placeholder */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 h-64 flex flex-col items-center justify-center text-gray-300 mb-8 relative group cursor-not-allowed">
                            <BarChart4 size={48} className="mb-2 opacity-50"/>
                            <p className="text-sm font-bold opacity-70">图表预览区域 (Chart Placeholder)</p>
                            <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-xs text-[#92A2C3]">预览模式下不可交互</span>
                            </div>
                        </div>

                        {/* Data Details Header */}
                        <div>
                            <h4 className="text-sm font-bold text-[#2D4965] flex items-center gap-2 mb-4">
                                <span className="w-1 h-4 bg-[#27509F] rounded-full"></span>
                                数据详情摘要
                            </h4>
                            <div className="border border-gray-100 rounded-lg overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 text-[#92A2C3] font-bold">
                                        <tr>
                                            <th className="px-4 py-3">时间节点</th>
                                            <th className="px-4 py-3">能耗值 (kWh)</th>
                                            <th className="px-4 py-3">同比变化</th>
                                            <th className="px-4 py-3">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-[#535E73]">
                                        {[1, 2, 3].map(i => (
                                            <tr key={i}>
                                                <td className="px-4 py-3 font-mono">2023-10-0{i} 12:00</td>
                                                <td className="px-4 py-3 font-bold">{(240 + i * 12).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-green-600">+{(2.5 + i * 0.3).toFixed(1)}%</td>
                                                <td className="px-4 py-3"><span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[10px]">Normal</span></td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-center text-[#92A2C3] italic bg-gray-50/30">... 更多数据请下载完整文件查看 ...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div className="text-xs text-[#92A2C3] font-medium flex items-center gap-2">
                        <span>{report.fileSize}</span>
                        <span>•</span>
                        <span className="font-bold">{report.format}</span>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 text-[#535E73] text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm">
                            <Download size={16} /> 下载文件
                        </button>
                        <button className="px-4 py-2 bg-[#27509F] text-white text-sm font-bold rounded-lg hover:bg-[#1e4eaf] transition-colors flex items-center gap-2 shadow-md shadow-blue-200">
                            <TrendingUp size={16} /> 深入分析
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

interface StatisticsManagerProps {
  initialTab?: 'query' | 'reports' | 'config';
}

const StatisticsManager: React.FC<StatisticsManagerProps> = ({ initialTab = 'query' }) => {
  const [activeTab, setActiveTab] = useState<'query' | 'reports' | 'config'>(initialTab);
  
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Query Tab State
  const [timeScope, setTimeScope] = useState<'Day'|'Week'|'Month'|'Year'>('Day');
  const [spaceScope, setSpaceScope] = useState('System');
  const [deviceScope, setDeviceScope] = useState('All');
  const [comparison, setComparison] = useState<'YoY'|'MoM'>('YoY');
  
  // Reports State
  const [reports, setReports] = useState<StatisticsReport[]>(MOCK_REPORTS);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<StatisticsReport | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Config State
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [emailRecipients, setEmailRecipients] = useState('admin@example.com; manager@example.com');

  // Handlers
  const handleGenerateReport = (data: Partial<StatisticsReport>) => {
      const newReport: StatisticsReport = {
          ...data as StatisticsReport,
          id: `RPT-${Date.now()}`,
          creator: 'Admin',
          createTime: new Date().toLocaleString(),
          status: 'PROCESSING',
          fileSize: '-',
          timeRange: data.timeRange || 'Custom Range'
      };
      setReports([newReport, ...reports]);
      setIsReportModalOpen(false);
      
      // Simulate processing
      setTimeout(() => {
          setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: 'GENERATED', fileSize: '1.5 MB' } : r));
      }, 3000);
  };

  const handleDeleteReport = (id: string) => {
      if(confirm('确认删除该报表记录吗？')) {
          setReports(prev => prev.filter(r => r.id !== id));
      }
  };

  const handleViewReport = (report: StatisticsReport) => {
      setSelectedReport(report);
      setIsPreviewModalOpen(true);
  };

  const renderQueryView = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* ... (Query View Content remains unchanged) ... */}
        {/* Header Section */}
        <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-[#2D4965] flex items-center gap-3">
                <span className="w-1.5 h-5 bg-[#27509F] rounded-full"></span>
                系统查询
            </h1>
            <p className="text-xs text-[#92A2C3] mt-1.5 ml-4">多维度能耗分析与数据查询</p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                {/* Time Scope */}
                <div className="flex bg-[#F8FAFC] p-1 rounded-lg border border-gray-100">
                    {['Day', 'Week', 'Month', 'Year'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTimeScope(t as any)}
                            className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${timeScope === t ? 'bg-white text-[#27509F] shadow-sm' : 'text-[#92A2C3] hover:text-[#535E73]'}`}
                        >
                            {t === 'Day' && '今日'}
                            {t === 'Week' && '本周'}
                            {t === 'Month' && '本月'}
                            {t === 'Year' && '全年'}
                        </button>
                    ))}
                </div>
                
                <div className="h-4 w-px bg-gray-200"></div>

                {/* Scope Selectors */}
                <div className="flex items-center gap-2 text-sm text-[#535E73]">
                     <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-gray-100">
                        <Layers size={14} className="text-[#92A2C3]"/>
                        <select 
                            value={spaceScope}
                            onChange={(e) => setSpaceScope(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs font-bold text-[#535E73] min-w-[100px] cursor-pointer"
                        >
                            <option value="System">全系统 (System)</option>
                            <option value="Store_SH">上海静安旗舰店</option>
                        </select>
                     </div>
                     <span className="text-[#92A2C3]">→</span>
                     <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-gray-100">
                        <Zap size={14} className="text-[#92A2C3]"/>
                        <select 
                            value={deviceScope}
                            onChange={(e) => setDeviceScope(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs font-bold text-[#535E73] min-w-[100px] cursor-pointer"
                        >
                            <option value="All">所有设备 (All)</option>
                            <option value="HVAC">暖通空调</option>
                        </select>
                     </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 text-xs font-bold text-[#92A2C3]">
                    <span>对比:</span>
                    <div className="flex bg-[#F8FAFC] p-0.5 rounded-lg border border-gray-100">
                       <button onClick={() => setComparison('YoY')} className={`px-2 py-0.5 rounded transition-all ${comparison === 'YoY' ? 'bg-[#27509F] text-white' : 'text-[#535E73]'}`}>同比</button>
                       <button onClick={() => setComparison('MoM')} className={`px-2 py-0.5 rounded transition-all ${comparison === 'MoM' ? 'bg-[#27509F] text-white' : 'text-[#535E73]'}`}>环比</button>
                    </div>
                 </div>
                 <button className="flex items-center gap-2 px-6 py-1.5 bg-[#27509F] text-white text-xs font-bold rounded-lg hover:bg-[#1e4eaf] shadow-md shadow-blue-200 transition-all">
                    <Search size={14}/> 查询
                 </button>
            </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 1. Energy */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-[#92A2C3] mb-3">统计周期总能耗</p>
                <div className="flex items-end justify-between mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#2D4965] tracking-tight">24,580</span>
                        <span className="text-xs font-bold text-[#92A2C3]">kWh</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 flex items-center gap-0.5 mb-1">
                       <TrendingUp size={10}/> +5.2%
                    </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-xs">
                    <span className="text-[#92A2C3]">平均每日</span>
                    <span className="font-bold text-[#535E73]">819 kWh</span>
                </div>
            </div>
            {/* 2. Power */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-[#92A2C3] mb-3">平均负荷功率</p>
                <div className="flex items-end justify-between mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#2D4965] tracking-tight">45.2</span>
                        <span className="text-xs font-bold text-[#92A2C3]">kW</span>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-xs">
                    <span className="text-[#92A2C3]">峰值时刻</span>
                    <span className="font-bold text-[#535E73]">14:00 (89.5 kW)</span>
                </div>
            </div>
            {/* 3. Savings */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-[#92A2C3] mb-3">综合节能率</p>
                <div className="flex items-end justify-between mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#2D4965] tracking-tight">12.8</span>
                        <span className="text-xs font-bold text-[#92A2C3]">%</span>
                    </div>
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-0.5 mb-1">
                       <TrendingDown size={10}/> -2.4%
                    </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-xs">
                    <span className="text-[#92A2C3]">累计节省</span>
                    <span className="font-bold text-[#535E73]">¥ 3,420</span>
                </div>
            </div>
            {/* 4. Carbon */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-[#92A2C3] mb-3">碳排放当量</p>
                <div className="flex items-end justify-between mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#2D4965] tracking-tight">12.4</span>
                        <span className="text-xs font-bold text-[#92A2C3]">tCO2</span>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-xs">
                    <span className="text-[#92A2C3]">相当于植树</span>
                    <span className="font-bold text-[#535E73] flex items-center gap-1"><Trees size={12} className="text-green-600"/> 680 棵</span>
                </div>
            </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Trend */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-[320px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2">
                        <BarChart3 size={16} className="text-[#535E73]"/> 能耗趋势分析
                     </h3>
                     <div className="flex gap-3 text-[10px] font-bold">
                         <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#27509F]"></div>本期实测</div>
                         <div className="flex items-center gap-1.5 text-[#92A2C3]"><div className="w-2 h-2 rounded-full bg-[#CBD5E1]"></div>同期对比</div>
                         <div className="flex items-center gap-1.5 text-[#F59E0B]"><div className="w-2 h-2 rounded-full border border-[#F59E0B] border-dashed"></div>趋势预测</div>
                     </div>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={generateQueryTrendData(timeScope)}>
                            <defs>
                                <linearGradient id="colorCurrentQuery" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#27509F" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#27509F" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="time" tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fill: '#92A2C3', fontSize: 10}} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="comparison" stroke="#CBD5E1" strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="current" stroke="#27509F" strokeWidth={3} fill="url(#colorCurrentQuery)" />
                            <Line type="monotone" dataKey="prediction" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={{r:3, fill: '#F59E0B'}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Right: Composition */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-[320px] flex flex-col">
                <h3 className="text-sm font-bold text-[#2D4965] mb-4 flex items-center gap-2">
                    <PieChartIcon size={16} className="text-[#535E73]"/> 能耗构成分析
                </h3>
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={MOCK_QUERY_DISTRIBUTION}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {MOCK_QUERY_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '10px', color: '#92A2C3'}} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none pb-6">
                        <span className="text-2xl font-bold text-[#2D4965]">8,800</span>
                        <span className="text-[10px] text-[#92A2C3]">Total kWh</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-sm font-bold text-[#2D4965] flex items-center gap-2">
                    <TableIcon size={16} className="text-[#535E73]"/> 统计数据明细
                 </h3>
                 <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-[#535E73] text-xs font-bold rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                        <RefreshCw size={12}/> 刷新
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-[#535E73] text-xs font-bold rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={12}/> 导出数据
                    </button>
                 </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold border-b border-gray-50">
                        <tr>
                            <th className="px-6 py-4">时间</th>
                            <th className="px-4 py-4">总能耗 (KWH)</th>
                            <th className="px-4 py-4">平均功率 (KW)</th>
                            <th className="px-4 py-4">峰值功率 (KW)</th>
                            <th className="px-4 py-4">同比变化</th>
                            <th className="px-4 py-4">节能率</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs font-medium text-[#535E73]">
                        {MOCK_TABLE_DATA.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-[#535E73] font-mono">{row.time}</td>
                                <td className="px-4 py-4 font-bold text-[#2D4965]">{row.energy}</td>
                                <td className="px-4 py-4 text-[#535E73]">{row.power}</td>
                                <td className="px-4 py-4 text-[#535E73]">{row.peak}</td>
                                <td className="px-4 py-4">
                                    <div className={`flex items-center gap-1 font-bold ${row.yoy.startsWith('-') ? 'text-green-600' : 'text-red-500'}`}>
                                        {row.yoy.startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                        {row.yoy.replace('-', '').replace('+', '')}
                                    </div>
                                </td>
                                <td className="px-4 py-4 font-bold text-green-600">
                                    {row.savings}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[#27509F] font-bold text-xs hover:underline">查看详情</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>

             {/* Pagination Footer */}
             <div className="p-4 border-t border-gray-100 flex justify-end items-center gap-4 flex-shrink-0 bg-white rounded-b-xl">
                 <span className="text-xs text-[#92A2C3]">显示 1 到 {MOCK_TABLE_DATA.length} 条，共 {MOCK_TABLE_DATA.length} 条</span>
                 <div className="flex items-center gap-2">
                     <div className="relative">
                        <select className="bg-[#F8FAFC] border border-transparent hover:border-gray-200 text-xs text-[#535E73] rounded-lg px-2 py-1 outline-none cursor-pointer">
                            <option>10条/页</option>
                            <option>20条/页</option>
                            <option>50条/页</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                     </div>
                     <div className="flex gap-1">
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#92A2C3] hover:bg-gray-100 hover:text-[#535E73] transition-colors"><ChevronLeft size={14} /></button>
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#27509F] text-white text-xs font-bold shadow-md shadow-blue-200">1</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#535E73] hover:bg-gray-100 hover:text-[#27509F] transition-colors text-xs">2</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#92A2C3] hover:bg-gray-100 hover:text-[#535E73] transition-colors"><ChevronLeft size={14} className="rotate-180" /></button>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-[#92A2C3] ml-2">
                         前往
                         <input type="text" className="w-10 h-8 bg-[#F8FAFC] border border-transparent hover:border-gray-200 rounded-lg text-center outline-none focus:border-[#27509F] text-[#535E73] transition-colors" defaultValue="1" />
                         页
                     </div>
                 </div>
             </div>
        </div>
    </div>
  );

  const renderReportsView = () => (
      <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex-shrink-0">
                <h2 className="text-xl font-bold text-[#2D4965] tracking-tight flex items-center gap-3">
                    <span className="w-1.5 h-5 bg-[#27509F] rounded-full"></span>
                    报表管理
                </h2>
                <p className="text-[#92A2C3] text-xs font-medium mt-1.5 ml-4">查看与导出系统各类统计报表</p>
          </div>

          <div className="flex justify-between items-center">
               <div className="bg-white p-1 rounded-lg border border-gray-100 flex gap-1">
                   {['All', 'Energy', 'Savings', 'Alarm'].map(t => (
                       <button key={t} className="px-3 py-1.5 text-xs font-bold rounded-md hover:bg-gray-50 text-[#535E73] transition-colors">{t === 'All' ? '全部报表' : t}</button>
                   ))}
               </div>
               <button onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#225AC8] text-white text-sm font-bold rounded-lg hover:bg-[#1e4eaf] shadow-md shadow-blue-200 transition-all">
                   <Plus size={16}/> 生成新报表
               </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-[#F8FAFC] text-[#92A2C3] text-xs font-bold uppercase sticky top-0 z-10 border-b border-gray-50">
                          <tr>
                              <th className="px-6 py-4">报表名称</th>
                              <th className="px-4 py-4 text-center">类型</th>
                              <th className="px-4 py-4 text-center">格式</th>
                              <th className="px-4 py-4">统计时间范围</th>
                              <th className="px-4 py-4">创建人 / 时间</th>
                              <th className="px-4 py-4">状态</th>
                              <th className="px-6 py-4 text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {reports.map(report => (
                              <tr key={report.id} className="hover:bg-blue-50/20 transition-colors group">
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-4">
                                          <FormatIconBox format={report.format} />
                                          <div>
                                              <div className="font-bold text-[#2D4965] mb-1">{report.name}</div>
                                              <div className="text-[10px] text-[#92A2C3] font-mono flex items-center gap-1">
                                                  {report.fileSize} • {report.id}
                                              </div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                      <span className="bg-gray-100 text-[#535E73] text-[10px] px-2 py-1 rounded font-bold border border-gray-200 shadow-sm">
                                          {report.type}
                                      </span>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                      <span className="font-mono text-xs text-[#535E73] font-bold">{report.format}</span>
                                  </td>
                                  <td className="px-4 py-4 text-xs text-[#535E73] font-mono">{report.timeRange}</td>
                                  <td className="px-4 py-4 text-xs text-[#92A2C3]">
                                      <div className="text-[#535E73] font-bold mb-0.5">{report.creator}</div>
                                      <div className="font-mono text-[10px]">{report.createTime}</div>
                                  </td>
                                  <td className="px-4 py-4"><StatusBadge status={report.status} /></td>
                                  <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                          {report.status === 'GENERATED' && (
                                              <>
                                                  <button onClick={() => handleViewReport(report)} className="w-8 h-8 flex items-center justify-center rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all" title="预览"><Eye size={16}/></button>
                                                  <button className="w-8 h-8 flex items-center justify-center rounded-full text-green-600 bg-green-50 hover:bg-green-100 transition-all" title="下载"><Download size={16}/></button>
                                              </>
                                          )}
                                          <button className="w-8 h-8 flex items-center justify-center rounded-full text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all" title="编辑"><Edit size={16}/></button>
                                          <button onClick={() => handleDeleteReport(report.id)} className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition-all" title="删除"><Trash2 size={16}/></button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Pagination Footer - Added */}
              <div className="p-4 border-t border-gray-100 flex justify-end items-center gap-4 flex-shrink-0 bg-white rounded-b-xl">
                 <span className="text-xs text-[#92A2C3]">显示 1 到 {reports.length} 条，共 {reports.length} 条</span>
                 <div className="flex items-center gap-2">
                     <div className="relative">
                        <select className="bg-[#F8FAFC] border border-transparent hover:border-gray-200 text-xs text-[#535E73] rounded-lg px-2 py-1 outline-none cursor-pointer">
                            <option>10条/页</option>
                            <option>20条/页</option>
                            <option>50条/页</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                     </div>
                     <div className="flex gap-1">
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#92A2C3] hover:bg-gray-100 hover:text-[#535E73] transition-colors"><ChevronLeft size={14} /></button>
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#27509F] text-white text-xs font-bold shadow-md shadow-blue-200">1</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#535E73] hover:bg-gray-100 hover:text-[#27509F] transition-colors text-xs">2</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#92A2C3] hover:bg-gray-100 hover:text-[#535E73] transition-colors"><ChevronLeft size={14} className="rotate-180" /></button>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-[#92A2C3] ml-2">
                         前往
                         <input type="text" className="w-10 h-8 bg-[#F8FAFC] border border-transparent hover:border-gray-200 rounded-lg text-center outline-none focus:border-[#27509F] text-[#535E73] transition-colors" defaultValue="1" />
                         页
                     </div>
                 </div>
             </div>
          </div>
      </div>
  );

  const renderConfigView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Header Section */}
        <div className="flex-shrink-0 max-w-4xl mx-auto w-full">
            <h2 className="text-xl font-bold text-[#2D4965] flex items-center gap-3">
                <span className="w-1.5 h-5 bg-[#27509F] rounded-full"></span>
                报表配置
            </h2>
            <p className="text-xs text-[#92A2C3] mt-1.5 ml-4">配置自动化报表生成规则与模板</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
            {/* Automatic Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-[#2D4965] flex items-center gap-2"><Clock size={20} className="text-[#225AC8]"/> 自动报表任务</h3>
                        <p className="text-xs text-[#92A2C3] mt-1">设置系统定期生成并推送报表的规则</p>
                    </div>
                    <button 
                        onClick={() => setAutoSchedule(!autoSchedule)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${autoSchedule ? 'bg-[#225AC8]' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${autoSchedule ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>
                
                <div className={`p-6 space-y-6 transition-opacity ${autoSchedule ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-[#535E73] mb-2">生成频率</label>
                            <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#535E73] outline-none focus:border-[#225AC8]">
                                <option>每日 (Daily)</option>
                                <option>每周 (Weekly)</option>
                                <option>每月 (Monthly)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#535E73] mb-2">生成时间</label>
                            <input type="time" defaultValue="08:00" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#535E73] outline-none focus:border-[#225AC8]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-2">包含内容</label>
                        <div className="flex gap-4">
                            {['能耗统计 (Energy)', '节能分析 (Savings)', '告警汇总 (Alarms)', '设备运行 (Device)'].map((item, i) => (
                                <label key={i} className="flex items-center gap-2 cursor-pointer bg-[#F8FAFC] px-3 py-2 rounded-lg border border-gray-100 hover:border-blue-200 transition-all">
                                    <input type="checkbox" defaultChecked={i < 2} className="rounded text-[#225AC8] focus:ring-0" />
                                    <span className="text-sm text-[#535E73]">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-2">接收人邮箱 (分号分隔)</label>
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-[#92A2C3]"/>
                            <input 
                                type="text" 
                                value={emailRecipients}
                                onChange={(e) => setEmailRecipients(e.target.value)}
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#535E73] outline-none focus:border-[#225AC8]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-[#2D4965] flex items-center gap-2"><FileText size={20} className="text-[#225AC8]"/> 报表模板设置</h3>
                    <p className="text-xs text-[#92A2C3] mt-1">自定义报表的标题格式与页眉页脚</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#535E73] mb-2">默认标题格式</label>
                        <input type="text" defaultValue="{Year}年{Month}月_能耗统计报表_{StoreName}" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#535E73] font-mono outline-none focus:border-[#225AC8]" />
                        <p className="text-[10px] text-[#92A2C3] mt-1">可用变量: {`{Year}, {Month}, {Date}, {StoreName}, {ReportType}`} </p>
                    </div>
                </div>
            </div>

            {/* Footer with Save Button */}
            <div className="flex justify-end pt-4 pb-8">
                <button className="flex items-center gap-2 px-8 py-3 bg-[#27509F] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#1e4eaf] transition-all transform hover:-translate-y-0.5">
                    <Save size={18}/> 保存配置更改
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <>
        <GenerateReportModal 
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            onSubmit={handleGenerateReport}
        />
        <ReportPreviewModal 
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            report={selectedReport}
        />

        <div className="h-full flex flex-col bg-[#F4F5F9] rounded-2xl overflow-hidden">
            <div className="flex-1 min-w-0 h-full overflow-hidden">
                {activeTab === 'query' && renderQueryView()}
                {activeTab === 'reports' && renderReportsView()}
                {activeTab === 'config' && renderConfigView()}
            </div>
        </div>
    </>
  );
};

export default StatisticsManager;
