import { Facebook, Instagram, Twitter, Send } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-violet-950 text-violet-100 font-sans">
      {/* Top Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-extrabold text-yellow-300 tracking-wide">Tiket Lakwatsero</h2>
          <p className="mt-4 text-sm text-violet-300 leading-relaxed">
            Book smarter. Fly farther. Your Filipino gateway to world-class destinations.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            {["/", "/flights", "/support", "/profile"].map((path, idx) => {
              const labels = ["Home", "Flights", "Support", "My Account"];
              return (
                <li key={path}>
                  <Link to={path} className="hover:text-yellow-300 transition-all duration-200">
                    {labels[idx]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            {["Privacy Policy", "Terms of Service", "Cookies Policy"].map((label) => (
              <li key={label}>
                <a href="#" className="hover:text-yellow-300 transition-all duration-200">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-sm text-violet-300 mb-3">Get exclusive flight deals and travel tips.</p>
          <form className="flex items-center bg-violet-800/40 border border-violet-700 rounded-lg overflow-hidden shadow-inner">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 text-sm bg-transparent text-white placeholder-violet-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-300 text-violet-900 px-4 py-2 hover:bg-yellow-400 transition flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-violet-800" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-violet-400">
        <p>© {new Date().getFullYear()} Tiket Lakwatsero. All rights reserved.</p>
        <div className="flex gap-4 mt-3 sm:mt-0">
          {[Facebook, Instagram, Twitter].map((Icon, idx) => (
            <a key={idx} href="#" className="hover:text-yellow-300 transition">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
