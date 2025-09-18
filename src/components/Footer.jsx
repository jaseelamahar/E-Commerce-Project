import React from "react";
import { Link } from "react-router-dom";
import footerLogo from "../assets/logo.jpeg";
import footerBg from "../assets/footer.jpeg"; // ✅ import background image
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const FooterLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Contact", link: "/contact" },
  { title: "Blog", link: "/blog" },
];

const Footer = () => {
  return (
    <footer
      className="relative w-full text-gray-200 bg-cover bg-center"
      style={{ backgroundImage: `url(${footerBg})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b border-gray-700 pb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={footerLogo}
                alt="Logo"
                className="w-10 sm:w-12 lg:w-14 rounded-md"
              />
              <span className="text-white text-xl sm:text-2xl font-semibold tracking-widest">
                RY
              </span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Redefine your everyday wardrobe with timeless designs. Crafted with
              precision, merging classic aesthetics with modern sophistication.
            </p>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-white font-semibold uppercase tracking-widest mb-4 text-sm">
              Explore
            </h2>
            <ul className="space-y-3">
              {FooterLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.link}
                    className="hover:text-white transition-colors text-gray-300 text-sm uppercase tracking-wide"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className="text-white font-semibold uppercase tracking-widest mb-4 text-sm">
              Follow Us
            </h2>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white transition-colors">
                <FaInstagram className="text-xl sm:text-2xl" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaFacebook className="text-xl sm:text-2xl" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaLinkedin className="text-xl sm:text-2xl" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-white font-semibold uppercase tracking-widest mb-4 text-sm">
              Contact
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <FaLocationArrow className="text-yellow-400" />
                <span>Bangalore, Karnataka</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMobileAlt className="text-yellow-400" />
                <span>+91 123456789</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-xs sm:text-sm text-gray-400">
          <p>© {new Date().getFullYear()} RY. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for a modern lifestyle</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
