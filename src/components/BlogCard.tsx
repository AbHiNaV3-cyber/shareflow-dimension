
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    coverImage: string;
    author: {
      name: string;
      avatar: string;
    };
    publishedAt: string;
    readTime: string;
    category: string;
    likes: number;
    comments: number;
  };
  featured?: boolean;
  variant?: "horizontal" | "vertical";
}

const BlogCard = ({ 
  post, 
  featured = false, 
  variant = "vertical" 
}: BlogCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <article 
      className={cn(
        "group overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-md",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        featured && "shadow-lg",
        variant === "horizontal" ? "grid grid-cols-1 md:grid-cols-5 gap-6" : "flex flex-col"
      )}
    >
      {/* Image Container */}
      <div 
        className={cn(
          "relative overflow-hidden",
          variant === "horizontal" ? "md:col-span-2" : "aspect-video w-full"
        )}
      >
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-4 left-4">
          <Link 
            to={`/category/${post.category.toLowerCase()}`}
            className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary"
          >
            {post.category}
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className={cn(
          "flex flex-col p-6",
          variant === "horizontal" ? "md:col-span-3" : ""
        )}
      >
        {/* Title */}
        <h3 className={cn(
          "mb-2 font-bold tracking-tight text-card-foreground/90 transition-colors group-hover:text-card-foreground",
          featured ? "text-2xl md:text-3xl" : "text-xl"
        )}>
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>
        
        {/* Excerpt */}
        <p className="mb-4 text-muted-foreground line-clamp-2">{post.excerpt}</p>
        
        {/* Meta Info */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium">{post.author.name}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <time dateTime={post.publishedAt}>{formattedDate}</time>
                <span className="mx-1">•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
          
          {/* Engagement Stats */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1 text-sm">
              <Heart size={14} />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MessageSquare size={14} />
              <span>{post.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
