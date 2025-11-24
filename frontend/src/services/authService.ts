import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
    async signup(name: string, email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/signup', {
            name,
            email,
            password,
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', {
            email,
            password,
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<{ user: User }>('/auth/me');
        return response.data.user;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },
};
