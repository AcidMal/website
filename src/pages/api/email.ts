import axios from 'axios';
import type { CreateEmailAccountDTO, EmailAccount, ApiResponse } from '../../types/email';

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
const API_KEY = import.meta.env.PUBLIC_API_KEY;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-API-Key'
    },
});

// Add request interceptor to handle preflight
api.interceptors.request.use((config) => {
    if (config.method === 'options') {
        config.headers['Access-Control-Max-Age'] = '86400';
    }
    return config;
});

export const emailService = {
    async createEmailAccount(data: CreateEmailAccountDTO): Promise<ApiResponse<EmailAccount>> {
        try {
            const response = await api.post<ApiResponse<EmailAccount>>('/add/mailbox', data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create email account',
            };
        }
    },

    async getEmailAccounts(): Promise<ApiResponse<EmailAccount[]>> {
        try {
            const response = await api.get<ApiResponse<EmailAccount[]>>('/email-accounts');
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch email accounts',
            };
        }
    },
}; 