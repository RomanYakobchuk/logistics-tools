export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    logo: string;
}

export interface CompanyBaseInfo {
    id: string;
    name: string;
    logo: string;
    lastLoginDate: string;
}

export interface AuthTokensResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    idToken: string;
    deviceKey?: string;
}

export interface EmailOtpResponse {
    challengeName: "EMAIL_OTP";
    email: string;
    session: string;
}

export interface SelectCompanyResponse {
    challengeName: "SELECT_COMPANY";
    session: string;
    companies: CompanyBaseInfo[];
}

export type SignInResponse = AuthTokensResponse | EmailOtpResponse | SelectCompanyResponse;
export type MfaResponse = AuthTokensResponse | SelectCompanyResponse;

export interface TokenData {
    sub: string;
    "device_key": string;
    "cognito:groups"?: string[];
    iss: string;
    branch: string;
    client_id: string;
    origin_jti: string;
    event_id: string;
    token_use: string;
    scope: string;
    auth_time: number;
    company: string;
    exp: number;
    iat: number;
    email: string;
    jti: string;
    username: string;
}

export interface ApiError extends Error {
    status?: number;
    /*eslint-disable*/
    data?: any;
    /*eslint-enable*/
}

export interface CompanyListResponse {
    items: CompanyBaseInfo[];
    count: number;
    timestamp: string;
}

export interface BranchInfo {
    id: string;
    name: string;
    logo: string | null;
    orderprefix: string;
}

export interface BranchListResponse {
    items: BranchInfo[];
    count: number;
    timestamp: string;
}