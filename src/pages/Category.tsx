
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api, BlogPost } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Capitalize category name for display
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
  
  // Fetch posts by category
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['posts', 'category', category],
    queryFn: () => api.getPostsByCategory(category || ''),
    enabled: !!category,
  });
  
  // Get current posts based on pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-24">
        <Header />
      </header>
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-wide">
          {/* Back button and category heading */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4 px-0">
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Loading category...
                </span>
              ) : isError ? (
                "Category Not Found"
              ) : (
                <>
                  {categoryName} Articles
                  <span className="text-lg font-normal text-muted-foreground ml-3">
                    ({posts.length} posts)
                  </span>
                </>
              )}
            </h1>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          
          {/* Error state */}
          {isError && !isLoading && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                There was an error loading posts for this category.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}
          
          {/* No posts state */}
          {!isLoading && !isError && posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No posts found in this category.
              </p>
              <Link to="/">
                <Button>Browse All Posts</Button>
              </Link>
            </div>
          )}
          
          {/* Posts grid */}
          {!isLoading && !isError && posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentPosts.map((post: BlogPost) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="my-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPage === index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Category;
