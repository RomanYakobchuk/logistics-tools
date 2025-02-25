'use client';

import React, { ChangeEvent, KeyboardEvent, useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const NumberInput = ({
                         value,
                         onChange,
                         onBlur,
                         placeholder,
                         decimals = 2,
                         step = 0.1
                     }: {
    value: number | undefined;
    onChange: (value: number) => void;
    onBlur?: () => void;
    placeholder?: string;
    decimals?: number;
    step?: number;
}) => {
    const [inputValue, setInputValue] = useState(() => {
        return value !== undefined ? value.toFixed(decimals) : '';
    });

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value.toFixed(decimals));
        } else {
            setInputValue('');
        }
    }, [value, decimals]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const cleanedValue = rawValue.replace(/[^\d.]/g, '');

        const parts = cleanedValue.split('.');
        let processedValue = parts[0];
        if (parts.length > 1) {
            processedValue += '.' + parts[1].slice(0, decimals);
        }

        setInputValue(processedValue);
    };

    const handleBlur = () => {
        const numValue = parseFloat(inputValue) || 0;
        onChange(Number(numValue.toFixed(decimals)));
        onBlur?.();
    };

    const changeValue = (increment: number) => {
        const currentValue = parseFloat(inputValue) || 0;
        const newValue = currentValue + increment;
        setInputValue(newValue.toFixed(decimals));
        onChange(Number(newValue.toFixed(decimals)));
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            changeValue(step);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            changeValue(-step);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
            />
            <div className="absolute inset-y-0 right-0 flex flex-col justify-center mr-2">
                <button
                    type="button"
                    onMouseDown={handleMouseDown}
                    onClick={() => changeValue(step)}
                    className="text-gray-500 hover:text-blue-500 focus:outline-none"
                >
                    <ChevronUp size={16}/>
                </button>
                <button
                    type="button"
                    onMouseDown={handleMouseDown}
                    onClick={() => changeValue(-step)}
                    className="text-gray-500 hover:text-blue-500 focus:outline-none"
                >
                    <ChevronDown size={16}/>
                </button>
            </div>
        </div>
    );
};

export default NumberInput;