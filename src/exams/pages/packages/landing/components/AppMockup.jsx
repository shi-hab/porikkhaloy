const appScreenImages = {
  home_1: "https://app.porikkhaloy.com/public/images/id_494_1788706319.webp",
  exam_batch_1: "https://app.porikkhaloy.com/public/images/id_502_1788711900.webp",
  exam_batch_2: "https://app.porikkhaloy.com/public/images/id_503_1788711909.webp",
  mcq_cq_written_exam_1: "https://app.porikkhaloy.com/public/images/id_504_1788711984.webp",
  mcq_cq_written_exam_2: "https://app.porikkhaloy.com/public/images/id_505_1788711989.webp",
  written_paper_check_1: "https://app.porikkhaloy.com/public/images/id_508_1788712540.webp",
  written_paper_check_2: "https://app.porikkhaloy.com/public/images/id_509_1788712572.webp",
  ranking_1: "https://app.porikkhaloy.com/public/images/id_506_1788712209.webp",
  ranking_2: "https://app.porikkhaloy.com/public/images/id_507_1788712214.webp",
};


export const AppMockup = ({ type }) => {
  const imageUrl = appScreenImages[type];

  if (imageUrl) {
    return (
      <div className="w-full aspect-[9/18.5]">
        <img
          src={imageUrl}
          alt={`পরীক্ষালয় ${type} app screen`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[9/18.5] bg-[#FAF8F2] font-siliguri select-none">
      {/* ruled-paper texture, consistent with the section background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 21px, #E7E1D2 21px, #E7E1D2 22px)",
        }}
      />
      <div className="absolute inset-0 left-6 w-px bg-[#D6362B]/50" />

      <div className="relative h-full flex items-center justify-center px-6 text-center">
        <div>
          <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#D6362B]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5l5 5L20 7"
                stroke="#D6362B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-sm font-bold text-[#14161F] mb-1.5">
            স্ক্রিনশট বসাও
          </div>
          <p className="text-[11px] leading-relaxed text-[#6F6A5C]">
            appScreenImages.{type} এর মধ্যে তোমার screenshot-এর URL বসাও
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppMockup;