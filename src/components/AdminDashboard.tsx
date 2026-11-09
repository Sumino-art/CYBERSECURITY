import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  FolderCheck, 
  Eye, 
  Trash2, 
  Download, 
  Database, 
  History, 
  Search, 
  CheckCircle, 
  X, 
  Copy, 
  Hash, 
  ChevronRight,
  Printer
} from 'lucide-react';
import { storageService, SupabaseConfig } from '../services/storage';
import { IncidentRecord, AuditLogEntry, IncidentStatus, IncidentCategory } from '../types';

interface AdminDashboardProps {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'evidence' | 'analytics' | 'audit' | 'supabase'>('records');

  // Data states
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(storageService.getSupabaseConfig());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal inspection
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('pending');
  const [statusNote, setStatusNote] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Supabase input fields
  const [sbUrl, setSbUrl] = useState('');
  const [sbKey, setSbKey] = useState('');
  const [sbConnectMsg, setSbConnectMsg] = useState('');

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadData();
    }
  }, [isAdminLoggedIn]);

  const loadData = async () => {
    const incs = await storageService.getIncidents();
    const logs = await storageService.getAuditLogs();
    setIncidents(incs);
    setAuditLogs(logs);
    setSupabaseConfig(storageService.getSupabaseConfig());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default administrative passcode: cybershield2026 or admin
    if (passcode === 'cybershield2026' || passcode === 'admin' || passcode === 'shield123') {
      setIsAdminLoggedIn(true);
      setErrorMsg('');
      storageService.addAuditLog('ADMIN_LOGIN', 'administrator', 'เข้าสู่ระบบศูนย์ควบคุมความปลอดภัย (Admin Console)');
    } else {
      setErrorMsg('รหัสผ่านไม่ถูกต้อง (รหัสทดสอบ: cybershield2026)');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    storageService.addAuditLog('ADMIN_LOGOUT', 'administrator', 'ออกจากระบบศูนย์ควบคุม');
  };

  const handleStatusUpdate = async () => {
    if (!selectedIncident) return;
    const success = await storageService.updateIncidentStatus(
      selectedIncident.id,
      newStatus,
      statusNote,
      'administrator'
    );
    if (success) {
      await loadData();
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus, statusNotes: statusNote } : null);
      alert('ปรับปรุงสถานะและบันทึกข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณต้องการลบรายงานเหตุการณ์นี้และหลักฐานที่เกี่ยวข้องออกจากระบบหรือไม่?')) {
      const success = await storageService.deleteIncident(id, 'administrator');
      if (success) {
        await loadData();
        setSelectedIncident(null);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['CaseNumber', 'Date', 'Time', 'Platform', 'RoomName', 'OffenderAlias', 'Category', 'Severity', 'Status', 'Messages', 'EvidenceCount'];
    const rows = incidents.map(inc => [
      `"${inc.caseNumber}"`,
      `"${inc.incidentDate}"`,
      `"${inc.incidentTime}"`,
      `"${inc.platform}"`,
      `"${inc.roomName.replace(/"/g, '""')}"`,
      `"${inc.offenderAlias.replace(/"/g, '""')}"`,
      `"${inc.category}"`,
      `"${inc.severity}"`,
      `"${inc.status}"`,
      `"${inc.offensiveMessages.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      inc.evidenceFiles.length
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cyber_incidents_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    storageService.addAuditLog('EXPORT_CSV', 'administrator', `ส่งออกรายงานสรุปทั้งหมด ${incidents.length} รายการในรูปแบบ CSV`);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleConnectSupabase = async () => {
    setSbConnectMsg('กำลังทดสอบการเชื่อมต่อ...');
    const result = await storageService.setSupabaseConfig(sbUrl.trim(), sbKey.trim());
    if (result.success) {
      setSbConnectMsg('เชื่อมต่อ Supabase สำเร็จเรียบร้อยแล้ว!');
      setSupabaseConfig(storageService.getSupabaseConfig());
      await loadData();
    } else {
      setSbConnectMsg('ไม่สามารถเชื่อมต่อได้: ' + (result.error || 'กรุณาตรวจสอบ URL หรือ Anon Key'));
    }
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    const matchSearch = searchQuery === '' || 
      inc.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.offenderAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.offensiveMessages.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || inc.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || inc.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  // Calculate statistics
  const totalCases = incidents.length;
  const pendingCases = incidents.filter(i => i.status === 'pending').length;
  const verifiedCases = incidents.filter(i => i.status === 'verified').length;
  const escalatedCases = incidents.filter(i => i.status === 'escalated_to_authorities').length;

  if (!isAdminLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="rounded-2xl border border-blue-900/50 bg-[#070b14] p-6 sm:p-8 shadow-2xl space-y-6 cyber-glow-blue">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-950/80 border border-blue-500/40 text-blue-400">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              เข้าสู่ระบบศูนย์ควบคุมผู้ดูแลระบบ
            </h2>
            <p className="text-xs text-slate-400">
              CYBER SHIELD COMMAND & EVIDENCE MANAGEMENT
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                รหัสผ่านความปลอดภัย (Admin Passcode)
              </label>
              <input
                type="password"
                required
                placeholder="ระบุรหัสผ่านเข้าศูนย์ควบคุม..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full h-12 px-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Unlock className="h-4 w-4" />
              <span>ยืนยันเข้าสู่ระบบ</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                setPasscode('cybershield2026');
              }}
              className="text-xs text-blue-400 hover:underline"
            >
              คลิกเพื่อเติมรหัสทดสอบสาธิต (cybershield2026)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-10 space-y-8">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <Lock className="h-3.5 w-3.5" />
            <span>AUTHENTICATED ADMINISTRATOR PORTAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1">
            ศูนย์ควบคุมและบริหารจัดการสำนวนหลักฐาน
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-blue-400" />
            <span>ส่งออก CSV</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl border border-red-900/40 transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#090f1f] p-4">
          <span className="text-xs text-slate-400 font-mono">คดีที่บันทึกทั้งหมด</span>
          <p className="text-2xl font-extrabold text-white font-mono mt-1 tabular-nums">{totalCases}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#090f1f] p-4">
          <span className="text-xs text-amber-400 font-mono">รอดำเนินการตรวจสอบ</span>
          <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1 tabular-nums">{pendingCases}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#090f1f] p-4">
          <span className="text-xs text-emerald-400 font-mono">ตรวจรับรองหลักฐานแล้ว</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 tabular-nums">{verifiedCases}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#090f1f] p-4">
          <span className="text-xs text-red-400 font-mono">ส่งต่อแจ้งความดำเนินคดี</span>
          <p className="text-2xl font-extrabold text-red-400 font-mono mt-1 tabular-nums">{escalatedCases}</p>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveSubTab('records')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'records'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          สำนวนเหตุการณ์ ({incidents.length})
        </button>
        <button
          onClick={() => setActiveSubTab('evidence')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSubTab === 'evidence'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          คลังภาพหลักฐานดิจิทัล
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'audit'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('supabase')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'supabase'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>Supabase & RLS</span>
        </button>
      </div>

      {/* Subtab 1: Incident Records Table */}
      {activeSubTab === 'records' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="ค้นหาตามรหัสคดี, ชื่อห้อง, หรือข้อความ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="pending">รอตรวจสอบ</option>
                <option value="verified">ตรวจสอบแล้ว</option>
                <option value="escalated_to_authorities">ส่งต่อแจ้งความ</option>
                <option value="archived">จัดเก็บ</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="all">ทุกประเภทความผิด</option>
                <option value="defamation">หมิ่นประมาท</option>
                <option value="cyberbullying">ไซเบอร์บูลลี่</option>
                <option value="threat_intimidation">ข่มขู่คุกคาม</option>
                <option value="doxxing_privacy">Doxxing</option>
                <option value="sexual_harassment">คุกคามทางเพศ</option>
              </select>
            </div>
          </div>

          {/* Incidents Table */}
          <div className="rounded-xl border border-slate-800 bg-[#080d19] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-mono">รหัสคดี</th>
                    <th className="py-3 px-4">วัน-เวลา</th>
                    <th className="py-3 px-4">แพลตฟอร์ม / ห้อง</th>
                    <th className="py-3 px-4">ประเภท</th>
                    <th className="py-3 px-4">สถานะ</th>
                    <th className="py-3 px-4">หลักฐาน</th>
                    <th className="py-3 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        ไม่พบข้อมูลสำนวนเหตุการณ์ที่ตรงกับเงื่อนไข
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {inc.caseNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {inc.incidentDate} {inc.incidentTime}
                        </td>
                        <td className="py-3 px-4 max-w-[200px] truncate" title={inc.roomName}>
                          <span className="text-white font-medium">{inc.platform}</span>
                          <span className="block text-[11px] text-slate-400 truncate">{inc.roomName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize">{inc.category.replace('_', ' ')}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            inc.status === 'verified'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : inc.status === 'escalated_to_authorities'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {inc.status === 'verified' ? 'ตรวจสอบแล้ว' : inc.status === 'escalated_to_authorities' ? 'แจ้งความแล้ว' : 'รอตรวจสอบ'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {inc.evidenceFiles.length} รูป
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedIncident(inc);
                                setNewStatus(inc.status);
                                setStatusNote(inc.statusNotes || '');
                              }}
                              className="p-1.5 hover:bg-slate-700 text-blue-400 rounded transition-colors"
                              title="ดูรายละเอียดและปรับปรุงสถานะ"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(inc.id)}
                              className="p-1.5 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded transition-colors"
                              title="ลบสำนวน"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Evidence Gallery */}
      {activeSubTab === 'evidence' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#080d19] p-4 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-white">คลังจัดเก็บไฟล์หลักฐานภาพดิจิทัล (Digital Vault)</p>
            <p>ไฟล์ภาพทุกภาพถูกบันทึกพร้อมค่า SHA-256 Checksum เพื่อใช้แสดงความน่าเชื่อถือในชั้นศาลตาม พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incidents.flatMap(inc => inc.evidenceFiles.map(file => ({ ...file, caseNumber: inc.caseNumber, roomName: inc.roomName }))).length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                ยังไม่มีไฟล์หลักฐานถูกอัปโหลดในระบบ
              </div>
            ) : (
              incidents.flatMap(inc => inc.evidenceFiles.map(file => ({ ...file, caseNumber: inc.caseNumber, roomName: inc.roomName }))).map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-800 bg-[#090f1f] p-4 space-y-3">
                  <div className="aspect-video w-full rounded-lg bg-black overflow-hidden border border-slate-800 flex items-center justify-center">
                    {item.dataUrl ? (
                      <img 
                        src={item.dataUrl} 
                        alt={item.filename}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain" 
                      />
                    ) : (
                      <span className="text-slate-600 text-xs">No preview available</span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono">{item.caseNumber}</span>
                      <span className="text-slate-400 text-[10px]">{(item.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <p className="text-slate-400 truncate">{item.filename}</p>

                    <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400 break-all flex items-center justify-between gap-2">
                      <span className="truncate">SHA: {item.sha256Hash}</span>
                      <button
                        onClick={() => handleCopyHash(item.sha256Hash)}
                        className="shrink-0 p-1 hover:text-white"
                        title="Copy SHA-256"
                      >
                        {copiedHash === item.sha256Hash ? (
                          <CheckCircle className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Subtab 3: Audit Log */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#080d19] overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">บันทึกประวัติการกระทำของผู้ดูแล (Administrative Audit Log)</h3>
                <p className="text-xs text-slate-400">บันทึกการเข้าสู่ระบบ การเปลี่ยนสถานะ และการส่งออกข้อมูลโดยไม่สามารถลบแก้ไขได้</p>
              </div>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400 text-[11px]">{log.action}</span>
                      {log.caseNumber && (
                        <span className="font-mono text-slate-300 font-semibold">[{log.caseNumber}]</span>
                      )}
                      <span className="text-slate-400 text-[10px]">โดย {log.actor}</span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleString('th-TH')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Supabase Connection & RLS */}
      {activeSubTab === 'supabase' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-900/50 bg-[#071312] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    สถานะการเชื่อมต่อ Supabase Database & Storage
                  </h3>
                  <p className="text-xs text-slate-400">
                    Row Level Security (RLS) & Cloud Storage Integration
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                supabaseConfig.isConnected
                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-900/80 text-amber-300 border border-amber-500/40'
              }`}>
                {supabaseConfig.isConnected ? 'เชื่อมต่อ Supabase แล้ว' : 'ใช้ระบบ Local Vault สำรอง'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ระบบนี้รองรับการทำงานกับ Supabase โดยตรง เมื่อระบุ Supabase URL และ Anon Key ข้อมูลสำนวนคดีและไฟล์หลักฐานจะถูกซิงค์ไปยังตาราง <code className="text-emerald-300 font-mono">cyber_incidents</code> และบัคเก็ต <code className="text-emerald-300 font-mono">evidence_vault</code> โดยมี Row Level Security ควบคุมสิทธิ์
            </p>

            {/* Supabase Config Form */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={sbUrl}
                  onChange={(e) => setSbUrl(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={sbKey}
                  onChange={(e) => setSbKey(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-cyan-400">{sbConnectMsg}</span>
              <button
                onClick={handleConnectSupabase}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                บันทึกการเชื่อมต่อ Supabase
              </button>
            </div>
          </div>

          {/* SQL DDL Schema viewer */}
          <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">SUPABASE SQL SCHEMA & RLS SCRIPT</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(storageService.getSupabaseSQLSchema());
                  alert('คัดลอกโค้ด SQL ไปยังคลิปบอร์ดแล้ว');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>คัดลอก SQL</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72">
              {storageService.getSupabaseSQLSchema()}
            </pre>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#090f1f] p-6 space-y-6 shadow-2xl">
            <button
              onClick={() => setSelectedIncident(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-red-400 font-bold">{selectedIncident.caseNumber}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">{selectedIncident.platform}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {selectedIncident.roomName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-mono">ผู้กระทำผิด (Alias):</span>
                <p className="font-semibold text-white mt-0.5">{selectedIncident.offenderAlias}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-mono">วัน-เวลาเกิดเหตุ:</span>
                <p className="font-semibold text-white mt-0.5">{selectedIncident.incidentDate} {selectedIncident.incidentTime}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-400">ข้อความคุกคาม:</span>
              <p className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-xs font-mono text-red-200 whitespace-pre-wrap">
                {selectedIncident.offensiveMessages}
              </p>
            </div>

            {selectedIncident.description && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-400">รายละเอียดพฤติการณ์:</span>
                <p className="p-3 rounded-xl bg-slate-900 text-xs text-slate-300">
                  {selectedIncident.description}
                </p>
              </div>
            )}

            {/* Evidence Files List */}
            {selectedIncident.evidenceFiles.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400">ไฟล์หลักฐาน ({selectedIncident.evidenceFiles.length}):</span>
                <div className="space-y-2">
                  {selectedIncident.evidenceFiles.map(file => (
                    <div key={file.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">{file.filename}</p>
                        <p className="text-[10px] font-mono text-emerald-400">SHA-256: {file.sha256Hash}</p>
                      </div>
                      {file.dataUrl && (
                        <a 
                          href={file.dataUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-2.5 py-1 rounded bg-slate-800 text-blue-400 hover:text-white"
                        >
                          เปิดดูภาพ
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Update Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white">ปรับปรุงสถานะและบันทึกผลการตรวจสอบ</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
                  className="h-10 px-3 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="pending">รอตรวจสอบ (Pending)</option>
                  <option value="verified">ตรวจสอบหลักฐานแล้ว (Verified)</option>
                  <option value="escalated_to_authorities">ส่งต่อแจ้งความตำรวจ (Escalated)</option>
                  <option value="action_taken">ดำเนินการระงับแล้ว (Action Taken)</option>
                  <option value="archived">จัดเก็บสำนวน (Archived)</option>
                </select>

                <input
                  type="text"
                  placeholder="บันทึกผลการตรวจสอบ..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="h-10 px-3 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
