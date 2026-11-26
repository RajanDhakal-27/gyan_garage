import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-transparent bg-clip-padding font-heading text-base font-extrabold tracking-wide outline-none select-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-4 focus-visible:ring-[#7C3AED]/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton hover:-translate-y-1 hover:shadow-clayButtonHover active:translate-y-0 active:scale-[0.92] active:shadow-clayPressed",
        outline:
          "border-white/80 bg-white/70 text-[#332F3A] shadow-clayCard backdrop-blur-xl hover:-translate-y-1 hover:bg-white/90 active:translate-y-0 active:scale-[0.94] active:shadow-clayPressed",
        secondary:
          "bg-[#EFEBF5] text-[#332F3A] shadow-clayPressed hover:-translate-y-0.5 hover:bg-[#E9E3F5] active:scale-[0.95]",
        ghost:
          "text-[#635F69] hover:bg-[#EFEBF5] hover:text-[#332F3A] active:scale-[0.95]",
        destructive:
          "bg-gradient-to-br from-[#F472B6] to-[#DB2777] text-white shadow-[0_8px_18px_rgba(219,39,119,0.3),inset_-2px_-2px_6px_rgba(131,24,67,0.35),inset_2px_2px_6px_rgba(255,255,255,0.4)] hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(219,39,119,0.38),inset_-2px_-2px_6px_rgba(131,24,67,0.28),inset_2px_2px_8px_rgba(255,255,255,0.5)] active:translate-y-0 active:scale-[0.92] active:shadow-clayPressed",
        link: "text-[#7C3AED] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 gap-2.5 px-7 text-base",
        xs: "h-11 gap-1.5 px-3.5 text-xs",
        sm: "h-11 gap-2 px-4 text-sm",
        lg: "h-16 gap-3 px-9 text-lg",
        icon: "size-14",
        "icon-xs": "size-11 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-12 [&_svg:not([class*='size-'])]:size-5",
        "icon-lg": "size-16 [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
