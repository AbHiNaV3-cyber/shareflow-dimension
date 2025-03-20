import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, MessageSquare, Share2, Bookmark, Calendar, Clock, User, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Comment from "@/components/Comment";
import CommentForm from "@/components/CommentForm";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Mock post data (in a real app, you'd fetch this)
const post = {
  id: "1",
  title: "The Future of Web Development: AI-Assisted Coding and Beyond",
  content: `
    <p>The field of web development is constantly evolving, with new technologies and methodologies emerging at a rapid pace. Among the most significant recent advancements is the integration of artificial intelligence into the development workflow.</p>
    
    <h2>How AI is Changing Development</h2>
    
    <p>AI-assisted coding tools are revolutionizing how developers work. These tools can suggest code completions, generate entire functions based on comments, and even help debug existing code. This not only speeds up the development process but also helps reduce errors and improve code quality.</p>
    
    <p>Some key benefits include:</p>
    
    <ul>
      <li>Increased productivity through intelligent code suggestions</li>
      <li>Reduced debugging time with AI-powered error detection</li>
      <li>More accessible coding for beginners with natural language interfaces</li>
      <li>Automated testing and quality assurance</li>
    </ul>
    
    <h2>The Impact on Developer Skills</h2>
    
    <p>As AI takes over more routine coding tasks, the role of developers is shifting. Rather than focusing on syntax and implementation details, developers can now dedicate more attention to architecture, user experience, and business logic.</p>
    
    <blockquote>
      "AI won't replace developers, but developers who use AI will replace those who don't."
    </blockquote>
    
    <p>This shift is leading to a new paradigm where technical skills remain important, but creativity, problem-solving, and system design become even more valuable.</p>
    
    <h2>Looking to the Future</h2>
    
    <p>As these AI tools continue to evolve, we can expect even more profound changes in web development. Low-code and no-code platforms enhanced by AI could make software development accessible to a much wider audience, while professional developers might find themselves working at increasingly higher levels of abstraction.</p>
    
    <p>The future of web development is likely to be a collaborative process between human creativity and machine intelligence, resulting in faster development cycles and more innovative solutions.</p>
  `,
  slug: "future-web-development-ai",
  coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  author: {
    name: "Alex Thompson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Senior Developer and AI enthusiast. Writing about the intersection of technology and human creativity."
  },
  publishedAt: "2023-08-15T10:30:00Z",
  readTime: "6 min read",
  category: "Technology",
  tags: ["AI", "Web Development", "Programming", "Future Tech"],
  likes: 128,
  comments: 24
};

// Mock comments
const comments = [
  {
    id: "c1",
    content: "This is a really insightful article. I've been using AI coding assistants for a few months now and they've definitely improved my workflow.",
    author: {
      name: "Jamie Wilson",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    },
    publishedAt: "2023-08-15T14:25:00Z",
    likes: 12,
    replies: [
      {
        id: "c1r1",
        content: "Which AI assistant do you use? I've been thinking about trying one but there are so many options now.",
        author: {
          name: "Chris Lee",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        publishedAt: "2023-08-15T15:10:00Z",
        likes: 3
      },
      {
        id: "c1r2",
        content: "I use GitHub Copilot and it's been a game changer for me. Definitely worth checking out!",
        author: {
          name: "Jamie Wilson",
          avatar: "https://randomuser.me/api/portraits/women/63.jpg"
        },
        publishedAt: "2023-08-15T15:45:00Z",
        likes: 5
      }
    ]
  },
  {
    id: "c2",
    content: "While I appreciate the benefits of AI in coding, I worry about developers becoming too dependent on these tools. Do you think this could lead to a decline in fundamental programming skills?",
    author: {
      name: "Morgan Taylor",
      avatar: "https://randomuser.me/api/portraits/women/36.jpg"
    },
    publishedAt: "2023-08-16T09:15:00Z",
    likes: 8,
    replies: []
  },
  {
    id: "c3",
    content: "Great article! I think the future will be about collaboration between humans and AI, not replacement. Developers who learn to leverage these tools effectively will have a significant advantage.",
    author: {
      name: "Raj Patel",
      avatar: "https://randomuser.me/api/portraits/men/73.jpg"
    },
    publishedAt: "2023-08-16T11:30:00Z",
    likes: 15,
    replies: []
  }
];

// Mock related posts
const relatedPosts = [
  {
    id: "2",
    title: "Getting Started with AI-Powered Development Tools",
    excerpt: "A beginner's guide to incorporating artificial intelligence into your development workflow.",
    slug: "getting-started-ai-development-tools",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Emily Chen",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg"
    },
    publishedAt: "2023-08-01T09:45:00Z",
    readTime: "5 min read",
    category: "Technology",
    likes: 76,
    comments: 8
  },
  {
    id: "3",
    title: "The Ethics of AI in Software Development",
    excerpt: "Exploring the ethical considerations of using AI-generated code in production environments.",
    slug: "ethics-ai-software-development",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Marcus Johnson",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    publishedAt: "2023-07-25T14:20:00Z",
    readTime: "7 min read",
    category: "Technology",
    likes: 92,
    comments: 16
  }
];

const Post = () => {
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading the specific post by slug
    console.log(`Loading post with slug: ${slug}`);
    
    // Set up scroll event for reading progress
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      setReadingProgress(scrollPercent * 100);
    };
    
    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, [slug]);
  
  const toggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
      toast({
        title: "Post liked!",
        description: "Your appreciation has been noted.",
        duration: 2000,
      });
    }
    setLiked(prev => !prev);
  };
  
  const toggleBookmark = () => {
    setBookmarked(prev => !prev);
    toast({
      title: bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarked 
        ? "The post has been removed from your saved items."
        : "The post has been saved to your profile.",
      duration: 2000,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: "Check out this interesting article!",
        url: window.location.href
      })
      .catch(err => console.error("Sharing failed:", err));
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to clipboard.",
        duration: 2000,
      });
    }
  };
  
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-24">
        <Header />
      </header>
      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300" 
        style={{ width: `${readingProgress}%` }}
      />
      
      <main className="flex-grow pt-24">
        {/* Post Header */}
        <div className="container-narrow mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link 
              to={`/category/${post.category.toLowerCase()}`}
              className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium transition-colors hover:bg-primary/20"
            >
              {post.category}
            </Link>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={16} />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
        
        {/* Cover Image */}
        <div className="container-wide mb-10">
          <div className="aspect-[21/9] rounded-xl overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8">
            {/* Social Sharing Sidebar (desktop) */}
            <div className="hidden md:block">
              <div className="sticky top-32 space-y-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={`rounded-full ${liked ? "text-red-500 border-red-100 bg-red-50 hover:bg-red-100 hover:text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30" : ""}`}
                        onClick={toggleLike}
                      >
                        <Heart className={liked ? "fill-red-500" : ""} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{liked ? "Unlike" : "Like"} this article</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full"
                        onClick={handleShare}
                      >
                        <Share2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Share this article</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={`rounded-full ${bookmarked ? "text-primary border-primary/20 bg-primary/10 hover:bg-primary/20 hover:text-primary dark:bg-primary/20 dark:border-primary/30 dark:hover:bg-primary/30" : ""}`}
                        onClick={toggleBookmark}
                      >
                        <Bookmark className={bookmarked ? "fill-primary" : ""} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{bookmarked ? "Remove from" : "Save to"} bookmarks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="text-center text-sm font-medium">
                  {likesCount}
                </div>
              </div>
            </div>
            
            {/* Article Content */}
            <article>
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8 p-4 border rounded-lg bg-card/50">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{post.author.name}</h4>
                    <Link to={`/author/${post.author.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-primary">
                      Follow
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.author.bio}
                  </p>
                </div>
              </div>
              
              {/* Post Content */}
              <div 
                className="prose dark:prose-invert prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Tags */}
              <div className="mb-8">
                <h4 className="text-sm font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link key={tag} to={`/tag/${tag.toLowerCase()}`} className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Social Sharing (mobile) */}
              <div className="flex md:hidden justify-between items-center mb-8 p-4 rounded-lg bg-card border">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`h-9 w-9 rounded-full ${liked ? "text-red-500" : ""}`}
                    onClick={toggleLike}
                  >
                    <Heart size={18} className={liked ? "fill-red-500" : ""} />
                  </Button>
                  <span className="text-sm font-medium">{likesCount}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-full"
                    onClick={handleShare}
                  >
                    <Share2 size={18} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`h-9 w-9 rounded-full ${bookmarked ? "text-primary" : ""}`}
                    onClick={toggleBookmark}
                  >
                    <Bookmark size={18} className={bookmarked ? "fill-primary" : ""} />
                  </Button>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="mt-12">
                <Separator className="my-8" />
                
                <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>
                
                {/* New Comment Form */}
                <div className="mb-8">
                  <CommentForm />
                </div>
                
                {/* Existing Comments */}
                <div className="space-y-6">
                  {comments.map(comment => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
        
        {/* Related Posts */}
        <section className="container-wide mt-16 mb-12">
          <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Post;
