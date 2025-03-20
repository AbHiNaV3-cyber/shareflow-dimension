import { supabase } from './supabase';
import { BlogPost, Author } from './api';
import { BlogPostDB, CategoryDB, Profile } from './supabase';

// Transform a database blog post into our frontend model
const transformPost = async (post: BlogPostDB): Promise<BlogPost> => {
  // Get author information
  const { data: authorData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', post.author_id)
    .single();

  // Get category information
  const { data: categoryData } = await supabase
    .from('categories')
    .select('*')
    .eq('id', post.category_id)
    .single();

  // Get tags for the post
  const { data: tagsData } = await supabase
    .from('post_tags')
    .select('tags(name)')
    .eq('post_id', post.id);

  const author: Author = {
    name: authorData?.username || 'Unknown Author',
    avatar: authorData?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  // Get comment count
  const { count } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('post_id', post.id);

  // Get like count
  const { count: likesCount } = await supabase
    .from('post_likes')
    .select('user_id', { count: 'exact', head: true })
    .eq('post_id', post.id);

  // Fix: Properly extract tag names by checking the structure
  const tags: string[] = tagsData?.map(tag => {
    // Check if tags has the expected structure
    if (tag.tags && typeof tag.tags === 'object' && 'name' in tag.tags) {
      return tag.tags.name as string;
    }
    return '';
  }).filter(Boolean) || [];

  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    coverImage: post.cover_image_url,
    author,
    publishedAt: post.published_at,
    readTime: post.read_time,
    category: categoryData?.name || 'Uncategorized',
    likes: likesCount || 0,
    comments: count || 0,
    content: post.content,
    tags
  };
};

export const blogService = {
  // Get all published posts
  getPosts: async (): Promise<BlogPost[]> => {
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .is('published_at', 'not.null')
        .order('published_at', { ascending: false });

      if (error) throw error;

      // Transform all posts
      const transformedPosts = await Promise.all(
        (posts || []).map(transformPost)
      );

      return transformedPosts;
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
    }
  },

  // Get a single post by slug
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .is('published_at', 'not.null')
        .single();

      if (error) throw error;
      if (!post) return null;

      return await transformPost(post);
    } catch (error) {
      console.error(`Failed to fetch post with slug ${slug}:`, error);
      return null;
    }
  },

  // Get posts by category
  getPostsByCategory: async (categorySlug: string): Promise<BlogPost[]> => {
    try {
      // First get the category ID from the slug
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (categoryError) throw categoryError;
      if (!category) return [];

      // Now get posts for that category
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category_id', category.id)
        .is('published_at', 'not.null')
        .order('published_at', { ascending: false });

      if (error) throw error;

      // Transform all posts
      const transformedPosts = await Promise.all(
        (posts || []).map(transformPost)
      );

      return transformedPosts;
    } catch (error) {
      console.error(`Failed to fetch posts for category ${categorySlug}:`, error);
      return [];
    }
  },

  // Get featured posts (most likes)
  getFeaturedPosts: async (): Promise<BlogPost[]> => {
    try {
      // Fix: Use count() aggregation instead of group
      // Get post IDs ordered by like count using a different approach
      const { data: likeCounts, error: countError } = await supabase
        .rpc('get_posts_by_like_count', { limit_count: 4 });

      if (countError) {
        console.error("Error calling RPC function:", countError);
        // Fallback if the RPC function doesn't exist yet
        const { data: recentPosts, error } = await supabase
          .from('posts')
          .select('*')
          .is('published_at', 'not.null')
          .order('published_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        
        const transformedPosts = await Promise.all(
          (recentPosts || []).map(transformPost)
        );
        
        return transformedPosts;
      }
      
      if (!likeCounts || likeCounts.length === 0) {
        // Fallback: Just get the most recent posts
        const { data: recentPosts, error } = await supabase
          .from('posts')
          .select('*')
          .is('published_at', 'not.null')
          .order('published_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        
        const transformedPosts = await Promise.all(
          (recentPosts || []).map(transformPost)
        );
        
        return transformedPosts;
      }

      // Get the actual posts
      const postIds = likeCounts.map(item => item.post_id);
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .in('id', postIds)
        .is('published_at', 'not.null');

      if (error) throw error;

      // Transform posts and keep order based on likes
      const transformedPosts = await Promise.all(
        (posts || []).map(transformPost)
      );
      
      // Sort by the original like count order
      return transformedPosts.sort((a, b) => {
        const aIndex = postIds.indexOf(a.id);
        const bIndex = postIds.indexOf(b.id);
        return aIndex - bIndex;
      });
    } catch (error) {
      console.error("Failed to fetch featured posts:", error);
      return [];
    }
  },

  // Get categories with post count
  getCategories: async (): Promise<{name: string, count: number, slug: string}[]> => {
    try {
      // Get all categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;

      // Get post counts for each category
      const categoriesWithCount = await Promise.all(
        (categories || []).map(async (category) => {
          const { count, error } = await supabase
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .is('published_at', 'not.null');

          if (error) throw error;

          return {
            name: category.name,
            slug: category.slug,
            count: count || 0
          };
        })
      );

      return categoriesWithCount.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },

  // Create a new post
  createPost: async (
    title: string,
    content: string,
    excerpt: string,
    categoryId: string,
    coverImage: File,
    userId: string,
    publish: boolean = false
  ): Promise<{ success: boolean; slug?: string; error?: string }> => {
    try {
      // Generate a slug from the title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/gi, '-');

      // Upload the cover image
      const { data: imageData, error: imageError } = await supabase.storage
        .from('blog-images')
        .upload(`covers/${userId}/${Date.now()}-${coverImage.name}`, coverImage);

      if (imageError) throw imageError;

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(imageData.path);

      // Estimate read time (very basic algorithm)
      const wordCount = content.split(/\s+/).length;
      const readTimeMinutes = Math.ceil(wordCount / 200); // Assuming 200 words per minute
      const readTime = `${readTimeMinutes} min read`;

      // Create the post record
      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          title,
          slug,
          content,
          excerpt,
          author_id: userId,
          category_id: categoryId,
          cover_image_url: publicUrl,
          read_time: readTime,
          published_at: publish ? new Date().toISOString() : null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, slug: post.slug };
    } catch (error: any) {
      console.error("Failed to create post:", error);
      return { success: false, error: error.message };
    }
  },

  // Like a post
  likePost: async (postId: string, userId: string): Promise<boolean> => {
    try {
      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // Error other than "not found"
        throw checkError;
      }

      if (existingLike) {
        // User already liked this post, so remove the like
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);
          
        if (deleteError) throw deleteError;
        return false; // Indicates like was removed
      } else {
        // Add new like
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: userId });
          
        if (insertError) throw insertError;
        return true; // Indicates like was added
      }
    } catch (error) {
      console.error("Error toggling post like:", error);
      return false;
    }
  },

  // Add a comment to a post
  addComment: async (
    postId: string, 
    userId: string, 
    content: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      return false;
    }
  },

  // Get comments for a post
  getComments: async (postId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (username, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }
};
