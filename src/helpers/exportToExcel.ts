import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Header {
  key: string;
  label: string;
  width?: number;
  format?: (value: any) => string;
}

interface Sheet {
  name: string;
  data: any | any[];
  headers?: Header[];
}

interface Options {
  headers?: Header[];
  sheetName?: string;
  autoWidth?: boolean;
  maxWidth?: number;
  dateFormat?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
}

interface MultiSheetOptions {
  sheets: Sheet[];
  filename?: string;
  autoWidth?: boolean;
  maxWidth?: number;
  dateFormat?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
}

/**
 * Exporte des données vers un fichier Excel
 * @param data - Données à exporter (tableau d'objets ou objet unique)
 * @param filename - Nom du fichier (sans extension)
 * @param options - Options de configuration
 */
const exportToExcel = (
  data: any | any[],
  filename: string = 'export',
  options: Options = {}
): void => {
  // Configuration par défaut
  const config = {
    headers: null as Header[] | null,
    sheetName: 'Sheet1',
    autoWidth: true,
    maxWidth: 50,
    dateFormat: 'DD/MM/YYYY',
    thousandSeparator: ' ',
    decimalSeparator: ',',
    ...options
  };

  // Validation des données
  if (!data) {
    console.error('Aucune donnée à exporter');
    return;
  }

  // Convertir les données en tableau
  let dataArray = Array.isArray(data) ? data : [data];
  
  if (dataArray.length === 0) {
    console.warn('Le tableau de données est vide');
    return;
  }

  // Formater une date
  const formatDate = (date: any): string => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    
    return config.dateFormat
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  };

  // Formater un nombre
  const formatNumber = (number: any): string => {
    if (number === undefined || number === null) return '';
    const num = parseFloat(number);
    if (isNaN(num)) return String(number);
    
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
    return parts.join(config.decimalSeparator);
  };

  // Récupérer une valeur imbriquée (ex: 'user.profile.name')
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj);
  };

  // Préparer les données pour une feuille
  const prepareSheetData = (dataArray: any[], headers: Header[] | null = null) => {
    let formattedData: any[] = [];
    let columnWidths: Record<string, number> = {};
    let result: any[] = [];

    if (headers && headers.length > 0) {
      // Utilisation d'en-têtes personnalisés
      formattedData = dataArray.map(item => {
        const row: Record<string, any> = {};
        headers.forEach(header => {
          let value = getNestedValue(item, header.key);
          
          // Appliquer les formats
          if (header.format && typeof header.format === 'function') {
            value = header.format(value);
          } else {
            // Format automatique selon le type
            if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
              value = formatDate(value);
            } else if (typeof value === 'number') {
              value = formatNumber(value);
            }
          }
          
          row[header.label] = value;
          
          // Calculer la largeur de colonne
          if (config.autoWidth) {
            const cellLength = String(value).length;
            const headerLength = header.label.length;
            const currentWidth = columnWidths[header.label] || 0;
            columnWidths[header.label] = Math.min(
              Math.max(currentWidth, cellLength, headerLength),
              config.maxWidth
            );
          }
        });
        return row;
      });
      
      // Appliquer les largeurs personnalisées
      if (config.autoWidth) {
        const widths = headers.map(header => ({ 
          wch: header.width || columnWidths[header.label] || 15 
        }));
        if (widths.length > 0) result = [...formattedData];
        (result as any)._widths = widths;
      } else {
        result = formattedData;
      }
    } else {
      // Export simple sans en-têtes personnalisés
      formattedData = dataArray.map(item => {
        const row: Record<string, any> = {};
        Object.keys(item).forEach(key => {
          let value = item[key];
          
          if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
            value = formatDate(value);
          } else if (typeof value === 'number') {
            value = formatNumber(value);
          }
          
          row[key] = value;
          
          if (config.autoWidth) {
            const cellLength = String(value).length;
            const headerLength = key.length;
            const currentWidth = columnWidths[key] || 0;
            columnWidths[key] = Math.min(
              Math.max(currentWidth, cellLength, headerLength),
              config.maxWidth
            );
          }
        });
        return row;
      });
      
      if (config.autoWidth) {
        const columnWidthValues = Object.values(columnWidths);
        if (columnWidthValues.length > 0) {
          const minWidth = Math.min(...columnWidthValues);
          const widths = Object.keys(columnWidths).map(() => ({ wch: minWidth }));
          if (widths.length > 0) {
            result = [...formattedData];
            (result as any)._widths = widths;
          } else {
            result = formattedData;
          }
        } else {
          result = formattedData;
        }
      } else {
        result = formattedData;
      }
    }

    return result;
  };

  // Préparer les données
  const formattedData = prepareSheetData(dataArray, config.headers);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  
  // Appliquer les largeurs si disponibles
  if ((formattedData as any)._widths) {
    worksheet['!cols'] = (formattedData as any)._widths;
  }
  
  XLSX.utils.book_append_sheet(workbook, worksheet, config.sheetName);
  
  // Générer et sauvegarder le fichier
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, `${filename}.xlsx`);
};

/**
 * Exporte plusieurs feuilles vers un fichier Excel
 * @param options - Options de configuration multi-feuilles
 */
export const exportToExcelMultiSheet = (options: MultiSheetOptions): void => {
  const {
    sheets,
    filename = 'export-multi-sheets',
    autoWidth = true,
    maxWidth = 50,
    dateFormat = 'DD/MM/YYYY',
    thousandSeparator = ' ',
    decimalSeparator = ','
  } = options;

  if (!sheets || sheets.length === 0) {
    console.error('Aucune feuille à exporter');
    return;
  }

  // Configuration partagée
  const config = {
    autoWidth,
    maxWidth,
    dateFormat,
    thousandSeparator,
    decimalSeparator
  };

  // Formater une date
  const formatDate = (date: any): string => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    
    return config.dateFormat
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  };

  // Formater un nombre
  const formatNumber = (number: any): string => {
    if (number === undefined || number === null) return '';
    const num = parseFloat(number);
    if (isNaN(num)) return String(number);
    
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
    return parts.join(config.decimalSeparator);
  };

  // Récupérer une valeur imbriquée
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj);
  };

  // Préparer une feuille
  const prepareSheet = (sheet: Sheet) => {
    const { name, data, headers = null } = sheet;
    
    // Convertir les données en tableau
    let dataArray = Array.isArray(data) ? data : [data];
    
    if (dataArray.length === 0) {
      console.warn(`La feuille "${name}" est vide`);
      return null;
    }

    let formattedData: any[] = [];
    let columnWidths: Record<string, number> = {};

    if (headers && headers.length > 0) {
      formattedData = dataArray.map(item => {
        const row: Record<string, any> = {};
        headers.forEach(header => {
          let value = getNestedValue(item, header.key);
          
          if (header.format && typeof header.format === 'function') {
            value = header.format(value);
          } else {
            if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
              value = formatDate(value);
            } else if (typeof value === 'number') {
              value = formatNumber(value);
            }
          }
          
          row[header.label] = value;
          
          if (config.autoWidth) {
            const cellLength = String(value).length;
            const headerLength = header.label.length;
            const currentWidth = columnWidths[header.label] || 0;
            columnWidths[header.label] = Math.min(
              Math.max(currentWidth, cellLength, headerLength),
              config.maxWidth
            );
          }
        });
        return row;
      });
    } else {
      formattedData = dataArray.map(item => {
        const row: Record<string, any> = {};
        Object.keys(item).forEach(key => {
          let value = item[key];
          
          if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
            value = formatDate(value);
          } else if (typeof value === 'number') {
            value = formatNumber(value);
          }
          
          row[key] = value;
          
          if (config.autoWidth) {
            const cellLength = String(value).length;
            const headerLength = key.length;
            const currentWidth = columnWidths[key] || 0;
            columnWidths[key] = Math.min(
              Math.max(currentWidth, cellLength, headerLength),
              config.maxWidth
            );
          }
        });
        return row;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Appliquer les largeurs
    if (config.autoWidth) {
      if (headers && headers.length > 0) {
        const widths = headers.map(header => ({ 
          wch: header.width || columnWidths[header.label] || 15 
        }));
        if (widths.length > 0) worksheet['!cols'] = widths;
      } else {
        const columnWidthValues = Object.values(columnWidths);
        if (columnWidthValues.length > 0) {
          const minWidth = Math.min(...columnWidthValues);
          const widths = Object.keys(columnWidths).map(() => ({ wch: minWidth }));
          if (widths.length > 0) worksheet['!cols'] = widths;
        }
      }
    }

    return { worksheet, name };
  };

  // Créer le classeur
  const workbook = XLSX.utils.book_new();
  
  // Ajouter chaque feuille
  sheets.forEach(sheet => {
    const preparedSheet = prepareSheet(sheet);
    if (preparedSheet) {
      XLSX.utils.book_append_sheet(workbook, preparedSheet.worksheet, preparedSheet.name);
    }
  });

  // Générer et sauvegarder le fichier
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, `${filename}.xlsx`);
};

export default exportToExcel;