'use client';

import React, { useState, useRef } from 'react';
import {ChevronsUpDown} from "lucide-react";

import { TransportMode, TransportOption } from '@/types';

const transportOptions: TransportOption[] = [
    { value: 'truck', label: 'Truck' },
    { value: 'small_truck', label: 'Small Truck' },
    { value: 'car', label: 'Car' }
];

interface Props {
    value: TransportMode;
    onChange: (mode: TransportMode) => void;
}

function TransportModeSelector({ value, onChange }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedOption = transportOptions.find(opt => opt.value === value);

    const handleSelect = (newMode: TransportMode) => {
        onChange(newMode);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setFocusedIndex(transportOptions.findIndex(opt => opt.value === value));
                } else {
                    setFocusedIndex(prev =>
                        prev < transportOptions.length - 1 ? prev + 1 : prev
                    );
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (isOpen) {
                    setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else if (focusedIndex >= 0) {
                    handleSelect(transportOptions[focusedIndex].value);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setFocusedIndex(-1);
                break;
        }
    };

    return (
        <div className="w-full relative lg:max-w-xs">
            <label className="block mb-2 text-gray-700 font-semibold" htmlFor="transportMode">
                Transport Mode:
            </label>
            <div className="relative">
                <input
                    type="text"
                    id="transportMode"
                    readOnly
                    value={selectedOption?.label || ''}
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white cursor-pointer hover:border-blue-400"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <ChevronsUpDown className={'h-5 w-5 text-gray-500'}/>
                </div>
                {isOpen && (
                    <ul
                        ref={listRef}
                        className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1"
                    >
                        {transportOptions.map((option, index) => (
                            <li
                                key={option.value}
                                className={`p-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150 ${
                                    index === focusedIndex ? 'bg-blue-50 text-blue-700' : ''
                                }`}
                                onClick={() => handleSelect(option.value)}
                                onMouseEnter={() => setFocusedIndex(index)}
                            >
                                <div className="font-medium">{option.label}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default TransportModeSelector;