// src/utils/fakeData/ecoleInfos.ts
import { v4 as uuidv4 } from 'uuid';
import { EcoleInfo } from '../utils/types/data';



export const ecoleInfos: EcoleInfo = {
  id: uuidv4(),
  nom: "Complexe Scolaire La Renaissance",
  logo: "",
  adresse: "123 Avenue de l'Éducation, Lomé",
  telephone: "+228 22 123 456",
  email: "contact@renaissance.tg",
  siteWeb: "www.renaissance.tg",
  anneeScolaire: "2024-2025",
  devise: "Savoir, Excellence, Réussite",
  createdAt: "2020-09-01T00:00:00.000Z",
  updatedAt: "2024-08-15T00:00:00.000Z"
};