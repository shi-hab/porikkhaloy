import { Star, Download, Award, Users } from 'lucide-react';
import { AppMockupScreen } from './AppMockupScreen';

function HeroSection() {
    return (
        <section className="relative pt-32 sm:pt-24 pb-20 sm:pb-28 overflow-hidden font-siliguri">
            {/* Background Glow Orbs */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#281e5d] rounded-full blur-[140px] opacity-60 pointer-events-none" />
            <div className="absolute top-10 right-0 w-[550px] h-[550px] bg-[#6366f1] rounded-full blur-[160px] opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* LEFT SIDE: Copy & CTAs */}
                    <div className="lg:col-span-7 flex flex-col items-center text-left">

                        <div className='flex flex-col justify-center items-center gap-8 mb-20'>
                            {/* Top Pill */}
                            <div className="inline-flex  items-center gap-2 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-6">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                                <span className="text-xs font-semibold text-indigo-300 tracking-wide">
                                    বাংলাদেশের নাম্বার ০১ এক্সাম প্রিপারেশন অ্যাপ
                                </span>
                            </div>

                            {/* Powerful Bengali Headline */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white ">
                                <p className='mb-3'>বহুনির্বাচনি বা সৃজনশীল</p>
                                <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#a855f7]">
                                    পরীক্ষা দাও পরীক্ষালয়ে,
                                </p>
                            </h1>
                        </div>



                        {/* App Credibility & Google Play Badge */}
                        <div className="pt-6 border-t border-white/10 w-full">
                            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 sm:gap-5">
                                {/* Rating */}
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-400/10">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg font-bold text-white font-sans-ui">
                                                4.8
                                            </span>
                                            <span className="text-[10px] text-amber-400 font-medium">
                                                ★
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-slate-400">
                                            প্লে স্টোর রেটিং
                                        </span>
                                    </div>
                                </div>

                                {/* Downloads */}
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10">
                                        <Download className="w-4 h-4 text-indigo-400" />
                                    </div>

                                    <div>
                                        <div className="text-lg font-bold text-white font-sans-ui">
                                            5K+
                                        </div>
                                        <span className="text-[11px] text-slate-400">
                                            অ্যাপ ডাউনলোড
                                        </span>
                                    </div>
                                </div>

                                {/* Students */}
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-500/10">
                                        <Users className="w-4 h-4 text-purple-400" />
                                    </div>

                                    <div>
                                        <div className="text-lg font-bold text-indigo-300 font-sans-ui">
                                            10K+
                                        </div>
                                        <span className="text-[11px] text-slate-400">
                                            শিক্ষার্থী প্র্যাকটিস করছে
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDE: Mobile App UI Mockup */}
                    <div className="lg:col-span-5 relative flex items-center justify-center">
                        {/* Ambient Background Glow */}
                        <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 rounded-full blur-[80px]" />

                        {/* App Mockup */}
                        <div className="relative z-10 w-full animate-float">
                            <AppMockupScreen type="hero" />

                            {/* Floating Badge 1: Accuracy */}
                            <div className="absolute -bottom-6 -left-4 sm:left-2 bg-[#120d2d]/90 backdrop-blur-xl border border-indigo-500/30 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-float-delayed z-20">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg font-sans-ui">
                                    90%
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-white block">গড় নির্ভুলতা</span>
                                    <span className="text-[10px] text-emerald-400 font-medium">ব্যক্তিগত অগ্রগতির ট্র্যাকার</span>
                                </div>
                            </div>

                            {/* Floating Badge 2: Top Ranker */}
                            <div className="absolute top-16 -right-4 bg-[#120d2d]/90 backdrop-blur-xl border border-purple-500/30 p-3 rounded-2xl shadow-2xl flex items-center gap-2.5 z-20">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                    <Award className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-white block">টপ ১% শিক্ষার্থী</span>
                                    <span className="text-[10px] text-slate-300">অল বাংলাদেশ র‍্যাঙ্কিং</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}

export default HeroSection