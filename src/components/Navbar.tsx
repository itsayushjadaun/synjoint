import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User, LogOut, FileText, Briefcase, ChevronDown } from "lucide-react";
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
    };

    document.addEventListener("mousedown", handleOutsideClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const languages = ["English", "Hindi", "Spanish"];

  const menuItems = [
    { name: "About Us", href: "/about" },
    { name: "Our Stakeholders", href: "/stakeholders" },
    { name: "Products", href: "/products" },
    { name: "Meril Academy", href: "/academy" },
    { name: "Blogs", href: "/blogs" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <div className="sticky top-0 z-50 w-full shadow-sm">
      {/* Top Bar */}
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
              <input
                type="text"
                placeholder="Search Here"
                className="py-1 px-3 pr-10 rounded-md text-gray-900 text-sm w-48 transition-all focus:w-56 focus:ring-2 focus:ring-white/20 focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
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

      {/* Main Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full transition-all duration-300 ${
          isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm dark:bg-gray-800/95" : "bg-white dark:bg-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="/lovable-uploads/42e5c406-c944-44ff-a66f-ac4c21c5a3e1.png"
                  alt="Synjoint Logo"
                  className="h-12 w-auto dark:brightness-125"
                />
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-800 dark:text-gray-200 hover:text-synjoint-blue dark:hover:text-synjoint-lightblue transition-colors duration-200 font-medium text-sm animate-link"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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
                  className="block px-3 py-2 text-gray-800 dark:text-gray-200 hover:text-synjoint-blue hover:bg-gray-50 dark:hover:text-synjoint-lightblue dark:hover:bg-gray-700 rounded-md transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile search */}
              <div className="p-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Here"
                    className="w-full py-2 px-3 pr-10 rounded-md text-gray-900 dark:text-gray-200 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              
              {/* Language selector for mobile */}
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
              
              {/* Auth options for mobile */}
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
