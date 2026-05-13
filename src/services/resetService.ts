// src/services/resetService.ts
import { invokeIpc } from "../utils/invokeIpc";

export interface ResetResult {
  success: boolean;
  message: string;
}

export interface ExportResult {
  success: boolean;
  message: string;
  filePath?: string;
  size?: number;
  recordCount?: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
}

export interface ExportOptions {
  filePath?: string;
  minify?: boolean;
  exclude?: string[];
}

export const resetService = {
  // Méthodes existantes
  async resetDatabase(): Promise<ResetResult> {
    return await invokeIpc('reset:database');
  },
  
  async resetScolaireData(): Promise<ResetResult> {
    return await invokeIpc('reset:scolaireData');
  },

  // Nouvelles méthodes d'export/import
  
  async exportDatabase(options?: ExportOptions): Promise<ExportResult> {
    return await invokeIpc('export:database', options || {});
  },

  async exportScolaireData(filePath?: string): Promise<ExportResult> {
    return await invokeIpc('export:scolaireData', filePath);
  },

  // CHANGÉ : accepte fileContent au lieu de filePath
  async importDatabase(fileContent: string, merge: boolean = false): Promise<ImportResult> {
    return await invokeIpc('import:database', { fileContent, merge });
  }
};