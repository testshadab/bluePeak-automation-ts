import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test case data structure
 */
export interface TestCase {
  name: string;
  url: string;
  testFile?: string;
  location1?: string;
  location2?: string;
  restartSessions?: boolean;
  prompts: string[];
  writingStyle?: string | string[];
  extrasPreference?: string | string[];
  personalityGuide?: string | string[];
  scenarioContext?: string | string[];
  PersonaName?: string[];
  bookingRequirements?: string;
  MakeBooking?: boolean[];
  Retrieve?: boolean[];
  ModifyDate?: boolean[];
  BiggerCar?: boolean[];
  AddChildseat?: boolean[];
  Cancel?: boolean[];
}

/**
 * Config data structure
 */
export interface TestConfig {
  tests: TestCase[];
}

// TRUE detector: Excel boolean true OR string "TRUE" (any case/spacing)
const flagFromCell = (v: unknown): boolean =>
  v === true || (typeof v === 'string' && v.trim().toUpperCase() === 'TRUE');

// Normalize header names for matching (ignore spaces, case)
const norm = (s: string): string => String(s || '').replace(/\s+/g, '').toLowerCase();

/**
 * Find a header given one or more acceptable names.
 */
function findHeaderOrThrow(
  allRows: Record<string, unknown>[],
  candidates: string | string[],
  fileName: string
): string {
  const want = Array.isArray(candidates) ? candidates : [candidates];
  const allKeys = new Set<string>();
  for (const r of allRows) Object.keys(r || {}).forEach((k) => allKeys.add(k));

  const found = [...allKeys].find((k) => want.some((w) => norm(k) === norm(w)));
  if (!found) {
    throw new Error(`Column "${want.join('" or "')}" not found in ${fileName}`);
  }
  return found;
}

/**
 * Load and merge test data from Config.json and Excel files
 */
export function getUpdatedTestData(): TestConfig {
  const configPath = path.resolve(__dirname, '../test-data/config.json');

  // If config doesn't exist, return empty tests array
  if (!fs.existsSync(configPath)) {
    console.warn('Config file not found, returning empty test data');
    return { tests: [] };
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as TestConfig;

  config.tests = config.tests.map((test) => {
    // If no testFile specified, just return the test as-is with empty prompts
    if (!test.testFile) {
      return { ...test, prompts: test.prompts || [] };
    }

    const excelPath = path.resolve(__dirname, '../test-data', test.testFile);
    if (!fs.existsSync(excelPath)) {
      console.warn(`Excel file not found: ${test.testFile}, skipping`);
      return { ...test, prompts: [] };
    }

    const wb = xlsx.readFile(excelPath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const all = xlsx.utils.sheet_to_json(ws, { defval: '' }) as Record<string, unknown>[];

    if (!all.length) {
      console.warn(`No data in ${path.basename(excelPath)}`);
      return { ...test, prompts: [] };
    }

    // Define expected columns (+ synonyms where applicable)
    const STR: Record<string, string[]> = {
      initialPrompt: ['initialPrompt'],
      writingStyle: ['writingStyle'],
      extrasPreference: ['extrasPreference'],
      PersonalityGuidance: ['PersonalityGuidance'],
      scenarioContext: ['scenarioContext'],
      PersonaName: ['PersonaName'],
    };

    const BOOL: Record<string, string[]> = {
      MakeBooking: ['MakeBooking'],
      Retrieve: ['Retrieve'],
      ModifyDate: ['ModifyDate'],
      BiggerCar: ['BiggerCar'],
      AddCarSeat: ['AddCarSeat', 'AddChildseat'],
      Cancel: ['Cancel'],
    };

    // Build a header map
    const H: Record<string, string> = {};
    for (const [k, wants] of Object.entries(STR)) {
      try {
        H[k] = findHeaderOrThrow(all, wants, path.basename(excelPath));
      } catch {
        // Column not required
      }
    }
    for (const [k, wants] of Object.entries(BOOL)) {
      try {
        H[k] = findHeaderOrThrow(all, wants, path.basename(excelPath));
      } catch {
        // Column not required
      }
    }

    // Keep only rows with non-empty initialPrompt
    const rows = all.filter((r) => String(r[H.initialPrompt] ?? '').trim() !== '');

    // Build aligned arrays
    const out: Partial<TestCase> = {
      prompts: rows.map((r) => String(r[H.initialPrompt] ?? '').trim()),
      writingStyle: H.writingStyle
        ? rows.map((r) => String(r[H.writingStyle] ?? '').trim()).filter(Boolean)
        : undefined,
      extrasPreference: H.extrasPreference
        ? rows.map((r) => String(r[H.extrasPreference] ?? '').trim()).filter(Boolean)
        : undefined,
      personalityGuide: H.PersonalityGuidance
        ? rows.map((r) => String(r[H.PersonalityGuidance] ?? '').trim()).filter(Boolean)
        : undefined,
      scenarioContext: H.scenarioContext
        ? rows.map((r) => String(r[H.scenarioContext] ?? '').trim()).filter(Boolean)
        : undefined,
      PersonaName: H.PersonaName
        ? rows.map((r) => String(r[H.PersonaName] ?? '').trim()).filter(Boolean)
        : undefined,
      MakeBooking: H.MakeBooking ? rows.map((r) => flagFromCell(r[H.MakeBooking])) : undefined,
      Retrieve: H.Retrieve ? rows.map((r) => flagFromCell(r[H.Retrieve])) : undefined,
      ModifyDate: H.ModifyDate ? rows.map((r) => flagFromCell(r[H.ModifyDate])) : undefined,
      BiggerCar: H.BiggerCar ? rows.map((r) => flagFromCell(r[H.BiggerCar])) : undefined,
      AddChildseat: H.AddCarSeat ? rows.map((r) => flagFromCell(r[H.AddCarSeat])) : undefined,
      Cancel: H.Cancel ? rows.map((r) => flagFromCell(r[H.Cancel])) : undefined,
    };

    return { ...test, ...out };
  });

  return config;
}

export default getUpdatedTestData;

