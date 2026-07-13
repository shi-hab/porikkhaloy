import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

// Slower and more visible click animation
const styles = `
  @keyframes buttonClickRipple {
    0% {
      transform: scale(0.97);
      opacity: 1;
    }
    50% {
      transform: scale(1);
      opacity: 0.9;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes borderGlow {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
    }
  }

  .button-click {
    animation: buttonClickRipple 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600  active:scale-95 focus-visible:ring-blue-400",
        green: "bg-green-500 text-white hover:bg-green-600  active:scale-95 focus-visible:ring-green-400",
        outline: "bg-white text-gray-900 border-2 border-gray-300 active:scale-95 focus-visible:ring-gray-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1 text-xs",
        lg: "h-12 px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: { 
      variant: "default", 
      size: "default",
      fullWidth: false,
    },
  }
);

const Button = React.forwardRef(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    fullWidth = false,
    asChild = false, 
    children,
    ...props 
  }, ref) => {
    const [isClicked, setIsClicked] = React.useState(false);

    const handleClick = (e) => {
      setIsClicked(true);
      // Slower animation - 800ms duration
      setTimeout(() => setIsClicked(false), 800);
      props.onClick?.(e);
    };

    if (asChild) {
      const Comp = Slot;
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <>
        <style>{styles}</style>
        <button
          ref={ref}
          className={cn(
            buttonVariants({ variant, size, fullWidth }),
            isClicked && "button-click",
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {/* Hover border glow effect */}
          <span 
            className={cn(
              "absolute inset-0 rounded-lg pointer-events-none opacity-0 transition-opacity duration-300",
              "group-hover:opacity-100",
              variant === "default" && "hover:opacity-100 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
              variant === "green" && "hover:opacity-100 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]",
              variant === "outline" && "hover:opacity-100 hover:shadow-[0_0_20px_rgba(156,163,175,0.3)]"
            )}
            aria-hidden="true"
          />
          
          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {children}
          </span>
        </button>
      </>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };