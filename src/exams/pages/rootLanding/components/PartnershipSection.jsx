import { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { partnershipGallery } from '../data/mockData';

function PartnershipSection() {
    const DIULogo = "https://app.porikkhaloy.com/public/images/id_433_1782277295.png";
    const IICLogo = "https://app.porikkhaloy.com/public/images/id_434_1782277353.jpg";
    const PorikkhaloyLogo = "https://app.porikkhaloy.com/public/images/id_432_1782277125.png";

    const [lightboxIndex, setLightboxIndex] = useState(null); // number or null

    const gallery = Array.isArray(partnershipGallery) ? partnershipGallery : [];

    const openLightbox = (index) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
    };

    return (
        <section
            id="partnership-section"
            className="min-h-screen sm:min-h-[100dvh] flex flex-col justify-center items-center py-6 sm:py-8 bg-[#030014] relative font-siliguri overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[850px] h-[350px] lg:h-[450px] bg-gradient-to-r from-indigo-600/15 via-[#281e5d]/30 to-purple-600/15 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-gradient-to-br from-[#0e0926]/90 via-[#120c32]/90 to-[#0a071c]/95 border border-indigo-500/25 hover:border-indigo-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-start">

                        {/* LEFT COLUMN: Partnership Story & Official Logos */}
                        <div className="lg:col-span-7">

                            {/* Logos Bar (Porikkhaloy ✕ DIU ✕ IIC) — top */}
                            <div className="flex flex-nowrap justify-center items-center gap-1 sm:gap-3 text-xs font-bold text-slate-300 mb-6 sm:mb-20 mt-1 sm:mt-6 w-full px-1">
                                {/* Porikkhaloy Logo */}
                                <div className="flex items-center justify-center bg-white hover:bg-white/90 border border-white/20 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-sm transition-all hover:scale-105 shrink-0">
                                    <img
                                        src={PorikkhaloyLogo}
                                        alt="Porikkhaloy Logo"
                                        className="h-5 sm:h-9 w-auto object-contain"
                                    />
                                </div>

                                <span className="text-indigo-400 font-bold text-xs sm:text-sm shrink-0">
                                    ✕
                                </span>

                                {/* DIU + IIC Combined Logo Badge */}
                                <div className="flex items-center bg-white hover:bg-white/90 border border-white/20 rounded-md shadow-sm transition-all hover:scale-105 overflow-hidden shrink-0">
                                    <div className="px-1.5 sm:px-3 py-1 sm:py-1.5">
                                        <img
                                            src={DIULogo}
                                            alt="Daffodil International University Logo"
                                            className="h-5 sm:h-9 w-auto object-contain"
                                        />
                                    </div>

                                    <div className="w-px h-4 sm:h-8 bg-gray-200/80 shrink-0" />

                                    <div className="px-1.5 sm:px-3 py-1 sm:py-1.5">
                                        <img
                                            src={IICLogo}
                                            alt="Innovation and Incubation Center Logo"
                                            className="h-5 sm:h-9 w-auto object-contain"
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Heading — middle */}
                            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-snug sm:leading-tight mb-2.5 sm:mb-4 text-center px-1">
                                শিক্ষার পথচলায় আমাদের সঙ্গে <br />
                                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                                    Daffodil International University
                                </span> & {" "}
                                <span className="text-purple-300">
                                    IIC
                                </span>
                            </h2>

                            {/* Description — bottom */}
                            <p className="text-xs sm:text-sm lg:text-base text-slate-300/90 leading-relaxed text-center px-1">
                                শিক্ষার্থীদের জন্য আরও কার্যকর ও প্রযুক্তিনির্ভর শিক্ষার পরিবেশ তৈরির লক্ষ্যেই পরীক্ষালয়ের সঙ্গে Daffodil International University ও Industrial Innovation Centre (IIC)-এর এই সহযোগিতামূলক পথচলা।
                            </p>
                        </div>

                        {/* RIGHT COLUMN: Interactive Photo Gallery (Mosaic & Click to Preview) */}
                        <div className="lg:col-span-5 relative flex flex-col gap-2 sm:gap-2.5">

                            {/* Main Featured Photo */}
                            {gallery[0] && (
                                <div
                                    onClick={() => openLightbox(0)}
                                    className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-indigo-500/30 shadow-xl group cursor-pointer bg-black/40"
                                >
                                    <img
                                        src={gallery[0].url}
                                        alt={gallery[0].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a071c] via-black/20 to-transparent" />

                                    {/* Zoom Hint */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                                        <div className="flex items-center gap-1.5 bg-indigo-600/90 text-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                                            <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            <span>বড় করে দেখুন</span>
                                        </div>
                                    </div>

                                    {/* Caption overlay */}
                                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 bg-[#0c091f]/90 backdrop-blur-md p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/10 text-left">
                                        <span className="font-bold text-white text-[11px] sm:text-xs block leading-tight truncate">
                                            {gallery[0].title}
                                        </span>
                                        <span className="text-slate-400 text-[9px] sm:text-[10px] block mt-0.5 truncate">
                                            {gallery[0].subtitle}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Secondary Gallery Thumbnails (Clickable) */}
                            {gallery.length > 1 && (
                                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                                    {gallery.slice(1, 3).map((item, idx) => (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => openLightbox(idx + 1)}
                                            className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden border border-white/10 hover:border-indigo-500/40 shadow-md group cursor-pointer bg-black/40"
                                        >
                                            <img
                                                src={item.url}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a071c]/90 via-transparent to-transparent" />

                                            {/* Hover Zoom Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                                                <div className="p-1.5 bg-indigo-600/90 text-white rounded-full shadow">
                                                    <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                </div>
                                            </div>

                                            <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:left-2 sm:right-2 truncate">
                                                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-200 block truncate">
                                                    {item.title}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>

            {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
            {lightboxIndex !== null && gallery[lightboxIndex] && (
                <div
                    onClick={closeLightbox}
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c091f] border border-indigo-500/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.3)] animate-in zoom-in-95 duration-200 flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between gap-2 p-2.5 sm:p-4 border-b border-white/10 bg-[#120d2d] shrink-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                <span className="text-[11px] sm:text-sm font-bold text-slate-200 truncate">
                                    {gallery[lightboxIndex].title}
                                </span>
                                <span className="text-[10px] sm:text-[11px] text-indigo-300 bg-white/10 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                                    {lightboxIndex + 1} / {gallery.length}
                                </span>
                            </div>

                            <button
                                onClick={closeLightbox}
                                aria-label="Close modal"
                                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        {/* Modal Image Display */}
                        <div className="relative w-full flex-1 bg-black flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
                            <img
                                src={gallery[lightboxIndex].url}
                                alt={gallery[lightboxIndex].title}
                                className="max-h-[55vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-lg sm:rounded-xl shadow-2xl"
                            />

                            {/* Subtitle */}
                            {gallery[lightboxIndex].subtitle && (
                                <p className="text-[11px] sm:text-sm font-semibold text-slate-300 mt-2 sm:mt-2.5 text-center px-6 sm:px-4">
                                    {gallery[lightboxIndex].subtitle}
                                </p>
                            )}

                            {/* Left Navigation Arrow */}
                            {gallery.length > 1 && (
                                <button
                                    onClick={prevImage}
                                    aria-label="Previous image"
                                    className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-indigo-600/80 text-white border border-white/10 transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}

                            {/* Right Navigation Arrow */}
                            {gallery.length > 1 && (
                                <button
                                    onClick={nextImage}
                                    aria-label="Next image"
                                    className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-indigo-600/80 text-white border border-white/10 transition-all cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default PartnershipSection;