import { useState } from "react";
import { Play } from "lucide-react";
import { videoSupporters } from "../../../rootLanding/data/mockData";

const YT_REGEX =
  /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

const getYoutubeId = (url) =>
  url ? url.match(YT_REGEX)?.[1] ?? null : null;

const getEmbedUrl = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url || "";
};

const withAutoplay = (url) =>
  `${url}${url.includes("?") ? "&" : "?"}autoplay=1&rel=0`;

const getMediaInfo = (item) => {
  const videoUrl = item.youtubeUrl || item.videoUrl || "";
  const ytId = getYoutubeId(videoUrl);

  const thumb =
    item.thumbnail ||
    item.image ||
    item.imageUrl ||
    (ytId
      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
      : "");

  return { videoUrl, thumb };
};

function LandingPartnershipSection() {
  const [playingId, setPlayingId] = useState(null);

  const mediaList = Array.isArray(videoSupporters)
    ? videoSupporters
    : [];

  if (!mediaList.length) return null;

  const gridCols =
    mediaList.length === 1
      ? "max-w-3xl grid-cols-1"
      : mediaList.length === 2
        ? "max-w-4xl grid-cols-1 sm:grid-cols-2"
        : "max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id="video-section"
      className=" font-siliguri "
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* =========================
            Section Heading
        ========================= */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          {/* Small Label */}
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-300" />

            <span className="text-xl font-semibold tracking-[0.18em] text-indigo-600 sm:text-2xl">
              পরীক্ষালয় সম্পর্কে
            </span>

            <span className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-300" />
          </div>
        </div>

        {/* =========================
            Video Grid
        ========================= */}
        <div
          className={`mx-auto grid gap-4 sm:gap-6 ${gridCols}`}
        >
          {mediaList.map((item, index) => {
            const id = item.id ?? index;

            const { videoUrl, thumb } =
              getMediaInfo(item);

            const isPlaying =
              playingId === id && videoUrl;

            return (
              <div
                key={id}
                className="group relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_16px_40px_rgba(79,70,229,0.12)]"
              >
                {isPlaying ? (
                  <iframe
                    src={withAutoplay(
                      getEmbedUrl(videoUrl)
                    )}
                    title={
                      item.title || "Video"
                    }
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={thumb}
                      alt={
                        item.speakerName ||
                        item.title ||
                        ""
                      }
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />

                    {/* Image Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />

                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPlayingId(id)
                        }
                        aria-label={`${item.speakerName || "ভিডিও"} চালু করুন`}
                        className="group absolute inset-0 flex items-center justify-center bg-slate-900/5 transition-colors duration-300 hover:bg-slate-900/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-indigo-600"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-700 sm:h-16 sm:w-16">
                          <Play className="ml-1 h-5 w-5 fill-current sm:h-6 sm:w-6" />
                        </span>
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingPartnershipSection;