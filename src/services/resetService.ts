// src/services/resetService.ts
import { invokeIpc } from "../utils/invokeIpc";

export interface ResetResult {
  success: boolean;
  message: string;
}

export const resetService = {
  async resetDatabase(): Promise<ResetResult> {
    return await invokeIpc('reset:database');
  },
  
  async resetScolaireData(): Promise<ResetResult> {
    return await invokeIpc('reset:scolaireData');
  }
};