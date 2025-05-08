
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Menu } from "lucide-react";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

interface NavItem {
  name: string;
  href: string;
  ref?: React.RefObject<HTMLAnchorElement>;
}

interface MobileMenuProps {
  menuItems: NavItem[];
  onSearch: (searchTerm: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  suggestions: string[];
  languages: string[];
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const MobileMenu = ({
  menuItems,
  onSearch,
  onSuggestionClick,
  suggestions,
  languages,
  selectedLanguage,
  setSelectedLanguage
}: MobileMenuProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="text-gray-800 dark:text-gray-200 hover:text-synjoint-blue dark:hover:text-synjoint-lightblue transition-colors duration-200 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div 
          ref={dropdownRef}
          className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 absolute w-full shadow-lg z-50"
        >
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-2 pt-2 pb-3 space-y-1 max-h-[80vh] overflow-y-auto"
          >
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-2 px-3 py-2 text-gray-800 dark:text-gray-200 hover:text-synjoint-blue hover:bg-gray-50 dark:hover:text-synjoint-lightblue dark:hover:bg-gray-700 rounded-md transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="p-3">
              <SearchBar 
                onSearch={onSearch}
                suggestions={suggestions}
                onSuggestionClick={(suggestion) => {
                  onSuggestionClick(suggestion);
                  setIsMobileMenuOpen(false);
                }}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                isMobile={true}
              />
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <UserMenu isMobile={true} onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
