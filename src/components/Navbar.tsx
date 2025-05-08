
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User, LogOut, FileText, Briefcase, ChevronDown, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    about: useRef<null | HTMLAnchorElement>(null),
    products: useRef<null | HTMLAnchorElement>(null),
    stakeholders: useRef<null | HTMLAnchorElement>(null),
    contact: useRef<null | HTMLAnchorElement>(null),
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      
      // Close search suggestions when clicking outside
      if (searchDropdownRef.current && 
          !searchDropdownRef.current.contains(event.target as Node) && 
          searchInputRef.current !== event.target) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const languages = ["English", "Hindi", "Spanish"];

  // Updated menuItems type to not include icon property, since it's not being used
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about", ref: sectionRefs.about },
    { name: "Our Stakeholders", href: "/stakeholders", ref: sectionRefs.stakeholders },
    { name: "Products", href: "/products", ref: sectionRefs.products },
    { name: "Blogs", href: "/blogs" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact", ref: sectionRefs.contact }
  ];

  const suggestionKeywords = [
    { label: "Home", keywords: ["home", "main", "landing"], target: "/" },
    { label: "Products", keywords: ["product", "products", "prod"], target: "/products" },
    { label: "About Us", keywords: ["about", "company", "who"], target: "/about" },
    { label: "Contact Us", keywords: ["contact", "get in touch"], target: "/contact" },
    { label: "Careers", keywords: ["career", "careers", "job", "jobs", "apply"], target: "/careers" },
    { label: "Blogs", keywords: ["blog", "blogs", "news"], target: "/blogs" },
    { label: "Susheel (Leadership)", keywords: ["susheel", "dr. susheel"], target: "/stakeholders#susheel" }
  ];

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const val = searchTerm.toLowerCase();
    const relevant = suggestionKeywords.filter(s =>
      s.keywords.some(kw => val.includes(kw))
    );
    setSuggestions(relevant.map(s => s.label));
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = searchTerm.trim().toLowerCase();
    if (!val) return;

    const first = suggestionKeywords.find(s =>
      s.keywords.some(kw => val.includes(kw))
    );
    if (first) {
      if (first.target.startsWith("/")) {
        window.location.href = first.target;
      } else if (first.target.startsWith("#") && sectionRefs[first.target.substring(1)]) {
        sectionRefs[first.target.substring(1)]?.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
      setShowSuggestions(false);
      setSearchTerm("");
      return;
    }
    setSuggestions([]);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (label: string) => {
    const found = suggestionKeywords.find(item => item.label === label);
    if (found) {
      if (found.target.startsWith("/")) {
        window.location.href = found.target;
      } else if (found.target.startsWith("#") && sectionRefs[found.target.substring(1)]) {
        sectionRefs[found.target.substring(1)]?.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
    }
    setShowSuggestions(false);
    setSearchTerm("");
  };

  return (
    <div className="sticky top-0 z-50 w-full shadow-sm">
      <div className="bg-synjoint-blue text-white py-2 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="hidden md:flex space-x-4 text-sm">
            <span className="flex items-center"><FileText size={14} className="mr-1" /> G-60 Ajmer Industrial Area, Ajmer</span>
            <span className="flex items-center"><User size={14} className="mr-1" /> synjoint.tech@gmail.com</span>
          </div>
          
          <div className="flex items-center space-x-4 ml-auto">
            <DarkModeToggle />
            <div className="relative hidden md:block">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent border-none text-white cursor-pointer focus:outline-none text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang} className="text-gray-900">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative hidden md:block">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Here"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  className="py-1 px-3 pr-10 rounded-md text-gray-900 text-sm w-48 transition-all focus:w-56 focus:ring-2 focus:ring-white/20 focus:outline-none"
                  onFocus={() => setShowSuggestions(true)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4 text-gray-500" />
                </button>
                {showSuggestions && searchTerm && (
                  <div 
                    ref={searchDropdownRef}
                    className="absolute left-0 z-50 mt-1 bg-white dark:bg-gray-800 rounded shadow-lg w-full border border-gray-200 dark:border-gray-700 max-h-48 overflow-auto text-sm"
                  >
                    {suggestions.length > 0 ? (
                      suggestions.map((sugg) => (
                        <div
                          key={sugg}
                          className="px-4 py-2 cursor-pointer hover:bg-synjoint-blue hover:text-white"
                          onClick={() => handleSuggestionClick(sugg)}
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
            </div>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 rounded-full">
                    <User className="h-4 w-4 mr-1" />
                    {user?.name?.split(' ')[0]}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200 rounded-md dark:bg-gray-800 dark:border-gray-700 mt-1">
                  <DropdownMenuLabel className="font-medium">{user?.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 -mt-3">{user?.email}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-semibold bg-gray-100 rounded px-2 py-1 dark:bg-gray-700 inline-block mt-1">
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Link to="/admin" className="flex items-center w-full">
                          <User className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Link to="/admin/create-blog" className="flex items-center w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Create Blog Post
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Link to="/admin/create-career" className="flex items-center w-full">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Create Career Post
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors text-red-600 dark:text-red-400" 
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-white hover:bg-white/20 rounded-full transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md dark:bg-gray-800 dark:shadow-gray-900/30" : "bg-white dark:bg-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="/lovable-uploads/fa6d2119-286c-498d-b934-ec9619932a0c.png"
                  alt="Synjoint Logo"
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-800 dark:text-gray-200 hover:text-synjoint-blue dark:hover:text-synjoint-lightblue transition-colors duration-200 font-medium text-sm animate-link flex items-center gap-1"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-800 dark:text-gray-200 hover:text-synjoint-blue dark:hover:text-synjoint-lightblue transition-colors duration-200 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

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
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search Here"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-2 px-3 pr-10 rounded-md text-gray-900 dark:text-gray-200 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm ml-2"
                  >
                    Find
                  </button>
                </form>
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
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="block w-full text-center px-3 py-2 bg-synjoint-blue text-white rounded-md hover:bg-synjoint-darkblue transition-colors duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-synjoint-blue/20 dark:bg-synjoint-blue/30 flex items-center justify-center">
                        <User className="h-4 w-4 text-synjoint-blue dark:text-synjoint-lightblue" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user?.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                      </div>
                    </div>
                    
                    {user?.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          className="block w-full text-left px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 font-medium text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/create-blog"
                          className="block w-full text-left px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 font-medium text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Create Blog Post
                        </Link>
                        <Link
                          to="/admin/create-career"
                          className="block w-full text-left px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 font-medium text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Create Career Post
                        </Link>
                      </>
                    )}
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors duration-200 font-medium text-sm"
                    >
                      <LogOut className="inline-block h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.nav>
    </div>
  );
};

export default Navbar;

