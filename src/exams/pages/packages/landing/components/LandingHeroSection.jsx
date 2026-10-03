import { parseHtmlContent } from "@/utils/parseHtmlContent";


const LandingHeroSection = ({ pkg }) => {

  if (!pkg) return null;

  const {
    hero_title,name, img
  } = pkg;


  const displayTitle = hero_title || parseHtmlContent(name);


  return (
    <>
      <section className="relative overflow-hidden rounded-2xl mb-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900" />

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

        {/* Package image (right side on md+) */}
        {img && (
          <div className="absolute right-0 top-0 h-full w-2/5 hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-transparent z-10" />
            <img
              src={img}
              alt={displayTitle}
              className="w-full h-full object-cover opacity-40"
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 px-6 py-8 md:py-12 md:w-3/5">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white ">
            {displayTitle}
          </h1>
        </div>
      </section>
    </>
  );
};

export default LandingHeroSection;
