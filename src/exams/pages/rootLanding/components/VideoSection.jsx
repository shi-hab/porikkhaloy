import { useState } from 'react';
import { Play, X, Sparkles, Quote, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { videoSupporters } from '../data/mockData';

// Helper to convert standard YouTube watch URLs to embed URLs
const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
        return url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    }
    if (url.includes('youtu.be/')) {
        return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
};

function VideoSection() {
    const [activeModal, setActiveModal] = useState(null); // { type: 'video' | 'image', url, title, speakerName }

    const mediaList = Array.isArray(videoSupporters) ? videoSupporters : [];

    if (mediaList.length === 0) return null;

    const handleMediaClick = (item) => {
        const isVideo = item.type === 'video' || Boolean(item.youtubeUrl || item.videoUrl);
        const mediaSource = item.thumbnail || item.image || item.imageUrl;

        if (isVideo) {
            setActiveModal({
                type: 'video',
                url: getEmbedUrl(item.youtubeUrl || item.videoUrl),
                title: item.title,
                speakerName: item.speakerName,
            });
        } else {
            setActiveModal({
                type: 'image',
                url: mediaSource,
                title: item.title,
                speakerName: item.speakerName,
                designation: item.designation,
            });
        }
    };

    return (
        <section
            id="video-section"
            className="min-h-screen sm:min-h-[100dvh] flex flex-col justify-center items-center py-6 sm:py-10 bg-[#030014] relative font-siliguri overflow-hidden"
        >
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[850px] h-[300px] lg:h-[450px] bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-indigo-600/15 rounded-full blur-[140px]" />
            <div className="pointer-events-none absolute -bottom-20 left-[5%] w-[320px] h-[320px] bg-[#281e5d]/25 rounded-full blur-[120px]" />

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">

                {/* Section Header (Compact & Crisp) */}
                <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full mb-2.5 shadow-[0_0_15px_rgba(99,102,241,0.12)]">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>শুভাকাঙ্ক্ষীদের মতামত ও রিভিউ</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight mb-2">
                        পরীক্ষালয় নিয়ে মতামত ও রিভিউ
                    </h2>
                </div>

                {/* 3-Column Responsive Grid (Displays in 1 row on md/lg screens) */}
                <div className="flex flex-wrap justify-center gap-4 lg:gap-6 w-full">
                    {mediaList.slice(0, 3).map((item) => {
                        const isVideo = item.type === 'video' || Boolean(item.youtubeUrl || item.videoUrl);
                        const mediaSource = item.thumbnail || item.image || item.imageUrl;

                        return (
                            <div
                                key={item.id}
                                className="group w-full max-w-[380px] sm:w-[320px] md:w-[340px] lg:w-[360px] shrink-0 bg-gradient-to-b from-[#110c2e]/90 via-[#0e0926]/90 to-[#070417]/95 border border-indigo-500/20 hover:border-indigo-500/45 rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_18px_40px_rgba(99,102,241,0.15)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 backdrop-blur-xl"
                            >
                                {/* Media Thumbnail Container */}
                                <div
                                    onClick={() => handleMediaClick(item)}
                                    className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer bg-black/40 group/thumb"
                                >
                                    <img
                                        src={mediaSource}
                                        alt={item.speakerName || item.title}
                                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-90 group-hover/thumb:opacity-100"
                                    />

                                    {/* Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#070417] via-black/20 to-transparent" />
                                    <div className="absolute inset-0 bg-indigo-950/20 group-hover/thumb:bg-transparent transition-colors duration-300" />

                                    {/* Center Overlay Button (Play for Video / Zoom for Image) */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {isVideo && (
                                            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-tr from-[#6366f1] to-[#a855f7] rounded-full flex items-center justify-center text-white shadow-[0_0_25px_rgba(99,102,241,0.7)] group-hover/thumb:scale-110 group-hover/thumb:shadow-[0_0_35px_rgba(168,85,247,0.9)] transition-all duration-300">
                                                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white ml-0.5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Duration Badge for Videos */}
                                    {isVideo && item.duration && (
                                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
                                            {item.duration}
                                        </div>
                                    )}

                                    {/* Type Tag (Top-Left) */}
                                    <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-black/65 backdrop-blur-md text-indigo-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                                        {isVideo ? (
                                            <>
                                                <Play className="w-2.5 h-2.5 fill-indigo-400 text-indigo-400" />
                                                <span>ভিডিও</span>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-2.5 h-2.5 text-indigo-400" />
                                                <span>ছবি</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                                    <div className="mb-3">
                                        <h3
                                            onClick={() => handleMediaClick(item)}
                                            className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-200 transition-colors cursor-pointer"
                                        >
                                            “{item.title}”
                                        </h3>
                                    </div>

                                    {/* Speaker Profile Footer */}
                                    <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0">
                                                {item.speakerName ? item.speakerName.charAt(0) : 'প'}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-slate-100 truncate leading-tight">
                                                    {item.speakerName}
                                                </h4>
                                                <p className="text-[10px] text-indigo-300/80 truncate mt-0.5 leading-tight">
                                                    {item.designation}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleMediaClick(item)}
                                            aria-label="View media"
                                            className="p-1.5 bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500/40 rounded-lg text-indigo-300 hover:text-white transition-all shrink-0 cursor-pointer"
                                        >
                                            {isVideo ? <Play className="w-3.5 h-3.5 fill-indigo-300 ml-0.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>

            {/* MODAL POPUP: Supports Video Player & Image Lightbox */}
            {activeModal && (
                <div
                    onClick={() => setActiveModal(null)}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-[#0c091f] border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.3)] animate-in zoom-in-95 duration-200"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/10 bg-[#120d2d]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs sm:text-sm font-bold text-slate-200">
                                    {activeModal.speakerName ? `${activeModal.speakerName} — ` : ''}
                                    {activeModal.type === 'video' ? 'ভিডিও বক্তব্য' : 'ছবি রিভিউ'}
                                </span>
                            </div>
                            <button
                                onClick={() => setActiveModal(null)}
                                aria-label="Close modal"
                                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        {/* Modal Content: VIDEO vs IMAGE */}
                        {activeModal.type === 'video' ? (
                            <div className="aspect-video w-full bg-black">
                                <iframe
                                    src={`${activeModal.url}?autoplay=1`}
                                    title={activeModal.title || 'Video'}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="w-full max-h-[75vh] bg-black flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
                                <img
                                    src={activeModal.url}
                                    alt={activeModal.title || 'Image Preview'}
                                    className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                                />
                                {activeModal.title && (
                                    <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-2.5 text-center px-4">
                                        {activeModal.title}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default VideoSection;


