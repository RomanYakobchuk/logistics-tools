'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    parseJwt,
    isTokenExpired,
    refreshTokenService,
    isUserSystemAdmin
} from '../api/auth-service';
import { AuthTokensResponse, TokenData, User } from '../api/types/auth-types';

const DEFAULT_TIMEOUT = 15 * 60 * 1000;

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    company: string;
    branch: string;
    accessToken: string;
    refreshToken: string;
    deviceKey: string;
    isSystemAdmin: boolean;
    tokenData: TokenData | null;
    lastActivity: number;
    loginTime: number | null;
    expiresAt: number | null;
    setSession: (data: AuthTokensResponse) => void;
    logout: () => void;
    isSessionExpired: boolean;
    resetSessionTimeout: () => void;
    getSessionTimeRemaining: () => { minutes: number; seconds: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [accessToken, setAccessToken] = useState<string>('');
    const [refreshTokenValue, setRefreshToken] = useState<string>('');
    const [deviceKey, setDeviceKey] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<string>('');
    const [branch, setBranch] = useState<string>('');
    const [tokenData, setTokenData] = useState<TokenData | null>(null);
    const [isSystemAdmin, setIsSystemAdmin] = useState<boolean>(false);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const [loginTime, setLoginTime] = useState<number | null>(null);

    const [lastActivity, setLastActivity] = useState<number>(Date.now());
    const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
    const sessionTimeoutId = useRef<NodeJS.Timeout | null>(null);

    const getSessionTimeout = (tokenData: TokenData | null): number => {
        if (!tokenData || !tokenData.exp) {
            return DEFAULT_TIMEOUT;
        }

        const expiryTime = tokenData.exp * 1000;
        const currentTime = Date.now();

        if (expiryTime <= currentTime) {
            return DEFAULT_TIMEOUT;
        }

        return expiryTime - currentTime;
    };

    const getSessionTimeRemaining = (): { minutes: number; seconds: number } => {
        if (!expiresAt) {
            return { minutes: 0, seconds: 0 };
        }

        const remaining = Math.max(0, expiresAt - Date.now());
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        return { minutes, seconds };
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedAccessToken = localStorage.getItem('krw_accessToken') || '';
            const storedRefreshToken = localStorage.getItem('krw_refreshToken') || '';
            const storedDeviceKey = localStorage.getItem('krw_deviceKey') || '';
            const storedUser = localStorage.getItem('krw_userData');
            const storedCompany = localStorage.getItem('krw_company') || '';
            const storedBranch = localStorage.getItem('krw_branch') || '';
            const storedLastActivity = localStorage.getItem('krw_lastActivity');

            if (storedAccessToken) {
                const isExpired = isTokenExpired(storedAccessToken);

                if (!isExpired) {
                    setAccessToken(storedAccessToken);
                    setRefreshToken(storedRefreshToken);
                    setDeviceKey(storedDeviceKey);
                    setUser(storedUser ? JSON.parse(storedUser) : null);
                    setCompany(storedCompany);
                    setBranch(storedBranch);

                    const parsedToken = parseJwt(storedAccessToken);
                    setTokenData(parsedToken);
                    setIsSystemAdmin(isUserSystemAdmin(storedAccessToken));

                    if (parsedToken && parsedToken.exp) {
                        setExpiresAt(parsedToken.exp * 1000);
                    }

                    if (parsedToken && parsedToken.iat) {
                        setLoginTime(parsedToken.iat * 1000);
                    }

                    if (storedLastActivity) {
                        const lastActivityTime = parseInt(storedLastActivity, 10);
                        setLastActivity(lastActivityTime);

                        const sessionTimeout = getSessionTimeout(parsedToken);
                        const isExpired = Date.now() - lastActivityTime > sessionTimeout;

                        if (isExpired) {
                            setIsSessionExpired(true);
                        } else {
                            resetSessionTimeout();
                        }
                    }
                } else if (storedRefreshToken && storedCompany) {
                    refreshTokenService(storedAccessToken, storedRefreshToken, storedCompany)
                        .then((response) => {
                            setSession(response);
                        })
                        .catch((error) => {
                            console.error('Failed to refresh token:', error);
                            clearAuthState();

                            if (pathname && !pathname.startsWith('/auth/')) {
                                router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
                            }
                        });
                } else {
                    clearAuthState();
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (accessToken) {
            const trackActivity = () => {
                const now = Date.now();
                setLastActivity(now);
                localStorage.setItem('krw_lastActivity', now.toString());
                resetSessionTimeout();
            };

            window.addEventListener('mousemove', trackActivity);
            window.addEventListener('keydown', trackActivity);
            window.addEventListener('click', trackActivity);
            window.addEventListener('touchstart', trackActivity);

            return () => {
                window.removeEventListener('mousemove', trackActivity);
                window.removeEventListener('keydown', trackActivity);
                window.removeEventListener('click', trackActivity);
                window.removeEventListener('touchstart', trackActivity);
            };
        }
    }, [accessToken]);

    const resetSessionTimeout = () => {
        if (sessionTimeoutId.current) {
            clearTimeout(sessionTimeoutId.current);
            sessionTimeoutId.current = null;
        }

        const sessionTimeout = getSessionTimeout(tokenData);

        sessionTimeoutId.current = setTimeout(() => {
            setIsSessionExpired(true);
        }, sessionTimeout);
    };

    const setSession = (data: AuthTokensResponse) => {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);

        if (data.deviceKey) {
            setDeviceKey(data.deviceKey);
        }

        const parsedToken = parseJwt(data.accessToken);
        setTokenData(parsedToken);
        setIsSystemAdmin(isUserSystemAdmin(data.accessToken));

        if (parsedToken && parsedToken.exp) {
            setExpiresAt(parsedToken.exp * 1000);
        }

        if (parsedToken && parsedToken.iat) {
            setLoginTime(parsedToken.iat * 1000);
        }

        if (parsedToken.company) {
            setCompany(parsedToken.company);
        }

        if (parsedToken.branch) {
            setBranch(parsedToken.branch);
        }

        localStorage.setItem('krw_accessToken', data.accessToken);
        localStorage.setItem('krw_refreshToken', data.refreshToken);
        localStorage.setItem('krw_userData', JSON.stringify(data.user));

        if (data.deviceKey) {
            localStorage.setItem('krw_deviceKey', data.deviceKey);
        }

        if (parsedToken.company) {
            localStorage.setItem('krw_company', parsedToken.company);
        }

        if (parsedToken.branch) {
            localStorage.setItem('krw_branch', parsedToken.branch);
        }

        const now = Date.now();
        setLastActivity(now);
        localStorage.setItem('krw_lastActivity', now.toString());
        setIsSessionExpired(false);
        resetSessionTimeout();
    };

    const clearAuthState = () => {
        setAccessToken('');
        setRefreshToken('');
        setUser(null);
        setCompany('');
        setBranch('');
        setTokenData(null);
        setIsSystemAdmin(false);
        setIsSessionExpired(false);
        setExpiresAt(null);
        setLoginTime(null);

        if (sessionTimeoutId.current) {
            clearTimeout(sessionTimeoutId.current);
            sessionTimeoutId.current = null;
        }

        localStorage.removeItem('krw_accessToken');
        localStorage.removeItem('krw_refreshToken');
        localStorage.removeItem('krw_userData');
        localStorage.removeItem('krw_company');
        localStorage.removeItem('krw_branch');
        localStorage.removeItem('krw_lastActivity');
    };

    const logout = () => {
        clearAuthState();
        router.push('/auth/login');
    };

    const contextValue: AuthContextType = {
        isAuthenticated: !!accessToken && !isSessionExpired,
        user,
        company,
        branch,
        accessToken,
        refreshToken: refreshTokenValue,
        deviceKey,
        isSystemAdmin,
        tokenData,
        lastActivity,
        loginTime,
        expiresAt,
        setSession,
        logout,
        isSessionExpired,
        resetSessionTimeout,
        getSessionTimeRemaining
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}