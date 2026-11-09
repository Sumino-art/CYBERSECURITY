import React from 'react';
import { ShieldAlert, Scale, Cpu, FolderCheck, Lock } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'warning', label: 'เตือนภัย', icon: ShieldAlert },
    { id: 'legal', label: 'กฎหมาย', icon: Scale },
    { id: 'telemetry', label: 'เซสชัน', icon: Cpu },
    { id: 'evidence', label: 'เก็บหลักฐาน', icon: FolderCheck },
    { id: 'admin', label: 'แอดมิน', icon: Lock },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#05070d]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 pb-safe">
      <div className="grid grid-cols-5 items-center h-13">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'text-red-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-red-500' : ''}`} />
              <span className="text-[11px] font-medium tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
