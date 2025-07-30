/**
 * Debug logging utility that only logs in development environment
 */

const isDevelopment = () => {
  // Check for Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV === true;
  }
  
  // Fallback to process.env for Node.js environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }
  
  // Default to false in production
  return false;
};

/**
 * Debug logger that only outputs in development environment
 * @param message - The debug message
 * @param data - Optional data to log
 */
export const debugLog = (message: string, data?: any) => {
  if (isDevelopment()) {
    if (data !== undefined) {
      console.log(`🔍 ${message}`, data);
    } else {
      console.log(`🔍 ${message}`);
    }
  }
};

/**
 * Debug logger for grant-related operations
 * @param operation - The operation being performed
 * @param data - The data to log
 */
export const debugGrant = (operation: string, data: any) => {
  debugLog(`Grant ${operation}:`, data);
};

/**
 * Debug logger for funding amount formatting
 * @param type - The type of formatting (min-max, max only, total, etc.)
 * @param result - The formatted result
 */
export const debugFundingAmount = (type: string, result: string) => {
  debugLog(`formatFundingAmount: ${type} -> ${result}`);
}; 