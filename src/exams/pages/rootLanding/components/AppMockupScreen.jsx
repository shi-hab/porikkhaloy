const appScreenImages = {
  hero: "https://app.porikkhaloy.com/public/images/id_494_1788706319.webp",
  home_1: "https://app.porikkhaloy.com/public/images/id_494_1788706319.webp",
  home_2: "https://app.porikkhaloy.com/public/images/id_495_1788706501.webp",
  mock_test_1: "https://app.porikkhaloy.com/public/images/id_496_1788710964.webp",
  mock_test_2: "https://app.porikkhaloy.com/public/images/id_497_1788710966.webp",
  question_bank_1: "https://app.porikkhaloy.com/public/images/id_498_1788711736.webp",
  question_bank_2: "https://app.porikkhaloy.com/public/images/id_499_1788711746.webp",
  quiz_battle_1: "https://app.porikkhaloy.com/public/images/id_500_1788711830.webp",
  quiz_battle_2: "https://app.porikkhaloy.com/public/images/id_501_1788711831.webp",
  exam_batch_1: "https://app.porikkhaloy.com/public/images/id_502_1788711900.webp",
  exam_batch_2: "https://app.porikkhaloy.com/public/images/id_503_1788711909.webp",
  mcq_cq_written_exam_1: "https://app.porikkhaloy.com/public/images/id_504_1788711984.webp",
  mcq_cq_written_exam_2: "https://app.porikkhaloy.com/public/images/id_505_1788711989.webp",
  written_paper_check_1: "https://app.porikkhaloy.com/public/images/id_508_1788712540.webp",
  written_paper_check_2: "https://app.porikkhaloy.com/public/images/id_509_1788712572.webp",
  ranking_1: "https://app.porikkhaloy.com/public/images/id_506_1788712209.webp",
  ranking_2: "https://app.porikkhaloy.com/public/images/id_507_1788712214.webp",
  // personal_mentoring_1: "https://app.porikkhaloy.com/public/images/id_469_1786644274.webp",
  // personal_mentoring_2: "https://app.porikkhaloy.com/public/images/id_469_1786644274.webp",
};

export const AppMockupScreen = ({ type }) => {
  const imageUrl = appScreenImages[type];

  return (
    <div>
      {imageUrl ? (
        <div className="w-full max-w-[240px] sm:max-w-[260px] mx-auto aspect-[9/18.5] overflow-hidden rounded-[20px] sm:rounded-[28px]">
          <img
            src={imageUrl}
            alt={`পরীক্ষালয় ${type} app screen`}
            className="w-full h-full object-cover rounded-[20px] sm:rounded-[28px]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto aspect-[9/18.5] bg-[#0c091d] rounded-[42px] p-3 border-[7px] border-[#201948] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(99,102,241,0.25)] overflow-hidden select-none">
          {/* Top Notch / Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#140e32] rounded-b-xl z-30 flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 bg-black rounded-full border border-[#2a2254]" />
            <div className="w-10 h-1.5 bg-[#251d4c] rounded-full" />
          </div>

          {/* Screen */}
          <div className="w-full h-full bg-[#100c27] rounded-[34px] overflow-hidden relative border border-white/5">
            <div className="w-full h-full flex items-center justify-center px-6 text-center text-slate-400 font-siliguri">
              <div>
                <div className="text-sm font-bold text-slate-200 mb-2">
                  Real App UI Image
                </div>
                <p className="text-xs leading-relaxed">
                  appScreenImages.{type} এর মধ্যে তোমার screenshot-এর URL বসাও।
                </p>
              </div>
            </div>
            {/* Subtle screen overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.02] via-transparent to-black/[0.08]" />
          </div>
        </div>
      )}

    </div>
  );
};