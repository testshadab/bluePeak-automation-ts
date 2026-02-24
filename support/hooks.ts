import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, ITestCaseHookParameter } from '@cucumber/cucumber';
import fs from 'fs';
import path from 'path';
import { cleanupDirectories } from '../utils/cleanup.js';
import { Timeouts } from '../configs/index.js';
import { CustomWorld } from './world.js';

// Set step timeout based on profile
const profile = process.env.TEST_PROFILE || 'default';
// @ts-ignore - Dynamic access to Timeouts.step
const stepTimeout = Timeouts.step[profile] || Timeouts.step.default;
setDefaultTimeout(stepTimeout);

// Global state for run tracking
declare global {
  // eslint-disable-next-line no-var
  var __RUN_ID__: string;
  // eslint-disable-next-line no-var
  var __RUN_DIR__: string;
}

/**
 * Ensure directory exists
 */
function ensureDir(p: string): void {
  fs.mkdirSync(p, { recursive: true });
}

/**
 * Create a unique run ID for this worker
 */
function makeRunId(): string {
  const iso = new Date().toISOString().replace(/[:]/g, '-');
  const wid = process.env.CUCUMBER_WORKER_ID ?? 'w0';
  return `run-${iso}.${wid}.${process.pid}`;
}

/**
 * Initialize once across all parallel workers
 */
function initOnce(): void {
  const lockDir = path.resolve('reports');
  const lock = path.join(lockDir, '.init.lock');

  try {
    if (!fs.existsSync(lockDir)) ensureDir(lockDir);
    const created = fs.openSync(lock, 'wx'); // throws if already exists
    fs.closeSync(created);

    // Only the first worker reaches here
    cleanupDirectories();
    ensureDir(lockDir);
    fs.writeFileSync(lock, String(Date.now()));
    console.log('🧹 Cleaned reports/ and downloadfile/ once for all workers');
  } catch {
    // Lock already exists -> another worker already cleaned
  }
}

// ========== BeforeAll Hook ==========
BeforeAll(async function () {
  initOnce();

  // Create unique run folder for THIS worker
  const RUN_ID = makeRunId();
  const RUN_DIR = path.resolve('reports', RUN_ID);
  ensureDir(RUN_DIR);

  global.__RUN_ID__ = RUN_ID;
  global.__RUN_DIR__ = RUN_DIR;

  // Remove legacy shared CSV if present
  const legacyCsv = path.resolve('chatbot_results.csv');
  if (fs.existsSync(legacyCsv)) {
    fs.unlinkSync(legacyCsv);
    console.log('🗑 Removed legacy chatbot_results.csv');
  }

  console.log(`📂 Using run directory: ${global.__RUN_DIR__}`);

  // Log environment configuration for debugging
  console.log('========================================');
  console.log('🔧 Environment Configuration:');
  console.log(`   TARGET_ENV: ${process.env.TARGET_ENV || '(not set)'}`);
  console.log(`   TARGET_URL: ${process.env.TARGET_URL || '(not set)'}`);
  console.log(`   TEST_PAGE_URL: ${process.env.TEST_PAGE_URL || '(not set)'}`);
  console.log(`   TEST_PROFILE: ${process.env.TEST_PROFILE || '(not set)'}`);
  console.log('========================================');
});

// ========== Shard Configuration ==========
Before({ tags: '@shard0' }, function (this: CustomWorld) {
  this.shardIndex = 0;
  this.shardTotal = 3; // <-- 3 shards
});

Before({ tags: '@shard1' }, function (this: CustomWorld) {
  this.shardIndex = 1;
  this.shardTotal = 3; // <-- 3 shards
});

Before({ tags: '@shard2' }, function (this: CustomWorld) {
  this.shardIndex = 2;
  this.shardTotal = 3; // <-- 3 shards
});

// OPTIONAL: if you later add shard3, set shardTotal = 4 for ALL shard0..3
Before({ tags: '@shard3' }, function (this: CustomWorld) {
  this.shardIndex = 3;
  this.shardTotal = 4;
});

// ========== Before Each Scenario ==========
Before(async function (this: CustomWorld) {
  await this.init();
  this.conversationUrl = undefined;
  console.log(`🔀 Shard: ${this.shardIndex}/${this.shardTotal}`);
});

// ========== After Each Scenario ==========
After(async function (this: CustomWorld, { result }: ITestCaseHookParameter) {
  try {
    if (result?.status === 'FAILED' && this.page) {
      const screenshotPath = path.join(global.__RUN_DIR__ ?? 'reports', `failure-${Date.now()}.png`);
      const screenshot = await this.takeScreenshot(screenshotPath);
      if (screenshot) await this.attach(screenshot, 'image/png');
      console.log(`Screenshot saved: ${screenshotPath}`);
    }
  } catch (err) {
    console.error('Error in After hook:', err);
  } finally {
    await this.cleanup();
  }
});

// ========== AfterAll Hook ==========
AfterAll(async function () {
  console.log('✅ Test run complete');
});

