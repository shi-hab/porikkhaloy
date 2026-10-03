import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function FinalCTA() {
    return (
        <section className="py-20 sm:py-24 bg-[#080517] relative font-siliguri overflow-hidden">

            {/* Background Glow */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#1c1448] via-[#281e5d] to-[#1a1144] p-8 sm:p-12 lg:p-16 shadow-[0_20px_80px_rgba(99,102,241,0.20)]">

                    {/* Decorative Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[90px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[90px] pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto text-center">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-indigo-500/15 text-indigo-300 text-xs sm:text-sm font-bold px-4 py-2 rounded-full mb-6 border border-indigo-500/25">
                            <Sparkles className="w-4 h-4 text-amber-400" />

                            <span>
                                আজ থেকেই শুরু করো
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
                            প্রস্তুতিটা হোক আরও স্মার্ট
                        </h2>

                        {/* Description */}
                        <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-300 mb-9 leading-relaxed">
                            নিয়মিত পরীক্ষা দাও, নিজের ভুলগুলো খুঁজে বের করো
                            এবং আরও ভালো প্রস্তুতি নিয়ে এগিয়ে যাও তোমার লক্ষ্যের দিকে।
                        </p>

                        {/* CTA */}
                        <div className="flex justify-center">

                            <Link
                                to="/register"
                                className="group inline-flex items-center justify-center gap-2 px-8 sm:px-9 py-3.5 sm:py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <span>এখনই শুরু করো</span>

                                <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                            </Link>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default FinalCTA;