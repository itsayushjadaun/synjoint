
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, User } from "lucide-react";
import { motion } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";
import SearchBar from "./navbar/SearchBar";
import UserMenu from "./navbar/UserMenu";
import NavLinks from "./navbar/NavLinks";
import MobileMenu from "./navbar/MobileMenu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const sectionRefs = {
    about: useRef<null | HTMLAnchorElement>(null),
    products: useRef<null | HTMLAnchorElement>(null),
    stakeholders: useRef<null | HTMLAnchorElement>(null),
    contact: useRef<null | HTMLAnchorElement>(null),
  };
  
  const languages = ["English", "Hindi", "Spanish"];
  
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about", ref: sectionRefs.about },
    { name: "Our Stakeholders", href: "/stakeholders", ref: sectionRefs.stakeholders },
    { name: "Products", href: "/products", ref: sectionRefs.products },
    { name: "Blogs", href: "/blogs" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact", ref: sectionRefs.contact }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleSearch = (term: string) => {
    const val = term.trim().toLowerCase();
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
              <SearchBar 
                onSearch={handleSearch}
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
              />
            </div>
            
            <UserMenu />
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
            
            <NavLinks menuItems={menuItems} />
            
            <MobileMenu 
              menuItems={menuItems}
              onSearch={handleSearch}
              onSuggestionClick={handleSuggestionClick}
              suggestions={suggestions}
              languages={languages}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
