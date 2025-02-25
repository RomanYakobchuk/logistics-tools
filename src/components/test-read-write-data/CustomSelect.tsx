'use client';

import React, {useEffect, useRef, useState} from "react";
import {ChevronDown} from "lucide-react";
import {ILeadSource} from "@/types";

const CustomSelect = ({
                          options,
                          value,
                          onChange
                      }: {
    options: ILeadSource[];
    value: string;
    onChange: (value: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const [selectedValue, setSelectedValue] = useState(value);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectRef]);

    const handleSelect = (newValue: string) => {
        setSelectedValue(newValue);
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={selectRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span>{selectedValue}</span>
                <ChevronDown size={16} className="text-gray-500"/>
            </button>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <li
                            key={option.name}
                            onClick={() => handleSelect(option.name)}
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${option.name === selectedValue && "!bg-gray-100"}`}
                        >
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;