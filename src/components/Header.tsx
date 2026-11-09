import React from 'react';
import { ShieldAlert, Share2, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenShareModal: () => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenShareModal,
  isAdminLoggedIn,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#05070d]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('warning')}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/80 border border-red-500/40 text-red-500 shadow-sm">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            CYBER SHIELD
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('warning')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'warning'
                ? 'text-red-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            แจ้งเตือน
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'legal'
                ? 'text-red-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            ข้อกฎหมาย
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'telemetry'
                ? 'text-red-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            ความปลอดภัยเซสชัน
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'evidence'
                ? 'text-red-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            รวบรวมหลักฐาน
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'admin'
                ? 'text-blue-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{isAdminLoggedIn ? 'ศูนย์ควบคุม' : 'ผู้ดูแลระบบ'}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600/90 hover:bg-red-500 rounded-lg border border-red-500/50 shadow-sm transition-colors whitespace-nowrap shrink-0 active:scale-95"
            title="สร้างลิงก์แจ้งเตือนเพื่อแชร์ใน LINE OpenChat หรือโซเชียลมีเดีย"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">สร้างลิงก์แจ้งเตือน</span>
            <span className="sm:hidden">แชร์เตือนภัย</span>
          </button>
        </div>
      </div>
    </header>
  );
};
