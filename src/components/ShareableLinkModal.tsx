import React, { useState } from 'react';
import { Share2, X, Copy, CheckCircle2, ShieldAlert, ExternalLink, QrCode } from 'lucide-react';

interface ShareableLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareableLinkModal: React.FC<ShareableLinkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [roomName, setRoomName] = useState('');
  const [incidentType, setIncidentType] = useState('การด่าทอและหมิ่นประมาท');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const baseUrl = window.location.origin + window.location.pathname;
  const generatedUrl = roomName.trim()
    ? `${baseUrl}?room=${encodeURIComponent(roomName.trim())}&incident=${encodeURIComponent(incidentType)}`
    : baseUrl;

  const warningMessageTemplate = `⚠️ [แจ้งเตือนความปลอดภัยไซเบอร์ - CYBER SHIELD]
สมาชิกในห้อง "${roomName || 'ห้องสนทนานี้'}" โปรดระมัดระวังการส่งข้อความที่มีลักษณะ ${incidentType} การประจาน หรือละเมิดสิทธิส่วนบุคคล 
ข้อความ ภาพถ่าย และหลักฐานดิจิทัลสามารถถูกรวบรวมเพื่อดำเนินการตาม พ.ร.บ. คอมพิวเตอร์ฯ และกฎหมายอาญาได้
ตรวจสอบข้อกฎหมายและระบบแจ้งเตือน:
${generatedUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(warningMessageTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-red-900/60 bg-[#090f1f] p-6 space-y-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-950 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              สร้างลิงก์แจ้งเตือนสำหรับส่งในห้องแชท
            </h3>
            <p className="text-xs text-slate-400">
              สร้าง URL เตือนภัยที่เปิดได้ทันทีบนมือถือ พร้อมระบุชื่อห้องสนทนา
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">ชื่อห้องสนทนา หรือกลุ่มเป้าหมาย (ระบุหรือไม่ระบุก็ได้):</label>
            <input
              type="text"
              placeholder="เช่น LINE OpenChat ห้องเกม, กลุ่มตลาดนัด..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">ประเภทพฤติกรรมที่ต้องการเตือน:</label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="การด่าทอและหมิ่นประมาท">การด่าทอและหมิ่นประมาท (Defamation)</option>
              <option value="การข่มขู่คุกคาม">การข่มขู่คุกคามและขู่ทำร้าย (Threat)</option>
              <option value="การประจานข้อมูลส่วนตัว Doxxing">การประจานข้อมูลส่วนตัว (Doxxing / PDPA)</option>
              <option value="การไซเบอร์บูลลี่">การไซเบอร์บูลลี่ (Cyberbullying)</option>
              <option value="การคุกคามทางเพศ">การคุกคามทางเพศและภาพลามกอนาจาร</option>
            </select>
          </div>

          {/* Generated URL Box */}
          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 font-mono">ลิงก์แจ้งเตือนตรง (Direct Warning URL):</span>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-cyan-300 truncate">
                {generatedUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                {copiedLink ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
              </button>
            </div>
          </div>

          {/* Preset Chat Template */}
          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 font-mono">ข้อความแนะนำสำหรับคัดลอกส่งเข้ากลุ่ม:</span>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
              {warningMessageTemplate}
            </div>
            <button
              onClick={handleCopyTemplate}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedTemplate ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedTemplate ? 'คัดลอกข้อความพร้อมลิงก์แล้ว' : 'คัดลอกข้อความเตือนภัยพร้อมลิงก์'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
