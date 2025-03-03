
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <>
      {/* Top Bar */}
      <div className="bg-synjoint-blue text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex-1 hidden md:block"></div>
          
          <div className="flex items-center space-x-4 ml-auto">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent border-none text-white cursor-pointer focus:outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang} className="text-gray-900">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Here"
                className="py-1 px-3 pr-10 rounded-md text-gray-900 text-sm w-48"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-synjoint-blue/50">
                    <User className="h-4 w-4 mr-1" />
                    {user?.name.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-synjoint-blue/50">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-sm" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  src="/lovable-uploads/fa6d2119-286c-498d-b934-ec9619932a0c.png"
                  alt="Synjoint Logo"
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-800 hover:text-synjoint-orange transition-colors duration-200 font-medium text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-800 hover:text-synjoint-orange transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-gray-800 hover:text-synjoint-orange transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-800 hover:text-synjoint-orange transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-800 hover:text-synjoint-orange transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
