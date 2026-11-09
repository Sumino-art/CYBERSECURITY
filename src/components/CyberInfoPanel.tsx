import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Clock, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  HelpCircle,
  EyeOff
} from 'lucide-react';
import { detectClientEnvironment } from '../services/telemetry';
import { ClientConnectionInfo } from '../types';

export const CyberInfoPanel: React.FC = () => {
  const [telemetry, setTelemetry] = useState<ClientConnectionInfo | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const data = detectClientEnvironment();
    setTelemetry(data);

    const timer = setInterval(() => {
      const now = new Date();
      const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const thaiYear = now.getFullYear() + 543;
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setCurrentTime(`${now.getDate()} ${thaiMonths[now.getMonth()]} พ.ศ. ${thaiYear} เวลา ${timeStr} น.`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 md:py-10 space-y-8">
      {/* Panel Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Cpu className="h-4 w-4" />
          <span>CYBERSECURITY INFORMATION PANEL</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          แผงข้อมูลการตรวจสอบความปลอดภัยทางไซเบอร์
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          ข้อมูลเชิงเทคนิคของเซสชันการเชื่อมต่อและการให้ความรู้ด้านรอยเท้าดิจิทัล (Digital Footprint)
        </p>
      </div>

      {/* Real-time Session Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Access Time */}
        <div className="rounded-xl border border-slate-800 bg-[#090f1f] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>เวลาที่เข้าถึงระบบ</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-400">LIVE</span>
          </div>
          <p className="text-sm font-bold text-white font-mono break-words">
            {currentTime || telemetry?.accessTimeTh || 'กำลังซิงค์...'}
          </p>
          <p className="text-[11px] text-slate-400">
            เวลาตามมาตรฐานประเทศไทย (ICT / UTC+7)
          </p>
        </div>

        {/* Metric 2: Device Type */}
        <div className="rounded-xl border border-slate-800 bg-[#090f1f] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-amber-400" />
              <span>ประเภทอุปกรณ์</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{telemetry?.os}</span>
          </div>
          <p className="text-base font-bold text-white">
            {telemetry?.deviceType === 'Mobile' ? 'สมาร์ทโฟน (Mobile)' : telemetry?.deviceType === 'Tablet' ? 'แท็บเล็ต (Tablet)' : 'คอมพิวเตอร์ (Desktop)'}
          </p>
          <p className="text-[11px] text-slate-400">
            ขนาดจอ: {telemetry?.screenResolution || '1080p'}
          </p>
        </div>

        {/* Metric 3: Browser */}
        <div className="rounded-xl border border-slate-800 bg-[#090f1f] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>เว็บเบราว์เซอร์</span>
            </span>
            <span className="text-[10px] text-emerald-400">ตรวจพบ</span>
          </div>
          <p className="text-base font-bold text-white truncate" title={telemetry?.browser}>
            {telemetry?.browser || 'กำลังตรวจสอบ...'}
          </p>
          <p className="text-[11px] text-slate-400">
            ภาษา: {telemetry?.language || 'th-TH'}
          </p>
        </div>

        {/* Metric 4: Connection Security */}
        <div className="rounded-xl border border-slate-800 bg-[#090f1f] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              <span>ความปลอดภัยการเชื่อมต่อ</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">TLS 1.3</span>
          </div>
          <p className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>เข้ารหัสสมบูรณ์</span>
          </p>
          <p className="text-[11px] text-slate-400">
            โปรโตคอล: {telemetry?.connectionProtocol}
          </p>
        </div>
      </div>

      {/* Technical Truth & Ethical Transparency Disclosure */}
      <div className="rounded-2xl border border-blue-900/50 bg-[#091224] p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-white">
              การชี้แจงการประมวลผลข้อมูลการเชื่อมต่อและข้อจำกัดทางเทคนิค
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              เว็บไซต์นี้ประมวลผลข้อมูลการเชื่อมต่อเบื้องต้น (User-Agent และเซสชันเครือข่าย) เพื่อวัตถุประสงค์ในการป้องกันการโจมตีทางไซเบอร์ การป้องกันการปั่นระบบ และการรักษาความปลอดภัยของระบบเท่านั้น
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <EyeOff className="h-3.5 w-3.5 text-amber-400" />
              <span>ความจริงเกี่ยวกับหมายเลข IP</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              หมายเลข IP เป็นเพียงที่อยู่เครือข่ายของผู้ให้บริการอินเทอร์เน็ต (ISP) <span className="text-white font-medium">ไม่สามารถระบุพิกัดที่ตั้งบ้านพักหรือตัวบุคคลได้โดยตรง</span> โดยปราศจากคำสั่งศาลและหมายเรียกพยานเอกสารจากพนักงานสอบสวนตามกระบวนการยุติธรรม
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>การคุ้มครองความเป็นส่วนตัวที่เคร่งครัด</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ระบบนี้<span className="text-white font-medium">ไม่มีการดึงรหัส LINE OpenChat ID</span>, ไม่มีการเข้าถึงข้อมูลบัญชี LINE ส่วนตัว, ไม่มีการติดตามพิกัด GPS ดาวเทียม และไม่มีการจัดเก็บข้อมูลที่ไม่เกี่ยวข้อง
            </p>
          </div>
        </div>
      </div>

      {/* Cyber Awareness Education: Why Digital Evidence Leaves Traces */}
      <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-red-400" />
          <span>ทำไมการลบข้อความหรือ Unsend ในแชท จึงไม่สามารถทำลายหลักฐานได้?</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-red-400 font-bold shrink-0">01.</span>
            <p>
              <strong className="text-white">การบันทึกภาพหน้าจอทันที (Instant Screenshot):</strong> ในห้อง OpenChat หรือกลุ่มสาธารณะที่มีสมาชิกหลายพันคน ข้อความหรือภาพถ่ายจะถูกเห็นและบันทึกภาพเก็บไว้โดยสมาชิกในเสี้ยววินาที แม้คุณจะกดยกเลิกข้อความ (Unsend) หรือลบบัญชีออกไปแล้ว
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-red-400 font-bold shrink-0">02.</span>
            <p>
              <strong className="text-white">หลักฐานลายเซ็นดิจิทัล (Cryptographic Hash):</strong> ภาพแคปหน้าจอที่ถูกนำเข้าระบบนี้จะถูกคำนวณค่า SHA-256 Checksum ซึ่งเป็นลายนิ้วมือดิจิทัลที่สามารถพิสูจน์ต่อศาลได้ว่าไม่มีการดัดแปลงแก้ไขเนื้อหาภาพ
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-red-400 font-bold shrink-0">03.</span>
            <p>
              <strong className="text-white">บันทึกประวัติการเชื่อมต่อ (Server Access Logs):</strong> ผู้ให้บริการแพลตฟอร์มมีหน้าที่ตามกฎหมาย พ.ร.บ. คอมพิวเตอร์ ในการเก็บรักษาข้อมูลจราจรทางคอมพิวเตอร์ (Log) ไม่น้อยกว่า 90 วัน เพื่อส่งมอบให้เจ้าหน้าที่ตามหมายเรียก
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
