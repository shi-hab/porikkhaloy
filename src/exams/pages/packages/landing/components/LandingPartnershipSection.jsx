import { useState } from "react";
import { Play } from "lucide-react";
import { videoSupporters } from "../../../rootLanding/data/mockData";
import LandingSectionHeading from "./LandingSectionHeading";

const YT_REGEX =
  /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

const getYoutubeId = (url) => (url ? url.match(YT_REGEX)?.[1] ?? null : null);

const getEmbedUrl = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url || "";
};

const withAutoplay = (url) => `${url}${url.includes("?") ? "&" : "?"}autoplay=1&rel=0`;

const getMediaInfo = (item) => {
  const videoUrl = item.youtubeUrl || item.videoUrl || "";
  const ytId = getYoutubeId(videoUrl);
  const thumb =
    item.thumbnail ||
    item.image ||
    item.imageUrl ||
    (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "");
  return { videoUrl, thumb };
};

const LandingPartnershipSection = () => {
  const [playingId, setPlayingId] = useState(null);
  const list = Array.isArray(videoSupporters) ? videoSupporters : [];

  if (!list.length) return null;

  const grid =
    list.length === 1
      ? "grid-cols-1"
      : list.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="video-section" className="font-siliguri">
      <LandingSectionHeading
        title="পরীক্ষালয় সম্পর্কে"
        subtitle="যাদের কাছ থেকে শুনলে ভরসা পাবে, তাদের কথা শোনো।"
      />

      <div className={`mt-6 grid gap-4 ${grid}`}>
        {list.map((item, index) => {
          const id = item.id ?? index;
          const { videoUrl, thumb } = getMediaInfo(item);
          const isPlaying = playingId === id && videoUrl;
          const caption = item.speakerName || item.title;

          return (
            <div
              key={id}
              className="group relative aspect-video overflow-hidden rounded-2xl bg-[#0C1B15] shadow-[0_18px_36px_-20px_rgba(12,27,21,0.6)]"
            >
              {isPlaying ? (
                <iframe
                  src={withAutoplay(getEmbedUrl(videoUrl))}
                  title={item.title || "Video"}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={thumb}
                    alt={caption || ""}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C1B15]/70 via-transparent to-transparent" />

                  {caption && (
                    <p className="pointer-events-none absolute bottom-3 left-4 right-20 truncate text-[13px] font-semibold text-white">
                      {caption}
                    </p>
                  )}

                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => setPlayingId(id)}
                      aria-label={`${caption || "ভিডিও"} চালু করুন`}
                      className="absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0B6E4F] shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingPartnershipSection;