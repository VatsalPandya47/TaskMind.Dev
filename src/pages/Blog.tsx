import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Simple "Hang on!" message */}
      <section className="flex-1 flex items-center justify-center py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Hang on!</h1>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
