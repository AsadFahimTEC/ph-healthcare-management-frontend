"use client";

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface DataTableSearchProps {
  initialValue?: string;
  placeholder?: string;
  debounceMs?: number;
  onDebouncedChange: (value: string) => void;
  isLoading?: boolean;
}

const DataTableSearch = ({
  initialValue = "",
  placeholder = "Search...",
  debounceMs = 700,
  onDebouncedChange,
  isLoading = false,
}: DataTableSearchProps) => {
  const [searchValue, setSearchValue] = useState<string>(initialValue);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  // Update internal state when initialValue changes (e.g., from URL)
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  // Debounce effect for search
  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      console.log("Debounce fired for search:", searchValue);
      onDebouncedChange(searchValue);
      setIsDebouncing(false);
    }, searchValue === "" ? 0 : debounceMs); // Immediate for empty search

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs, onDebouncedChange]);

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <div className="relative flex-1 max-w-sm">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        disabled={isLoading}
        className={`pr-10 ${isDebouncing ? 'border-blue-500' : ''} ${searchValue && searchValue.length < 2 ? 'border-orange-400' : ''}`}
      />
      {searchValue && searchValue.length < 2 && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-orange-600">
          Min 2 chars
        </div>
      )}
      {searchValue && searchValue.length >= 2 && (
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isDebouncing && searchValue && searchValue.length >= 2 && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default DataTableSearch;
