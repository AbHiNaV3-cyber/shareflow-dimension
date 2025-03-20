
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 dark:bg-secondary/20 border-t">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="text-xl font-bold tracking-tight flex items-center">
              Mindful<span className="text-primary">Blog</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              A modern platform for creating, sharing, and discovering high-quality blog content.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="md:col-span-1">
            <h4 className="font-medium text-base mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="md:col-span-1">
            <h4 className="font-medium text-base mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/category/technology" className="text-muted-foreground hover:text-foreground transition-colors">Technology</Link></li>
              <li><Link to="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health & Wellness</Link></li>
              <li><Link to="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity</Link></li>
              <li><Link to="/category/design" className="text-muted-foreground hover:text-foreground transition-colors">Design</Link></li>
              <li><Link to="/category/business" className="text-muted-foreground hover:text-foreground transition-colors">Business</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="font-medium text-base mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                <a href="mailto:contact@mindfullblog.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  contact@mindfullblog.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium text-base mb-2">Subscribe to Newsletter</h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} MindfulBlog. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
