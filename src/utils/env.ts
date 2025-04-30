
/**
 * Environment variables utility
 * 
 * This file provides type-safe access to environment variables.
 * All environment variables must be prefixed with VITE_ to be accessible in the browser.
 */

interface EnvVariables {
  MAPBOX_PUBLIC_TOKEN: string;
  // Add other environment variables as needed
}

/**
 * Get an environment variable with type checking
 * @param key The environment variable name (without VITE_ prefix)
 * @returns The environment variable value
 */
export function getEnv<K extends keyof EnvVariables>(key: K): string {
  const viteKey = `VITE_${key}`;
  const value = import.meta.env[viteKey];
  
  if (value === undefined) {
    console.warn(`Environment variable ${viteKey} is not defined`);
    return '';
  }
  
  return value as string;
}

/**
 * Check if all required environment variables are defined
 * @returns Array of missing environment variables
 */
export function checkRequiredEnvVars(): string[] {
  const required: (keyof EnvVariables)[] = [
    'MAPBOX_PUBLIC_TOKEN',
    // Add other required environment variables here
  ];
  
  return required.filter(key => !getEnv(key));
}
