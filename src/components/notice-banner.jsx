import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Link } from "react-router-dom";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

// const iconMap = {
//   warning: Bell,
//   success: CheckCircleIcon,
// };

const NoticeBanner = ({ label, variant, className }) => {
  // const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      {/* <Icon className="h-4 w-4 mr-2" /> */}
      {label}
      <Link
        target="_blank"
        to="https://www.facebook.com/looopsacademy?mibextid=ZbWKwL"
        className="underline ml-2"
      >
        Click Here
      </Link>
    </div>
  );
};

export default NoticeBanner;
