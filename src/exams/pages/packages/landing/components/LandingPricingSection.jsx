import { getDiscountedPrice, formatTaka } from "./landingUtils";

const LandingPricingSection = ({ pkg, onSubscribe }) => {
  if (!pkg || pkg.is_subscribed) return null;

  const { original, final, hasDiscount, percentOff } = getDiscountedPrice(pkg);
  if (hasDiscount && percentOff >= 100) return null;

  return (
    <section id="pricing" className="mt-8 font-['Hind_Siliguri']">
      <div className="sticky bottom-3 rounded-2xl border border-[#E1E8E3] bg-white p-4 shadow-[0_4px_20px_rgba(18,36,29,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-[#12241D]">{formatTaka(final)}</span>
              {hasDiscount ? (
                <span className="text-sm text-[#5B6E64] line-through">{formatTaka(original)}</span>
              ) : null}
            </div>
            {hasDiscount ? (
              <span className="mt-0.5 inline-block rounded-full bg-[#C6790C]/10 px-2 py-0.5 text-[11px] font-medium text-[#8A5709]">
                {percentOff}% ছাড়ে
              </span>
            ) : null}
          </div>

          <button
            onClick={() => onSubscribe?.(pkg)}
            className="rounded-full bg-[#0B6E4F] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#054A35]"
          >
            সাবস্ক্রাইব করো
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingPricingSection;