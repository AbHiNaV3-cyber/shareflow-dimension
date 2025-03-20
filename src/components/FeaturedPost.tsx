
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedPostProps {
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
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
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
    <div 
      className={`relative overflow-hidden rounded-2xl h-[500px] transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        <div className="max-w-3xl animate-slide-up">
          {/* Category Badge */}
          <Link 
            to={`/category/${post.category.toLowerCase()}`}
            className="inline-block rounded-full bg-primary/80 backdrop-blur-sm px-4 py-1 text-sm font-medium text-primary-foreground mb-4 transition-transform hover:scale-105"
          >
            {post.category}
          </Link>
          
          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
            <Link to={`/post/${post.slug}`} className="hover:underline decoration-primary decoration-2 underline-offset-4">
              {post.title}
            </Link>
          </h2>
          
          {/* Excerpt */}
          <p className="text-white/90 mb-6 md:text-lg max-w-2xl line-clamp-2">
            {post.excerpt}
          </p>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-white/80">
            <div className="flex items-center gap-2">
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="h-10 w-10 rounded-full border-2 border-white/20"
              />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={16} />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>{post.comments}</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <Link to={`/post/${post.slug}`}>
            <Button size="lg" className="rounded-full font-medium transition-transform hover:scale-105">
              Read Article
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
