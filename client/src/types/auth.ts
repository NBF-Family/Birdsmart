export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    location: {
        city: string;
        state: string;
        country: string;
        coords: Array<number>;
    };
    role: 'buyer' | 'seller' | 'admin';
}

export interface UserOut {
    id: string;
    username: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    profile: {
      full_name: string;
      location: {
        coords: number[];
        city: string;
        country: string;
        state: string;
      };
      avatar_url?: string;
    };
    rating: {
      avg: number;
      count: number;
    };
    created_at: Date;
    updated_at: Date;
}

export interface ApiError {
    detail: string;
  }