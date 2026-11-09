import React from 'react';
import { ShieldCheck, X, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#090f1f] p-6 sm:p-8 space-y-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              นโยบายความเป็นส่วนตัวและมาตรฐานความปลอดภัย (Privacy & Security Policy)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              COMPLIANCE WITH PDPA & ETHICAL CYBERSECURITY STANDARDS
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>1. เจตนารมณ์และความเป็นอิสระของโครงการ</span>
            </h4>
            <p>
              เว็บไซต์ CYBER SHIELD เป็นระบบรณรงค์ความตระหนักรู้ด้านความปลอดภัยทางไซเบอร์อิสระ มิใช่หน่วยงานบังคับใช้กฎหมายของรัฐหรือสำนักงานตำรวจแห่งชาติ และไม่มีการแอบอ้างเป็นเจ้าหน้าที่ตำรวจทุกกรณี
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <EyeOff className="h-4 w-4 text-amber-400" />
              <span>2. หลักการไม่เก็บข้อมูลโดยพลการ (Zero Covert Tracking)</span>
            </h4>
            <p>
              ระบบนี้ไม่มีการดึงรหัสระบุตัวตน LINE OpenChat, ไม่เข้าถึงข้อมูลบัญชีแชทส่วนบุคคล, ไม่มีการเรียกขอพิกัดดาวเทียม (GPS) โดยไม่ได้รับอนุญาต และไม่มีการสร้างข้อมูลติดตามเท็จเพื่อข่มขู่ผู้ใช้งาน
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Lock className="h-4 w-4 text-blue-400" />
              <span>3. การรักษาความมั่นคงปลอดภัยของพยานหลักฐาน</span>
            </h4>
            <p>
              หลักฐานภาพถ่ายที่ผู้ใช้งานนำเข้าระบบ จะถูกเข้ารหัสคำนวณค่าลายนิ้วมือดิจิทัล SHA-256 Checksum ทันทีบนอุปกรณ์ของผู้ใช้ เพื่อเป็นหลักประกันความถูกต้องของพยานหลักฐาน (Chain of Custody) และมีเพียงผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้นที่สามารถเข้าถึงเพื่อประสานงานตามกฎหมายได้
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>4. สิทธิของเจ้าของข้อมูลส่วนบุคคล (Data Subject Rights)</span>
            </h4>
            <p>
              ผู้ใช้งานและผู้ยื่นเรื่องมีสิทธิในการขอตรวจสอบ ขอแก้ไข หรือขอลบข้อมูลสำนวนที่ตนเป็นผู้ยื่นได้ทุกเมื่อ โดยสามารถแจ้งรหัสสำนวนคดี (Case Number) มายังผู้ดูแลระบบ
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            รับทราบและปิดหน้านี้
          </button>
        </div>
      </div>
    </div>
  );
};
