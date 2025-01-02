import React from 'react';
import { 
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';
import Logo from '../Logo/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-white shadow-lg">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600" />
      
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Brand and Logo Section */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start space-y-1">
            <div className='h-16 w-16'>
              <Logo/>
            </div>
            <div className="text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              <span>Buy It Easily!</span>
              <span className="text-xs block md:inline md:ml-1">(All Buy & Go)</span>
            </div>
          </div>

          {/* Quick Links - Compact Grid */}
          <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-center md:text-left text-sm">
            {[
              {
                title: "Company",
                links: ["About", "Careers", "Contact"]
              },
              {
                title: "Support",
                links: ["Help", "FAQs", "Terms"]
              },
              {
                title: "Services",
                links: ["Products", "Pricing", "Docs"]
              },
              {
                title: "Resources",
                links: ["Blog", "Events", "Guides"]
              }
            ].map((section, index) => (
              <div key={index} className="space-y-1">
                <h3 className="font-semibold text-slate-800 text-xs">{section.title}</h3>
                <ul className="space-y-0.5">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-xs text-slate-600 hover:text-violet-600 transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social and Copyright Section */}
          <div className="md:col-span-3 flex flex-col items-center md:items-end space-y-2">
            {/* Social Media Icons */}
            <div className="flex gap-2">
              {[
                { Icon: FaFacebookF, link: "www.facebook.com", label: "Facebook" },
                { Icon: FaTwitter, link: "www.twitter.com", label: "Twitter" },
                { Icon: FaInstagram, link: "www.instagram.com", label: "Instagram" },
                { Icon: FaLinkedinIn, link: "www.linkedin.com", label: "LinkedIn" },
                { Icon: FaYoutube, link: "www.youtube.com", label: "YouTube" }
              ].map(({ Icon, link, label }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  aria-label={label}
                  className="group p-1.5 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Icon className="text-sm text-slate-600 transition-colors duration-300 group-hover:text-violet-600" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-xs text-slate-600">
                © {currentYear} All Buy & Go.
              </p>
              <p className="text-xs text-slate-500">
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600" />
    </footer>
  );
};

export default Footer;