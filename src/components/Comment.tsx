
import { useState } from "react";
import { Heart, Reply, MoreHorizontal, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import CommentForm from "./CommentForm";

interface CommentProps {
  comment: {
    id: string;
    content: string;
    author: {
      name: string;
      avatar?: string;
    };
    publishedAt: string;
    likes: number;
    replies?: CommentProps["comment"][];
  };
  level?: number;
}

const Comment = ({ comment, level = 0 }: CommentProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3; // Maximum nesting level for replies
  
  const toggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(prev => !prev);
  };
  
  const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "just now";
  };

  return (
    <div className={`${level > 0 ? "ml-6 pl-6 border-l" : ""}`}>
      <div className="flex gap-4 py-4">
        {/* Avatar */}
        <Avatar>
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>
            {comment.author.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          {/* Comment Header */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{comment.author.name}</h4>
              <p className="text-xs text-muted-foreground">
                {timeSince(comment.publishedAt)}
              </p>
            </div>
            
            {/* Comment Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal size={16} />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <Flag size={16} className="mr-2" />
                  Report comment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Comment Content */}
          <div className="my-2">
            <p className="text-sm md:text-base text-foreground/90">{comment.content}</p>
          </div>
          
          {/* Comment Footer */}
          <div className="flex items-center gap-4 mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 text-xs ${liked ? "text-red-500" : ""}`}
              onClick={toggleLike}
            >
              <Heart size={14} className={liked ? "fill-red-500" : ""} />
              <span>{likesCount}</span>
            </Button>
            
            {level < maxDepth && (
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 text-xs"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply size={14} />
                <span>Reply</span>
              </Button>
            )}
          </div>
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm 
                isReply 
                onSubmit={() => setShowReplyForm(false)}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {hasReplies && (
        <div className="mt-2 ml-12">
          {!showReplies ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowReplies(true)}
            >
              Show {comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"}
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-foreground mb-2"
                onClick={() => setShowReplies(false)}
              >
                Hide replies
              </Button>
              <div className="space-y-0">
                {comment.replies!.map(reply => (
                  <Comment key={reply.id} comment={reply} level={level + 1} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
