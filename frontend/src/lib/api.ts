// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to set auth token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Helper function to remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// API request helper with auth headers
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  console.log('API Request:', {
    endpoint: `${apiConfig.baseURL}${endpoint}`,
    token: token ? 'Present' : 'Missing',
    method: options.method || 'GET'
  });
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${apiConfig.baseURL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response;
};

// ==================== Loyalty Points API Helpers ====================

// Helper function for loyalty points API calls
export const loyaltyApiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return apiRequest(`/loyalty-points${endpoint}`, options);
};

// Helper function for admin loyalty points API calls
export const adminLoyaltyApiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return apiRequest(`/loyalty-points/admin${endpoint}`, options);
};

// Helper function to handle API responses with error handling
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// Helper function for GET requests
export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint);
  return handleApiResponse<T>(response);
};

// Helper function for POST requests
export const apiPost = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleApiResponse<T>(response);
};

// Helper function for PUT requests
export const apiPut = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleApiResponse<T>(response);
};

// Helper function for DELETE requests
export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
  });
  return handleApiResponse<T>(response);
};