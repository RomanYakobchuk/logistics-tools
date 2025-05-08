'use client';

import {useState, ComponentType, useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {MapPin, FileSpreadsheet, LayoutDashboard} from 'lucide-react';
import {useAuth} from '@/lib/auth/auth-context';
import BranchSwitcher from "@/components/krews/BranchSwitcher";

interface TooltipLinkProps {
    href: string;
    /* eslint-disable */
    icon: ComponentType<any>;
    /* eslint-enable */
    text: string;
    isActive: boolean;
}

function TooltipLink({href, icon: Icon, text, isActive}: TooltipLinkProps) {
    return (
        <Link
            href={href}
            className={`group relative flex items-center justify-center p-2 rounded-md ${
                isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
        >
            <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-600'}`}/>
            <span
                className="absolute top-full mt-1 w-32 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity text-center">
                {text}
            </span>
        </Link>
    );
}

export default function AppHeader() {
    const {user, logout, isAuthenticated, isSystemAdmin} = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const pathname = usePathname();

    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-bold text-blue-800 hover:text-blue-600 transition-colors"
                    >
                        Krews tools
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                            <TooltipLink
                                href="/drive-distance"
                                icon={MapPin}
                                text="Distance Calculator"
                                isActive={isActive('/drive-distance')}
                            />

                            <TooltipLink
                                href="/orders-data"
                                icon={FileSpreadsheet}
                                text="Test Data"
                                isActive={isActive('/orders-data')}
                            />
                            {/* Navigation - Only show if authenticated */}
                            {isAuthenticated && (
                                <>
                                    <TooltipLink
                                        href="/krews/dashboard"
                                        icon={LayoutDashboard}
                                        text="SMS Dashboard"
                                        isActive={isActive('/krews/dashboard')}
                                    />
                                </>
                            )}
                        </div>

                        {/* Company Switcher - Only show if authenticated and user is system admin */}
                        {isAuthenticated && isSystemAdmin && (
                            <div className="ml-3">
                                {/*<CompanySwitcher/>*/}
                                <BranchSwitcher/>
                            </div>
                        )}

                        {/* User menu - Only show if authenticated */}
                        {isAuthenticated ? (
                            <div className="relative ml-3" ref={dropdownRef}>
                                <div>
                                    <button
                                        type="button"
                                        className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        id="user-menu-button"
                                        aria-expanded={isUserMenuOpen}
                                        aria-haspopup="true"
                                        onClick={toggleUserMenu}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className="flex items-center">
                                            <div
                                                className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full overflow-hidden">
                                                {user?.logo ? (
                                                    <Image
                                                        src={user.logo}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        width={32}
                                                        height={32}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div
                                                        className="flex items-center justify-center w-full h-full text-blue-600">
                                                        {user?.firstName?.charAt(0) || ''}
                                                        {user?.lastName?.charAt(0) || ''}
                                                    </div>
                                                )}
                                            </div>
                                            {/*<div className="hidden ml-3 md:block text-start">*/}
                                            {/*    <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>*/}
                                            {/*    <p className="text-xs text-gray-500 truncate">{company}</p>*/}
                                            {/*</div>*/}
                                        </div>
                                    </button>
                                </div>

                                {isUserMenuOpen && (
                                    <div
                                        className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button"
                                        tabIndex={-1}
                                    >
                                        <Link
                                            href="/krews/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex={-1}
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex={-1}
                                            onClick={() => {
                                                logout();
                                                setIsUserMenuOpen(false);
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}