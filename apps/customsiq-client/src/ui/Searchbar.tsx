"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type SearchBarProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (val: string) => {
    // Update local state
    onChange(val);

    // Clone existing params
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (val.trim()) {
      params.set("search", val);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative w-70">
      {/* Search Icon */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-10 pr-3
          h-8
          rounded-lg
          border border-gray-300
          text-sm
          outline-none
          focus:border-purple-500
          focus:ring-2 focus:ring-purple-200
          transition
        "
      />
    </div>
  );
};

export default SearchBar;