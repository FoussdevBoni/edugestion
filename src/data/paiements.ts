// src/utils/fakeData/paiements.ts
import { Payement } from '../utils/types/data';
import { inscriptions } from './inscriptions';

export const paiements: Payement[] = [
  {
    id: "pay_001",
    inscriptionId: "ins_2023_001",
    montantPaye: 75000,
    statut: "paye",
    montantRestant: 0,
    datePayement: "2023-10-15",
    inscription: inscriptions.find(i => i.id === "ins_2023_001")!,
    createdAt: "2023-10-15T10:30:00.000Z"
  },
  {
    id: "pay_002",
    inscriptionId: "ins_2023_001",
    montantPaye: 50000,
    statut: "partiellement",
    montantRestant: 25000,
    datePayement: "2024-01-20",
    inscription: inscriptions.find(i => i.id === "ins_2023_001")!,
    createdAt: "2024-01-20T09:15:00.000Z"
  },
  {
    id: "pay_003",
    inscriptionId: "ins_2023_002",
    montantPaye: 150000,
    statut: "paye",
    montantRestant: 0,
    datePayement: "2023-09-30",
    inscription: inscriptions.find(i => i.id === "ins_2023_002")!,
    createdAt: "2023-09-30T14:20:00.000Z"
  },
  {
    id: "pay_004",
    inscriptionId: "ins_2023_003",
    montantPaye: 45000,
    statut: "partiellement",
    montantRestant: 55000,
    datePayement: "2023-11-05",
    inscription: inscriptions.find(i => i.id === "ins_2023_003")!,
    createdAt: "2023-11-05T11:00:00.000Z"
  },
  {
    id: "pay_005",
    inscriptionId: "ins_2023_005",
    montantPaye: 120000,
    statut: "paye",
    montantRestant: 0,
    datePayement: "2023-10-10",
    inscription: inscriptions.find(i => i.id === "ins_2023_005")!,
    createdAt: "2023-10-10T08:45:00.000Z"
  },
  {
    id: "pay_006",
    inscriptionId: "ins_2023_006",
    montantPaye: 60000,
    statut: "partiellement",
    montantRestant: 60000,
    datePayement: "2023-12-01",
    inscription: inscriptions.find(i => i.id === "ins_2023_006")!,
    createdAt: "2023-12-01T13:30:00.000Z"
  },
  {
    id: "pay_007",
    inscriptionId: "ins_2023_009",
    montantPaye: 180000,
    statut: "paye",
    montantRestant: 0,
    datePayement: "2023-09-25",
    inscription: inscriptions.find(i => i.id === "ins_2023_009")!,
    createdAt: "2023-09-25T15:10:00.000Z"
  }
];

// Ajouter les paiements aux inscriptions correspondantes
inscriptions.forEach(ins => {
  ins.payements = paiements.filter(p => p.inscriptionId === ins.id);
});