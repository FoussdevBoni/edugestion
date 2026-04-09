// src/services/evaluationService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseEvaluation } from "../utils/types/base";
import { Evaluation } from "../utils/types/data";


export const evaluationService = {
  async getAll(): Promise<Evaluation[]> {
    return await invokeIpc('evaluation:getAll');
  },

  async getById(id: string): Promise<Evaluation | null> {
    return await invokeIpc('evaluation:getById', id);
  },

  async getByPeriode(periodeId: string): Promise<Evaluation[]> {
    return await invokeIpc('evaluation:getByPeriode', periodeId);
  },

  async getByNiveauScolaire(niveauScolaireId: string): Promise<Evaluation[]> {
    return await invokeIpc('evaluation:getByNiveauScolaire', niveauScolaireId);
  },

  async create(payload: BaseEvaluation): Promise<Evaluation> {
    return await invokeIpc('evaluation:create', payload);
  },

  async update(id: string, payload: Partial<BaseEvaluation>): Promise<Evaluation> {
    return await invokeIpc('evaluation:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('evaluation:delete', id);
  }
};