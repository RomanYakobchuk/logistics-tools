import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface Props {
    href: string;
    icon: LucideIcon;
    text: string;
    isActive?: boolean;
}

export default function TooltipLink({ href, icon: Icon, text, isActive }: Props) {
    return (
        <div className="group relative">
            <Link
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-blue-50 text-gray-700 hover:text-blue-800'
                }`}
            >
                <Icon className="h-5 w-5" />
                <span className="hidden md:flex">{text}</span>
            </Link>

            {/* Tooltip */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 md:hidden pointer-events-none">
                {text}
                {/* Triangle */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
            </div>
        </div>
    );
}