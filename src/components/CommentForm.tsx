
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentFormProps {
  isReply?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const CommentForm = ({ 
  isReply = false,
  onSubmit,
  onCancel
}: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock user data (will be replaced with real auth later)
  const user = {
    name: "Guest User",
    avatar: ""
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reset form
    setComment("");
    setIsLoading(false);
    
    // Callback
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>GU</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder={isReply ? "Write a reply..." : "Join the discussion..."}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none focus:ring-primary"
            rows={isReply ? 2 : 3}
          />
          
          <div className="flex justify-end gap-2 mt-2">
            {isReply && onCancel && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              size="sm"
              disabled={!comment.trim() || isLoading}
            >
              {isLoading ? "Posting..." : isReply ? "Reply" : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
