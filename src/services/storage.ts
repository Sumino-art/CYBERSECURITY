import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IncidentRecord, AuditLogEntry, EvidenceFile, IncidentStatus } from '../types';

const STORAGE_KEY_INCIDENTS = 'cyber_shield_incidents_v1';
const STORAGE_KEY_AUDIT = 'cyber_shield_audit_logs_v1';
const STORAGE_KEY_SUPABASE_CONFIG = 'cyber_shield_supabase_config_v1';

// Seed sample incidents so the application is rich and immediately testable
const INITIAL_SEED_INCIDENTS: IncidentRecord[] = [
  {
    id: 'inc-seed-001',
    caseNumber: 'CS-2569-4821',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: '14:25',
    platform: 'LINE OpenChat',
    roomName: 'กลุ่มซื้อขายสินค้ามือสอง BKK (สมาชิก 4,200 คน)',
    offenderAlias: 'Anonymous_User_99',
    category: 'defamation',
    severity: 'high',
    offensiveMessages: 'ระวังคนนี้โกงเงิน ชาติชั่ว ไม่มีจะกิน หลอกลวง เอาเงินกูไป (พร้อมแนบรูปหน้าโปรไฟล์และที่อยู่บ้าน)',
    description: 'ผู้กระทำผิดได้โพสต์ข้อความกล่าวหาใส่ร้ายใน OpenChat โดยไม่มีมูลความจริง พร้อมนำรูปถ่ายบัตรประชาชนที่เบลอเลขบางส่วนมาประจานต่อหน้าสมาชิกในห้องกว่า 4,000 คน ส่งผลให้เกิดความเข้าใจผิดและถูกรุมต่อว่า',
    evidenceFiles: [
      {
        id: 'ev-seed-1',
        filename: 'screenshot_openchat_defamation_01.png',
        size: 428190,
        mimeType: 'image/png',
        dataUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        uploadedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      }
    ],
    status: 'verified',
    statusNotes: 'ตรวจสอบหลักฐานภาพถ่ายแคปหน้าจอแล้ว มีการระบุชื่อและข้อมูลส่วนบุคคลชัดเจน เข้าข่ายหมิ่นประมาทโดยการโฆษณาและ พ.ร.บ. คอมฯ',
    reporterContact: 'victim.protect@protonmail.com',
    consentGiven: true,
    ipSessionHint: '180.180.xx.xx (ISP Verified)',
  },
  {
    id: 'inc-seed-002',
    caseNumber: 'CS-2569-7193',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    incidentDate: new Date(Date.now() - 3600000 * 26).toISOString().split('T')[0],
    incidentTime: '21:10',
    platform: 'LINE OpenChat',
    roomName: 'ชุมชนคนรักเกมเมอร์ไทย',
    offenderAlias: 'DarkSniper_X',
    category: 'threat_intimidation',
    severity: 'critical',
    offensiveMessages: 'มึงระวังตัวไว้ เดี๋ยวตามไปดักหน้าคอนโด รู้ที่อยู่มึงละ ไม่ตายดีแน่',
    description: 'มีการส่งข้อความข่มขู่เอาชีวิตและคุกคามสวัสดิภาพความปลอดภัยผ่านทางห้องสนทนากลุ่ม มีการระบุชื่อตึกคอนโดที่ผู้เสียหายพักอาศัย',
    evidenceFiles: [
      {
        id: 'ev-seed-2',
        filename: 'threat_message_chat.jpg',
        size: 382900,
        mimeType: 'image/jpeg',
        dataUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
        sha256Hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        uploadedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
      }
    ],
    status: 'escalated_to_authorities',
    statusNotes: 'ผู้เสียหายได้นำเอกสารหลักฐาน CS-2569-7193 ไปแจ้งความลงบันทึกประจำวันต่อพนักงานสอบสวน สภ.เมือง เรียบร้อยแล้ว',
    reporterContact: '089-xxx-xxxx',
    consentGiven: true,
    ipSessionHint: '124.120.xx.xx',
  },
  {
    id: 'inc-seed-003',
    caseNumber: 'CS-2569-1205',
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    incidentDate: new Date(Date.now() - 3600000 * 50).toISOString().split('T')[0],
    incidentTime: '11:45',
    platform: 'Facebook',
    roomName: 'กลุ่มชุมชนศิษย์เก่าโรงเรียน',
    offenderAlias: 'Somchai FakeAcc',
    category: 'doxxing_privacy',
    severity: 'high',
    offensiveMessages: 'เปิดวาร์ปคนนี้ เบอร์โทร 081-xxx-xxxx ที่ทำงานอยู่ที่...',
    description: 'นำข้อมูลส่วนบุคคล เบอร์โทรศัพท์ และสถานที่ทำงานไปเผยแพร่ในที่สาธารณะโดยไม่ได้รับความยินยอม ทำให้มีบุคคลโทรมาก่อกวนหลายสาย (ละเมิด PDPA)',
    evidenceFiles: [],
    status: 'pending',
    statusNotes: 'รอเอกสารภาพถ่ายเพิ่มเติมจากผู้ร้องเรียน',
    reporterContact: 'user29@gmail.com',
    consentGiven: true,
    ipSessionHint: '223.24.xx.xx',
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    action: 'STATUS_UPDATE',
    actor: 'admin_security@cybershield.local',
    details: 'เปลี่ยนสถานะเคส CS-2569-4821 เป็น VERIFIED หลังตรวจสอบความถูกต้องของภาพหลักฐาน',
    caseNumber: 'CS-2569-4821',
  },
  {
    id: 'aud-002',
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    action: 'EXPORT_DOCKET',
    actor: 'admin_security@cybershield.local',
    details: 'ส่งออกรายงานสำนวนพยานหลักฐานดิจิทัลคดี CS-2569-7193 สำหรับประกอบการแจ้งความ',
    caseNumber: 'CS-2569-7193',
  },
  {
    id: 'aud-003',
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    action: 'EVIDENCE_STORED',
    actor: 'system_vault',
    details: 'บันทึกหลักฐานดิจิทัลใหม่ พร้อมสร้าง SHA-256 Checksum สำหรับคดี CS-2569-7193',
    caseNumber: 'CS-2569-7193',
  }
];

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

class StorageManager {
  private supabase: SupabaseClient | null = null;
  private config: SupabaseConfig = {
    url: '',
    anonKey: '',
    isConnected: false,
  };

  private memoryIncidents: IncidentRecord[] = [...INITIAL_SEED_INCIDENTS];
  private memoryAudit: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

  constructor() {
    this.init();
  }

  private init() {
    try {
      // Check localStorage for user-configured Supabase
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedConfig = localStorage.getItem(STORAGE_KEY_SUPABASE_CONFIG);
        if (savedConfig) {
          this.config = JSON.parse(savedConfig);
          if (this.config.url && this.config.anonKey) {
            this.supabase = createClient(this.config.url, this.config.anonKey);
            this.config.isConnected = true;
          }
        }

        // Initialize seed data if empty
        const existingIncidents = localStorage.getItem(STORAGE_KEY_INCIDENTS);
        if (!existingIncidents) {
          localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(INITIAL_SEED_INCIDENTS));
        } else {
          this.memoryIncidents = JSON.parse(existingIncidents);
        }

        const existingAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
        if (!existingAudit) {
          localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
        } else {
          this.memoryAudit = JSON.parse(existingAudit);
        }
      }
    } catch (e) {
      console.warn('Storage init fallback to memory storage:', e);
    }
  }

  public getSupabaseConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public async setSupabaseConfig(url: string, anonKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!url || !anonKey) {
        this.supabase = null;
        this.config = { url: '', anonKey: '', isConnected: false };
        localStorage.removeItem(STORAGE_KEY_SUPABASE_CONFIG);
        return { success: true };
      }

      const client = createClient(url, anonKey);
      // Quick test query
      const { error } = await client.from('cyber_incidents').select('id').limit(1);
      
      this.supabase = client;
      this.config = { url, anonKey, isConnected: !error };
      localStorage.setItem(STORAGE_KEY_SUPABASE_CONFIG, JSON.stringify(this.config));
      
      this.addAuditLog('SUPABASE_CONNECTED', 'admin', `เชื่อมต่อ Supabase Database สำเร็จ: ${url}`);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown connection error';
      return { success: false, error: message };
    }
  }

  // Incidents
  public async getIncidents(): Promise<IncidentRecord[]> {
    if (this.supabase && this.config.isConnected) {
      try {
        const { data, error } = await this.supabase
          .from('cyber_incidents')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data) {
          return data as IncidentRecord[];
        }
      } catch {
        // Fallback to local
      }
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY_INCIDENTS);
        if (raw) {
          this.memoryIncidents = JSON.parse(raw);
          return this.memoryIncidents;
        }
      }
    } catch {
      // Safe fallback
    }
    return this.memoryIncidents.length > 0 ? this.memoryIncidents : INITIAL_SEED_INCIDENTS;
  }

  public async saveIncident(incident: IncidentRecord): Promise<{ success: boolean; error?: string }> {
    // 1. Try Supabase if configured
    if (this.supabase && this.config.isConnected) {
      try {
        const { error } = await this.supabase.from('cyber_incidents').insert([incident]);
        if (error) {
          console.warn('Supabase insert error, falling back to local storage:', error.message);
        }
      } catch (err) {
        console.warn('Supabase exception:', err);
      }
    }

    // 2. Persist locally and in memory
    try {
      this.memoryIncidents = [incident, ...this.memoryIncidents];
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(this.memoryIncidents));
      }

      this.addAuditLog(
        'INCIDENT_CREATED',
        'public_reporter',
        `รับเรื่องและบันทึกหลักฐานใหม่ รหัสเคส ${incident.caseNumber} [${incident.category}]`,
        incident.caseNumber
      );

      return { success: true };
    } catch (e: unknown) {
      // Even if localStorage fails, memory storage succeeded
      return { success: true };
    }
  }

  public async updateIncidentStatus(
    id: string,
    newStatus: IncidentStatus,
    notes?: string,
    actorName: string = 'admin'
  ): Promise<boolean> {
    try {
      const index = this.memoryIncidents.findIndex(inc => inc.id === id);
      if (index !== -1) {
        const inc = this.memoryIncidents[index];
        inc.status = newStatus;
        if (notes) inc.statusNotes = notes;
        this.memoryIncidents[index] = inc;

        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(this.memoryIncidents));
          }
        } catch {
          // Ignore
        }

        if (this.supabase && this.config.isConnected) {
          await this.supabase
            .from('cyber_incidents')
            .update({ status: newStatus, statusNotes: notes })
            .eq('id', id);
        }

        this.addAuditLog(
          'STATUS_UPDATE',
          actorName,
          `ปรับสถานะเคส ${inc.caseNumber} เป็น ${newStatus.toUpperCase()}${notes ? ` (บันทึก: ${notes})` : ''}`,
          inc.caseNumber
        );

        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public async deleteIncident(id: string, actorName: string = 'admin'): Promise<boolean> {
    try {
      const target = this.memoryIncidents.find(i => i.id === id);
      this.memoryIncidents = this.memoryIncidents.filter(i => i.id !== id);

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(this.memoryIncidents));
        }
      } catch {
        // Ignore
      }

      if (this.supabase && this.config.isConnected) {
        await this.supabase.from('cyber_incidents').delete().eq('id', id);
      }

      if (target) {
        this.addAuditLog('INCIDENT_DELETED', actorName, `ลบเคส ${target.caseNumber} ออกจากระบบ`, target.caseNumber);
      }
      return true;
    } catch {
      return false;
    }
  }

  // Audit Logs
  public async getAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
        if (raw) {
          this.memoryAudit = JSON.parse(raw);
          return this.memoryAudit;
        }
      }
    } catch {
      // Fallback
    }
    return this.memoryAudit.length > 0 ? this.memoryAudit : INITIAL_AUDIT_LOGS;
  }

  public addAuditLog(action: string, actor: string, details: string, caseNumber?: string) {
    try {
      const newEntry: AuditLogEntry = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        action,
        actor,
        details,
        caseNumber,
      };
      this.memoryAudit.unshift(newEntry);
      const trimmed = this.memoryAudit.slice(0, 100);
      this.memoryAudit = trimmed;

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(trimmed));
      }
    } catch {
      // Safe ignore
    }
  }

  // Supabase SQL DDL Schema string for user documentation
  public getSupabaseSQLSchema(): string {
    return `-- ========================================================
-- CYBER SHIELD - SUPABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Copy and run this in your Supabase SQL Editor
-- ========================================================

-- 1. Create table for cyber incidents
CREATE TABLE IF NOT EXISTS public.cyber_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "caseNumber" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "incidentDate" DATE NOT NULL,
    "incidentTime" TEXT NOT NULL,
    platform TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "offenderAlias" TEXT,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    "offensiveMessages" TEXT NOT NULL,
    description TEXT,
    "evidenceFiles" JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending',
    "statusNotes" TEXT,
    "reporterContact" TEXT,
    "consentGiven" BOOLEAN DEFAULT true,
    "ipSessionHint" TEXT
);

-- 2. Create table for administrative audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    details TEXT NOT NULL,
    "caseNumber" TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.cyber_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for cyber_incidents
-- Anyone can submit evidence reports (Public Insert)
CREATE POLICY "Public can submit cyber incidents"
ON public.cyber_incidents
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated administrators can read all reports
CREATE POLICY "Admins can view all cyber incidents"
ON public.cyber_incidents
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated administrators can update status & investigation notes
CREATE POLICY "Admins can update incidents"
ON public.cyber_incidents
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Storage Bucket for Evidence Vault
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence_vault', 'evidence_vault', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can upload screenshot evidence
CREATE POLICY "Allow public evidence upload"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'evidence_vault');

-- Storage RLS: Only admins can view uploaded screenshots
CREATE POLICY "Allow admins to read evidence vault"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'evidence_vault');
`;
  }
}

export const storageService = new StorageManager();
