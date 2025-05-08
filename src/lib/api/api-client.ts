import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { refreshTokenService } from './auth-service';

const noTokenPaths = [
    '/api/auth/sign-in',
    '/api/auth/sign-in/mfa',
    '/api/auth/sign-in/token',
    '/api/auth/sign-in/company',
];

const apiClient = axios.create({
    timeout: 30000,
});

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (noTokenPaths.some(path => config.url?.includes(path))) {
            return config;
        }

        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('krw_accessToken');

            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !noTokenPaths.some(path => originalRequest.url?.includes(path))
        ) {
            originalRequest._retry = true;

            try {
                const accessToken = localStorage.getItem('krw_accessToken') || '';
                const refreshTokenValue = localStorage.getItem('krw_refreshToken') || '';
                const company = localStorage.getItem('krw_company') || '';

                const result = await refreshTokenService(accessToken, refreshTokenValue, company);

                localStorage.setItem('krw_accessToken', result.accessToken);
                localStorage.setItem('krw_refreshToken', result.refreshToken);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers['Authorization'] = `Bearer ${result.accessToken}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname + window.location.search;
                    window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;