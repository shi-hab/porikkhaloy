import { ArrowDown, Star, Globe } from 'lucide-react';

function PlayIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M3.6 2.6 14 12 3.6 21.4c-.4-.2-.6-.6-.6-1.1V3.7c0-.5.2-.9.6-1.1z" fill="#5B7BFF" />
            <path d="M14 12 3.6 2.6c.15-.08.3-.12.47-.12.2 0 .4.06.58.17l11.1 6.4L14 12z" fill="#4CD07A" />
            <path d="M14 12l1.75 2.95-11.1 6.4c-.25.15-.53.2-.8.15L14 12z" fill="#FF5B5B" />
            <path d="M15.75 9.05 19.4 11.2c.6.35.6 1.25 0 1.6l-3.65 2.15L14 12l1.75-2.95z" fill="#FFC24C" />
        </svg>
    );
}

function AppDownloadSection() {
    return (
        <section className="relative py-6 sm:py-7 bg-[#140d35] font-siliguri overflow-hidden">

            {/* subtle top/bottom hairlines instead of a boxed card */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

            {/* faint dotted texture, consistent with the rest of the page */}
            <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(165,180,252,0.8) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10
                flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6"
            >

                {/* Left: message */}
                <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
                    <span className="hidden sm:flex items-center justify-center
                        w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/30 shrink-0"
                    >
                        <ArrowDown className="w-5 h-5 text-indigo-300" />
                    </span>

                    <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white leading-snug">
                            ডাউনলোড করো পরীক্ষালয় অ্যাপ
                        </h2>
                        <div className="mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-white">4.8</span>
                            <span className="text-xs text-slate-400">প্লে স্টোর রেটিং</span>
                        </div>
                    </div>
                </div>

                {/* Right: store badges */}
                <div className="flex items-center gap-3">

                    <a
                        href="https://porikkhaloy.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl
                            bg-white/[0.06] border border-white/15
                            hover:bg-white/[0.1] hover:border-white/25
                            transition-colors"
                    >
                        <Globe className="w-6 h-6 text-white shrink-0" />
                        <span className="text-left leading-none">
                            <span className="block text-[9px] text-slate-400">ভিজিট করো</span>
                            <span className="block text-sm font-bold text-white">porikkhaloy.com</span>
                        </span>
                    </a>

                    <a
                        href="https://play.google.com/store/apps/details?id=com.examapp.porikkhaloy&hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl
                            bg-white/[0.06] border border-white/15
                            hover:bg-white/[0.1] hover:border-white/25
                            transition-colors"
                    >
                        <PlayIcon className="w-6 h-6 shrink-0" />
                        <span className="text-left leading-none">
                            <span className="block text-[9px] text-slate-400">GET IT ON</span>
                            <span className="block text-sm font-bold text-white">Google Play</span>
                        </span>
                    </a>

                </div>
            </div>
        </section>
    );
}

export default AppDownloadSection;