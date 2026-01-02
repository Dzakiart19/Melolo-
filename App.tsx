
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, Moon, Sun, Home as HomeIcon, 
  TrendingUp, Sparkles, Heart, ChevronRight,
  Heart as RomanceIcon, Zap as ActionIcon, Smile as ComedyIcon, 
  Sparkle as FantasyIcon, Ghost as ThrillerIcon, Landmark as HistoryIcon
} from 'lucide-react';

import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Watch } from './pages/Watch';
import { Search as SearchPage } from './pages/Search';
import { ListPage } from './pages/ListPage';
import { Logo } from './components/Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    { name: 'Romance', icon: RomanceIcon },
    { name: 'Action', icon: ActionIcon },
    { name: 'Comedy', icon: ComedyIcon },
    { name: 'Fantasy', icon: FantasyIcon },
    { name: 'Thriller', icon: ThrillerIcon },
    { name: 'Historical', icon: HistoryIcon },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  const navItems = [
    { name: 'Beranda', path: '/', icon: HomeIcon },
    { name: 'Trending', path: '/trending', icon: TrendingUp },
    { name: 'Baru', path: '/new', icon: Sparkles },
    { name: 'Favorit', path: '/favorites', icon: Heart },
  ];

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${isScrolled ? 'glass border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="hover:scale-105 transition-transform"><Logo /></Link>

          <nav className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/search')} className="text-gray-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Modern Sidebar */}
      <div className={`fixed inset-0 z-[110] transition-all duration-700 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-surface shadow-2xl transition-transform duration-700 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-12 space-y-12">
            <div className="flex justify-between items-center">
              <Logo />
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Menu</p>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link key={item.name} to={item.path} className="flex items-center gap-4 py-3 text-xl font-bold text-white hover:text-primary transition-colors">
                      <item.icon className="w-5 h-5 opacity-50" /> {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Kategori</p>
                <div className="grid grid-cols-1 gap-1">
                  {categories.map((cat) => (
                    <Link key={cat.name} to={`/category/${cat.name}`} className="flex items-center justify-between py-3 group">
                      <div className="flex items-center gap-4">
                        <cat.icon className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                        <span className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">{cat.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-primary selection:text-white bg-dark">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drama/:id" element={<Detail />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/new" element={<ListPage />} />
            <Route path="/trending" element={<ListPage />} />
            <Route path="/favorites" element={<ListPage />} />
            <Route path="/category/:name" element={<ListPage />} />
          </Routes>
        </main>
        <footer className="py-20 border-t border-white/5 text-center space-y-4">
          <Logo />
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">© 2024 Melolo Streaming • Premium Experience</p>
        </footer>
      </div>
    </Router>
  );
}
