
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user previously set a preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast({
        title: "Light mode activated",
        description: "The application is now in light mode",
        duration: 2000
      });
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast({
        title: "Dark mode activated",
        description: "The application is now in dark mode",
        duration: 2000
      });
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDarkMode}
      className="w-9 px-0"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default DarkModeToggle;
