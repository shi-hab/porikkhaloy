import { useGetSinglePackageQuery, useGetModelTestsByPkgIdQuery } from "@/features/packages/packagesApi";
import { useParams } from "react-router-dom";
import { PackageDetails } from "../../components/molecules/packages/PackageDetails";
// import { SubscriptionCard } from "../../components/molecules/packages/SubscriptionCard";
import { DecodeURL } from "@/exams/components/atoms/urlHashCode/DecodeURL";
import { useEffect } from "react";
import PackageLandingPage from "./landing/PackageLandingPage";

export default function PackageDetailsPage() {
  const { id } = useParams();
  const packageId = DecodeURL(id);
  const { data: singlePackage, isLoading: PackageIsLoading } = useGetSinglePackageQuery(packageId);
  const { data: mtUnderPkg, isLoading: ModelTestIsLoading } = useGetModelTestsByPkgIdQuery(packageId);

  const { is_subscribed, discount_type, discount, price, } = singlePackage?.data ?? {};


  const discountedPrice =
    discount && discount_type === "percentage"
      ? price - price * (discount / 100)
      : discount && discount_type === "amount"
        ? price - discount
        : price;


  // Google Analytics 4 (GA4) event tracking for viewing a package
  useEffect(() => {

    if (!singlePackage?.data) return;

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "view_item",

      ecommerce: {
        currency: "BDT",

        value: Number(discountedPrice),

        items: [
          {
            item_id: singlePackage.data.id,
            item_name: singlePackage.data.name,
            item_category: "Exam Package visit",
            price: Number(discountedPrice),
            quantity: 1,
          },
        ],
      },
    });

  }, [singlePackage]);

  return (
    <div className="mx-auto px-2 pt-4 w-full max-w-7xl">
      <div className="md:col-span-8">
        {(is_subscribed || discountedPrice === 0) ? (
          <PackageDetails
            singlePackage={singlePackage?.data}
            packageId={packageId}
            loading={PackageIsLoading}
          />
        ) : (
          <PackageLandingPage
            pkg={singlePackage?.data}
            PackageIsLoading={PackageIsLoading}
            ModelTestIsLoading={ModelTestIsLoading}
            mtUnderPkg={mtUnderPkg}
          />
        )}


      </div>
    </div>
  );
}
