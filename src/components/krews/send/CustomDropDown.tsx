'use client';

import { useState, useEffect, useRef } from 'react';

interface SelectableItem {
    id: string;
    name: string;
    description?: string;
}

interface CustomDropdownProps<T extends SelectableItem> {
    label: string;
    items: T[];
    selectedItem: T | null;
    onSelect: (item: T) => void;
    isLoading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    emptyMessage?: string;
    icon: React.ReactNode;
}

export default function CustomDropdown<T extends SelectableItem>({
                                                                     label,
                                                                     items,
                                                                     selectedItem,
                                                                     onSelect,
                                                                     isLoading = false,
                                                                     disabled = false,
                                                                     placeholder = 'Select an option',
                                                                     emptyMessage = 'No items available',
                                                                     icon
                                                                 }: CustomDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (item: T) => {
        onSelect(item);
        setIsOpen(false);
    };

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div ref={dropdownRef} className="relative">
                <button
                    type="button"
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2.5 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    onClick={toggleDropdown}
                    disabled={disabled || isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                            <span className="text-gray-500">Loading...</span>
                        </div>
                    ) : selectedItem ? (
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                {icon}
                            </div>
                            <div className="ml-3 truncate">
                                <p className="text-sm font-medium text-gray-900">{selectedItem.name}</p>
                                {selectedItem.description && (
                                    <p className="text-xs text-gray-500">{selectedItem.description}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                            {disabled ? 'Please make a selection first' : placeholder}
                        </span>
                    )}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        <div className="p-2 sticky top-0 bg-white border-b">
                            <div className="text-xs font-medium text-gray-500">Select {label}</div>
                        </div>

                        {items.length === 0 ? (
                            <div className="py-2 px-3 text-gray-500 text-sm">
                                {emptyMessage}
                            </div>
                        ) : (
                            <ul tabIndex={-1} role="listbox" className="py-1">
                                {items.map((item) => (
                                    <li
                                        key={item.id}
                                        role="option"
                                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${selectedItem?.id === item.id ? 'bg-blue-100' : ''}`}
                                        onClick={() => handleSelect(item)}
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                {icon}
                                            </div>
                                            <div className="ml-3 truncate">
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        {selectedItem?.id === item.id && (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}