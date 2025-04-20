import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logOut } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Innovation", path: "/innovation" },
    { label: "About", path: "/about" },
    { label: "Academy", path: "/academy" },
    { label: "Careers", path: "/careers" },
    { label: "Contact", path: "/contact" },
    { label: "Blog", path: "/blogs" },
  ];
  
  const activeClass = "text-synjoint-orange";
  const defaultClass = "text-gray-800 dark:text-white hover:text-synjoint-orange dark:hover:text-synjoint-orange";
  
  return (
    <>
      <div className="h-20"></div>
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-sm" : "bg-white dark:bg-gray-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/fa6d2119-286c-498d-b934-ec9619932a0c.png" 
                  alt="SYNJOINT Tech" 
                  className="h-10 w-auto" 
                />
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">SYNJOINT Tech</span>
              </Link>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="w-64">
                <SearchBar />
              </div>
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path ? activeClass : defaultClass
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <div className="relative ml-3 flex items-center space-x-2">
                  <Link
                    to={user.role === 'admin' ? "/admin" : "/profile"}
                    className="text-sm font-medium text-gray-800 dark:text-white hover:text-synjoint-orange dark:hover:text-synjoint-orange"
                  >
                    {user.role === 'admin' ? 'Admin' : 'Profile'}
                  </Link>
                  <button
                    onClick={logOut}
                    className="text-sm font-medium text-gray-800 dark:text-white hover:text-synjoint-orange dark:hover:text-synjoint-orange"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-800 dark:text-white hover:text-synjoint-orange dark:hover:text-synjoint-orange"
                >
                  Sign In
                </Link>
              )}
              
              <DarkModeToggle />
            </div>
            
            <div className="flex md:hidden items-center">
              <div className="mr-2">
                <DarkModeToggle />
              </div>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg animate-in slide-in-from-top">
            <div className="px-4 py-3">
              <SearchBar />
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? activeClass : defaultClass}`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <div className="space-y-1">
                  <Link
                    to={user.role === 'admin' ? "/admin" : "/profile"}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-synjoint-orange dark:hover:text-synjoint-orange"
                  >
                    {user.role === 'admin' ? 'Admin' : 'Profile'}
                  </Link>
                  <button
                    onClick={logOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-synjoint-orange dark:hover:text-synjoint-orange"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-synjoint-orange dark:hover:text-synjoint-orange"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
