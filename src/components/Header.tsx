
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // We'll replace this with auth logic later
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glassmorphism py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Mindful<span className="text-primary">Blog</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-primary">Home</Link>
          <Link to="/category/technology" className="font-medium hover:text-primary">Technology</Link>
          <Link to="/category/lifestyle" className="font-medium hover:text-primary">Lifestyle</Link>
          <Link to="/category/health" className="font-medium hover:text-primary">Health</Link>
        </nav>
        
        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
            <Search size={20} />
          </button>
          <ThemeToggle />
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </Link>
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
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
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
              
              {isLoggedIn ? (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full" variant="outline">My Dashboard</Button>
                </Link>
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
};

export default Header;
