import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-3.5 font-heading text-xs font-extrabold tracking-wide whitespace-nowrap transition-all focus-visible:ring-4 focus-visible:ring-[#7C3AED]/25 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default:
          "border-white/30 bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-[0_4px_12px_rgba(124,58,237,0.28),inset_1px_1px_3px_rgba(255,255,255,0.35)] [a]:hover:brightness-105",
        secondary:
          "border-white/70 bg-[#EFEBF5] text-[#332F3A] shadow-clayPressed [a]:hover:bg-white/80",
        destructive:
          "border-[#DB2777]/25 bg-[#DB2777]/10 text-[#DB2777] [a]:hover:bg-[#DB2777]/15",
        outline:
          "border-white/80 bg-white/60 text-[#332F3A] shadow-clayCard backdrop-blur-md [a]:hover:bg-white/80",
        ghost: "border-transparent text-[#635F69] hover:bg-[#EFEBF5] hover:text-[#332F3A]",
        link: "border-transparent text-[#7C3AED] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
