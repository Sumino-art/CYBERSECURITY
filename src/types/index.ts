export type IncidentCategory = 
  | 'cyberbullying'
  | 'defamation'
  | 'threat_intimidation'
  | 'doxxing_privacy'
  | 'sexual_harassment'
  | 'hate_speech'
  | 'impersonation';

export type IncidentStatus = 
  | 'pending'
  | 'verified'
  | 'action_taken'
  | 'escalated_to_authorities'
  | 'archived';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface EvidenceFile {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  dataUrl: string;
  sha256Hash: string;
  uploadedAt: string;
}

export interface IncidentRecord {
  id: string;
  caseNumber: string;
  createdAt: string;
  incidentDate: string;
  incidentTime: string;
  platform: string;
  roomName: string;
  offenderAlias: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  offensiveMessages: string;
  description: string;
  evidenceFiles: EvidenceFile[];
  status: IncidentStatus;
  statusNotes?: string;
  reporterContact?: string;
  consentGiven: boolean;
  ipSessionHint?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  caseNumber?: string;
}

export interface ClientConnectionInfo {
  accessTimeTh: string;
  timestampIso: string;
  browser: string;
  os: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  screenResolution: string;
  connectionProtocol: string;
  connectionSecure: boolean;
  language: string;
  timezone: string;
  ipPlaceholder: string;
  estimatedPing: number;
}
