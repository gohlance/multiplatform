import React from 'react';
import { Upload } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Upload className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-semibold text-gray-900">MultiStore Uploader</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Documentation</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Support</a>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Connect Platform
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}