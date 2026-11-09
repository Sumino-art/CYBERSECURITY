import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WarningScreen } from './components/WarningScreen';
import { LegalWarningSection } from './components/LegalWarningSection';
import { CyberInfoPanel } from './components/CyberInfoPanel';
import { EvidencePreservation } from './components/EvidencePreservation';
import { AdminDashboard } from './components/AdminDashboard';
import { ShareableLinkModal } from './components/ShareableLinkModal';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('warning');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // URL query params
  const [roomParam, setRoomParam] = useState<string | undefined>();
  const [incidentParam, setIncidentParam] = useState<string | undefined>();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const room = params.get('room');
      const incident = params.get('incident');
      const tab = params.get('tab');

      if (room) setRoomParam(room);
      if (incident) setIncidentParam(incident);
      if (tab && ['warning', 'legal', 'telemetry', 'evidence', 'admin'].includes(tab)) {
        setActiveTab(tab);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 cyber-grid flex flex-col font-sans selection:bg-red-500/30 selection:text-red-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeTab === 'warning' && (
          <WarningScreen
            onNavigate={(tab) => setActiveTab(tab)}
            roomParam={roomParam}
            incidentTypeParam={incidentParam}
          />
        )}

        {activeTab === 'legal' && (
          <LegalWarningSection
            onPreserveEvidence={() => setActiveTab('evidence')}
          />
        )}

        {activeTab === 'telemetry' && (
          <CyberInfoPanel />
        )}

        {activeTab === 'evidence' && (
          <EvidencePreservation
            onNavigateAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Institutional Footer */}
      <footer className="border-t border-slate-900 bg-[#04060a] text-slate-400 py-6 px-4 sm:px-6 text-xs">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="font-bold text-slate-300">CYBER SHIELD AWARENESS INITIATIVE</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>ระบบรณรงค์ความตระหนักรู้ความปลอดภัยไซเบอร์</span>
          </div>

          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-slate-200 transition-colors underline-offset-4 hover:underline"
            >
              นโยบายความเป็นส่วนตัว
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="hover:text-slate-200 transition-colors underline-offset-4 hover:underline"
            >
              สร้างลิงก์เตือนภัย
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="font-mono text-[11px] text-slate-400">TLS 1.3 SECURED</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-4 pt-4 border-t border-slate-900/80 text-[11px] text-slate-400 text-center md:text-left leading-relaxed">
          ข้อสงวนสิทธิ์: เว็บไซต์นี้เป็นโครงการรณรงค์ความปลอดภัยไซเบอร์และการรวบรวมหลักฐานอิสระ มิใช่หน่วยงานราชการหรือสถานีตำรวจ และไม่มีเจตนาแอบอ้างเป็นเจ้าหน้าที่ หากท่านต้องการแจ้งความดำเนินคดี โปรดติดต่อสถานีตำรวจนครบาล/สภ. ท้องที่ หรือแจ้งความออนไลน์ที่ thaipoliceonline.go.th
        </div>
      </footer>

      {/* Modals */}
      <ShareableLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
