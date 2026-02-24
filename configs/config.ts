import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const envFile = process.env.ENV ? `.env.${process.env.ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

/**
 * Browser configuration options
 */
export interface BrowserConfig {
    name: 'chromium' | 'firefox' | 'webkit';
    headless: boolean;
    slowMo: number;
    viewport: {
        width: number;
        height: number;
    };
    timeout: number;
    screenshot: 'on' | 'off' | 'only-on-failure';
    video: 'on' | 'off' | 'retain-on-failure';
    trace: 'on' | 'off' | 'retain-on-failure';
}

/**
 * API configuration options
 */
export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    retries: number;
    headers: Record<string, string>;
}

/** Strip optional surrounding quotes from .env values (e.g. PASSWORD="value") */
function stripEnvQuotes(s: string): string {
    const t = s.trim();
    if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
    if (t.length >= 2 && t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
    return t;
}

/**
 * Helper to get required environment variable
 */
function getRequiredEnv(key: string, fallback?: string): string {
    const value = process.env[key] || fallback;
    if (!value) {
        console.warn(`Warning: Environment variable ${key} is not set. Please check your .env file.`);
        return '';
    }
    return stripEnvQuotes(value);
}

/**
 * Helper to get optional environment variable with default
 */
function getOptionalEnv(key: string, defaultValue: string): string {
    const value = process.env[key] || defaultValue;
    return stripEnvQuotes(value);
}

/**
 * Main configuration class
 * All URLs and credentials should be set via environment variables (.env file)
 */
export class Config {
    private static instance: Config;

    // Environment
    readonly env: string;
    readonly isCI: boolean;
    readonly isDebug: boolean;

    // URLs (from .env)
    readonly baseUrl: string;
    readonly apiBaseUrl: string;

    // Browser settings
    readonly browser: BrowserConfig;

    // API settings
    readonly api: ApiConfig;

    // Timeouts
    readonly defaultTimeout: number;
    readonly elementTimeout: number;
    readonly pageLoadTimeout: number;
    readonly apiTimeout: number;

    // Paths
    readonly screenshotsPath: string;
    readonly videosPath: string;
    readonly reportsPath: string;
    readonly tracePath: string;

    // Test data (from .env)
    readonly testData: {
        adminEmail: string;
        adminPassword: string;
        userEmail: string;
        userPassword: string;
    };

    private constructor() {
        // Environment detection
        this.env = getOptionalEnv('ENV', 'staging');
        this.isCI = process.env.CI === 'true';
        this.isDebug = process.env.DEBUG === 'true';

        // URLs from environment variables
        this.baseUrl = getRequiredEnv('BASE_URL', 'https://customer15.vastpacific.com');
        this.apiBaseUrl = getRequiredEnv('API_BASE_URL', `${this.baseUrl}/api`);

        // Browser configuration
        this.browser = {
            name: (getOptionalEnv('BROWSER', 'chromium') as 'chromium' | 'firefox' | 'webkit'),
            headless: process.env.HEADLESS !== 'false',
            slowMo: this.isDebug ? 100 : 0,
            viewport: {
                width: parseInt(getOptionalEnv('VIEWPORT_WIDTH', '1920')),
                height: parseInt(getOptionalEnv('VIEWPORT_HEIGHT', '1080')),
            },
            timeout: parseInt(getOptionalEnv('BROWSER_TIMEOUT', '30000')),
            screenshot: this.isCI ? 'only-on-failure' : 'on',
            video: this.isCI ? 'retain-on-failure' : 'off',
            trace: this.isCI ? 'retain-on-failure' : 'off',
        };

        // API configuration
        this.api = {
            baseUrl: this.apiBaseUrl,
            timeout: parseInt(getOptionalEnv('API_TIMEOUT', '30000')),
            retries: parseInt(getOptionalEnv('API_RETRIES', '3')),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        // Timeouts
        this.defaultTimeout = parseInt(getOptionalEnv('DEFAULT_TIMEOUT', '30000'));
        this.elementTimeout = parseInt(getOptionalEnv('ELEMENT_TIMEOUT', '10000'));
        this.pageLoadTimeout = parseInt(getOptionalEnv('PAGE_LOAD_TIMEOUT', '60000'));
        this.apiTimeout = parseInt(getOptionalEnv('API_TIMEOUT', '30000'));

        // Paths
        this.screenshotsPath = path.resolve(process.cwd(), getOptionalEnv('SCREENSHOTS_PATH', 'screenshots'));
        this.videosPath = path.resolve(process.cwd(), getOptionalEnv('VIDEOS_PATH', 'videos'));
        this.reportsPath = path.resolve(process.cwd(), getOptionalEnv('REPORTS_PATH', 'reports'));
        this.tracePath = path.resolve(process.cwd(), getOptionalEnv('TRACE_PATH', 'trace'));

        // Test data from environment variables
        this.testData = {
            adminEmail: getRequiredEnv('ADMIN_EMAIL'),
            adminPassword: getRequiredEnv('ADMIN_PASSWORD'),
            userEmail: getRequiredEnv('USER_EMAIL'),
            userPassword: getRequiredEnv('USER_PASSWORD'),
        };
    }

    /**
     * Get singleton instance
     */
    static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    /**
     * Get environment-specific value
     */
    getEnvValue<T>(values: Record<string, T>, defaultValue: T): T {
        return values[this.env] || defaultValue;
    }
}

// Export singleton instance
export const config = Config.getInstance();