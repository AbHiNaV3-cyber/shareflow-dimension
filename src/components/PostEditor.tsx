
import { useState } from "react";
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

const PostEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const categories = [
    "Technology",
    "Health",
    "Productivity",
    "Design",
    "Business",
    "Lifestyle",
    "Travel",
    "Food",
    "Finance",
  ];
  
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
    setImagePreview(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      setError("Please enter a title for your post");
      return;
    }
    
    if (!content.trim()) {
      setError("Please enter content for your post");
      return;
    }
    
    if (!category) {
      setError("Please select a category");
      return;
    }
    
    if (!coverImage) {
      setError("Please upload a cover image");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Simulate API request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success
      console.log("Post submitted", {
        title,
        content,
        category,
        excerpt: excerpt || title,
        coverImage
      });
      
      // Reset form (in a real app, you'd redirect to the new post)
      // For demo, we'll just reset the form
      setTitle("");
      setContent("");
      setCategory("");
      setExcerpt("");
      setCoverImage(null);
      setImagePreview(null);
      
    } catch (error) {
      setError("An error occurred while publishing your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
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
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </Button>
      </div>
    </form>
  );
};

export default PostEditor;
