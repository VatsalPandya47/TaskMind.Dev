
import { Link } from "react-router-dom";

const FooterSection = () => (
  <footer className="w-full bg-white border-t py-8">
    <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-gray-500 text-sm">
      <div>&copy; {new Date().getFullYear()} TaskMind.ai</div>
      <nav className="flex flex-wrap gap-6">
        <Link to="/terms-of-use" className="hover:underline">Terms</Link>
        <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
        <Link to="/support" className="hover:underline">Contact</Link>
      </nav>
    </div>
  </footer>
);

export default FooterSection;
