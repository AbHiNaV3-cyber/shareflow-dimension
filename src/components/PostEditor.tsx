
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/lib/supabase";
import { blogService } from "@/lib/blogService";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const PostEditor = () => {
  const { id } = useParams(); // For editing existing post
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please refresh the page.",
          variant: "destructive",
        });
      }
    };
    
    // If editing, fetch post data
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setEditMode(true);
        
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Only allow editing your own posts
          if (data.author_id !== user.id) {
            toast({
              title: "Unauthorized",
              description: "You can only edit your own posts.",
              variant: "destructive",
            });
            navigate("/dashboard");
            return;
          }
          
          setTitle(data.title);
          setContent(data.content);
          setCategoryId(data.category_id);
          setExcerpt(data.excerpt || "");
          setImagePreview(data.cover_image_url);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load post data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
    fetchPost();
  }, [id, user, navigate, toast]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image is too large. Please select an image under 5MB.");
      return;
    }
    
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    
    setError(null);
    setCoverImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setCoverImage(null);
    // If in edit mode and we already had an image, don't clear the preview
    if (!editMode) {
      setImagePreview(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Basic validation
    if (!title.trim()) {
      setError("Please enter a title for your post");
      return;
    }
    
    if (!content.trim()) {
      setError("Please enter content for your post");
      return;
    }
    
    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    
    if (!imagePreview && !coverImage) {
      setError("Please upload a cover image");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (editMode && id) {
        // Update existing post
        const updates: any = {
          title,
          content,
          excerpt: excerpt || title.substring(0, 160),
          category_id: categoryId,
          published_at: isDraft ? null : new Date().toISOString(),
        };
        
        // If there's a new cover image, upload it
        if (coverImage) {
          const filePath = `covers/${user.id}/${Date.now()}-${coverImage.name}`;
          const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(filePath, coverImage);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from("blog-images")
            .getPublicUrl(filePath);
            
          updates.cover_image_url = publicUrl;
        }
        
        const { error } = await supabase
          .from('posts')
          .update(updates)
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Post updated",
          description: isDraft 
            ? "Your draft has been saved." 
            : "Your post has been published.",
        });
        
        navigate("/dashboard");
      } else {
        // Create new post
        if (!coverImage) {
          throw new Error("Cover image is required");
        }
        
        const result = await blogService.createPost(
          title,
          content,
          excerpt || title.substring(0, 160),
          categoryId,
          coverImage,
          user.id,
          !isDraft
        );
        
        if (!result.success) {
          throw new Error(result.error || "Failed to create post");
        }
        
        toast({
          title: isDraft ? "Draft saved" : "Post published",
          description: isDraft 
            ? "Your draft has been saved successfully." 
            : "Your post has been published successfully.",
        });
        
        if (result.slug) {
          navigate(isDraft ? "/dashboard" : `/post/${result.slug}`);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Error saving post:", error);
      setError(error.message || "An error occurred while saving your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Loading post data...</p>
      </div>
    );
  }

  return (
    <form className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Enter a compelling title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg"
        />
      </div>
      
      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">
          Excerpt <span className="text-muted-foreground text-sm">(optional)</span>
        </Label>
        <Textarea
          id="excerpt"
          placeholder="Brief summary of your post (will use title if left blank)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="resize-none"
          rows={2}
        />
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Cover Image */}
      <div className="space-y-2">
        <Label>Cover Image *</Label>
        {imagePreview ? (
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <img
              src={imagePreview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
              onClick={removeImage}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
            <div className="bg-muted rounded-full p-2">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Drag and drop an image, or{" "}
                <label className="text-primary cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended size: 1200x630px (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] resize-y font-serif"
        />
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </Button>
        <Button 
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : (editMode ? "Update" : "Publish Post")}
        </Button>
      </div>
    </form>
  );
};

export default PostEditor;
