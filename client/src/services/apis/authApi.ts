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

    login: async (email: string, password: string)=> {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    }
}