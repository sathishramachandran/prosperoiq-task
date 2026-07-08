import { useCallback, useMemo, useState } from "react";
import Checkbox from "./Checkbox";
import FilterSection from "./FiltersSections";
import { Search } from "lucide-react";

type FilterPanelProps = {
  filterData: Record<string, string[]>;
  value: Record<string, string[]>;
  onChange: (filters: Record<string, string[]>) => void;
};

const normalize = (str: string) =>
  str.toLowerCase().replace(/[.,]/g, "").trim();

const cleanLabel = (str: string) => str.replace(/\.{2,}/g, "").trim();

const FilterPanel = ({ filterData, value, onChange }: FilterPanelProps) => {
  const [searchMap, setSearchMap] = useState<Record<string, string>>({});

  const handleSelect = useCallback(
    (key: string, val: string) => {
      const updated: Record<string, string[]> = Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, [...v]]),
      );

      if (!updated[key]) {
        updated[key] = [];
      }

      if (updated[key].includes(val)) {
        updated[key] = updated[key].filter((v) => v !== val);
      } else {
        updated[key].push(val);
      }

      if (updated[key].length === 0) {
        delete updated[key];
      }

      onChange(updated);
    },
    [value, onChange],
  );

  const handleSearch = (key: string, val: string) => {
    setSearchMap((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  return (
    <div className="space-y-5">
      {Object.entries(filterData).map(([key, values]) => {
        const search = searchMap[key] || "";

        // ✅ SAFE filtering (normalized)
        const filteredValues = useMemo(
          () =>
            values.filter((item) =>
              normalize(item).includes(normalize(search)),
            ),
          [values, search],
        );

        return (
          <FilterSection
            key={key}
            title={key.replaceAll("_", " ").toUpperCase()}
          >
            {/* Search Box */}
            <div className="relative mb-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder={`Search ${key
                  .replaceAll("_", " ")
                  .toLowerCase()}...`}
                value={search}
                onChange={(e) => handleSearch(key, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-sm outline-none transition-all focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {filteredValues.length > 0 ? (
                filteredValues.map((val) => (
                  <Checkbox
                    key={val}
                    label={cleanLabel(val)} // ✅ UI clean only
                    checked={value[key]?.includes(val) || false}
                    onChange={() => handleSelect(key, val)} // ✅ RAW VALUE
                  />
                ))
              ) : (
                <p className="text-sm text-slate-400">No results found</p>
              )}
            </div>

            {/* Count */}
            <div className="mt-2 text-xs text-slate-500">
              Showing {filteredValues.length} of {values.length}
            </div>
          </FilterSection>
        );
      })}
    </div>
  );
};

export default FilterPanel;
