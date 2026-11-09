import React, { useState, useRef } from 'react';
import { 
  FolderPlus, 
  Upload, 
  Trash2, 
  FileCheck, 
  Printer, 
  ShieldCheck, 
  AlertCircle, 
  Hash, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { calculateSHA256, generateCaseNumber } from '../services/crypto';
import { storageService } from '../services/storage';
import { IncidentCategory, IncidentRecord, IncidentSeverity, EvidenceFile } from '../types';

export const EvidencePreservation: React.FC<{ onNavigateAdmin?: () => void }> = () => {
  const [platform, setPlatform] = useState<string>('LINE OpenChat');
  const [roomName, setRoomName] = useState<string>('');
  const [offenderAlias, setOffenderAlias] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState<string>(
    `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
  );
  const [category, setCategory] = useState<IncidentCategory>('defamation');
  const [severity, setSeverity] = useState<IncidentSeverity>('high');
  const [offensiveMessages, setOffensiveMessages] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [reporterContact, setReporterContact] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);

  // Uploaded files with SHA-256
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIncident, setSubmittedIncident] = useState<IncidentRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsHashing(true);
    const newEvidence: EvidenceFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const hash = await calculateSHA256(file);
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });

        newEvidence.push({
          id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          filename: file.name,
          size: file.size,
          mimeType: file.type || 'image/png',
          dataUrl,
          sha256Hash: hash,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('File hashing error', err);
      }
    }

    setEvidenceFiles(prev => [...prev, ...newEvidence]);
    setIsHashing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setEvidenceFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !offensiveMessages.trim()) {
      alert('กรุณากรอกชื่อห้องแชท/กลุ่ม และข้อความที่เข้าข่ายการกระทำผิดให้ครบถ้วน');
      return;
    }

    if (!consentGiven) {
      alert('กรุณายินยอมให้จัดเก็บและประมวลผลข้อมูลหลักฐานเพื่อความถูกต้องตามระเบียบ');
      return;
    }

    setIsSubmitting(true);
    const caseNumber = generateCaseNumber();
    const newRecord: IncidentRecord = {
      id: `inc-${Date.now()}`,
      caseNumber,
      createdAt: new Date().toISOString(),
      incidentDate,
      incidentTime,
      platform,
      roomName: roomName.trim(),
      offenderAlias: offenderAlias.trim() || 'ไม่ทราบชื่อบัญชีที่แน่ชัด (Anonymous)',
      category,
      severity,
      offensiveMessages: offensiveMessages.trim(),
      description: description.trim(),
      evidenceFiles,
      status: 'pending',
      statusNotes: 'รับเรื่องผ่านระบบ Cyber Shield รอดำเนินการตรวจสอบความสมบูรณ์ของหลักฐาน',
      reporterContact: reporterContact.trim(),
      consentGiven,
      ipSessionHint: 'เซสชันเข้ารหัสความปลอดภัย',
    };

    const res = await storageService.saveIncident(newRecord);
    setIsSubmitting(false);

    if (res.success) {
      setSubmittedIncident(newRecord);
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (res.error || ''));
    }
  };

  const handlePrintDocket = () => {
    window.print();
  };

  const handleResetForm = () => {
    setSubmittedIncident(null);
    setRoomName('');
    setOffenderAlias('');
    setOffensiveMessages('');
    setDescription('');
    setEvidenceFiles([]);
    setReporterContact('');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <FolderPlus className="h-4 w-4" />
          <span>DIGITAL EVIDENCE PRESERVATION SYSTEM</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          ระบบบันทึกและรวบรวมหลักฐานดิจิทัล
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          เครื่องมือจัดทำสำนวนพยานหลักฐานอิเล็กทรอนิกส์ สำหรับผู้เสียหายหรือผู้พบเห็นเหตุการณ์คุกคามใน LINE OpenChat หรือโซเชียลมีเดีย พร้อมคำนวณค่า SHA-256 ป้องกันการถูกปฏิเสธในชั้นพนักงานสอบสวน
        </p>
      </div>

      {/* If Incident Submitted: Show Success Docket & Printable View */}
      {submittedIncident ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/40 bg-[#071312] p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FileCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    บันทึกพยานหลักฐานสำเร็จแล้ว
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono">
                    รหัสสำนวนคดี (Case Number): {submittedIncident.caseNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={handlePrintDocket}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors print:hidden"
              >
                <Printer className="h-4 w-4 text-emerald-400" />
                <span>พิมพ์ / บันทึก PDF</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ข้อมูลหลักฐานของคุณถูกบันทึกและสร้างรหัสค่าตรวจสอบความถูกต้อง (Digital Hash) เรียบร้อยแล้ว ท่านสามารถพิมพ์เอกสารนี้เพื่อนำไปยื่นต่อเจ้าหน้าที่ตำรวจ หรือยื่นผ่านเว็บไซต์ <span className="text-white font-semibold">thaipoliceonline.go.th</span>
            </p>
          </div>

          {/* Printable Official Docket Sheet */}
          <div id="printable-docket" className="rounded-2xl border border-slate-800 bg-[#070b14] p-6 sm:p-8 space-y-6 print:bg-white print:text-black print:border-black print:p-0">
            {/* Docket Header */}
            <div className="text-center pb-4 border-b border-slate-800 print:border-black space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 print:text-black">
                CONFIDENTIAL // DIGITAL EVIDENCE DOCKET
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white print:text-black">
                บันทึกการรวบรวมพยานหลักฐานดิจิทัลกรณีการคุกคามทางออนไลน์
              </h2>
              <p className="text-xs text-slate-400 print:text-gray-700">
                ระบบรักษาความปลอดภัยไซเบอร์และพิทักษ์สิทธิพลเมืองออนไลน์ (Cyber Shield)
              </p>
            </div>

            {/* Case Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-slate-400 print:text-gray-600 font-mono">รหัสคดีอ้างอิง:</span>
                <p className="font-bold text-base text-red-400 print:text-black font-mono">
                  {submittedIncident.caseNumber}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-slate-400 print:text-gray-600 font-mono">วันและเวลาที่เกิดเหตุ:</span>
                <p className="font-semibold text-white print:text-black">
                  {submittedIncident.incidentDate} เวลา {submittedIncident.incidentTime} น.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-slate-400 print:text-gray-600 font-mono">แพลตฟอร์ม & ชื่อห้องแชท:</span>
                <p className="font-semibold text-white print:text-black">
                  {submittedIncident.platform} - {submittedIncident.roomName}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-slate-400 print:text-gray-600 font-mono">ชื่อบัญชีผู้กระทำผิด (Alias):</span>
                <p className="font-semibold text-white print:text-black">
                  {submittedIncident.offenderAlias}
                </p>
              </div>
            </div>

            {/* Offense Content */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 print:text-gray-600">ข้อความที่เข้าข่ายการกระทำผิด (Quoted Messages):</span>
              <div className="p-4 rounded-xl bg-red-950/20 print:bg-gray-100 border border-red-900/40 print:border-gray-300">
                <p className="text-xs sm:text-sm font-mono text-red-200 print:text-black whitespace-pre-wrap leading-relaxed">
                  &ldquo;{submittedIncident.offensiveMessages}&rdquo;
                </p>
              </div>
            </div>

            {/* Description */}
            {submittedIncident.description && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 print:text-gray-600">รายละเอียดพฤติการณ์เพิ่มเติม:</span>
                <div className="p-3.5 rounded-xl bg-slate-900/60 print:bg-gray-50 border border-slate-800 print:border-gray-300 text-xs text-slate-300 print:text-black leading-relaxed whitespace-pre-wrap">
                  {submittedIncident.description}
                </div>
              </div>
            )}

            {/* Evidence Files List with SHA-256 Checksums */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 print:text-gray-600">
                รายการไฟล์หลักฐานดิจิทัลและรหัสตรวจสอบความถูกต้อง ({submittedIncident.evidenceFiles.length} ไฟล์):
              </span>

              {submittedIncident.evidenceFiles.length === 0 ? (
                <p className="text-xs text-slate-400 italic">ไม่มีไฟล์ภาพแนบ</p>
              ) : (
                <div className="space-y-2">
                  {submittedIncident.evidenceFiles.map((file, idx) => (
                    <div 
                      key={file.id}
                      className="p-3 rounded-lg bg-slate-900/70 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white print:text-black">
                          #{idx + 1} {file.filename} ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono print:text-gray-600">
                          {new Date(file.uploadedAt).toLocaleString('th-TH')}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono break-all text-emerald-400 print:text-black flex items-center gap-1.5">
                        <Hash className="h-3 w-3 shrink-0 text-slate-400" />
                        <span>SHA-256: {file.sha256Hash}</span>
                      </div>

                      {/* Thumbnail Preview */}
                      {file.dataUrl && (
                        <div className="pt-2">
                          <img 
                            src={file.dataUrl} 
                            alt={file.filename}
                            referrerPolicy="no-referrer"
                            className="max-h-60 rounded border border-slate-700 print:border-gray-400 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Officer Sign-off box for printing */}
            <div className="pt-6 border-t border-slate-800 print:border-black grid grid-cols-2 gap-8 text-xs text-center text-slate-400 print:text-black">
              <div>
                <p className="pb-12">ลงชื่อผู้รวบรวมหลักฐาน / ผู้เสียหาย</p>
                <p className="font-semibold text-white print:text-black">(........................................................)</p>
                <p className="text-[10px] text-slate-400 print:text-gray-600 mt-1">วันที่ ........ / ........ / ................</p>
              </div>
              <div>
                <p className="pb-12">ลงชื่อพนักงานสอบสวน / เจ้าหน้าที่ผู้รับเรื่อง</p>
                <p className="font-semibold text-white print:text-black">(........................................................)</p>
                <p className="text-[10px] text-slate-400 print:text-gray-600 mt-1">วันที่ ........ / ........ / ................</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 print:hidden">
            <button
              onClick={handleResetForm}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
            >
              บันทึกเหตุการณ์ใหม่
            </button>
            <button
              onClick={handlePrintDocket}
              className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              <span>พิมพ์เอกสารนี้</span>
            </button>
          </div>
        </div>
      ) : (
        /* Evidence Submission Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-7 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-amber-400" />
              <span>1. ข้อมูลสถานที่เกิดเหตุและวันเวลา</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Platform */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">แพลตฟอร์มที่เกิดเหตุ</label>
                <div className="relative">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 appearance-none"
                  >
                    <option value="LINE OpenChat">LINE OpenChat (สแควร์/โอเพนแชท)</option>
                    <option value="LINE Official / Group">LINE กลุ่มทั่วไป / แชทส่วนตัว</option>
                    <option value="Facebook">Facebook (กลุ่ม/เพจ/คอมเมนต์)</option>
                    <option value="X (Twitter)">X (Twitter)</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Discord">Discord</option>
                    <option value="Other">แพลตฟอร์มอื่น ๆ</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Room Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  ชื่อห้องสนทนา / กลุ่ม / ลิงก์ห้อง <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ห้องพูดคุยเกม ROV, กลุ่มตลาดนัดคอนโด..."
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Incident Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>วันที่เกิดเหตุ</span>
                </label>
                <input
                  type="date"
                  required
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Incident Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>เวลาที่เกิดเหตุโดยประมาณ</span>
                </label>
                <input
                  type="time"
                  required
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Offender and Content */}
          <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-7 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-red-400" />
              <span>2. ข้อมูลผู้กระทำผิดและพฤติการณ์</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-medium text-slate-300">ชื่อโปรไฟล์ / บัญชีผู้กระทำผิด</label>
                <input
                  type="text"
                  placeholder="เช่น Somchai_99, อวตารไม่ระบุชื่อ..."
                  value={offenderAlias}
                  onChange={(e) => setOffenderAlias(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-medium text-slate-300">ประเภทการกระทำผิด</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                    className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 appearance-none"
                  >
                    <option value="defamation">หมิ่นประมาท / ประจานใส่ร้าย</option>
                    <option value="cyberbullying">ไซเบอร์บูลลี่ / ด่าทอหยาบคาย</option>
                    <option value="threat_intimidation">ข่มขู่คุกคาม / ขู่ทำร้ายร่างกาย</option>
                    <option value="doxxing_privacy">Doxxing / เผยแพร่ข้อมูลส่วนตัว</option>
                    <option value="sexual_harassment">คุกคามทางเพศ / ส่งภาพลามก</option>
                    <option value="impersonation">สวมรอย / ปลอมแปลงโปรไฟล์</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-medium text-slate-300">ระดับความรุนแรง</label>
                <div className="relative">
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 appearance-none"
                  >
                    <option value="low">ระดับทั่วไป (Low)</option>
                    <option value="medium">ระดับปานกลาง (Medium)</option>
                    <option value="high">ระดับสูง (High)</option>
                    <option value="critical">ระดับวิกฤต/ฉุกเฉิน (Critical)</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Quoted messages */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-red-400" />
                  <span>ข้อความที่ถูกกระทำ (คัดลอกมาอย่างตรงไปตรงมา) <span className="text-red-400">*</span></span>
                </span>
                <span className="text-[10px] text-slate-400">ควรเป็นข้อความจริงเพื่อใช้เป็นหลักฐาน</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="ระบุข้อความที่ผู้กระทำผิดพิมพ์ด่าทอ ข่มขู่ หรือประจานให้ตรงกับข้อความจริงมากที่สุด..."
                value={offensiveMessages}
                onChange={(e) => setOffensiveMessages(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 leading-relaxed font-mono"
              />
            </div>

            {/* Incident Narrative */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                รายละเอียดเหตุการณ์เพิ่มเติม (พฤติการณ์และผลกระทบที่ได้รับ)
              </label>
              <textarea
                rows={3}
                placeholder="อธิบายว่าเกิดเหตุขึ้นอย่างไร มีสมาชิกในกลุ่มกี่คน ได้รับความเสียหายอย่างไรบ้าง มีการนำข้อมูลอะไรไปปล่อย..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Evidence Files Upload Section */}
          <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="h-5 w-5 text-cyan-400" />
                <span>3. อัปโหลดภาพแคปหน้าจอหลักฐาน (Screenshots & Digital Vault)</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                {evidenceFiles.length} ไฟล์ที่พร้อมแนบ
              </span>
            </div>

            <p className="text-xs text-slate-400">
              รองรับภาพแคปหน้าจอห้องแชท ข้อความ หรือโปรไฟล์ (JPG, PNG) ระบบจะคำนวณรหัส SHA-256 ของไฟล์โดยอัตโนมัติเพื่อใช้ยืนยันความบริสุทธิ์ของหลักฐานในกระบวนการยุติธรรม
            </p>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-6 text-center bg-slate-900/40 transition-colors space-y-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex justify-center">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                  <Upload className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs font-semibold text-white">
                แตะเพื่อเลือกภาพแคปหน้าจอ หรือลากไฟล์มาวางที่นี่
              </p>
              <p className="text-[11px] text-slate-400">
                {isHashing ? 'กำลังประมวลผลคำนวณค่า SHA-256 Checksum...' : 'รองรับรูปถ่ายหลายรูปพร้อมกัน'}
              </p>
            </div>

            {/* List of uploaded files */}
            {evidenceFiles.length > 0 && (
              <div className="space-y-2">
                {evidenceFiles.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {f.dataUrl && (
                        <img 
                          src={f.dataUrl} 
                          alt="preview" 
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded object-cover border border-slate-700 shrink-0" 
                        />
                      )}
                      <div className="truncate">
                        <p className="font-semibold text-white truncate">{f.filename}</p>
                        <p className="text-[10px] font-mono text-cyan-400 truncate">
                          SHA-256: {f.sha256Hash}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors shrink-0"
                      title="ลบไฟล์"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Consent */}
          <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>4. ความเป็นส่วนตัวและความยินยอม</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                ช่องทางติดต่อผู้ยื่นเรื่อง (อีเมลหรือเบอร์โทรศัพท์ - ระบุตามความสมัครใจ)
              </label>
              <input
                type="text"
                placeholder="อีเมล หรือเบอร์โทรศัพท์ (สำหรับใช้ติดตามความคืบหน้า)"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                className="w-full h-11 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                ข้าพเจ้ายืนยันว่าข้อมูลและหลักฐานที่นำเข้าระบบเป็นความจริง และยินยอมให้ระบบ Cyber Shield และผู้ดูแลระบบจัดเก็บ ประมวลผล และสร้างสำนวนพยานหลักฐานเพื่อการปกป้องสิทธิและการประสานงานตามกฎหมาย โดยเข้าใจว่าการแจ้งข้อความอันเป็นเท็จต่อเจ้าพนักงานอาจมีความผิดตามกฎหมาย
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isHashing}
              className="w-full flex items-center justify-center gap-2 h-13 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-950/40 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>กำลังประมวลผลและสร้างสำนวนคดี...</span>
              ) : (
                <>
                  <FileCheck className="h-5 w-5" />
                  <span>บันทึกหลักฐานและออกรหัสสำนวนคดี</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-400">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              หลักฐานที่บันทึกจะถูกเข้ารหัสและสามารถเข้าถึงได้โดยผู้ดูแลระบบและผู้ที่มีรหัสสำนวนคดีเท่านั้น
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
