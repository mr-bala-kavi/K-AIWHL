import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:8000';

// Create axios instance for API calls
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // CORS vulnerability allows credentials from any origin
    withCredentials: true,
});

// Auth API
export const authAPI = {
    login: async (credentials: any) => {
        const response = await apiClient.post('/api/auth/login', credentials);
        return response.data;
    },

    register: async (username: string, password: string, email: string) => {
        const response = await apiClient.post('/api/auth/register', { username, password, email });
        return response.data;
    },
};

// LLM API
export const llmAPI = {
    chat: async (message: string) => {
        const response = await apiClient.post('/api/llm/chat', { message });
        return response.data;
    },

    chatWithRAG: async (message: string) => {
        const response = await apiClient.post('/api/llm/chat-rag', { message, use_rag: true });
        return response.data;
    },

    generateHTML: async (prompt: string) => {
        const response = await apiClient.post('/api/llm/generate-html', null, {
            params: { prompt }
        });
        return response.data;
    },
};

// Fetch API (SSRF vulnerable)
export const fetchAPI = {
    fetchUrl: async (url: string) => {
        const response = await apiClient.post('/api/fetch/url', { url });
        return response.data;
    },
};

// Profile API (IDOR vulnerable)
export const profileAPI = {
    getProfile: async (userId: string) => {
        const response = await apiClient.get(`/api/profile/${userId}`);
        return response.data;
    },

    updateProfile: async (userId: string, data: any) => {
        const response = await apiClient.put(`/api/profile/${userId}`, data);
        return response.data;
    },
};

// Upload API (RCE vulnerable)
export const uploadAPI = {
    uploadFile: async (file: File, type: string = 'pickle') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await axios.post(`${UPLOAD_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

// OAuth API
export const oauthAPI = {
    authorize: async (redirectUri: string) => {
        const response = await apiClient.get('/api/oauth/authorize', {
            params: { redirect_uri: redirectUri }
        });
        return response.data;
    },

    callback: async (code: string, state?: string) => {
        const response = await apiClient.get('/api/oauth/callback', {
            params: { code, state }
        });
        return response.data;
    },
};
