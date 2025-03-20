
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostEditor from "@/components/PostEditor";

const Editor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-24">
        <Header />
      </header>
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-narrow">
          <h1 className="text-3xl font-bold mb-8">Create a New Post</h1>
          <PostEditor />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Editor;
