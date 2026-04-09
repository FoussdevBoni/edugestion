// src/services/licenceService.ts
import { invokeIpc } from '../utils/invokeIpc';

export interface MachineIdResult {
  success: boolean;
  machineId: string | null;
  formattedId: string | null;
  error?: string;
}

export interface LicenseValidationResult {
  valid: boolean;
  reason?: string;
  expired?: boolean;
  expirationDate?: string;
  daysLeft?: number;
  machineId?: string;
  needsActivation?: boolean;
  success?: boolean;
}

export const licenceService = {
  async getMachineId(): Promise<MachineIdResult> {
    return await invokeIpc('licence:getMachineId');
  },

  async validateLicense(licenseKey: string): Promise<LicenseValidationResult> {
    return await invokeIpc('licence:validate', licenseKey);
  },

  async saveLicense(licenseKey: string): Promise<LicenseValidationResult> {
    return await invokeIpc('licence:save', licenseKey);
  },

  async checkStoredLicense(): Promise<LicenseValidationResult> {
    return await invokeIpc('licence:check');
  },

  async clearLicense(): Promise<{ success: boolean; error?: string }> {
    return await invokeIpc('licence:clear');
  }
};