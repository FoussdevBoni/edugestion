// src/services/importService.ts
import { invokeIpc } from "../utils/invokeIpc";

export const importService = {
  async importData(data: any) {
    return await invokeIpc('import:data', data);
  }
};