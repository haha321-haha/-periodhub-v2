
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';
import { NAVIGATION, TRANSLATIONS } from '../constants';
import { trackEvent } from '../utils/analytics';
import { useDarkMode } from '../hooks/useDarkMode';

interface NavigationProps {
  language: 'en' | 'zh';
  onToggleLanguage: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ language, onToggleLanguage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isDark, toggleDarkMode } = useDarkMode();

  const t = TRANSLATIONS[language].nav;

  // Scroll listener for glass effect intensity
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // P1: Keyboard Navigation (Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-5'}`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a 
            href="#home" 
            className="flex-shrink-0 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-1"
            aria-label="PeriodHub Home"
          >
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              PeriodHub
            </span>
            <span className="text-2xl" aria-hidden="true">🌸</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION.map((item) => {
              // Map labels to translations
              let label = item.label;
              if (item.label === 'Home') label = t.home;
              if (item.label === 'Interactive Tools') label = t.tools;
              if (item.label === 'Articles & Downloads') label = t.downloads;
              if (item.label === 'Scenario Solutions') label = t.scenarios;
              if (item.label === 'Natural Therapies') label = t.naturalTherapies;
              if (item.label === 'Health Guide') label = t.healthGuide;

              return (
                <div 
                  key={item.label} 
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a 
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                    aria-haspopup={!!item.children}
                    aria-expanded={activeDropdown === item.label}
                    title={label}
                  >
                    {label}
                    {item.children && <ChevronDown size={14} aria-hidden="true" />}
                    {item.children && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold animate-pulse" aria-hidden="true">HOT</span>
                    )}
                  </a>

                  {/* Dropdown */}
                  {item.children && (
                    <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                      <div className="glass dark:bg-slate-800 rounded-xl shadow-xl p-2 overflow-hidden">
                        {item.children.map((child) => (
                          <a 
                            key={child.id} 
                            href={child.href}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors group/item focus:outline-none focus:ring-2 focus:ring-purple-500"
                            title={child.title}
                            onClick={() => trackEvent('menu_item_click', { item: child.title })}
                          >
                            <span className="text-xl bg-white dark:bg-slate-700 p-2 rounded-md shadow-sm" role="img" aria-label={child.title + " icon"}>{child.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover/item:text-purple-700 dark:group-hover/item:text-purple-400">{child.title}</p>
                                  {child.badge && (
                                      <span className={`text-[10px] font-bold px-1.5 rounded text-white ${
                                          child.badge === 'PRO' ? 'bg-purple-600' : 
                                          child.badge === 'NEW' ? 'bg-green-500' : 'bg-pink-500'
                                      }`}>
                                          {child.badge}
                                      </span>
                                  )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{child.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
                onClick={onToggleLanguage}
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800 px-3 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={`Switch Language. Current: ${language.toUpperCase()}`}
            >
                {language === 'en' ? '🇺🇸 EN' : '🇨🇳 中文'}
            </button>
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => trackEvent('get_started_nav_click')}
            >
              {t.getStarted}
            </button>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden glass dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-1">
             {NAVIGATION.map((item) => {
                 let label = item.label;
                 if (item.label === 'Home') label = t.home;
                 if (item.label === 'Interactive Tools') label = t.tools;
                 if (item.label === 'Articles & Downloads') label = t.downloads;
                 if (item.label === 'Scenario Solutions') label = t.scenarios;
                 if (item.label === 'Natural Therapies') label = t.naturalTherapies;
                 if (item.label === 'Health Guide') label = t.healthGuide;

                 return (
                   <div key={item.label} className="py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                       <a href={item.href} className="block font-medium text-gray-800 dark:text-gray-100 py-2">{label}</a>
                       {item.children && (
                           <div className="pl-4 space-y-2 mt-2">
                               {item.children.map(child => (
                                   <a 
                                      key={child.id} 
                                      href={child.href} 
                                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 py-1"
                                      onClick={() => trackEvent('mobile_menu_item_click', { item: child.title })}
                                    >
                                       <span role="img" aria-label={child.title}>{child.icon}</span>
                                       <span>{child.title}</span>
                                   </a>
                               ))}
                           </div>
                       )}
                   </div>
                 );
             })}
             <div className="mt-4 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={onToggleLanguage}
                        className="text-left text-sm font-medium text-purple-600 dark:text-purple-400 py-2"
                    >
                        {language === 'en' ? 'Switch to 中文' : 'Switch to English'}
                    </button>
                    <button 
                        onClick={toggleDarkMode}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-full"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
                <button 
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium"
                  onClick={() => trackEvent('get_started_mobile_click')}
                >
                  {t.getStarted}
                </button>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
