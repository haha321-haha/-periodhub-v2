import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAVIGATION } from '../constants';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Scroll listener for glass effect intensity
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-5'}`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              PeriodHub
            </span>
            <span className="text-2xl" aria-hidden="true">🌸</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION.map((item) => (
              <div 
                key={item.label} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a 
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors py-2"
                  aria-haspopup={!!item.children}
                  aria-expanded={activeDropdown === item.label}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                  {item.children && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold animate-pulse">HOT</span>
                  )}
                </a>

                {/* Dropdown */}
                {item.children && (
                  <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="glass rounded-xl shadow-xl p-2 overflow-hidden">
                      {item.children.map((child) => (
                        <a 
                          key={child.id} 
                          href={child.href}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group/item"
                        >
                          <span className="text-xl bg-white p-2 rounded-md shadow-sm">{child.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900 group-hover/item:text-purple-700">{child.title}</p>
                                {child.badge && (
                                    <span className={`text-[10px] font-bold px-1.5 rounded text-white ${
                                        child.badge === 'PRO' ? 'bg-purple-600' : 
                                        child.badge === 'NEW' ? 'bg-green-500' : 'bg-pink-500'
                                    }`}>
                                        {child.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">{child.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
                className="text-sm font-medium text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-full transition-colors"
                aria-label="Switch Language"
            >
                🇺🇸 EN
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Get Started
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-purple-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-gray-200 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-1">
             {NAVIGATION.map((item) => (
                 <div key={item.label} className="py-2 border-b border-gray-100 last:border-0">
                     <a href={item.href} className="block font-medium text-gray-800 py-2">{item.label}</a>
                     {item.children && (
                         <div className="pl-4 space-y-2 mt-2">
                             {item.children.map(child => (
                                 <a key={child.id} href={child.href} className="flex items-center gap-2 text-sm text-gray-600 py-1">
                                     <span>{child.icon}</span>
                                     <span>{child.title}</span>
                                 </a>
                             ))}
                         </div>
                     )}
                 </div>
             ))}
             <div className="mt-4 pt-4">
                <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium">Get Started</button>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;