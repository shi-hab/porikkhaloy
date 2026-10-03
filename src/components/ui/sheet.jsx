import { XIcon } from "lucide-react";
import * as SheetPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Sheet(props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // FIX: Radix sets data-state="open|closed", not a boolean data-open attr.
        // data-[state=...] is the correct selector — this is why animations weren't firing.
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "duration-700",
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "left",
  showCloseButton = true,
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50  flex flex-col gap-0 bg-popover bg-clip-padding text-sm text-popover-foreground",
          "border border-border/60 shadow-2xl shadow-black/10",
          // smooth spring-like easing instead of default linear duration-200
          "transition-transform ease-[cubic-bezier(0.32,0.72,0,1)] duration-700",

          // side positioning
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-[85vh] data-[side=bottom]:rounded-t-2xl data-[side=bottom]:border-t",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:max-h-[85vh] data-[side=top]:rounded-b-2xl data-[side=top]:border-b",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:rounded-r-2xl data-[side=left]:border-r data-[side=left]:sm:max-w-sm",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:rounded-l-2xl data-[side=right]:border-l data-[side=right]:sm:max-w-sm",

          // FIX: data-[state=...] instead of data-open/data-closed so enter/exit actually animate
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "data-[side=bottom]:data-[state=open]:slide-in-from-bottom-full data-[side=bottom]:data-[state=closed]:slide-out-to-bottom-full",
          "data-[side=top]:data-[state=open]:slide-in-from-top-full data-[side=top]:data-[state=closed]:slide-out-to-top-full",
          "data-[side=left]:data-[state=open]:slide-in-from-left-full data-[side=left]:data-[state=closed]:slide-out-to-left-full",
          "data-[side=right]:data-[state=open]:slide-in-from-right-full data-[side=right]:data-[state=closed]:slide-out-to-right-full",

          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button
              variant="secondary"
              size="icon-sm"
              className="
                absolute
                top-1/2
                -right-16
                -translate-y-1/2
                rounded-full
                bg-background
                border
                border-border
                shadow-xl
                hover:bg-muted
                hover:scale-105
                transition-all
                z-50
                p-1
                "
            >
              <XIcon className="size-5" />
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex shrink-0 flex-col gap-0.5 border-b border-border/60 p-4 pr-6",
        className
      )}
      {...props}
    />
  );
}

// NEW: dedicated scrollable body region so long content no longer overflows
// silently — header/footer stay pinned, only this area scrolls.
function SheetBody({ className, ...props }) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("flex-1 overflow-y-auto p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-2 border-t border-border/60 p-4",
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "cn-font-heading text-base font-regular text-foreground",
        className
      )}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};