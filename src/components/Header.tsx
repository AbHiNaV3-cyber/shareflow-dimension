import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Menu, X, Search, User, LogOut, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useSupabaseAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user initial for avatar fallback
  const getUserInitial = () => {
    if (!user?.email) return '';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${
      isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : 'bg-background'
    }`}>
      <nav className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight mr-4">
            Mindful<span className="text-primary">Blog</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary">Home</Link>
            <Link to="/category/technology" className="font-medium hover:text-primary">Technology</Link>
            <Link to="/category/lifestyle" className="font-medium hover:text-primary">Lifestyle</Link>
            <Link to="/category/health" className="font-medium hover:text-primary">Health</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                    <AvatarFallback>{getUserInitial()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/editor" className="cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>New Post</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;