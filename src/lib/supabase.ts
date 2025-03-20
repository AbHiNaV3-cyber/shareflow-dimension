
import { createClient } from '@supabase/supabase-js';

// Replace these with your own Supabase URL and anon key
// You'll get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  created_at: string;
};

export type BlogPostDB = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  cover_image_url: string;
  published_at: string;
  category_id: string;
  read_time: string;
  created_at: string;
};

export type CategoryDB = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type CommentDB = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type TagDB = {
  id: string;
  name: string;
  slug: string;
};

export type PostTagDB = {
  post_id: string;
  tag_id: string;
};
