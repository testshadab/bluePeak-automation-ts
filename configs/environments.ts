/**
 * Environment configurations for AI QA tests
 */

export interface EnvironmentConfig {
  name: string;
  chatWidgetUrl: string;
  websocketUrl: string;
  chatApiUrl: string;
  adminApiUrl: string;
  testPageUrl: string;
}

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'Development',
    chatWidgetUrl: process.env.TARGET_URL || 'https://chat-dev.carcloud.ai',
    websocketUrl: 'wss://ws-dev.carcloud.ai',
    chatApiUrl: 'https://chat-api-dev.carcloud.ai/graphql',
    adminApiUrl: 'https://api-dev.carcloud.ai/graphql',
    testPageUrl: 'https://ccinternal.wpenginepowered.com/floatingbatpotato/',
  },
  production: {
    name: 'Production',
    chatWidgetUrl: process.env.TARGET_URL || 'https://chat.carcloud.ai',
    websocketUrl: 'wss://ws.carcloud.ai',
    chatApiUrl: 'https://chat-api.carcloud.ai/graphql',
    adminApiUrl: 'https://api.carcloud.ai/graphql',
    testPageUrl: 'https://ccinternal.wpenginepowered.com/redsquirrelbrick/',
  },
  local: {
    name: 'Local',
    chatWidgetUrl: process.env.TARGET_URL || 'http://localhost:3001',
    websocketUrl: 'ws://localhost:3002',
    chatApiUrl: 'http://localhost:4001/graphql',
    adminApiUrl: 'http://localhost:4000/graphql',
    testPageUrl: 'http://localhost:8080',
  },
};

/**
 * Get the current environment configuration
 * Priority: TARGET_ENV env var > NODE_ENV > default to development
 */
export function getCurrentEnvironment(): EnvironmentConfig {
  const envName = process.env.TARGET_ENV || process.env.NODE_ENV || 'development';
  const config = environments[envName] || environments.development;

  // Allow TARGET_URL to override the chat widget URL
  if (process.env.TARGET_URL) {
    config.chatWidgetUrl = process.env.TARGET_URL;
  }

  return config;
}

export default environments;

