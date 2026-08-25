import React, { useState, useEffect } from 'react';
import { COUNTRY_CODES } from '@/lib/country-codes';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export function PhoneInput({ 
  value, 
  onChange, 
  required = false, 
  className = "px-4.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus-within:border-indigo-500", 
  placeholder = "99999 88888" 
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (value && !phoneNumber && value !== countryCode + ' ') {
      // Basic split on first load if value already contains a country code
      const matchedCode = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (matchedCode) {
        setCountryCode(matchedCode.code);
        setPhoneNumber(value.slice(matchedCode.code.length).trim());
      } else {
        setPhoneNumber(value.trim());
      }
    }
  }, [value, phoneNumber, countryCode]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const truncated = val.slice(0, 10); // Limit to 10 digits
    setPhoneNumber(truncated);
    onChange(`${countryCode} ${truncated}`);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCountryCode(code);
    onChange(`${code} ${phoneNumber}`);
  };

  return (
    <div className={`flex flex-row items-center overflow-hidden ${className} p-0`}>
      <select
        value={countryCode}
        onChange={handleCodeChange}
        className="h-full bg-transparent border-r border-zinc-200 dark:border-zinc-800 py-3 pl-4 pr-8 text-zinc-600 dark:text-zinc-400 focus:outline-none focus:ring-0 appearance-none min-w-[80px]"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.2rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
        }}
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        required={required}
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none py-3 px-4 focus:outline-none focus:ring-0 w-full"
      />
    </div>
  );
}
