
import { toast } from "@/components/ui/use-toast";

// Types for our blog posts
export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  author: Author;
  publishedAt: string;
  readTime: string;
  category: string;
  likes: number;
  comments: number;
  content?: string;
  tags?: string[];
}

// Mock data to simulate API responses
const mockPosts: BlogPost[] = [
  {
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
    comments: 24,
    tags: ["Web Development", "AI", "Coding", "Future Tech"]
  },
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
    comments: 12,
    tags: ["Productivity", "Work Life", "Time Management"]
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
    comments: 9,
    tags: ["Web Design", "Psychology", "User Experience", "Color Theory"]
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
    comments: 18,
    tags: ["Entrepreneurship", "Finance", "Business Tips"]
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
    comments: 22,
    tags: ["Meditation", "Mindfulness", "Mental Health", "Wellness"]
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
    category: "Marketing",
    likes: 89,
    comments: 14,
    tags: ["SEO", "Content Marketing", "Digital Marketing"]
  },
  {
    id: "7",
    title: "How Machine Learning is Transforming Healthcare",
    excerpt: "From diagnosis to treatment planning, artificial intelligence is making healthcare more efficient, accurate, and accessible.",
    slug: "machine-learning-healthcare",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Dr. Robert Chen",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    },
    publishedAt: "2023-07-08T09:15:00Z",
    readTime: "9 min read",
    category: "Technology",
    likes: 145,
    comments: 31,
    tags: ["Healthcare", "Machine Learning", "AI", "Medical Technology"]
  },
  {
    id: "8",
    title: "Sustainable Fashion: The Future of Style",
    excerpt: "How the fashion industry is evolving to address environmental concerns without compromising on design and quality.",
    slug: "sustainable-fashion-future",
    coverImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Olivia Martinez",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg"
    },
    publishedAt: "2023-07-01T16:45:00Z",
    readTime: "5 min read",
    category: "Lifestyle",
    likes: 118,
    comments: 27,
    tags: ["Fashion", "Sustainability", "Ethical Consumption", "Style"]
  },
  {
    id: "9",
    title: "The Science Behind Effective Learning Techniques",
    excerpt: "Research-backed methods to help you learn new skills and retain information more efficiently.",
    slug: "science-effective-learning",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Prof. James Wilson",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg"
    },
    publishedAt: "2023-06-25T11:30:00Z",
    readTime: "6 min read",
    category: "Education",
    likes: 97,
    comments: 15,
    tags: ["Learning", "Education", "Cognitive Science", "Memory"]
  },
  {
    id: "10",
    title: "Virtual Reality: Beyond Gaming and Entertainment",
    excerpt: "Exploring the practical applications of VR technology in fields like education, healthcare, and professional training.",
    slug: "virtual-reality-beyond-gaming",
    coverImage: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Tyler Jackson",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg"
    },
    publishedAt: "2023-06-18T13:20:00Z",
    readTime: "7 min read",
    category: "Technology",
    likes: 134,
    comments: 29,
    tags: ["Virtual Reality", "Technology", "Innovation", "Future Tech"]
  },
  {
    id: "11",
    title: "Plant-Based Diets: Benefits and Getting Started",
    excerpt: "How switching to a plant-based diet can improve your health and contribute to environmental sustainability.",
    slug: "plant-based-diet-benefits",
    coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Sophia Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    publishedAt: "2023-06-12T10:15:00Z",
    readTime: "4 min read",
    category: "Health",
    likes: 176,
    comments: 42,
    tags: ["Nutrition", "Plant-Based", "Health", "Diet"]
  },
  {
    id: "12",
    title: "Modern JavaScript: ES6 and Beyond",
    excerpt: "A comprehensive guide to the most useful modern JavaScript features that every developer should know.",
    slug: "modern-javascript-es6-beyond",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    author: {
      name: "Daniel Lee",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    publishedAt: "2023-06-05T14:40:00Z",
    readTime: "10 min read",
    category: "Technology",
    likes: 159,
    comments: 33,
    tags: ["JavaScript", "Web Development", "Programming", "ES6"]
  }
];

// API service
export const api = {
  // Get all posts
  getPosts: async (): Promise<BlogPost[]> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockPosts;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again later.",
        variant: "destructive",
      });
      return [];
    }
  },
  
  // Get post by slug
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const post = mockPosts.find(post => post.slug === slug);
      return post || null;
    } catch (error) {
      console.error(`Failed to fetch post with slug ${slug}:`, error);
      toast({
        title: "Error",
        description: "Failed to fetch the post. Please try again later.",
        variant: "destructive",
      });
      return null;
    }
  },
  
  // Get posts by category
  getPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      // Case-insensitive category matching
      const posts = mockPosts.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      );
      return posts;
    } catch (error) {
      console.error(`Failed to fetch posts for category ${category}:`, error);
      toast({
        title: "Error",
        description: "Failed to fetch category posts. Please try again later.",
        variant: "destructive",
      });
      return [];
    }
  },
  
  // Get posts by tag
  getPostsByTag: async (tag: string): Promise<BlogPost[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      // Case-insensitive tag matching
      const posts = mockPosts.filter(post => 
        post.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      );
      return posts;
    } catch (error) {
      console.error(`Failed to fetch posts for tag ${tag}:`, error);
      toast({
        title: "Error",
        description: "Failed to fetch tagged posts. Please try again later.",
        variant: "destructive",
      });
      return [];
    }
  },
  
  // Get related posts (by category and tags)
  getRelatedPosts: async (postId: string): Promise<BlogPost[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      const currentPost = mockPosts.find(post => post.id === postId);
      
      if (!currentPost) return [];
      
      // Find posts in the same category or with similar tags, excluding the current post
      const relatedPosts = mockPosts.filter(post => {
        if (post.id === postId) return false; // Exclude current post
        
        // Check if in same category
        if (post.category === currentPost.category) return true;
        
        // Check if has common tags
        if (currentPost.tags && post.tags) {
          const hasCommonTags = post.tags.some(tag => 
            currentPost.tags?.includes(tag)
          );
          if (hasCommonTags) return true;
        }
        
        return false;
      });
      
      // Limit to 3 related posts
      return relatedPosts.slice(0, 3);
    } catch (error) {
      console.error(`Failed to fetch related posts for post ID ${postId}:`, error);
      return [];
    }
  },
  
  // Get featured posts
  getFeaturedPosts: async (): Promise<BlogPost[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate featured posts (most likes or most recent)
      const sortedByLikes = [...mockPosts].sort((a, b) => b.likes - a.likes);
      return sortedByLikes.slice(0, 4);
    } catch (error) {
      console.error("Failed to fetch featured posts:", error);
      return [];
    }
  },
  
  // Get popular categories with post count
  getCategories: async (): Promise<{name: string, count: number, slug: string}[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Count posts per category
      const categoryCount: Record<string, number> = {};
      mockPosts.forEach(post => {
        const category = post.category;
        if (category in categoryCount) {
          categoryCount[category]++;
        } else {
          categoryCount[category] = 1;
        }
      });
      
      // Convert to array and sort by count
      const categories = Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count,
        slug: name.toLowerCase()
      }));
      
      return categories.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  }
};
