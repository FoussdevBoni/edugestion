// src/services/bulletinService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { Bulletin } from "../utils/types/data";
import { BaseConfigBulletin } from "../utils/types/base";

export interface CreateUniqueResult {
  success: {
    inscriptionId: string;
    eleve: string;
    bulletin: Bulletin;
  };
  errors: {
    inscriptionId: string;
    error: string;
  };
}

export interface CreateMultipleResult {
  success: Array<{
    inscriptionId: string;
    eleve: string;
    bulletin: Bulletin;
  }>;
  errors: Array<{
    inscriptionId: string;
    error: string;
  }>;
}

export interface GenerateMultipleResult {
  success: Array<{
    bulletinId: string;
    eleve: string;
    bulletin: Bulletin;
  }>;
  errors: Array<{
    bulletinId: string;
    error: string;
  }>;
}

export interface DeleteManyResult {
  success: boolean;
  deletedCount: number;
}

export interface SaveBulletinData {
  vieScolaire?: { absences?: number; retards?: number; conduite?: number | null };
  commentaires?: { decisionConseil?: string; observations?: string };
  moyennesParMatiere?: any[];
  resultatFinal?: any;
  status?: string;
  infosDeClasse?: { effectif?: number };
  notesManquantes?: any[];
}

export const bulletinService = {
  // Récupérer tous les bulletins
  async getAll(): Promise<Bulletin[]> {
    return await invokeIpc('bulletin:getAll');
  },

  // Récupérer un bulletin par ID
  async getById(id: string): Promise<Bulletin | null> {
    return await invokeIpc('bulletin:getById', id);
  },

  // Récupérer les bulletins d'une période
  async getByPeriode(periodeId: string): Promise<Bulletin[]> {
    return await invokeIpc('bulletin:getByPeriode', periodeId);
  },

  async getByPeriodeAndInscription(data: { periodeId: string; inscriptionId: string }): Promise<Bulletin> {
    return await invokeIpc('bulletin:getByPeriodeAndInscription', data);
  },

 

  // Créer un bulletin (squelette)
  async createUnique(data: { periodeId: string; inscriptionId: string }): Promise<CreateUniqueResult> {
    return await invokeIpc('bulletin:createUnique', data);
  },

  // Créer des bulletins en masse (squelettes)
  async createMultiple(data: { periodeId: string; inscriptionIds: string[] }): Promise<CreateMultipleResult> {
    return await invokeIpc('bulletin:createMultiple', data);
  },

  // Générer des bulletins en masse (calculs avec config)
  async generateMultiple(data: { periodeId: string; bulletinIds: string[]; config: BaseConfigBulletin }): Promise<GenerateMultipleResult> {
    return await invokeIpc('bulletin:generateMultiple', data);
  },

  // Mettre à jour un bulletin (vie scolaire, commentaires)
  async update(id: string, data: Partial<Bulletin>): Promise<Bulletin> {
    return await invokeIpc('bulletin:update', id, data);
  },

  // Sauvegarder un bulletin (crée si inexistant, met à jour sans écraser)
  async save(inscriptionId: string, periodeId: string, data: SaveBulletinData): Promise<Bulletin> {
    return await invokeIpc('bulletin:save', {inscriptionId, periodeId, data});
  },

  // Supprimer un bulletin
  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('bulletin:delete', id);
  },

  // Supprimer plusieurs bulletins
  async deleteMany(ids: string[]): Promise<DeleteManyResult> {
    return await invokeIpc('bulletin:deleteMany', ids);
  }
};