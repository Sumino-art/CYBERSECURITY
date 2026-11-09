import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  BookOpen, 
  PhoneCall, 
  ChevronRight,
  HelpCircle,
  FileText
} from 'lucide-react';

interface ScenarioItem {
  id: string;
  title: string;
  scenario: string;
  laws: string[];
  criminalPenalty: string;
  civilPenalty: string;
}

export const LegalWarningSection: React.FC<{ onPreserveEvidence: () => void }> = ({
  onPreserveEvidence,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('defamation_chat');

  const scenarios: ScenarioItem[] = [
    {
      id: 'defamation_chat',
      title: 'แคปรูปมาประจาน ด่าทอใน OpenChat หรือกลุ่มสาธารณะ',
      scenario: 'นำภาพใบหน้า บัญชี หรือกล่าวหาผู้อื่นว่า "โกงเงิน", "หลอกลวง", "ขายตัว" ต่อหน้าสมาชิกในกลุ่ม',
      laws: [
        'ประมวลกฎหมายอาญา มาตรา 328 (หมิ่นประมาทโดยการโฆษณา)',
        'ประมวลกฎหมายอาญา มาตรา 393 (ดูหมิ่นด้วยการโฆษณา)',
        'พ.ร.บ. คอมพิวเตอร์ฯ มาตรา 14 (1) นำเข้าข้อมูลอันเป็นเท็จสู่ระบบคอมพิวเตอร์'
      ],
      criminalPenalty: 'จำคุกไม่เกิน 2 ปี และปรับไม่เกิน 200,000 บาท',
      civilPenalty: 'ฟ้องเรียกค่าสินไหมทดแทนเพื่อความเสียหายต่อชื่อเสียงและเกียรติยศ (มาตรา 423)'
    },
    {
      id: 'threat_harm',
      title: 'ส่งข้อความข่มขู่ ทำร้ายร่างกาย เอาชีวิต หรือดักทำร้าย',
      scenario: 'พิมพ์ข้อความข่มขู่ เช่น "ระวังตัวไว้ เดี๋ยวตามไปดักหน้าบ้าน", "ไม่ตายดีแน่"',
      laws: [
        'ประมวลกฎหมายอาญา มาตรา 392 (ทำให้ผู้อื่นเกิดความกลัวหรือตกใจโดยการขู่เข็ญ)',
        'ประมวลกฎหมายอาญา มาตรา 309 (ข่มขืนใจผู้อื่นให้กระทำการใดโดยทำให้กลัวว่าจะเกิดอันตราย)'
      ],
      criminalPenalty: 'จำคุกตั้งแต่ 1 เดือน ถึง 3 ปี หรือปรับ หรือทั้งจำทั้งปรับตามพฤติการณ์',
      civilPenalty: 'ชดใช้ค่าเสียหายทางแพ่ง และสามารถขอคำสั่งคุ้มครองชั่วคราวจากศาลได้'
    },
    {
      id: 'doxxing_pdpa',
      title: 'Doxxing ปล่อยเบอร์โทร เลขบัตร ที่อยู่ หรือที่ทำงาน',
      scenario: 'นำข้อมูลส่วนบุคคลของผู้เสียหายไปโพสต์เปิดวาร์ป เพื่อชักชวนให้คนอื่นรุมด่า หรือโทรก่อกวน',
      laws: [
        'พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) มาตรา 27 และ 79',
        'ประมวลกฎหมายอาญา มาตรา 397 (รังแก ข่มเหง คุกคาม หรือทำให้เดือดร้อนรำคาญ)'
      ],
      criminalPenalty: 'โทษจำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 500,000 บาท (โทษทางปกครองปรับสูงสุด 5 ล้านบาท)',
      civilPenalty: 'รับผิดชดใช้ค่าสินไหมทดแทน และศาลมีอำนาจสั่งให้ชดใช้ค่าสินไหมทดแทนเพื่อการลงโทษเพิ่มขึ้นได้อีก 2 เท่า'
    },
    {
      id: 'fake_profile',
      title: 'สร้างบัญชีอวตารปลอม สวมรอย แอบอ้างรูปภาพผู้อื่น',
      scenario: 'เอารูปถ่ายของผู้อื่นไปตั้งเป็นโปรไฟล์ แล้วไปโพสต์ข้อความหยาบคาย หรือไปหลอกยืมเงิน',
      laws: [
        'พ.ร.บ. คอมพิวเตอร์ฯ มาตรา 14 (1) นำเข้าข้อมูลบิดเบือนหรือปลอม',
        'ประมวลกฎหมายอาญา มาตรา 16 (ตัดต่อภาพทำให้ผู้อื่นเสียชื่อเสียง ถูกดูหมิ่น หรือได้รับความอับอาย)'
      ],
      criminalPenalty: 'จำคุกไม่เกิน 3 ปี และปรับไม่เกิน 200,000 บาท',
      civilPenalty: 'ชดใช้ค่าเสียหายจากการละเมิดสิทธิในภาพถ่ายและชื่อเสียง'
    }
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 md:py-10 space-y-10">
      {/* Legal Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-red-400">
          <Scale className="h-4 w-4" />
          <span>LEGAL COMPLIANCE & STATUTORY WARNING</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          คำเตือนเกี่ยวกับการกระทำผิดทางออนไลน์
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          การกระทำบนอินเทอร์เน็ตมีผลผูกพันทางกฎหมายเช่นเดียวกับโลกความเป็นจริง และสามารถดำเนินคดีได้ทั้งทางอาญาและทางแพ่ง
        </p>
        {/* Prominent Legal Action Statement */}
        <div className="rounded-xl border border-red-500/50 bg-red-950/30 p-4 mt-3 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-red-200 leading-relaxed">
            &ldquo;ผู้เสียหายสามารถรวบรวมหลักฐานและนำเรื่องร้องเรียนต่อหน่วยงานที่มีอำนาจได้ตามกฎหมาย&rdquo;
          </p>
        </div>
      </div>

      {/* 5 Core Thai Legal Frameworks */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          <span>บทบัญญัติแห่งกฎหมายไทยที่เกี่ยวข้อง</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: หมิ่นประมาท */}
          <div className="rounded-xl border border-slate-800 bg-[#080d19] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-red-400">ประมวลกฎหมายอาญา</span>
              <span className="text-[11px] font-semibold text-slate-400">มาตรา 326, 328</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              ความผิดฐานหมิ่นประมาทโดยการโฆษณา
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              ผู้ใดใส่ความผู้อื่นต่อบุคคลที่สาม โดยประการที่น่าจะทำให้ผู้อื่นนั้นเสียชื่อเสียง ถูกดูหมิ่น หรือถูกเกลียดชัง ถ้ากระทำด้วยการโฆษณาด้วยเอกสาร ภาพวาด ภาพระบายสี ภาพยนตร์ หรือการกระจายภาพ
            </p>
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-xs font-semibold text-red-300">
                ระวางโทษ: จำคุกไม่เกิน 2 ปี และปรับไม่เกิน 200,000 บาท
              </p>
            </div>
          </div>

          {/* Card 2: พ.ร.บ. คอมพิวเตอร์ */}
          <div className="rounded-xl border border-slate-800 bg-[#080d19] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400">พ.ร.บ. คอมพิวเตอร์ พ.ศ. 2560</span>
              <span className="text-[11px] font-semibold text-slate-400">มาตรา 14, 16</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              การนำเข้าข้อมูลเท็จ และการตัดต่อภาพผู้อื่น
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              การนำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลคอมพิวเตอร์ปลอมไม่ว่าทั้งหมดหรือบางส่วน หรือข้อมูลอันเป็นเท็จ หรือการนำภาพของผู้อื่นไปตัดต่อ ดัดแปลง ทำให้เสียชื่อเสียงหรืออับอาย
            </p>
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-xs font-semibold text-cyan-300">
                ระวางโทษ: จำคุกไม่เกิน 3-5 ปี หรือปรับไม่เกิน 100,000-200,000 บาท
              </p>
            </div>
          </div>

          {/* Card 3: ข่มขู่ คุกคาม */}
          <div className="rounded-xl border border-slate-800 bg-[#080d19] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400">ประมวลกฎหมายอาญา</span>
              <span className="text-[11px] font-semibold text-slate-400">มาตรา 392, 397</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              ความผิดฐานทำให้ผู้อื่นตกใจกลัว & รังแกคุกคาม
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              ผู้ใดทำให้ผู้อื่นเกิดความกลัวหรือความตกใจ โดยการขู่เข็ญ หรือกระทำการใดๆ ต่อผู้อื่นอันเป็นการรังแก ข่มเหง คุกคาม หรือกระทำให้ได้รับความเดือดร้อนรำคาญในที่สาธารณะหรือทางออนไลน์
            </p>
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-xs font-semibold text-amber-300">
                ระวางโทษ: จำคุกตั้งแต่ 1 เดือน ถึง 3 ปี หรือปรับตามพฤติการณ์แห่งคดี
              </p>
            </div>
          </div>

          {/* Card 4: PDPA & ละเมิดข้อมูลส่วนบุคคล */}
          <div className="rounded-xl border border-slate-800 bg-[#080d19] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400">พ.ร.บ. ข้อมูลส่วนบุคคล (PDPA)</span>
              <span className="text-[11px] font-semibold text-slate-400">มาตรา 27, 79</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              การเปิดเผยข้อมูลส่วนบุคคลโดยมิชอบ (Doxxing)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              การนำข้อมูลส่วนบุคคลของผู้อื่น เช่น ชื่อ-สกุล เบอร์โทรศัพท์ ที่อยู่ ภาพถ่าย หรือประวัติส่วนบุคคล ไปเปิดเผยต่อสาธารณะโดยไม่ได้รับความยินยอม ทำให้ผู้อื่นได้รับความเสียหาย
            </p>
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-xs font-semibold text-emerald-300">
                ระวางโทษ: โทษจำคุกสูงสุด 1 ปี ปรับสูงสุด 1 ล้านบาท และโทษทางปกครองสูงสุด 5 ล้านบาท
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scenario & Penalty Simulator */}
      <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-6 space-y-5">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-amber-400" />
            <span>จำลองการวิเคราะห์คดีตามพฤติกรรม (Incident Legal Breakdown)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            เลือกประเภทพฤติกรรมที่เกิดขึ้น เพื่อดูฐานความผิดและบทลงโทษที่สามารถดำเนินการได้จริง
          </p>
        </div>

        {/* Scenario Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`p-3 rounded-xl text-left border transition-all text-xs font-medium flex items-center justify-between ${
                selectedScenario === sc.id
                  ? 'border-red-500 bg-red-950/30 text-white shadow-sm'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="truncate pr-2">{sc.title}</span>
              <ChevronRight className={`h-4 w-4 shrink-0 ${selectedScenario === sc.id ? 'text-red-400' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>

        {/* Selected Scenario Breakdown Card */}
        <div className="rounded-xl border border-slate-800 bg-[#0d1526] p-4 sm:p-5 space-y-4">
          <div>
            <span className="text-[11px] font-mono text-red-400 font-semibold">พฤติการณ์ตัวอย่าง:</span>
            <p className="text-sm font-bold text-white mt-0.5">{currentScenario.scenario}</p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-semibold">ฐานความผิดที่เข้าข่าย:</span>
            <ul className="space-y-1">
              {currentScenario.laws.map((law, i) => (
                <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{law}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50">
              <span className="text-[10px] font-mono text-red-300 font-bold">โทษทางอาญา (Criminal Penalty):</span>
              <p className="text-xs font-semibold text-white mt-1">{currentScenario.criminalPenalty}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/50">
              <span className="text-[10px] font-mono text-blue-300 font-bold">ความรับผิดทางแพ่ง (Civil Liability):</span>
              <p className="text-xs font-semibold text-white mt-1">{currentScenario.civilPenalty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Reporting Channels for Victims */}
      <div className="rounded-2xl border border-slate-800 bg-[#080d1a] p-5 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-emerald-400" />
          <span>ช่องทางการนำหลักฐานเข้าแจ้งความและร้องเรียนอย่างเป็นทางการ</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          หากท่านตกเป็นผู้เสียหาย สามารถนำรายงานบันทึกหลักฐานดิจิทัลที่สร้างจากระบบนี้ ไปยื่นเรื่องต่อหน่วยงานที่มีอำนาจตามกฎหมายได้ทันที:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* CCIB 1441 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">กองบัญชาการตำรวจสืบสวนอาชญากรรมทางเทคโนโลยี (บช.สอท.)</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">สายด่วน 1441</span>
            </div>
            <p className="text-xs text-slate-400">
              ศูนย์รับแจ้งความอาชญากรรมทางเทคโนโลยี ตำรวจไซเบอร์ ตลอด 24 ชั่วโมง
            </p>
          </div>

          {/* Thai Police Online */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">ระบบรับแจ้งความออนไลน์ สำนักงานตำรวจแห่งชาติ</span>
              <a 
                href="https://thaipoliceonline.go.th" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
              >
                thaipoliceonline.go.th
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-slate-400">
              ยื่นคำร้องทุกข์ออนไลน์พร้อมแนบไฟล์หลักฐานและรับหมายเลขอ้างอิงคดี
            </p>
          </div>

          {/* Local Police */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">สถานีตำรวจนครบาล / สภ. ท้องที่</span>
              <span className="text-xs text-slate-400">ทั่วประเทศ</span>
            </div>
            <p className="text-xs text-slate-400">
              แจ้งความต่อพนักงานสอบสวนในท้องที่ที่ท่านพักอาศัย หรือท้องที่ที่เกิดเหตุ
            </p>
          </div>

          {/* 1212 ETDA */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">ศูนย์ช่วยเหลือและจัดการปัญหาออนไลน์ (1212 ETDA)</span>
              <span className="text-xs font-mono text-cyan-400 font-bold">โทร 1212</span>
            </div>
            <p className="text-xs text-slate-400">
              รับเรื่องร้องเรียนภัยคุกคามทางออนไลน์และการประสานงานระงับข้อความ
            </p>
          </div>
        </div>

        {/* CTA to collect evidence */}
        <div className="pt-3">
          <button
            onClick={onPreserveEvidence}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98]"
          >
            <FileText className="h-4 w-4" />
            <span>เริ่มต้นรวบรวมหลักฐานเพื่อเตรียมเอกสารแจ้งความ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
