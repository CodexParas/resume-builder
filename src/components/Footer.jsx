import React from "react";
import { Logo } from "../assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="flex items-center justify-center gap-3 py-3">
        <img src={Logo} className="w-8 h-auto object-contain" alt="Logo" />
        <p>Express Resume</p>
      </div>
      <div className="flex items-center justify-center gap-6">
        <Link to="/" className="text-blue-700 text-sm">
          Home
        </Link>
        <Link to="/contact" className="text-blue-700 text-sm">
          Contact
        </Link>
        <Link to="/privacy" className="text-blue-700 text-sm whitespace-nowrap">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default Footer;
