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

        const coords = [0, 0];

        const registerData: RegisterRequest = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            profile: {
                full_name: formData.fullName,
                location: {
                coords,
                city: formData.location.city,
                country: formData.location.country,
                state: formData.location.state,
                },
            },
        };

        try {
            const response = await api.post<UserOut>('/auth/signup', registerData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Registration failed');
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