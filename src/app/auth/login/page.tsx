'use client';

import {useState, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {signIn, selectCompany, verifyMfaCode} from '@/lib/api/auth-service';
import {useAuth} from '@/lib/auth/auth-context';
import {AuthTokensResponse, CompanyBaseInfo, EmailOtpResponse, SelectCompanyResponse} from '@/lib/api/types/auth-types';
import MfaCodeForm from '@/components/auth/mfa-code-form';
import LoginForm from '@/components/auth/login-form';
import CompanySelector from '@/components/auth/company-selector';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {isAuthenticated, setSession} = useAuth();
    const redirectPath = searchParams.get('redirect') || '/krews/dashboard';

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [authStep, setAuthStep] = useState<'credentials' | 'mfa' | 'selectCompany'>('credentials');
    const [session, setSessionString] = useState('');
    const [companies, setCompanies] = useState<CompanyBaseInfo[]>([]);
    const [maskedEmail, setMaskedEmail] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirectPath);
            return;
        }
    }, [isAuthenticated, router, redirectPath]);

    const handleCredentialsSubmit = async (email: string, password: string) => {
        setEmail(email);
        setError('');
        setIsLoading(true);

        try {
            const deviceKey = localStorage.getItem('krw_deviceKey') || 'us-east-1_6bda249c-d845-4b5f-b006-d86b383095ba';

            const response = await signIn(email, password, deviceKey);

            if ('challengeName' in response) {
                if (response.challengeName === 'SELECT_COMPANY') {
                    const selectCompanyResponse = response as SelectCompanyResponse;
                    setCompanies(selectCompanyResponse.companies?.sort((a, b) => a?.name?.localeCompare(b?.name)));
                    setSessionString(selectCompanyResponse.session);
                    setAuthStep('selectCompany');
                } else if (response.challengeName === 'EMAIL_OTP') {
                    const emailOtpResponse = response as EmailOtpResponse;
                    setMaskedEmail(emailOtpResponse.email);
                    setSessionString(emailOtpResponse.session);
                    setAuthStep('mfa');
                }
            } else {
                setSession(response);
                setTimeout(() => {
                    router.push(redirectPath);
                }, 100);
            }
            /* eslint-disable */
        } catch (err: any) {
            /* eslint-enable */
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login error. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMfaSubmit = async (code: string, rememberDevice: boolean) => {
        setError('');
        setIsLoading(true);

        try {
            const response = await verifyMfaCode(email, code, session, rememberDevice);

            if ('challengeName' in response && response.challengeName === 'SELECT_COMPANY') {
                const selectCompanyResponse = response as SelectCompanyResponse;
                setCompanies(selectCompanyResponse.companies?.sort((a, b) => a?.name?.localeCompare(b?.name)));
                setSessionString(selectCompanyResponse.session);
                setAuthStep('selectCompany');
            } else {
                setSession(response as AuthTokensResponse);
                setTimeout(() => {
                    router.push(redirectPath);
                }, 100);
            }
            /* eslint-disable */
        } catch (err: any) {
            /* eslint-enable */
            console.error('MFA verification error:', err);
            setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompanySelect = async (companyId: string) => {
        setError('');
        setIsLoading(true);

        try {
            const deviceKey = localStorage.getItem('krw_deviceKey') || undefined;

            const response = await selectCompany(
                email,
                companyId,
                session,
                true,
                deviceKey
            );

            setSession(response);
            setTimeout(() => {
                router.push(redirectPath);
            }, 100);
            /* eslint-disable */
        } catch (err: any) {
            /* eslint-enable */
            console.error('Company selection error:', err);
            setError(err.response?.data?.message || 'Error selecting company.');

            if (err.response?.status === 401) {
                setAuthStep('credentials');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            {authStep === 'credentials' && (
                <LoginForm
                    onSubmit={handleCredentialsSubmit}
                    isLoading={isLoading}
                    error={error}
                />
            )}

            {authStep === 'mfa' && (
                <MfaCodeForm
                    email={maskedEmail || email}
                    session={session}
                    isLoading={isLoading}
                    error={error}
                    onSubmit={handleMfaSubmit}
                    onBack={() => setAuthStep('credentials')}
                />
            )}

            {authStep === 'selectCompany' && (
                <CompanySelector
                    companies={companies}
                    onSelect={handleCompanySelect}
                    isLoading={isLoading}
                    error={error}
                />
            )}
        </div>
    );
}