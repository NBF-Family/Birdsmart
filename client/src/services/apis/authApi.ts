import type { RegisterFormData, UserOut } from "../../types/auth";
import api from "./api";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    profile: {
      full_name: string;
      location: {
        coords: number[];
        city: string;
        country: string;
        state: string;
      };
    };
    role?: string;
}

export const authApi = {
    register: async (formData: RegisterFormData): Promise<UserOut> => {
        try {
            const response = await api.post<UserOut>('/auth/signup', formData);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.detail) {
                // Handle complex validation errors
                if (Array.isArray(error.response.data.detail)) {
                    const errorMessages = error.response.data.detail.map((err: any) => {
                        const field = err.loc[err.loc.length - 1];
                        return `${field}: ${err.msg}`;
                    }).join(', ');
                    throw new Error(errorMessages);
                }
                // Handle simple string errors
                throw new Error(error.response.data.detail);
            }
            throw new Error('Registration failed');
        }
    },

    login: async (email: string, password: string): Promise<UserOut> => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await api.post<UserOut>('/auth/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error: any) {
            // Even if logout fails on server, we still want to redirect
            console.error('Logout error:', error);
        }
    },

    // Check if user is authenticated by making a request that requires auth
    checkAuth: async (): Promise<UserOut | null> => {
        try {
            // We can create a simple endpoint for this, or use an existing protected endpoint
            // For now, let's assume we'll create a /auth/me endpoint
            const response = await api.get<UserOut>('/auth/me');
            return response.data;
        } catch (error: any) {
            return null;
        }
    }
}