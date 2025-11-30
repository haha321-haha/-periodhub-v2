
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LunaAI from './components/LunaAI';
import CycleViz from './components/CycleViz';
import CycleSetupModal from './components/CycleSetupModal';
import PainTrackerModal from './components/PainTrackerModal';
import ClinicalEffectivenessScores from './components/ClinicalEffectivenessScores';
import { TOOLS, STATS, SCENARIOS, TRANSLATIONS } from './constants';
import { ArrowRight, Shield, CheckCircle, Heart, Info, Calendar, Lock } from 'lucide-react';
import { trackEvent } from './utils/analytics';
import { useCycleTracker } from './hooks/useCycleTracker';

function App() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const t = TRANSLATIONS[language];
  
  // Get translated tools, scenarios, and stats based on language
  const translatedTools = TOOLS.map(tool => {
    const translated = t.tools?.find(t => t.id === tool.id);
    return translated ? { ...tool, title: translated.title, description: translated.description } : tool;
  });
  
  const translatedScenarios = SCENARIOS.map(scenario => {
    const translated = t.scenarios?.find(s => s.id === scenario.id);
    return translated ? { ...scenario, title: translated.title, description: translated.description } : scenario;
  });
  
  const translatedStats = t.stats || STATS;

  // Handle anchor link clicks for smooth scrolling
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (anchor && anchor.href) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          const id = href.substring(1);
          const element = document.getElementById(id);
          
          if (element) {
            e.preventDefault();
            const offset = 80; // Navigation bar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Phase 1.1: Cycle Tracker Hook
  const { currentInfo, isSetup, setupCycle, updateLastPeriod } = useCycleTracker();
  
  // Modal States
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [isPainModalOpen, setIsPainModalOpen] = useState(false);

  const handleToggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    trackEvent('language_switch', { language: newLang });
  };

  // Handle click on the Hero Cycle Visualization
  const handleCycleClick = () => {
    trackEvent('cycle_viz_click');
    if (!isSetup) {
        setIsCycleModalOpen(true);
    } else {
        const confirmed = window.confirm("Do you want to log your period starting today?");
        if (confirmed) {
            const todayStr = new Date().toISOString().split('T')[0];
            updateLastPeriod(todayStr);
        }
    }
  };

  const handleCycleSetupSave = (data: { lastPeriodDate: string; averageCycleLength: number }) => {
      setupCycle(data);
      setIsCycleModalOpen(false);
  };

  // Unified Tool Click Handler
  const handleToolClick = (toolId: string) => {
      trackEvent('tool_click', { tool_id: toolId });
      
      if (toolId === 'pain-tracker') {
          setIsPainModalOpen(true);
      } else if (toolId === 'cycle-tracker') {
          // Scroll to top to see visualization or open modal
          if (!isSetup) {
             setIsCycleModalOpen(true);
          } else {
             window.scrollTo({ top: 0, behavior: 'smooth' });
          }
      } else {
          alert("This tool is coming soon in Phase 2!");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="skip-link absolute top-0 left-0 bg-purple-600 text-white p-3 -translate-y-full focus:translate-y-0 transition-transform z-50 rounded-br-lg"
      >
        Skip to main content
      </a>

      <Navigation language={language} onToggleLanguage={handleToggleLanguage} />
      
      <main id="main-content" className="pt-24">
        
        {/* HERO SECTION */}
        <section id="home" className="relative overflow-hidden pb-16 lg:pb-24">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Hero Content */}
                    <div className="space-y-6">
                        {/* ACOG Badge */}
                        {t.hero.badge && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 114 0h1.5a1 1 0 100 2H14a2 2 0 100 4h-2a2 2 0 100-4h.5a1 1 0 100-2H12a2 2 0 01-2-2V5z" clipRule="evenodd"/>
                                </svg>
                                {t.hero.badge}
                            </div>
                        )}

                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            {t.hero.h1_prefix}<br/>
                            <span className="text-gradient">{t.hero.h1_highlight}</span>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                            <span className="font-semibold text-red-500 dark:text-red-400">{t.hero.h2_prefix}</span><br/>
                            {language === 'en' ? (
                              <>Try the <span className="font-semibold text-green-500 dark:text-green-400">{t.hero.h2_highlight}</span> backed by clinical evidence.</>
                            ) : (
                              <>试试科学评分 <span className="font-semibold text-green-500 dark:text-green-400">{t.hero.h2_highlight}</span> 的方法。</>
                            )}
                        </p>

                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            {t.hero.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button 
                                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition animate-pulse-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                onClick={() => handleToolClick('pain-tracker')}
                            >
                                {t.hero.cta_primary}
                            </button>
                            <button 
                              className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-full font-semibold text-lg hover:border-purple-600 dark:hover:border-purple-400 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              onClick={() => trackEvent('hero_secondary_click', { action: 'view_evidence' })}
                            >
                                {t.hero.cta_secondary}
                            </button>
                        </div>

                        {/* No Credit Card Notice */}
                        {t.hero.no_credit_card && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {t.hero.no_credit_card}
                            </p>
                        )}

                        {/* Trust Indicators */}
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            {t.hero.trust.map((trustItem, idx) => (
                                <span key={idx} className="flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" aria-hidden="true" />
                                    {trustItem}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Hero Visual - Clinical Effectiveness Scores */}
                    <div className="flex justify-center lg:justify-end relative">
                        <ClinicalEffectivenessScores language={language} />
                    </div>
                </div>
            </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-12 bg-white/50 dark:bg-slate-800/50 border-y border-purple-100 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {translatedStats.map((stat, idx) => (
                        <div key={idx} className="text-center group cursor-default">
                            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* TOOLS SECTION (P1 Functionality) */}
        <section id="tools" className="py-20 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">{t.sections.tools_title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.sections.tools_desc}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {translatedTools.map((tool) => (
                        <div 
                            key={tool.id}
                            className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-transparent hover:border-purple-100 dark:hover:border-purple-900 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500"
                            tabIndex={0}
                            role="button"
                            aria-label={`${tool.title} - ${tool.description}`}
                            onClick={() => handleToolClick(tool.id)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToolClick(tool.id) }}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-4xl bg-purple-50 dark:bg-slate-700 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:rotate-6 transition-transform" aria-hidden="true">
                                    <span role="img" aria-label={tool.title + " icon"}>{tool.icon}</span>
                                </div>
                                {tool.badge && (
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${
                                        tool.badge === 'PRO' ? 'bg-purple-600' : 
                                        tool.badge === 'NEW' ? 'bg-green-500' : 'bg-pink-500'
                                    }`}>
                                        {tool.badge}
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{tool.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{tool.description}</p>
                            
                            <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                                {t.sections.start_tool} <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <a 
                      href="#all-tools" 
                      className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1"
                      title="View all available tools"
                      onClick={() => trackEvent('view_all_tools_click')}
                    >
                        {t.sections.view_all} <ArrowRight size={16} className="ml-1" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>

        {/* SCENARIO SOLUTIONS (P0/P1 Requirement) */}
        <section id="scenarios" className="py-20 bg-gradient-to-b from-purple-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">{t.sections.scenarios_title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t.sections.scenarios_desc}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {translatedScenarios.filter(s => s.type === 'zone').map(scenario => (
                        <div 
                            key={scenario.id} 
                            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                            tabIndex={0}
                            role="link"
                            onClick={() => trackEvent('scenario_zone_click', { zone_id: scenario.id })}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') trackEvent('scenario_zone_click', { zone_id: scenario.id }) }}
                        >
                            <div className="text-5xl sm:text-6xl bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-4" aria-hidden="true">
                                <span role="img" aria-label={scenario.title}>{scenario.icon}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold dark:text-white">{scenario.title}</h3>
                                    {scenario.badge && (
                                        <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {scenario.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">{scenario.description}</p>
                                <span className="text-pink-500 dark:text-pink-400 font-bold text-sm hover:underline">{t.sections.enter_zone} →</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {translatedScenarios.filter(s => s.type === 'card').map(scenario => (
                        <div 
                            key={scenario.id} 
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            tabIndex={0}
                            role="link"
                            onClick={() => trackEvent('scenario_card_click', { card_id: scenario.id })}
                        >
                            <div className="text-3xl mb-3" aria-hidden="true">
                                <span role="img" aria-label={scenario.title}>{scenario.icon}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{scenario.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{scenario.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* DOWNLOADS SECTION */}
        <section id="downloads" className="py-20 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">{t.sections.downloads_title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t.sections.downloads_desc}
                    </p>
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>Downloads section coming soon...</p>
                </div>
            </div>
        </section>

        {/* PRIVACY SECTION - 详细版 */}
        <section id="privacy" className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 dark:text-white">
                {t.privacy.title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t.privacy.subtitle}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* 左侧：3个特性 */}
              <div className="space-y-6">
                {/* 100% Local Storage */}
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">
                      {t.privacy.features.local_storage.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.privacy.features.local_storage.description}
                    </p>
                  </div>
                </div>
                
                {/* HIPAA & CCPA Compliant */}
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">
                      {t.privacy.features.hipaa_compliant.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.privacy.features.hipaa_compliant.description}
                    </p>
                  </div>
                </div>
                
                {/* End-to-End Encryption */}
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">
                      {t.privacy.features.encryption.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.privacy.features.encryption.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 右侧：详细说明 */}
              <div className="glass dark:bg-slate-800 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6 dark:text-white">
                  {t.privacy.disclaimer.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t.privacy.disclaimer.paragraph1}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t.privacy.disclaimer.paragraph2}
                </p>
                
                <h4 className="font-semibold mb-3 dark:text-white">
                  {t.privacy.disclaimer.data_privacy_title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.privacy.disclaimer.data_privacy_text}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRIVACY NOTICE - 简化版（保留在底部作为快速提示） */}
        <section className="bg-slate-900 text-white py-8">
             <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                    <Shield size={16} aria-hidden="true" />
                    <span>{language === 'en' ? 'Your data is encrypted and stored locally' : '您的数据经过加密并存储在本地'}</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full" aria-hidden="true"></div>
                <div className="flex items-center gap-2">
                     <Info size={16} aria-hidden="true" />
                     <span>{language === 'en' ? 'We never share your personal information' : '我们从不共享您的个人信息'}</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full" aria-hidden="true"></div>
                <a 
                  href="#privacy" 
                  className="text-purple-400 hover:text-purple-300 underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                  title={language === 'en' ? 'Read our Privacy Policy' : '阅读我们的隐私政策'}
                >
                    {language === 'en' ? 'Privacy Policy' : '隐私政策'}
                </a>
             </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-gradient-to-b from-purple-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
              {t.cta.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t.cta.description}
            </p>
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-5 rounded-full font-semibold text-xl hover:shadow-2xl transform hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => handleToolClick('pain-tracker')}
            >
              {t.cta.button}
            </button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t.cta.note}
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-slate-800 py-12 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* 第1列：品牌 */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🌸</span>
                <span className="font-bold text-xl dark:text-white">PeriodHub</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.footer.tagline}
              </p>
            </div>
            
            {/* 第2列：Tools */}
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">{t.footer.columns.tools}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#tools" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.tools.symptom_checker}
                  </a>
                </li>
                <li>
                  <a href="#tools" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.tools.cycle_tracker}
                  </a>
                </li>
                <li>
                  <a href="#tools" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.tools.pain_diary}
                  </a>
                </li>
                <li>
                  <a href="#tools" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.tools.doctor_reports}
                  </a>
                </li>
              </ul>
            </div>
            
            {/* 第3列：Resources */}
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">{t.footer.columns.resources}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#downloads" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.resources.medical_guides}
                  </a>
                </li>
                <li>
                  <a href="#therapies" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.resources.natural_remedies}
                  </a>
                </li>
                <li>
                  <a href="#tools" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.resources.emergency_guide}
                  </a>
                </li>
                <li>
                  <a href="#downloads" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.resources.research_papers}
                  </a>
                </li>
              </ul>
            </div>
            
            {/* 第4列：Legal */}
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">{t.footer.columns.legal}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.legal.privacy_policy}
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.legal.hipaa_compliance}
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.legal.terms_of_service}
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    {t.footer.links.legal.medical_disclaimer}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>

      <LunaAI />
      
      {/* Modals */}
      <CycleSetupModal 
        isOpen={isCycleModalOpen} 
        onClose={() => setIsCycleModalOpen(false)}
        onSave={handleCycleSetupSave}
      />

      <PainTrackerModal
        isOpen={isPainModalOpen}
        onClose={() => setIsPainModalOpen(false)}
      />
    </div>
  );
}

export default App;
