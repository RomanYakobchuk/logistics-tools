'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Search } from 'lucide-react';

import { LocationDetails } from "@/components/drive-distance";
import { ILocation } from '@/types';

interface Props {
    label: string;
    value: ILocation | null;
    onChange: (location: ILocation | null) => void;
    onSelect?: (value: ILocation | null) => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}
// const api = 'http://localhost:3000/dev';
const api = 'https://0vwjhdiv2l.execute-api.us-west-2.amazonaws.com';

function LocationSelector({ label, value, onChange, onSelect, inputRef: externalInputRef }: Props) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<ILocation[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const internalInputRef = useRef<HTMLInputElement>(null);
    const inputRef = externalInputRef || internalInputRef;
    const suggestionsRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 3) {
                setSuggestions([]);
                setError(null);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            setError(null);

            try {
                const response = await fetch(`${api}/geocode?query=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data.items && data.items.length > 0) {
                    setSuggestions(data.items);
                    setError(null);
                } else {
                    setSuggestions([]);
                    setError('No results found');
                }
            } catch (err) {
                console.error(err);
                setSuggestions([]);
                setError('Error fetching suggestions');
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const scrollIntoView = (index: number) => {
        if (suggestionsRef.current) {
            const listItems = suggestionsRef.current.querySelectorAll('li');
            if (listItems[index]) {
                listItems[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    };

    const handleSelect = (location: ILocation) => {
        onChange(location);
        setQuery(location.address);
        setShowSuggestions(false);
        setFocusedIndex(-1);
        onSelect?.(location);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (showSuggestions && suggestions.length > 0) {
                const selectedLocation = focusedIndex >= 0 ? suggestions[focusedIndex] : suggestions[0];
                handleSelect(selectedLocation);
            } else if (value) {
                onSelect?.(value);
            }
            return;
        }

        if (!showSuggestions) return;

        let newIndex = focusedIndex;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                newIndex = focusedIndex < suggestions.length - 1 ? focusedIndex + 1 : focusedIndex;
                setFocusedIndex(newIndex);
                scrollIntoView(newIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                newIndex = focusedIndex > -1 ? focusedIndex - 1 : focusedIndex;
                setFocusedIndex(newIndex);
                scrollIntoView(newIndex);
                break;
            case 'Escape':
                setShowSuggestions(false);
                setFocusedIndex(-1);
                break;
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!value) {
                setError('Please select a value from the list');
            }
            setShowSuggestions(false);
        }, 200);
    };

    const renderSuggestionsList = () => {
        if (!showSuggestions) return null;

        if (isSearching) {
            return (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                    <li className="p-3 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                            Searching...
                        </div>
                    </li>
                </ul>
            );
        }

        if (error === 'No results found' && query.length >= 3) {
            return (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                    <li className="p-3 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-gray-400" />
                            No results found
                        </div>
                    </li>
                </ul>
            );
        }

        if (suggestions.length > 0) {
            return (
                <ul
                    ref={suggestionsRef}
                    className="suggestions-list absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto"
                >
                    {suggestions.map((suggestion, index) => {
                        const key = `${suggestion.latitude}-${suggestion.longitude}-${index}`;

                        return (
                            <li
                                key={key}
                                className={`p-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150 ${
                                    index === focusedIndex ? 'bg-blue-50 text-blue-700' : ''
                                }`}
                                onMouseDown={() => handleSelect(suggestion)}
                                onMouseEnter={() => setFocusedIndex(index)}
                            >
                                <div className="font-medium">{suggestion.title}</div>
                                <div className="text-sm text-gray-600">{suggestion.address}</div>
                            </li>
                        );
                    })}
                </ul>
            );
        }

        return null;
    };

    return (
        <div className="relative w-full">
            <label className="block mb-2 text-gray-700 font-semibold" htmlFor={`${label}Input`}>
                {label}:
            </label>
            <input
                ref={inputRef}
                type="text"
                id={`${label}Input`}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onChange(null);
                    setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={`Enter ${label.toLowerCase()} address`}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                autoComplete="off"
            />

            {error && !showSuggestions && !isSearching && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
            )}

            {renderSuggestionsList()}
            <LocationDetails details={value}/>
        </div>
    );
}

export default LocationSelector;