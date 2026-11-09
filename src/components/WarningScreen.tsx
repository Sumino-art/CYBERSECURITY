import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Scale, 
  FolderPlus, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  Hash
} from 'lucide-react';

interface WarningScreenProps {
  onNavigate: (tab: string) => void;
  roomParam?: string;
  incidentTypeParam?: string;
}

export const WarningScreen: React.FC<WarningScreenProps> = ({
  onNavigate,
  roomParam,
  incidentTypeParam,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const playWarningTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.36);
      setSoundEnabled(true);
    } catch {
      // Audio not permitted or supported
    }
  };

  return (
    <div className="relative overflow-hidden pt-4 pb-16 md:py-10">
      {/* Target Room Specific Banner (If accessed via OpenChat custom link) */}
      {roomParam && (
        <div className="mx-auto max-w-3xl mb-6 px-4">
          <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3.5 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-300">
                  แจ้งเตือนพฤติกรรมในห้องสนทนา
                </p>
                <p className="text-sm font-bold text-white mt-0.5">
                  ห้องแชทเป้าหมาย: <span className="text-red-400">{decodeURIComponent(roomParam)}</span>
                </p>
                {incidentTypeParam && (
                  <p className="text-xs text-slate-300 mt-1">
                    ประเภทพฤติกรรมที่พบการแจ้งเตือน: <span className="font-medium text-amber-300">{decodeURIComponent(incidentTypeParam)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Hero Container */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative rounded-2xl border border-red-900/60 bg-[#080d1a] p-6 sm:p-8 shadow-2xl cyber-glow-red overflow-hidden">
          {/* Subtle Top Indicator Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
          
          {/* Header Row with Sound Control */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-semibold tracking-wider">CYBER WARNING LEVEL: ACTIVE</span>
            </div>
            <button
              onClick={() => {
                if (!soundEnabled) {
                  playWarningTone();
                } else {
                  setSoundEnabled(false);
                }
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded bg-slate-900/60 border border-slate-800"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-red-400" />
                  <span>เสียงแจ้งเตือน: เปิด</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>ทดสอบเสียงเตือน</span>
                </>
              )}
            </button>
          </div>

          {/* Central Security Emblem */}
          <div className="flex justify-center my-6">
            <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl bg-gradient-to-b from-red-950/80 to-[#0c1424] border-2 border-red-500/60 shadow-xl shadow-red-950/50">
              <ShieldAlert className="h-12 w-12 sm:h-14 sm:w-14 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
              <div className="absolute -bottom-2 -right-2 rounded-full bg-red-600 p-1 text-white border-2 border-[#080d1a]">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug">
              คุณกำลังเข้าสู่ระบบแจ้งเตือนความปลอดภัยทางไซเบอร์
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-red-400/90 font-mono">
              CYBER SECURITY AWARENESS SYSTEM
            </p>
          </div>

          {/* Mandatory Prominent Thai Warning Block */}
          <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-5 sm:p-6 mb-8 text-center space-y-4">
            <p className="text-base sm:text-lg font-bold text-red-200 leading-relaxed">
              &ldquo;โลกออนไลน์ไม่ใช่พื้นที่ที่คุณจะทำร้ายใครก็ได้โดยไม่มีความรับผิดชอบ&rdquo;
            </p>
            <div className="h-px w-24 bg-red-500/30 mx-auto" />
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              การด่าทอ ประจาน ดูหมิ่น ข่มขู่ คุกคาม หรือเผยแพร่ข้อมูลส่วนบุคคลของผู้อื่น <span className="text-red-400 font-semibold underline decoration-red-500/50 underline-offset-4">อาจมีผลทางกฎหมาย</span>
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              ทุกข้อความ ภาพถ่าย และหลักฐานทางดิจิทัล อาจถูกนำมาใช้ประกอบการร้องเรียนหรือดำเนินการตามกฎหมายได้
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-lg bg-red-900/40 border border-red-500/40 text-red-300 font-bold text-sm sm:text-base">
                คิดก่อนโพสต์ ก่อนแชร์ และก่อนทำร้ายผู้อื่น
              </span>
            </div>
          </div>

          {/* 4 Critical Behaviors Discouraged */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">การคุกคามและการบูลลี่</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">การระดมด่าทอ ก่อกวน ส่งข้อความสร้างความเกลียดชังในกลุ่มแชท</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">หมิ่นประมาทและประจาน</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">ใส่ความผู้อื่นต่อบุคคลที่สาม ทำให้เสียชื่อเสียง หรือถูกเกลียดชัง</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400">
                <Hash className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">การข่มขู่และกรรโชก</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">ส่งข้อความข่มขู่ว่าจะทำร้าย สร้างความหวาดกลัวต่อสวัสดิภาพ</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Doxxing ละเมิดข้อมูลส่วนบุคคล</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">เปิดเผยเบอร์โทรศัพท์ ที่อยู่ หรือรูปถ่ายส่วนบุคคลโดยมิชอบ</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('legal')}
              className="flex-1 flex items-center justify-center gap-2 h-12 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all shadow-lg shadow-red-900/30 active:scale-[0.98]"
            >
              <Scale className="h-4 w-4" />
              <span>ศึกษาข้อกฎหมายและบทลงโทษ</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('evidence')}
              className="flex-1 flex items-center justify-center gap-2 h-12 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all active:scale-[0.98]"
            >
              <FolderPlus className="h-4 w-4 text-amber-400" />
              <span>ระบบรวบรวมหลักฐานดิจิทัล</span>
            </button>
          </div>

          {/* Mandatory Transparency Disclaimer */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
            <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-slate-300">ข้อความชี้แจงความโปร่งใส:</span> เว็บไซต์นี้เป็นโครงการรณรงค์ความตระหนักรู้ความปลอดภัยทางไซเบอร์อิสระ มิใช่เว็บไซต์ของหน่วยงานราชการหรือเจ้าหน้าที่ตำรวจ และไม่มีการอ้างว่าผู้เข้าชมถูกระบุตัวตน ติดตาม หรือถูกรายงาน เว้นแต่จะมีการยื่นหลักฐานโดยผู้เสียหายอย่างเป็นทางการ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
