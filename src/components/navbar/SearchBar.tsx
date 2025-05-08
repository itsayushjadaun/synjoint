
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

  // Handle outside clicks for suggestions dropdown
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
    <form 
      onSubmit={handleSubmit} 
      className={`flex items-center relative ${className}`}
    >
      <div className={`relative ${isMobile ? "w-full" : "w-32"} flex-shrink-0`}>
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          className={`pl-8 pr-2 py-1 h-8 text-sm text-gray-900 bg-white dark:bg-gray-700 dark:text-white focus:outline-none border-gray-300 dark:border-gray-600 rounded-r-none`}
          onFocus={() => setShowSuggestions(true)}
        />
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className={`h-8 rounded-l-none text-white bg-synjoint-blue/80 hover:bg-synjoint-blue`}
      >
        Find
      </Button>
      
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
    </form>
  );
};

export default SearchBar;
