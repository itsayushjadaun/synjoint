import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  className?: string;
  isMobile?: boolean;
}

const SearchBar = ({
  onSearch,
  suggestions,
  onSuggestionClick,
  showSuggestions,
  setShowSuggestions,
  className = "",
  isMobile = false,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current !== event.target
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setShowSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className={`pl-8 pr-2 py-1 h-8 ${isMobile ? "w-full" : "w-48"} text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-synjoint-blue focus:border-synjoint-blue`}
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>

        <Button
          type="submit"
          size="icon"
          className="ml-1 h-8 w-8 bg-synjoint-blue hover:bg-synjoint-darkblue text-white p-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {showSuggestions && searchTerm && (
        <div
          ref={searchDropdownRef}
          className={`absolute ${isMobile ? "left-0 right-0" : "left-0"} top-full z-[60] mt-1 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-auto text-sm ${
            isMobile ? "w-full" : "min-w-[200px]"
          }`}
        >
          {suggestions.length > 0 ? (
            suggestions.map((sugg) => (
              <div
                key={sugg}
                className="px-4 py-2 cursor-pointer hover:bg-synjoint-blue hover:text-white"
                onClick={() => onSuggestionClick(sugg)}
              >
                {sugg}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400">No result found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
