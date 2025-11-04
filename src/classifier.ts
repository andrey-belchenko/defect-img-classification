import Papa from 'papaparse';

export interface ClassifierItem {
  has_cause: boolean;
  has_value: boolean;
  flaw_id: number | null;
  id: number;
  material_id: number | null;
  standard_id: number;
  struct_elem_id: number;
  template: string;
  id2: number; // Second id column (renamed to avoid conflict)
  name: string;
  description: string;
}

// Function to convert string to boolean
function parseBoolean(value: string): boolean {
  return value.toLowerCase() === 'true';
}

// Function to convert string to number or null
function parseNumberOrNull(value: string): number | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : Number(trimmed);
}

// Get raw CSV text
export async function getClassifierText(): Promise<string> {
  try {
    const csvModule = await import('./classifier.csv?raw');
    return csvModule.default;
  } catch (error) {
    console.error('Error loading classifier text:', error);
    return '';
  }
}

// Get parsed classifier data
export async function getClassifierData(): Promise<ClassifierItem[]> {
  try {
    // Import CSV as raw text
    const csvText = await getClassifierText();
    
    if (!csvText) {
      return [];
    }
    
    // Parse CSV using PapaParse
    const parseResult = Papa.parse<string[]>(csvText, {
      header: false,
      skipEmptyLines: true,
    });

    if (!parseResult.data || parseResult.data.length === 0) {
      return [];
    }

    // Skip header row
    const dataRows = parseResult.data.slice(1);
    const items: ClassifierItem[] = [];

    for (const row of dataRows) {
      if (row.length >= 11) {
        items.push({
          has_cause: parseBoolean(row[0]),
          has_value: parseBoolean(row[1]),
          flaw_id: parseNumberOrNull(row[2]),
          id: Number(row[3]),
          material_id: parseNumberOrNull(row[4]),
          standard_id: Number(row[5]),
          struct_elem_id: Number(row[6]),
          template: row[7],
          id2: Number(row[8]),
          name: row[9],
          description: row[10],
        });
      }
    }

    return items;
  } catch (error) {
    console.error('Error parsing classifier data:', error);
    return [];
  }
}


