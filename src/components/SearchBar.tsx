
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogPost } from "@/utils/db";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { blogs } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    const searchQuery = query.toLowerCase();
    const filteredResults = blogs.filter((blog) => 
      blog.title.toLowerCase().includes(searchQuery) || 
      blog.content.toLowerCase().includes(searchQuery)
    );

    setResults(filteredResults);
    setShowResults(true);
    
    if (filteredResults.length === 0) {
      toast.info("No results found for your search");
    }
  };

  const handleResultClick = (id: string) => {
    setShowResults(false);
    navigate(`/blog/${id}`);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search blogs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <Button 
            type="submit"
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0 h-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {showResults && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <li 
                  key={item.id}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-0"
                  onClick={() => handleResultClick(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                      <img 
                        src={item.image_url || "/placeholder.svg"} 
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
