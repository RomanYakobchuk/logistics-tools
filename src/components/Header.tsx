'use client';

import { MapPin, FileSpreadsheet } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import TooltipLink from './TooltipLink';

export default function Header() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white shadow-md sticky top-0 z-[909]">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link
                        href="/"
                        className="text-xl font-bold text-blue-800 hover:text-blue-600 transition-colors"
                    >
                        Logistics Tools
                    </Link>

                    <div className="flex gap-1">
                        <TooltipLink
                            href="/distance-calculation"
                            icon={MapPin}
                            text="Distance calculation"
                            isActive={isActive('/distance-calculation')}
                        />
                        <TooltipLink
                            href="/drive-distance"
                            icon={MapPin}
                            text="Drive Distance"
                            isActive={isActive('/drive-distance')}
                        />

                        <TooltipLink
                            href="/orders-data"
                            icon={FileSpreadsheet}
                            text="Test Orders Data"
                            isActive={isActive('/orders-data')}
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
}