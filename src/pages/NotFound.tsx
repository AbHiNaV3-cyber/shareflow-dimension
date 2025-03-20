import { Link } from 'react-router-dom';
import { FileQuestion, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-24">
        <Header />
      </header>

      <main className="flex-grow flex items-center justify-center py-20 px-4 mt-12">
        <div className="container-narrow text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <FileQuestion size={72} className="text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Oops! Page not found
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home size={16} />
                Return to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2 w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <RefreshCw size={16} />
              Go Back
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}