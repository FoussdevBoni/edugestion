// Modèle global du système scolaire abstrait

export interface NiveauScolaire {
  id: any;
  nom: string;           // Préscolaire, Primaire, Secondaire
  cycles?: Cycle[];      // les cycles contenus dans ce niveau
}

export interface Cycle {
  nom: string;           // Maternelle, Primaire, 1er cycle, 2e cycle
  classes?: Classe[];    // les classes de ce cycle
  diplome?: string;      // certificat ou diplôme final (optionnel)
}

export interface Classe {
  nom: string;           // CP1, 6e, 2nde, Terminale...
  sections?: Section[]; 
}

export interface Section {
  nom: string;           // ex: "A", "B", "C" ou sous-groupe
  sousSections?: Section[]; // optionnel, pour gérer sous-groupes
  matieres: Matiere[]
}

interface Matiere {
  nom: string,
  coef: number
}

export const systemeScolaireSenegal: NiveauScolaire[] = [
  {
    nom: "Préscolaire",
    cycles: [
      {
        nom: "Maternelle",
        classes: [
          {
            nom: "Petite section",
            sections: [
              { nom: "Petite section", matieres: [] }
            ]
          },
          {
            nom: "Moyenne section",
            sections: [
              { nom: "Moyenne section", matieres: [] }
            ]
          },
          {
            nom: "Grande section",
            sections: [
              { nom: "Grande section", matieres: [] }
            ]
          }
        ]
      }
    ]
  },
  {
    nom: "Primaire",
    cycles: [
      {
        nom: "Primaire",
        diplome: "CEP",
        classes: [
          {
            nom: "CP1",
            sections: [
              { nom: "CP1 A", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { nom: "CP1 B", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              }
            ]
          },
          {
            nom: "CP2",
            sections: [
              { nom: "CP2 A", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { nom: "CP2 B", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              }
            ]
          },
          {
            nom: "CE1",
            sections: [
              { nom: "CE1 A", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { nom: "CE1 B", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              }
            ]
          },
          {
            nom: "CE2",
            sections: [
              { nom: "CE2 A", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { nom: "CE2 B", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              }
            ]
          },
          {
            nom: "CM1",
            sections: [
              { nom: "CM1 A", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { nom: "CM1 B", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              }
            ]
          },
          {
            nom: "CM2",
            sections: [
              { nom: "CM2 A", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { nom: "CM2 B", matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Sciences", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              }
            ]
          }
        ]
      }
    ]
  },
  {
    nom: "Secondaire",
    cycles: [
      {
        nom: "1er cycle (Collège)",
        diplome: "BFEM",
        classes: [
          {
            nom: "6ᵉ",
            sections: [
              { 
                nom: "6ᵉ A", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { 
                nom: "6ᵉ B", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ]
              },
              { 
                nom: "6ᵉ C", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ]
              }
            ]
          },
          {
            nom: "5ᵉ",
            sections: [
              { 
                nom: "5ᵉ A", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { 
                nom: "5ᵉ B", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ]
              },
              { 
                nom: "5ᵉ C", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ]
              }
            ]
          },
          {
            nom: "4ᵉ",
            sections: [
              { 
                nom: "4ᵉ A", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { 
                nom: "4ᵉ B", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ]
              },
              { 
                nom: "4ᵉ C", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ]
              }
            ]
          },
          {
            nom: "3ᵉ",
            sections: [
              { 
                nom: "3ᵉ A", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ] 
              },
              { 
                nom: "3ᵉ B", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ]
              },
              { 
                nom: "3ᵉ C", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 4 },
                  { nom: "Physique-Chimie", coef: 3 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "EPS", coef: 1 },
                  { nom: "Éducation artistique", coef: 1 }
                ]
              }
            ]
          }
        ]
      },
      {
        nom: "2ᵉ cycle (Lycée)",
        diplome: "Baccalauréat",
        classes: [
          {
            nom: "2nde",
            sections: [
              { 
                nom: "2nde A", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 2 },
                  { nom: "EPS", coef: 1 }
                ] 
              },
              { 
                nom: "2nde B", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 2 },
                  { nom: "EPS", coef: 1 }
                ]
              },
              { 
                nom: "2nde C", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 2 },
                  { nom: "EPS", coef: 1 }
                ]
              },
              { 
                nom: "2nde D", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 2 },
                  { nom: "EPS", coef: 1 }
                ]
              }
            ]
          },
          {
            nom: "1ère",
            sections: [
              { 
                nom: "1ère A", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 3 },
                  { nom: "EPS", coef: 1 }
                ] 
              },
              { 
                nom: "1ère B", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 3 },
                  { nom: "EPS", coef: 1 }
                ]
              },
              { 
                nom: "1ère C", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 6 },
                  { nom: "Physique-Chimie", coef: 5 },
                  { nom: "SVT", coef: 4 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 2 },
                  { nom: "EPS", coef: 1 }
                ]
              },
              { 
                nom: "1ère D", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 5 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 2 },
                  { nom: "EPS", coef: 1 }
                ]
              }
            ]
          },
          {
            nom: "Terminale",
            sections: [
              { 
                nom: "Terminale A", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 4 },
                  { nom: "EPS", coef: 1 }
                ] 
              },
              { 
                nom: "Terminale B", 
                matieres: [
                  { nom: "Français", coef: 4 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 4 },
                  { nom: "SVT", coef: 3 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 4 },
                  { nom: "EPS", coef: 1 }
                ]
              },
              { 
                nom: "Terminale C", 
                matieres: [
                  { nom: "Français", coef: 3 },
                  { nom: "Mathématiques", coef: 7 },
                  { nom: "Physique-Chimie", coef: 6 },
                  { nom: "SVT", coef: 4 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 3 },
                  { nom: "EPS", coef: 1 }
                ]
              },
              { 
                nom: "Terminale D", 
                matieres: [
                  { nom: "Français", coef: 3 },
                  { nom: "Mathématiques", coef: 5 },
                  { nom: "Physique-Chimie", coef: 5 },
                  { nom: "SVT", coef: 6 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 3 },
                  { nom: "EPS", coef: 1 }
                ]
              },
              { 
                nom: "Terminale S", 
                matieres: [
                  { nom: "Français", coef: 3 },
                  { nom: "Mathématiques", coef: 6 },
                  { nom: "Physique-Chimie", coef: 6 },
                  { nom: "SVT", coef: 5 },
                  { nom: "Histoire-Géo", coef: 2 },
                  { nom: "Anglais", coef: 2 },
                  { nom: "Philosophie", coef: 3 },
                  { nom: "EPS", coef: 1 }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];