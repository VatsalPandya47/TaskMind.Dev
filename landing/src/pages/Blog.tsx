import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Simple "Hang on!" message */}
      <section className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black">Hang on!</h1>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
