// src/services/photoService.ts
import { alertError } from "../helpers/alertError";
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

export interface ElevePhotoResult {
  success: boolean;
  matricule?: string;
  fileName?: string;
  message?: string;
  error?: string;
}

export interface FileUploadResult {
  success: boolean;
  fileName: string;
  path: string;
}

export const photoService = {
  async uploadPhotos(photos: PhotoData[], inscriptions: any[]): Promise<UploadResult> {
    return await invokeIpc('photo:uploadPhotos', { photos, inscriptions });
  },

  async uploadElevePhoto(matricule: string, base64: string): Promise<any> {
 
    return await invokeIpc('photo:uploadElevePhoto', { matricule, base64 });
  },

  async uploadFile(data: { base64: string; type: string; nom?: string }): Promise<FileUploadResult> {
    return await invokeIpc('photo:uploadFile', data);
  },

  // Buffer existe côté Node, mais pas dans le renderer
  // Utiliser Uint8Array ou any si tu veux éviter les erreurs TS
  async getPhoto(matricule: string): Promise<Uint8Array | null> {
    return await invokeIpc('photo:getPhoto', matricule);
  },

  async getFile(fileName: string, type: string = 'upload'): Promise<Uint8Array | null> {
    return await invokeIpc('photo:getFile', fileName, type);
  },

  async getFileBase64(fileName: string, type: string = 'upload'): Promise<string | null> {
    return await invokeIpc('photo:getFileBase64', fileName, type);
  }
};