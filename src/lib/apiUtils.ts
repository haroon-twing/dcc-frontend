import api from './api';

export const apiCallWithRetry = async (
  apiCall: () => Promise<any>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<any> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain error types
      if (
        error.code === 'ERR_NETWORK' || 
        error.code === 'ERR_INSUFFICIENT_RESOURCES' ||
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.response?.status === 404
      ) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
    }
  }
  
  throw lastError;
};

export const safeApiCall = async (apiCall: () => Promise<any>): Promise<any> => {
  try {
    return await apiCall();
  } catch (error: any) {
    // Log only non-network errors to avoid spam
    if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_INSUFFICIENT_RESOURCES') {
      console.error('API Error:', error);
    }
    throw error;
  }
};
