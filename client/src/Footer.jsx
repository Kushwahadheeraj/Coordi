import React from 'react';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-6 border-t border-blue-100 mt-8">
    <div className="container mx-auto text-center text-sm">
      &copy; {new Date().getFullYear()} Disaster Response Dashboard. All rights reserved. |
      <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-200 hover:underline ml-1 transition-colors">GitHub</a>
    </div>
  </footer>
);

export default Footer; 