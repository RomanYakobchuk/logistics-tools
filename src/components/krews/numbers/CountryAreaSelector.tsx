'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usAreaCodes, canadianAreaCodes } from '@/utils/area-codes';

interface CustomSelectorProps {
    onSelectionChange: (countryCode: string, areaCode: string) => void;
    initialCountry?: string;
}

interface AreaCode {
    code: string;
    region: string;
}

interface Country {
    code: string;
    name: string;
}

export default function CountryAreaSelector({ onSelectionChange, initialCountry = 'US' }: CustomSelectorProps) {
    const getInitialAreaCode = (): [string, string] => {
        if (initialCountry === 'US') {
            const codes = usAreaCodes;
            return ['205', codes['205']];
        } else {
            const codes = canadianAreaCodes;
            return ['204', codes['204']];
        }
    };

    const [initialCode, initialRegion] = getInitialAreaCode();

    const [countryCode, setCountryCode] = useState<string>(initialCountry);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
    const countryDropdownRef = useRef<HTMLDivElement>(null);

    const [areaCode, setAreaCode] = useState<string>(initialCode);
    const [displayValue, setDisplayValue] = useState<string>(`${initialCode} - ${initialRegion}`);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState<boolean>(false);
    const [highlightedAreaIndex, setHighlightedAreaIndex] = useState<number>(0);
    const areaDropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const hasInitialized = useRef<boolean>(false);

    const countries: Country[] = [
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' }
    ];

    const areaCodes = useMemo(() => {
        const codes = countryCode === 'US' ? usAreaCodes : canadianAreaCodes;

        return Object.entries(codes)
            .map(([code, region]) => ({
                code,
                region: region as string
            }))
            .sort((a, b) => a.region.localeCompare(b.region));
    }, [countryCode]);

    useEffect(() => {
        if (!hasInitialized.current) {
            onSelectionChange(countryCode, areaCode);
            hasInitialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (hasInitialized.current && areaCodes.length > 0) {
            const defaultAreaCode = areaCodes[0].code;
            setAreaCode(defaultAreaCode);

            const displayText = `${defaultAreaCode} - ${areaCodes[0].region}`;
            setDisplayValue(displayText);

            onSelectionChange(countryCode, defaultAreaCode);
        }
    }, [countryCode, areaCodes]);

    const filteredAreaCodes = useMemo(() => {
        if (!searchTerm) return areaCodes;

        const term = searchTerm.toLowerCase();

        return areaCodes.filter(item => {
            if (item.code.includes(term)) return true;

            if (item.region.toLowerCase().includes(term)) return true;

            const formattedDisplay = `${item.code} - ${item.region}`.toLowerCase();
            if (formattedDisplay.includes(term)) return true;

            const withoutDash = `${item.code} ${item.region}`.toLowerCase();
            if (withoutDash.includes(term)) return true;

            const regionFirst = `${item.region} ${item.code}`.toLowerCase();
            return regionFirst.includes(term);
        });
    }, [areaCodes, searchTerm]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
                setIsCountryDropdownOpen(false);
            }

            if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target as Node)) {
                setIsAreaDropdownOpen(false);

                if (areaCode) {
                    const selectedArea = areaCodes.find(item => item.code === areaCode);
                    if (selectedArea) {
                        const formattedDisplay = `${selectedArea.code} - ${selectedArea.region}`;
                        setDisplayValue(formattedDisplay);
                        setSearchTerm('');
                    }
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [areaCode, areaCodes]);

    const handleCountrySelect = (country: Country) => {
        if (country.code !== countryCode) {
            setCountryCode(country.code);
            setIsCountryDropdownOpen(false);
            setSearchTerm('');
        }
    };

    const handleAreaSelect = (item: AreaCode) => {
        setAreaCode(item.code);

        const formattedDisplay = `${item.code} - ${item.region}`;
        setDisplayValue(formattedDisplay);

        setSearchTerm('');
        setIsAreaDropdownOpen(false);

        onSelectionChange(countryCode, item.code);
    };

    const findAreaCodeInInput = (text: string): AreaCode | null => {
        const exactCodeMatch = areaCodes.find(item => item.code === text);
        if (exactCodeMatch) return exactCodeMatch;

        const codeMatch = text.match(/\b(\d{3})\b/);
        if (codeMatch) {
            const potentialCode = codeMatch[1];
            const matchingArea = areaCodes.find(item => item.code === potentialCode);
            if (matchingArea) return matchingArea;
        }

        const lowerText = text.toLowerCase();
        for (const item of areaCodes) {
            if (item.region.toLowerCase() === lowerText) return item;

            if (item.region.toLowerCase().includes(lowerText) &&
                lowerText.length > 3) {
                return item;
            }
        }

        return null;
    };

    const handleAreaKeyDown = (e: React.KeyboardEvent) => {
        if (!isAreaDropdownOpen) {
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
                setIsAreaDropdownOpen(true);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                setHighlightedAreaIndex(prev =>
                    prev < filteredAreaCodes.length - 1 ? prev + 1 : prev
                );
                e.preventDefault();
                break;
            case 'ArrowUp':
                setHighlightedAreaIndex(prev => prev > 0 ? prev - 1 : 0);
                e.preventDefault();
                break;
            case 'Enter':
                if (filteredAreaCodes[highlightedAreaIndex]) {
                    handleAreaSelect(filteredAreaCodes[highlightedAreaIndex]);
                }
                e.preventDefault();
                break;
            case 'Escape':
                setIsAreaDropdownOpen(false);
                if (areaCode) {
                    const selectedArea = areaCodes.find(item => item.code === areaCode);
                    if (selectedArea) {
                        const formattedDisplay = `${selectedArea.code} - ${selectedArea.region}`;
                        setDisplayValue(formattedDisplay);
                        setSearchTerm('');
                    }
                }
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);
        setSearchTerm(inputValue);
        setHighlightedAreaIndex(0);

        if (!isAreaDropdownOpen) {
            setIsAreaDropdownOpen(true);
        }

        const matchingArea = findAreaCodeInInput(inputValue);
        if (matchingArea) {
            setAreaCode(matchingArea.code);
            onSelectionChange(countryCode, matchingArea.code);
        }
    };

    const handleInputFocus = () => {
        setIsAreaDropdownOpen(true);
    };

    const selectedCountryName = countries.find(c => c.code === countryCode)?.name || '';

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Custom Country Selector */}
                <div ref={countryDropdownRef} className="relative">
                    <label htmlFor="country-display" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                    </label>
                    <div className="relative">
                        <button
                            id="country-display"
                            type="button"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className="flex justify-between items-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            aria-haspopup="listbox"
                            aria-expanded={isCountryDropdownOpen}
                        >
                            <span className="block truncate">{selectedCountryName}</span>
                            <svg className={`h-5 w-5 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isCountryDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                                <ul role="listbox" className="py-1">
                                    {countries.map((country) => (
                                        <li
                                            key={country.code}
                                            role="option"
                                            onClick={() => handleCountrySelect(country)}
                                            className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center ${
                                                country.code === countryCode ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                            aria-selected={country.code === countryCode}
                                        >
                                            <span>{country.name}</span>
                                            {country.code === countryCode && (
                                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Area Code Selector */}
                <div ref={areaDropdownRef} className="relative">
                    <label htmlFor="area-code-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Area Code
                    </label>
                    <div className="relative">
                        <input
                            id="area-code-input"
                            ref={searchInputRef}
                            type="text"
                            value={displayValue}
                            onChange={handleSearchChange}
                            onKeyDown={handleAreaKeyDown}
                            onFocus={handleInputFocus}
                            placeholder="Search by code or region..."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setIsAreaDropdownOpen(!isAreaDropdownOpen);
                            }}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        >
                            <svg className={`h-5 w-5 transition-transform ${isAreaDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {isAreaDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <div className="py-1">
                                {filteredAreaCodes.length > 0 ? (
                                    filteredAreaCodes.map((item, index) => (
                                        <div
                                            key={item.code}
                                            onClick={() => handleAreaSelect(item)}
                                            onMouseEnter={() => setHighlightedAreaIndex(index)}
                                            className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center ${
                                                index === highlightedAreaIndex ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div>
                                                <span className="font-medium">{item.code}</span> - {item.region}
                                            </div>
                                            {item.code === areaCode && (
                                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">No area codes found</div>
                                )}
                            </div>
                            <div className="px-4 py-2 text-xs text-gray-500 border-t">
                                {filteredAreaCodes.length} area codes available
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}