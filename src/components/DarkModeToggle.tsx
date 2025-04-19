
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Get from localStorage or default to false
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' ? true : false;
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
      className="w-9 px-0"
      style={{ position: 'relative', zIndex: 10 }}
      aria-label="Toggle dark mode"
    >
      {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default DarkModeToggle;
