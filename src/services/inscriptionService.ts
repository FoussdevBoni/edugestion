// src/services/inscriptionService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseInscription } from "../utils/types/base";
import { Inscription } from "../utils/types/data";

// Définir les types pour la réponse
interface DesactivationResult {
  success: Array<{ inscriptionId: string }>;
  errors: Array<{ inscriptionId: string; error: string }>;
}

interface DeleteManyResult {
  success: boolean;
  deletedCount: number;
}

export const inscriptionService = {
  // Récupère TOUTES les inscriptions (actives et inactives)
  
  async getData(where?: Record<string, any>, options?: Record<string, any>): Promise<Inscription[]> {
    return await invokeIpc('inscription:getData', where, options);
  },

  async getAll(): Promise<Inscription[]> {
    return await invokeIpc('inscription:getAll');
  },

  // Récupère UNIQUEMENT les inscriptions actives
  async getActives(): Promise<Inscription[]> {
    return await invokeIpc('inscription:getActives');
  },

  async getById(id: string): Promise<Inscription | null> {
    return await invokeIpc('inscription:getById', id);
  },

  async getByEleve(eleveDataId: string): Promise<Inscription[]> {
    return await invokeIpc('inscription:getByEleve', eleveDataId);
  },

  async getByClasse(classeId: string): Promise<Inscription[]> {
    return await invokeIpc('inscription:getByClasse', classeId);
  },

  async getByAnneeScolaire(anneeScolaire: string): Promise<Inscription[]> {
    return await invokeIpc('inscription:getByAnneeScolaire', anneeScolaire);
  },

  async getCurrentInscription(eleveDataId: string): Promise<Inscription | null> {
    return await invokeIpc('inscription:getCurrentInscription', eleveDataId);
  },

  async create(payload: BaseInscription): Promise<Inscription> {
    return await invokeIpc('inscription:create', payload);
  },

  async update(id: string, payload: Partial<BaseInscription>): Promise<Inscription> {
    return await invokeIpc('inscription:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('inscription:delete', id);
  },

  async deleteMany(ids: string[]): Promise<DeleteManyResult> {
    return await invokeIpc('inscription:deleteMany', ids);
  },

  async inscrireNouvelEleve(payload: any): Promise<Inscription> {
    return await invokeIpc('inscription:inscrireNouvelEleve', payload);
  },

  async reinscrireEleves(eleves: Inscription[], classeCibleId: string, anneeCourante: string ,  statut: "Nouveau" | "Redoublant"): Promise<{
    success: { eleveId: string; nom: string; nouvelleInscription: Inscription }[];
    errors: { eleveId: string; nom: string; error: string }[];
  }> {
    return await invokeIpc('inscription:reinscrireEleves', { eleves, classeCibleId , anneeCourante , statut });
  },

  async desactiverEleves(inscriptionIds: string[]): Promise<DesactivationResult> {
    return await invokeIpc('inscription:desactiverEleves',  inscriptionIds );
  },

  async transfererEleves(inscriptions: Inscription[], classeId: string): Promise<{
    success: { inscriptionId: string; eleveId: string; nom: string; nouvelleClasse: string }[];
    errors: { inscriptionId: string; nom: string; error: string }[];
  }> {
    return await invokeIpc('inscription:transfererEleves', { inscriptions, classeId });
  }
};