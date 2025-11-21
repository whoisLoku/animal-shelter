import React, { useState, useEffect, useRef } from 'react';
import { PawPrint, Globe, Menu, X, Filter, Heart, Search, ChevronDown, Check, CreditCard, Target, ShieldCheck, Stethoscope, ArrowRight, ArrowLeft, DollarSign, Send } from 'lucide-react';
import { ANIMALS, DICTIONARY } from './constants';
import { Language, Animal } from './types';
import { Button } from './components/Button';
import { AnimalCard } from './components/AnimalCard';
import { StatsSection } from './components/StatsSection';

// --- Form Component Types ---
interface AdoptFormProps {
  animal: Animal;
  onClose: () => void;
  lang: Language;
}

interface DonateFormProps {
  initialAmount?: string;
  onClose: () => void;
  lang: Language;
}

// --- Logic & Main App ---

function App() {
  const [lang, setLang] = useState<Language>('EN');
  const [activeCategory, setActiveCategory] = useState<'all' | 'dog' | 'cat'>('all');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  
  // Navigation State
  const [viewAllMode, setViewAllMode] = useState(false);
  
  // Modal/Form States
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const dict = DICTIONARY[lang];

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAnimals = activeCategory === 'all' 
    ? ANIMALS 
    : ANIMALS.filter(a => a.type === activeCategory);

  // Show only first 3 animals on homepage, all on viewAllMode
  const displayAnimals = viewAllMode ? filteredAnimals : filteredAnimals.slice(0, 3);

  const changeLang = (l: Language) => {
    setLang(l);
    setIsLangMenuOpen(false);
  };

  // Smooth scroll handler with offset for fixed header
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    // If we are in View All mode, go back to main view first
    if (viewAllMode) {
      setViewAllMode(false);
      // Wait for render then scroll
      setTimeout(() => scrollToId(id), 100);
    } else {
      scrollToId(id);
    }
    
    setIsMobileMenuOpen(false);
  };

  const scrollToId = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 100; // Adjust based on header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  const handleDonateClick = (amount?: string) => {
    if (amount) setDonationAmount(amount);
    setDonateModalOpen(true);
  };

  const handleAdoptClick = () => {
    // Close details modal if open, open adopt modal
    // We keep selectedAnimal to know who we are adopting
    setAdoptModalOpen(true);
  };

  // --- Form Components Internal ---

  const AdoptForm: React.FC<AdoptFormProps> = ({ animal, onClose, lang }) => {
    const [submitted, setSubmitted] = useState(false);
    const d = DICTIONARY[lang].forms;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate API call
      setTimeout(() => setSubmitted(true), 1000);
    };

    if (submitted) {
      return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-paw-900/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} />
              </div>
              <h3 className="font-display text-2xl font-bold text-paw-900 mb-2">{d.success_title}</h3>
              <p className="text-paw-600 mb-8">{d.success_message_adopt}</p>
              <Button onClick={() => { onClose(); setSelectedAnimal(null); setAdoptModalOpen(false); }}>{d.close}</Button>
           </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-paw-900/80 backdrop-blur-md animate-in fade-in duration-300">
         <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row overflow-hidden">
            
            {/* Image Sidebar */}
            <div className="hidden md:block w-1/3 relative">
               <img src={animal.image} alt={animal.name} className="h-full w-full object-cover" />
               <div className="absolute inset-0 bg-black/30"></div>
               <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm opacity-90">{d.adopt_subtitle}</p>
                  <h3 className="text-2xl font-display font-bold">{animal.name}</h3>
               </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 p-8 relative">
               <button 
                 onClick={onClose}
                 className="absolute top-4 right-4 p-2 bg-paw-50 text-paw-400 hover:text-paw-900 rounded-full hover:bg-paw-100 transition-colors"
               >
                 <X size={20} />
               </button>

               <h2 className="font-display text-2xl font-bold text-paw-900 mb-6 md:hidden">{d.adopt_title}: {animal.name}</h2>
               <h2 className="font-display text-2xl font-bold text-paw-900 mb-6 hidden md:block">{d.adopt_title}</h2>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-paw-700 mb-1">{d.name_label}</label>
                     <input required type="text" className="w-full px-4 py-3 rounded-xl bg-paw-50 border border-paw-100 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-paw-700 mb-1">{d.email_label}</label>
                       <input required type="email" className="w-full px-4 py-3 rounded-xl bg-paw-50 border border-paw-100 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 outline-none transition-all" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-paw-700 mb-1">{d.phone_label}</label>
                       <input required type="tel" className="w-full px-4 py-3 rounded-xl bg-paw-50 border border-paw-100 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-paw-700 mb-1">{d.message_label}</label>
                     <textarea required rows={3} className="w-full px-4 py-3 rounded-xl bg-paw-50 border border-paw-100 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 outline-none transition-all resize-none"></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full mt-2">
                    {d.submit_adopt} <Send size={16} className="ml-2" />
                  </Button>
               </form>
            </div>
         </div>
      </div>
    );
  };

  const DonateForm: React.FC<DonateFormProps> = ({ initialAmount, onClose, lang }) => {
    const [amount, setAmount] = useState(initialAmount || '');
    const [submitted, setSubmitted] = useState(false);
    const d = DICTIONARY[lang].forms;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTimeout(() => setSubmitted(true), 1500);
    };

    if (submitted) {
       return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-paw-900/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-accent-teal/20 text-accent-teal rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={40} fill="currentColor" />
              </div>
              <h3 className="font-display text-2xl font-bold text-paw-900 mb-2">{d.success_title}</h3>
              <p className="text-paw-600 mb-8">{d.success_message_donate}</p>
              <Button onClick={() => { onClose(); setDonateModalOpen(false); }}>{d.close}</Button>
           </div>
        </div>
       );
    }

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-paw-900/80 backdrop-blur-md animate-in fade-in duration-300">
         <div className="bg-white rounded-[2rem] max-w-lg w-full shadow-2xl relative p-8">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-paw-50 text-paw-400 hover:text-paw-900 rounded-full hover:bg-paw-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
               <div className="inline-block p-3 bg-accent-orange/10 rounded-full text-accent-orange mb-3">
                 <CreditCard size={32} />
               </div>
               <h2 className="font-display text-2xl font-bold text-paw-900">{d.donate_title}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                  <label className="block text-sm font-bold text-paw-700 mb-2">{d.amount_label}</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                     {['10', '50', '100'].map((val) => (
                        <button 
                          key={val}
                          type="button"
                          onClick={() => setAmount(lang === 'EN' ? `$${val}` : `${val}0₺`)} // Simple logic for demo
                          className={`py-2 rounded-xl font-bold border transition-all ${
                            amount.includes(val) 
                            ? 'bg-accent-orange text-white border-accent-orange' 
                            : 'bg-white text-paw-600 border-paw-200 hover:border-accent-orange'
                          }`}
                        >
                           {lang === 'EN' ? '$' : ''}{val}{lang === 'TR' ? '0₺' : ''}
                        </button>
                     ))}
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-paw-400">
                       <DollarSign size={16} />
                    </div>
                    <input 
                      type="text" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={DICTIONARY[lang].donate.custom_amount}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-paw-50 border border-paw-100 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 outline-none transition-all font-bold text-paw-900"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-paw-700 mb-1">{d.name_label}</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl bg-paw-50 border border-paw-100 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 outline-none transition-all" />
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-paw-700 mb-1">{d.card_label}</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl bg-paw-50 border border-paw-100 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 outline-none transition-all font-mono" />
               </div>

               <Button type="submit" className="w-full mt-2 text-lg">
                  {d.submit_donate}
               </Button>
            </form>
         </div>
      </div>
    );
  };

  // --- Main Layout Toggle ---
  
  if (viewAllMode) {
    return (
      <div className="min-h-screen bg-paw-50 font-sans text-paw-900">
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-3`}>
          <div className="container mx-auto px-4 flex items-center justify-between">
             <button onClick={() => setViewAllMode(false)} className="flex items-center gap-2 text-paw-600 hover:text-accent-orange font-bold transition-colors">
               <ArrowLeft size={20} /> {dict.nav.back_home}
             </button>
             <div className="font-display text-xl font-bold text-paw-900">LokLok Gallery</div>
             <div className="w-20"></div> {/* Spacer */}
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-24 pb-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
               <h1 className="font-display text-3xl font-bold">{dict.filters.view_all_btn}</h1>
               <div className="flex p-1 bg-white rounded-xl shadow-sm border border-paw-200">
                {(['all', 'dog', 'cat'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeCategory === cat 
                      ? 'bg-paw-800 text-white shadow-md' 
                      : 'text-paw-500 hover:text-paw-800 hover:bg-paw-50'
                    }`}
                  >
                    {cat === 'all' ? dict.filters.all : cat === 'dog' ? dict.filters.dogs : dict.filters.cats}
                  </button>
                ))}
             </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAnimals.map(animal => (
                 <AnimalCard 
                   key={animal.id} 
                   animal={animal} 
                   lang={lang} 
                   onClick={setSelectedAnimal} 
                 />
               ))}
            </div>
        </div>

        {/* Modal Logic for View All Page */}
        {selectedAnimal && !adoptModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-paw-900/80 backdrop-blur-md animate-in fade-in duration-300">
             <div className="bg-white rounded-[2.5rem] max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col lg:flex-row overflow-hidden relative group">
                
                <button 
                  onClick={() => setSelectedAnimal(null)}
                  className="absolute top-6 right-6 z-20 p-3 bg-white/20 hover:bg-white backdrop-blur-md rounded-full transition-all text-white hover:text-paw-900 shadow-lg"
                >
                  <X size={24} />
                </button>
  
                {/* Full Image Side */}
                <div className="w-full lg:w-1/2 h-80 lg:h-auto relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 opacity-80"></div>
                   <img 
                    src={selectedAnimal.image} 
                    alt={selectedAnimal.name} 
                    className="w-full h-full object-cover"
                   />
                   <div className="absolute bottom-8 left-8 z-20 text-white">
                      <h2 className="font-display text-5xl font-bold mb-2 drop-shadow-md">{selectedAnimal.name}</h2>
                      <p className="text-xl font-medium opacity-90 flex items-center gap-2">
                         <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/30 text-sm uppercase tracking-wide">{selectedAnimal.breed}</span>
                      </p>
                   </div>
                </div>
  
                {/* Content Side */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white">
                   <div className="flex gap-4 mb-8">
                      <div className="flex-1 p-4 bg-paw-50 rounded-2xl border border-paw-100 text-center hover:border-accent-orange/30 transition-colors">
                         <p className="text-xs text-paw-400 font-bold uppercase mb-1">{dict.details.age}</p>
                         <p className="font-display font-bold text-xl text-paw-800">{selectedAnimal.age}</p>
                      </div>
                      <div className="flex-1 p-4 bg-paw-50 rounded-2xl border border-paw-100 text-center hover:border-accent-teal/30 transition-colors">
                         <p className="text-xs text-paw-400 font-bold uppercase mb-1">{dict.details.gender}</p>
                         <p className="font-display font-bold text-xl text-paw-800">{selectedAnimal.gender}</p>
                      </div>
                      <div className="flex-1 p-4 bg-paw-50 rounded-2xl border border-paw-100 text-center hover:border-accent-rose/30 transition-colors">
                         <p className="text-xs text-paw-400 font-bold uppercase mb-1">{dict.details.size}</p>
                         <p className="font-display font-bold text-xl text-paw-800">{selectedAnimal.size}</p>
                      </div>
                   </div>
  
                   <div className="mb-8">
                      <h3 className="font-display text-xl font-bold text-paw-900 mb-4 flex items-center gap-2">
                         <PawPrint size={20} className="text-accent-orange" /> {dict.details.about}
                      </h3>
                      <p className="text-paw-600 leading-relaxed text-lg">
                         {lang === 'EN' ? selectedAnimal.description_en : selectedAnimal.description_tr}
                      </p>
                   </div>
  
                   <div className="flex flex-wrap gap-2 mb-8">
                      {(lang === 'EN' ? selectedAnimal.tags_en : selectedAnimal.tags_tr).map((tag, i) => (
                         <span key={i} className="px-4 py-2 rounded-full bg-paw-100 text-paw-800 text-sm font-bold">#{tag}</span>
                      ))}
                   </div>
  
                   <div className="mt-auto pt-6 border-t border-paw-100 flex gap-4">
                      <Button className="flex-1 text-lg py-4 shadow-xl shadow-accent-orange/20" onClick={handleAdoptClick} disabled={selectedAnimal.adopted}>
                        {selectedAnimal.adopted ? (lang === 'EN' ? 'Found a Home' : 'Yuva Buldu') : dict.details.adopt_me}
                      </Button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {adoptModalOpen && selectedAnimal && (
          <AdoptForm animal={selectedAnimal} onClose={() => setAdoptModalOpen(false)} lang={lang} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-paw-900 selection:bg-accent-orange selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent-orange cursor-pointer" onClick={(e) => handleNavClick(e as any, 'home')}>
            <div className="bg-accent-orange text-white p-2 rounded-xl">
              <PawPrint size={24} strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-paw-900">LokLok</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="font-bold text-paw-600 hover:text-accent-orange transition-colors" onClick={(e) => handleNavClick(e, 'home')}>{dict.nav.home}</a>
            <a href="#about" className="font-bold text-paw-600 hover:text-accent-orange transition-colors" onClick={(e) => handleNavClick(e, 'about')}>{dict.nav.about}</a>
            <a href="#pets" className="font-bold text-paw-600 hover:text-accent-orange transition-colors" onClick={(e) => handleNavClick(e, 'pets')}>{dict.nav.pets}</a>
            <a href="#donate" className="font-bold text-paw-600 hover:text-accent-orange transition-colors" onClick={(e) => handleNavClick(e, 'donate')}>{dict.nav.donate}</a>
            
            <div className="h-6 w-px bg-paw-300 mx-2"></div>
            
            {/* Language Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 font-bold text-paw-800 hover:text-accent-teal transition-colors px-3 py-2 rounded-lg hover:bg-paw-50"
              >
                <Globe size={18} />
                <span>{lang}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-paw-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => changeLang('EN')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between hover:bg-paw-50 ${lang === 'EN' ? 'text-accent-orange' : 'text-paw-600'}`}
                  >
                    English {lang === 'EN' && <Check size={16} />}
                  </button>
                  <button 
                    onClick={() => changeLang('TR')}
                    className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between hover:bg-paw-50 ${lang === 'TR' ? 'text-accent-orange' : 'text-paw-600'}`}
                  >
                    Türkçe {lang === 'TR' && <Check size={16} />}
                  </button>
                </div>
              )}
            </div>

            <Button size="sm" onClick={(e) => handleNavClick(e as any, 'pets')}>{dict.nav.adopt_btn}</Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-paw-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-paw-100 md:hidden flex flex-col p-4 gap-4 animate-in slide-in-from-top-2">
             <a href="#home" className="font-bold text-lg text-paw-800 px-4 py-2 hover:bg-paw-50 rounded-lg" onClick={(e) => handleNavClick(e, 'home')}>{dict.nav.home}</a>
             <a href="#about" className="font-bold text-lg text-paw-800 px-4 py-2 hover:bg-paw-50 rounded-lg" onClick={(e) => handleNavClick(e, 'about')}>{dict.nav.about}</a>
             <a href="#pets" className="font-bold text-lg text-paw-800 px-4 py-2 hover:bg-paw-50 rounded-lg" onClick={(e) => handleNavClick(e, 'pets')}>{dict.nav.pets}</a>
             <a href="#donate" className="font-bold text-lg text-paw-800 px-4 py-2 hover:bg-paw-50 rounded-lg" onClick={(e) => handleNavClick(e, 'donate')}>{dict.nav.donate}</a>
             
             <div className="border-t border-paw-100 pt-4 flex gap-4 justify-center">
                <button 
                  onClick={() => { changeLang('EN'); setIsMobileMenuOpen(false); }} 
                  className={`px-4 py-2 rounded-lg font-bold ${lang === 'EN' ? 'bg-accent-orange text-white' : 'bg-paw-50 text-paw-600'}`}
                >
                  English
                </button>
                <button 
                   onClick={() => { changeLang('TR'); setIsMobileMenuOpen(false); }}
                   className={`px-4 py-2 rounded-lg font-bold ${lang === 'TR' ? 'bg-accent-orange text-white' : 'bg-paw-50 text-paw-600'}`}
                >
                  Türkçe
                </button>
             </div>
             <Button className="w-full mt-2" onClick={(e) => handleNavClick(e as any, 'pets')}>{dict.nav.adopt_btn}</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           {/* Abstract Background Shapes */}
           <div className="absolute top-0 right-0 w-2/3 h-full bg-paw-100 rounded-l-[5rem] opacity-50 transform translate-x-1/4"></div>
           <div className="absolute bottom-0 left-10 w-64 h-64 bg-accent-yellow/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 space-y-8">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-paw-200">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-rose opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-rose"></span>
                  </span>
                  <span className="text-xs font-bold text-paw-600 tracking-wide uppercase">{lang === 'EN' ? 'Urgent: Foster Homes Needed' : 'Acil: Geçici Yuva Aranıyor'}</span>
               </div>
               
               <h1 className="font-display text-5xl lg:text-7xl font-bold text-paw-900 leading-[1.1]">
                 {dict.hero.title}
               </h1>
               
               <p className="text-xl text-paw-600 max-w-lg leading-relaxed">
                 {dict.hero.subtitle}
               </p>
               
               <div className="flex flex-wrap gap-4">
                 <Button size="lg" onClick={(e) => handleNavClick(e as any, 'pets')}>
                    {dict.hero.cta_primary}
                 </Button>
                 <Button size="lg" variant="outline" onClick={(e) => handleNavClick(e as any, 'donate')}>
                    {dict.hero.cta_secondary}
                 </Button>
               </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
               <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-accent-orange/20 transform rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer" onClick={() => setViewAllMode(true)}>
                 <img src="https://picsum.photos/id/1062/800/600" alt="Happy Dog" className="w-full h-auto object-cover" />
                 {/* Floating Badge */}
                 <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg flex items-center gap-4">
                    <div className="bg-accent-teal p-3 rounded-full text-white">
                       <Heart fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-paw-400 uppercase">Ready to love</p>
                      <p className="text-lg font-bold text-paw-900">120+ Pets</p>
                    </div>
                 </div>
               </div>
               {/* Decoration behind image */}
               <div className="absolute -inset-4 border-2 border-dashed border-paw-300 rounded-[3.5rem] -z-10 transform -rotate-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative">
               <div className="grid grid-cols-2 gap-4">
                  <img src="https://picsum.photos/id/454/400/500" alt="Shelter Life" className="rounded-3xl shadow-lg mt-8 hover:scale-105 transition-transform duration-500" />
                  <img src="https://picsum.photos/id/25/400/500" alt="Volunteers" className="rounded-3xl shadow-lg hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[80%] bg-accent-yellow/10 rounded-full blur-3xl"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="font-display text-4xl font-bold text-paw-900">{dict.about.title}</h2>
              <p className="text-paw-600 text-lg leading-relaxed">
                {dict.about.text}
              </p>
              <div className="grid gap-6 mt-4">
                <div className="flex items-start gap-4 p-4 bg-paw-50 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-full text-accent-orange shadow-sm">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-paw-900 mb-1">{dict.about.mission}</h3>
                    <p className="text-paw-600 text-sm">{dict.about.mission_text}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-paw-50 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-full text-accent-teal shadow-sm">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-paw-900 mb-1">{dict.about.vision}</h3>
                    <p className="text-paw-600 text-sm">{dict.about.vision_text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <StatsSection dict={dict} lang={lang} />

      {/* Filter & Grid Section (Our Pets) */}
      <section id="pets" className="py-24 bg-paw-50/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
             <div>
                <div className="inline-flex items-center gap-2 mb-2 text-accent-orange font-bold uppercase text-sm tracking-widest">
                  <span className="w-8 h-px bg-accent-orange"></span>
                  {dict.nav.pets}
                </div>
                <h2 className="font-display text-4xl font-bold text-paw-900 mb-4">{lang === 'EN' ? 'Find Your Soulmate' : 'Ruh Eşinizi Bulun'}</h2>
             </div>
             
             <div className="flex items-center gap-4">
                <button 
                   onClick={() => setViewAllMode(true)}
                   className="hidden md:flex items-center gap-2 font-bold text-accent-orange hover:text-accent-orange/80 transition-colors"
                >
                  {dict.filters.view_all_btn} <ArrowRight size={20} />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {displayAnimals.map(animal => (
               <AnimalCard 
                 key={animal.id} 
                 animal={animal} 
                 lang={lang} 
                 onClick={setSelectedAnimal} 
               />
             ))}
          </div>

          <div className="mt-12 text-center">
              <Button variant="secondary" onClick={() => setViewAllMode(true)} className="md:hidden w-full">
                 {dict.filters.view_all_btn}
              </Button>
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section id="donate" className="py-20 bg-paw-900 text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

         <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="font-display text-4xl font-bold mb-4">{dict.donate.title}</h2>
            <p className="text-paw-200 max-w-xl mx-auto mb-12 text-lg">{dict.donate.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {/* Card 1 */}
               <div 
                  className="bg-paw-800/50 backdrop-blur-sm border border-paw-700 p-8 rounded-3xl hover:bg-paw-800 transition-all group cursor-pointer hover:-translate-y-2"
                  onClick={() => handleDonateClick(dict.donate.card1_amount)}
               >
                  <div className="w-16 h-16 bg-paw-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-orange transition-colors">
                     <PawPrint size={32} />
                  </div>
                  <div className="text-3xl font-display font-bold text-white mb-2">{dict.donate.card1_amount}</div>
                  <h3 className="font-bold text-lg mb-2">{dict.donate.card1_title}</h3>
                  <p className="text-paw-300 text-sm">{dict.donate.card1_desc}</p>
               </div>
               {/* Card 2 */}
               <div 
                  className="bg-white text-paw-900 border border-white p-8 rounded-3xl transform md:-translate-y-4 shadow-xl cursor-pointer hover:-translate-y-6 transition-all"
                  onClick={() => handleDonateClick(dict.donate.card2_amount)}
               >
                  <div className="w-16 h-16 bg-accent-teal/10 text-accent-teal rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <Stethoscope size={32} />
                  </div>
                  <div className="text-3xl font-display font-bold text-accent-teal mb-2">{dict.donate.card2_amount}</div>
                  <h3 className="font-bold text-lg mb-2">{dict.donate.card2_title}</h3>
                  <p className="text-paw-600 text-sm">{dict.donate.card2_desc}</p>
               </div>
               {/* Card 3 */}
               <div 
                  className="bg-paw-800/50 backdrop-blur-sm border border-paw-700 p-8 rounded-3xl hover:bg-paw-800 transition-all group cursor-pointer hover:-translate-y-2"
                  onClick={() => handleDonateClick(dict.donate.card3_amount)}
               >
                  <div className="w-16 h-16 bg-paw-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-orange transition-colors">
                     <Heart size={32} />
                  </div>
                  <div className="text-3xl font-display font-bold text-white mb-2">{dict.donate.card3_amount}</div>
                  <h3 className="font-bold text-lg mb-2">{dict.donate.card3_title}</h3>
                  <p className="text-paw-300 text-sm">{dict.donate.card3_desc}</p>
               </div>
            </div>

            <Button variant="primary" size="lg" className="mt-12" onClick={() => handleDonateClick()}>
               <CreditCard className="mr-2" size={20} /> {dict.donate.btn}
            </Button>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-paw-100">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
               <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-accent-orange mb-6">
                    <PawPrint size={32} />
                    <span className="font-display text-2xl font-bold text-paw-900">LokLok</span>
                  </div>
                  <p className="text-paw-600 leading-relaxed max-w-sm">
                    Making the world a better place, one paw at a time. Join our mission to provide shelter, care, and love to animals in need.
                  </p>
               </div>
               <div>
                  <h4 className="text-paw-900 font-bold text-lg mb-6">Quick Links</h4>
                  <ul className="space-y-4">
                     <li><a href="#home" className="text-paw-600 hover:text-accent-orange transition-colors" onClick={(e) => handleNavClick(e, 'home')}>{dict.nav.home}</a></li>
                     <li><a href="#about" className="text-paw-600 hover:text-accent-orange transition-colors" onClick={(e) => handleNavClick(e, 'about')}>{dict.nav.about}</a></li>
                     <li><a href="#pets" className="text-paw-600 hover:text-accent-orange transition-colors" onClick={(e) => handleNavClick(e, 'pets')}>{dict.nav.pets}</a></li>
                     <li><a href="#donate" className="text-paw-600 hover:text-accent-orange transition-colors" onClick={(e) => handleNavClick(e, 'donate')}>{dict.nav.donate}</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-paw-900 font-bold text-lg mb-6">{dict.footer.contact}</h4>
                  <ul className="space-y-4 text-paw-600">
                     <li>hello@loklok.org</li>
                     <li>+1 (555) 123-4567</li>
                     <li>123 Puppy Lane, Animal City</li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-paw-100 mt-12 pt-8 text-center text-sm text-paw-500">
               &copy; 2024 LokLok Shelter. {dict.footer.rights}
            </div>
         </div>
      </footer>

      {/* Animal Details Modal */}
      {selectedAnimal && !adoptModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-paw-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col lg:flex-row overflow-hidden relative group">
              
              <button 
                onClick={() => setSelectedAnimal(null)}
                className="absolute top-6 right-6 z-20 p-3 bg-white/20 hover:bg-white backdrop-blur-md rounded-full transition-all text-white hover:text-paw-900 shadow-lg"
              >
                <X size={24} />
              </button>

              {/* Full Image Side */}
              <div className="w-full lg:w-1/2 h-80 lg:h-auto relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 opacity-80"></div>
                 <img 
                  src={selectedAnimal.image} 
                  alt={selectedAnimal.name} 
                  className="w-full h-full object-cover"
                 />
                 <div className="absolute bottom-8 left-8 z-20 text-white">
                    <h2 className="font-display text-5xl font-bold mb-2 drop-shadow-md">{selectedAnimal.name}</h2>
                    <p className="text-xl font-medium opacity-90 flex items-center gap-2">
                       <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/30 text-sm uppercase tracking-wide">{selectedAnimal.breed}</span>
                    </p>
                 </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white">
                 
                 <div className="flex gap-4 mb-8">
                    <div className="flex-1 p-4 bg-paw-50 rounded-2xl border border-paw-100 text-center hover:border-accent-orange/30 transition-colors">
                       <p className="text-xs text-paw-400 font-bold uppercase mb-1">{dict.details.age}</p>
                       <p className="font-display font-bold text-xl text-paw-800">{selectedAnimal.age}</p>
                    </div>
                    <div className="flex-1 p-4 bg-paw-50 rounded-2xl border border-paw-100 text-center hover:border-accent-teal/30 transition-colors">
                       <p className="text-xs text-paw-400 font-bold uppercase mb-1">{dict.details.gender}</p>
                       <p className="font-display font-bold text-xl text-paw-800">{selectedAnimal.gender}</p>
                    </div>
                    <div className="flex-1 p-4 bg-paw-50 rounded-2xl border border-paw-100 text-center hover:border-accent-rose/30 transition-colors">
                       <p className="text-xs text-paw-400 font-bold uppercase mb-1">{dict.details.size}</p>
                       <p className="font-display font-bold text-xl text-paw-800">{selectedAnimal.size}</p>
                    </div>
                 </div>

                 <div className="mb-8">
                    <h3 className="font-display text-xl font-bold text-paw-900 mb-4 flex items-center gap-2">
                       <PawPrint size={20} className="text-accent-orange" /> {dict.details.about}
                    </h3>
                    <p className="text-paw-600 leading-relaxed text-lg">
                       {lang === 'EN' ? selectedAnimal.description_en : selectedAnimal.description_tr}
                    </p>
                 </div>

                 <div className="mb-8 bg-accent-teal/5 rounded-2xl p-6 border border-accent-teal/10">
                    <h3 className="font-display font-bold text-paw-900 mb-2 flex items-center gap-2">
                       <Stethoscope size={18} className="text-accent-teal" /> {dict.details.health}
                    </h3>
                    <p className="text-paw-600 font-medium">
                       {dict.details.health_text}
                    </p>
                 </div>

                 <div className="flex flex-wrap gap-2 mb-8">
                    {(lang === 'EN' ? selectedAnimal.tags_en : selectedAnimal.tags_tr).map((tag, i) => (
                       <span key={i} className="px-4 py-2 rounded-full bg-paw-100 text-paw-800 text-sm font-bold">#{tag}</span>
                    ))}
                 </div>

                 <div className="mt-auto pt-6 border-t border-paw-100 flex gap-4">
                    <Button className="flex-1 text-lg py-4 shadow-xl shadow-accent-orange/20" onClick={handleAdoptClick} disabled={selectedAnimal.adopted}>
                      {selectedAnimal.adopted ? (lang === 'EN' ? 'Found a Home' : 'Yuva Buldu') : dict.details.adopt_me}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedAnimal(null)} className="px-8">
                      {dict.details.back}
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Adopt Form Modal */}
      {adoptModalOpen && selectedAnimal && (
        <AdoptForm animal={selectedAnimal} onClose={() => setAdoptModalOpen(false)} lang={lang} />
      )}

      {/* Donate Form Modal */}
      {donateModalOpen && (
        <DonateForm initialAmount={donationAmount} onClose={() => setDonateModalOpen(false)} lang={lang} />
      )}

    </div>
  );
}

export default App;