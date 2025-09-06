import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchableListProps<T> {
  items: T[];
  searchFields: (keyof T)[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  placeholder?: string;
  className?: string;
}

function SearchableList<T>({
  items,
  searchFields,
  searchTerm,
  onSearchChange,
  renderItem,
  placeholder = "Search...",
  className = ""
}: SearchableListProps<T>) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return items;

    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return String(value).toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      })
    );
  }, [items, searchFields, debouncedSearchTerm]);

  return (
    <div className={className}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
      
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No items found matching "{debouncedSearchTerm}"
          </div>
        ) : (
          filteredItems.map((item, index) => renderItem(item, index))
        )}
      </div>
    </div>
  );
}

export default SearchableList;