// src/services/noteService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseNote } from "../utils/types/base";
import { Note } from "../utils/types/data";

export const noteService = {
  async getAll(): Promise<Note[]> {
    return await invokeIpc('note:getAll');
  },

  async getById(id: string): Promise<Note | null> {
    return await invokeIpc('note:getById', id);
  },

  async getByInscription(inscriptionId: string): Promise<Note[]> {
    return await invokeIpc('note:getByInscription', inscriptionId);
  },

  async getByMatiere(matiereId: string): Promise<Note[]> {
    return await invokeIpc('note:getByMatiere', matiereId);
  },

  async getByPeriode(periodeId: string): Promise<Note[]> {
    return await invokeIpc('note:getByPeriode', periodeId);
  },

  async getByClasse(classeId: string): Promise<Note[]> {
    return await invokeIpc('note:getByClasse', classeId);
  },

  async getByEleve(eleveDataId: string): Promise<Note[]> {
    return await invokeIpc('note:getByEleve', eleveDataId);
  },

  async create(payload: BaseNote): Promise<Note> {
    return await invokeIpc('note:create', payload);
  },

  async createBatch(payload: BaseNote[]): Promise<{ success: number; errors: any[]; notes: Note[] }> {
    return await invokeIpc('note:createBatch', payload);
  },

  async update(id: string, payload: Partial<BaseNote>): Promise<Note> {
    return await invokeIpc('note:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('note:delete', id);
  },

  async close(id: string) {
    return await invokeIpc('note:close', id);
  },

  async closeBatch(ids: string[]) {
    return await invokeIpc('note:closeBatch', ids);
  },

  async importFromExcel(payload: {
    matiereId: string;
    periodeId: string;
    evaluationId: string;
    enseignantId?: string;
    notes: Array<{ matricule: string; note: number }>;
  }): Promise<{
    success: Array<{ matricule: string; note: number; coefficient: number; noteId: string }>;
    errors: Array<{ matricule: string; error: string }>;
  }> {
    return await invokeIpc('note:import', payload);
  },
};