import React from "react";
import { Link } from "react-router-dom";
import footerLogo from "../assets/logo.jpeg";
import Banner from "../assets/footer.jpeg";
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
    <div className="w-full flex justify-center bg-gray-400">
      <div
        className="relative w-full max-w-7xl rounded-3xl shadow-lg overflow-hidden"
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        <div className="px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company info */}
            <div className="py-2 sm:py-4">
              <h1 className="sm:text-3xl text-2xl font-bold flex items-center gap-3 mb-3 text-white">
                <img src={footerLogo} alt="Logo" className="max-w-[50px]" />
                RY
              </h1>
              <p className="text-gray-200 text-sm sm:text-base">
                Redefine your everyday wardrobe with our men’s designs that merge
                classic aesthetics with contemporary flair. Every stitch tells a
                story of craftsmanship, comfort, and style that suits any
                occasion.
              </p>
            </div>

            {/* Links + Social & Contact */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Important Links */}
              <div>
                <h1 className="sm:text-xl text-lg font-bold mb-3 text-yellow-400">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-2 sm:gap-3">
                  {FooterLinks.map((link) => (
                    <li key={link.title}>
                      <Link
                        to={link.link}
                        className="cursor-pointer hover:text-yellow-300 duration-300 text-gray-200 text-sm sm:text-base"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social & Contact */}
              <div>
                <h1 className="sm:text-xl text-lg font-bold mb-3 text-yellow-400">
                  Connect
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <a href="#">
                    <FaInstagram className="text-3xl text-gray-200 hover:text-pink-500 transition-colors duration-300" />
                  </a>
                  <a href="#">
                    <FaFacebook className="text-3xl text-gray-200 hover:text-blue-500 transition-colors duration-300" />
                  </a>
                  <a href="#">
                    <FaLinkedin className="text-3xl text-gray-200 hover:text-blue-400 transition-colors duration-300" />
                  </a>
                </div>
                <div className="text-gray-200 text-sm sm:text-base space-y-2">
                  <div className="flex items-center gap-3">
                    <FaLocationArrow className="text-yellow-400" /> 
                    <p>Bangalore, Karnataka</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMobileAlt className="text-yellow-400" /> 
                    <p>+91 123456789</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom border */}
          <div className="border-t border-gray-600 mt-6 pt-4 text-center text-sm text-gray-200">
            © {new Date().getFullYear()} RY. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
