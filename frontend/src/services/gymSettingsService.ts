import { apiRequest } from '@/lib/api';

export type GymSettings = {
  gymName?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  socialLinks?: Partial<Record<'facebook'|'instagram'|'twitter'|'tiktok'|'youtube', string>>;
  membershipPlans?: Array<{ name: string; price: number; durationDays: number; features?: string[] }>;
  paymentSettings?: { cash?: boolean; card?: boolean; onlineGateway?: boolean; gatewayName?: string };
  policies?: { terms?: string; privacy?: string; refund?: string };
  membershipCardStyle?: {
    headerColor?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    headerTitle?: string;
    showGymName?: boolean;
    showMemberEmail?: boolean;
    showValidUntil?: boolean;
    logoUrl?: string;
    logoWidth?: number;
    logoHeight?: number;
  };
};

export class GymSettingsService {
  async get(): Promise<GymSettings> {
    const res = await apiRequest('/gym-settings');
    return res.json();
  }
  async update(data: GymSettings): Promise<GymSettings> {
    const res = await apiRequest('/gym-settings', { method: 'PUT', body: JSON.stringify(data) });
    const json = await res.json();
    return json.settings || json;
  }
}
