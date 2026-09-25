import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ease-[cubic-bezier(0.21,1.02,0.73,1)] cursor-pointer active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-700 text-white shadow-brand hover:bg-brand-600 hover:shadow-[0_18px_36px_-14px_rgb(0_168_168/0.55)]",
        primary: "bg-brand-700 text-white shadow-brand hover:bg-brand-600",
        accent: "bg-accent-500 text-white shadow-glow hover:bg-accent-600",
        ghost:
          "bg-white border border-line text-ink-soft hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/60",
        outline:
          "bg-white border border-line text-ink-soft hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-brand-50 hover:text-brand-700",
        soft: "bg-secondary text-secondary-foreground hover:bg-brand-50 hover:text-brand-700",
        destructive: "bg-destructive text-destructive-foreground shadow-brand hover:bg-rose-600",
        hero: "bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-brand hover:-translate-y-0.5 hover:[--tw-gradient-stops:var(--tw-gradient-from),#00898a_40%,var(--tw-gradient-to)] hover:shadow-[0_18px_36px_-14px_rgb(0_168_168/0.6)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "",
        sm: "px-3.5 py-2 text-[10px]",
        lg: "px-6 py-3.5 text-xs",
        icon: "h-10 w-10 px-0",
        pill: "rounded-full px-6",
        "pill-lg": "h-12 rounded-full px-8 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
