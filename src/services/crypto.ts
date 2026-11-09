/**
 * Cryptographic utility for calculating SHA-256 digests
 * Used for digital evidence integrity validation and chain-of-custody verification.
 */

export async function calculateSHA256(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexString = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexString;
}

export async function calculateTextSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateCaseNumber(): string {
  const yearBE = new Date().getFullYear() + 543;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CS-${yearBE}-${randomPart}`;
}
