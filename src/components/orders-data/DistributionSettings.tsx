import React, { useState, useEffect } from 'react';
import { Settings2 } from 'lucide-react';
import { MoveType, Status } from '@/types';

export type MoveTypeDistribution = {
    [K in MoveType]: number;
};

export type StatusDistribution = {
    [K in Status]: number;
};

const DEFAULT_MOVE_TYPE_DISTRIBUTION: MoveTypeDistribution = {
    'Local Move': 40,
    'Long Distance Move': 40,
    'Intrastate Move': 5,
    'Commercial Move': 5,
    'Junk Removal': 5,
    'Labor Only': 5
};

const DEFAULT_STATUS_DISTRIBUTION: StatusDistribution = {
    'Booked': 40,
    'Dead': 20,
    'Follow Up': 30,
    'New': 10
};

interface DistributionSettingProps {
    title: string;
    distribution: MoveTypeDistribution | StatusDistribution;
    onChange: (newDistribution: MoveTypeDistribution | StatusDistribution) => void;
    error?: string;
    type: 'moveType' | 'status';
}

const DistributionSetting = ({
                                 title,
                                 distribution,
                                 onChange,
                                 error,
                                 type
                             }: DistributionSettingProps) => {
    const handleChange = (key: string, value: string) => {
        const numValue = value === '' ? 0 : Math.max(0, Math.min(100, parseInt(value)));
        const newDistribution = {
            ...distribution,
            [key]: numValue
        };
        onChange(newDistribution);
    };

    const handleReset = () => {
        onChange(type === 'moveType' ? DEFAULT_MOVE_TYPE_DISTRIBUTION : DEFAULT_STATUS_DISTRIBUTION);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                <button
                    type="button"
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    onClick={handleReset}
                >
                    Reset to Default
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(distribution).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                        <label className="block text-sm text-gray-600">{key}</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-500">%</span>
                        </div>
                    </div>
                ))}
            </div>
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
};

interface DistributionSettingsProps {
    onDistributionChange: (
        moveType: MoveTypeDistribution,
        status: StatusDistribution
    ) => void;
}

export const DistributionSettings = ({
                                         onDistributionChange
                                     }: DistributionSettingsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [moveTypeDistribution, setMoveTypeDistribution] =
        useState<MoveTypeDistribution>(DEFAULT_MOVE_TYPE_DISTRIBUTION);
    const [statusDistribution, setStatusDistribution] =
        useState<StatusDistribution>(DEFAULT_STATUS_DISTRIBUTION);
    const [moveTypeError, setMoveTypeError] = useState<string>();
    const [statusError, setStatusError] = useState<string>();

    const validateDistribution = (distribution: Record<string, number>): boolean => {
        const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);
        return Math.abs(total - 100) < 0.01;
    };

    useEffect(() => {
        const moveTypeValid = validateDistribution(moveTypeDistribution);
        setMoveTypeError(moveTypeValid ? undefined : 'Total percentage must equal 100%');

        const statusValid = validateDistribution(statusDistribution);
        setStatusError(statusValid ? undefined : 'Total percentage must equal 100%');

        if (moveTypeValid && statusValid) {
            onDistributionChange(moveTypeDistribution, statusDistribution);
        }
    }, [moveTypeDistribution, statusDistribution, onDistributionChange]);

    const handleMoveTypeChange = (newDistribution: MoveTypeDistribution | StatusDistribution) => {
        setMoveTypeDistribution(newDistribution as MoveTypeDistribution);
    };

    const handleStatusChange = (newDistribution: MoveTypeDistribution | StatusDistribution) => {
        setStatusDistribution(newDistribution as StatusDistribution);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full mb-4 flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <Settings2 className="mr-2 h-4 w-4" />
                Distribution Settings
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-6">
                    <DistributionSetting
                        title="Move Type Distribution"
                        distribution={moveTypeDistribution}
                        onChange={handleMoveTypeChange}
                        error={moveTypeError}
                        type="moveType"
                    />

                    <div className="border-t border-gray-200 my-4" />

                    <DistributionSetting
                        title="Status Distribution"
                        distribution={statusDistribution}
                        onChange={handleStatusChange}
                        error={statusError}
                        type="status"
                    />
                </div>
            )}
        </div>
    );
};

export default DistributionSettings;