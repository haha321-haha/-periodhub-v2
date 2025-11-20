import React from 'react';
import Navigation from './components/Navigation';
import LunaAI from './components/LunaAI';
import CycleViz from './components/CycleViz';
import { TOOLS, STATS, SCENARIOS } from './constants';
import { ArrowRight, Shield, CheckCircle, Heart, Info } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="skip-link absolute top-0 left-0 bg-purple-600 text-white p-3 -translate-y-full focus:translate-y-0 transition-transform z-50"
      >
        Skip to main content
      </a>

      <Navigation />
      
      <main id="main-content" className="pt-24">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pb-16 lg:pb-24">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Hero Content */}
                    <div className="space-y-8">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                            Scientific Management of <br/>
                            <span className="text-gradient">Period Pain</span>
                        </h1>
                        
                        {/* P0: H1 Optimization + Social Proof */}
                        <h2 className="text-xl sm:text-2xl text-gray-600 font-medium">
                            Free Tools for <span className="text-purple-600 font-bold">600K+ Women</span>
                        </h2>

                        {/* P1: Copy Optimization */}
                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                             Get instant period pain relief with free tools trusted by 600,000+ women. 
                             43 evidence-based guides + 8 interactive tools. Start tracking today!
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button 
                                className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-purple-500/30 hover:bg-purple-700 hover:-translate-y-1 transition-all flex items-center gap-2"
                                onClick={() => console.log('track_now_click')}
                            >
                                Get Free Tools <ArrowRight size={20} />
                            </button>
                            <button className="bg-white text-purple-600 border-2 border-purple-100 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all">
                                View 43 Guides
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Shield size={16} className="text-green-500" />
                                <span>Privacy Protected</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle size={16} className="text-green-500" />
                                <span>Evidence-based</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Heart size={16} className="text-green-500" />
                                <span>Personalized</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual - Cycle Viz */}
                    <div className="flex justify-center lg:justify-end relative">
                        <div className="glass p-8 rounded-full relative">
                            <CycleViz />
                            {/* Floating badge decorative */}
                            <div className="absolute -bottom-4 -left-4 glass px-4 py-2 rounded-xl shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                                <span className="text-xs font-bold text-purple-600">TRACKING LIVE 🔴</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-12 bg-white/50 border-y border-purple-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((stat, idx) => (
                        <div key={idx} className="text-center group cursor-default">
                            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* TOOLS SECTION (P1 Functionality) */}
        <section id="tools" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Tools</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Professional tools designed for your health journey, powered by data and medical expertise.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {TOOLS.map((tool) => (
                        <div 
                            key={tool.id}
                            className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-transparent hover:border-purple-100 relative overflow-hidden"
                            tabIndex={0}
                            role="button"
                            aria-label={`${tool.title} - ${tool.description}`}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-4xl bg-purple-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:rotate-6 transition-transform">
                                    {tool.icon}
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
                            
                            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">{tool.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
                            
                            <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                                Start Tool <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <a href="#all-tools" className="inline-flex items-center text-gray-500 hover:text-purple-600 font-medium transition-colors">
                        View all 8+ tools <ArrowRight size={16} className="ml-1" />
                    </a>
                </div>
            </div>
        </section>

        {/* SCENARIO SOLUTIONS (P0/P1 Requirement) */}
        <section id="scenarios" className="py-20 bg-gradient-to-b from-purple-50/50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Scenario Solutions</h2>
                    <p className="text-gray-600">Tailored support for every stage of life and situation.</p>
                </div>

                {/* Featured Zones */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {SCENARIOS.filter(s => s.type === 'zone').map(scenario => (
                        <div 
                            key={scenario.id} 
                            className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start cursor-pointer"
                        >
                            <div className="text-5xl sm:text-6xl bg-pink-50 rounded-2xl p-4">{scenario.icon}</div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold">{scenario.title}</h3>
                                    {scenario.badge && (
                                        <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {scenario.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-4">{scenario.description}</p>
                                <span className="text-pink-500 font-bold text-sm hover:underline">Enter Zone →</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scenario Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {SCENARIOS.filter(s => s.type === 'card').map(scenario => (
                        <div key={scenario.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100">
                            <div className="text-3xl mb-3">{scenario.icon}</div>
                            <h4 className="font-bold text-gray-900 mb-1">{scenario.title}</h4>
                            <p className="text-xs text-gray-500">{scenario.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* PRIVACY NOTICE (P1 Security) */}
        <section className="bg-slate-900 text-white py-8">
             <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span>Your data is encrypted and stored locally</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
                <div className="flex items-center gap-2">
                     <Info size={16} />
                     <span>We never share your personal information</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
                <a href="#privacy" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</a>
             </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2025 PeriodHub. All rights reserved.</p>
        </div>
      </footer>

      <LunaAI />
    </div>
  );
}

export default App;