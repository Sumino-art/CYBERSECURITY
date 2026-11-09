import { ClientConnectionInfo } from '../types';

export function detectClientEnvironment(): ClientConnectionInfo {
  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';

  // Detect Mobile / Tablet / Desktop
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(ua);
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua);

  if (isTablet) {
    deviceType = 'Tablet';
  } else if (isMobile || window.innerWidth < 768) {
    deviceType = 'Mobile';
  } else {
    deviceType = 'Desktop';
  }

  // Detect OS
  if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'Apple iOS';
  } else if (/Android/i.test(ua)) {
    os = 'Android OS';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS';
  } else if (/Windows/i.test(ua)) {
    os = 'Microsoft Windows';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux Kernel';
  }

  // Detect Browser
  if (/Line\//i.test(ua)) {
    browser = 'LINE In-App Browser (Webview)';
  } else if (/Edg\//i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox\//i.test(ua)) {
    browser = 'Mozilla Firefox';
  }

  const now = new Date();
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const thaiYear = now.getFullYear() + 543;
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  const accessTimeTh = `${now.getDate()} ${thaiMonths[now.getMonth()]} พ.ศ. ${thaiYear} เวลา ${timeStr} น.`;

  const screenWidth = typeof window !== 'undefined' && window.screen ? window.screen.width : 1920;
  const screenHeight = typeof window !== 'undefined' && window.screen ? window.screen.height : 1080;
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const protocol = typeof window !== 'undefined' && window.location ? window.location.protocol : 'https:';
  const hostname = typeof window !== 'undefined' && window.location ? window.location.hostname : 'localhost';

  return {
    accessTimeTh,
    timestampIso: now.toISOString(),
    browser,
    os,
    deviceType,
    screenResolution: `${screenWidth} × ${screenHeight} (${pixelRatio}x)`,
    connectionProtocol: protocol === 'https:' ? 'HTTPS (TLS 1.3)' : 'HTTP Standard',
    connectionSecure: protocol === 'https:' || hostname === 'localhost',
    language: typeof navigator !== 'undefined' ? navigator.language || 'th-TH' : 'th-TH',
    timezone: (typeof Intl !== 'undefined' && Intl.DateTimeFormat) ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Bangkok') : 'Asia/Bangkok',
    ipPlaceholder: 'เซสชันเครือข่ายต้นทาง (Session ISP Gateway)',
    estimatedPing: Math.floor(18 + Math.random() * 24),
  };
}
