
const FooterSection = () => (
  <footer className="w-full bg-white border-t py-8">
    <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-gray-500 text-sm">
      <div>&copy; {new Date().getFullYear()} TaskMind.ai</div>
      <nav className="flex flex-wrap gap-6">
        <a href="/terms-of-use" className="hover:underline">Terms</a>
        <a href="/privacy-policy" className="hover:underline">Privacy</a>
        <a href="/support" className="hover:underline">Contact</a>
      </nav>
    </div>
  </footer>
);

export default FooterSection;
