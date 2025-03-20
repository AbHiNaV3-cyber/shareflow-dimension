
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Eye, 
  MoreHorizontal,
  FileText,
  ChevronDown
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface CategoryType {
  name: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  created_at: string;
  category: CategoryType | null;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        let query = supabase
          .from('posts')
          .select('id, title, slug, published_at, created_at, category:category_id(name)')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });

        if (statusFilter === "published") {
          query = query.not('published_at', 'is', null);
        } else if (statusFilter === "draft") {
          query = query.is('published_at', null);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        const transformedPosts = (data || []).map(post => {
          let categoryName = 'Uncategorized';
          
          if (post.category) {
            // Handle different possible formats of the category data
            if (typeof post.category === 'object' && post.category !== null) {
              if (Array.isArray(post.category)) {
                // If it's an array, safely extract the name from the first item if it exists
                const firstCategory = post.category[0];
                if (firstCategory && typeof firstCategory === 'object' && firstCategory !== null && 'name' in firstCategory) {
                  categoryName = firstCategory.name as string || 'Uncategorized';
                }
              } else if ('name' in post.category) {
                // If it's an object with a name property
                categoryName = post.category.name as string || 'Uncategorized';
              }
            } else if (typeof post.category === 'string') {
              // If it's just a string
              categoryName = post.category;
            }
          }
          
          return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            published_at: post.published_at,
            created_at: post.created_at,
            category: { name: categoryName }
          };
        });
        
        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load your posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user, statusFilter, navigate, toast]);

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: "Post deleted",
        description: "Your post has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublishPost = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          published_at: isPublished ? null : new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            published_at: isPublished ? null : new Date().toISOString()
          };
        }
        return post;
      }));

      toast({
        title: isPublished ? "Post unpublished" : "Post published",
        description: isPublished 
          ? "Your post has been moved to drafts." 
          : "Your post is now live and public.",
      });
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast({
        title: "Error",
        description: "Failed to update the post status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-24">
        <Header />
      </header>
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Posts</h1>
              <p className="text-muted-foreground mt-1">
                Manage your blog posts and drafts
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
              
              <Link to="/editor">
                <Button className="gap-2">
                  <Plus size={16} />
                  New Post
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Loading your posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-6">
                  {statusFilter === "all" 
                    ? "You haven't created any posts yet." 
                    : statusFilter === "published" 
                      ? "You don't have any published posts." 
                      : "You don't have any draft posts."}
                </p>
                <Link to="/editor">
                  <Button>Create your first post</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Title</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="hidden lg:table-cell">Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/post/${post.slug}`}
                          className="hover:text-primary transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.published_at 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {post.published_at ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {post.category?.name || "Uncategorized"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {formatDate(post.created_at)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {formatDate(post.published_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/post/${post.slug}`} className="flex items-center cursor-pointer">
                                  <Eye size={16} className="mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/editor/${post.id}`} className="flex items-center cursor-pointer">
                                  <Pencil size={16} className="mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handlePublishPost(post.id, !!post.published_at)}
                                className="flex items-center cursor-pointer"
                              >
                                <FileText size={16} className="mr-2" />
                                {post.published_at ? "Unpublish" : "Publish"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeletePost(post.id)}
                                className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
