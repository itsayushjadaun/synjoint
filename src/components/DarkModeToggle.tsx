
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Get from localStorage or default to false
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved === 'true' ? true : saved === 'false' ? false : prefersDark;
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set the dark mode class based on state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
    
    toast({
      title: darkMode ? "Light mode activated" : "Dark mode activated",
      description: `The application is now in ${darkMode ? "light" : "dark"} mode`,
      duration: 2000
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleDarkMode}
      className="w-9 px-0 hover:bg-transparent dark:hover:bg-transparent relative"
      style={{ zIndex: 10 }}
      aria-label="Toggle dark mode"
    >
      <div className="relative w-6 h-6">
        {darkMode ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="h-5 w-5 text-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
      </div>
    </Button>
  );
};

export default DarkModeToggle;
