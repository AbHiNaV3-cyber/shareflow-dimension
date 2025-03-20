import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from "./ThemeToggle";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
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

export default function Header() {
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
    if (!user?.email) return "U";
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
          {/* Desktop Navigation */}
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
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 relative">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={user.email || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitial()}
                    </AvatarFallback>
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
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu - Fixed positioning instead of absolute */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] bottom-0 bg-background/95 backdrop-blur-md z-40 animate-fade-in overflow-y-auto">
          <div className="container p-4 flex flex-col h-full">
            <nav className="flex flex-col space-y-4 mb-8">
              <Link
                to="/"
                className="p-3 hover:bg-accent rounded-md font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/category/technology"
                className="p-3 hover:bg-accent rounded-md font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Technology
              </Link>
              <Link
                to="/category/lifestyle"
                className="p-3 hover:bg-accent rounded-md font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Lifestyle
              </Link>
              <Link
                to="/category/health"
                className="p-3 hover:bg-accent rounded-md font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Health
              </Link>
              <Link
                to="/about"
                className="p-3 hover:bg-accent rounded-md font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="p-3 hover:bg-accent rounded-md font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            <div className="mt-auto pb-8">
              <div className="flex items-center justify-between mb-4">
                <button className="flex items-center space-x-2 p-3 hover:bg-accent rounded-md font-medium transition-colors w-full">
                  <Search size={18} />
                  <span>Search</span>
                </button>
              </div>

              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center p-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="" alt={user.email || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">Logged in</p>
                    </div>
                  </div>

                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <User size={16} className="mr-2" />
                      Profile
                    </Button>
                  </Link>

                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <FileText size={16} className="mr-2" />
                      Dashboard
                    </Button>
                  </Link>

                  <Link to="/editor" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Settings size={16} className="mr-2" />
                      New Post
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    className="w-full justify-start mt-2"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline">Log in</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}