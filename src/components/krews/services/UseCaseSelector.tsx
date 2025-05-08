'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from "next/dynamic";

const UseCaseInfoModal = dynamic(() => import("@/components/krews/services/UseCaseInformationModal"), {ssr: false});

interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode | string;
}

interface CustomSelectorProps {
    id: string;
    name: string;
    value: string;
    options: Option[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    description?: string;
    required?: boolean;
    className?: string;
}

export default function UseCaseSelector({
                                           id,
                                           name,
                                           value,
                                           options,
                                           onChange,
                                           label,
                                           description,
                                           required = false,
                                           className = '',
                                       }: CustomSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(option => option.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const createSyntheticEvent = (value: string): React.ChangeEvent<HTMLSelectElement> => {
        const event = {
            target: {
                name,
                value
            }
        } as React.ChangeEvent<HTMLSelectElement>;
        return event;
    };

    const handleOptionSelect = (option: Option) => {
        onChange(createSyntheticEvent(option.value));
        setIsOpen(false);
    };

    const getIconForOption = (optionValue: string) => {
        switch (optionValue) {
            case 'marketing':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                );
            case 'notifications':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
            case 'verification':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'alerts':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'customer_service':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            case 'other':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const optionsWithIcons = options.map(option => ({
        ...option,
        icon: option.icon || getIconForOption(option.value)
    }));

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                setIsOpen(true);
                setHighlightedIndex(0);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                setHighlightedIndex(prev =>
                    prev < optionsWithIcons.length - 1 ? prev + 1 : 0
                );
                e.preventDefault();
                break;
            case 'ArrowUp':
                setHighlightedIndex(prev =>
                    prev > 0 ? prev - 1 : optionsWithIcons.length - 1
                );
                e.preventDefault();
                break;
            case 'Enter':
            case ' ':
                if (highlightedIndex >= 0) {
                    handleOptionSelect(optionsWithIcons[highlightedIndex]);
                }
                e.preventDefault();
                break;
            case 'Escape':
                setIsOpen(false);
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    {label} {required && <span className="text-red-500">*</span>}
                    <UseCaseInfoModal/>
                </label>
            )}

            {/* Hidden native select for form submission */}
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="sr-only"
                aria-hidden="true"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Custom styled select */}
            <div
                className="relative"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? id : undefined}
            >
                <button
                    type="button"
                    className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                            {getIconForOption(selectedOption.icon as string)}
                        </span>
                        <span className="block truncate">{selectedOption.label}</span>
                    </div>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        tabIndex={-1}
                        role="listbox"
                    >
                        {optionsWithIcons.map((option, index) => (
                            <div
                                key={option.value}
                                onClick={() => handleOptionSelect(option)}
                                className={`
                                    cursor-pointer select-none relative py-2 pl-3 pr-9
                                    ${index === highlightedIndex ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-50'}
                                    ${option.value === value ? 'bg-blue-50' : ''}
                                `}
                                role="option"
                                aria-selected={option.value === value}
                            >
                                <div className="flex items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                                        {option.icon}
                                    </span>
                                    <span className={`block truncate ${option.value === value ? 'font-medium' : 'font-normal'}`}>
                                        {option.label}
                                    </span>
                                </div>

                                {option.value === value && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
        </div>
    );
}