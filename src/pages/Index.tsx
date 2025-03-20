
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedPost from "@/components/FeaturedPost";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";

// Mock data - In a real app, this would come from an API
const featuredPost = {
  id: "1",
  title: "The Future of Web Development: AI-Assisted Coding and Beyond",
  excerpt: "Explore how artificial intelligence is revolutionizing the way developers write code and build applications, making development faster and more accessible.",
  slug: "future-web-development-ai",
  coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  author: {
    name: "Alex Thompson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  publishedAt: "2023-08-15T10:30:00Z",
  readTime: "6 min read",
  category: "Technology",
  likes: 128,
  comments: 24
};

const recentPosts = [
  {
    id: "2",
    title: "10 Productivity Hacks That Actually Work",
    excerpt: "Tried and tested productivity techniques that can help you get more done in less time without burning out.",
    slug: "productivity-hacks-that-work",
    coverImage: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Sarah Miller",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    publishedAt: "2023-08-10T14:15:00Z",
    readTime: "4 min read",
    category: "Productivity",
    likes: 95,
    comments: 12
  },
  {
    id: "3",
    title: "The Psychology of Color in Web Design",
    excerpt: "Understanding how color choices affect user perception and behavior can dramatically improve your website's effectiveness.",
    slug: "psychology-color-web-design",
    coverImage: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Michael Wong",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg"
    },
    publishedAt: "2023-08-05T09:45:00Z",
    readTime: "5 min read",
    category: "Design",
    likes: 78,
    comments: 9
  },
  {
    id: "4",
    title: "5 Essential Financial Habits for Entrepreneurs",
    excerpt: "Building a business requires more than just a great idea. These financial practices help ensure your venture stays profitable.",
    slug: "financial-habits-entrepreneurs",
    coverImage: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Jessica Chen",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg"
    },
    publishedAt: "2023-07-28T11:20:00Z",
    readTime: "7 min read",
    category: "Business",
    likes: 112,
    comments: 18
  },
  {
    id: "5",
    title: "The Beginner's Guide to Mindful Meditation",
    excerpt: "Start your meditation journey with these simple techniques that can help reduce stress and improve mental clarity.",
    slug: "beginners-guide-meditation",
    coverImage: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "David Kim",
      avatar: "https://randomuser.me/api/portraits/men/47.jpg"
    },
    publishedAt: "2023-07-20T15:10:00Z",
    readTime: "3 min read",
    category: "Health",
    likes: 156,
    comments: 22
  },
  {
    id: "6",
    title: "Building an Effective Content Strategy for SEO",
    excerpt: "Learn how to create content that both engages your audience and helps your website rank higher in search results.",
    slug: "content-strategy-seo",
    coverImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Emily Taylor",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    publishedAt: "2023-07-15T13:30:00Z",
    readTime: "8 min read",
    category: "Technology",
    likes: 89,
    comments: 14
  }
];

// Popular categories
const popularCategories = [
  { name: "Technology", count: 124, slug: "technology" },
  { name: "Health", count: 98, slug: "health" },
  { name: "Productivity", count: 87, slug: "productivity" },
  { name: "Design", count: 76, slug: "design" },
  { name: "Business", count: 65, slug: "business" },
  { name: "Lifestyle", count: 54, slug: "lifestyle" }
];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulating content loading
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-24">
        <Header />
      </header>
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section with Featured Post */}
        <section className="container-wide mb-16">
          <FeaturedPost post={featuredPost} />
        </section>
        
        {/* Recent Posts */}
        <section className="container-wide section-padding">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Recent Articles</h2>
            <Link to="/archive">
              <Button variant="ghost" className="gap-1">
                View All <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map(post => (
              <div 
                key={post.id} 
                className={`transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${parseInt(post.id) * 100}ms` }}
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </section>
        
        {/* Categories + Newsletter */}
        <section className="bg-secondary/30 py-16 mt-16">
          <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Categories */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
              <div className="grid grid-cols-2 gap-4">
                {popularCategories.map(category => (
                  <Link 
                    key={category.name}
                    to={`/category/${category.slug}`}
                    className="flex justify-between items-center p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">{category.count}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="glassmorphism p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-6">
                Get the latest articles, resources, and insights delivered directly to your inbox.
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="bg-background border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="bg-background border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="bg-background border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" className="w-full">Subscribe Now</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
