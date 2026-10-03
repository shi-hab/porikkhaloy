import { useEffect } from "react";
import { MessageCircle } from "lucide-react";

import LandingHeroSection from "./components/LandingHeroSection";
import LandingStatsBar from "./components/LandingStatsBar";
import LandingFeaturesSection from "./components/LandingFeaturesSection";
import LandingRoutineSection from "./components/LandingRoutineSection";
import LandingExamListSection from "./components/LandingExamListSection";
import LandingFaqSection from "./components/LandingFaqSection";
import LandingSkeleton from "./components/LandingSkeleton";
import { SubscriptionCard } from "@/exams/components/molecules/packages/SubscriptionCard";
import LandingPartnershipSection from "./components/LandingPartnershipSection";
import UIShowFeatures from "./components/UIShowFeatures";

const PackageLandingPage = ({
  pkg,
  PackageIsLoading,
  ModelTestIsLoading,
  mtUnderPkg,
}) => {
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

  const whatsappNumber = "8801706429945";

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম। আমি ${pkg?.name || "এই কোর্সে"} সেন্ড মানি করে ভর্তি হতে চাই।`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="mx-auto w-full">
      {PackageIsLoading ? (
        <LandingSkeleton />
      ) : (
        <>
          {/* Hero — image, badge, title, CTA */}
          {/* <LandingHeroSection pkg={pkg} /> */}

          {/* Stats bar — student count, duration, tags */}
          <LandingStatsBar pkg={pkg} />

          {/* Routine PDF */}
          {/* <LandingRoutineSection pkg={pkg} /> */}

          {/* Full exam list pulled from the routine module */}
          <LandingExamListSection
            pkg={pkg}
            mtUnderPkg={mtUnderPkg}
            isLoading={ModelTestIsLoading}
          />

          {/* Course details / description collapsible */}
          <LandingFeaturesSection pkg={pkg} />

          {/* ui showing */}
          <UIShowFeatures/>
          
          {/* Partnership / Supporter Videos */}
          <LandingPartnershipSection />

          {/* FAQ */}
          <LandingFaqSection />


          {/* Pricing card */}
          <SubscriptionCard singlePackage={pkg} />

          {/* Floating WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp এ যোগাযোগ করুন"
            className="
              group fixed bottom-20 right-4 z-50
              flex h-12 w-12 items-center justify-center
              rounded-full
              bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800
              text-white
              shadow-[0_8px_25px_rgba(37,99,235,0.35)]
              transition-all duration-300
              hover:scale-110
              hover:from-blue-500
              hover:via-blue-600
              hover:to-indigo-700
              hover:shadow-[0_10px_30px_rgba(37,99,235,0.5)]
              sm:bottom-24 sm:right-6
            "
          >
            {/* Pulse Ring */}
            <span
              className="
                absolute inset-0
                rounded-full
                bg-blue-500
                opacity-30
                animate-ping
              "
            />

            {/* WhatsApp Icon */}
            <MessageCircle
              className="
                relative z-10
                h-6 w-6
                fill-white
                transition-transform duration-300
                group-hover:rotate-[-8deg]
              "
            />
          </a>
        </>
      )}
    </div>
  );
};

export default PackageLandingPage;