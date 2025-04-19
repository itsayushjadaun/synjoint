
import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../context/AuthContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Set the dark mode class based on the context
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    
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
