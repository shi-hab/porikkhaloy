import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '@/exams/components/atoms/Logo';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-siliguri ${scrolled
                ? 'bg-[#030014]/80 backdrop-blur-xl border-b border-indigo-500/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-1'
                : 'bg-transparent py-1 sm:py-2'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    {/* LEFT: Logo */}
                    <div className="flex items-center cursor-pointer">
                        <Logo dark />
                    </div>

                    {/* RIGHT: Registration Button */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#a855f7] hover:from-[#5254e0] hover:to-[#9333ea] rounded-full sm:rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 group cursor-pointer"
                        >
                            <span>লগইন</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Navbar;



