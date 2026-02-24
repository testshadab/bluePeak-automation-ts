import fs from 'fs';
import path from 'path';

/**
 * Test metadata for creating writers
 */
export interface TestMeta {
  name: string;
  url: string;
}

/**
 * CSV row data
 */
export interface CsvRow {
  Name: string;
  Trigger: string;
  Response: string;
}

/**
 * NDJSON event data
 */
export interface NdjsonEvent {
  type: string;
  [key: string]: unknown;
}

/**
 * Test result summary
 */
export interface TestResult {
  name?: string;
  url?: string;
  status: string;
  durationSec?: number;
  confirmationNumber?: string | null;
  surname?: string | null;
  failureMessage?: string;
  kind?: string;
  shard?: number;
  runId?: string;
}

/**
 * Writers for test output
 */
export interface TestWriters {
  slug: string;
  testDir: string;
  csvPath: string;
  ndjsonPath: string;
  resultPath: string;
  writeCsv: (row: CsvRow) => void;
  writeNdjson: (obj: NdjsonEvent) => void;
  writeResult: (summary: TestResult) => void;
}

/**
 * Create a safe slug from a string
 */
export function safeSlug(s: string): string {
  return String(s || 'test')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

/**
 * Create per-test file writers for CSV, NDJSON, and result output
 */
export function createPerTestWriters(testMeta: TestMeta): TestWriters {
  const runDir = global.__RUN_DIR__ || path.resolve('reports');
  const slug = safeSlug(testMeta.name);
  const testDir = path.join(runDir, slug);

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // CSV (append mode) – write header when file doesn't exist
  const csvPath = path.join(testDir, 'chatbot_results.csv');
  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, 'Name,Trigger,Response\n');
  }

  const writeCsv = ({ Name, Trigger, Response }: CsvRow): void => {
    const row =
      [
        String(Name ?? '').replace(/"/g, '""'),
        String(Trigger ?? '').replace(/"/g, '""'),
        String(Response ?? '').replace(/"/g, '""'),
      ]
        .map((v) => `"${v}"`)
        .join(',') + '\n';
    fs.appendFileSync(csvPath, row);
  };

  // NDJSON trace – one JSON object per line
  const ndjsonPath = path.join(testDir, 'trace.ndjson');
  const writeNdjson = (obj: NdjsonEvent): void => {
    fs.appendFileSync(ndjsonPath, JSON.stringify({ ts: new Date().toISOString(), ...obj }) + '\n');
  };

  // Final single result.json
  const resultPath = path.join(testDir, 'result.json');
  const writeResult = (summaryObj: TestResult): void => {
    fs.writeFileSync(resultPath, JSON.stringify(summaryObj, null, 2));
  };

  return {
    slug,
    testDir,
    csvPath,
    ndjsonPath,
    resultPath,
    writeCsv,
    writeNdjson,
    writeResult,
  };
}

