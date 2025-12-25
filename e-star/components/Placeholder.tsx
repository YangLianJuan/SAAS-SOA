import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="bg-background p-6 rounded-full mb-6">
        <Construction size={48} className="text-muted" />
      </div>
      <h2 className="text-2xl font-bold text-heading mb-2">{title}</h2>
      <p className="text-muted max-w-md">
        该功能模块正在开发中。请稍后查看更新。
      </p>
      <button className="mt-8 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm">
        返回首页
      </button>
    </div>
  );
};

export default Placeholder;