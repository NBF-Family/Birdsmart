export const tokenStorage = {
    setToken: (token: string): void => {
        localStorage.setItem('access_token', token);
    },
      
    getToken: (): string | null => {
        return localStorage.getItem('access_token');
    },
    
    removeToken: (): void => {
        localStorage.removeItem('access_token');
    },
    
    getAuthHeader: (): string | null => {
        const token = tokenStorage.getToken();
        return token ? `Bearer ${token}` : null;
    }
}