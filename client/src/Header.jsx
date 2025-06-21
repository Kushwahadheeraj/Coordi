import React from 'react';

const Header = () => (
  <header className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
    <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-between py-5 px-4">
      <a href="#" className="text-2xl font-extrabold tracking-tight hover:text-blue-200 transition-colors">Disaster Response Dashboard</a>
      <ul className="flex flex-wrap gap-4 mt-3 sm:mt-0">
        <li><a href="#disaster-management" className="hover:underline">Disasters</a></li>
        <li><a href="#reports" className="hover:underline">Reports</a></li>
        <li><a href="#social-media" className="hover:underline">Social Media</a></li>
        <li><a href="#resources" className="hover:underline">Resources</a></li>
        <li><a href="#verification-status" className="hover:underline">Verification</a></li>
      </ul>
    </nav>
  </header>
);

export default Header; 