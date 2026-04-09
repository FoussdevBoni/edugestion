// src/services/photoService.ts
import { invokeIpc } from "../utils/invokeIpc";

export interface PhotoData {
  matricule: string;
  base64: string;
}

export interface UploadResult {
  success: Array<{
    eleve: string;
    matricule: string;
    fichier: string;
  }>;
  errors: Array<{
    eleve: string;
    matricule: string;
    error: string;
  }>;
}

export interface FileUploadResult {
  success: boolean;
  fileName: string;
  path: string;
}

export const photoService = {
  // Pour photos élèves (upload multiple)
  async uploadPhotos(photos: PhotoData[], inscriptions: any[]): Promise<UploadResult> {
    return await invokeIpc('photo:uploadPhotos', { photos, inscriptions });
  },

  // Pour fichiers génériques (logo, en-tête)
  async uploadFile(data: { base64: string; type: string; nom?: string }): Promise<FileUploadResult> {
    return await invokeIpc('photo:uploadFile', data);
  },

  // Récupérer photo élève par matricule
  async getPhoto(matricule: string): Promise<Buffer | null> {
    return await invokeIpc('photo:getPhoto', matricule);
  },

  // Récupérer un fichier par son nom
  async getFile(fileName: string, type: string = 'upload'): Promise<Buffer | null> {
    return await invokeIpc('photo:getFile', fileName, type);
  },

  // Récupérer un fichier en base64
  async getFileBase64(fileName: string, type: string = 'upload'): Promise<string | null> {
    return await invokeIpc('photo:getFileBase64', fileName, type);
  }
};