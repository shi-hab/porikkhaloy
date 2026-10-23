import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import LandingHeroSection from "./components/LandingHeroSection";
import LandingActionRow from "./components/LandingActionRow";
import LandingStatsBar from "./components/LandingStatsBar";
import LandingExamListSection from "./components/LandingExamListSection";
import LandingFaqSection from "./components/LandingFaqSection";
import LandingSkeleton from "./components/LandingSkeleton";
import LandingPartnershipSection from "./components/LandingPartnershipSection";
import LandingWhatsAppButton from "./components/LandingWhatsAppButton";
import UIShowFeatures from "./components/UIShowFeatures";
import { normalizeExam } from "./components/landingUtils";
import { SubscriptionCard } from "@/exams/components/molecules/packages/SubscriptionCard";

const WHATSAPP_NUMBER = "8801706429945";

const PackageLandingPage = ({ pkg, PackageIsLoading, ModelTestIsLoading, mtUnderPkg }) => {
  // bump to tell the routine section: scroll here + mark the free exams
  const [freeHighlightKey, setFreeHighlightKey] = useState(0);

  const hasFree = useMemo(() => {
    const raw = mtUnderPkg?.data;
    return Array.isArray(raw) && raw.some((e) => normalizeExam(e).isFree);
  }, [mtUnderPkg]);

  // GA4 view_item event
  useEffect(() => {
    if (!pkg) return;

    const discountedPrice =
      pkg.discount && pkg.discount_type === "percentage"
        ? pkg.price - pkg.price * (pkg.discount / 100)
        : pkg.discount && pkg.discount_type === "amount"
          ? pkg.price - pkg.discount
          : pkg.price;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: Number(discountedPrice),
        items: [
          {
            item_id: pkg.id,
            item_name: pkg.name,
            item_category: "Landing Page Visit",
            price: Number(discountedPrice),
            quantity: 1,
          },
        ],
      },
    });
  }, [pkg]);

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম। আমি ${pkg?.name || "এই কোর্সে"} সেন্ড মানি করে ভর্তি হতে চাই।`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const handleFreeClick = () => {
    if (!hasFree) toast.info("এই ব্যাচে এখন কোনো ফ্রি এক্সাম নেই। পুরো রুটিন দেখে নাও।");
    setFreeHighlightKey((k) => k + 1);
  };

  return (
    <div className="font-siliguri mx-auto w-full">
      {PackageIsLoading ? (
        <LandingSkeleton />
      ) : (
        <div className="flex flex-col gap-12 pb-4 sm:gap-16">
          <div>
            <LandingHeroSection pkg={pkg} />
            <div className="mt-4">
              <LandingActionRow pkg={pkg} onFreeClick={handleFreeClick} />
            </div>
          </div>

          <LandingStatsBar pkg={pkg} />

          <LandingExamListSection
            pkg={pkg}
            mtUnderPkg={mtUnderPkg}
            isLoading={ModelTestIsLoading}
            highlightKey={freeHighlightKey}
          />

          <UIShowFeatures />
          <LandingPartnershipSection />
          <LandingFaqSection />

          <SubscriptionCard singlePackage={pkg} />
          <LandingWhatsAppButton url={whatsappUrl} />
        </div>
      )}
    </div>
  );
};

export default PackageLandingPage;