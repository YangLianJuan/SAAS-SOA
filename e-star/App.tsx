
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Server, 
  Workflow, 
  Tags, 
  Award, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  User,
  Menu,
  LogOut,
  ChevronDown,
  Map,
  ShieldAlert,
  Activity,
  UserCog,
  Sliders,
  ChevronRight,
  FileText
} from 'lucide-react';
import { PageView } from './types';
import Dashboard from './components/Dashboard';
import DeviceManager from './components/DeviceManager';
import StrategyManager from './components/StrategyManager';
import CategoryManager from './components/CategoryManager';
import BrandManager from './components/BrandManager';
import SpaceManager from './components/SpaceManager';
import StatisticsManager from './components/StatisticsManager';
import SettingsManager from './components/SettingsManager';
import Placeholder from './components/Placeholder';

interface NavigationItem {
  id: string; // Can be a PageView or a Group ID
  label: string;
  icon: any;
  view?: PageView;
  children?: NavigationItem[];
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<PageView>(PageView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['statistics', 'settings']); // Default expand statistics and settings

  const navigation: NavigationItem[] = [
    { id: 'dashboard', view: PageView.DASHBOARD, label: '能耗大屏', icon: LayoutDashboard },
    { id: 'space', view: PageView.SPACE, label: '空间管理', icon: Map },
    { id: 'devices', view: PageView.DEVICES, label: '设备管理', icon: Server },
    { id: 'strategy', view: PageView.STRATEGY, label: '策略管理', icon: Workflow },
    { id: 'category', view: PageView.CATEGORY, label: '品类管理', icon: Tags },
    { id: 'brand', view: PageView.BRAND, label: '品牌管理', icon: Award },
    { 
      id: 'statistics', 
      label: '数据统计', 
      icon: BarChart3,
      children: [
        { id: 'statistics_query', view: PageView.STATISTICS_QUERY, label: '系统查询', icon: Search },
        { id: 'statistics_reports', view: PageView.STATISTICS_REPORTS, label: '报表管理', icon: FileText },
        { id: 'statistics_config', view: PageView.STATISTICS_CONFIG, label: '报表配置', icon: Settings },
      ]
    },
    { 
      id: 'settings', 
      label: '系统设置', 
      icon: Settings,
      children: [
        { id: 'settings_config', view: PageView.SETTINGS_CONFIG, label: '参数配置', icon: Sliders },
        { id: 'settings_users', view: PageView.SETTINGS_USERS, label: '用户权限', icon: UserCog },
        { id: 'settings_system', view: PageView.SETTINGS_SYSTEM, label: '系统监控', icon: Activity },
        { id: 'settings_audit', view: PageView.SETTINGS_AUDIT, label: '操作审计', icon: ShieldAlert },
      ]
    },
  ];

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNavClick = (item: NavigationItem) => {
    if (item.children) {
      toggleMenu(item.id);
    } else if (item.view) {
      setCurrentView(item.view);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case PageView.DASHBOARD:
        return <Dashboard />;
      case PageView.SPACE:
        return <SpaceManager />;
      case PageView.DEVICES:
        return <DeviceManager />;
      case PageView.STRATEGY:
        return <StrategyManager />;
      case PageView.CATEGORY:
        return <CategoryManager />;
      case PageView.BRAND:
        return <BrandManager />;
      case PageView.STATISTICS_QUERY:
        return <StatisticsManager initialTab="query" />;
      case PageView.STATISTICS_REPORTS:
        return <StatisticsManager initialTab="reports" />;
      case PageView.STATISTICS_CONFIG:
        return <StatisticsManager initialTab="config" />;
      case PageView.SETTINGS_CONFIG:
      case PageView.SETTINGS_USERS:
      case PageView.SETTINGS_SYSTEM:
      case PageView.SETTINGS_AUDIT:
        return <SettingsManager view={currentView} />;
      default:
        return <Placeholder title="Page Not Found" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F4F5F9] text-[#535E73] font-sans overflow-hidden selection:bg-blue-100">
      
      {/* 1. Top Navbar */}
      <header className="h-16 bg-white flex items-center justify-between px-6 z-20 flex-shrink-0 border-b border-gray-100/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#27509F] to-[#225AC8] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
            </div>
            <span className="text-xl font-bold text-[#2D4965] tracking-tight">EcoManage</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-lg text-[#92A2C3] transition-colors md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-[#F4F5F9] px-4 py-2 rounded-full border border-transparent focus-within:border-blue-100 focus-within:bg-white focus-within:shadow-sm transition-all duration-200 w-64">
            <Search size={16} className="text-[#92A2C3] mr-2" />
            <input 
              type="text" 
              placeholder="搜索设备、策略..." 
              className="bg-transparent border-none outline-none text-sm w-full text-[#535E73] placeholder-[#92A2C3]"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors text-[#535E73]">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-1 ring-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#225AC8]">
                <User size={18} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-[#2D4965] group-hover:text-[#225AC8] transition-colors">Admin</p>
                <p className="text-[10px] text-[#92A2C3] font-medium uppercase tracking-wide">System Admin</p>
              </div>
              <ChevronDown size={14} className="text-[#92A2C3]" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar */}
        <aside 
          className={`
            bg-[#27509F] flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col
            ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0'} 
            absolute md:relative z-10 h-full shadow-xl
          `}
        >
          <div className="flex-1 py-8 overflow-y-auto custom-scrollbar">
            <div className="px-6 mb-6">
              <p className="text-[11px] font-bold text-blue-200/60 uppercase tracking-widest">Main Navigation</p>
            </div>
            <nav className="space-y-1.5 px-4">
              {navigation.map((item) => {
                const isActive = item.view === currentView || (item.children && item.children.some(c => c.view === currentView));
                const isExpanded = expandedMenus.includes(item.id);
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
                        ${isActive && !item.children
                          ? 'bg-white/10 text-white shadow-inner' 
                          : 'text-blue-100/70 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3.5">
                        <item.icon size={18} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                        <span className="tracking-wide">{item.label}</span>
                      </div>
                      {item.children && (
                        <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      )}
                      {isActive && !item.children && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r-full"></div>
                      )}
                    </button>

                    {/* Submenu */}
                    {item.children && isExpanded && (
                      <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2 animate-in slide-in-from-top-1 duration-200">
                        {item.children.map(child => {
                          const isChildActive = child.view === currentView;
                          return (
                            <button
                              key={child.id}
                              onClick={() => handleNavClick(child)}
                              className={`
                                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200
                                ${isChildActive
                                  ? 'bg-white text-[#27509F] font-bold shadow-sm' 
                                  : 'text-blue-100/60 hover:text-white hover:bg-white/5'
                                }
                              `}
                            >
                              <child.icon size={14} />
                              <span>{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
          
          <div className="p-6 border-t border-white/10">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-blue-100/70 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium">
              <LogOut size={18} />
              <span>退出登录</span>
            </button>
          </div>
        </aside>

        {/* 3. Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F4F5F9] relative overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
            {renderContent()}
          </div>

          {/* 4. Footer */}
          <footer className="h-12 bg-white/50 backdrop-blur-sm border-t border-gray-100 flex items-center justify-between px-8 text-[11px] text-[#92A2C3] flex-shrink-0">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>System Status: <span className="text-green-600 font-medium">Operational</span></span>
             </div>
             <span>© 2024 EcoManage System. All rights reserved.</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
