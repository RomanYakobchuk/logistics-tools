'use client';

import { NumberStats, ServiceInfo } from '@/interfaces/sms';

interface CampaignStatsProps {
    stats: NumberStats;
}

interface ServiceStatsProps {
    count: number;
    service: ServiceInfo;
}

type PhoneNumbersStatsProps =
    | { type: 'campaign'; stats: CampaignStatsProps }
    | { type: 'service'; stats: ServiceStatsProps };

export default function PhoneNumbersStats({ type, stats }: PhoneNumbersStatsProps) {
    if (type === 'campaign') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    icon={<PhoneIcon />}
                    title="Total Numbers"
                    value={stats.stats.totalNumbers}
                    color="blue"
                />
                <StatsCard
                    icon={<LinkIcon />}
                    title="Attached to Services"
                    value={stats.stats.attachedToServices}
                    color="green"
                />
                <StatsCard
                    icon={<DisconnectIcon />}
                    title="Unattached"
                    value={stats.stats.unattachedNumbers}
                    color="yellow"
                />
                <StatsCard
                    icon={<MessagesIcon />}
                    title="Active Services"
                    value={stats.stats.totalServices}
                    color="purple"
                />
            </div>
        );
    } else {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                        icon={<PhoneIcon />}
                        title="Total Numbers"
                        value={stats.count}
                        color="blue"
                    />
                    <StatsCard
                        icon={<MessagesIcon />}
                        title="Service Use Case"
                        value={stats.service.useCase || stats.service.friendlyName}
                        color="purple"
                        isText
                    />
                    <StatsCard
                        icon={<CheckIcon />}
                        title="Status"
                        value="All numbers active"
                        color="green"
                        isText
                    />
                </div>
            </div>
        );
    }
}

interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
    isText?: boolean;
}

function StatsCard({ icon, title, value, color, isText = false }: StatsCardProps) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
        red: 'bg-red-100 text-red-600'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
                <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    {isText ? (
                        <div className="text-lg font-medium text-gray-900 capitalize">{value}</div>
                    ) : (
                        <div className="text-2xl font-semibold text-gray-900">{value}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Іконки
function PhoneIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );
}

function LinkIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
    );
}

function DisconnectIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    );
}

function MessagesIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}