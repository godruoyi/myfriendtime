import { useEffect, useMemo, useRef, useState } from 'react';

interface SearchableSelectProps {
    options: any[];
    value: any;
    onChange: (option: any) => void;
    placeholder?: string;
    getOptionLabel: (option: any) => string;
    getOptionValue: (option: any) => string;
    filterFn: (option: any, searchTerm: string) => boolean;
}

const SearchableSelect = ({ options, value, onChange, placeholder, getOptionLabel, getOptionValue, filterFn }: SearchableSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<any>(null);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) {
            return options;
        }
        return options.filter(option => filterFn(option, searchTerm));
    }, [searchTerm, options, filterFn]);

    const handleSelect = (option: any) => {
        onChange(option);
        setSearchTerm(getOptionLabel(option));
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen && value) {
            setSearchTerm(getOptionLabel(value));
        } else if (!value) {
            setSearchTerm('');
        }
    }, [value, isOpen, getOptionLabel]);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`w-full text-sm px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 appearance-none cursor-pointer
                        hover:border-gray-400 text-gray-500
                        ${searchTerm ? 'text-gray-600' : 'text-gray-500'}
                        `}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearchTerm('');
                    }}
                    onClick={() => setIsOpen(true)}
                    onChange={e => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
                <svg
                    className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <ul className="absolute z-10 w-full text-sm mt-1 bg-white border border-gray-300 rounded-md shadow-sm max-h-36 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={getOptionValue(option)}
                                className="px-2 py-1 hover:bg-gray-200 cursor-pointer transition"
                                onClick={() => handleSelect(option)}
                            >
                                {getOptionLabel(option)}
                            </li>
                        ))
                    ) : (
                        <li className="px-2 py-1 text-gray-400">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;
