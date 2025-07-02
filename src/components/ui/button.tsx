
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-poppins font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-accent-lime text-ink-obsidian hover:bg-accent-lime/90 focus-visible:ring-accent-lime",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-accent-lavender bg-background text-ink-obsidian hover:bg-accent-lavender/10 focus-visible:ring-accent-lavender",
        secondary:
          "border border-accent-lavender text-ink-obsidian hover:bg-accent-lavender/10 focus-visible:ring-accent-lavender",
        ghost: "hover:bg-accent-lavender/10 hover:text-ink-obsidian",
        link: "text-ink-obsidian underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-xl",
        sm: "h-9 rounded-md px-3 text-base",
        lg: "h-14 rounded-lg px-8 text-2xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
