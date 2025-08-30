import { CatIcon, Facebook, GithubIcon, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-between gap-5">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <CatIcon className="h-8 w-8 text-green-600" />
              <span className="font-bold text-xl text-yellow-400">Let's Ride</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your reliable ride-sharing partner. Safe, fast, and affordable transportation at your fingertips.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">+1234567890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">support@nai.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">123 Business Tower, Dubai 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm flex gap-2">
            © {currentYear} Let's Ride. All rights reserved
            <span><GithubIcon className='text-green-600' /></span>
            <a
              href="https://www.github.com/muhamash"
              target="_blank"
              rel="noopener noreferrer"
              className='text-yellow-400 font-mono cursor-pointer'
            >
              www.github.com/muhamash
            </a>
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to={"/wrong-contact-information"} className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact
            </Link>
            <Link to={"/faq"} className="text-gray-400 hover:text-white text-sm transition-colors">
              FAQ
            </Link>
            <Link to={"/about"} className="text-gray-400 hover:text-white text-sm transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;