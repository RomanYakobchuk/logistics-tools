import apiClient from './api-client';
import {
    AuthTokensResponse,
    MfaResponse,
    SignInResponse,
    TokenData,
    CompanyListResponse,
    BranchListResponse
} from './types/auth-types';

export const signIn = async (
    email: string,
    password: string,
    deviceKey?: string
): Promise<SignInResponse> => {
    const response = await apiClient.post('/api/auth/sign-in', {
        email,
        password,
        deviceKey,
    });
    return response.data;
};

export const verifyMfaCode = async (
    email: string,
    code: string,
    session: string,
    rememberDevice: boolean = false
): Promise<MfaResponse> => {
    const response = await apiClient.post('/api/auth/sign-in/mfa', {
        email,
        code,
        session,
        rememberDevice,
    });
    return response.data;
};

export const selectCompany = async (
    email: string,
    company: string,
    session: string,
    rememberDevice: boolean = false,
    deviceKey?: string
): Promise<AuthTokensResponse> => {
    const response = await apiClient.post('/api/auth/sign-in/company', {
        email,
        company,
        session,
        rememberDevice,
        deviceKey,
    });
    return response.data;
};

export const refreshTokenService = async (
    accessToken: string,
    refreshToken: string,
    company: string,
    branch?: string
): Promise<AuthTokensResponse> => {
    const response = await apiClient.post('/api/auth/sign-in/token', {
        accessToken,
        refreshToken,
        company,
        branch,
    });
    return response.data;
};

export const parseJwt = (token: string): TokenData => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error(e);
        return {} as TokenData;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const tokenData = parseJwt(token);

    if (!tokenData || !tokenData.exp) {
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return tokenData.exp <= currentTime;
};

export const isUserSystemAdmin = (token: string): boolean => {
    const tokenData = parseJwt(token);

    return (
        Array.isArray(tokenData["cognito:groups"]) &&
        tokenData["cognito:groups"].includes("SystemAdministrators")
    );
};

export const getUserCompany = (token: string): string => {
    const tokenData = parseJwt(token);
    return tokenData.company || '';
};

export const getUserBranch = (token: string): string => {
    const tokenData = parseJwt(token);
    return tokenData.branch || '';
};


export const getCompanies = async (): Promise<CompanyListResponse> => {
    const response = await apiClient.get('/api/companies');
    return response.data;
}

export const switchCompany = async (
    accessToken: string,
    refreshToken: string,
    company: string,
    branch?: string
): Promise<AuthTokensResponse> => {
    return await refreshTokenService(accessToken, refreshToken, company, branch);
}

export const getBranches = async (): Promise<BranchListResponse> => {
    const response = await apiClient.get('/api/branches');
    return response.data;
}