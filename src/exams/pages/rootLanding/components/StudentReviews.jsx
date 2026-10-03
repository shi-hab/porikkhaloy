import { useEffect, useState, useCallback } from 'react';
import { Star, Sparkles, Quote, CheckCircle2, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsRow1, testimonialsRow2 } from '../data/mockData';

/**
 * A review can be one of two shapes:
 *
 * 1) Screenshot review — just drop in the screenshot, nothing else needed:
 *    { id: "s1", screenshot: "/path/or/url.jpg" }
 *    Optionally add name/avatar/classBatch/institution/rating/comment on top
 *    and they'll show below the image — add only what you have.
 *
 * 2) Text review — no screenshot, just the fields, same as before:
 *    { id: "t1", name: "...", classBatch: "...", institution: "...",
 *      avatar: "...", rating: 5, comment: "..." }
 */
function ReviewCard({ review, accent = 'indigo', onImageClick }) {
    const hasScreenshot = Boolean(review.screenshot);
    const hasComment = Boolean(review.comment);
    const hasIdentity = Boolean(review.name || review.avatar || review.classBatch || review.institution);
    const hasRating = Boolean(review.rating);

    const accentClasses = accent === 'purple'
        ? {
            border: 'border-purple-500/20 hover:border-purple-400/50',
            text: 'text-purple-300',
            quote: 'text-purple-400/50',
            ring: 'group-hover:shadow-purple-500/10',
        }
        : {
            border: 'border-indigo-500/20 hover:border-indigo-400/50',
            text: 'text-indigo-300',
            quote: 'text-indigo-400/50',
            ring: 'group-hover:shadow-indigo-500/10',
        };

    // Screenshot cards: small on mobile, bigger on larger screens.
    // No forced aspect-ratio here — the image keeps its own natural
    // proportions (object-contain), so nothing gets stretched/cropped.
    const sizeClass = hasScreenshot
        ? 'w-[120px] sm:w-[230px] lg:w-[250px]'
        : 'w-[150px] sm:w-[320px]';

    return (
        <article
            className={`group shrink-0 ${sizeClass} overflow-hidden rounded-2xl border ${accentClasses.border}
                bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] backdrop-blur-xl
                shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out
                hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${accentClasses.ring}`}
        >
            {hasScreenshot && (
                <button
                    type="button"
                    onClick={() => onImageClick(review.screenshot)}
                    className="relative block w-full cursor-zoom-in overflow-hidden text-left bg-black/20"
                >
                    {/* Natural size/aspect ratio — image decides its own height */}
                    <img
                        src={review.screenshot}
                        alt={review.name || 'শিক্ষার্থীর রিভিউ'}
                        className="block w-full h-auto max-h-[320px] sm:max-h-[420px] object-contain
                            transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0
                        opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    
                </button>
            )}

            {(hasRating || hasComment || hasIdentity) && (
                <div className="p-3 sm:p-4.5">
                    {(hasRating || hasComment) && (
                        <div className="mb-2.5 sm:mb-3 flex items-center justify-between">
                            {hasRating ? (
                                <div className="flex items-center gap-0.5">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            ) : <span />}
                            {hasComment && (
                                <Quote className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${accentClasses.quote} transition-colors`} />
                            )}
                        </div>
                    )}

                    {hasComment && (
                        <p className="mb-3 sm:mb-4 text-[11px] sm:text-[13px] leading-[1.6] sm:leading-[1.7] text-slate-300
                            transition-colors group-hover:text-slate-100"
                        >
                            “{review.comment}”
                        </p>
                    )}

                    {hasIdentity && (
                        <div className="flex items-center gap-2.5 sm:gap-3 border-t border-white/[0.07] pt-2.5 sm:pt-3">
                            {review.avatar && (
                                <img
                                    src={review.avatar}
                                    alt={review.name || 'Student'}
                                    className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full border-2 border-white/10 object-cover"
                                    loading="lazy"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                {review.name && (
                                    <div className="flex items-center gap-1">
                                        <h4 className="truncate text-[11px] sm:text-sm font-bold text-white">
                                            {review.name}
                                        </h4>
                                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-emerald-400" />
                                    </div>
                                )}
                                {(review.classBatch || review.institution) && (
                                    <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
                                        <span className={`truncate text-[9px] sm:text-[10px] font-medium ${accentClasses.text}`}>
                                            {review.classBatch}
                                        </span>
                                        <span className="truncate text-right text-[9px] sm:text-[10px] text-slate-500">
                                            {review.institution}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}

/**
 * Auto-scrolling marquee row. The list is duplicated once so the CSS
 * animation (translateX 0 -> -50%) loops seamlessly. Hovering (desktop)
 * or touching (mobile) pauses the drift; releasing resumes it.
 * `forcePause` overrides everything — used to freeze the row while the
 * fullscreen image modal is open.
 */
function ReviewRow({ reviews, accent, direction, onImageClick, forcePause }) {
    const [hoverPaused, setHoverPaused] = useState(false);
    const isPaused = forcePause || hoverPaused;
    const animationClass = direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left';

    return (
        <div
            className="relative w-full overflow-hidden py-1.5"
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            onTouchStart={() => setHoverPaused(true)}
            onTouchEnd={() => setHoverPaused(false)}
        >
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-[#030014] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-[#030014] to-transparent z-20 pointer-events-none" />

            <div
                className={`flex w-max gap-3 sm:gap-5 ${animationClass}`}
                style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            >
                {[...reviews, ...reviews].map((review, idx) => (
                    <ReviewCard
                        key={`${accent}-${review.id}-${idx}`}
                        review={review}
                        accent={accent}
                        onImageClick={() => onImageClick(reviews, idx % reviews.length)}
                    />
                ))}
            </div>
        </div>
    );
}

/**
 * Fullscreen preview with Next / Previous navigation across the same
 * review row the clicked image belonged to. Supports keyboard arrows,
 * click-through nav buttons, and a soft crossfade + slide when switching.
 */
function ImagePreviewModal({ session, onClose, onNavigate }) {
    const { reviews, index } = session || {};
    const total = reviews?.length || 0;
    const current = reviews?.[index];

    const goNext = useCallback(() => {
        if (!total) return;
        onNavigate((index + 1) % total);
    }, [index, total, onNavigate]);

    const goPrev = useCallback(() => {
        if (!total) return;
        onNavigate((index - 1 + total) % total);
    }, [index, total, onNavigate]);

    useEffect(() => {
        if (!session) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowRight') goNext();
            if (event.key === 'ArrowLeft') goPrev();
        };
        document.addEventListener('keydown', handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [session, onClose, goNext, goPrev]);

    if (!session || !current) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 p-3 sm:p-8 backdrop-blur-md
                animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Close */}
            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[10000] flex h-10 w-10 items-center justify-center
                    rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl
                    transition-all duration-300 hover:rotate-90 hover:bg-white/20 cursor-pointer"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Counter */}
            {total > 1 && (
                <span className="fixed left-1/2 top-4 sm:top-6 -translate-x-1/2 z-[10000] rounded-full
                    border border-white/10 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xl"
                >
                    {index + 1} / {total}
                </span>
            )}

            {/* Previous */}
            {total > 1 && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    aria-label="Previous review"
                    className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[10000] flex h-10 w-10 sm:h-12 sm:w-12
                        items-center justify-center rounded-full border border-white/10 bg-white/10 text-white
                        backdrop-blur-xl transition-all duration-300 hover:bg-indigo-500/70 hover:scale-105
                        active:scale-95 cursor-pointer"
                >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
            )}

            {/* Next */}
            {total > 1 && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    aria-label="Next review"
                    className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[10000] flex h-10 w-10 sm:h-12 sm:w-12
                        items-center justify-center rounded-full border border-white/10 bg-white/10 text-white
                        backdrop-blur-xl transition-all duration-300 hover:bg-indigo-500/70 hover:scale-105
                        active:scale-95 cursor-pointer"
                >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
            )}

            <div
                className="relative flex max-h-[88vh] max-w-5xl items-center justify-center"
                onClick={(event) => event.stopPropagation()}
            >
                <img
                    key={current.screenshot}
                    src={current.screenshot}
                    alt={current.name || 'রিভিউ'}
                    className="max-h-[88vh] max-w-full rounded-2xl object-contain shadow-[0_30px_100px_rgba(0,0,0,0.65)]
                        animate-in fade-in zoom-in-95 duration-300"
                />
            </div>
        </div>
    );
}

function StudentReviews() {
    const [modalSession, setModalSession] = useState(null); // { reviews, index } or null

    const openModal = (reviews, index) => {
        setModalSession({ reviews, index });
    };

    const navigateModal = (nextIndex) => {
        setModalSession((prev) => (prev ? { ...prev, index: nextIndex } : prev));
    };

    const isModalOpen = Boolean(modalSession);

    return (
        <section
            id="student-reviews"
            className="relative overflow-hidden bg-[#030014] py-16 font-siliguri sm:py-20"
        >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[800px]
                -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[140px]"
            />
            <div className="pointer-events-none absolute -bottom-24 right-[8%] h-[280px] w-[280px]
                rounded-full bg-purple-600/10 blur-[120px]"
            />

            <div className="relative z-10 w-full">
                <div className="mx-auto mb-10 max-w-3xl px-4 text-center sm:mb-12 sm:px-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20
                        bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        শিক্ষার্থীদের অভিজ্ঞতা
                    </div>

                    <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                        যারা ব্যবহার করেছে,
                        <span className="ml-1.5 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            তারাই বলুক
                        </span>
                    </h2>

                    <p className="mx-auto max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">
                        হাজারো শিক্ষার্থী নিয়মিত পরীক্ষালয় ব্যবহার করে তাদের প্রস্তুতি আরও শক্তিশালী করছে।
                    </p>
                </div>

                <div className="mb-4 sm:mb-5">
                    <ReviewRow
                        reviews={testimonialsRow1}
                        accent="indigo"
                        direction="left"
                        onImageClick={openModal}
                        forcePause={isModalOpen}
                    />
                </div>

                <ReviewRow
                    reviews={testimonialsRow2}
                    accent="purple"
                    direction="right"
                    onImageClick={openModal}
                    forcePause={isModalOpen}
                />
            </div>

            <ImagePreviewModal
                session={modalSession}
                onClose={() => setModalSession(null)}
                onNavigate={navigateModal}
            />

            <style>{`
                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee-left {
                    animation: marquee-left 45s linear infinite;
                }
                .animate-marquee-right {
                    animation: marquee-right 45s linear infinite;
                }
                @media (max-width: 640px) {
                    .animate-marquee-left, .animate-marquee-right {
                        animation-duration: 30s;
                    }
                }
            `}</style>
        </section>
    );
}

export default StudentReviews;