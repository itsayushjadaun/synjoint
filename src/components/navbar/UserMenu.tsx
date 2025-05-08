
import { Link } from "react-router-dom";
import { User, LogOut, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../context/AuthContext";

interface UserMenuProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const UserMenu = ({ isMobile = false, onItemClick }: UserMenuProps) => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    if (isMobile) {
      return (
        <Link
          to="/login"
          className="block w-full text-center px-3 py-2 bg-synjoint-blue text-white rounded-md hover:bg-synjoint-darkblue transition-colors duration-200 font-medium"
          onClick={onItemClick}
        >
          Login
        </Link>
      );
    }
    
    return (
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
    );
  }

  if (isMobile) {
    return (
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
              onClick={onItemClick}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/admin/create-blog"
              className="block w-full text-left px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 font-medium text-sm"
              onClick={onItemClick}
            >
              Create Blog Post
            </Link>
            <Link
              to="/admin/create-career"
              className="block w-full text-left px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 font-medium text-sm"
              onClick={onItemClick}
            >
              Create Career Post
            </Link>
          </>
        )}
        
        <button
          onClick={() => {
            logout();
            if (onItemClick) {
              onItemClick();
            }
          }}
          className="block w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors duration-200 font-medium text-sm"
        >
          <LogOut className="inline-block h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 rounded-full">
          <User className="h-4 w-4 mr-1" />
          {user?.name?.split(' ')[0]}
          <svg className="h-3 w-3 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200 rounded-md dark:bg-gray-800 dark:border-gray-700 mt-1 w-56">
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
  );
};

export default UserMenu;
